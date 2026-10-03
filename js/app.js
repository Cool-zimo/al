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
  /** 第三方书籍：id -> {repo, branch, url, author...}，来自 al-docs 的索引 */
  let EXTERNAL = {};
  const REGISTRY_URL = 'https://cool-zimo.github.io/al-docs/registry.json';
  const RAW = 'https://raw.githubusercontent.com';

  /** 一本书的内容根目录。官方书在站内，第三方书从原作者的仓库直读 */
  function bookBase(bookId) {
    const x = EXTERNAL[bookId];
    if (x) return `${RAW}/${x.repo}/${x.branch}/content/${CFG.lang}`;
    return `${CONTENT}/books/${bookId}`;
  }

  /**
   * 读一本书里的文件。
   *
   * 顺序：本地章节缓存 → GhSrc 多源自动回退（API / CDN / raw）。
   * 缓存命中就不走网络；没缓存时 GhSrc 会自动绕开连不上的源。
   */
  async function readBookFile(bookId, relPath, chapterIdx) {
    const x = EXTERNAL[bookId];
    if (!x) return fetchText(`${CONTENT}/books/${bookId}/${relPath}`);
    if (x.entry) {
      const t = await Shelf.readFile(api, x.entry, CFG.lang, relPath, chapterIdx);
      if (t != null) return t;
    }
    if (x.repo) {
      const [o, n] = x.repo.split('/');
      return GhSrc.text(o, n, x.branch || 'main', `content/${CFG.lang}/${relPath}`);
    }
    return fetchText(`${bookBase(bookId)}/${relPath}`);
  }

  let TOC = [];
  let LESSON_BLOCKS = [];   // 当前课的 python 代码块，实验室用
  let LESSON_QUIZ_COUNT = {};  // 当前课的正式测验题数，决定"学完"的判定方式
  let LESSON_EXAM = [];        // 当前课的正式测验题（带 exam: true，不内联到正文）
  let flat = [];
  let book = null;
  let current = null;
  let sync = null, api = null;
  let isTestMode = false;

  /** 阅读位置：正在展示哪一课（决定滚动位置存到哪个 key） */
  let readingKey = null;
  /** 刚渲染完、还没恢复滚动位置 —— 这段时间内忽略 scroll 事件，防止把 0 写进去 */
  let restoringScroll = false;

  const keyOf = (b, l) => `${b}/${l}`;

  /* ================= 阅读位置记忆 =================
   * 记两个粒度：
   *   LAST_POS —— 上次读到哪一课（进书时直接跳过去）
   *   READ_POS —— 课内滚到哪了（打开这课时滚回原处）
   * 一课做完就清掉 READ_POS，下次进来从头开始。
   */
  function saveReadPos(y) {
    if (!readingKey) return;
    Store.update(Store.K.READ_POS, {}, m => {
      m[readingKey] = { y: Math.max(0, Math.round(y)), at: Date.now() };
      return m;
    });
  }

  function clearReadPos(k) {
    Store.update(Store.K.READ_POS, {}, m => { delete m[k]; return m; });
  }

  /** 滚动时记位置。用 rAF 节流，别让滚动变卡 */
  let scrollTick = false;
  function initScrollMemory() {
    window.addEventListener('scroll', () => {
      if (restoringScroll || !readingKey || isTestMode) return;
      if (scrollTick) return;
      scrollTick = true;
      requestAnimationFrame(() => {
        scrollTick = false;
        if (!readingKey) return;
        saveReadPos(window.scrollY);
      });
    }, { passive: true });

    // 关页/切后台时补一次：rAF 可能还没跑完就走了
    const flush = () => { if (readingKey && !isTestMode) saveReadPos(window.scrollY); };
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flush();
    });
  }

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

  /* ================= 代码实验室 ================= */
  let labPanel = null;

  function openLab(code, name) {
    const lab = $('lab');
    if (!lab) return;
    lab.hidden = false;
    if (!labPanel) {
      labPanel = IDE.create({ blocks: LESSON_BLOCKS, lessonKey: book ? book.id : '' });
      lab.appendChild(labPanel);
      labPanel._btnClose.onclick = closeLab;
    }
    if (code != null) labPanel.api.open(code, name);
    labPanel.api.focus();
    document.body.classList.add('lab-open');
  }

  function closeLab() {
    const lab = $('lab');
    if (lab) lab.hidden = true;
    document.body.classList.remove('lab-open');
  }

  /** 换课/回首页时销毁实验室面板，下次打开会用新课的示例重建 */
  function resetLab() {
    const lab = $('lab');
    if (lab) { lab.hidden = true; lab.innerHTML = ''; }
    labPanel = null;
    document.body.classList.remove('lab-open');
  }

  window.__openLab = (code, name) => openLab(code, name);

  /* ================= 笔记面板显隐 ================= */
  /** 只有课文页/大测验页才需要笔记；首页、复习页整个收起面板 */
  function setNotesVisible(on) {
    document.body.classList.toggle('no-notes', !on);
  }

  /* ================= 书单首页 ================= */
  /* ---------- 首页书架 ----------
   * 首页只显示一个书架：官方 or 第三方。
   * 进了一本书就切到它所属的书架 —— 看第三方书时回首页想找别的第三方书，
   * 而不是被几十本官方教材淹回去。手动点标签也能切，选择会被记住。
   */
  let homeTab = Store.get(Store.K.HOMETAB, 'official') || 'official';
  const HOME_THIRD_STEP = 12;
  let homeThirdShown = 0;

  function setHomeTab(t) {
    if (homeTab === t) return;
    homeTab = t;
    Store.set(Store.K.HOMETAB, t);
    homeThirdShown = 0;
  }

  async function renderHome() {
    book = null; current = null; readingKey = null;
    closeSidebar();
    resetLab();
    setNotesVisible(false);
    Notes.reset(T().notes.noLesson || '');
    // 首页侧边栏：全部教程 / 今日复习 + 两组教材（都可折叠，懒加载）
    $('toc').innerHTML = `<div class="toc-chapter">${T().toc.all}</div>` +
      `<button class="toc-item" data-go-review><span class="n">🔁</span><span class="t">${T().toc.review}</span></button>`;
    $('toc').querySelector('[data-go-review]').onclick = () => { location.hash = '#/review'; };
    {
      const nav = $('toc');
      nav.appendChild(buildBookGroup('official', T().toc.official, officialBooks, '📘'));
      nav.appendChild(buildBookGroup('third', T().toc.third, thirdBooks, '🌐'));
    }

    const art = $('lesson');
    const st = Review.stats();
    const progress = Store.get(Store.K.PROGRESS, {}) || {};
    const doneCount = Object.keys(progress).length;
    const H = T().home;

    const official = BOOKS.filter(b => !b.external);
    const third = BOOKS.filter(b => b.external);

    const HT = T().homeThird;
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

    // 书架切换：默认跟着你当前看的书走，也可以手动点
    const tabBtn = (id, label, n) =>
      `<button class="home-tab${homeTab === id ? ' active' : ''}" data-tab="${id}">` +
      `${escapeHtml(label)}<span class="tab-n">${n}</span></button>`;
    html += `<div class="home-tabs">${
      tabBtn('official', HT.official, official.length)
    }${tabBtn('third', HT.third, third.length)
    }<button class="home-refresh" data-refresh title="${escapeHtml(HT.refresh)}">↻</button></div>`;

    if (homeTab === 'third') {
      html += renderThirdShelf(third, H, HT);
    } else {
      // 官方书架：按 stage 分组，不掺第三方
      const groups = {};
      official.forEach(b => { (groups[b.stage] = groups[b.stage] || []).push(b); });
      html += `<h2 class="home-stage">${escapeHtml(HT.allBooks)} <span class="stage-n">${official.length}</span></h2>`;
      for (const [stage, list] of Object.entries(groups)) {
        html += `<div class="home-substage">${escapeHtml(stage)}</div><div class="book-grid">`;
        for (const b of list) html += bookCard(b, H);
        html += `</div>`;
      }
    }

    html += `
      <div class="home-contrib">
        <b>${escapeHtml(HT.writeOne)}</b>
        <span>${escapeHtml(HT.writeDesc)}</span>
        <div class="home-contrib-links">
          <a href="#/book/creator-guide">${escapeHtml(HT.howTo)} →</a>
          <a href="#/dev">${escapeHtml(HT.devPlatform)} →</a>
        </div>
      </div>`;

    art.innerHTML = html;

    // 切书架
    art.querySelectorAll('.home-tab').forEach(btn => {
      btn.onclick = () => {
        setHomeTab(btn.dataset.tab);
        renderHome();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    });

    const rbtn = art.querySelector('[data-refresh]');
    if (rbtn) rbtn.onclick = () => doRefresh();

    // 第三方书架：滚到底自动补一批
    if (homeTab === 'third') {
      const more = art.querySelector('[data-more-third]');
      if (more) {
        more.onclick = () => { homeThirdShown += HOME_THIRD_STEP; renderHome(); };
        if (window.IntersectionObserver) {
          const io = new IntersectionObserver(es => {
            if (es.some(e => e.isIntersecting)) {
              io.disconnect();
              homeThirdShown += HOME_THIRD_STEP;
              renderHome();
            }
          }, { rootMargin: '160px' });
          io.observe(more);
        }
      }
    }

    $('lesson-nav').innerHTML = '';
    $('progress-label').textContent = `${doneCount} ${H.statDone}`;
    $('progress-fill').style.width = '0%';
    document.title = `${T().brand} · ${T().brandSub}`;
  }

  /** 刷新：重新发现第三方书（官方书是内置的，不用刷） */
  async function doRefresh() {
    try { await refreshExternal(); } catch (e) { /* 索引站挂了不影响官方书 */ }
    if (!book && (location.hash === '' || location.hash === '#' || location.hash === '#/')) {
      renderHome();
    }
  }

  /* ---------- 下拉刷新 ----------
   * 只在首页、且已经滚到顶时生效 —— 否则在课文里往下滑会误触发。
   * 手势本身只是触发 doRefresh()，数据来源和点刷新按钮一样。
   */
  function initPullRefresh() {
    const ind = document.createElement('div');
    ind.className = 'pull-ind';
    ind.innerHTML = '<span class="pi-ico">↓</span><span class="pi-t"></span>';
    document.body.appendChild(ind);

    const THRESH = 68, MAX = 112;
    let startY = 0, dist = 0, active = false, busy = false;

    const onHome = () => !book &&
      (location.hash === '' || location.hash === '#' || location.hash === '#/');
    const canPull = () => onHome() && !busy && window.scrollY <= 0;

    window.addEventListener('touchstart', e => {
      if (!canPull() || e.touches.length !== 1) return;
      startY = e.touches[0].clientY; dist = 0; active = true;
      ind.classList.remove('release', 'busy', 'on');
    }, { passive: true });

    window.addEventListener('touchmove', e => {
      if (!active) return;
      if (!canPull()) { active = false; ind.classList.remove('on'); return; }
      const dy = e.touches[0].clientY - startY;
      if (dy <= 0) { dist = 0; ind.classList.remove('on'); ind.style.transform = ''; return; }
      dist = Math.min(dy * 0.5, MAX);
      ind.classList.add('on');
      ind.style.transform = `translate(-50%, calc(-140% + ${dist}px))`;
      ind.classList.toggle('release', dist >= THRESH);
      ind.querySelector('.pi-t').textContent =
        dist >= THRESH ? T().homeThird.release : T().homeThird.pullDown;
      if (dist > 10 && e.cancelable) e.preventDefault();   // 别让页面跟着一起弹
    }, { passive: false });

    window.addEventListener('touchend', async () => {
      if (!active) return;
      active = false;
      const fired = dist >= THRESH;
      ind.style.transform = '';
      ind.classList.remove('on');
      dist = 0;
      if (!fired) return;
      busy = true;
      ind.classList.add('busy');
      ind.querySelector('.pi-t').textContent = T().homeThird.refreshing;
      try { await doRefresh(); } catch (e) { /* 出错也把指示器收回去 */ }
      busy = false;
      ind.classList.remove('busy', 'release');
    });
  }

  /** 第三方书架：摊平排列，不分类，滚到底补一批 */
  function renderThirdShelf(list, H, HT) {
    if (!list.length) {
      return `<div class="third-empty"><b>${escapeHtml(HT.noMatch)}</b>` +
        `<p>${escapeHtml(HT.thirdNote)}</p></div>`;
    }
    const show = Math.min(homeThirdShown || HOME_THIRD_STEP, list.length);
    homeThirdShown = show;
    let h = `<h2 class="home-stage">${escapeHtml(HT.third)} <span class="stage-n">${list.length}</span></h2>` +
      `<div class="home-note">${escapeHtml(HT.thirdNote)}</div><div class="book-grid">`;
    for (const b of list.slice(0, show)) h += bookCard(b, H);
    h += `</div>`;
    if (show < list.length) {
      h += `<button class="third-more" data-more-third>${
        escapeHtml(HT.more.replace('{n}', list.length - show))}</button>`;
    } else if (list.length > HOME_THIRD_STEP) {
      h += `<div class="third-end">${escapeHtml(HT.allShown)}</div>`;
    }
    return h;
  }

  /** 让开发者平台的「导入」能列出已收录的书 */
  function publishThirdList() {
    window.__thirdBooks = BOOKS.filter(b => b.external).map(b => ({
      id: b.id, title: b.title, repo: b.repo, branch: b.branch || 'main',
    }));
    // 第三方书是异步并入的，可能晚于侧边栏渲染 —— 这里补一次，
    // 否则侧边栏永远显示"暂无"，要刷新才看得到
    refreshBookGroups();
  }

  /** 单张书卡 */
  function bookCard(b, H) {
    return `
      <a class="book-card${b.ready ? '' : ' locked'}" href="#/book/${b.id}">
        <div class="book-level">${escapeHtml(b.level)}${b.external ? ' · ' + (T().homeThird.badge) : ''}</div>
        <div class="book-title">${escapeHtml(b.title)}</div>
        <div class="book-sub">${escapeHtml(b.subtitle)}</div>
        <div class="book-desc">${escapeHtml(b.desc)}</div>
        ${b.external && b.author && b.author.name
          ? `<div class="book-desc" style="opacity:.75;font-size:12.5px">✍ ${escapeHtml(b.author.name)}${b.license ? ' · ' + escapeHtml(b.license) : ''}</div>`
          : ''}
        <div class="book-foot">${b.ready ? H.start : H.building}</div>
      </a>`;
  }

  /** 重新拉第三方书（刷新按钮 / 发布新书后调用） */
  async function refreshExternal() {
    const before = new Set(Object.keys(EXTERNAL));
    BOOKS = BOOKS.filter(b => !b.external);
    for (const k of Object.keys(EXTERNAL)) delete EXTERNAL[k];
    await loadExternal();
    publishThirdList();
    if (book == null && (location.hash === '' || location.hash === '#' || location.hash === '#/')) {
      renderHome();
    }
    const added = Object.keys(EXTERNAL).filter(k => !before.has(k)).length;
    toast(added ? T().homeThird.refreshed.replace('{n}', added) : T().homeThird.noNew);
  }

  /* ================= 目录 ================= */
  /**
   * 第三方书的 toc.json 是 { book, chapters:[{title, lessons, test}] }，比官方的简略
   * （作者不必为每课手写摘要）。这里统一成官方的形状，并从课文中抓标题和摘要补上。
   */
  function normalizeTOC(raw) {
    if (Array.isArray(raw)) return raw;
    const chapters = (raw && raw.chapters) || [];
    return chapters.map(ch => ({
      title: ch.title || '',
      items: (ch.lessons || []).map(L =>
        typeof L === 'string' ? { id: L } : { id: String(L.id), title: L.title, summary: L.summary }),
      test: ch.test || null,
    }));
  }

  /**
   * 从课文里抓「# 标题」和第一句引言，用来填目录。
   *
   * 第三方书要抓几十篇课文才能凑齐目录，但正文是「按章缓存」的，
   * 不能为了目录就把整本下下来。所以标题单独缓存一份（只有几十字节），
   * 第二次打开这本书就不用再抓了。
   */
  async function enrichTOC(bookId, toc) {
    const x = EXTERNAL[bookId];
    const repo = x && x.repo;
    const cache = repo ? Shelf.getTitles(repo, CFG.lang) : null;
    const map = cache ? { ...cache } : {};

    const need = [];
    for (const ch of toc) for (const it of ch.items) {
      if (map[it.id]) { it.title = map[it.id].t; it.summary = map[it.id].s; }
      else if (!it.title) need.push(it);
    }
    if (!need.length) return;

    await Promise.all(need.map(async it => {
      try {
        const md = await readBookFile(bookId, `lessons/${it.id}.md`, null);
        const h = md.split('\n').find(l => /^#\s+\S/.test(l));
        if (h) it.title = h.replace(/^#\s+/, '').replace(/^\d{2}\s+/, '').trim();
        const q = md.split('\n').find(l => /^>\s+\S/.test(l));
        if (q) it.summary = q.replace(/^>\s+/, '').trim();
      } catch (e) { /* 抓不到就留空，目录仍可点开 */ }
      if (!it.title) it.title = it.id;
      map[it.id] = { t: it.title, s: it.summary || '' };
    }));
    if (repo) Shelf.saveTitles(repo, CFG.lang, map);
  }

  /**
   * 打开第三方书的某一章时，把这一章的文件拉下来缓存。
   * 只下这一章（5 课 + 章测），不整本下 —— 读者往往只看前几章。
   */
  async function syncChapter(bookId, chapterIdx, paths) {
    const x = EXTERNAL[bookId];
    if (!x || !x.entry || !api) return true;
    try {
      const r = await Shelf.ensureChapter(api, x.entry, CFG.lang, chapterIdx, paths);
      if (!r.ok) {
        $('lesson').innerHTML = `<h1>${escapeHtml(T().bookshelf?.failTitle || '这一章没能下载')}</h1>
          <p>${escapeHtml(r.error || '')}</p>
          <p style="opacity:.7;font-size:13px">${escapeHtml(T().bookshelf?.failHint || '可能是仓库已删除，或你的 token 没有读取权限。')}</p>`;
        return false;
      }
      return true;
    } catch (e) {
      // 缓存失败不该阻断阅读 —— 回退到 raw 直读
      console.warn('[al] 章节缓存失败，改用直读:', e.message);
      return true;
    }
  }

  /** 某一章要下载哪些文件 */
  function chapterPaths(chIdx) {
    const ch = TOC[chIdx];
    if (!ch) return [];
    const ps = (ch.items || []).map(it => `lessons/${it.id}.md`);
    if (ch.test) ps.push(`lessons/${ch.test}.md`);
    return ps;
  }

  async function loadTOC(bookId) {
    // 记下"我读过这本第三方书"，会随 config 同步到别的设备
    const x0 = EXTERNAL[bookId];
    if (x0 && x0.entry) Shelf.record(x0.entry);
    const raw = EXTERNAL[bookId]
      ? JSON.parse(await readBookFile(bookId, 'toc.json'))
      : await fetchJSON(`${CONTENT}/books/${bookId}/toc.json`);
    TOC = normalizeTOC(raw);
    if (EXTERNAL[bookId]) await enrichTOC(bookId, TOC);
    flat = [];
    TOC.forEach((ch, ci) => {
      for (const it of ch.items) flat.push({ ...it, chapter: ch.title, chIdx: ci });
    });
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

    // 今日额度：按当前书的难度显示还剩几节新课
    if (book && book.level) {
      const cap = Quota.capOf(book.level);
      const u = Quota.used(book.level);
      const lft = Math.max(0, cap - u);
      const q = document.createElement('div');
      q.className = 'quota-bar' + (lft === 0 ? ' full' : '');
      q.innerHTML =
        `<div class="quota-top"><span class="quota-label">${escapeHtml(T().quota.side)}</span>` +
        `<span class="quota-num">${u} / ${cap}</span></div>` +
        `<div class="quota-track"><i style="width:${cap ? Math.min(100, u / cap * 100) : 0}%"></i></div>` +
        `<div class="quota-note">${lft === 0
          ? escapeHtml(T().quota.usedUp)
          : escapeHtml(T().quota.remain(lft))}</div>` +
        `<div class="quota-meta">${escapeHtml(book.level)} · ${escapeHtml(T().quota.capNote(cap))}</div>`;
      nav.appendChild(q);
    }

    // 官方教材：当前这本书的目录，结构不动，只加一个分组标题
    const offHead = document.createElement('div');
    offHead.className = 'toc-group';
    offHead.innerHTML =
      `<span class="g-t">${escapeHtml(T().toc.official)}</span>`;
    nav.appendChild(offHead);

    if (book) {
      const bn = document.createElement('button');
      bn.className = 'toc-item toc-book';
      bn.innerHTML = `<span class="n">📖</span><span class="t">${escapeHtml(book.title)}</span>`;
      bn.onclick = () => { location.hash = `#/book/${book.id}`; closeSidebar(); };
      nav.appendChild(bn);
    }

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

    nav.appendChild(buildBookGroup('third', T().toc.third, thirdBooks, '🌐'));

    const pct = flat.length ? Math.round(done / flat.length * 100) : 0;
    $('progress-fill').style.width = pct + '%';
    $('progress-label').textContent = `${done} / ${flat.length} · ${pct}%`;
  }

  /* ---------- 侧边栏：教材分组（懒加载） ----------
   * 首页和课文页共用这套。第三方书全在作者自己的仓库里，数量未知且会越来越多，
   * 所以不一次性全列：
   *   · 折叠状态只挂一个占位，不渲染任何条目
   *   · 展开后先出 GROUP_STEP 本，哨兵滚进视口再补一批
   *   · 不分类 —— 按入库顺序摊平，分类反而要再拉一次元数据
   */
  const GROUP_STEP = 8;
  const groupState = {};        // { [key]: { open, shown } }
  const groupNodes = new Map(); // key -> { wrap, head, body }，供异步并入后重渲染

  function stateOf(key) {
    return groupState[key] || (groupState[key] = { open: false, shown: 0 });
  }

  /**
   * @param {string} key   内部标识
   * @param {string} title 分组标题
   * @param {()=>Array} getBooks 取书列表
   * @param {string} icon  条目图标
   */
  function buildBookGroup(key, title, getBooks, icon) {
    const st = stateOf(key);
    const T_ = T().toc;

    const wrap = document.createElement('div');
    wrap.className = 'toc-grp';

    const head = document.createElement('button');
    head.className = 'toc-group toc-group-btn' + (st.open ? ' open' : '');
    head.innerHTML =
      `<span class="g-arrow">▸</span><span class="g-t">${escapeHtml(title)}</span>`;
    wrap.appendChild(head);

    const body = document.createElement('div');
    body.className = 'toc-grp-body';
    body.hidden = !st.open;
    wrap.appendChild(body);

    const node = { wrap, head, body, key, title, getBooks, icon };
    groupNodes.set(key, node);

    head.onclick = () => {
      st.open = !st.open;
      head.classList.toggle('open', st.open);
      body.hidden = !st.open;
      if (st.open) renderBookGroup(node);
    };
    if (st.open) renderBookGroup(node);
    return wrap;
  }

  function renderBookGroup(node) {
    const st = stateOf(node.key);
    const T_ = T().toc;
    const body = node.body;
    const list = node.getBooks();
    body.innerHTML = '';

    // 计数角标：书是异步并入的，每次渲染都要刷新
    let badge = node.head.querySelector('.g-n');
    if (list.length) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'g-n';
        node.head.appendChild(badge);
      }
      badge.textContent = list.length;
    } else if (badge) {
      badge.remove();
    }

    if (!list.length) {
      const e = document.createElement('div');
      e.className = 'toc-grp-empty';
      e.textContent = T_.thirdEmpty;
      body.appendChild(e);
      return;
    }

    const show = Math.min(st.shown || GROUP_STEP, list.length);
    st.shown = show;

    for (const b of list.slice(0, show)) {
      const btn = document.createElement('button');
      btn.className = 'toc-item toc-grp-item';
      const sub = b.subtitle || '';
      btn.innerHTML =
        `<span class="n">${node.icon}</span><span class="t">${escapeHtml(b.title)}</span>` +
        (sub ? `<span class="sub">${escapeHtml(sub)}</span>` : '');
      btn.title = sub || b.title;
      btn.onclick = () => { location.hash = `#/book/${b.id}`; closeSidebar(); };
      body.appendChild(btn);
    }

    if (show < list.length) {
      const more = document.createElement('div');
      more.className = 'toc-grp-more';
      more.textContent = T_.thirdMore;
      body.appendChild(more);
      // 哨兵：滚进视口自动补一批，不用手动点
      if (node.io) node.io.disconnect();
      node.io = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting)) {
          st.shown += GROUP_STEP;
          renderBookGroup(node);
        }
      }, { root: null, rootMargin: '120px' });
      node.io.observe(more);
      more.onclick = () => { st.shown += GROUP_STEP; renderBookGroup(node); };
    } else if (list.length > GROUP_STEP) {
      const end = document.createElement('div');
      end.className = 'toc-grp-end';
      end.textContent = T_.thirdAll;
      body.appendChild(end);
    }
  }

  /** 第三方书是异步并入的，可能晚于侧边栏渲染 —— 并入后把已展开的组刷新一遍 */
  function refreshBookGroups() {
    for (const node of groupNodes.values()) {
      if (stateOf(node.key).open) renderBookGroup(node);
      else {
        const list = node.getBooks();
        let badge = node.head.querySelector('.g-n');
        if (list.length && !badge) {
          badge = document.createElement('span');
          badge.className = 'g-n';
          badge.textContent = list.length;
          node.head.appendChild(badge);
        }
      }
    }
  }

  const officialBooks = () => BOOKS.filter(b => !b.external);
  const thirdBooks = () => BOOKS.filter(b => b.external);

  /* ================= 课文 ================= */
  async function renderLesson(bookId, lessonId) {
    isTestMode = false;
    const item = flat.find(x => String(x.id) === String(lessonId));
    if (!item) { location.hash = '#/'; return; }
    current = item;
    Store.set(Store.K.LAST_POS, { bookId, lessonId });
    renderTOC();
    readingKey = keyOf(bookId, lessonId);

    const art = $('lesson');
    art.innerHTML = `<div class="loading">${T().loading || '加载中…'}</div>`;
    resetLab();
    setNotesVisible(true);
    // 先清空笔记面板：切章瞬间就不能再显示上一节的笔记
    Notes.reset();

    let md;
    try {
      // 第三方书：先把这一章拉下来缓存，再读
      if (EXTERNAL[bookId] && item.chIdx != null) {
        await syncChapter(bookId, item.chIdx, chapterPaths(item.chIdx));
      }
      md = await readBookFile(bookId, `lessons/${lessonId}.md`, item.chIdx);
    } catch (e) {
      art.innerHTML = `<h1>${T().loadFailTitle || '加载失败'}</h1><p><code>${escapeHtml(lessonId)}.md</code></p>`;
      return;
    }

    paint(art, md, keyOf(bookId, lessonId));
    art.appendChild(buildDoneBar(item));
    renderNav(item);
    Notes.load(keyOf(bookId, lessonId), item.title);
    document.title = `${item.title} · ${book.title}`;
    restoreScroll(readingKey);
  }

  /**
   * 恢复上次的滚动位置。
   * 内容要先渲染完才能滚（高度不对就滚不到位），所以等到下一帧 + 图片/字体加载后再校准一次。
   */
  function restoreScroll(k) {
    const saved = (Store.get(Store.K.READ_POS, {}) || {})[k];
    const y = saved && Number.isFinite(saved.y) ? saved.y : 0;
    restoringScroll = true;
    window.scrollTo({ top: y, behavior: 'auto' });
    // 字体/代码块挂载后高度会变，补两次校准，之后才允许写入
    let tries = 0;
    const settle = () => {
      if (k !== readingKey) { restoringScroll = false; return; }
      window.scrollTo({ top: y, behavior: 'auto' });
      if (++tries >= 2) setTimeout(() => { restoringScroll = false; }, 120);
      else requestAnimationFrame(settle);
    };
    requestAnimationFrame(settle);
    if (y > 0) showResumeTip(y);
  }

  /** 从中间位置打开时给一句提示，避免"我是不是点错了"的困惑 */
  function showResumeTip(y) {
    const old = $('resume-tip');
    if (old) old.remove();
    const tip = document.createElement('div');
    tip.id = 'resume-tip';
    tip.className = 'resume-tip';
    const zh = window.I18N.lang === 'zh';
    tip.innerHTML = `<span>${zh ? '已回到上次读到的位置' : 'Back to where you left off'}</span>` +
      `<button type="button" class="resume-top">${zh ? '回到顶部' : 'Top'}</button>`;
    tip.querySelector('.resume-top').onclick = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      tip.remove();
    };
    document.body.appendChild(tip);
    setTimeout(() => { tip.classList.add('fade'); }, 2600);
    setTimeout(() => tip.remove(), 3200);
  }

  function paint(art, md, ctxKey) {
    const { html, blocks, quizzes } = MD.renderLesson(md);
    LESSON_BLOCKS = blocks.filter(b => b.lang === 'python' || b.lang === 'py');

    // 题目分两类：
    //   带 exam: true  -> 正式测验题，只在小测页出现，不内联进正文
    //   其余          -> 正文里的随堂练习，边读边练，不计入"是否学完"
    const lessonId = ctxKey.split('/').pop();
    LESSON_EXAM = [];
    const inline = [];
    quizzes.forEach(text => {
      const q = MD.parseQuizText(text);
      const isExam = String(q.exam || '').toLowerCase() === 'true';
      if (isExam) LESSON_EXAM.push(q);
      else inline.push({ q, text });
    });
    LESSON_QUIZ_COUNT[lessonId] = LESSON_EXAM.length;

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

    // exam 题已从正文移除，对应挂载点也要一起删掉，否则会留下空白 div
    const examIdx = new Set();
    quizzes.forEach((text, i) => {
      const q = MD.parseQuizText(text);
      if (String(q.exam || '').toLowerCase() === 'true') examIdx.add(i);
    });

    quizzes.forEach((text, i) => {
      if (examIdx.has(i)) {
        const holder = art.querySelector(`[data-quiz="${i}"]`);
        if (holder) holder.remove();
        return;
      }
      const q = MD.parseQuizText(text);
      const box = Quiz.render(q, i, { key: ctxKey });
      const holder = art.querySelector(`[data-quiz="${i}"]`);
      if (holder) holder.replaceWith(box);
      else art.appendChild(box);
    });

    // md 里常写一节「## 本节测验」+ 一句说明，但测验题本身不内联到正文，
    // 于是那一节会剩下个空标题 —— 看着像题目没加载出来。
    // 这里把这一节换成一个入口卡片：写明有几题，点了直接去小测页。
    replaceExamHeading(art, ctxKey, LESSON_EXAM.length);

    return quizzes.length - examIdx.size;
  }

  /**
   * 把课文里的「## 本节测验」替换成通往小测页的入口卡片。
   * 中英文标题都认；标题后面到下一个同级标题之间的说明段也一并吃掉。
   */
  function replaceExamHeading(art, ctxKey, n) {
    if (!n) return;
    const [bookId, lessonId] = ctxKey.split('/');
    // 各家写法都认：本节测验 / 本节测试 / Section quiz / Lesson quiz / Quiz
    const PAT = /^(本节测验|本节测试|本节小测|Section quiz|Lesson quiz|Lesson test|End-of-lesson quiz|Quiz)$/i;

    const h = [...art.querySelectorAll('h2,h3')]
      .find(el => PAT.test(el.textContent.trim()));
    if (!h) return;

    // 只吃掉紧跟着的说明段落（<p>），遇到其它元素就停 ——
    // 否则会把后面的正文、小结、代码块一起误删
    const extra = [];
    let cur = h.nextElementSibling;
    while (cur && cur.tagName === 'P') {
      extra.push(cur);
      cur = cur.nextElementSibling;
    }
    extra.forEach(el => el.remove());

    const L = T().lq;
    const card = document.createElement('div');
    card.className = 'quiz-entry';
    card.innerHTML =
      `<div class="qe-text">` +
        `<strong>${escapeHtml(L.inlineTitle)}</strong>` +
        `<span>${escapeHtml(L.inlineHint(n))}</span>` +
      `</div>` +
      `<a class="qe-go primary" href="#/book/${bookId}/quiz/${lessonId}">${escapeHtml(L.inlineGo(n))}</a>`;
    h.replaceWith(card);
  }

  /* ================= 单课小测（独立页面） ================= */
  /**
   * 每课底部都有一个小测入口，点进去是这个页面。
   * 与章末大测验的区别：题目少（一般 1~2 题），但**必须通过**才算学完这一课。
   */
  async function renderLessonQuiz(bookId, lessonId) {
    isTestMode = true; readingKey = null;
    const item = flat.find(x => String(x.id) === String(lessonId));
    if (!item) { location.hash = '#/'; return; }
    current = item;
    renderTOC();

    const art = $('lesson');
    art.innerHTML = `<div class="loading">…</div>`;
    resetLab();
    setNotesVisible(false);

    let md;
    try {
      const ci = item.chIdx != null ? item.chIdx : flat.find(x => String(x.id) === String(lessonId))?.chIdx;
      if (EXTERNAL[bookId] && ci != null) {
        await syncChapter(bookId, ci, chapterPaths(ci));
      }
      md = await readBookFile(bookId, `lessons/${lessonId}.md`, ci);
    } catch (e) {
      art.innerHTML = `<h1>${T().loadFailTitle || '加载失败'}</h1>`;
      return;
    }

    // 只取带 exam: true 的正式测验题
    const quizzes = Quiz.extractBlocks(md)
      .filter(q => q.type && String(q.exam || '').toLowerCase() === 'true');
    if (!quizzes.length) {
      art.innerHTML = `<h1>${T().lq.noQuiz}</h1>` +
        `<p class="dim">${T().lq.noQuizHint || ''}</p>`;
      return;
    }

    const k = keyOf(bookId, lessonId);
    const title = `${T().lq.title} · ${item.title}`;

    const headTitle = document.createElement('h1');
    headTitle.className = 'exam-title';
    headTitle.textContent = title;

    const back = document.createElement('a');
    back.className = 'lq-back';
    back.href = `#/book/${bookId}/${lessonId}`;
    back.textContent = '← ' + T().lq.back;

    const exam = Exam.create({
      quizzes,
      key: k,
      title,
      onFinish: g => {
        const passed = g.right >= g.total;
        Store.update(Store.K.PROGRESS, {}, p => {
          p[k] = { done: passed, viaQuiz: true, updatedAt: new Date().toISOString() };
          return p;
        });
        if (passed) {
          Review.learn(k);
          toast(T().lq.passed);
          onLessonCompleted(k, book ? book.level : '', book ? book.title : '');
        } else {
          toast(T().lq.notPassed);
        }
        if (sync) sync.schedulePush();
      }
    });

    art.innerHTML = '';
    art.appendChild(back);
    art.appendChild(headTitle);
    art.appendChild(exam);

    $('lesson-nav').innerHTML = '';
    document.title = title;
    window.scrollTo({ top: 0 });
  }

  /* ================= 章末大测验 ================= */
  async function renderTest(bookId, testId) {
    isTestMode = true; readingKey = null;
    const ch = TOC.find(c => c.test === testId);
    current = { id: testId, title: (ch ? ch.title.replace(/^第\s*\d+\s*章\s*·\s*/, '') : '') };
    renderTOC();

    const art = $('lesson');
    art.innerHTML = `<div class="loading">…</div>`;
    resetLab();
    setNotesVisible(false);        // 测验页不挂笔记，专心答题

    let md;
    try {
      const ci = TOC.findIndex(c => c.test === testId);
      if (EXTERNAL[bookId] && ci >= 0) {
        await syncChapter(bookId, ci, chapterPaths(ci));
      }
      md = await readBookFile(bookId, `lessons/${testId}.md`, ci >= 0 ? ci : null);
    } catch (e) {
      art.innerHTML = `<h1>${T().loadFailTitle || '加载失败'}</h1>`;
      return;
    }

    // 只取题目，不要正文 —— 测验是"考"，不是"读"
    const quizzes = Quiz.extractBlocks(md).filter(q => q.type);

    if (!quizzes.length) {
      art.innerHTML = `<h1>${T().toast.noContent}</h1>`;
      return;
    }

    const title = (ch ? ch.title : T().toc.chapterTest);
    const headTitle = document.createElement('h1');
    headTitle.className = 'exam-title';
    headTitle.textContent = title;

    const exam = Exam.create({
      quizzes,
      key: keyOf(bookId, testId),
      title,
      onFinish: g => {
        const allOk = g.right >= g.total;
        Review.record(keyOf(bookId, testId), allOk);
        if (allOk) toast(T().toast.chapterPass);
        if (sync) sync.schedulePush();
      }
    });

    art.innerHTML = '';
    art.appendChild(headTitle);
    art.appendChild(exam);

    $('lesson-nav').innerHTML = '';
    document.title = `${title} · ${book ? book.title : ''}`;
    window.scrollTo({ top: 0 });
  }

  /* ================= 每日配额提醒 ================= */
  function showQuotaPanel(level, bookTitle) {
    const Q = T().quota;
    const cap = Quota.capOf(level);
    $('modal-title').textContent = Q.title;
    $('modal-body').innerHTML = `
      <div class="break-hero">🫗</div>
      <p style="text-align:center;font-size:15px;line-height:1.85;margin:0 0 16px">
        ${Q.msg(bookTitle, level, cap)}
      </p>
      <div class="callout">${Q.hint}</div>
      <a class="primary-btn" href="#/review" id="btn-quota-review" style="display:block;text-align:center;text-decoration:none">
        ${Q.goReview}
      </a>
      <button class="ghost-btn" id="btn-quota-continue">${Q.continueAnyway}</button>
    `;
    $('modal').hidden = false;
    $('btn-quota-review').onclick = () => { $('modal').hidden = true; };
    $('btn-quota-continue').onclick = () => { $('modal').hidden = true; };
  }

  /** 一课完成后调用：记额度 + 用完了就提醒 */
  function onLessonCompleted(k, level, bookTitle) {
    const isNew = Quota.consume(k, level);
    // 这一课结束了：丢掉它的阅读位置记录，下次进来从头开始
    clearReadPos(k);
    // 如果人还在这课页面上，直接送回顶部 —— 相当于翻到下一课的起点
    if (readingKey === k) window.scrollTo({ top: 0, behavior: 'smooth' });
    renderTOC();
    if (isNew && Quota.exhausted(level)) {
      setTimeout(() => showQuotaPanel(level, bookTitle), 700);
    }
  }

  /* ================= 复习 ================= */
  async function renderReview() {
    isTestMode = false; current = null; readingKey = null;
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
  /** 该课是否有小测（决定"学完"的判定方式） */
  function lessonQuizCount(lessonId) {
    return LESSON_QUIZ_COUNT[lessonId] || 0;
  }

  /**
   * 课文底部的"学完"区域
   *
   * 规则：有小测的课，必须通过小测才算学完 —— 没有手动标记按钮。
   *       没小测的课（理论上不该有），保留手动标记作为兜底。
   */
  function buildDoneBar(item) {
    const k = keyOf(book.id, item.id);
    const progress = Store.get(Store.K.PROGRESS, {}) || {};
    const done = !!progress[k]?.done;
    const rv = (Store.get(Store.K.REVIEW, {}) || {})[k];
    const L = T().lesson;
    const nQuiz = lessonQuizCount(item.id);

    const wrap = document.createElement('div');
    wrap.className = 'lesson-done' + (done ? ' done' : '');

    if (nQuiz > 0) {
      // 有小测：完成与否完全由测验决定
      const span = document.createElement('span');
      span.innerHTML = done
        ? `${L.done} <span class="hint">· ${L.nextReview} ${Review.humanDue(rv?.due)}</span>`
        : L.needQuiz;
      wrap.appendChild(span);

      const btn = document.createElement('a');
      btn.className = done ? 'ghost' : 'primary';
      btn.href = `#/book/${book.id}/quiz/${item.id}`;
      btn.textContent = done ? L.quizAgain : L.goQuiz(nQuiz);
      wrap.appendChild(btn);
      return wrap;
    }

    // 兜底：没有小测的课才允许手动标记
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
        onLessonCompleted(k, book ? book.level : '', book ? book.title : '');
      } else {
        Review.unlearn(k);
        Quota.release(k);
      }
      if (sync) sync.schedulePush();
      const old = $('lesson').querySelector('.lesson-done');
      if (old) old.replaceWith(buildDoneBar(item));
      renderTOC();
    };
    wrap.appendChild(btn);
    return wrap;
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

    $('btn-lab').onclick = () => openLab();

    // 顶部搜索框：常驻在实验室按钮左边，任何页面都能直接搜
    const tsForm = $('top-search');
    if (tsForm) {
      tsForm.addEventListener('submit', e => {
        e.preventDefault();
        const v = ($('top-q').value || '').trim();
        if (!v) return;
        $('top-q').blur();
        // 去掉 hash 再解析，否则在 #/book/xxx 下 ./search/ 会拼到课的路径上
        location.href = new URL('./search/?keyword=' + encodeURIComponent(v),
                                location.href.split('#')[0]).href;
      });
      const ph = T().homeThird.searchAllPh;
      if (ph) $('top-q').placeholder = ph;
    }
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !$('lab').hidden) closeLab();
    });

    $('btn-modal-close').onclick = () => { $('modal').hidden = true; };
    $('modal').onclick = e => { if (e.target.id === 'modal') $('modal').hidden = true; };

    window.addEventListener('hashchange', route);

    // 阅读位置记忆（课内滚动）
    initScrollMemory();
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

      <h3>${S.shelfTitle || '第三方书籍缓存'}</h3>
      <p class="dim" style="font-size:13px;line-height:1.7">${S.shelfDesc || '看第三方书时按章缓存，默认只存在当前标签页，关掉就清掉。'}</p>
      <label class="switch-row">
        <input type="checkbox" id="chk-shelf-persist" ${Shelf.persistent() ? 'checked' : ''}>
        <span>${S.shelfPersist || '存到浏览器本地（关掉标签页也保留，可离线阅读）'}</span>
      </label>
      <p class="dim" id="shelf-usage" style="font-size:12.5px"></p>
      <button class="ghost-btn danger" id="btn-shelf-clear">${S.shelfClear || '清空缓存'}</button>

      <h3>${S.srcTitle || '第三方书内容源'}</h3>
      <p class="dim" style="font-size:13px;line-height:1.7">${S.srcDesc || 'raw.githubusercontent.com 在国内常常连不上。自动模式会依次尝试各个源，并记住上次成功的那个。'}</p>
      <select id="sel-src" style="padding:8px 10px;border:1px solid var(--line);border-radius:8px;font-size:13.5px;background:#fff;font-family:inherit;min-width:260px">
      </select>
      <button class="ghost-btn" id="btn-src-probe">${S.srcProbe || '测一下'}</button>
      <div id="src-probe-out" class="dim" style="font-size:12.5px;margin-top:6px"></div>
      <div id="src-custom-row" style="margin-top:10px" hidden>
        <input type="text" id="src-custom" placeholder="https://你的镜像/https://raw.githubusercontent.com" style="width:100%;padding:8px 10px;border:1px solid var(--line);border-radius:8px;font-size:13px;font-family:inherit">
        <button class="ghost-btn" id="btn-src-custom" style="margin-top:6px">${S.save || '保存'}</button>
      </div>
      <p class="dim" id="src-desc" style="font-size:12.5px;margin-top:6px"></p>
    `;
    $('modal').hidden = false;

    const paintUsage = () => {
      const u = Shelf.usage();
      $('shelf-usage').textContent =
        `${S.shelfUsage ? S.shelfUsage(u.chapters, Math.round(u.chars / 1024)) : `已缓存 ${u.chapters} 章（约 ${Math.round(u.chars / 1024)} KB），上限 ${u.max} 章`}`;
    };
    paintUsage();
    $('chk-shelf-persist').onchange = (e) => {
      Shelf.setPersistent(e.target.checked);
      toast(Shelf.persistent()
        ? (S.shelfPersistOn || '以后缓存会保留在浏览器本地')
        : (S.shelfPersistOff || '已改为只存在当前标签页'));
    };
    // ---- 内容源 ----
    const selSrc = $('sel-src');
    const paintSrc = () => {
      const cur = GhSrc.preferred();
      selSrc.innerHTML =
        `<option value="">${S.srcAuto || '自动（记住上次成功的）'}</option>` +
        GhSrc.list().map(x =>
          `<option value="${escapeHtml(x.id)}"${x.id === cur ? ' selected' : ''}${x.usable ? '' : ' disabled'}>`
          + `${escapeHtml(x.label)}${x.usable ? '' : '（需登录）'}</option>`).join('');
      const d = GhSrc.list().find(x => x.id === selSrc.value);
      $('src-desc').textContent = d ? d.desc : (S.srcAutoDesc || '依次尝试各源，成功一次就记住');
      $('src-custom-row').hidden = selSrc.value !== 'custom';
    };
    paintSrc();
    selSrc.onchange = () => {
      GhSrc.setPreferred(selSrc.value);
      paintSrc();
      if (selSrc.value === 'custom') $('src-custom').value = GhSrc.custom();
    };
    $('btn-src-custom').onclick = () => {
      GhSrc.setCustom($('src-custom').value.trim());
      GhSrc.setPreferred('custom');
      paintSrc();
      toast(S.srcSaved || '镜像已保存');
    };
    $('btn-src-probe').onclick = async () => {
      const id = selSrc.value || (GhSrc.lastOk() || 'jsdelivr');
      const out = $('src-probe-out');
      out.textContent = (S.srcProbing || '测试中…');
      const r = await GhSrc.probe(id);
      out.textContent = r.ok
        ? `${S.srcProbeOk ? S.srcProbeOk(r.ms) : `可用 · ${r.ms}ms`}`
        : `${S.srcProbeFail ? S.srcProbeFail(r.error) : `不可用：${r.error}`}`;
    };

    $('btn-shelf-clear').onclick = () => {
      if (!confirm(S.shelfClearConfirm || '清空所有第三方书籍缓存？下次看需要重新下载。')) return;
      Shelf.clearAll();
      paintUsage();
      toast(S.shelfCleared || '缓存已清空');
    };

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

    // 权限自检：让"这个页面到底能碰什么"变成看得见的东西
    const permBox = document.createElement('div');
    permBox.className = 'callout';
    permBox.id = 'perm-box';
    permBox.innerHTML = '<span class="dim">检查 token 权限…</span>';
    $('modal-body').appendChild(permBox);
    showPerms(permBox);

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

  /* ================= token 权限自检 ================= */
  /** 权限过宽的判定：站点只需要单个仓库的 Contents 读写 */
  const DANGEROUS = {
    'delete_repo': '可以删除你的仓库',
    'admin:org': '可以管理你的组织',
    'admin:public_key': '可以管理你的 SSH 密钥',
    'admin:gpg_key': '可以管理你的 GPG 密钥',
    'workflow': '可以修改 GitHub Actions 工作流',
    'gist': '可以读写你的 Gist',
    'user': '可以读写你的个人资料'
  };

  async function showPerms(box) {
    const P = T().perm || {};
    if (!api) { box.innerHTML = '<span class="dim">' + (P.none || '未连接') + '</span>'; return; }
    try {
      const info = await api.getScopes();
      let html = '';

      if (info.type === 'fine-grained') {
        box.className = 'callout';
        html = '<b>' + (P.fineTitle || 'Fine-grained token') + '</b><br>' +
          '<span class="dim">' + (P.fineDesc || '权限范围由你在 GitHub 上勾选的仓库决定，站点碰不到范围外的东西。') + '</span>';
      } else if (info.scopes.length) {
        const bad = info.scopes.filter(s => DANGEROUS[s]);
        // 只需要 repo（或 public_repo），其余都算超发
        const wide = info.scopes.filter(s => s !== 'repo' && s !== 'public_repo');
        if (bad.length || wide.length > 1) {
          box.className = 'callout err';
          html = '<b>' + (P.wideTitle || '⚠️ 这个 token 权限偏大') + '</b><br>' +
            '<div style="font-family:var(--mono);font-size:12.5px;margin:7px 0;line-height:1.8">' +
            info.scopes.map(s => `<code>${escapeHtml(s)}</code>`).join(' ') + '</div>';
          if (bad.length) {
            html += '<div style="margin:6px 0">' + bad.map(s => '· ' + DANGEROUS[s]).join('<br>') + '</div>';
          }
          html += '<div class="dim">' + (P.wideDesc || '本站只需要一个仓库的 Contents 读写权限。建议换成只授权单个仓库的 Fine-grained token。') + '</div>' +
            ' <a href="https://github.com/settings/personal-access-tokens" target="_blank" rel="noopener">' +
            (P.regen || '去重新生成') + ' →</a>';
        } else {
          box.className = 'callout warn';
          html = '<b>' + (P.okTitle || 'Classic token') + '</b><br>' +
            '<span class="dim">' + (P.okDesc || '') + '</span>' +
            '<div style="font-family:var(--mono);font-size:12.5px;margin-top:6px">' +
            info.scopes.map(s => `<code>${escapeHtml(s)}</code>`).join(' ') + '</div>';
        }
      } else {
        box.className = 'callout';
        html = '<span class="dim">' + (P.unknown || '无法读取权限范围') + '</span>';
      }
      box.innerHTML = html;
    } catch (e) {
      box.className = 'callout err';
      box.innerHTML = '<span class="dim">' + (P.fail || '权限检查失败') + '</span>';
    }
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
      GhSrc.setApi(api);          // 登录后 API 源才可用（最快最稳）
      sync = new ConfigSync(api, 'anylearn-notes');
      sync.onStateChange = syncState;
      await sync.init();
      window.__sync = sync;
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

    // 上一次在开发者平台/文档站（全宽），这次不是 → 还原布局
    if (document.body.classList.contains('wide-view') && parts[0] !== 'dev' && parts[0] !== 'docs') {
      leaveModuleView();
    }

    if (!parts.length) return renderHome();
    if (parts[0] === 'review') return renderReview();
    // 第三方书籍列表页已下线（书多了会淹没官方教材，找书改用顶部搜索）。
    // 只留 #/docs/check —— 作者在主站内自查一本书，这个还有用。
    if (parts[0] === 'docs') {
      if (parts[1] === 'check') return renderDocs('check');
      location.hash = '#/';
      return;
    }
    if (parts[0] === 'dev') return renderDev(parts[1]);
    if (parts[0] === 'book' && parts[1]) {
      const bid = parts[1];
      if (!book || book.id !== bid) {
        book = BOOKS.find(b => b.id === bid);
        if (!book) { location.hash = '#/'; return; }
        // 进哪类书，首页就默认待在哪个书架
        setHomeTab(book.external ? 'third' : 'official');
        try { await loadTOC(bid); }
        catch (e) { toast(T().toast.noContent); location.hash = '#/'; return; }
      }
      if (parts[2] === 'test' && parts[3]) return renderTest(bid, parts[3]);
      if (parts[2] === 'quiz' && parts[3]) return renderLessonQuiz(bid, parts[3]);
      if (parts[2]) return renderLesson(bid, parts[2]);
      const last = Store.get(Store.K.LAST_POS, null);
      const target = (last && last.bookId === bid) ? last.lessonId : (flat[0] && flat[0].id);
      return target ? renderLesson(bid, target) : renderHome();
    }
    return renderHome();
  }

  /* ================= 开发者平台 / 文档（站内视图） ================= */
  /**
   * docs 与 dev 挂在主站路由里，共用侧边栏、主题和登录态。
   * 切过去时把正文容器清空交给对应模块自己接管。
   */
  function enterModuleView() {
    book = null; current = null; readingKey = null;
    closeSidebar();
    resetLab();
    setNotesVisible(false);
    document.body.classList.add('wide-view');   // 收掉侧栏和笔记栏，正文全宽
    $('toc').innerHTML = '';
    $('lesson-nav').innerHTML = '';
    $('lesson').innerHTML = '';
  }

  /** 从开发者平台 / 文档站回到正常视图时把布局还原 */
  function leaveModuleView() {
    document.body.classList.remove('wide-view');
  }

  function renderDocs(sub) {
    enterModuleView();
    const host = document.createElement('div');
    $('lesson').appendChild(host);
    Docs.boot(api);                    // 复用主站已有的登录态
    Docs.mount(host, 'check',          // 列表页已下线，只剩自查
               { embedded: true, lang: CFG.lang });
    document.title = `${T().brand} · ${T().homeThird.browseMore}`;
  }

  function renderDev(sub) {
    enterModuleView();
    const host = document.createElement('div');
    $('lesson').appendChild(host);
    DevPlatform.mount(host, sub === 'editor' ? 'editor' : 'list',
                      { lang: CFG.lang, api });   // 复用主站登录态，草稿仓库要用它
    document.title = `${T().brand} · ${T().homeThird.devPlatform}`;
  }

  // 开发者平台发布成功后要能刷新首页的第三方书区
  window.__refreshExternal = () => { refreshExternal(); };

  /* ================= 第三方书籍 ================= */
  /**
   * 从 al-docs 读索引，把「通过校验且支持当前语言」的第三方书并入书单。
   * 失败时静默跳过 —— 索引站挂了不该影响官方书的使用。
   */
  function addExternal(b, entry) {
    if (BOOKS.some(x => x.id === b.id)) return false;
    EXTERNAL[b.id] = { repo: b.repo, branch: b.branch || 'main', entry: entry || null };
    BOOKS.push({
      id: b.id,
      title: b.title || b.id,
      subtitle: b.subtitle || '',
      desc: b.desc || '',
      stage: b.stage || 'other',
      level: b.level || '',
      ready: true,
      external: true,
      author: b.author || {},
      license: b.license || '',
      repo: b.repo,
      url: b.url,
      stars: b.stars || 0,
    });
    return true;
  }

  async function loadExternal() {
    // 一、登录了：拿用户的 token 自己搜，不依赖中心索引站。
    //     额度是 5000 次/小时，而且能实时发现新书，不必等机器人 6 小时扫一次。
    if (api) {
      try {
        const found = await BookShelf.discover(api);
        let added = 0;
        for (const b of found) {
          if (!b.langs.includes(CFG.lang)) continue;
          if (addExternal(b, b)) added++;
        }
        if (added) console.log(`[al] 用 token 搜到第三方书籍 ${added} 本`);
      } catch (e) {
        console.warn('[al] 搜索第三方书籍失败:', e.message);
      }
    }

    // 二、没登录（或搜索失败）：回退到 al-docs 的中心索引，从原作者仓库直读。
    //     未登录时 GitHub 只给 60 次/小时，所以这条路只够翻书，不够搜书。
    let reg;
    try {
      const r = await fetch(REGISTRY_URL, { cache: 'no-store' });
      if (r.ok) reg = await r.json();
    } catch (e) { /* 索引站挂了也不影响官方书 */ }
    let added = 0;
    for (const b of ((reg && reg.books) || [])) {
      if (!b.ok) continue;
      if (EXTERNAL[b.id]) continue;
      if (Array.isArray(b.langs) && b.langs.length && !b.langs.includes(CFG.lang)) continue;
      if (addExternal(b, null)) added++;
    }
    if (added) console.log(`[al] 从索引站并入第三方书籍 ${added} 本`);
    publishThirdList();
  }

  /** 第三方书是在登录后并入的，可能晚于首页渲染 —— 这里补一次 */
  function renderHomeOrPending() {
    if (!book && (location.hash === '' || location.hash === '#' || location.hash === '#/')) {
      renderHome();
    }
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

    // 先登录再找第三方书 —— 搜索要用用户的 token，
    // 顺序反了就只能用未认证的 60 次/小时额度，搜不动。
    try { await initSync(); } catch (e) { syncState('err'); }
    await loadExternal();
    if (book) renderHomeOrPending();

    Guardian.start(showBreakPanel);
    initPullRefresh();
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
