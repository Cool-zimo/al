/**
 * Web 代码执行器（HTML / CSS / JavaScript，纯浏览器内）
 *
 * 与 Runner（Pyodide 跑 Python）并列，两套互不影响。
 *
 * 关键设计：
 * - 全部在 iframe（sandbox="allow-scripts"）里跑。iframe 是独立源，
 *   拿不到父页面的 DOM / Cookie / 存储——学生代码再野也炸不到主站。
 * - 通过 postMessage 回传：控制台输出、报错、检查项结果。
 * - **判分不比对源码字符串**，而是查 DOM 结构和 getComputedStyle 的计算值。
 *   于是颜色写成 red / #f00 / rgb(255,0,0) 都算对——浏览器算出来本来就是同一个值。
 *   这比"看你代码长什么样"更接近"你到底学会没有"。
 * - localStorage 在沙箱 iframe 里会直接抛 SecurityError，用内存版顶上，
 *   否则学生一用 localStorage 就白屏，还以为是自己的 bug。
 */
const WebRunner = (() => {
  let seq = 0;
  const pending = new Map();

  window.addEventListener('message', (ev) => {
    const d = ev.data;
    if (!d || d.__alWeb !== true || !d.token) return;
    const fn = pending.get(d.token);
    if (fn) { pending.delete(d.token); fn(d.payload || {}); }
  });

  function newToken() {
    return 'w' + (++seq) + '_' + Math.random().toString(36).slice(2, 8);
  }

  /* ================= 文档拼装 ================= */

  const HARNESS = `
(function () {
  var __log = [];
  var __err = null;
  function fmt(v) {
    if (typeof v === 'string') return v;
    if (v instanceof Element) return '<' + v.tagName.toLowerCase() + '>';
    try { return JSON.stringify(v); } catch (e) { return String(v); }
  }
  function push() {
    __log.push(Array.prototype.slice.call(arguments).map(fmt).join(' '));
  }
  ['log', 'info', 'warn', 'error', 'debug'].forEach(function (k) {
    var orig = console[k];
    console[k] = function () {
      push.apply(null, arguments);
      try { orig && orig.apply(console, arguments); } catch (e) { /* 忽略 */ }
    };
  });
  // 报错文本统一用 ASCII：中文提示由父页面按 i18n 拼装，
  // 免得脚本文件的编码一旦被误判，整条错误信息变乱码。
  window.onerror = function (m, src, line) {
    if (!__err) { __err = String(m); __errLine = line || 0; }
    return true;
  };
  window.addEventListener('unhandledrejection', function (e) {
    if (!__err) {
      __err = 'Unhandled promise rejection: ' + String((e.reason && e.reason.message) || e.reason);
    }
  });
  // 沙箱里没有 localStorage，补一个内存版，免得学生代码一用就崩
  try { window.localStorage.getItem('__probe__'); } catch (e) {
    var store = {};
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: function (k) {
          return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null;
        },
        setItem: function (k, v) { store[k] = String(v); },
        removeItem: function (k) { delete store[k]; },
        clear: function () { store = {}; },
        key: function (i) { return Object.keys(store)[i] || null; },
        get length() { return Object.keys(store).length; }
      }
    });
  }
  var __errLine = 0;
  window.__AL__ = {
    report: function () {
      var A = window.__AL__;
      if (A.__reported) return;
      A.__reported = true;
      var err = A.err || A.runtimeErr || null;
      if (!A.jsStart) {
        // 探针没被覆盖 = 那段脚本因语法错误整个没执行（文案由父页面拼）
        A.syntaxErr = true;
      }
      parent.postMessage({
        __alWeb: true,
        token: A.token,
        payload: {
          log: A.log || [],
          err: err,
          errLine: A.errLine || 0,
          syntaxErr: A.syntaxErr === true,
          fnMissing: A.fnMissing === true,
          results: A.results || [],
          fnResults: A.fnResults || []
        }
      }, '*');
    },
    log: __log,
    jsStart: true,      // 没有 JS 的题（纯 HTML/CSS）默认算"已开始"
    done: false,
    runtimeErr: null,
    errLine: 0,
    fnMissing: false,
    pending: [],
    settle: function (r, v) {
      r.ok = !!v;
      r.got = window.__AL_show(v);
      if (!r.ok) {
        var p = window.__AL_splitEq(r.expr);
        if (p) {
          try { r.left = window.__AL_show(eval(p[0])); } catch (e) { /* 忽略 */ }
          try { r.right = window.__AL_show(eval(p[1])); } catch (e) { /* 忽略 */ }
        }
      }
    },
    results: [],
    fnResults: [],
    token: '__TOKEN__',
    get err() { return __err; },
    get errLine() { return __errLine; }
  };
  window.__AL_splitEq = function (expr) {
    var m = /^([\\s\\S]*?[^=!<>])={2,3}([^=][\\s\\S]*)$/.exec(expr);
    return m ? [m[1], m[2]] : null;
  };
  window.__AL_show = function (v) {
    if (typeof v === 'string') return v;
    if (v === null || v === undefined) return String(v);
    if (v instanceof Element) return '<' + v.tagName.toLowerCase() + '>';
    try { var s = JSON.stringify(v); return s === undefined ? String(v) : s; }
    catch (e) { return String(v); }
  };
  window.__AL_eq = function (a, b) {
    if (a === b) return true;
    var ta = typeof a, tb = typeof b;
    if (ta === 'number' && tb === 'number') return Math.abs(a - b) < 1e-9;
    if (a && b && typeof a === 'object' && typeof b === 'object') {
      var ka = Object.keys(a), kb = Object.keys(b);
      if (ka.length !== kb.length) return false;
      for (var i = 0; i < ka.length; i++) {
        if (!Object.prototype.hasOwnProperty.call(b, ka[i])) return false;
        if (!window.__AL_eq(a[ka[i]], b[ka[i]])) return false;
      }
      return true;
    }
    return false;
  };
})();
`;

  /**
   * 拼一个完整的 HTML 文档
   * @param {{html?:string, css?:string, js?:string, checks?:string[],
   *          func?:string, cases?:Array}} o
   */
  function buildDoc(o) {
    const html = o.html || '';
    const css = o.css || '';
    const js = o.js || '';
    const checks = o.checks || [];
    const cases = o.cases || [];
    const func = o.func || '';

    // 检查项：每项是一个表达式，必须为真。
    // 失败时若形如 `X === Y`，额外把两边的值报出来，比干巴巴一句"没通过"有用得多。
    // 检查项支持返回 Promise：表达式本身必须在学生代码的同一个块里执行
    // （否则 const/let 定义的变量拿不到），但 Promise 对象一产生就可以拿到块外 await。
    // 所以这里同步 eval 收集结果，遇到 Promise 就先记为待定，最后统一等待。
    const checkSrc = checks.map((c, i) => {
      const expr = JSON.stringify(String(c));
      return `
  {
    var __r = { i: ${i}, ok: false, expr: ${expr} };
    try {
      // await 让返回 Promise 的检查项（异步题）也能正确判分；
      // 非 Promise 的值 await 一下没有副作用，所以统一写 await
      var __v = await (${c});
      window.__AL__.settle(__r, __v);
      window.__AL__.results.push(__r);
    } catch (e) {
      __r.err = String((e && e.message) || e);
      window.__AL__.results.push(__r);
    }
  }`;
    }).join('');

    // 函数题：把学生定义的函数抓出来，逐个用例调用比对返回值
    let fnSrc = '';
    if (func && cases.length) {
      fnSrc = `
  {
    var __fn = null;
    try {
      if (typeof ${func} === 'function') __fn = ${func};
    } catch (e) { /* 未定义，保持 null */ }
    if (!__fn) {
      window.__AL__.fnMissing = true;
    } else {
      var __cs = ${JSON.stringify(cases)};
      for (var __i = 0; __i < __cs.length; __i++) {
        var __c = __cs[__i];
        var __one = { args: __c.args, expect: window.__AL_show(__c.expect) };
        try {
          var __got = __fn.apply(null, __c.args);
          __one.got = window.__AL_show(__got);
          __one.ok = !!window.__AL_eq(__got, __c.expect);
        } catch (e) {
          __one.got = '报错';
          __one.ok = false;
          __one.err = String((e && e.message) || e);
        }
        window.__AL__.fnResults.push(__one);
      }
    }
  }`;
    }

    // 学生 JS 一个脚本、检查一个脚本会丢失 const/let 的作用域，
    // 所以学生代码、函数抓取、检查项必须在**同一个**脚本里。
    // 前面单独放一个 jsStart = false 的探针，用来识别"JS 语法错误导致整段没跑"。
    const body = [];
    if (js !== '') body.push('<script>window.__AL__.jsStart = false;<\/script>');
    // async IIFE：作用域完整（学生的 const/let 检查项都能访问），且检查项可以 await ——
    // 异步用例（setTimeout、debounce）因此能依次等待，不会互相干扰
    body.push('<script>window.__AL__.jsStart = true;\n(async function () {\ntry {');
    if (js !== '') body.push('\n' + js + '\n');
    // 抓函数和跑检查都在 try 内部：学生用 const/let 定义的箭头函数
    // 只在当前块可见，挪到块外就抓不到了
    if (fnSrc) body.push(fnSrc);
    if (checkSrc) body.push(checkSrc);
    body.push('} catch (e) { window.__AL__.runtimeErr = String((e && e.message) || e); }');
    body.push('window.__AL__.done = true;');
    body.push('window.__AL__.report();');
    body.push('})();<\/script>');

    return `<!doctype html>
<html lang="zh">
<head>
<meta charset="utf-8">
<style>
  /* rem 基准固定为 16px：浏览器默认值就是 16px，教材也按 16px 讲，
     不锁死的话学生写 1.5rem 会算出各种意想不到的值 */
  html { font-size: 16px; }
  /* padding 保持 0：否则 body 内容宽度比视口窄 16px，
     百分比宽度算出来的值和 clientWidth 对不上，判断题的容差很难写 */
  body { margin:0; padding:0; font:14px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"PingFang SC","Microsoft YaHei",sans-serif; color:#1f2937; background:#fff; }
  * { box-sizing:border-box; }
${css}
</style>
<script>${HARNESS.split('__TOKEN__').join(o.token)}<\/script>
</head>
<body>
${html}
${body.join('\n')}
<script>
// 兜底：万一 async IIFE 因死循环或异常没跑到 report，超时也要回传一次
setTimeout(function () { window.__AL__.report(); }, 4000);
<\/script>
</body>
</html>`;
  }

  /* ================= 执行 ================= */

  /**
   * 在隐藏 iframe 里跑一次，拿到结构化结果
   * @returns {Promise<{log:string[], err:string|null, results:Array, fnResults:Array}>}
   */
  /* ---- 判分沙箱：常驻 iframe ----
   *
   * 为什么必须复用同一个 iframe 而不是每次新建：
   * 动态创建 + 立刻写 srcdoc 的 iframe，Chrome 有时根本不给它布局 ——
   * 文档里 window.innerWidth 恒为 0，getComputedStyle 返回声明值（'100%'）而非真实像素，
   * 于是媒体查询时灵时不灵、百分比宽度算不出来，判分结果随机。
   * 另外：完全透明（opacity:0）和离屏（left:-99999px）都会让 Chrome 跳过渲染，
   * 所以这里用 opacity:0.01 + 视口内定位，肉眼看不见但布局照常发生。
   */
  let sandboxFrame = null;
  let frameReady = null;
  let queue = Promise.resolve();

  function ensureFrame() {
    if (frameReady) return frameReady;
    const f = document.createElement('iframe');
    f.setAttribute('sandbox', 'allow-scripts allow-modals');
    f.setAttribute('aria-hidden', 'true');
    f.style.cssText = ('position:fixed;left:0;top:0;width:900px;height:700px;'
      + 'border:0;opacity:0.01;pointer-events:none;z-index:-2147483647;');
    f.srcdoc = '<!doctype html><body></body>';
    document.body.appendChild(f);
    sandboxFrame = f;
    // 刚挂上去还没布局，立刻判分会拿到 0 宽视口。给它时间完成首次布局，
    // 之后复用就一直稳定了。
    frameReady = new Promise(r => setTimeout(r, 400));
    return frameReady;
  }

  function exec(o) {
    // 串行：常驻 iframe 只有一个，并发会互相覆盖
    const run = () => ensureFrame().then(() => new Promise((resolve) => {
      const token = newToken();
      let settled = false;
      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        pending.delete(token);
        resolve({ log: [], err: 'TIMEOUT', results: [], fnResults: [] });
      }, 5000);

      pending.set(token, (payload) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(payload);
      });

      const doc = buildDoc({ ...o, token });
      // 内容相同则不会触发重新加载，先置空逼它重新导航一次
      sandboxFrame.srcdoc = '';
      sandboxFrame.srcdoc = doc;
    }));
    queue = queue.then(run, run);
    return queue;
  }

  /**
   * 静态检查（HTML / CSS / DOM 题）
   * @param {string} html 学生写的 HTML（或题目给的固定 HTML）
   * @param {string} css  学生写的 CSS
   * @param {string} js   学生写的 JS
   * @param {string[]} checks 检查表达式数组
   */
  function checkStatic(html, css, js, checks) {
    return exec({ html, css, js, checks: checks || [] });
  }

  /**
   * JS 函数题判分：真调用学生写的函数，逐用例比对返回值
   * @param {string} code 学生代码
   * @param {string} funcName 函数名
   * @param {Array<{args:Array, expect:any}>} cases
   */
  function checkFunction(code, funcName, cases, html, css) {
    // html/css 必须一起传：DOM 题靠题目给的结构（html:）才能 querySelector 到元素，
    // 只传 js 的话文档是空的，学生写的函数必然拿到 null。
    return exec({ js: code, func: funcName, cases: cases || [], html: html || '', css: css || '' });
  }

  /* ================= 预览 ================= */

  /**
   * 把 html/css/js 渲染进指定的 iframe（实时预览用）
   * @param {HTMLIFrameElement} frame
   * @param {{html?:string,css?:string,js?:string}} o
   */
  function preview(frame, o) {
    const token = newToken();
    frame.setAttribute('sandbox', 'allow-scripts allow-modals');
    frame.srcdoc = buildDoc({
      html: o.html || '',
      css: o.css || '',
      js: o.js || '',
      checks: [],
      token
    });
    // 预览的错误信息也给出来 —— 学生能立刻看到为什么一片空白
    return new Promise((resolve) => {
      const t = setTimeout(() => resolve(null), 4000);
      pending.set(token, (p) => { clearTimeout(t); resolve(p); });
    });
  }

  return { exec, checkStatic, checkFunction, preview, buildDoc };
})();
