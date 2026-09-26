/**
 * AnyLearn 主应用
 * 路由：  #/                      书单首页
 *        #/book/{bookId}/{lessonId}
 *        #/book/{bookId}/test/{testId}
 *        #/review                 今日复习
 */
(() => {
  const $ = id => document.getElementById(id);
  const T = () => window.I18N;
  const CFG = window.AL_CONFIG;
  const CONTENT = CFG.content;

  let BOOKS = [];
  let TOC = [];
  let flat = [];
  let book = null;
  let current = null;
  let sync = null, api = null;
  let isTestMode = false;

  const keyOf = (b, l) => `${b}/${l}`;

  /* ================= 工具 ================= */
  function toast(msg, ms = 2600) {
    const t = $('toast');
    if (!t) return;
    t.textContent = msg; t.hidden = false;
    clearTimeout(t._timer);
    t._timer = setTimeout(() => { t.hidden = true; }, ms);
  }
  window.__toast = toast;

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  async function fetchJSON(url) {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + url);
    return r.json();
  }
  async function fetchText(url) {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.text();
  }

  /* ================= 笔记面板显隐 ================= */
  /** 只有课文页/大测验页才需要笔记；首页、复习页整个收起面板 */
  function setNotesVisible(on) {
    document.body.classList.toggle('no-notes', !on);
  }

  /* ================= 书单首页 ================= */
  async function renderHome() {
    book = null; current = null;
    closeSidebar();
    setNotesVisible(false);
    Notes.reset(T().notes.noLesson || '');
    $('toc').innerHTML = `<div class="toc-chapter">${T().toc.all}</div>` +
      `<button class="toc-item" data-go-review><span class="n">🔁</span><span class="t">${T().toc.review}</span></button>`;
    $('toc').querySelector('[data-go-review]').onclick = () => { location.hash = '#/review'; };

    const art = $('lesson');
    const st = Review.stats();
    const progress = Store.get(Store.K.PROGRESS, {}) || {};
    const doneCount = Object.keys(progress).length;
    const H = T().home;

    const groups = {};
    BOOKS.forEach(b => { (groups[b.stage] = groups[b.stage] || []).push(b); });

    let html = `
      <div class="home-hero">
        <h1>${escapeHtml(H.title)}</h1>
        <p class="home-sub">${escapeHtml(H.sub)}</p>
        <div class="home-stats">
          <div class="stat"><b>${doneCount}</b><span>${H.statDone}</span></div>
          <div class="stat"><b>${st.due}</b><span>${H.statDue}</span></div>
          <div class="stat"><b>${st.inProgress}</b><span>${H.statMem}</span></div>
        </div>
      </div>`;

    for (const [stage, list] of Object.entries(groups)) {
      html += `<h2 class="home-stage">${escapeHtml(stage)}</h2><div class="book-grid">`;
      for (const b of list) {
        html += `
          <a class="book-card${b.ready ? '' : ' locked'}" href="#/book/${b.id}">
            <div class="book-level">${escapeHtml(b.level)}</div>
            <div class="book-title">${escapeHtml(b.title)}</div>
            <div class="book-sub">${escapeHtml(b.subtitle)}</div>
            <div class="book-desc">${escapeHtml(b.desc)}</div>
            <div class="book-foot">${b.ready ? H.start : H.building}</div>
          </a>`;
      }
      html += `</div>`;
    }
    art.innerHTML = html;
    $('lesson-nav').innerHTML = '';
    $('progress-label').textContent = `${doneCount} ${H.statDone}`;
    $('progress-fill').style.width = '0%';
    document.title = `${T().brand} · ${T().brandSub}`;
  }

  /* ================= 目录 ================= */
  async function loadTOC(bookId) {
    TOC = await fetchJSON(`${CONTENT}/books/${bookId}/toc.json`);
    flat = [];
    for (const ch of TOC) for (const it of ch.items) flat.push({ ...it, chapter: ch.title });
  }

  function renderTOC() {
    const nav = $('toc');
    nav.innerHTML = '';
    const progress = Store.get(Store.K.PROGRESS, {}) || {};
    let done = 0;

    const home = document.createElement('button');
    home.className = 'toc-item';
    home.innerHTML = `<span class="n">🏠</span><span class="t">${T().toc.all}</span>`;
    home.onclick = () => { location.hash = '#/'; };
    nav.appendChild(home);

    const dueN = Review.dueList().length;
    const rev = document.createElement('button');
    rev.className = 'toc-item' + (location.hash.startsWith('#/review') ? ' active' : '');
    rev.innerHTML = `<span class="n">🔁</span><span class="t">${T().toc.review}</span>` +
      (dueN ? `<span class="tick">${dueN}</span>` : '');
    rev.onclick = () => { location.hash = '#/review'; closeSidebar(); };
    nav.appendChild(rev);

    TOC.forEach(ch => {
      const h = document.createElement('div');
      h.className = 'toc-chapter';
      h.textContent = ch.title;
      nav.appendChild(h);

      ch.items.forEach(it => {
        const k = keyOf(book.id, it.id);
        const isDone = !!progress[k]?.done;
        if (isDone) done++;
        const b = document.createElement('button');
        b.className = 'toc-item' + (!isTestMode && current?.id === it.id ? ' active' : '');
        b.innerHTML = `<span class="n">${it.id}</span><span class="t">${escapeHtml(it.title)}</span>` +
          (isDone ? '<span class="tick">✅</span>' : '');
        b.onclick = () => { location.hash = `#/book/${book.id}/${it.id}`; closeSidebar(); };
        nav.appendChild(b);
      });

      if (ch.test) {
        const b = document.createElement('button');
        b.className = 'toc-item toc-test' + (isTestMode && current?.id === ch.test ? ' active' : '');
        b.innerHTML = `<span class="n">📝</span><span class="t">${T().toc.chapterTest}</span>`;
        b.onclick = () => { location.hash = `#/book/${book.id}/test/${ch.test}`; closeSidebar(); };
        nav.appendChild(b);
      }
    });

    const pct = flat.length ? Math.round(done / flat.length * 100) : 0;
    $('progress-fill').style.width = pct + '%';
    $('progress-label').textContent = `${done} / ${flat.length} · ${pct}%`;
  }

  /* ================= 课文 ================= */
  async function renderLesson(bookId, lessonId) {
    isTestMode = false;
    const item = flat.find(x => String(x.id) === String(lessonId));
    if (!item) { location.hash = '#/'; return; }
    current = item;
    Store.set(Store.K.LAST_POS, { bookId, lessonId });
    renderTOC();

    const art = $('lesson');
    art.innerHTML = `<div class="loading">${T().loading || '加载中…'}</div>`;
    setNotesVisible(true);
    // 先清空笔记面板：切章瞬间就不能再显示上一节的笔记
    Notes.reset();

    let md;
    try {
      md = await fetchText(`${CONTENT}/books/${bookId}/lessons/${lessonId}.md`);
    } catch (e) {
      art.innerHTML = `<h1>${T().loadFailTitle || '加载失败'}</h1><p><code>${escapeHtml(lessonId)}.md</code></p>`;
      return;
    }

    paint(art, md, keyOf(bookId, lessonId));
    art.appendChild(buildDoneBar(item));
    renderNav(item);
    Notes.load(keyOf(bookId, lessonId), item.title);
    document.title = `${item.title} · ${book.title}`;
    window.scrollTo({ top: 0 });
  }

  function paint(art, md, ctxKey) {
    const { html, blocks, quizzes } = MD.renderLesson(md);
    art.innerHTML = html;

    art.querySelectorAll('[data-codeblock]').forEach(holder => {
      const idx = +holder.getAttribute('data-codeblock');
      const blk = blocks[idx];
      if (!blk) { holder.remove(); return; }
      if (blk.lang === 'python' || blk.lang === 'py') {
        holder.replaceWith(CodeBlock.create(blk.code, ctxKey));
      } else {
        const pre = document.createElement('div');
        pre.className = 'codeblock';
        pre.innerHTML = `<div class="codeblock-head"><span class="lang">${escapeHtml(blk.lang)}</span></div>` +
          `<pre><code>${escapeHtml(blk.code)}</code></pre>`;
        holder.replaceWith(pre);
      }
    });

    quizzes.forEach((text, i) => {
      const q = MD.parseQuizText(text);
      const box = Quiz.render(q, i, { key: ctxKey });
      const holder = art.querySelector(`[data-quiz="${i}"]`);
      if (holder) holder.replaceWith(box);
      else art.appendChild(box);
    });

    return quizzes.length;
  }

  /* ================= 章末大测验 ================= */
  async function renderTest(bookId, testId) {
    isTestMode = true;
    const ch = TOC.find(c => c.test === testId);
    current = { id: testId, title: (ch ? ch.title.replace(/^第\s*\d+\s*章\s*·\s*/, '') : '') };
    renderTOC();

    const art = $('lesson');
    art.innerHTML = `<div class="loading">…</div>`;
    setNotesVisible(true);
    Notes.reset();

    let md;
    try {
      md = await fetchText(`${CONTENT}/books/${bookId}/lessons/${testId}.md`);
    } catch (e) {
      art.innerHTML = `<h1>${T().loadFailTitle || '加载失败'}</h1>`;
      return;
    }

    const ctxKey = keyOf(bookId, testId);
    const total = paint(art, md, ctxKey);
    Notes.load(ctxKey, current.title || T().toc.chapterTest);
    document.title = `${T().toc.chapterTest} · ${book.title}`;

    if (window.__checkAll) document.removeEventListener('quiz:done', window.__checkAll);
    window.__checkAll = () => {
      const results = Store.get(Store.K.QUIZ, {}) || {};
      const mine = Object.keys(results).filter(k => k.startsWith(ctxKey + ':'));
      const passed = mine.filter(k => results[k].ok).length;
      if (total > 0 && passed >= total) {
        toast(T().toast.chapterPass);
        Review.record(ctxKey, true);
        if (sync) sync.schedulePush();
      }
    };
    document.addEventListener('quiz:done', window.__checkAll);
  }

  /* ================= 复习 ================= */
  async function renderReview() {
    isTestMode = false; current = null;
    renderTOC();
    setNotesVisible(false);
    Notes.reset(T().notes.noLesson || '');
    const art = $('lesson');
    const due = Review.dueList();
    const up = Review.upcoming(7);
    const R = T().review;

    let html = `
      <div class="home-hero">
        <h1>${R.title}</h1>
        <p class="home-sub">${escapeHtml(R.sub)}</p>
      </div>`;

    if (!due.length) {
      html += `<div class="empty-state">
        <div class="empty-icon">🎉</div>
        <p>${R.empty}</p>
        <p class="dim">${R.emptyDesc}</p>
      </div>`;
    } else {
      html += `<h2 class="home-stage">${R.dueTitle(due.length)}</h2><div class="review-list">`;
      for (const d of due) {
        const [bid, lid] = String(d.key).split('/');
        const b = BOOKS.find(x => x.id === bid);
        html += `
          <div class="review-item">
            <div class="review-meta">
              <span class="review-book">${escapeHtml(b ? b.title : bid)}</span>
              <span class="review-stage">${escapeHtml(Review.stageLabel(d.stage))}</span>
            </div>
            <div class="review-title">${escapeHtml(lid)}</div>
            <a class="review-go" href="#/book/${bid}/${lid}">${R.go}</a>
          </div>`;
      }
      html += `</div>`;
    }

    if (up.length) {
      html += `<h2 class="home-stage">${R.upcoming}</h2><div class="review-up">`;
      for (const u of up) {
        html += `<div class="up-item"><span>${escapeHtml(u.key)}</span><span class="faint">${Review.humanDue(u.due)}</span></div>`;
      }
      html += `</div>`;
    }

    art.innerHTML = html;
    $('lesson-nav').innerHTML = '';
    document.title = `${R.title} · ${T().brand}`;
  }

  /* ================= 完成标记 ================= */
  function buildDoneBar(item) {
    const k = keyOf(book.id, item.id);
    const progress = Store.get(Store.K.PROGRESS, {}) || {};
    const done = !!progress[k]?.done;
    const rv = (Store.get(Store.K.REVIEW, {}) || {})[k];
    const L = T().lesson;

    const wrap = document.createElement('div');
    wrap.className = 'lesson-done' + (done ? ' done' : '');
    const span = document.createElement('span');
    span.innerHTML = done
      ? `${L.done} <span class="hint">· ${L.nextReview} ${Review.humanDue(rv?.due)}</span>`
      : L.undone;
    wrap.appendChild(span);

    const btn = document.createElement('button');
    btn.textContent = done ? L.unmark : L.markDone;
    btn.onclick = () => {
      const nowDone = !done;
      Store.update(Store.K.PROGRESS, {}, p => {
        if (nowDone) p[k] = { done: true, updatedAt: new Date().toISOString() };
        else delete p[k];
        return p;
      });
      if (nowDone) {
        Review.learn(k);
        toast(T().toast.addedReview);
      } else Review.unlearn(k);
      if (sync) sync.schedulePush();
      const old = $('lesson').querySelector('.lesson-done');
      if (old) old.replaceWith(buildDoneBar(item));
      renderTOC();
    };
    wrap.appendChild(btn);
    return wrap;
  }

  function renderNav(item) {
    const i = flat.findIndex(x => x.id === item.id);
    const nav = $('lesson-nav');
    nav.innerHTML = '';
    const prev = flat[i - 1], next = flat[i + 1];
    if (prev) {
      const a = document.createElement('a');
      a.href = `#/book/${book.id}/${prev.id}`;
      a.innerHTML = `<span class="dir">← ${T().prevLabel || '上一节'}</span>${escapeHtml(prev.title)}`;
      nav.appendChild(a);
    }
    if (next) {
      const a = document.createElement('a');
      a.className = 'next';
      a.href = `#/book/${book.id}/${next.id}`;
      a.innerHTML = `<span class="dir">${T().nextLabel || '下一节'} →</span>${escapeHtml(next.title)}`;
      nav.appendChild(a);
    }
  }

  /* ================= UI ================= */
  function closeSidebar() {
    $('sidebar').classList.remove('open');
    $('scrim').classList.remove('show');
  }

  function bindUI() {
    $('btn-menu').onclick = () => {
      const s = $('sidebar');
      s.classList.toggle('open');
      $('scrim').classList.toggle('show', s.classList.contains('open'));
    };
    $('scrim').onclick = closeSidebar;
    $('note-fab').onclick = () => $('notes').classList.toggle('open');
    $('btn-settings').onclick = openSettings;
    $('btn-home').onclick = () => { location.hash = '#/'; };

    $('sync-pill').onclick = () => {
      if (!sync) return openSettings();
      sync.syncNow().then(ok => toast(ok ? T().toast.syncOk : T().toast.syncFail));
    };

    $('btn-modal-close').onclick = () => { $('modal').hidden = true; };
    $('modal').onclick = e => { if (e.target.id === 'modal') $('modal').hidden = true; };

    window.addEventListener('hashchange', route);
  }

  /* ================= 设置 ================= */
  function openSettings() {
    const S = T().settings;
    const token = Store.get(Store.K.TOKEN, '') || '';
    const owner = Store.get(Store.K.OWNER, '') || '';
    const g = Guardian.state();
    $('modal-title').textContent = S.title;
    $('modal-body').innerHTML = `
      <h3>${S.todayTime}</h3>
      <p>${S.learned(Guardian.fmt(g.dayTotal), g.breaks || 0)}</p>

      <h3>${S.tokenTitle}</h3>
      <ol>
        <li>${T().gate.steps[0]}</li>
        <li>${T().gate.steps[1]}</li>
        <li>${T().gate.steps[2]}</li>
      </ol>
      <h3>${S.tokenStep}</h3>
      <input type="text" id="token-input" placeholder="${escapeHtml(T().gate.inputPlaceholder)}" value="${escapeHtml(token)}" autocomplete="off" spellcheck="false">
      <button class="primary-btn" id="btn-save-token">${S.save}</button>
      <button class="ghost-btn danger" id="btn-logout">${T().logout || '退出登录'}</button>
      <div class="callout warn" style="margin-top:16px">${S.warn}</div>
      ${owner ? `<p style="font-size:13px;color:var(--faint)">${S.account(escapeHtml(owner))}<code>anylearn-notes</code></p>` : ''}
      <h3>${S.exportTitle}</h3>
      <button class="ghost-btn" id="btn-export">${S.exportBtn}</button>
    `;
    $('modal').hidden = false;

    $('btn-save-token').onclick = async () => {
      const v = $('token-input').value.trim();
      if (!v) return toast(T().gate.errEmpty);
      Store.set(Store.K.TOKEN, v);
      $('btn-save-token').textContent = S.saving;
      $('btn-save-token').disabled = true;
      const ok = await initSync();
      $('btn-save-token').disabled = false;
      $('btn-save-token').textContent = S.save;
      if (ok) { $('modal').hidden = true; toast(S.connected); }
    };

    $('btn-logout').onclick = () => {
      if (confirm(T().confirmLogout || '退出登录？本地笔记会保留。')) Gate.logout();
    };

    $('btn-export').onclick = () => {
      const blob = new Blob([Notes.exportAll(TOC, book)], { type: 'text/markdown;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `anylearn-notes-${new Date().toISOString().slice(0, 10)}.md`;
      a.click(); URL.revokeObjectURL(a.href);
    };
  }

  /* ================= 同步 ================= */
  function syncState(s, text) {
    const p = $('sync-pill');
    if (!p) return;
    p.dataset.state = s;
    p.querySelector('.sync-text').textContent = text || (T().sync[s] || s);
  }

  async function initSync() {
    const token = Store.get(Store.K.TOKEN, '');
    if (!token) { syncState('off'); return false; }
    try {
      api = new GitHubAPI(token);
      sync = new ConfigSync(api, 'anylearn-notes');
      sync.onStateChange = syncState;
      await sync.init();
      Notes.attach(sync, () => book && renderTOC());
      return true;
    } catch (e) {
      syncState('err');
      toast(T().toast.connectFail + (e.status === 401 ? T().toast.invalidToken : e.message));
      return false;
    }
  }

  /* ================= 节奏守护 ================= */
  function showBreakPanel(kind, info) {
    const G = T().guardian;
    const isDaily = kind === 'daily';
    $('modal-title').textContent = isDaily ? G.dailyTitle : G.breakTitle;
    $('modal-body').innerHTML = `
      <div class="break-hero">${isDaily ? '🌙' : '☕️'}</div>
      <p style="text-align:center;font-size:15px;line-height:1.85;margin:0 0 16px">
        ${isDaily
          ? G.dailyMsg(Guardian.fmt(info.dayTotal))
          : G.breakMsg(Guardian.fmt(Guardian.LIMITS.CONTINUOUS_LIMIT), Guardian.fmt(info.dayTotal))}
      </p>
      <div class="callout">${G.restHint}</div>
      <button class="primary-btn" id="btn-rest">${G.takeBreak}</button>
      <button class="ghost-btn" id="btn-continue">${G.continueAnyway}</button>
    `;
    $('modal').hidden = false;
    $('btn-rest').onclick = () => { Guardian.takeBreak(10); $('modal').hidden = true; toast(G.breakToast); };
    $('btn-continue').onclick = () => { Guardian.resume(); $('modal').hidden = true; };
  }

  /* ================= 路由 ================= */
  async function route() {
    const h = location.hash.replace(/^#\/?/, '');
    const parts = h.split('/').filter(Boolean);

    if (!parts.length) return renderHome();
    if (parts[0] === 'review') return renderReview();
    if (parts[0] === 'book' && parts[1]) {
      const bid = parts[1];
      if (!book || book.id !== bid) {
        book = BOOKS.find(b => b.id === bid);
        if (!book) { location.hash = '#/'; return; }
        try { await loadTOC(bid); }
        catch (e) { toast(T().toast.noContent); location.hash = '#/'; return; }
      }
      if (parts[2] === 'test' && parts[3]) return renderTest(bid, parts[3]);
      if (parts[2]) return renderLesson(bid, parts[2]);
      const last = Store.get(Store.K.LAST_POS, null);
      const target = (last && last.bookId === bid) ? last.lessonId : (flat[0] && flat[0].id);
      return target ? renderLesson(bid, target) : renderHome();
    }
    return renderHome();
  }

  /* ================= 启动 ================= */
  async function startApp() {
    try {
      BOOKS = await fetchJSON(`${CONTENT}/books.json`);
    } catch (e) {
      $('lesson').innerHTML = `<h1>${T().toast.loadFail}</h1><p><code>${CONTENT}/books.json</code></p>`;
      return;
    }
    bindUI();
    Notes.attach(null, () => book && renderTOC());

    try { await initSync(); } catch (e) { syncState('err'); }

    Guardian.start(showBreakPanel);
    await route();
    if (book) renderTOC(); else {
      const progress = Store.get(Store.K.PROGRESS, {}) || {};
      $('progress-label').textContent = `${Object.keys(progress).length}`;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // 登录门：验证通过才会进入应用
    Gate.init(() => { startApp(); });
  });
})();
