/**
 * 题目引擎
 *
 * 题型（在 .md 里用 ```quiz 围栏书写）：
 *   choice  选择题   —— 单选/多选，即时判分
 *   fill    填空题   —— 关键词匹配（大小写/空格不敏感）
 *   code    程序题   —— 在 Pyodide 里真跑 assert，通过了才算会
 *   project 小项目   —— 开放式，给验收清单自评
 *
 * 设计原则：判分全部在浏览器本地完成，不上传答案；
 * 但「做过/做对」的结果会记入进度，参与艾宾浩斯复习调度。
 */
const Quiz = (() => {
  const Q = () => window.I18N.quiz;


  /* ================= 解析 ================= */

  /** 极简 YAML-ish 解析：支持 key: value、key: | 块、key: 后的 - 列表 */
  function parse(src) {
    const data = {};
    const lines = src.split('\n');
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const m = line.match(/^(\w+)\s*:\s*(.*)$/);
      if (!m) { i++; continue; }
      const key = m[1];
      let val = m[2];

      if (val === '|' || val === '>') {          // 多行块
        const buf = [];
        i++;
        while (i < lines.length && (/^\s{2,}/.test(lines[i]) || lines[i].trim() === '')) {
          if (lines[i].trim() !== '') buf.push(lines[i].replace(/^\s{2}/, ''));
          i++;
        }
        data[key] = buf.join('\n');
        continue;
      }

      if (val === '') {                          // 列表
        const buf = [];
        i++;
        while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
          buf.push(lines[i].replace(/^\s*-\s+/, '').trim());
          i++;
        }
        data[key] = buf;
        continue;
      }

      data[key] = val.trim();
      i++;
    }
    return data;
  }

  /** 从 markdown 里抽出所有 quiz 块 */
  function extractBlocks(md) {
    const out = [];
    const re = /```quiz\n([\s\S]*?)```/g;
    let m;
    while ((m = re.exec(md)) !== null) out.push(parse(m[1]));
    return out;
  }

  /* ================= 渲染 ================= */

  function render(q, index, ctx) {
    const id = ctx.key + ':' + index;
    const box = document.createElement('div');
    box.className = 'quiz';
    box.dataset.quizId = id;
    box.dataset.type = q.type || 'choice';

    const saved = getResult(id);
    if (saved) box.classList.add(saved.ok ? 'passed' : 'attempted');

    const head = document.createElement('div');
    head.className = 'quiz-head';
    const q0 = Q();
    const badge = ({
      choice: q0.choice, fill: q0.fill, code: q0.code,
      function: q0.function || q0.code, project: q0.project,
      local: q0.local || q0.project
    })[q.type] || '练习';
    head.innerHTML = `<span class="quiz-badge">${badge}</span><span class="quiz-q">${escapeHtml(q.q || '')}</span>`;
    box.appendChild(head);

    // 题干引用的示例代码（只读展示）—— 之前代码写在 q: 后面会被解析吞掉，
    // 导致"下面这段代码运行结果是什么？"却看不到代码
    if (q.code) {
      const pre = document.createElement('div');
      pre.className = 'quiz-snippet';
      pre.innerHTML = `<pre><code>${escapeHtml(String(q.code).replace(/\n$/, ''))}</code></pre>`;
      box.appendChild(pre);
    }

    const body = document.createElement('div');
    body.className = 'quiz-body';
    box.appendChild(body);

    const foot = document.createElement('div');
    foot.className = 'quiz-foot';
    box.appendChild(foot);

    ({
      choice: renderChoice, fill: renderFill, code: renderCode,
      function: renderFunction, project: renderProject, local: renderLocal
    }[q.type] || renderChoice)(q, body, foot, id, ctx);

    return box;
  }

  /* --- 函数题：真正调用用户写的函数，比对返回值 --- */
  function renderFunction(q, body, foot, id, ctx) {
    const starter = q.starter || '';
    const funcName = (q.func || '').trim();
    const cases = parseCases(q.cases || '');

    const wrap = document.createElement('div');
    wrap.className = 'quiz-code';
    const ta = document.createElement('textarea');
    ta.className = 'quiz-ta';
    ta.spellcheck = false;
    ta.value = starter;
    wrap.appendChild(ta);
    body.appendChild(wrap);

    const out = document.createElement('div');
    out.className = 'quiz-out';
    body.appendChild(out);

    const btnRun = mkBtn(Q().run, 'primary');
    const btnHint = mkBtn(Q().hint, 'ghost');
    const btnReset = mkBtn(Q().reset, 'ghost');

    btnReset.onclick = () => { ta.value = starter; out.className = 'quiz-out'; out.textContent = ''; };
    btnHint.onclick = () => {
      out.className = 'quiz-out show hint';
      out.textContent = '💡 ' + (q.hint || Q().noHint);
    };

    btnRun.onclick = async () => {
      btnRun.disabled = true;
      btnRun.textContent = Q().running;
      out.className = 'quiz-out show';
      out.textContent = Q().running;

      const r = await Runner.execFunction(ta.value, funcName, cases, 'fn:' + id);

      if (r.error) {
        out.className = 'quiz-out show err';
        out.textContent = '❌ ' + r.error;
        finish(id, false, q, foot, null);
        btnRun.disabled = false;
        btnRun.textContent = Q().retry;
        return;
      }

      const pass = r.results.filter(x => x.ok).length;
      const ok = r.ok;
      const zh = window.I18N.lang === 'zh';
      const lines = r.results.map(x => {
        const flag = x.ok ? '✅' : '❌';
        // 区间用例（随机函数）：args 是空串，got 里已经写了"调用了 N 次"的摘要
        if (x.isRange) {
          if (x.ok) return `${flag} ${x.got}`;
          return `${flag} ${x.got || (x.error || (zh ? '报错' : 'error'))}`;
        }
        let s = `${flag} ${funcName}(${x.args.slice(1, -1)})`;
        if (x.ok) s += ` → ${x.got}`;
        else s += `  ${zh ? '期望' : 'expected'} ${fmtExpect(x.expectRaw ?? x.expect)}，${zh ? '实际' : 'got'} ${x.got === null ? (x.error || (zh ? '报错' : 'error')) : x.got}`;
        return s;
      });
      out.className = 'quiz-out show ' + (ok ? 'ok' : 'err');
      out.textContent = lines.join('\n') +
        `\n\n${pass} / ${r.results.length} ` + (window.I18N.lang === 'zh' ? '个用例通过' : 'cases passed');

      finish(id, ok, q, foot, null);
      if (ok) { btnRun.textContent = Q().passed; }
      else { btnRun.disabled = false; btnRun.textContent = Q().retry; }
    };

    foot.appendChild(btnRun);
    if (q.hint) foot.appendChild(btnHint);
    foot.appendChild(btnReset);

    const saved = getResult(id);
    if (saved && saved.ok) { btnRun.textContent = Q().passed; }
  }

  /**
   * 按逗号切分参数，但忽略括号内部的逗号。
   * 为什么必须这样：用例里会写数组参数，比如 [1,2,3] -> [2,4,6]，
   * 直接按逗号切会得到 ["[1", "2", "3]"] 这种残片。
   */
  function splitArgs(s) {
    const out = [];
    let depth = 0, cur = '';
    for (const ch of String(s)) {
      if (ch === '[' || ch === '(' || ch === '{') depth++;
      else if (ch === ']' || ch === ')' || ch === '}') depth--;
      if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; }
      else cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }

  /** 解析用例：每行 "参数 -> 期望值"，值用 Python 字面量写法（支持列表） */
  /**
   * 解析用例表。每行形如「参数 -> 期望」。
   *
   * 两种额外语法，用来判**带随机性的函数**（掷骰子、洗牌、抽样……）——
   * 这类函数每次返回值都不同，没法用精确值比对：
   *
   *   1) `*N` 前缀：把这个用例重复调用 N 次
   *      `*20 -> 1..6`     无参调用 20 次
   *   2) `a..b` 期望：每次结果都落在 [a, b] 区间内
   *
   * 两者合起来就是"掷 20 次骰子，每次都得是 1~6"。
   * 只判范围还挡不住 `return 3` 这种假随机，所以区间用例还会检查
   * **结果是否真的出现了多种不同的值**（具体规则见 runner.js）。
   */
  function parseCases(block) {
    if (Array.isArray(block)) block = block.join('\n');
    return String(block || '').split('\n')
      .map(l => l.trim())
      .filter(l => l && l.includes('->'))
      .map(line => {
        const idx = line.indexOf('->');
        let argStr = line.slice(0, idx).trim();
        const expStr = line.slice(idx + 2).trim();

        // `*N` 重复调用标记：可以带参数，如 `*20, 3 -> ...`，也可以单独出现
        let repeat = 1;
        const m = /^\*(\d+)\s*(?:,\s*(.*))?$/.exec(argStr);
        if (m) {
          repeat = parseInt(m[1], 10) || 1;
          argStr = (m[2] || '').trim();
        }
        const args = argStr === '' ? [] : splitArgs(argStr).map(s => literal(s.trim()));

        // `a..b` 区间期望
        const r = /^(-?\d+(?:\.\d+)?)\s*\.\.\s*(-?\d+(?:\.\d+)?)$/.exec(expStr);
        const expect = r
          ? { range: [parseFloat(r[1]), parseFloat(r[2])] }
          : literal(expStr);

        const c = { args, expect };
        if (repeat > 1) c.repeat = repeat;
        return c;
      });
  }

  /** 把用例的期望值渲染成人能读的文字 */
  function fmtExpect(e) {
    if (e && typeof e === 'object' && Array.isArray(e.range)) {
      const [a, b] = e.range;
      return window.I18N.lang === 'zh'
        ? `结果落在 ${a} ~ ${b}`
        : `result in ${a} .. ${b}`;
    }
    return typeof e === 'string' ? e : JSON.stringify(e);
  }

  /** 把 Python 字面量写法转成 JS 值 */
  function literal(s) {
    if (/^-?\d+$/.test(s)) return parseInt(s, 10);
    if (/^-?\d*\.\d+$/.test(s)) return parseFloat(s);
    if (s === 'True') return true;
    if (s === 'False') return false;
    if (s === 'None') return null;
    if (/^".*"$/.test(s)) return s.slice(1, -1);
    if (/^'.*'$/.test(s)) return s.slice(1, -1);
    if (/^[[{]/.test(s)) {
      try { return JSON.parse(s.replace(/'/g, '"')); } catch (e) { /* 落到底下当字符串 */ }
      try { return JSON.parse(s); } catch (e2) { /* 再试一次原样 */ }
    }
    return s;
  }

  /* --- 选择题 --- */
  function renderChoice(q, body, foot, id, ctx) {
    const opts = q.options || [];
    const multi = String(q.multi || '').toLowerCase() === 'true';
    const answers = String(q.answer ?? '0').split(',').map(s => parseInt(s.trim(), 10));

    const list = document.createElement('div');
    list.className = 'quiz-options';
    opts.forEach((text, i) => {
      const row = document.createElement('label');
      row.className = 'quiz-opt';
      row.innerHTML =
        `<input type="${multi ? 'checkbox' : 'radio'}" name="${id}" value="${i}">` +
        `<span>${escapeHtml(text)}</span>`;
      list.appendChild(row);
    });
    body.appendChild(list);

    const btn = mkBtn(Q().submit, 'primary');
    btn.onclick = () => {
      const picked = [...list.querySelectorAll('input:checked')].map(x => +x.value).sort();
      if (!picked.length) return toast(Q().pickFirst);
      const ok = picked.length === answers.length && picked.every((v, i) => v === answers[i]);
      finish(id, ok, q, foot, () => {
        list.querySelectorAll('input').forEach((inp, i) => {
          const row = inp.closest('.quiz-opt');
          if (answers.includes(i)) row.classList.add('correct');
          else if (inp.checked) row.classList.add('wrong');
          inp.disabled = true;
        });
      });
      btn.disabled = true;
    };
    foot.appendChild(btn);
  }

  /* --- 填空题 --- */
  function renderFill(q, body, foot, id, ctx) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'quiz-input';
    input.placeholder = q.placeholder || Q().fill;
    body.appendChild(input);

    const btn = mkBtn(Q().submit, 'primary');
    btn.onclick = () => {
      const norm = s => String(s).trim().toLowerCase().replace(/\s+/g, '');
      const accepts = String(q.answer || '').split('|').map(norm);
      const ok = accepts.includes(norm(input.value));
      input.disabled = true;
      input.classList.add(ok ? 'correct' : 'wrong');
      finish(id, ok, q, foot, () => {
        if (!ok) {
          const tip = document.createElement('div');
          tip.className = 'quiz-answer';
          tip.textContent = Q().refAnswer + String(q.answer).split('|')[0];
          body.appendChild(tip);
        }
      });
      btn.disabled = true;
    };
    foot.appendChild(btn);
    input.addEventListener('keydown', e => { if (e.key === 'Enter' && !btn.disabled) btn.click(); });
  }

  /* --- 程序题：真跑 assert --- */
  function renderCode(q, body, foot, id, ctx) {
    const starter = q.starter || '';
    const tests = q.tests || [];

    const wrap = document.createElement('div');
    wrap.className = 'quiz-code';

    // starter 里带 TODO 占位时，给它一个醒目标记 ——
    // 否则学生盯着一整段代码，根本看不出"要改的是最后那行 print"
    const hasTodo = /TODO/.test(starter);
    if (hasTodo) {
      const tip = document.createElement('div');
      tip.className = 'quiz-todo-tip';
      tip.innerHTML = '<b>✏️</b> ' + (Q().todoTip || '');
      body.appendChild(tip);
    }

    const ta = document.createElement('textarea');
    ta.className = 'quiz-ta';
    ta.spellcheck = false;
    ta.value = starter;
    wrap.appendChild(ta);
    body.appendChild(wrap);

    const out = document.createElement('div');
    out.className = 'quiz-out';
    body.appendChild(out);

    const btnRun = mkBtn(Q().run, 'primary');
    const btnHint = mkBtn(Q().hint, 'ghost');
    const btnReset = mkBtn(Q().reset, 'ghost');

    btnReset.onclick = () => { ta.value = starter; out.className = 'quiz-out'; out.textContent = ''; };
    btnHint.onclick = () => {
      out.className = 'quiz-out show hint';
      out.textContent = '💡 ' + (q.hint || Q().noHint);
    };

    btnRun.onclick = async () => {
      btnRun.disabled = true;
      btnRun.textContent = Q().running;
      out.className = 'quiz-out show';
      out.textContent = Q().running;

      const nsKey = 'quiz:' + id;
      // 题目若声明了 stdin（多行块），就喂给 input()；没声明则维持空串行为
      const r = await Runner.execWithTests(ta.value, tests, nsKey, q.stdin || null);

      if (r.ok) {
        out.className = 'quiz-out show ok';
        out.textContent = '✅ ' + Q().passed + '！' + (r.stdout ? '\n' + r.stdout : '');
        finish(id, true, q, foot, null);
        btnRun.textContent = Q().passed;
      } else {
        // 学生直接点运行、没动 starter 里的 TODO 占位：单独给一句人话，
        // 而不是甩一个看不懂的 AssertionError
        const todoLeft = hasTodo && /TODO/.test(ta.value) && /TODO/.test(r.stdout || '');
        out.className = 'quiz-out show err';
        if (todoLeft) {
          out.textContent = '✏️ ' + (Q().todoLeft || '') +
            (r.stdout ? '\n\n' + (window.I18N.lang === 'zh' ? '输出' : 'Output') + '：\n' + r.stdout : '');
        } else {
          out.textContent = '❌ ' + (r.error || Q().wrong) + (r.stdout ? '\n\n' + (window.I18N.lang==='zh'?'输出':'Output') + '：\n' + r.stdout : '');
        }
        finish(id, false, q, foot, null);
        btnRun.disabled = false;
        btnRun.textContent = Q().retry;
      }
    };

    foot.appendChild(btnRun);
    if (q.hint) foot.appendChild(btnHint);
    foot.appendChild(btnReset);

    const saved = getResult(id);
    if (saved && saved.ok) { btnRun.textContent = Q().passed; btnRun.disabled = false; }
  }

  /* --- 本地运行题：窗口/图形类，浏览器里跑不了，引导去 VSCode --- */
  function renderLocal(q, body, foot, id, ctx) {
    const starter = q.starter || '';

    // 为什么不能在线跑：tkinter / pygame / Qt 都需要真实窗口系统，
    // 浏览器沙箱里没有显示器也没有 GUI 后端，一运行就失败。
    const why = document.createElement('div');
    why.className = 'quiz-local-why';
    why.innerHTML = '<b>' + (Q().localWhyTitle || '') + '</b> ' + (Q().localWhy || '');
    body.appendChild(why);

    const wrap = document.createElement('div');
    wrap.className = 'quiz-code';
    const ta = document.createElement('textarea');
    ta.className = 'quiz-ta';
    ta.spellcheck = false;
    ta.value = starter;
    wrap.appendChild(ta);
    body.appendChild(wrap);

    const btnVS = mkBtn('💻 ' + (Q().localOpen || ''), 'primary');
    btnVS.onclick = async () => {
      const fname = (q.filename || 'gui_demo') + '.py';
      const r = await VSCode.open(ta.value, fname);
      btnVS.textContent = r && r.copied
        ? (Q().localOpened || '')
        : (Q().localDownloaded || '');
      setTimeout(() => btnVS.textContent = '💻 ' + (Q().localOpen || ''), 2200);
    };
    foot.appendChild(btnVS);

    // 验收清单：能不能跑、有没有窗口、对不对，由用户在本地确认
    const list = [].concat(q.checklist || q.checks || []);
    if (list.length) {
      const box = document.createElement('div');
      box.className = 'quiz-checks';
      const boxes = [];
      list.forEach(t => {
        const row = document.createElement('label');
        row.className = 'quiz-check';
        row.innerHTML = `<input type="checkbox"><span>${escapeHtml(t)}</span>`;
        box.appendChild(row);
        boxes.push(row.querySelector('input'));
      });
      body.appendChild(box);

      const btnDone = mkBtn(Q().done, 'ghost');
      btnDone.onclick = () => {
        const done = boxes.filter(b => b.checked).length;
        if (done < boxes.length) return toast(Q().remain(boxes.length - done));
        finish(id, true, q, foot, null);
        btnDone.textContent = Q().finished;
        btnDone.disabled = true;
        // 已经通过了就别再阻塞后续
        const nav = document.querySelector('.exam-nav .qbtn.primary');
        if (nav) nav.classList.add('pulse');
      };
      foot.appendChild(btnDone);
    } else {
      // 没有清单时给一个"我跑通了"直接确认
      const btnDone = mkBtn(Q().done, 'ghost');
      btnDone.onclick = () => {
        finish(id, true, q, foot, null);
        btnDone.textContent = Q().finished;
        btnDone.disabled = true;
      };
      foot.appendChild(btnDone);
    }

    const saved = getResult(id);
    if (saved && saved.ok) {
      const last = foot.lastElementChild;
      if (last) { last.textContent = Q().finished; last.disabled = true; }
    }
  }

  /* --- 小项目：验收清单自评 + 「能跑通」验证 --- */
  function renderProject(q, body, foot, id, ctx) {
    const checks = q.checklist || q.checks || [];
    const list = [].concat(checks || []);

    const wrap = document.createElement('div');
    wrap.className = 'quiz-checks';
    const boxes = [];
    list.forEach(text => {
      const row = document.createElement('label');
      row.className = 'quiz-check';
      row.innerHTML = `<input type="checkbox"><span>${escapeHtml(text)}</span>`;
      wrap.appendChild(row);
      boxes.push(row.querySelector('input'));
    });
    body.appendChild(wrap);

    // 代码区：可留空。填了就必须能跑通，跑不通不给过
    const ta = document.createElement('textarea');
    ta.className = 'quiz-ta';
    ta.placeholder = (Q().projectPlaceholder || '');
    if (q.starter) ta.value = q.starter;
    body.appendChild(ta);

    const out = document.createElement('div');
    out.className = 'quiz-out';
    body.appendChild(out);

    const note = document.createElement('div');
    note.className = 'quiz-note';
    note.textContent = Q().projectNote || '';
    body.appendChild(note);

    const btnCheck = mkBtn(Q().verify, 'ghost');
    const btnDone = mkBtn(Q().done, 'primary');

    let ran = false;    // 是否已验证过代码能跑

    btnCheck.onclick = async () => {
      const code = ta.value.trim();
      if (!code) {
        // 没写代码也算通过验证 —— 项目允许在别处完成
        ran = true;
        out.className = 'quiz-out show ok';
        out.textContent = '✅ ' + (Q().noCodeOk || '');
        return;
      }
      btnCheck.disabled = true;
      btnCheck.textContent = Q().running;
      out.className = 'quiz-out show';
      out.textContent = Q().running;
      const r = await Runner.execCheck(code, 'proj:' + id);
      if (r.ok) {
        ran = true;
        out.className = 'quiz-out show ok';
        out.textContent = '✅ ' + (Q().noBug || '') +
          (r.stdout ? '\n' + r.stdout : '');
      } else {
        out.className = 'quiz-out show err';
        out.textContent = '❌ ' + (Q().hasBug || '') + '\n' + r.error;
      }
      btnCheck.disabled = false;
      btnCheck.textContent = Q().verify;
    };

    btnDone.onclick = () => {
      const done = boxes.filter(b => b.checked).length;
      if (done < boxes.length) return toast(Q().remain(boxes.length - done));
      const code = ta.value.trim();
      if (code && !ran) return toast(Q().verifyFirst || '');
      finish(id, true, q, foot, null);
      btnDone.textContent = Q().finished;
      btnDone.disabled = true;
      ta.disabled = true;
      btnCheck.disabled = true;
    };

    foot.appendChild(btnCheck);
    foot.appendChild(btnDone);

    const saved = getResult(id);
    if (saved && saved.ok) { btnDone.textContent = Q().finished; btnDone.disabled = true; }
  }

  /* ================= 结果 ================= */

  function getResult(id) {
    const all = Store.get(Store.K.QUIZ, {}) || {};
    return all[id] || null;
  }

  function finish(id, ok, q, foot, decorate) {
    Store.update(Store.K.QUIZ, {}, all => {
      const prev = all[id];
      all[id] = {
        ok,
        tries: (prev?.tries || 0) + 1,
        at: new Date().toISOString()
      };
      return all;
    });
    if (decorate) decorate();

    // 解释文字
    if (q.explain) {
      const ex = document.createElement('div');
      ex.className = 'quiz-explain';
      ex.innerHTML = '<b>' + (ok ? Q().right : Q().wrong) + '</b> ' + escapeHtml(q.explain);
      foot.parentElement.insertBefore(ex, foot);
    }
    foot.parentElement.classList.remove('passed', 'attempted');
    foot.parentElement.classList.add(ok ? 'passed' : 'attempted');

    // 通知外部：进度、复习调度
    document.dispatchEvent(new CustomEvent('quiz:done', { detail: { id, ok } }));
  }

  /* ================= 工具 ================= */
  function mkBtn(text, cls) {
    const b = document.createElement('button');
    b.className = 'qbtn ' + cls;
    b.textContent = text;
    return b;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function toast(m) { window.__toast && window.__toast(m); }

  return { extractBlocks, render, getResult };
})();
