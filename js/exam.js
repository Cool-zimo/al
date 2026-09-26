/**
 * 章节测验（Exam）
 *
 * 和普通课文页的区别：课文是"读"，测验是"考"。
 * 所以这里不做成文档流 —— 而是一题一屏、带进度、做完当场判、最后出总分。
 *
 * 判分策略：
 *   选择题 / 填空题 —— 即时判对错
 *   函数题 / 算法题 —— 真调用用户写的函数，逐用例比对返回值
 *   小项目       —— 只要求"跑得通"（无语法/运行时错误）+ 用户自评清单全勾
 *                    开放式项目的功能正确性不做机器判定
 */
const Exam = (() => {
  const E = () => window.I18N.exam;

  /** 题型分组，用于最后的分类得分 */
  function groupOf(type) {
    if (type === 'choice' || type === 'fill') return 'concept';
    if (type === 'function' || type === 'code') return 'algorithm';
    return 'project';
  }

  /**
   * @param {{quizzes:Array, key:string, title:string, onFinish?:Function}} opts
   */
  function create(opts) {
    const { quizzes = [], key = '', title = '' } = opts;
    const state = {};   // index -> { done, ok }
    let idx = 0;
    let submitted = false;

    const root = document.createElement('div');
    root.className = 'exam';

    /* ---------- 头部：进度 + 实时得分 ---------- */
    const head = document.createElement('div');
    head.className = 'exam-head';

    const meta = document.createElement('div');
    meta.className = 'exam-meta';
    const posEl = document.createElement('span');
    posEl.className = 'exam-pos';
    const scoreEl = document.createElement('span');
    scoreEl.className = 'exam-score';
    meta.appendChild(posEl);
    meta.appendChild(scoreEl);
    head.appendChild(meta);

    const bar = document.createElement('div');
    bar.className = 'exam-bar';
    const fill = document.createElement('div');
    fill.className = 'exam-fill';
    bar.appendChild(fill);
    head.appendChild(bar);

    // 题号圆点，可点击跳转
    const dots = document.createElement('div');
    dots.className = 'exam-dots';
    quizzes.forEach((q, i) => {
      const d = document.createElement('button');
      d.className = 'exam-dot';
      d.textContent = String(i + 1);
      d.title = (q.q || '').slice(0, 40);
      d.onclick = () => go(i);
      dots.appendChild(d);
    });
    head.appendChild(dots);
    root.appendChild(head);

    /* ---------- 题目区 ---------- */
    const stage = document.createElement('div');
    stage.className = 'exam-stage';
    root.appendChild(stage);

    /* ---------- 底部导航 ---------- */
    const nav = document.createElement('div');
    nav.className = 'exam-nav';
    const btnPrev = mkBtn(E().prev, 'ghost');
    const btnNext = mkBtn(E().next, 'primary');
    nav.appendChild(btnPrev);
    nav.appendChild(btnNext);
    root.appendChild(nav);

    btnPrev.onclick = () => go(idx - 1);
    btnNext.onclick = () => go(idx + 1);

    /* ---------- 渲染当前题 ---------- */
    function paintStage() {
      stage.innerHTML = '';
      const q = quizzes[idx];
      if (!q) return;

      const card = document.createElement('div');
      card.className = 'exam-card';

      const kind = document.createElement('div');
      kind.className = 'exam-kind';
      kind.textContent = ({
        choice: E().kindChoice, fill: E().kindFill,
        function: E().kindFunction, code: E().kindCode, project: E().kindProject
      })[q.type] || E().kindChoice;
      card.appendChild(kind);

      const box = Quiz.render(q, idx, { key: 'exam:' + key });
      box.classList.add('exam-quiz');
      // 去掉题号徽章，因为卡片顶部已有题型标签
      const badge = box.querySelector('.quiz-badge');
      if (badge) badge.remove();
      card.appendChild(box);

      stage.appendChild(card);
      syncHead();
    }

    function syncHead() {
      const total = quizzes.length;
      posEl.textContent = E().pos(idx + 1, total);
      const done = Object.keys(state).length;
      const right = Object.values(state).filter(s => s.ok).length;
      scoreEl.textContent = E().score(right, done);
      fill.style.width = (total ? done / total * 100 : 0) + '%';

      [...dots.children].forEach((d, i) => {
        d.className = 'exam-dot' +
          (i === idx ? ' now' : '') +
          (state[i] ? (state[i].ok ? ' ok' : ' no') : '');
      });

      btnPrev.disabled = idx === 0;
      btnNext.textContent = idx === quizzes.length - 1 ? E().finish : E().next;
    }

    function go(i) {
      if (i < 0 || i >= quizzes.length) return;
      idx = i;
      paintStage();
      root.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ---------- 监听答题结果 ---------- */
    function onDone(e) {
      const { id, ok } = e.detail || {};
      const prefix = 'exam:' + key + ':';

      // 只有"从未做过"或"这次做对了"才更新，避免重做错答把已通过的刷掉；
      // 但已做过又做错的话允许覆盖，这样状态是真实的。
      const qid = String(id || '');
      if (!qid.startsWith(prefix)) return;
      const i = parseInt(qid.slice(prefix.length), 10);
      if (Number.isNaN(i)) return;

      state[i] = { done: true, ok: !!ok };
      syncHead();

      // 答完自动跳下一题（最后一题不跳，让用户看到结果）
      if (ok && i === idx && idx < quizzes.length - 1) {
        setTimeout(() => go(idx + 1), 900);
      }
    }
    document.addEventListener('quiz:done', onDone);
    root._off = () => document.removeEventListener('quiz:done', onDone);

    /* ---------- 交卷 ---------- */
    btnNext.onclick = () => {
      if (idx === quizzes.length - 1) { submit(); return; }
      go(idx + 1);
    };

    function submit() {
      if (submitted) return;
      submitted = true;
      root.innerHTML = '';
      root.appendChild(buildResult());
      if (opts.onFinish) opts.onFinish(grade());
      document.removeEventListener('quiz:done', onDone);
    }

    function grade() {
      const total = quizzes.length;
      const right = Object.values(state).filter(s => s.ok).length;
      const done = Object.keys(state).length;
      const pct = total ? Math.round(right / total * 100) : 0;
      const byGroup = { concept: [0, 0], algorithm: [0, 0], project: [0, 0] };
      quizzes.forEach((q, i) => {
        const g = groupOf(q.type);
        byGroup[g][1]++;
        if (state[i] && state[i].ok) byGroup[g][0]++;
      });
      return { total, right, done, pct, byGroup };
    }

    /* ---------- 成绩单 ---------- */
    function buildResult() {
      const g = grade();
      const wrap = document.createElement('div');
      wrap.className = 'exam-result';

      const lvl = g.pct >= 90 ? ['excellent', '🎉'] :
                  g.pct >= 75 ? ['good', '👍'] :
                  g.pct >= 60 ? ['pass', '🙂'] : ['again', '📖'];

      wrap.innerHTML = `
        <div class="result-card ${lvl[0]}">
          <div class="result-emoji">${lvl[1]}</div>
          <div class="result-num">${g.right}<span>/ ${g.total}</span></div>
          <div class="result-pct">${g.pct}%</div>
          <div class="result-grade">${E().grade[lvl[0]]}</div>
        </div>`;

      // 分类得分
      const rows = [
        ['concept', E().kindConcept, 'concept'],
        ['algorithm', E().kindAlgorithm, 'algorithm'],
        ['project', E().kindProjectName, 'project']
      ];
      const table = document.createElement('div');
      table.className = 'result-rows';
      rows.forEach(([gk, label]) => {
        const [r, t] = g.byGroup[gk];
        if (!t) return;
        const row = document.createElement('div');
        row.className = 'result-row' + (r === t ? ' full' : '');
        row.innerHTML = `<span class="rl">${label}</span>` +
          `<span class="rb"><i style="width:${t ? r / t * 100 : 0}%"></i></span>` +
          `<span class="rn">${r} / ${t}</span>`;
        table.appendChild(row);
      });
      wrap.appendChild(table);

      // 未通过的题
      const wrong = quizzes.map((q, i) => ({ q, i }))
        .filter(x => !(state[x.i] && state[x.i].ok));
      if (wrong.length) {
        const box = document.createElement('div');
        box.className = 'result-wrong';
        box.innerHTML = `<h3>${E().wrongTitle(wrong.length)}</h3>`;
        wrong.forEach(({ q, i }) => {
          const it = document.createElement('button');
          it.className = 'result-item';
          it.innerHTML = `<span class="rn">${i + 1}</span><span class="rt">${escapeHtml((q.q || '').slice(0, 60))}</span><span class="rg">→</span>`;
          it.onclick = () => { location.reload(); };
          box.appendChild(it);
        });
        const tip = document.createElement('p');
        tip.className = 'result-tip';
        tip.textContent = E().wrongTip;
        box.appendChild(tip);
        wrap.appendChild(box);
      } else {
        const okBox = document.createElement('div');
        okBox.className = 'result-allok';
        okBox.textContent = E().allOk;
        wrap.appendChild(okBox);
      }

      // 操作
      const acts = document.createElement('div');
      acts.className = 'result-acts';
      const btnRetry = mkBtn(E().retryWrong, 'primary');
      btnRetry.onclick = () => location.reload();
      const btnBack = mkBtn(E().back, 'ghost');
      btnBack.onclick = () => { location.hash = '#/'; };
      acts.appendChild(btnRetry);
      acts.appendChild(btnBack);
      wrap.appendChild(acts);

      return wrap;
    }

    paintStage();
    return root;
  }

  function mkBtn(text, cls) {
    const b = document.createElement('button');
    b.className = 'qbtn ' + cls;
    b.textContent = text;
    return b;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  return { create };
})();
