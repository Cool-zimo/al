/*!
 * 全站搜索页（/zh/search/ 与 /en/search/ 共用）
 *
 * 为什么是独立页面而不是 #/search：
 *   用户要的入口是 https://…/al/zh/search?keyword=xxx —— 真实路径能被搜到、
 *   能收藏、能在新标签打开。hash 路由做不到。
 *
 * 两段式加载：
 *   1. search-index.json（书名 + 课标题 + 引言，约 170KB）先到，立刻出结果
 *   2. search-full.json（正文，1MB 级）后台拉，到了再补一轮正文匹配
 *   直接等 1MB 的话，首屏要白等好几秒。
 */
(function () {
  'use strict';

  var LANG = document.documentElement.lang === 'en' ? 'en' : 'zh';
  var HOME = '../';                       // 从 /al/zh/search/ 回到 /al/zh/

  var T = {
    zh: {
      ph: '搜索全部教材（书名 / 课文 / 正文）',
      btn: '搜索',
      home: '← 返回首页',
      loading: '正在加载索引…',
      deep: '正在全文搜索…',
      none: '没有找到相关内容',
      noneTip: '换个词试试，或者少输入几个字。',
      empty: '输入关键词开始搜索',
      hit: '共 {n} 条',
      hitBook: '{n} 本教材',
      err: '索引加载失败，请刷新重试',
      inBook: '正文命中',
      looseNote: '没有全部命中，下面是部分匹配的结果',
      groupTip: '每本书最多显示 6 条',
      secBooks: '教材',
      goLesson: '打开这一课 →',
      moreInBook: '这本书里还有 {n} 条',
    },
    en: {
      ph: 'Search all textbooks (title / lesson / body)',
      btn: 'Search',
      home: '← Back home',
      loading: 'Loading index…',
      deep: 'Searching full text…',
      none: 'No results',
      noneTip: 'Try another keyword, or fewer words.',
      empty: 'Type a keyword to start',
      hit: '{n} results',
      hitBook: '{n} books',
      err: 'Failed to load index, please refresh',
      inBook: 'match in body',
      looseNote: 'no exact match — showing partial results',
      groupTip: 'up to 6 per book',
      secBooks: 'Books',
      goLesson: 'Open lesson →',
      moreInBook: '{n} more in this book',
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
   * 后面两个源只是兜底（比如有人把 search/ 单独拷到别处用）。
   */
  var LOCAL = '../../content/';
  var BASE = 'https://cdn.jsdelivr.net/gh/Cool-zimo/al@main/content/';
  var RAW = 'https://raw.githubusercontent.com/Cool-zimo/al/main/content/';
  var picked = null;

  function get(path) {
    var urls = picked ? [picked + path] : [LOCAL + path, BASE + path, RAW + path];
    var i = 0;
    function next() {
      if (i >= urls.length) return Promise.reject(new Error('all sources failed'));
      var u = urls[i++];
      return fetch(u, { cache: 'force-cache' }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        picked = u.slice(0, u.lastIndexOf(path));   // 记住哪个源通，后面都用它
        return r.json();
      }).catch(function () {
        return next();
      });
    }
    return next();
  }

  /* ---------- 状态 ---------- */
  var idx = null;          // 轻量索引
  var fullItems = null;    // 正文数组，与 idx.items 一一对应
  var cur = '';

  /* ---------- 匹配 ---------- */
  // 中文查询里常带「关于」「怎么」这类词，全部要求命中会让结果归零
  var STOP = { zh: ['关于', '怎么', '如何', '什么', '为什么', '的', '了', '吗', '教程', '学习', '讲', '一下', '请问'],
               en: ['how', 'what', 'why', 'the', 'a', 'an', 'to', 'of', 'in', 'about', 'tutorial'] }[LANG];

  /**
   * 中文没有空格，「关于爬虫」会被当成一个词，而正文里这两个字从不连着出现 ——
   * 直接搜必然 0 条。所以先剥掉「关于 / 怎么 / 如何」这类口水词再搜。
   * 这是 query rewriting 的极简版，但能救回一大半自然语句查询。
   */
  function cleanQuery(q) {
    var t = String(q || '').trim().toLowerCase();
    STOP.forEach(function (w) {
      if (t.length > w.length && t.indexOf(w) >= 0) t = t.split(w).join(' ');
    });
    return t.trim();
  }

  function terms(q) {
    return cleanQuery(q).split(/\s+/).filter(Boolean);
  }

  /** 高亮用词：已经剥过停用词了，这里只再挡一道空数组 */
  function meaningful(ts) {
    return ts.filter(Boolean);
  }

  function score(text, ts, any) {
    var t = String(text || '').toLowerCase(), n = 0;
    for (var i = 0; i < ts.length; i++) if (t.indexOf(ts[i]) >= 0) n++;
    return any ? n : (n === ts.length ? n : 0);
  }

  /** 抓一段包含关键词的上下文，用于结果里显示 */
  function snippet(text, ts) {
    var t = String(text || '');
    var low = t.toLowerCase();
    var at = -1;
    for (var i = 0; i < ts.length; i++) {
      var p = low.indexOf(ts[i]);
      if (p >= 0 && (at < 0 || p < at)) at = p;
    }
    if (at < 0) return t.slice(0, 90);
    var s = Math.max(0, at - 45);
    return (s > 0 ? '…' : '') + t.slice(s, s + 150) + (s + 150 < t.length ? '…' : '');
  }

  /**
   * any=true 时是「命中任一词也算」的兜底模式。
   * 全 AND 太严：「关于爬虫」这种自然语句会一条都搜不到。
   */
  function search(q, any) {
    var ts0 = terms(q);
    if (!ts0.length || !idx) return { books: [], lessons: [] };
    var ts = any ? ts0 : (meaningful(ts0).length ? meaningful(ts0) : ts0);
    if (!ts.length) return { books: [], lessons: [] };

    // 书名命中单独成一类。不这么做的话，「递归」命中某本书的副标题，
    // 那本书 30 课会全部灌进结果 —— 全是噪音。
    var books = [];
    for (var bi = 0; bi < idx.books.length; bi++) {
      var bk = idx.books[bi];
      var bs = score(bk.title, ts, any) * 2 + score(bk.sub, ts, any);
      if (bs) books.push({ b: bi, sc: bs });
    }
    books.sort(function (a, b) { return b.sc - a.sc; });

    var lessons = [];
    for (var i = 0; i < idx.items.length; i++) {
      var it = idx.items[i];
      var s = 0, where = '';
      var st = score(it.t, ts, any);
      if (st) { s = 100; where = 'title'; }
      else {
        st = score(it.s, ts, any);
        if (st) { s = 60; where = 'intro'; }
        else if (fullItems && score(fullItems[i], ts, any)) { s = 20; where = 'body'; }
      }
      if (!s) continue;
      lessons.push({
        b: it.b, id: it.id, c: it.c, t: it.t, s: it.s, w: where, sc: s + st,
        snip: where === 'body' ? snippet(fullItems[i], ts) : (it.s || ''),
      });
    }
    lessons.sort(function (a, b) { return b.sc - a.sc; });
    return { books: books, lessons: lessons };
  }

  /** AND 搜不到几条就降级成 OR，别让人搜个「关于爬虫」结果 0 条 */
  function searchBest(q) {
    var strict = search(q, false);
    var n = strict.books.length + strict.lessons.length;
    if (n >= 3) return { r: strict, loose: false };
    var loose = search(q, true);
    var n2 = loose.books.length + loose.lessons.length;
    return { r: n2 > n ? loose : strict, loose: n2 > n };
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

  /* ---------- 渲染 ---------- */
  function render() {
    var box = $('#results'), state = $('#state');
    var q = cur.trim();

    if (!idx) { box.innerHTML = ''; state.textContent = T.loading; return; }
    if (!q) { box.innerHTML = '<div class="s-empty">' + esc(T.empty) + '</div>'; state.textContent = ''; return; }

    var best = searchBest(q);
    var res = best.r;
    var ts = meaningful(terms(q));
    if (!ts.length) ts = terms(q);

    var total = res.books.length + res.lessons.length;
    state.textContent = (fullItems ? '' : T.deep + ' · ')
      + T.hit.replace('{n}', total) + (best.loose ? ' · ' + T.looseNote : '');
    var shownBooks = Object.keys(byBookFor(res.lessons)).length;
    if (res.lessons.length && shownBooks) {
      var shown = 0;
      var g = byBookFor(res.lessons);
      Object.keys(g).forEach(function (k) { shown += Math.min(6, g[k].length); });
      if (shown < res.lessons.length) state.textContent += ' · ' + T.groupTip;
    }

    if (!total) {
      box.innerHTML = '<div class="s-empty"><b>' + esc(T.none) + '</b><p>' + esc(T.noneTip) + '</p></div>';
      return;
    }

    var html = '';

    // 1) 书名命中的书，单独一块 —— 它比任何单课都更像「你要找的东西」
    if (res.books.length) {
      html += '<section class="s-book s-books"><h2 class="s-sec">' + esc(T.secBooks) + '</h2>';
      res.books.forEach(function (r) {
        var bk = idx.books[r.b];
        html += '<div class="s-bkitem"><a href="' + HOME + '#/book/' + esc(bk.id) + '">'
          + hl(bk.title, ts) + '</a><span class="s-stage">' + esc(bk.stage) + '</span>'
          + '<p class="s-snip">' + hl(bk.sub, ts) + '</p></div>';
      });
      html += '</section>';
    }

    // 2) 课级结果按书分组，每组最多 6 条 —— 不然一本书能占满整页
    var byBook = byBookFor(res.lessons);

    Object.keys(byBook).forEach(function (bi) {
      var bk = idx.books[bi], list = byBook[bi];
      var head = list.slice(0, 6), rest = list.length - head.length;
      html += '<section class="s-book"><h2><a href="' + HOME + '#/book/' + esc(bk.id) + '">'
        + hl(bk.title, ts) + '</a><span class="s-stage">' + esc(bk.stage) + '</span></h2><ul>';
      head.forEach(function (r) {
        var url = HOME + '#/book/' + encodeURIComponent(bk.id) + '/' + encodeURIComponent(r.id);
        html += '<li class="s-item">'
          + '<a class="s-t" href="' + url + '">' + hl(r.t, ts) + '</a>'
          + '<div class="s-c">' + esc(idx.books[r.b].chs[r.c] || '') + '</div>'
          + (r.snip ? '<p class="s-snip">' + hl(r.snip, ts) + '</p>' : '')
          + '</li>';
      });
      html += '</ul>';
      if (rest > 0) {
        html += '<div class="s-more">' + esc(T.moreInBook.replace('{n}', rest))
          + ' · <a href="' + HOME + '#/book/' + esc(bk.id) + '">' + esc(T.goLesson) + '</a></div>';
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

    get(LANG + '/search-index.json').then(function (d) {
      idx = d;
      render();
      if (!cur.trim()) return;
      // 正文索引后台拉，拉到就补一轮 —— 不阻塞首屏
      return get(LANG + '/search-full.json').then(function (f) {
        if (!f || !f.items || f.items.length !== idx.items.length) return;
        fullItems = f.items;
        render();
      });
    }).catch(function () {
      $('#state').textContent = T.err;
    });

    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
