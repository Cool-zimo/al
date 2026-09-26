/**
 * 内嵌代码实验室（IDE）
 *
 * 布局（按需求定制）：
 *   左侧  文件资源管理器（本课示例 / 我的代码）
 *   右上  编辑器（带行号）
 *   右下  终端
 *
 * 为什么终端默认用 Pyodide 而不是 Compiler Explorer：
 *   CE 上 python 分组的默认编译器其实是 Codon（AOT 编译器，只出汇编、不支持执行），
 *   打开就会报 "does not support execution"，对教学完全不可用。
 *   真正能跑的是 executor python312。而 Pyodide 是真 CPython 跑在本地，
 *   print / input / 中文全都正常，还断网可用。
 *   所以：本地内核做默认引擎，Godbolt 作为「高级验证」在新标签页打开。
 */
const IDE = (() => {
  const K_FILES = Store.K.IDE_FILES;

  function userFiles() { return Store.get(K_FILES, {}) || {}; }
  function textOf(v) { return typeof v === 'string' ? v : (v?.text || ''); }

  function putFile(name, code) {
    Store.update(K_FILES, {}, f => {
      f[name] = { text: code, updatedAt: new Date().toISOString() };
      return f;
    });
  }
  function delFile(name) {
    Store.update(K_FILES, {}, f => { delete f[name]; return f; });
  }

  /** 构造文件树：本课示例（只读）+ 我的代码（可增删改） */
  function buildTree(blocks) {
    const tree = [];
    let n = 0;
    (blocks || []).forEach(b => {
      if (b.lang === 'python' || b.lang === 'py') {
        n++;
        tree.push({ id: 'ex:' + n, name: `示例 ${n}.py`, code: b.code, group: 'lesson' });
      }
    });
    Object.keys(userFiles()).sort((a, b) => a.localeCompare(b))
      .forEach(name => {
        tree.push({ id: 'my:' + name, name, code: textOf(userFiles()[name]), group: 'mine' });
      });
    return tree;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function mkBtn(text, cls) {
    const b = document.createElement('button');
    b.className = cls; b.textContent = text; return b;
  }
  function toast(m) { window.__toast && window.__toast(m); }

  /**
   * 创建 IDE 面板
   * @param {{blocks?:Array, lessonKey?:string}} opts
   * @returns {HTMLElement} 面板元素，带 .api.open(code,name) / .api.focus()
   */
  function create(opts) {
    const L = window.I18N.ide;
    const blocks = opts?.blocks || [];
    const lessonKey = opts?.lessonKey || '';

    let tree = buildTree(blocks);
    let cur = tree[0] || null;
    let dirty = false;
    let running = false;
    let engine = localStorage.getItem('al:ideEngine') || 'pyodide';

    const root = document.createElement('div');
    root.className = 'ide';

    /* ================= 顶栏 ================= */
    const bar = document.createElement('div');
    bar.className = 'ide-bar';

    const btnRun = document.createElement('button');
    btnRun.className = 'ide-run';
    btnRun.innerHTML = '▶ <b>' + L.run + '</b>';
    btnRun.title = L.runTip;
    bar.appendChild(btnRun);

    const sep = document.createElement('span');
    sep.className = 'ide-sep';
    bar.appendChild(sep);

    const btnNew = mkBtn('＋ ' + L.newFile, 'ide-btn');
    const btnSave = mkBtn(L.save, 'ide-btn');
    const btnDel = mkBtn(L.delete, 'ide-btn danger');
    const btnCE = mkBtn('Godbolt ↗', 'ide-btn ghost');
    btnCE.title = L.ceTip;
    bar.appendChild(btnNew);
    bar.appendChild(btnSave);
    bar.appendChild(btnDel);
    bar.appendChild(btnCE);

    const badge = document.createElement('span');
    badge.className = 'ide-badge';
    badge.textContent = engine === 'godbolt' ? '⚙️ ' + L.engineCE : '🐍 ' + L.engineLocal;
    badge.title = L.engineTip;
    badge.onclick = () => {
      engine = engine === 'pyodide' ? 'godbolt' : 'pyodide';
      localStorage.setItem('al:ideEngine', engine);
      badge.textContent = engine === 'godbolt' ? '⚙️ ' + L.engineCE : '🐍 ' + L.engineLocal;
      toast(engine === 'godbolt' ? L.switchedCE : L.switchedLocal);
    };
    bar.appendChild(badge);

    const btnClose = mkBtn('✕', 'ide-btn ghost ide-close');
    btnClose.title = L.close;
    bar.appendChild(btnClose);

    root.appendChild(bar);

    /* ================= 主体 ================= */
    const body = document.createElement('div');
    body.className = 'ide-body';
    root.appendChild(body);

    /* 左：文件资源管理器 */
    const side = document.createElement('div');
    side.className = 'ide-side';
    const sideHead = document.createElement('div');
    sideHead.className = 'ide-side-head';
    sideHead.textContent = L.explorer;
    side.appendChild(sideHead);
    const fileList = document.createElement('div');
    fileList.className = 'ide-files';
    side.appendChild(fileList);
    body.appendChild(side);

    /* 右：编辑器 + 终端 */
    const right = document.createElement('div');
    right.className = 'ide-right';
    body.appendChild(right);

    const edHead = document.createElement('div');
    edHead.className = 'ide-pane-head';
    edHead.innerHTML = `<span class="ide-pane-title">${L.editor}</span>`;
    const curName = document.createElement('span');
    curName.className = 'ide-curname';
    edHead.appendChild(curName);

    const edWrap = document.createElement('div');
    edWrap.className = 'ide-editor';
    const gutter = document.createElement('div');
    gutter.className = 'ide-gutter';
    const ta = document.createElement('textarea');
    ta.className = 'ide-ta';
    ta.spellcheck = false;
    ta.autocapitalize = 'off';
    ta.setAttribute('autocomplete', 'off');
    edWrap.appendChild(gutter);
    edWrap.appendChild(ta);

    right.appendChild(edHead);
    right.appendChild(edWrap);

    const term = document.createElement('div');
    term.className = 'ide-term';
    const termHead = document.createElement('div');
    termHead.className = 'ide-pane-head';
    termHead.innerHTML = `<span class="ide-pane-title">💻 ${L.term}</span>`;
    const btnClr = mkBtn(L.clear, 'ide-mini');
    termHead.appendChild(btnClr);
    const termBody = document.createElement('div');
    termBody.className = 'ide-term-body';
    term.appendChild(termHead);
    term.appendChild(termBody);
    right.appendChild(term);

    /* ================= 文件树渲染 ================= */
    function renderTree() {
      fileList.innerHTML = '';
      const groups = [
        { key: 'lesson', label: L.groupLesson, items: tree.filter(f => f.group === 'lesson') },
        { key: 'mine', label: L.groupMine, items: tree.filter(f => f.group === 'mine') }
      ];
      for (const g of groups) {
        const h = document.createElement('div');
        h.className = 'ide-group';
        h.textContent = g.label;
        fileList.appendChild(h);

        if (!g.items.length) {
          const e = document.createElement('div');
          e.className = 'ide-empty';
          e.textContent = g.key === 'mine' ? L.noFiles : L.noExamples;
          fileList.appendChild(e);
          continue;
        }
        for (const f of g.items) {
          const it = document.createElement('button');
          it.className = 'ide-file' + (cur && cur.id === f.id ? ' active' : '');
          it.innerHTML = `<span class="ico">${f.group === 'lesson' ? '📄' : '🐍'}</span>` +
            `<span class="nm">${escapeHtml(f.name)}</span>` +
            (f.dirty ? '<span class="dot">●</span>' : '');
          if (f.group === 'lesson') it.title = L.readonly;
          it.onclick = () => select(f.id);
          fileList.appendChild(it);
        }
      }
      curName.textContent = cur ? cur.name : L.noFile;
    }

    function select(id) {
      const next = tree.find(f => f.id === id);
      if (!next) return;
      // 离开当前文件时，若是"我的代码"且有改动则落盘，避免丢字
      if (cur && dirty && cur.group === 'mine') {
        cur.code = ta.value; cur.dirty = false;
        putFile(cur.name, cur.code);
      }
      cur = next; dirty = false;
      ta.value = next.code;
      syncGutter();
      renderTree();
      ta.focus();
    }

    function syncGutter() {
      const n = ta.value.split('\n').length;
      const arr = [];
      for (let i = 1; i <= n; i++) arr.push(i);
      gutter.textContent = arr.join('\n');
    }

    ta.addEventListener('scroll', () => { gutter.scrollTop = ta.scrollTop; });
    ta.addEventListener('input', () => { dirty = true; syncGutter(); if (cur) cur.dirty = true; });
    ta.addEventListener('keydown', e => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const s = ta.selectionStart, t = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + '    ' + ta.value.slice(t);
        ta.selectionStart = ta.selectionEnd = s + 4;
        dirty = true; syncGutter();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault(); run();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault(); btnSave.click();
      }
    });

    /* ================= 终端 ================= */
    const writer = {
      write(cls, txt) {
        const s = document.createElement('span');
        s.className = cls || '';
        s.textContent = txt;
        termBody.appendChild(s);
        termBody.scrollTop = termBody.scrollHeight;
      },
      end(ms) {
        if (ms) writer.write('ok', `\n— ${L.done} ${ms} ms\n`);
        running = false;
        btnRun.disabled = false;
        btnRun.innerHTML = '▶ <b>' + L.run + '</b>';
      }
    };
    btnClr.onclick = () => { termBody.innerHTML = ''; };

    async function run() {
      if (running) return;
      running = true;
      btnRun.disabled = true;
      btnRun.innerHTML = L.running;
      termBody.innerHTML = '';

      const name = cur ? cur.name : 'main.py';
      writer.write('sys', `$ python ${name}\n`);

      if (engine === 'godbolt') {
        writer.write('sys', L.loadingCE + '\n');
        const box = document.createElement('div');
        box.className = 'ide-ce';
        termBody.appendChild(box);
        const ok = await Godbolt.embed(box, ta.value);
        if (ok) { writer.end(0); return; }
        box.remove();
        writer.write('sys', L.ceFail + '\n');
      }
      try {
        await Runner.run(ta.value, `ide:${lessonKey}:${name}`, writer);
      } catch (e) {
        writer.write('err', String(e.message || e));
        writer.end(0);
      }
    }
    btnRun.onclick = run;

    /* ================= 文件操作 ================= */
    btnNew.onclick = () => {
      const name = (prompt(L.newFilePrompt, 'main.py') || '').trim();
      if (!name) return;
      if (userFiles()[name]) return toast(L.exists);
      putFile(name, '# ' + name + '\n');
      tree = buildTree(blocks);
      select('my:' + name);
      toast(L.created);
      if (window.__sync) window.__sync.schedulePush();
    };

    btnSave.onclick = () => {
      if (!cur) return;
      if (cur.group === 'lesson') {
        // 示例只读，另存为"我的代码"
        const name = (prompt(L.saveAs, 'my_' + cur.name) || '').trim();
        if (!name) return;
        putFile(name, ta.value);
        tree = buildTree(blocks);
        select('my:' + name);
      } else {
        putFile(cur.name, ta.value);
        dirty = false; cur.dirty = false;
        renderTree();
      }
      toast(L.saved);
      if (window.__sync) window.__sync.schedulePush();
    };

    btnDel.onclick = () => {
      if (!cur || cur.group !== 'mine') return toast(L.cannotDelete);
      if (!confirm(L.confirmDelete + ' ' + cur.name)) return;
      delFile(cur.name);
      tree = buildTree(blocks);
      cur = tree[0] || null;
      ta.value = cur ? cur.code : '';
      dirty = false;
      syncGutter();
      renderTree();
      if (window.__sync) window.__sync.schedulePush();
    };

    btnCE.onclick = () => {
      window.open(Godbolt.buildUrl(ta.value), '_blank', 'noopener');
      toast(L.ceToast);
    };

    /* ================= 初始化 ================= */
    syncGutter();
    renderTree();
    writer.write('sys', L.welcome + '\n');

    root.api = {
      /** 把一段代码塞进实验室并打开（供代码块上的"实验室"按钮调用） */
      open(code, name) {
        const fname = name || 'snippet.py';
        putFile(fname, code);
        tree = buildTree(blocks);
        const f = tree.find(x => x.id === 'my:' + fname);
        if (f) select(f.id);
        toast(L.opened);
      },
      focus() { ta.focus(); },
      close() { /* 由外部绑定 */ }
    };
    root._btnClose = btnClose;

    return root;
  }

  return { create, buildTree, putFile, delFile, userFiles, K_FILES };
})();
