/**
 * 一键在 VS Code 里打开代码
 *
 * 浏览器无法直接把文件写进用户磁盘，也无法知道该写到哪个目录，
 * 所以采用「下载 .py + 复制源码 + 唤起 VS Code」三步组合：
 *   1. 源码进剪贴板（Ctrl+V 即可粘贴）
 *   2. 同名 .py 下载到用户的下载目录
 *   3. 用 vscode:// 协议尝试唤起已安装的 VS Code
 * 这样无论 VS Code 是否响应，用户都能在 3 秒内开始编辑。
 */
const VSCode = (() => {

  /** 唤起已安装的 VS Code（装了会响应，没装则浏览器提示或静默失败） */
  function launch() {
    try {
      const a = document.createElement('a');
      a.href = 'vscode://';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) { /* 唤起失败不影响其他两步 */ }
  }

  function download(code, filename) {
    try {
      const blob = new Blob([code], { type: 'text/x-python;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
      return true;
    } catch (e) { return false; }
  }

  async function copy(code) {
    try {
      await navigator.clipboard.writeText(code);
      return true;
    } catch (e) {
      // 退路：选中一个临时 textarea
      try {
        const ta = document.createElement('textarea');
        ta.value = code;
        ta.style.cssText = 'position:fixed;top:-9999px;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        ta.remove();
        return ok;
      } catch (e2) { return false; }
    }
  }

  /**
   * 主入口
   * @param {string} code 源码
   * @param {string} filename 文件名，如 main.py
   */
  async function open(code, filename) {
    const name = filename || 'main.py';
    const L = window.I18N.vscode || {};
    const copied = await copy(code);
    const dl = download(code, name);
    launch();
    toast((copied ? L.copied : L.copyFail) + (dl ? ' ' + L.downloaded : ''));
    return { copied, dl };
  }

  /** 网页版 VS Code（无需安装） */
  function openWeb() {
    window.open('https://vscode.dev/', '_blank', 'noopener');
  }

  function toast(m) { window.__toast && window.__toast(m); }

  return { open, openWeb, launch, download, copy };
})();
