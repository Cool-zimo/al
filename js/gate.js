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
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' }
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

  /** 登录成功：收起登录门，启动应用 */
  function enter(info) {
    $('gate').style.transition = 'opacity .3s';
    $('gate').style.opacity = '0';
    setTimeout(() => { $('gate').remove(); }, 300);
    $('app').hidden = false;

    if (info?.login) {
      $('username').textContent = info.login;
      if (info.avatar) {
        const a = $('avatar');
        a.src = info.avatar;
        a.hidden = false;
      }
    }
    if (onSuccess) onSuccess(info);
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

    // 已有 token：静默验证，通过直接进
    const saved = Store.get(Store.K.TOKEN, '');
    if (saved) {
      $('g-submit').disabled = true;
      $('g-submit').textContent = window.I18N.gate.submitting;
      verify(saved)
        .then(info => {
          Store.set('avatar', info.avatar);
          enter(info);
        })
        .catch(() => {
          Store.del(Store.K.TOKEN);
          Store.del(Store.K.OWNER);
          $('g-submit').disabled = false;
          $('g-submit').textContent = window.I18N.gate.submit;
        });
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
