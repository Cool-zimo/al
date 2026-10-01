/**
 * GitHub 内容取源：多源自动回退
 *
 * 为什么需要这个：
 *   raw.githubusercontent.com 在国内经常连不上（不是慢，是超时）。
 *   但 jsDelivr 有缓存延迟，刚推送的内容要等一会儿才拿得到。
 *   GitHub API 最快最准，但要登录、有 5000 次/小时额度。
 *
 *   没有任何一个源在所有情况下都最好，所以做法是按优先级试，
 *   并记住上次成功的那个源，下次直接用 —— 探测只发生在第一次和源失效时。
 *
 * 优先级：
 *   1. 用户手动指定的源（设置里选）
 *   2. 上次成功过的源（localStorage 记着）
 *   3. 登录了 → GitHub API（0.5s，最稳，且内容实时）
 *      没登录 → jsDelivr CDN（免登录，国内可达）
 *   4. 再不行依次试 raw、用户自定义镜像
 *
 * 每个源都带超时。与其让用户等一个连不上的源等 30 秒，
 * 不如 4 秒放弃换下一个。
 */
const GhSrc = (() => {

  const KEY_PREF = 'pytut:srcPref';   // 用户指定的源 id
  const KEY_OK = 'pytut:srcOk';       // 上次成功的源 id

  /** 单个源的超时。连不上就赶紧换下一个，别耗着。 */
  const TIMEOUT = 5000;

  let _api = null;   // GitHubAPI 实例，登录后由外部注入

  /**
   * 各源把 (owner, repo, ref, path) 变成一个 URL。
   * api 特殊：走 GitHubAPI，返回已解码的文本。
   */
  const SOURCES = {
    jsdelivr: {
      label: 'jsDelivr CDN',
      desc: '免登录，国内可达；有缓存，刚推送的内容可能要等几分钟',
      url: (o, r, ref, p) => `https://cdn.jsdelivr.net/gh/${o}/${r}@${ref}/${p}`,
    },
    raw: {
      label: 'raw.githubusercontent.com',
      desc: '官方源，内容实时；国内常常连不上',
      url: (o, r, ref, p) => `https://raw.githubusercontent.com/${o}/${r}/${ref}/${p}`,
    },
    api: {
      label: 'GitHub API（需登录）',
      desc: '最快最稳，内容实时，用你的登录额度',
      needsAuth: true,
      url: null,   // 走 _api.getFileContents
    },
  };

  /** 用户自定义镜像：存的是前缀，拼上完整 raw 路径 */
  let _customPrefix = '';
  try { _customPrefix = localStorage.getItem('pytut:srcCustom') || ''; } catch (e) {}

  if (_customPrefix) {
    SOURCES.custom = {
      label: '自定义镜像',
      desc: _customPrefix,
      url: (o, r, ref, p) => _customPrefix.replace(/\/$/, '') + `/${o}/${r}/${ref}/${p}`,
    };
  }

  function setApi(api) { _api = api; }

  /** 用户手选的源；传 '' 表示回到自动 */
  function setPreferred(id) {
    try {
      if (id) localStorage.setItem(KEY_PREF, id);
      else localStorage.removeItem(KEY_PREF);
    } catch (e) {}
  }
  function preferred() {
    try { return localStorage.getItem(KEY_PREF) || ''; } catch (e) { return ''; }
  }
  function lastOk() {
    try { return localStorage.getItem(KEY_OK) || ''; } catch (e) { return ''; }
  }
  function _markOk(id) {
    try { localStorage.setItem(KEY_OK, id); } catch (e) {}
  }

  /** 按当前状态排出尝试顺序 */
  function order() {
    const ids = [];
    const p = preferred();
    if (p && SOURCES[p]) ids.push(p);
    const ok = lastOk();
    if (ok && SOURCES[ok] && !ids.includes(ok)) ids.push(ok);
    // 登录了优先 API，没登录优先 CDN
    const rest = _api ? ['api', 'jsdelivr', 'raw'] : ['jsdelivr', 'raw', 'api'];
    for (const id of rest) if (!ids.includes(id) && SOURCES[id]) ids.push(id);
    if (SOURCES.custom && !ids.includes('custom')) ids.push('custom');
    return ids.filter(id => !SOURCES[id].needsAuth || _api);
  }

  async function _fetchWithTimeout(url, ms) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), ms);
    try {
      const r = await fetch(url, { signal: ctl.signal, cache: 'no-store' });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return await r.text();
    } finally {
      clearTimeout(timer);
    }
  }

  /** 用某个源取一个文件 */
  async function _one(id, o, r, ref, p) {
    const s = SOURCES[id];
    if (!s) throw new Error('未知源 ' + id);
    if (s.needsAuth) {
      if (!_api) throw new Error('未登录');
      const f = await _api.getFileContents(o, r, p, ref);
      if (!f) throw new Error('404');
      return f.content;
    }
    return _fetchWithTimeout(s.url(o, r, ref, p), TIMEOUT);
  }

  /** 取单个文件，自动选源 */
  async function text(o, r, ref, p) {
    const ids = order();
    let lastErr = null;
    for (const id of ids) {
      try {
        const t = await _one(id, o, r, ref, p);
        _markOk(id);
        return t;
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr || new Error('所有源都取不到');
  }

  /**
   * 批量取文件。
   *
   * 先用第一个文件探测出可用源，再并发下其余 ——
   * 每个文件都从头试一遍源的话，30 个文件可能要试 90 次，太慢。
   * 中途失败的会在最后用下一个源重试一次。
   */
  async function many(o, r, ref, paths, concurrency = 8) {
    if (!paths.length) return {};
    const ids = order();
    const out = {};
    let err = null;

    for (const id of ids) {
      const missing = paths.filter(p => !(p in out));
      if (!missing.length) break;

      // 探测
      try {
        out[missing[0]] = await _one(id, o, r, ref, missing[0]);
      } catch (e) {
        err = e;
        continue;   // 这个源不行，换下一个
      }
      _markOk(id);

      // 并发下其余
      let i = 1;
      async function worker() {
        while (i < missing.length) {
          const p = missing[i++];
          try { out[p] = await _one(id, o, r, ref, p); }
          catch (e) { /* 漏掉的下一轮源补 */ }
        }
      }
      const ws = [];
      for (let n = 0; n < Math.min(concurrency, Math.max(1, missing.length - 1)); n++) ws.push(worker());
      await Promise.all(ws);
    }

    return out;
  }

  /** 设置页用：列出可选源 */
  function list() {
    return Object.entries(SOURCES).map(([id, s]) => ({
      id, label: s.label, desc: s.desc,
      usable: !s.needsAuth || !!_api,
    }));
  }

  /** 测某个源通不通（设置页"试一下"按钮用） */
  async function probe(id, o = 'Cool-zimo', r = 'al-book-office-automation', ref = 'main') {
    const t0 = performance.now();
    try {
      await _one(id, o, r, ref, 'albook.json');
      return { ok: true, ms: Math.round(performance.now() - t0) };
    } catch (e) {
      return { ok: false, ms: Math.round(performance.now() - t0), error: e.message || String(e) };
    }
  }

  function setCustom(prefix) {
    _customPrefix = (prefix || '').trim();
    try {
      if (_customPrefix) localStorage.setItem('pytut:srcCustom', _customPrefix);
      else localStorage.removeItem('pytut:srcCustom');
    } catch (e) {}
    if (_customPrefix) {
      SOURCES.custom = {
        label: '自定义镜像',
        desc: _customPrefix,
        url: (o, r, ref, p) => _customPrefix.replace(/\/$/, '') + `/${o}/${r}/${ref}/${p}`,
      };
    } else {
      delete SOURCES.custom;
    }
  }
  function custom() { return _customPrefix; }

  return { text, many, setApi, list, probe, preferred, setPreferred, lastOk, setCustom, custom, SOURCES };
})();
