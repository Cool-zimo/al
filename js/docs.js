/**
 * 第三方书籍文档站（挂在 al 站点下，共享登录）
 *
 * 为什么搬进 al 而不是单独开一个 al-docs 站：
 *   单独站没有登录态，只能走未认证 API（60 次/小时），
 *   搜书根本搜不动，取内容也得靠 CDN 缓存。
 *   放进 al 之后 token 是同源共享的，直接就有 5000 次/小时，
 *   且能走 API 取实时内容，不必等 CDN。
 *
 * 两个视图：
 *   index —— 书籍索引（登录后自己搜 + 中心索引兜底）
 *   check —— 自查一本书（贴仓库名，即时校验 + 预览）
 */
const Docs = (() => {

  const REGISTRY = 'https://cool-zimo.github.io/al-docs/registry.json';
  const $ = id => document.getElementById(id);

  /** 站内（挂在 app.js 路由里）时为 true，链接走 hash；独立打开时走相对路径 */
  let embedded = false;
  const homeHref = () => (embedded ? '#/' : '../index.html');

  let api = null;
  let lang = 'zh';

  /* ================= 登录态 ================= */

  /**
   * token 由 Store 以 JSON 形式存在 localStorage，key 带命名空间前缀。
   * 这里直接读原始键，不必引入整个 Store（docs 页用不到笔记那些）。
   */
  function readToken() {
    try {
      const raw = localStorage.getItem('pytut:token');
      if (!raw) return '';
      const v = JSON.parse(raw);
      return typeof v === 'string' ? v.trim() : '';
    } catch (e) { return ''; }
  }

  function boot(injected) {
    if (injected) {
      api = injected;
      GhSrc.setApi(api);
      return true;
    }
    const t = readToken();
    if (t) {
      api = new GitHubAPI(t);
      GhSrc.setApi(api);       // 让 API 源可用（最快、内容实时）
    }
    return !!api;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ================= 取书 ================= */

  /** 登录了就自己搜（实时、额度高）；没登录就用机器人扫好的中心索引 */
  async function listBooks() {
    const out = [];
    const seen = new Set();

    if (api) {
      try {
        const found = await Shelf.discover(api);
        for (const b of found) {
          if (!Array.isArray(b.langs) || !b.langs.length || b.langs.includes(lang)) {
            seen.add(b.repo); out.push(b);
          }
        }
      } catch (e) {
        console.warn('[docs] 搜索失败', e.message);
      }
    }

    try {
      const r = await fetch(REGISTRY, { cache: 'no-store' });
      if (r.ok) {
        const reg = await r.json();
        for (const b of (reg.books || [])) {
          if (!b.ok || seen.has(b.repo)) continue;
          if (Array.isArray(b.langs) && b.langs.length && !b.langs.includes(lang)) continue;
          seen.add(b.repo); out.push({ ...b, fromRegistry: true });
        }
      }
    } catch (e) { /* 索引站挂了不影响 */ }

    return out;
  }

  /* ================= 自查 ================= */

  async function loadRepo(full, branch) {
    // 文件清单只花 1 次 API 调用；内容走 GhSrc（登录→API，未登录→CDN）
    let paths = [];
    try {
      const tree = await fetch(
        `https://api.github.com/repos/${full}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
        { headers: api ? { Authorization: `Bearer ${readToken()}` } : {} }
      ).then(r => r.ok ? r.json() : null);
      if (tree && tree.tree) {
        paths = tree.tree
          .filter(x => x.type === 'blob' && /\.(md|json)$/.test(x.path))
          .filter(x => x.path === 'albook.json' || x.path === 'README.md' || x.path.startsWith('content/'))
          .map(x => x.path);
      }
    } catch (e) { /* 拿不到树就退回猜路径 */ }

    if (!paths.length) {
      paths = ['albook.json', `content/${lang}/toc.json`];
      for (let i = 1; i <= 30; i++) paths.push(`content/${lang}/lessons/${String(i).padStart(2, '0')}.md`);
    }

    const [owner, name] = full.split('/');
    const got = await GhSrc.many(owner, name, branch, paths);
    const files = {};
    for (const p of paths) if (got[p] != null) files[p] = got[p];
    return files;
  }

  async function checkRepo(full) {
    let repo = null, branch = 'main';
    try {
      const r = await fetch(`https://api.github.com/repos/${full}`, {
        headers: api ? { Authorization: `Bearer ${readToken()}` } : {}
      });
      if (r.status === 404) throw new Error('仓库不存在（或没有公开）');
      if (!r.ok) throw new Error('HTTP ' + r.status);
      repo = await r.json();
      branch = repo.default_branch || 'main';
    } catch (e) {
      throw new Error('读不到这个仓库：' + e.message);
    }
    const files = await loadRepo(full, branch);
    return { files, repo, branch, report: BookCheck.validate(files) };
  }

  /* ================= 渲染 ================= */

  function renderMarkdown(md) {
    let s = esc(md);
    s = s.replace(/^### (.*)$/gm, '<h3>$1</h3>')
         .replace(/^## (.*)$/gm, '<h2>$1</h2>')
         .replace(/^# (.*)$/gm, '<h1>$1</h1>')
         .replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>')
         .replace(/```(\w*)\n([\s\S]*?)```/g, (m, l, code) => `<pre><code>${code}</code></pre>`)
         .replace(/`([^`]+)`/g, '<code>$1</code>')
         .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
         .replace(/\n/g, '<br>');
    return s;
  }

  function renderQuiz(q) {
    const t = String(q.type || 'choice');
    let body = '';
    if (t === 'choice') {
      body = (q.options || []).map((o, i) =>
        `<div class="qo">${i === Number(q.answer) ? '✓ ' : '○ '}${esc(o)}</div>`).join('');
    } else if (q.cases) {
      body = `<div class="qo">用例：${esc(String(q.cases).split('\n').filter(Boolean).join(' ｜ '))}</div>`;
    } else if (q.checks) {
      body = `<div class="qo">检查项 ${(q.checks || []).length} 条</div>`;
    } else if (q.checklist) {
      body = `<div class="qo">清单 ${(q.checklist || []).length} 项</div>`;
    }
    const isExam = String(q.exam || '').toLowerCase() === 'true';
    return `<div class="qbox">
      <div class="qt">${esc(t)} · ${esc(q.q || '')}</div>
      ${body}
      <div class="qo">${isExam ? '计入学完' : '随堂练习'}</div>
    </div>`;
  }

  /* ================= 视图：索引 ================= */

  async function mountIndex(root) {
    root.innerHTML = `
      <div class="docs-head">
        <a class="docs-back" href="../index.html">← ${esc(T('backHome'))}</a>
        <h1>${esc(T('title'))}</h1>
        <p class="docs-sub">${esc(T('subtitle'))}</p>
        <div class="docs-state" id="docs-state">${esc(T('loading'))}</div>
      </div>
      <div class="docs-bar">
        <a class="docs-btn" href="check.html">${esc(T('goCheck'))}</a>
        <input type="text" id="docs-q" placeholder="${esc(T('searchPh'))}" autocomplete="off">
        <select id="docs-status">
          <option value="">${esc(T('allStatus'))}</option>
          <option value="ok">${esc(T('onlyOk'))}</option>
          <option value="bad">${esc(T('onlyBad'))}</option>
        </select>
      </div>
      <div id="docs-grid" class="docs-grid"></div>
      <div class="docs-foot">${esc(T('footNote'))}</div>`;

    const logged = boot();
    $('docs-state').innerHTML = logged
      ? `✅ ${esc(T('loggedAs'))} <b>${esc(await api.getUsername().catch(() => ''))}</b> · ${esc(T('loggedHint'))}`
      : `⚠️ ${esc(T('notLogged'))} <a href="${homeHref()}">${esc(T('goLogin'))}</a>`;

    let all = [];
    try {
      all = await listBooks();
    } catch (e) { /* 下面会显示空态 */ }

    const grid = $('docs-grid');
    const draw = () => {
      const q = $('docs-q').value.trim().toLowerCase();
      const st = $('docs-status').value;
      const list = all.filter(b => {
        if (st === 'ok' && b.errors && b.errors.length) return false;
        if (st === 'bad' && !(b.errors && b.errors.length)) return false;
        if (!q) return true;
        return [b.title, b.subtitle, b.desc, b.repo, (b.author || {}).name, (b.tags || []).join(' ')]
          .join(' ').toLowerCase().includes(q);
      });
      if (!list.length) {
        grid.innerHTML = `<div class="docs-empty">${esc(T('empty'))}</div>`;
        return;
      }
      grid.innerHTML = list.map(b => `
        <div class="docs-card">
          <h3>${esc(b.title)}</h3>
          <div class="docs-sub2">${esc(b.subtitle || '')}</div>
          ${b.stars ? `<div class="docs-meta">★ ${b.stars}</div>` : ''}
          <p class="docs-desc">${esc(b.desc || '')}</p>
          <div class="docs-meta">
            ${b.author && b.author.name ? `✍ ${esc(b.author.name)}` : ''}
            ${b.license ? ` · ${esc(b.license)}` : ''}
          </div>
          <div class="docs-meta">${esc(b.repo)}</div>
          ${b.errors && b.errors.length
            ? `<div class="docs-err"><b>${esc(T('notPassed'))}</b><ul>${
                b.errors.slice(0, 5).map(e => `<li>${esc(e)}</li>`).join('')}</ul></div>`
            : ''}
          <div class="docs-links">
            <a href="${esc(b.url || 'https://github.com/' + b.repo)}" target="_blank" rel="noopener">${esc(T('repoLink'))} ↗</a>
            ${!(b.errors && b.errors.length) && b.id
              ? `<a href="#/book/${esc(b.id)}">${esc(T('read'))} →</a>` : ''}
          </div>
        </div>`).join('');
    };
    $('docs-q').addEventListener('input', draw);
    $('docs-status').addEventListener('change', draw);
    draw();
  }

  /* ================= 视图：自查 ================= */

  async function mountCheck(root) {
    root.innerHTML = `
      <div class="docs-head">
        <a class="docs-back" href="#/">← ${esc(T('backList'))}</a>
        <h1>${esc(T('checkTitle'))}</h1>
        <p class="docs-sub">${esc(T('checkSub'))}</p>
      </div>
      <div class="docs-bar">
        <input type="text" id="ck-repo" placeholder="${esc(T('repoPh'))}" autocomplete="off" spellcheck="false">
        <button class="docs-btn" id="ck-go">${esc(T('checkBtn'))}</button>
        <button class="docs-btn ghost" id="ck-demo">${esc(T('tryDemo'))}</button>
      </div>
      <div id="ck-out"></div>`;

    const run = async (full) => {
      const out = $('ck-out');
      out.innerHTML = `<div class="docs-empty"><span class="docs-spin"></span>${esc(T('reading'))}</div>`;
      try {
        const { files, branch, report } = await checkRepo(full);
        const m = report.meta || {};
        const s = report.stats;

        let html = `<div class="docs-verdict ${report.ok ? 'ok' : 'bad'}">
          ${report.ok ? '✓ ' + esc(T('pass')) : '✗ ' + esc(T('fail')).replace('{n}', report.errors.length)}
          <small>${esc(m.title || full)}${m.author && m.author.name ? ' · ' + esc(m.author.name) : ''}
            · ${s.lessons} 课 / ${s.questions} 题 / ${s.languages} 种语言</small></div>`;

        html += `<div class="docs-panel"><div class="docs-stats">
          <span><b>${s.lessons}</b> 课</span><span><b>${s.questions}</b> 题</span>
          <span><b>${s.code}</b> 可判分</span><span><b>${s.tests}</b> 章测</span>
          <span><b>${s.languages}</b> 语言</span></div>`;

        if (report.errors.length) {
          html += `<div class="docs-h bad">${esc(T('mustFix'))}（${report.errors.length}）</div>
            <ul class="docs-issues">${report.errors.map(e => `<li>${esc(e)}</li>`).join('')}</ul>`;
        }
        if (report.warnings.length) {
          html += `<div class="docs-h warn">${esc(T('suggest'))}（${report.warnings.length}）</div>
            <ul class="docs-issues">${report.warnings.map(e => `<li>${esc(e)}</li>`).join('')}</ul>`;
        }
        if (!report.errors.length && !report.warnings.length) {
          html += `<div class="docs-empty">${esc(T('clean'))}</div>`;
        }
        html += '</div>';

        // 目录预览
        const L = (m.langs && m.langs[0]) || lang;
        const tocRaw = files[`content/${L}/toc.json`];
        if (tocRaw) {
          let toc = null;
          try { toc = JSON.parse(tocRaw); } catch (e) {}
          if (toc && toc.chapters) {
            html += `<div class="docs-panel"><div class="docs-h">${esc(T('tocPreview'))}</div><div class="docs-toc">`;
            for (const ch of toc.chapters) {
              html += `<div class="docs-ch">${esc(ch.title || '')}</div>`;
              for (const it of (ch.lessons || [])) {
                const id = String(it.id || it);
                const md = files[`content/${L}/lessons/${id}.md`];
                let title = it.title, sm = it.summary;
                if (!title && md) {
                  const h = md.split('\n').find(l => /^#\s+\S/.test(l));
                  if (h) title = h.replace(/^#\s+/, '').replace(/^\d{2}\s+/, '').trim();
                  const q = md.split('\n').find(l => /^>\s+\S/.test(l));
                  if (q) sm = q.replace(/^>\s+/, '').trim();
                }
                html += `<div class="docs-item" data-md="content/${L}/lessons/${esc(id)}.md">
                  <span class="n">${esc(id)}</span><span>${esc(title || id)}
                  ${sm ? `<div class="sm">${esc(String(sm).slice(0, 70))}</div>` : ''}</span></div>`;
              }
            }
            html += '</div></div>';
          }
        }

        html += `<div class="docs-panel"><div class="docs-h">${esc(T('lessonPreview'))}</div>
          <div class="docs-hint">${esc(T('clickHint'))}</div>
          <div id="pv" class="docs-preview"><div class="docs-empty">${esc(T('noPick'))}</div></div></div>`;

        out.innerHTML = html;
        window.__files = files;
        out.querySelectorAll('.docs-item[data-md]').forEach(el => {
          el.onclick = () => {
            const md = window.__files[el.dataset.md];
            const pv = document.getElementById('pv');
            if (!md) { pv.innerHTML = `<div class="docs-empty">${esc(T('cantRead'))}</div>`; return; }
            const qs = BookCheck.blocks(md);
            pv.innerHTML = renderMarkdown(md.replace(/```quiz\n[\s\S]*?^```\s*$/gm, ''))
              + (qs.length ? `<div class="docs-h">${esc(T('quizCount')).replace('{n}', qs.length)}</div>` + qs.map(renderQuiz).join('')
                           : `<div class="docs-h bad">${esc(T('noQuiz'))}</div>`);
            pv.scrollTop = 0;
          };
        });
      } catch (e) {
        out.innerHTML = `<div class="docs-panel"><div class="docs-err">${esc(e.message || String(e))}</div></div>`;
      }
    };

    $('ck-go').onclick = () => {
      const v = $('ck-repo').value.trim()
        .replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
      if (!v.includes('/')) { alert(T('repoFmt')); return; }
      run(v);
    };
    $('ck-repo').addEventListener('keydown', e => { if (e.key === 'Enter') $('ck-go').click(); });
    $('ck-demo').onclick = () => {
      $('ck-repo').value = 'Cool-zimo/al-book-office-automation';
      $('ck-go').click();
    };
  }

  /* ================= 文案 ================= */

  const TXT = {
    zh: {
      title: '第三方书籍', subtitle: '任何人都可以给 AnyLearn 写教材。建一个符合格式的仓库，机器人会自动发现、校验并收录。',
      backHome: '回到书城', goCheck: '🔎 自查一本书', searchPh: '搜索书名、作者、标签…',
      allStatus: '全部状态', onlyOk: '仅通过校验', onlyBad: '未通过',
      loading: '正在载入…', empty: '还没有符合条件的书。',
      footNote: '收录只代表格式合规，不代表 AnyLearn 背书。内容责任归原作者。',
      loggedAs: '已登录 GitHub：', loggedHint: '正在用你的额度实时搜索（5000 次/小时）',
      notLogged: '未登录 —— 只能看机器人扫好的索引，且取内容会走 CDN 缓存。',
      goLogin: '去登录 →', repoLink: '仓库', read: '阅读',
      notPassed: '未通过的原因：',
      checkTitle: '自查一本书', checkSub: '贴入仓库名，立刻跑完整校验，并预览目录和课文。',
      backList: '返回首页', repoPh: 'owner/repo，例如 Cool-zimo/al-book-office-automation',
      checkBtn: '检查', tryDemo: '用示例书试试', reading: '正在读取仓库…',
      pass: '通过校验 —— 这本书可以被收录', fail: '有 {n} 处错误，暂时不会被收录',
      mustFix: '必须修掉的', suggest: '建议改进（不影响收录）', clean: '一条问题都没有，很干净。',
      tocPreview: '目录预览', lessonPreview: '课文预览', clickHint: '点上面目录里的任意一课，这里会显示它的渲染效果和题目。',
      noPick: '还没选课文。', cantRead: '读不到这一课。', quizCount: '这一课的 {n} 道题', noQuiz: '这一课一道题都没有',
      repoFmt: '请填 owner/repo 两段',
    },
    en: {
      title: 'Third-party books', subtitle: 'Anyone can write a textbook for AnyLearn. Create a repo that follows the format and a bot will find, validate and list it.',
      backHome: 'Back to library', goCheck: '🔎 Check my book', searchPh: 'Search title, author, tags…',
      allStatus: 'All', onlyOk: 'Passed only', onlyBad: 'Failed',
      loading: 'Loading…', empty: 'No books match.',
      footNote: 'Being listed means the format is valid — not that AnyLearn endorses it. Authors are responsible for their content.',
      loggedAs: 'Signed in as', loggedHint: 'Searching live with your quota (5000 req/h)',
      notLogged: 'Not signed in — only the bot-scanned index is available, and content comes from CDN cache.',
      goLogin: 'Sign in →', repoLink: 'Repo', read: 'Read',
      notPassed: 'Why it failed:',
      checkTitle: 'Check a book', checkSub: 'Paste a repo name to run the full validation, and preview its TOC and lessons.',
      backList: 'Back home', repoPh: 'owner/repo, e.g. Cool-zimo/al-book-office-automation',
      checkBtn: 'Check', tryDemo: 'Try the sample', reading: 'Reading repository…',
      pass: 'Validation passed — this book can be listed', fail: '{n} errors — will not be listed yet',
      mustFix: 'Must fix', suggest: 'Suggestions (won\'t block listing)', clean: 'No issues at all. Clean.',
      tocPreview: 'TOC preview', lessonPreview: 'Lesson preview', clickHint: 'Click any lesson above to see how it renders, plus its questions.',
      noPick: 'No lesson selected.', cantRead: 'Could not read this lesson.', quizCount: '{n} questions in this lesson', noQuiz: 'This lesson has no questions',
      repoFmt: 'Please enter owner/repo',
    },
  };

  function T(k) { return (TXT[lang] && TXT[lang][k]) || k; }

  /* ================= 挂载 ================= */

  function mount(root, view, opts) {
    opts = opts || {};
    embedded = !!opts.embedded;
    if (opts.lang) lang = opts.lang;
    else lang = document.documentElement.lang === 'en' ? 'en' : 'zh';
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    root.className = 'docs-wrap';
    if (view === 'check') mountCheck(root); else mountIndex(root);
  }

  const CSS = `
  .docs-wrap{max-width:1000px;margin:0 auto;padding:28px 20px 80px;line-height:1.7;color:var(--text)}
  .docs-head{margin-bottom:22px}
  .docs-back{display:inline-block;font-size:13px;color:var(--dim);margin-bottom:10px}
  .docs-head h1{font-size:24px;margin:0 0 6px;font-weight:720}
  .docs-sub{color:var(--dim);font-size:14px;margin:0}
  .docs-state{font-size:12.5px;color:var(--faint);margin-top:10px;padding:8px 12px;
    border-radius:8px;background:var(--panel);border:1px solid var(--border)}
  .docs-bar{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px}
  .docs-bar input[type=text]{flex:1;min-width:220px;padding:9px 12px;border:1px solid var(--border);
    border-radius:8px;font-size:14px;background:var(--panel);color:var(--text);font-family:inherit}
  .docs-bar select{padding:9px 10px;border:1px solid var(--border);border-radius:8px;
    font-size:13.5px;background:var(--panel);color:var(--text);font-family:inherit}
  .docs-btn{display:inline-flex;align-items:center;padding:9px 16px;border-radius:8px;
    background:var(--accent);color:#fff;font-size:13.5px;font-weight:600;border:none;cursor:pointer;
    font-family:inherit;text-decoration:none}
  .docs-btn:hover{filter:brightness(1.08);text-decoration:none}
  .docs-btn.ghost{background:var(--panel);color:var(--text);border:1px solid var(--border)}
  .docs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px}
  .docs-card{background:var(--panel);border:1px solid var(--border);border-radius:12px;
    padding:16px 18px;display:flex;flex-direction:column;gap:8px}
  .docs-card h3{margin:0;font-size:16.5px;font-weight:680}
  .docs-sub2{color:var(--accent-2);font-size:13px;margin:-4px 0 0}
  .docs-desc{font-size:13.5px;color:var(--dim);margin:0}
  .docs-meta{font-size:12.5px;color:var(--faint)}
  .docs-links{display:flex;gap:14px;font-size:13px;margin-top:4px;flex-wrap:wrap}
  .docs-err{background:#fdeceb;border:1px solid #f5c6c2;color:#7d201b;border-radius:8px;
    padding:10px 12px;font-size:12.5px}
  .docs-err ul{margin:5px 0 0;padding-left:18px}
  .docs-panel{background:var(--panel);border:1px solid var(--border);border-radius:12px;
    padding:18px 20px;margin-bottom:16px}
  .docs-stats{display:flex;gap:16px;flex-wrap:wrap;font-size:13px;color:var(--faint)}
  .docs-stats b{font-size:16px;color:var(--text);font-weight:700}
  .docs-h{font-size:13.5px;font-weight:700;margin:16px 0 6px}
  .docs-h.bad{color:#c9372c}.docs-h.warn{color:#9a6700}
  .docs-issues{margin:0 0 8px;padding-left:20px;font-size:13px}
  .docs-issues li{margin-bottom:5px}
  .docs-verdict{padding:14px 18px;border-radius:10px;font-size:15px;font-weight:600;margin-bottom:14px}
  .docs-verdict.ok{background:#e8f5ec;color:#1a7f37}
  .docs-verdict.bad{background:#fdeceb;color:#c9372c}
  .docs-verdict small{display:block;font-weight:400;font-size:12.5px;margin-top:4px;opacity:.85}
  .docs-toc{margin-top:8px}
  .docs-ch{font-weight:700;font-size:13.5px;margin:12px 0 4px;color:var(--accent)}
  .docs-item{display:flex;gap:10px;padding:5px 0;font-size:13.5px;cursor:pointer;
    border-bottom:1px solid var(--border-soft)}
  .docs-item:hover{background:var(--panel-2,#f8fafc)}
  .docs-item .n{color:var(--faint);min-width:24px;font-variant-numeric:tabular-nums}
  .docs-item .sm{color:var(--faint);font-size:12px}
  .docs-preview{border:1px solid var(--border);border-radius:8px;padding:14px 16px;
    background:var(--panel);font-size:13.5px;max-height:520px;overflow:auto;margin-top:8px}
  .docs-preview h1,.docs-preview h2,.docs-preview h3{font-size:15px;margin:12px 0 6px}
  .docs-preview pre{background:var(--border-soft);padding:9px 11px;border-radius:6px;overflow:auto;font-size:12.5px}
  .docs-preview blockquote{border-left:3px solid var(--accent);margin:8px 0;padding:4px 12px;color:var(--dim)}
  .docs-hint{font-size:12.5px;color:var(--faint);margin:0}
  .qbox{border:1px solid var(--border);border-radius:6px;padding:9px 11px;margin:9px 0;background:var(--panel)}
  .qbox .qt{font-weight:600;font-size:13px}
  .qbox .qo{font-size:12.5px;color:var(--dim);padding-left:6px}
  .docs-empty{color:var(--faint);font-size:13.5px;padding:18px 0}
  .docs-foot{margin-top:32px;padding-top:16px;border-top:1px solid var(--border);
    color:var(--faint);font-size:12.5px}
  .docs-spin{display:inline-block;width:13px;height:13px;border-radius:50%;
    border:2px solid var(--border);border-top-color:var(--accent);animation:dsp .8s linear infinite;
    vertical-align:-2px;margin-right:6px}
  @keyframes dsp{to{transform:rotate(360deg)}}
  `;

  return { mount, boot, isLoggedIn: () => !!api };
})();
