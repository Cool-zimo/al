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
      choice: q0.choice, fill: q0.fill, code: q0.code, project: q0.project
    })[q.type] || '练习';
    head.innerHTML = `<span class="quiz-badge">${badge}</span><span class="quiz-q">${escapeHtml(q.q || '')}</span>`;
    box.appendChild(head);

    const body = document.createElement('div');
    body.className = 'quiz-body';
    box.appendChild(body);

    const foot = document.createElement('div');
    foot.className = 'quiz-foot';
    box.appendChild(foot);

    ({
      choice: renderChoice, fill: renderFill, code: renderCode,
      function: renderFunction, project: renderProject
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
      const lines = r.results.map(x => {
        const flag = x.ok ? '✅' : '❌';
        let s = `${flag} ${funcName}(${x.args.slice(1, -1)})`;
        if (x.ok) s += ` → ${x.got}`;
        else s += `  期望 ${x.expect}，实际 ${x.got === null ? (x.error || '报错') : x.got}`;
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

  /** 解析用例：每行 "参数 -> 期望值"，参数用逗号分隔，值用 Python 字面量写法 */
  function parseCases(block) {
    if (Array.isArray(block)) block = block.join('\n');
    return String(block || '').split('\n')
      .map(l => l.trim())
      .filter(l => l && l.includes('->'))
      .map(line => {
        const [a, e] = line.split('->');
        const argStr = a.trim();
        const args = argStr === '' ? [] : argStr.split(',').map(s => literal(s.trim()));
        return { args, expect: literal(e.trim()) };
      });
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
      const r = await Runner.execWithTests(ta.value, tests, nsKey);

      if (r.ok) {
        out.className = 'quiz-out show ok';
        out.textContent = '✅ ' + Q().passed + '！' + (r.stdout ? '\n' + r.stdout : '');
        finish(id, true, q, foot, null);
        btnRun.textContent = Q().passed;
      } else {
        out.className = 'quiz-out show err';
        out.textContent = '❌ ' + (r.error || Q().wrong) + (r.stdout ? '\n\n' + (window.I18N.lang==='zh'?'输出':'Output') + '：\n' + r.stdout : '');
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
