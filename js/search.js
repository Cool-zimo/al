/*!
 * 全站搜索页（/zh/search/ 与 /en/search/ 共用）
 *
 * 为什么是独立页面而不是 #/search：
 *   用户要的入口是 https://…/al/zh/search?keyword=xxx —— 真实路径能被收藏、
 *   能在新标签打开、分享出去别人直接看到结果。hash 路由做不到。
 *
 * 只搜「教材名 + 目录」：书名、副标题、简介、标签、作者、章标题、课标题、引言。
 * 不搜正文 —— 试过，噪音太大：任何词都能命中几十篇课文，真正要找的那篇
 * 反而被淹没了，而且索引要大十倍。找内容先找书/找课，比全文模糊匹配靠谱。
 */
(function () {
  'use strict';

  var LANG = document.documentElement.lang === 'en' ? 'en' : 'zh';
  var HOME = '../';                       // 从 /al/zh/search/ 回到 /al/zh/

  var T = {
    zh: {
      ph: '搜索教材名与目录',
      btn: '搜索',
      home: '← 返回首页',
      loading: '正在加载目录…',
      none: '没有找到相关的教材或课文',
      noneTip: '换个词试试，或者少输入几个字。',
      empty: '搜点什么？',
      emptyTip: '支持书名、副标题、章标题、课标题。中文连写也能搜。',
      hintsTitle: '试试这些',
      hints: ['Python', '算法', '文件', '网页', 'openpyxl', '递归'],
      hitU: '条结果',
      secBooks: '教材',
      groupTip: '每本书最多显示 8 条',
      badgeExt: '第三方',
      badgeDraft: '我的草稿',
      extLoading: '正在并入第三方教材…',
      openBook: '打开这本书 →',
      err: '目录加载失败，请刷新重试',
    },
    en: {
      ph: 'Search book titles and contents',
      btn: 'Search',
      home: '← Back home',
      loading: 'Loading index…',
      none: 'No matching book or lesson',
      noneTip: 'Try another keyword, or fewer words.',
      empty: 'Search something?',
      emptyTip: 'Matches book titles, subtitles, chapters and lessons.',
      hintsTitle: 'Try these',
      hints: ['Python', 'algorithm', 'file', 'web', 'openpyxl', 'recursion'],
      hitU: 'results',
      secBooks: 'Books',
      groupTip: 'up to 8 per book',
      badgeExt: 'Community',
      badgeDraft: 'My draft',
      extLoading: 'Adding community books…',
      openBook: 'Open this book →',
      err: 'Failed to load index, please refresh',
    },
  }[LANG];

  var $ = function (s) { return document.querySelector(s); };
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- 取文件 ----------
   * 首选同源相对路径：页面和索引是同一次部署，不存在 CDN 缓存滞后 ——
   * 刚推上去的索引立刻就能搜到，jsDelivr @main 要等好几分钟才更新。
   */
  var LOCAL = '../../content/';
  var BASE = 'https://cdn.jsdelivr.net/gh/Cool-zimo/al@main/content/';
  var RAW = 'https://raw.githubusercontent.com/Cool-zimo/al/main/content/';
  var picked = null;

  function fetchJSON(urls) {
    var i = 0;
    function next() {
      if (i >= urls.length) return Promise.reject(new Error('all failed'));
      return fetch(urls[i++], { cache: 'force-cache' }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      }).catch(function () { return next(); });
    }
    return next();
  }

  function get(path) {
    var urls = picked ? [picked + path]
      : [LOCAL + path, BASE + path, RAW + path];
    return fetchJSON(urls).then(function (d) {
      picked = null;   // 只记这一次用的源即可，后续都走同一个
      return d;
    });
  }

  function fetchText(urls) {
    var i = 0;
    function next() {
      if (i >= urls.length) return Promise.reject(new Error('all failed'));
      return fetch(urls[i++], { cache: 'force-cache' }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      }).catch(function () { return next(); });
    }
    return next();
  }

  /* ---------- 第三方教材 ----------
   * 构建时（build_search.py）已经把 registry 里通过校验的书内联进索引了 ——
   * 运行时零依赖，一定能搜到。
   *
   * 这里只做一件事：看看有没有「上次构建之后新收录」的书，有就补进来。
   * 失败完全不影响 —— 内联的那批已经能搜了。
   */
  var REGISTRY = [
    'https://cdn.jsdelivr.net/gh/Cool-zimo/al-docs@main/registry.json',
    'https://raw.githubusercontent.com/Cool-zimo/al-docs/main/registry.json',
  ];
  var EXT_TTL = 5 * 60 * 1000;        // 登录时用 token 实时搜，不用等机器人

  function extSources(repo, branch, path) {
    var b = branch || 'main';
    return [
      'https://cdn.jsdelivr.net/gh/' + repo + '@' + b + '/' + path,
      'https://raw.githubusercontent.com/' + repo + '/' + b + '/' + path,
    ];
  }

  function firstLine(md, re) {
    var line = String(md || '').split('\n').find(function (l) { return re.test(l); });
    return line ? line.replace(re, '').trim() : '';
  }

  /** 第三方 toc 是简写格式：{chapters:[{title, lessons:[id]}]}，标题要去课文里抓 */
  function tocEntries(toc) {
    var out = [];
    var chs = (toc && toc.chapters) || [];
    chs.forEach(function (ch, ci) {
      (ch.lessons || []).forEach(function (lid) {
        out.push({ c: ci, id: String(lid), t: String(lid), s: '' });
      });
    });
    return { chs: chs.map(function (c) { return c.title || ''; }), items: out };
  }

  function applyExternal(one) {
    var bi = idx.books.length;
    idx.books.push({
      id: one.id, title: one.title, sub: one.sub || '',
      stage: one.stage || (LANG === 'zh' ? '第三方' : 'Community'),
      chs: one.chs, ext: true,
      x: [one.desc, (one.tags || []).join(' '), (one.author || {}).name,
          (one.chs || []).join(' ')].filter(Boolean).join(' '),
    });
    one.items.forEach(function (it) {
      idx.items.push({ b: bi, c: it.c, id: it.id, t: it.t, s: it.s });
    });
  }

  /**
   * 登录了就直接用 token 搜 GitHub —— 这是实时的。
   * 构建时内联的索引会滞后一个构建周期，registry 又是机器人 6 小时扫一次，
   * 两层滞后叠起来，作者刚发布的书自己都搜不到。
   * 只有未登录时才退回去读 registry。
   */
  function token() {
    try {
      var v = localStorage.getItem('pytut:token');
      if (!v) return '';
      return JSON.parse(v) || '';
    } catch (e) { return ''; }
  }

  async function discoverBooks() {
    var tok = token();
    if (!tok) {
      var reg = await fetchJSON(REGISTRY);
      return (reg.books || []).slice();
    }
    return fetch('https://api.github.com/search/repositories?q=topic:al-book&per_page=100', {
      headers: { Authorization: 'Bearer ' + tok, Accept: 'application/vnd.github+json' },
    }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function (d) {
      // 搜索 API 只给仓库信息，书的元数据还得读 albook.json
      return Promise.all((d.items || []).map(function (it) {
        return fetch('https://api.github.com/repos/' + it.full_name + '/contents/albook.json', {
          headers: { Authorization: 'Bearer ' + tok, Accept: 'application/vnd.github+json' },
        }).then(function (r) { return r.ok ? r.json() : null; })
          .then(function (f) {
            if (!f || !f.content) return null;
            try {
              var m = JSON.parse(atob(f.content.replace(/\s/g, '')));
              if (m.format !== 'al-book') return null;   // format 必须精确，这条不能松
              m.repo = it.full_name;
              m.branch = it.default_branch || 'main';
              m.ok = true;                                // 没跑完整校验，能读就能搜
              return m;
            } catch (e) { return null; }
          }).catch(function () { return null; });
      }));
    }).then(function (list) {
      return list.filter(Boolean);
    }).catch(function () {
      return fetchJSON(REGISTRY).then(function (r) { return (r.books || []).slice(); });
    });
  }

  async function loadExternal() {
    var have = {};
    idx.books.forEach(function (b) { if (b.ext) have[b.id] = 1; });

    var reg = { books: await discoverBooks() };
    var fresh = (reg.books || []).filter(function (b) {
      if (!b.ok || have[b.id]) return false;
      var ls = b.langs || [];
      return !ls.length || ls.indexOf(LANG) >= 0;
    }).slice(0, 12);
    if (!fresh.length) return;

    for (const b of fresh) {
      try {
        var toc = await fetchJSON(extSources(b.repo, b.branch, 'content/' + LANG + '/toc.json'));
        var e = tocEntries(toc);
        // 并发补标题，上限 6
        var queue = e.items.slice(), running = 0;
        await new Promise(function (resolve) {
          function pump() {
            if (!queue.length) { if (!running) resolve(); return; }
            while (running < 6 && queue.length) {
              running++;
              var it = queue.shift();
              fetchText(extSources(b.repo, b.branch, 'content/' + LANG + '/lessons/' + it.id + '.md'))
                .then(function (md) {
                  it.t = firstLine(md, /^#\s+/) || it.id;
                  it.s = firstLine(md, /^>\s+/);
                })
                .catch(function () {})
                .then(function () { running--; pump(); });
            }
          }
          pump();
        });
        applyExternal({ id: b.id, title: b.title, sub: b.subtitle, stage: b.stage,
                        desc: b.desc, tags: b.tags, author: b.author,
                        chs: e.chs, items: e.items });
        render();
      } catch (err) { /* 某本抓不到就跳过 */ }
    }
  }

  /* ---------- 自己的草稿 ----------
   * 草稿在私有仓库 al-drafts 里，构建时扫不到（别人的仓库、需要本人 token），
   * 所以索引里没有 —— 搜自己刚写的书会 0 条，很莫名其妙。
   *
   * 私有仓库必须走 API：raw 链接要带 token，jsDelivr / CDN 只能读公开仓库。
   * 没登录就跳过（草稿本来就只属于本人）。
   */
  var DRAFT_REPO = 'al-drafts';

  function myCredential() {
    try {
      var rawTok = localStorage.getItem('pytut:token');
      var rawOwn = localStorage.getItem('pytut:owner');
      if (rawTok) { try { rawTok = JSON.parse(rawTok); } catch (e) { /* 有些值是裸字符串 */ } }
      if (rawOwn) { try { rawOwn = JSON.parse(rawOwn); } catch (e) { /* 同上 */ } }
      var tok = typeof rawTok === 'string' ? rawTok : (rawTok && rawTok.value);
      var own = typeof rawOwn === 'string' ? rawOwn : (rawOwn && rawOwn.value);
      if (tok && own) return { token: tok, owner: own };
    } catch (e) { /* 隐私模式下 localStorage 可能不可用 */ }
    return null;
  }

  function gh(path, cred) {
    return fetch('https://api.github.com' + path, {
      headers: { Authorization: 'Bearer ' + cred.token,
                 Accept: 'application/vnd.github+json',
                 'X-GitHub-Api-Version': '2022-11-28' },
    }).then(function (r) { return r.ok ? r.json() : Promise.reject(new Error(r.status)); });
  }

  function applyDraft(meta) {
    var bi = idx.books.length;
    var chs = (meta.chapters || []).map(function (c) { return c.title || ''; });
    idx.books.push({
      id: meta.id, title: meta.title || meta.id, sub: meta.subtitle || '',
      stage: LANG === 'zh' ? '草稿' : 'Draft', chs: chs, ext: true, draft: true,
      x: [meta.desc, (meta.tags || []).join(' '), (meta.author || {}).name,
          (meta.repo || '')].filter(Boolean).join(' '),
    });
    (meta.chapters || []).forEach(function (ch, ci) {
      (ch.lessons || []).forEach(function (ls) {
        idx.items.push({
          b: bi, c: ci, id: String(ls.id),
          t: ls.title || String(ls.id), s: '',
        });
      });
    });
  }

  async function loadMyDrafts() {
    if (!idx) return;
    var cred = myCredential();
    if (!cred) return;

    // 先探测仓库在不在（没写过书的人根本没这个仓，别硬报错）
    var repo;
    try {
      repo = await gh('/repos/' + cred.owner + '/' + DRAFT_REPO, cred);
    } catch (e) { return; }
    var branch = repo.default_branch || 'main';

    var tree;
    try {
      tree = await gh('/repos/' + cred.owner + '/' + DRAFT_REPO +
                      '/git/trees/' + branch + '?recursive=1', cred);
    } catch (e) { return; }

    var ids = [];
    (tree.tree || []).forEach(function (it) {
      var m = (it.path || '').match(/^drafts\/([^/]+)\/meta\.json$/);
      if (m) ids.push(m[1]);
    });
    if (!ids.length) return;

    // 一次并发拉全部 meta —— 草稿一般没几本，不值得写成分批
    await Promise.all(ids.map(function (id) {
      return gh('/repos/' + cred.owner + '/' + DRAFT_REPO +
                '/contents/drafts/' + encodeURIComponent(id) + '/meta.json?ref=' + branch, cred)
        .then(function (d) {
          var txt = '';
          if (d.content && d.encoding === 'base64') {
            try { txt = decodeURIComponent(escape(atob(d.content.replace(/\s/g, '')))); }
            catch (e) { txt = atob(d.content.replace(/\s/g, '')); }
          }
          var meta = JSON.parse(txt || '{}');
          if (meta && meta.id) applyDraft(meta);
        })
        .catch(function () { /* 某本坏了就跳过 */ });
    }));

    render();
  }

  /* ---------- 状态 ---------- */
  var idx = null;
  var cur = '';

  /* ---------- 匹配 ----------
   * 中文没有空格，「python自动化办公」会被当成一个词，
   * 而书名里带空格 —— 两边都压平再比，才能对上。
   */
  var STOP = {
    zh: ['关于', '怎么', '如何', '什么', '为什么', '的', '了', '吗', '教程', '学习', '讲', '一下', '请问'],
    en: ['how', 'what', 'why', 'the', 'a', 'an', 'to', 'of', 'in', 'about', 'tutorial'],
  }[LANG];

  function hasCJK(s) { return /[\u4e00-\u9fff]/.test(s); }
  function compact(s) { return String(s || '').toLowerCase().replace(/\s+/g, ''); }

  /** 剥掉「关于 / 怎么 / 如何」这类口水词 —— 「关于爬虫」不处理就是 0 条 */
  function cleanQuery(q) {
    var t = String(q || '').trim().toLowerCase();
    STOP.forEach(function (w) {
      if (t.length > w.length && t.indexOf(w) >= 0) t = t.split(w).join(' ');
    });
    return t.trim();
  }

  function terms(q) { return cleanQuery(q).split(/\s+/).filter(Boolean); }

  /** 命中几个词。minHit=ts.length 是全中（AND） */
  function score(text, ts, minHit, ctext) {
    var t = String(text || '').toLowerCase(), n = 0;
    for (var i = 0; i < ts.length; i++) {
      var w = ts[i];
      if (t.indexOf(w) >= 0) { n++; continue; }
      if (ctext && hasCJK(w) && ctext.indexOf(compact(w)) >= 0) n++;
    }
    return n >= minHit ? n : 0;
  }

  /** 惰性算一份压平文本，供中文连写查询兜底 */
  function cachedCompact(o, key) {
    var k = '_c_' + key;
    if (o[k] === undefined) o[k] = compact(o[key] || '');
    return o[k];
  }

  function search(q, loose) {
    var ts = terms(q);
    if (!ts.length || !idx) return { books: [], lessons: [] };
    var minHit = loose ? Math.max(1, ts.length - 1) : ts.length;

    // 书名命中单独成一类 —— 它是「你要找的东西」本身，比任何单课都靠前
    var books = [];
    for (var bi = 0; bi < idx.books.length; bi++) {
      var bk = idx.books[bi];
      var bc = compact(bk.title + ' ' + bk.sub + ' ' + (bk.x || ''));
      var bs = score(bk.title, ts, minHit, bc) * 3
        + score(bk.sub, ts, minHit, bc) * 2
        + score(bk.x, ts, minHit, bc);
      if (bs) books.push({ b: bi, sc: bs });
    }
    books.sort(function (a, b) { return b.sc - a.sc; });

    var lessons = [];
    for (var i = 0; i < idx.items.length; i++) {
      var it = idx.items[i];
      var ic = compact(it.t + ' ' + it.s);
      var st = score(it.t, ts, minHit, ic);
      var s = st ? 100 : 0;
      if (!s) {
        st = score(it.s, ts, minHit, ic);
        if (st) s = 60;
      }
      if (!s) continue;
      lessons.push({ b: it.b, id: it.id, c: it.c, t: it.t, s: it.s, sc: s + st });
    }
    lessons.sort(function (a, b) { return b.sc - a.sc; });
    return { books: books, lessons: lessons };
  }

  /** 严格模式一条都没有时才放宽。有好结果时绝不放宽 —— 噪音比 0 条更糟 */
  function searchBest(q) {
    var strict = search(q, false);
    if (strict.books.length + strict.lessons.length) return { r: strict, loose: false };
    return { r: search(q, true), loose: true };
  }

  function hl(text, ts) {
    var out = esc(text);
    ts.forEach(function (w) {
      if (!w) return;
      var re = new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      out = out.replace(re, '<mark>$1</mark>');
    });
    return out;
  }

  /** 课级结果按书分组 */
  function byBookFor(lessons) {
    var g = {};
    lessons.forEach(function (r) { (g[r.b] = g[r.b] || []).push(r); });
    return g;
  }

  var PER_BOOK = 8;

  /* ---------- 渲染 ---------- */
  /** 空状态卡片 */
  function emptyBlock(icon, title, desc) {
    return '<div class="s-empty">' +
      '<div class="e-ico">' + icon + '</div>' +
      '<b>' + esc(title) + '</b>' +
      '<p>' + esc(desc) + '</p></div>';
  }

  /** 热门词引导：空状态/无结果时给几个能点的例子，比干等着强 */
  function hintsHTML() {
    if (!T.hints || !T.hints.length) return '';
    return '<div class="s-hints"><div class="s-hints-t">' + esc(T.hintsTitle) + '</div>' +
      '<div class="s-chips">' + T.hints.map(function (w) {
        return '<a class="s-chip" href="?keyword=' + encodeURIComponent(w) + '">' + esc(w) + '</a>';
      }).join('') + '</div></div>';
  }

  function render() {
    var box = $('#results'), state = $('#state');
    var q = cur.trim();

    if (!idx) { box.innerHTML = ''; state.innerHTML = esc(T.loading); return; }
    if (!q) {
      box.innerHTML = emptyBlock('🔍', T.empty, T.emptyTip) + hintsHTML();
      state.textContent = '';
      return;
    }

    var best = searchBest(q);
    var res = best.r, ts = terms(q);
    var total = res.books.length + res.lessons.length;

    state.innerHTML = '<b>' + total + '</b> ' + esc(T.hitU);
    if (res.lessons.length) {
      var g = byBookFor(res.lessons), shown = 0;
      Object.keys(g).forEach(function (k) { shown += Math.min(PER_BOOK, g[k].length); });
      if (shown < res.lessons.length) state.textContent += ' · ' + T.groupTip;
    }

    if (!total) {
      box.innerHTML = emptyBlock('🫥', T.none, T.noneTip) + hintsHTML();
      return;
    }

    var html = '';

    // 1) 书名命中的教材
    if (res.books.length) {
      html += '<section class="s-book s-books"><h2 class="s-sec">' + esc(T.secBooks)
        + '<span class="s-stage">' + res.books.length + '</span></h2>';
      res.books.forEach(function (r) {
        var bk = idx.books[r.b];
        html += '<div class="s-bkitem">'
          + '<a href="' + HOME + '#/book/' + esc(bk.id) + '">' + hl(bk.title, ts) + '</a>'
          + (bk.draft ? '<span class="s-badge s-badge-draft">' + esc(T.badgeDraft) + '</span>'
             : (bk.ext ? '<span class="s-badge">' + esc(T.badgeExt) + '</span>' : ''))
          + '<span class="s-stage">' + esc(bk.stage) + '</span>'
          + (bk.sub ? '<p class="s-snip">' + hl(bk.sub, ts) + '</p>' : '')
          + '</div>';
      });
      html += '</section>';
    }

    // 2) 课级结果按书分组，每组最多 PER_BOOK 条
    var byBook = byBookFor(res.lessons);
    Object.keys(byBook).forEach(function (bi) {
      var bk = idx.books[bi], list = byBook[bi];
      var head = list.slice(0, PER_BOOK), rest = list.length - head.length;
      html += '<section class="s-book"><h2>'
        + '<a href="' + HOME + '#/book/' + esc(bk.id) + '">' + hl(bk.title, ts) + '</a>'
        + (bk.draft ? '<span class="s-badge s-badge-draft">' + esc(T.badgeDraft) + '</span>'
           : (bk.ext ? '<span class="s-badge">' + esc(T.badgeExt) + '</span>' : ''))
        + '<span class="s-stage">' + esc(bk.stage) + '</span></h2><ul>';
      head.forEach(function (r) {
        html += '<li class="s-item">'
          + '<a class="s-t" href="' + HOME + '#/book/' + encodeURIComponent(bk.id)
          + '/' + encodeURIComponent(r.id) + '">' + hl(r.t, ts) + '</a>'
          + '<div class="s-c">' + esc(idx.books[r.b].chs[r.c] || '') + '</div>'
          + '</li>';
      });
      html += '</ul>';
      if (rest > 0) {
        html += '<div class="s-more">' + rest + ' '
          + esc(LANG === 'zh' ? '条未显示' : 'more')
          + ' · <a href="' + HOME + '#/book/' + esc(bk.id) + '">' + esc(T.openBook) + '</a></div>';
      }
      html += '</section>';
    });

    box.innerHTML = html;
  }

  /* ---------- 启动 ---------- */
  function boot() {
    var kw = new URLSearchParams(location.search).get('keyword') || '';
    cur = kw;
    $('#q').value = kw;
    $('#q').placeholder = T.ph;
    $('#btn').textContent = T.btn;
    $('#back').textContent = T.home;
    $('#back').href = HOME;
    document.title = (kw ? kw + ' · ' : '') + 'AnyLearn';

    $('#form').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('#q').value.trim();
      if (!v) return;
      cur = v;
      history.replaceState(null, '', '?keyword=' + encodeURIComponent(v));
      document.title = v + ' · AnyLearn';
      render();
    });

    // 清空：回到引导态，顺便把 URL 上的 keyword 去掉
    var clr = $('#clear');
    if (clr) {
      $('#q').addEventListener('input', function () { clr.hidden = !$('#q').value; });
      clr.addEventListener('click', function () {
        $('#q').value = ''; clr.hidden = true; cur = '';
        history.replaceState(null, '', location.pathname);
        document.title = 'AnyLearn';
        render();
        $('#q').focus();
      });
    }

    get(LANG + '/search-index.json').then(function (d) {
      idx = d;
      render();
      // 索引里已内联了第三方书。这里只补「上次构建之后新收录」的，失败了也不影响。
      try {
        var last = parseInt(localStorage.getItem('al.search.ext.at') || '0', 10);
        if (Date.now() - last > EXT_TTL) {
          localStorage.setItem('al.search.ext.at', String(Date.now()));
          loadExternal().catch(function () {});
        }
      } catch (e) { /* 隐私模式下 localStorage 不可用 */ }

      // 自己的草稿：私有仓库，构建时扫不到，登录了就并进来
      loadMyDrafts().catch(function () {});
    }).catch(function () {
      $('#state').textContent = T.err;
    });

    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
