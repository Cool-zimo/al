/**
 * Compiler Explorer（Godbolt）集成
 *
 * 原理：CE 官方支持 GET /clientstate/<base64> —— 把 ClientState JSON 做 base64
 * 编码直接拼在 URL 上，就能还原出一个预设好的会话（语言、源码、执行器）。
 * 文档：https://github.com/compiler-explorer/compiler-explorer/blob/main/docs/API.md
 *
 * 好处：不发 POST、不占后端、不依赖 CORS，纯静态站就能"定制"出一块 CE。
 *
 * ⚠️ 关键坑（实测）：CE 上 python 分组的**默认编译器是 Codon**，
 *    它是 AOT 编译器，只出汇编、不支持执行，打开就报
 *    "This compiler (Codon 0.19.2) does not support execution"。
 *    真正能跑 Python 的是 **executor python312**（Python 3.12）。
 *    所以这里统一用 python312，并在 URL 里显式带上 executors。
 */
const Godbolt = (() => {
  // 能真正执行 Python 的 executor id（不是默认编译器）
  const PY_ID = 'python312';
  const CE_BASE = 'https://godbolt.org';
  const PY_BASE = 'https://python.godbolt.org';   // Python 专用实例，界面更干净

  /** UTF-8 安全的 base64 */
  function b64(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = '';
    const CHUNK = 0x8000;
    for (let i = 0; i < bytes.length; i += CHUNK) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
    }
    return btoa(bin);
  }

  /** URL 里 + / = 必须转义，否则会被当成路径或截断 */
  function b64url(str) {
    return b64(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  /**
   * 构造 ClientState
   * - compilers 留空：Python 也用不上汇编面板
   * - executors 指定 python312：打开即执行，直接看到 stdout
   */
  function buildState(code) {
    return {
      sessions: [{
        id: 1,
        language: 'python',
        source: code,
        compilers: [],
        executors: [{
          compiler: { id: PY_ID, libs: [], options: '' },
          arguments: '',
          stdin: ''
        }]
      }]
    };
  }

  /** 完整 CE 链接（新窗口打开用这个） */
  function buildUrl(code) {
    return `${PY_BASE}/clientstate/${b64url(JSON.stringify(buildState(code)))}`;
  }

  /**
   * 在容器里嵌入一个 CE 面板
   * 返回 Promise<boolean>：true=嵌入成功，false=被拒绝（调用方应降级到本地内核）
   */
  function embed(container, code) {
    return new Promise(resolve => {
      container.innerHTML = '';
      const f = document.createElement('iframe');
      f.setAttribute('title', 'Compiler Explorer');
      f.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
      f.style.cssText = 'width:100%;height:100%;min-height:260px;border:0;display:block';
      f.src = buildUrl(code);
      container.appendChild(f);

      let settled = false;
      const finish = ok => { if (!settled) { settled = true; resolve(ok); } };
      f.addEventListener('load', () => setTimeout(() => finish(true), 600));
      f.addEventListener('error', () => finish(false));
      // 被 X-Frame-Options 拒绝时 load 也可能触发，故再留一段观察期
      setTimeout(() => { if (!settled) finish(false); }, 7000);
    });
  }

  return { buildUrl, embed, PY_ID };
})();
