/**
 * 第三方书籍书架
 *
 * 三件事，分开说清楚：
 *
 * 一、记书名（跨设备，很小）
 *   用户点开过哪些第三方书，记到 config（用户自己的私有仓库）里。
 *   只存仓库名和书名，不存内容 —— 换台设备登录后还能看到"我读过这些"。
 *
 * 二、按章缓存（临时，用完就扔）
 *   看第 1 章就只下第 1 章那 6 个文件（5 课 + 章测），不整本下。
 *   一本 30 课的书，读者往往只看前几章，整本下是浪费。
 *
 * 三、缓存放哪儿，用户说了算
 *   默认只放 sessionStorage —— 标签页一关自动清空，不占用户磁盘。
 *   想要离线可读就在设置里打开"存到浏览器本地"，那时才写 IndexedDB。
 *
 * 为什么默认不持久化：
 *   第三方书是别人的仓库，随时可能更新甚至删除。
 *   默认留一份永久副本既占空间又容易读到过期内容，临时缓存更合适。
 */
const Shelf = (() => {
  const DB_NAME = 'anylearn-books';
  const DB_VER = 1;
  const STORE = 'chapters';

  /** 最多缓存多少章。一章约 6 个文件，10 章 ≈ 60 个文件，够用了。 */
  const MAX_CHAPTERS = 10;
  /** 缓存总量上限（字符数，粗估）。超了就从最久未用的开始删。 */
  const MAX_CHARS = 3_000_000;

  const SS_KEY = 'pytut:shelf';
  const K_PERSIST = 'pytut:shelfPersist';

  /* ================= 设置 ================= */

  /** 是否把缓存写到 IndexedDB（持久化）。默认否 —— 标签页关了就清。 */
  function persistent() {
    try { return localStorage.getItem(K_PERSIST) === '1'; } catch (e) { return false; }
  }
  function setPersistent(v) {
    try { localStorage.setItem(K_PERSIST, v ? '1' : '0'); } catch (e) {}
    if (!v) { clearIDB(); }
  }

  /* ================= 记忆：看过的书 ================= */

  function _mem() {
    try { return JSON.parse(sessionStorage.getItem(SS_KEY) || '{}'); }
    catch (e) { return {}; }
  }
  function _memSave(o) {
    try { sessionStorage.setItem(SS_KEY, JSON.stringify(o)); } catch (e) {}
  }

  /**
   * 记录一本看过的书。
   * 存到 Store（会被 ConfigSync 推到用户的私有仓库），换设备能恢复。
   */
  function record(entry) {
    const cur = Store.get(Store.K.SHELF, {}) || {};
    cur[entry.repo] = {
      id: entry.id,
      repo: entry.repo,
      branch: entry.branch,
      title: entry.title,
      stage: entry.stage || 'other',
      level: entry.level || '',
      langs: entry.langs || ['zh'],
      author: entry.author || {},
      url: entry.url,
      at: Date.now(),
    };
    Store.set(Store.K.SHELF, cur);
    return cur;
  }

  /** 看过的书（来自 config，跨设备） */
  function list() {
    return Store.get(Store.K.SHELF, {}) || {};
  }

  function forget(repo) {
    const cur = Store.get(Store.K.SHELF, {}) || {};
    delete cur[repo];
    Store.set(Store.K.SHELF, cur);
    dropBook(repo);
  }

  /* ================= 章节缓存 ================= */

  const ck = (repo, branch, lang, ci) => `${repo}@${branch}/${lang}/ch${ci}`;

  /** 未命中缓存时用来算"最久未用" —— 每次读都更新 */
  function _touch(o, k) {
    if (o[k]) o[k].used = Date.now();
  }

  function _fromSession(repo, branch, lang, ci) {
    const o = _mem();
    const v = o[ck(repo, branch, lang, ci)];
    if (v) { _touch(o, ck(repo, branch, lang, ci)); _memSave(o); }
    return v ? v.files : null;
  }

  function _toSession(repo, branch, lang, ci, files) {
    const o = _mem();
    o[ck(repo, branch, lang, ci)] = { files, used: Date.now(), at: Date.now() };
    _memSave(o);
    _evict(o);
  }

  /** 超量就从最久未用的章开始删 */
  function _evict(o) {
    const ks = Object.keys(o);
    if (ks.length <= MAX_CHAPTERS) {
      // 条目没超，再看总字节
      let total = 0;
      for (const k of ks) total += JSON.stringify(o[k].files || {}).length;
      if (total <= MAX_CHARS) return;
    }
    const sorted = ks.sort((a, b) => (o[a].used || 0) - (o[b].used || 0));
    let removed = 0;
    for (const k of sorted) {
      if (Object.keys(o).length <= MAX_CHAPTERS) break;
      delete o[k]; removed++;
    }
    // 还是太大就继续删最旧的
    let total = 0;
    for (const k of Object.keys(o)) total += JSON.stringify(o[k].files || {}).length;
    while (total > MAX_CHARS && Object.keys(o).length > 1) {
      const oldest = Object.keys(o).sort((a, b) => (o[a].used || 0) - (o[b].used || 0))[0];
      total -= JSON.stringify(o[oldest].files || {}).length;
      delete o[oldest]; removed++;
    }
    if (removed) _memSave(o);
  }

  /* ---- IndexedDB（仅在开启持久化时用） ---- */

  let _db = null;
  function openDB() {
    if (_db) return Promise.resolve(_db);
    return new Promise((res, rej) => {
      const rq = indexedDB.open(DB_NAME, DB_VER);
      rq.onupgradeneeded = () => {
        const db = rq.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      };
      rq.onsuccess = () => { _db = rq.result; res(_db); };
      rq.onerror = () => rej(rq.error);
    });
  }
  function idbOp(mode, fn) {
    return openDB().then(db => new Promise((res, rej) => {
      const tx = db.transaction(STORE, mode);
      const st = tx.objectStore(STORE);
      const out = fn(st);
      tx.oncomplete = () => res(out && out.__rq ? out.__rq.result : out);
      tx.onerror = () => rej(tx.error);
    }));
  }
  async function idbGet(k) {
    if (!persistent()) return null;
    try { return await idbOp('readonly', st => ({ __rq: st.get(k) })); }
    catch (e) { return null; }
  }
  async function idbPut(k, v) {
    if (!persistent()) return;
    try { await idbOp('readwrite', st => { st.put(v, k); return {}; }); } catch (e) {}
  }
  async function clearIDB() {
    try { await idbOp('readwrite', st => { st.clear(); return {}; }); } catch (e) {}
  }
  function dropBook(repo) {
    const o = _mem();
    let n = 0;
    for (const k of Object.keys(o)) {
      if (k.startsWith(repo + '@')) { delete o[k]; n++; }
    }
    if (n) _memSave(o);
  }

  /* ================= 下载 ================= */

  /**
   * 确保某一章的文件都在缓存里；缺哪个下哪个。
   * @param paths 这一章要的文件路径，形如 ['lessons/01.md', ...]（相对 content/<lang>/）
   */
  async function ensureChapter(api, entry, lang, chapterIdx, paths) {
    const { repo, branch } = entry;
    const cached = _fromSession(repo, branch, lang, chapterIdx)
                || await idbGet(ck(repo, branch, lang, chapterIdx));

    if (cached) {
      const missing = paths.filter(p => !(p in cached));
      if (!missing.length) return { ok: true, fromCache: true };
      const got = await api.getManyFiles(entry.owner, entry.name,
        missing.map(p => `content/${lang}/${p}`), branch);
      for (const p of missing) {
        const f = got[`content/${lang}/${p}`];
        if (f) cached[p] = f.text;
      }
      _toSession(repo, branch, lang, chapterIdx, cached);
      if (persistent()) await idbPut(ck(repo, branch, lang, chapterIdx), cached);
      return { ok: true, fromCache: false, updated: missing.length };
    }

    const got = await api.getManyFiles(entry.owner, entry.name,
      paths.map(p => `content/${lang}/${p}`), branch);
    const files = {};
    for (const p of paths) {
      const f = got[`content/${lang}/${p}`];
      if (f) files[p] = f.text;
    }
    if (!Object.keys(files).length) {
      return { ok: false, error: '这一章的文件都没读到' };
    }
    _toSession(repo, branch, lang, chapterIdx, files);
    if (persistent()) await idbPut(ck(repo, branch, lang, chapterIdx), files);
    return { ok: true, fromCache: false, files: Object.keys(files).length };
  }

  /** 读单个文件：先查本机的章节缓存，没有才现拉 */
  async function readFile(api, entry, lang, relPath, chapterIdx) {
    if (chapterIdx != null) {
      const cached = _fromSession(entry.repo, entry.branch, lang, chapterIdx)
                  || await idbGet(ck(entry.repo, entry.branch, lang, chapterIdx));
      if (cached && relPath in cached) return cached[relPath];
    }
    if (!api) return null;
    try {
      const f = await api.getFileContents(entry.owner, entry.name,
        `content/${lang}/${relPath}`, entry.branch);
      return f ? f.content : null;
    } catch (e) { return null; }
  }

  /* ================= 发现 ================= */

  /**
   * 用登录用户的 token 搜符合格式的仓库。
   * 登录额度 5000 次/小时，未认证只有 60 次 —— 所以这条路必须登录后走。
   */
  async function discover(api) {
    if (!api) return [];
    let items = [];
    try {
      items = await api.searchRepositories('topic:al-book', { perPage: 100 });
    } catch (e) {
      return [];
    }
    const out = [];
    for (const r of items) {
      const [owner, name] = r.full_name.split('/');
      const branch = r.default_branch || 'main';
      let meta = null;
      try {
        const f = await api.getFileContents(owner, name, 'albook.json', branch);
        if (!f) continue;
        meta = JSON.parse(f.content);
      } catch (e) { continue; }
      if (String(meta?.format || '').trim() !== 'al-book') continue;
      out.push({
        id: String(meta.id || name.replace(/^al-book-/, '')).trim(),
        repo: r.full_name, owner, name, branch,
        url: r.html_url,
        title: meta.title || name,
        subtitle: meta.subtitle || '',
        desc: meta.desc || '',
        stage: meta.stage || 'other',
        level: meta.level || '',
        langs: Array.isArray(meta.langs) && meta.langs.length ? meta.langs : ['zh'],
        tags: meta.tags || [],
        license: meta.license || '',
        author: meta.author || {},
        stars: r.stargazers_count || 0,
      });
    }
    return out;
  }

  /** 已知仓库名，直接取一本书的信息（不用搜索） */
  async function fetchEntry(api, fullName) {
    const [owner, name] = fullName.split('/');
    const r = await api.getRepository(owner, name);
    const branch = r.default_branch || 'main';
    const f = await api.getFileContents(owner, name, 'albook.json', branch);
    if (!f) throw new Error('这个仓库根目录没有 albook.json');
    const meta = JSON.parse(f.content);
    if (String(meta?.format || '').trim() !== 'al-book') {
      throw new Error('format 字段不是 al-book，不是 AnyLearn 书籍');
    }
    return {
      id: String(meta.id || name.replace(/^al-book-/, '')).trim(),
      repo: r.full_name, owner, name, branch,
      url: r.html_url,
      title: meta.title || name,
      subtitle: meta.subtitle || '',
      desc: meta.desc || '',
      stage: meta.stage || 'other',
      level: meta.level || '',
      langs: Array.isArray(meta.langs) && meta.langs.length ? meta.langs : ['zh'],
      tags: meta.tags || [],
      license: meta.license || '',
      author: meta.author || {},
      stars: r.stargazers_count || 0,
    };
  }

  /* ================= 标题缓存 =================
   * 目录要显示每一课的标题，但为此把整本书下下来太浪费。
   * 标题只有几十字节，单独缓存一份，30 课也就几 KB，可以常驻。
   */
  function _titles() {
    try { return JSON.parse(sessionStorage.getItem(SS_KEY + ':titles') || '{}'); }
    catch (e) { return {}; }
  }
  function getTitles(repo, lang) {
    return _titles()[`${repo}/${lang}`] || null;
  }
  function saveTitles(repo, lang, map) {
    try {
      const o = _titles();
      o[`${repo}/${lang}`] = map;
      sessionStorage.setItem(SS_KEY + ':titles', JSON.stringify(o));
    } catch (e) {}
  }

  /* ================= 统计（设置页显示用） ================= */
  function usage() {
    const o = _mem();
    let chars = 0;
    for (const k of Object.keys(o)) chars += JSON.stringify(o[k].files || {}).length;
    return { chapters: Object.keys(o).length, chars, persistent: persistent(), max: MAX_CHAPTERS };
  }

  function clearAll() {
    try { sessionStorage.removeItem(SS_KEY); } catch (e) {}
    clearIDB();
  }

  return {
    discover, fetchEntry, record, list, forget,
    getTitles, saveTitles,
    ensureChapter, readFile,
    persistent, setPersistent, usage, clearAll, clearIDB,
  };
})();
