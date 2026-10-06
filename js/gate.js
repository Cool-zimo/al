/**
 * 登录门
 *
 * 设计前提：本站是纯静态页面，没有后端，做不了 OAuth 的 code 交换
 * （那需要 client_secret，一旦写进前端就等于公开）。
 * 所以采用 GitHub 官方推荐的 PAT 直连方式 —— 与 GitHub Drive 一致，
 * 验证通过后才允许进入应用，未登录看不到任何课程内容。
 *
 * 安全性：token 只写进 localStorage，从不外发；
 * 支持 Fine-grained token，用户可只授予单个私有仓库的 Contents 权限。
 */
const Gate = (() => {
  const $ = id => document.getElementById(id);
  let onSuccess = null;
  let started = false;      // startApp 是否已经跑过（重新登录不该再跑一遍）

  function fill() {
    const g = window.I18N.gate;
    $('g-token').placeholder = g.inputPlaceholder;
    $('g-submit').textContent = g.submit;
    $('g-toggle-text').textContent = g.toggleText;
    $('g-steps').innerHTML = g.steps.map(s => `<li>${s}</li>`).join('');
    $('g-note').innerHTML = g.note;
  }

  function err(msg) {
    const e = $('g-err');
    e.textContent = msg;
    e.classList.add('show');
  }

  function clearErr() { $('g-err').classList.remove('show'); }

  /** 校验 token：能读到 /user 就算登录成功 */
  async function verify(token) {
    const api = new GitHubAPI(token);
    const login = await api.getUsername();
    let avatar = '';
    try {
      const r = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
        cache: 'no-store'
      });
      if (r.ok) { const d = await r.json(); avatar = d.avatar_url || ''; }
    } catch (e) { /* 头像失败不影响登录 */ }
    return { login, avatar };
  }

  async function submit() {
    const token = $('g-token').value.trim();
    clearErr();
    if (!token) return err(window.I18N.gate.errEmpty);

    const btn = $('g-submit');
    btn.disabled = true;
    btn.textContent = window.I18N.gate.submitting;

    try {
      const info = await verify(token);
      Store.set(Store.K.TOKEN, token);
      Store.set(Store.K.OWNER, info.login);
      Store.set('avatar', info.avatar);
      enter(info);
    } catch (e) {
      btn.disabled = false;
      btn.textContent = window.I18N.gate.submit;
      const g = window.I18N.gate;
      if (e.status === 401) err(g.err401);
      else if (!navigator.onLine || e instanceof TypeError) err(g.errNetwork);
      else err(g.errOther + (e.message || ''));
    }
  }

  function paintUser(login, avatar) {
    if (login) $('username').textContent = login;
    if (avatar) { const a = $('avatar'); a.src = avatar; a.hidden = false; }
  }

  /** 收起登录门。不 remove —— token 失效时要能再弹出来 */
  function hideGate() {
    const g = $('gate');
    g.style.transition = 'opacity .28s';
    g.style.opacity = '0';
    setTimeout(() => g.classList.add('gate-gone'), 300);
    $('app').hidden = false;
  }

  /** 重新弹登录门（后台复核发现 token 失效时） */
  function showGate(msg) {
    const g = $('gate');
    if (!g) { location.reload(); return; }
    g.classList.remove('gate-gone');
    g.style.opacity = '1';
    $('g-submit').disabled = false;
    $('g-submit').textContent = window.I18N.gate.submit;
    if (msg) err(msg);
    setTimeout(() => $('g-token').focus(), 150);
  }

  /** 登录成功：收起登录门，启动应用 */
  function enter(info) {
    hideGate();
    paintUser(info?.login, info?.avatar);
    if (onSuccess && !started) { started = true; onSuccess(info); }
  }

  /* ---------- 后台复核 ----------
   * 有本地 token 时先放人进去，再悄悄验一次。
   * 之前是"验过才准进"，每次刷新都卡在登录页等 GitHub 往返（还发两次请求），
   * 目标页面要等这一轮网络才出现 —— 明明本地有 token，白等。
   */
  async function reverify(token, tries = 0) {
    try {
      const info = await verify(token);
      Store.set(Store.K.OWNER, info.login);
      Store.set('avatar', info.avatar);
      paintUser(info.login, info.avatar);
      hideOfflineBanner();
      return true;
    } catch (e) {
      const st = e && e.status;
      if (st === 401 || st === 403) {
        // 真的失效了：清掉，退回登录
        Store.del(Store.K.TOKEN);
        Store.del(Store.K.OWNER);
        showGate(window.I18N.gate.err401);
        return false;
      }
      // 网络问题不算 token 失效 —— 不踢人，给个可重试的提示条
      if (tries < 1) {
        await new Promise(r => setTimeout(r, 1200));
        return reverify(token, tries + 1);
      }
      showOfflineBanner();
      return false;
    }
  }

  function showOfflineBanner() {
    if (document.getElementById('offline-banner')) return;
    const b = document.createElement('div');
    b.id = 'offline-banner';
    b.className = 'offline-banner';
    b.innerHTML = `<span>⚠️ ${window.I18N.gate.offlineHint}</span>` +
      `<button type="button" id="offline-retry">${window.I18N.gate.retry}</button>`;
    document.body.appendChild(b);
    $('offline-retry').onclick = () => {
      b.remove();
      reverify(Store.get(Store.K.TOKEN, ''));
    };
  }
  function hideOfflineBanner() {
    const b = document.getElementById('offline-banner');
    if (b) b.remove();
  }

  function init(successCb) {
    onSuccess = successCb;
    fill();

    $('g-submit').onclick = submit;
    $('g-token').addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });

    const toggle = $('g-toggle');
    const more = $('g-more');
    toggle.onclick = () => {
      const open = more.hidden;
      more.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
    };

    // 已有 token：立刻进应用，验证放后台。
    // 用户名/头像先用本地缓存的，验回来再刷新 —— 界面不用等网络。
    const saved = Store.get(Store.K.TOKEN, '');
    if (saved) {
      enter({ login: Store.get(Store.K.OWNER, ''), avatar: Store.get('avatar', '') });
      reverify(saved);
    } else {
      // 首次进入自动聚焦输入框
      setTimeout(() => $('g-token').focus(), 120);
    }
  }

  function logout() {
    Store.del(Store.K.TOKEN);
    Store.del(Store.K.OWNER);
    Store.del('avatar');
    location.reload();
  }

  return { init, logout, enter };
})();
