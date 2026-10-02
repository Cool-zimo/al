/**
 * 开发者平台：写书 → 校验 → 一键发布到 GitHub → 管理仓库
 *
 * 为什么放在主站内：
 *   发布要用用户的 token 建仓库、推文件、打 topic —— 这些都必须登录。
 *   独立站拿不到登录态，所以只能做"看"，做不了"写"。
 *
 * 草稿存在 localStorage（pytut:devBooks），发布时才推到 GitHub。
 * 草稿是纯本地的，没登录也能写；点发布时才要求登录。
 *
 * 视图：
 *   list   —— 我的书（卡片 + 新建 + 发布状态 + 管理入口）
 *   editor —— 三栏编辑器：章节树 / Markdown / 实时预览
 */
const DevPlatform = (() => {

  const KEY = 'pytut:devBooks';
  const $ = id => document.getElementById(id);

  let api = null;
  let lang = 'zh';
  let cur = null;          // 当前正在编辑的书
  let curLesson = null;    // { chIdx, lsIdx }
  let saveTimer = null;

  /* ================= 文案 ================= */
  const TXT = {
    zh: {
      devTitle: '开发者平台', devSub: '写一本 AnyLearn 教材，一键发布到你自己的 GitHub。',
      myBooks: '我的书', newBook: '+ 新建一本书', noBooks: '还没有书。点上面「新建一本书」开始。',
      draft: '草稿', published: '已发布', lessons: '课', chapters: '章', questions: '题',
      edit: '编辑', manage: '管理', report: '评审报告', del: '删除',
      delConfirm: '删除《{t}》？草稿会永久消失（已发布的 GitHub 仓库不受影响）。',
      newBookTitle: '新建一本书',
      bookIdPh: '英文 id，如 python-web（只能是小写字母、数字、连字符）',
      bookTitlePh: '书名，如「Python 网页爬虫入门」',
      create: '创建', cancel: '取消',
      badId: 'id 只能用小写字母、数字和连字符，且不能以连字符开头',
      dupId: '这个 id 已经有了',
      backList: '← 我的书', save: '保存', saved: '已保存', saving: '保存中…',
      addChapter: '+ 添加章', addLesson: '+ 添加课', delChapter: '删除本章', delLesson: '删除本课',
      chTitlePh: '章标题', lsTitlePh: '课标题',
      lessonMd: '课文 Markdown', preview: '实时预览',
      noLesson: '左边选一课，或者添加新课。',
      writeHint: '左边写 Markdown，右边立刻出效果。题目是真能跑的 —— 当场试一下对不对；试做的结果不会计入你的学习进度。',
      publish: '🚀 发布到 GitHub', publishTitle: '发布《{t}》',
      visibility: '仓库可见性', pub: '公开（任何人可见，会被收录）', priv: '私有（只有你能看到，不会被收录）',
      startPublish: '开始发布', publishing: '发布中…',
      stepCheck: '校验内容', stepRepo: '创建仓库', stepFiles: '推送文件', stepTopic: '打上 al-book 标记',
      done: '完成', fail: '失败', publishOk: '发布成功！',
      publishFail: '发布失败', needLogin: '发布需要先登录 GitHub',
      repoCreated: '仓库已创建', filesPushed: '个文件已推送',
      mustFix: '发布前必须修掉这些问题：',
      manageTitle: '管理《{t}》', repoUrl: '仓库地址', openRepo: '在 GitHub 打开 ↗',
      visLabel: '可见性', makePublic: '转为公开', makePrivate: '转为私有',
      visWarn: '私有仓库不会被机器人收录。', visPubNote: '公开仓库会在下次扫描时被收录。',
      reportTitle: '评审报告', reportClean: '一条问题都没有。',
      unpublish: '取消发布记录', unpublishConfirm: '只清除本机的发布记录，不删除 GitHub 仓库。确定？',
      dirty: '有未保存的改动', allSaved: '全部已保存',
      statsBar: '{c} 章 · {l} 课 · {q} 题',
      langLabel: '语言', topicsHint: '会自动打上 topic: al-book，机器人靠它发现你的书。',
      refreshIndex: '刷新索引',
      importBtn: "从已有书导入",
      importTitle: "从仓库导入",
      importDesc: "把任意符合格式的书导入成新草稿，之后随便改。原作者信息会保留，记得按许可证署名。",
      importBtn2: "导入",
      importPick: "或者直接选一本已收录的：",
      impReading: "正在读取…",
      impReady: "《{t}》读到了 {n} 个文件，可以导入了",
      impNotFound: "仓库不存在或没有公开",
      impReadFail: "读不到这个仓库",
      impBadMeta: "albook.json 不是合法 JSON",
      impNotAlBook: "format 不是 al-book，不是 AnyLearn 书籍",
      impBadToc: "toc.json 读不到或不是合法 JSON",
      impEmpty: "这本书没有任何课文",
      repoPh: "owner/repo，例如 Cool-zimo/al-book-office-automation",
      testName: "本章测验",
      testEmpty: "（还没写）",
      bookInfo: "书籍信息",
      fTitle: "书名",
      fSubtitle: "副标题",
      fDesc: "简介",
      fAuthor: "作者名",
      fLicense: "许可证",
      fStage: "分类",
      fLevel: "难度",
      fLangs: "语言",
      fRepo: "仓库名"
    },
    en: {
      devTitle: 'Developer platform', devSub: 'Write an AnyLearn textbook and publish it to your own GitHub in one click.',
      myBooks: 'My books', newBook: '+ New book', noBooks: 'No books yet. Click "New book" to start.',
      draft: 'Draft', published: 'Published', lessons: 'lessons', chapters: 'chapters', questions: 'questions',
      edit: 'Edit', manage: 'Manage', report: 'Review', del: 'Delete',
      delConfirm: 'Delete "{t}"? The draft will be gone forever (published GitHub repos are unaffected).',
      newBookTitle: 'New book',
      bookIdPh: 'English id, e.g. python-web (lowercase letters, digits, hyphens only)',
      bookTitlePh: 'Title, e.g. "Python Web Scraping"',
      create: 'Create', cancel: 'Cancel',
      badId: 'id may only contain lowercase letters, digits and hyphens, and cannot start with a hyphen',
      dupId: 'That id already exists',
      backList: '← My books', save: 'Save', saved: 'Saved', saving: 'Saving…',
      addChapter: '+ Add chapter', addLesson: '+ Add lesson', delChapter: 'Delete chapter', delLesson: 'Delete lesson',
      chTitlePh: 'Chapter title', lsTitlePh: 'Lesson title',
      lessonMd: 'Lesson Markdown', preview: 'Live preview',
      noLesson: 'Pick a lesson on the left, or add a new one.',
      writeHint: 'Write Markdown on the left, see it render instantly. Questions are live — try them right here; results do not count toward your progress.',
      publish: '🚀 Publish to GitHub', publishTitle: 'Publish "{t}"',
      visibility: 'Repository visibility', pub: 'Public (visible to all, will be listed)', priv: 'Private (only you, will not be listed)',
      startPublish: 'Start publishing', publishing: 'Publishing…',
      stepCheck: 'Validate content', stepRepo: 'Create repo', stepFiles: 'Push files', stepTopic: 'Add al-book topic',
      done: 'Done', fail: 'Failed', publishOk: 'Published!',
      publishFail: 'Publish failed', needLogin: 'Publishing requires signing in to GitHub',
      repoCreated: 'Repo created', filesPushed: 'files pushed',
      mustFix: 'Fix these before publishing:',
      manageTitle: 'Manage "{t}"', repoUrl: 'Repository', openRepo: 'Open on GitHub ↗',
      visLabel: 'Visibility', makePublic: 'Make public', makePrivate: 'Make private',
      visWarn: 'Private repos are not picked up by the bot.', visPubNote: 'Public repos get listed on the next scan.',
      reportTitle: 'Review report', reportClean: 'No issues at all.',
      unpublish: 'Clear publish record', unpublishConfirm: 'Only clears the local record; the GitHub repo stays. Continue?',
      dirty: 'Unsaved changes', allSaved: 'All saved',
      statsBar: '{c} chapters · {l} lessons · {q} questions',
      langLabel: 'Languages', topicsHint: 'topic: al-book is added automatically — that is how the bot finds your book.',
      refreshIndex: 'Refresh index',
      importBtn: "Import a book",
      importTitle: "Import from repo",
      importDesc: "Import any conforming book as a new draft, then edit freely. Author info is kept — credit them per the license.",
      importBtn2: "Import",
      importPick: "Or pick an already-listed book:",
      impReading: "Reading…",
      impReady: "Got {n} files from \"{t}\" — ready to import",
      impNotFound: "Repo not found or not public",
      impReadFail: "Could not read this repo",
      impBadMeta: "albook.json is not valid JSON",
      impNotAlBook: "format is not al-book, not an AnyLearn book",
      impBadToc: "toc.json missing or not valid JSON",
      impEmpty: "This book has no lessons",
      repoPh: "owner/repo, e.g. Cool-zimo/al-book-office-automation",
      testName: "Chapter test",
      testEmpty: "(empty)",
      bookInfo: "Book info",
      fTitle: "Title",
      fSubtitle: "Subtitle",
      fDesc: "Description",
      fAuthor: "Author",
      fLicense: "License",
      fStage: "Category",
      fLevel: "Level",
      fLangs: "Languages",
      fRepo: "Repo name"
    },
  };
  const T = k => (TXT[lang] && TXT[lang][k]) || k;
  const tf = (k, o) => T(k).replace(/\{(\w+)\}/g, (m, n) => (o && o[n] != null ? o[n] : m));

  /* ================= 存储 ================= */

  function loadAll() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
    catch (e) { return {}; }
  }
  function saveAll(o) {
    try { localStorage.setItem(KEY, JSON.stringify(o)); }
    catch (e) { alert('本地存储写入失败，可能空间不足'); }
  }
  function getBook(id) { return loadAll()[id] || null; }
  function putBook(b) {
    const all = loadAll();
    b.updatedAt = Date.now();
    all[b.id] = b;
    saveAll(all);
  }
  function delBook(id) {
    const all = loadAll();
    delete all[id];
    saveAll(all);
  }

  /** 新建一本书的初始结构：1 章 1 课，带一道示例题 */
  function blank(id, title) {
    return {
      id, repo: 'al-book-' + id,
      title: title || id,
      // 给合法默认值：校验器要求这几个字段非空，
      // 否则用户刚建完书点发布就被拦下，体验很差。
      subtitle: lang === 'zh' ? '一本 AnyLearn 教材' : 'An AnyLearn textbook',
      desc: lang === 'zh' ? '在这里写几句介绍，说明这本书讲什么、适合谁。'
                          : 'Describe what this book covers and who it is for.',
      stage: '基础', level: '入门',
      langs: ['zh'], license: 'CC BY-NC 4.0',
      author: { name: lang === 'zh' ? '你的名字' : 'Your name' },
      chapters: [{
        title: lang === 'zh' ? '第 1 章 · 开始' : 'Chapter 1 · Getting started',
        lessons: [{
          id: '01',
          title: lang === 'zh' ? '第一课' : 'Lesson one',
          md: lessonTemplate('01', lang === 'zh' ? '第一课' : 'Lesson one'),
        }],
        test: 'test-01',
      }],
      published: null,
      createdAt: Date.now(), updatedAt: Date.now(),
    };
  }

  /** 课文骨架：标题 + 引言 + 正文 + 1 随堂 + 2 测验 */
  function lessonTemplate(id, title) {
    const zh = lang === 'zh';
    return `# ${id} ${title}

> ${zh ? '这一节解决什么问题？在这里写一句引言。' : 'What does this section solve? Write a one-line intro here.'}

## ${zh ? '正文' : 'Content'}

${zh ? '在这里写正文。代码块用三个反引号包裹。' : 'Write your content here. Wrap code in triple backticks.'}

\`\`\`python
print("hello")
\`\`\`

## ${zh ? '随堂练习' : 'In-class exercise'}

\`\`\`quiz
type: choice
q: ${zh ? '下面哪个是正确的？' : 'Which one is correct?'}
options:
- ${zh ? '选项 A' : 'Option A'}
- ${zh ? '选项 B' : 'Option B'}
answer: 0
hint: ${zh ? '想一想' : 'Think about it'}
explain: ${zh ? '因为……' : 'Because…'}
\`\`\`

## ${zh ? '本节测验' : 'Section quiz'}

\`\`\`quiz
type: choice
exam: true
q: ${zh ? '第一道测验题' : 'First quiz question'}
options:
- ${zh ? '选项 A' : 'Option A'}
- ${zh ? '选项 B' : 'Option B'}
answer: 0
\`\`\`

\`\`\`quiz
type: function
exam: true
q: ${zh ? '写一个函数' : 'Write a function'}
func: add
starter: |
  def add(a, b):
      return 0
cases: |
  1 2 -> 3
  5 7 -> 12
hint: ${zh ? '用加法' : 'Use addition'}
\`\`\`
`;
  }

  /* ================= 统计 ================= */

  function stats(b) {
    let chapters = 0, lessons = 0, questions = 0;
    for (const ch of (b.chapters || [])) {
      chapters++;
      for (const ls of (ch.lessons || [])) {
        lessons++;
        questions += (BookCheck.blocks(ls.md || '')).length;
      }
    }
    return { chapters, lessons, questions };
  }

  /** 把草稿变成 { path: text }，给校验器和发布用 */
  function toFiles(b) {
    const files = {};
    files['albook.json'] = JSON.stringify({
      format: 'al-book', version: 1,
      id: b.id, title: b.title, subtitle: b.subtitle, desc: b.desc,
      stage: b.stage, level: b.level, langs: b.langs, license: b.license,
      author: b.author, tags: b.tags || [],
    }, null, 2);

    files['README.md'] = `# ${b.title}\n\n${b.desc || b.subtitle || ''}\n\n` +
      `---\n\n${T('bookIdPh').split('，')[0]}: \`${b.repo}\`\n`;

    for (const L of (b.langs && b.langs.length ? b.langs : ['zh'])) {
      const lessons = [];
      for (const ch of (b.chapters || [])) {
        for (const ls of (ch.lessons || [])) lessons.push(ls);
      }
      files[`content/${L}/toc.json`] = JSON.stringify({
        book: b.id,
        chapters: (b.chapters || []).map((ch, i) => ({
          title: ch.title,
          lessons: ch.lessons.map(ls => ls.id),
          test: ch.test || null,
        })),
      }, null, 2);
      for (const ls of lessons) {
        files[`content/${L}/lessons/${ls.id}.md`] = ls.md || '';
      }
      // 章测内容。不输出的话 toc 会声明 test-01 却没有对应文件，
      // 读者点章测直接 404 —— 而且校验器查不出来（它只看实际存在的文件）。
      for (const ch of (b.chapters || [])) {
        if (ch.test && ch.testMd) files[`content/${L}/lessons/${ch.test}.md`] = ch.testMd;
      }
    }
    return files;
  }

  /* ================= 渲染：预览 ================= */

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /**
   * 所见即所得的预览。
   *
   * 题目是真能跑的（接 Quiz.render），作者写完可以当场试一下对不对 ——
   * 这是"题目有没有区分力"唯一可靠的验证方式。
   * 但用 PREVIEW_PREFIX 隔离：结果不写进进度，也不触发节奏守护。
   *
   * 打字时每 400ms 会重渲染一次。如果题目源码没变就不重建题目 DOM，
   * 否则作者刚填了一半的答案会被冲掉。
   */
  let lastQuizSig = null;
  function renderPreview(pv, md, sigKey) {
    const sources = (md || '').match(/```quiz\n[\s\S]*?^```\s*$/gm) || [];
    const body = (md || '').replace(/```quiz\n[\s\S]*?^```\s*$/gm, '');

    let html = '';
    try { html = MD.render(body); }
    catch (e) { html = '<pre>' + esc(body) + '</pre>'; }

    const sig = sigKey + '|' + sources.join('\u0001');
    const same = (sig === lastQuizSig);

    if (!same) {
      lastQuizSig = sig;
      pv.innerHTML = html;
      const zh = lang === 'zh';
      if (sources.length) {
        const head = document.createElement('div');
        head.className = 'dev-qhead';
        head.textContent = `${sources.length} ${T('questions')}`;
        pv.appendChild(head);
      }
      sources.forEach((text, i) => {
        let q;
        try { q = MD.parseQuizText(text.replace(/^```quiz\n/, '').replace(/```\s*$/, '')); }
        catch (e) { q = null; }
        if (!q) return;
        const exam = String(q.exam || '').toLowerCase() === 'true';
        const wrap = document.createElement('div');
        wrap.className = 'dev-qbox-inline' + (exam ? ' exam' : '');
        pv.appendChild(wrap);
        try {
          // 用预览前缀，避免污染真实进度
          const box = Quiz.render(q, i, { key: (Quiz.PREVIEW_PREFIX || '__dev__:') + sigKey });
          if (exam) {
            const tag = document.createElement('span');
            tag.className = 'dev-tag';
            tag.textContent = zh ? '计入学完' : 'counts as done';
            const h = box.querySelector('.quiz-head');
            if (h) h.appendChild(tag);
          }
          wrap.appendChild(box);
        } catch (e) {
          wrap.innerHTML = `<div class="dev-qo" style="color:#c9372c">${esc(e.message || e)}</div>`;
        }
      });
    } else {
      // 题目没变：只更新正文，题目 DOM 原样保留（保住作者填了一半的答案）
      const bodyHost = document.createElement('div');
      bodyHost.innerHTML = html;
      const keep = pv.querySelectorAll('.dev-qbox-inline');
      const head = pv.querySelector('.dev-qhead');
      pv.innerHTML = '';
      pv.appendChild(bodyHost);
      if (head) pv.appendChild(head);
      keep.forEach(el => pv.appendChild(el));
    }
  }

  /** 兼容旧的静态预览调用（评审报告等非交互场景用不到，这里保留纯文本版） */
  function previewMd(md) {
    const quizzes = BookCheck.blocks(md || '');
    const body = (md || '').replace(/```quiz\n[\s\S]*?^```\s*$/gm, '');
    let html = '';
    try { html = MD.render(body); }
    catch (e) { html = '<pre>' + esc(body) + '</pre>'; }
    return html;
  }

  /* ================= 视图：列表 ================= */

  function mountList(root) {
    const all = loadAll();
    const books = Object.values(all).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

    root.innerHTML = `
      <div class="dev-head">
        <a class="dev-back" href="#/">${lang === 'zh' ? '← 回到书城' : '← Back to library'}</a>
        <h1>${T('devTitle')}</h1>
        <p class="dev-sub">${T('devSub')}</p>
      </div>
      <div class="dev-bar">
        <button class="dev-btn" id="dev-new">${T('newBook')}</button>
        <button class="dev-btn ghost" id="dev-import">${T('importBtn')}</button>
        <span class="dev-hint">${T('topicsHint')}</span>
      </div>
      <div class="dev-grid" id="dev-grid"></div>`;

    const grid = $('dev-grid');
    if (!books.length) {
      grid.innerHTML = `<div class="dev-empty">${T('noBooks')}</div>`;
    } else {
      grid.innerHTML = books.map(b => {
        const s = stats(b);
        const pub = b.published;
        return `<div class="dev-card">
          <div class="dev-card-top">
            <h3>${esc(b.title)}</h3>
            <span class="dev-badge ${pub ? 'ok' : ''}">${pub ? T('published') : T('draft')}</span>
          </div>
          <div class="dev-card-sub">${esc(b.subtitle || b.repo)}</div>
          <div class="dev-card-meta">${tf('statsBar', { c: s.chapters, l: s.lessons, q: s.questions })}</div>
          <div class="dev-card-meta dim">${esc(b.repo)}${pub ? ' · ' + (pub.visibility === 'private' ? T('priv') : T('pub')) : ''}</div>
          <div class="dev-card-actions">
            <button class="dev-btn sm" data-edit="${esc(b.id)}">${T('edit')}</button>
            <button class="dev-btn sm ghost" data-report="${esc(b.id)}">${T('report')}</button>
            ${pub ? `<button class="dev-btn sm ghost" data-manage="${esc(b.id)}">${T('manage')}</button>` : ''}
            <button class="dev-btn sm danger" data-del="${esc(b.id)}">${T('del')}</button>
          </div>
        </div>`;
      }).join('');
    }

    $('dev-new').onclick = showNewDialog;
    $('dev-import').onclick = showImportDialog;
    grid.querySelectorAll('[data-edit]').forEach(el => {
      el.onclick = () => { cur = getBook(el.dataset.edit); mountEditor(root); };
    });
    grid.querySelectorAll('[data-report]').forEach(el => {
      el.onclick = () => showReport(getBook(el.dataset.report));
    });
    grid.querySelectorAll('[data-manage]').forEach(el => {
      el.onclick = () => showManage(getBook(el.dataset.manage), root);
    });
    grid.querySelectorAll('[data-del]').forEach(el => {
      el.onclick = () => {
        const b = getBook(el.dataset.del);
        if (!confirm(tf('delConfirm', { t: b.title }))) return;
        delBook(b.id);
        mountList(root);
      };
    });
  }

  /* ================= 新建对话框 ================= */

  function showNewDialog() {
    const root = $('dev-root') || document.querySelector('.dev-wrap');
    const box = document.createElement('div');
    box.className = 'dev-modal';
    box.innerHTML = `<div class="dev-modal-box">
      <h3>${T('newBookTitle')}</h3>
      <input type="text" id="nb-id" placeholder="${T('bookIdPh')}" autocomplete="off" spellcheck="false">
      <input type="text" id="nb-title" placeholder="${T('bookTitlePh')}" autocomplete="off">
      <div class="dev-modal-actions">
        <button class="dev-btn" id="nb-ok">${T('create')}</button>
        <button class="dev-btn ghost" id="nb-cancel">${T('cancel')}</button>
      </div>
      <div class="dev-err" id="nb-err" hidden></div>
    </div>`;
    document.body.appendChild(box);
    const close = () => box.remove();
    $('nb-cancel').onclick = close;
    box.onclick = e => { if (e.target === box) close(); };
    const submit = () => {
      const id = $('nb-id').value.trim();
      const title = $('nb-title').value.trim();
      const err = $('nb-err');
      if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) { err.hidden = false; err.textContent = T('badId'); return; }
      if (getBook(id)) { err.hidden = false; err.textContent = T('dupId'); return; }
      const b = blank(id, title || id);
      putBook(b);
      close();
      cur = b;
      curLesson = { chIdx: 0, lsIdx: 0 };
      mountEditor(root);
    };
    $('nb-ok').onclick = submit;
    $('nb-id').addEventListener('keydown', e => { if (e.key === 'Enter') $('nb-title').focus(); });
    $('nb-title').addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    $('nb-id').focus();
  }

  /* ================= 从已有书导入 ================= */

  /**
   * 从任意符合格式的仓库导入内容，作为新草稿。
   *
   * 为什么做这个：从空白开始写一本 30 课的书很劝退，
   * 而 fork 别人的书再改是最自然的起步方式。
   *
   * 只导入当前语言那一份 —— 草稿结构是一份课文对应所有 langs，
   * 塞两种语言进来没法编辑。
   */
  async function fetchBookForImport(full) {
    let repo = null, branch = 'main';
    try {
      const r = await fetch(`https://api.github.com/repos/${full}`);
      if (r.status === 404) throw new Error(T('impNotFound'));
      if (!r.ok) throw new Error('HTTP ' + r.status);
      repo = await r.json();
      branch = repo.default_branch || 'main';
    } catch (e) {
      throw new Error(T('impReadFail') + '：' + e.message);
    }

    const [owner, name] = full.split('/');
    // 先拿元信息和目录
    const metaRaw = await GhSrc.text(owner, name, branch, 'albook.json');
    let meta;
    try { meta = JSON.parse(metaRaw); }
    catch (e) { throw new Error(T('impBadMeta')); }
    if (String(meta.format || '').trim() !== 'al-book') throw new Error(T('impNotAlBook'));

    // 语言：优先当前界面语言，没有就取书声明的第一个
    let L = lang;
    if (!(meta.langs || []).includes(L)) L = (meta.langs || [])[0] || 'zh';

    const tocRaw = await GhSrc.text(owner, name, branch, `content/${L}/toc.json`);
    let toc;
    try { toc = JSON.parse(tocRaw); }
    catch (e) { throw new Error(T('impBadToc')); }

    // 官方 toc 是 [{title, items:[{id,title,summary}], test}]，
    // 第三方 toc 是 {chapters:[{title, lessons:["01"...], test}]}，两种都要认
    const rawChapters = toc.chapters || [];
    const paths = [];
    const shape = [];
    for (const ch of rawChapters) {
      const items = (ch.items || ch.lessons || []).map(x =>
        (typeof x === 'string' ? { id: x } : { id: String(x.id), title: x.title }));
      for (const it of items) paths.push(`content/${L}/lessons/${it.id}.md`);
      if (ch.test) paths.push(`content/${L}/lessons/${ch.test}.md`);
      shape.push({ title: ch.title || '', items, test: ch.test || null });
    }
    if (!paths.length) throw new Error(T('impEmpty'));

    const got = await GhSrc.many(owner, name, branch, paths);
    return { meta, toc, shape, got, L, branch, full, owner, name };
  }

  function showImportDialog() {
    const root = $('dev-root') || document.querySelector('.dev-wrap');
    const box = document.createElement('div');
    box.className = 'dev-modal';
    box.innerHTML = `<div class="dev-modal-box wide">
      <h3>${T('importTitle')}</h3>
      <p class="dim" style="font-size:12.5px">${T('importDesc')}</p>
      <input type="text" id="im-repo" placeholder="${T('repoPh')}" autocomplete="off" spellcheck="false">
      <div id="im-pick" class="dev-pick"></div>
      <div id="im-out" class="dev-out"></div>
      <div class="dev-modal-actions">
        <button class="dev-btn" id="im-go">${T('importBtn2')}</button>
        <button class="dev-btn ghost" id="im-cancel">${T('cancel')}</button>
      </div>
    </div>`;
    document.body.appendChild(box);
    const close = () => box.remove();
    $('im-cancel').onclick = close;
    box.onclick = e => { if (e.target === box) close(); };

    // 把已收录的第三方书列出来，点一下就填进去
    const known = (window.__thirdBooks || []).filter(b => b.repo);
    if (known.length) {
      $('im-pick').innerHTML = `<div class="dev-pick-h">${T('importPick')}</div>` +
        known.slice(0, 20).map(b =>
          `<button class="dev-pick-i" data-r="${esc(b.repo)}">
             <b>${esc(b.title)}</b><span>${esc(b.repo)}</span></button>`).join('');
      $('im-pick').querySelectorAll('[data-r]').forEach(el => {
        el.onclick = () => { $('im-repo').value = el.dataset.r; };
      });
    }

    $('im-go').onclick = async () => {
      const full = $('im-repo').value.trim()
        .replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
      if (!full.includes('/')) { alert(T('repoFmt')); return; }
      const out = $('im-out');
      $('im-go').disabled = true;
      out.innerHTML = `<div class="dev-step run"><span>◐</span>${T('impReading')}</div>`;
      try {
        const r = await fetchBookForImport(full);
        out.innerHTML = `<div class="dev-step done"><span>✓</span>${
          T('impReady').replace('{t}', r.meta.title || full)
            .replace('{n}', Object.keys(r.got).length)}</div>`;

        // 生成不冲突的 id
        let id = String(r.meta.id || r.name.replace(/^al-book-/, '') || 'imported')
          .trim().replace(/[^a-z0-9-]/gi, '-').toLowerCase().replace(/^-+/, '');
        if (!/^[a-z0-9]/.test(id)) id = 'b-' + id;
        const all = loadAll();
        let nid = id, k = 2;
        while (all[nid]) { nid = id + '-' + k; k++; }

        const b = {
          id: nid,
          repo: 'al-book-' + nid,
          title: r.meta.title || nid,
          subtitle: r.meta.subtitle || '',
          desc: r.meta.desc || '',
          stage: r.meta.stage || '基础',
          level: r.meta.level || '入门',
          langs: [r.L],
          license: r.meta.license || 'CC BY-NC 4.0',
          author: { name: (r.meta.author && r.meta.author.name) || '' },
          tags: r.meta.tags || [],
          chapters: [],
          importedFrom: { repo: r.full, branch: r.branch, lang: r.L, at: Date.now() },
          published: null,
          createdAt: Date.now(), updatedAt: Date.now(),
        };

        for (const sh of r.shape) {
          const lessons = [];
          for (const it of sh.items) {
            const md = r.got[`content/${r.L}/lessons/${it.id}.md`];
            if (md == null) continue;
            lessons.push({ id: String(it.id), title: it.title || String(it.id), md });
          }
          if (!lessons.length) continue;
          const testMd = sh.test ? r.got[`content/${r.L}/lessons/${sh.test}.md`] : null;
          b.chapters.push({ title: sh.title, lessons, test: sh.test || null, testMd: testMd || '' });
        }
        if (!b.chapters.length) throw new Error(T('impEmpty'));

        putBook(b);
        close();
        cur = b;
        curLesson = { chIdx: 0, lsIdx: 0 };
        mountEditor(root);
      } catch (e) {
        out.innerHTML = `<div class="dev-step fail"><span>✗</span>${esc(e.message || e)}</div>`;
        $('im-go').disabled = false;
      }
    };
  }

  /* ================= 视图：编辑器 ================= */

  function mountEditor(root) {
    const b = cur;
    if (!b) return mountList(root);
    if (!curLesson) curLesson = { chIdx: 0, lsIdx: 0 };

    root.innerHTML = `
      <div class="dev-ed-top">
        <button class="dev-btn ghost sm" id="de-back">${T('backList')}</button>
        <input type="text" class="de-title" id="de-booktitle" value="${esc(b.title)}" placeholder="${T('bookTitlePh')}">
        <span class="dev-state" id="de-state">${T('allSaved')}</span>
        <button class="dev-btn sm" id="de-save">${T('save')}</button>
        <button class="dev-btn sm ghost" id="de-info">${T('bookInfo')}</button>
        <button class="dev-btn sm ghost" id="de-report">${T('report')}</button>
        <button class="dev-btn sm" id="de-publish">${T('publish')}</button>
      </div>
      <div class="dev-ed">
        <aside class="dev-tree">
          <div class="dev-tree-head">${T('chapters')}</div>
          <div id="de-tree"></div>
          <button class="dev-btn sm ghost wide" id="de-addch">${T('addChapter')}</button>
        </aside>
        <section class="dev-edit">
          <div class="dev-pane-head" id="de-lshead"></div>
          <textarea id="de-md" spellcheck="false"></textarea>
        </section>
        <section class="dev-view">
          <div class="dev-pane-head">${T('preview')}</div>
          <div id="de-pv" class="dev-pv-body"></div>
        </section>
      </div>
      <div class="dev-ed-foot" id="de-foot"></div>`;

    drawTree();
    drawLesson();

    $('de-back').onclick = () => { flush(); mountList(root); };
    $('de-info').onclick = () => showBookInfo(b);
    $('de-booktitle').oninput = () => { b.title = $('de-booktitle').value; markDirty(); };
    $('de-save').onclick = () => flush(true);
    $('de-report').onclick = () => { flush(); showReport(b); };
    $('de-publish').onclick = () => { flush(true); showPublish(b, root); };
    $('de-addch').onclick = () => {
      const n = (b.chapters || []).length + 1;
      b.chapters = b.chapters || [];
      b.chapters.push({
        title: (lang === 'zh' ? '第 ' : 'Chapter ') + n + (lang === 'zh' ? ' 章' : ''),
        lessons: [], test: 'test-' + String(n).padStart(2, '0'),
      });
      putBook(b); drawTree(); markDirty();
    };
    $('de-md').oninput = () => {
      const ls = lessonAt();
      if (ls) ls.md = $('de-md').value;
      markDirty();
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => { flush(); drawPreview(); }, 400);
    };
  }

  function lessonAt() {
    if (!cur || !curLesson) return null;
    const ch = (cur.chapters || [])[curLesson.chIdx];
    if (!ch) return null;
    if (curLesson.isTest) {
      // 章测也当作一"课"来编辑，只是内容存在 chapter.testMd 上
      return { id: ch.test || 'test', title: T('testName'), get md() { return ch.testMd || ''; },
               set md(v) { ch.testMd = v; } };
    }
    return (ch.lessons || [])[curLesson.lsIdx] || null;
  }

  function drawTree() {
    const b = cur;
    const box = $('de-tree');
    if (!box) return;
    box.innerHTML = (b.chapters || []).map((ch, ci) => `
      <div class="dev-ch">
        <input type="text" class="dev-ch-t" data-cht="${ci}" value="${esc(ch.title)}" placeholder="${T('chTitlePh')}">
        <button class="dev-x" data-delch="${ci}" title="${T('delChapter')}">×</button>
      </div>
      <div class="dev-lss">
        ${(ch.lessons || []).map((ls, li) => `
          <div class="dev-ls ${curLesson && !curLesson.isTest && curLesson.chIdx === ci && curLesson.lsIdx === li ? 'on' : ''}"
               data-go="${ci},${li}">
            <span class="n">${esc(ls.id)}</span>
            <span class="t">${esc(ls.title || ls.id)}</span>
            <button class="dev-x" data-dells="${ci},${li}" title="${T('delLesson')}">×</button>
          </div>`).join('')}
        ${ch.test ? `
          <div class="dev-ls test ${curLesson && curLesson.isTest && curLesson.chIdx === ci ? 'on' : ''}"
               data-gotest="${ci}">
            <span class="n">测</span>
            <span class="t">${esc(ch.test)}.md${ch.testMd ? '' : ` <i class="dim">${T('testEmpty')}</i>`}</span>
          </div>` : ''}
        <button class="dev-btn xs ghost wide" data-addls="${ci}">${T('addLesson')}</button>
      </div>`).join('');

    box.querySelectorAll('[data-cht]').forEach(el => {
      el.oninput = () => { cur.chapters[+el.dataset.cht].title = el.value; markDirty(); };
    });
    box.querySelectorAll('[data-delch]').forEach(el => {
      el.onclick = (e) => {
        e.stopPropagation();
        if (!confirm(T('delChapter') + '?')) return;
        cur.chapters.splice(+el.dataset.delch, 1);
        curLesson = { chIdx: 0, lsIdx: 0 };
        putBook(cur); drawTree(); drawLesson(); markDirty();
      };
    });
    box.querySelectorAll('[data-dells]').forEach(el => {
      el.onclick = (e) => {
        e.stopPropagation();
        if (!confirm(T('delLesson') + '?')) return;
        const [ci, li] = el.dataset.dells.split(',').map(Number);
        cur.chapters[ci].lessons.splice(li, 1);
        curLesson = { chIdx: ci, lsIdx: 0 };
        putBook(cur); drawTree(); drawLesson(); markDirty();
      };
    });
    box.querySelectorAll('[data-addls]').forEach(el => {
      el.onclick = () => {
        const ci = +el.dataset.addls;
        const ch = cur.chapters[ci];
        const n = String((ch.lessons || []).length + 1).padStart(2, '0');
        const t = (lang === 'zh' ? '第 ' : 'Lesson ') + (ch.lessons.length + 1);
        ch.lessons = ch.lessons || [];
        ch.lessons.push({ id: n, title: t, md: lessonTemplate(n, t) });
        putBook(cur);
        curLesson = { chIdx: ci, lsIdx: ch.lessons.length - 1 };
        drawTree(); drawLesson(); markDirty();
      };
    });
    box.querySelectorAll('[data-gotest]').forEach(el => {
      el.onclick = () => {
        flush();
        curLesson = { chIdx: +el.dataset.gotest, isTest: true };
        drawTree(); drawLesson();
      };
    });
    box.querySelectorAll('[data-go]').forEach(el => {
      el.onclick = () => {
        flush();
        const [ci, li] = el.dataset.go.split(',').map(Number);
        curLesson = { chIdx: ci, lsIdx: li };
        drawTree(); drawLesson();
      };
    });
  }

  function drawLesson() {
    const ls = lessonAt();
    const head = $('de-lshead'), ta = $('de-md'), pv = $('de-pv');
    if (!head || !ta) return;
    if (!ls) {
      head.textContent = '';
      ta.value = '';
      ta.disabled = true;
      if (pv) pv.innerHTML = `<div class="dev-empty">${T('noLesson')}</div>`;
      drawFoot();
      return;
    }
    ta.disabled = false;
    head.innerHTML = `<input type="text" class="dev-ls-t" id="de-lstitle" value="${esc(ls.title || '')}"
      placeholder="${T('lsTitlePh')}"><span class="dim">${esc(ls.id)}.md</span>`;
    $('de-lstitle').oninput = () => { ls.title = $('de-lstitle').value; markDirty(); drawTree(); };
    ta.value = ls.md || '';
    lastQuizSig = null;
    drawPreview();
    drawFoot();
  }

  function drawPreview() {
    const pv = $('de-pv');
    const ls = lessonAt();
    if (!pv) return;
    if (!ls) { pv.innerHTML = `<div class="dev-empty">${T('noLesson')}</div>`; lastQuizSig = null; return; }
    const key = (cur ? cur.id : 'x') + '/' + (ls.id || '?');
    renderPreview(pv, ls.md, key);
    if (!pv.firstChild) pv.innerHTML = `<div class="dev-empty">${T('writeHint')}</div>`;
  }

  function drawFoot() {
    const f = $('de-foot');
    if (!f || !cur) return;
    const s = stats(cur);
    f.innerHTML = `<span>${tf('statsBar', { c: s.chapters, l: s.lessons, q: s.questions })}</span>
      <span class="dim">${T('writeHint')}</span>`;
  }

  function markDirty() {
    const el = $('de-state');
    if (el) { el.textContent = T('dirty'); el.className = 'dev-state dirty'; }
  }
  function flush(show) {
    if (!cur) return;
    putBook(cur);
    const el = $('de-state');
    if (el) {
      el.textContent = show ? T('saved') : T('allSaved');
      el.className = 'dev-state';
      if (show) setTimeout(() => { if (el.textContent === T('saved')) el.textContent = T('allSaved'); }, 1200);
    }
    drawFoot();
  }

  /* ================= 书籍信息 ================= */

  function showBookInfo(b) {
    const box = document.createElement('div');
    box.className = 'dev-modal';
    box.innerHTML = `<div class="dev-modal-box wide">
      <h3>${T('bookInfo')}</h3>
      <div class="dev-form">
        <label>${T('fTitle')}<input type="text" id="bi-title" value="${esc(b.title)}"></label>
        <label>${T('fSubtitle')}<input type="text" id="bi-sub" value="${esc(b.subtitle)}"></label>
        <label>${T('fDesc')}<textarea id="bi-desc" rows="3">${esc(b.desc)}</textarea></label>
        <div class="dev-form-row">
          <label>${T('fAuthor')}<input type="text" id="bi-author" value="${esc((b.author || {}).name || '')}"></label>
          <label>${T('fLicense')}<input type="text" id="bi-license" value="${esc(b.license || '')}"></label>
        </div>
        <div class="dev-form-row">
          <label>${T('fStage')}<input type="text" id="bi-stage" value="${esc(b.stage || '')}"></label>
          <label>${T('fLevel')}<input type="text" id="bi-level" value="${esc(b.level || '')}"></label>
        </div>
        <label>${T('fLangs')}
          <div class="dev-checks">
            <label class="dev-radio"><input type="checkbox" id="bi-zh" ${(b.langs || []).includes('zh') ? 'checked' : ''}> 中文</label>
            <label class="dev-radio"><input type="checkbox" id="bi-en" ${(b.langs || []).includes('en') ? 'checked' : ''}> English</label>
          </div>
        </label>
        <label>${T('fRepo')}<input type="text" id="bi-repo" value="${esc(b.repo)}" spellcheck="false"></label>
      </div>
      <div class="dev-modal-actions">
        <button class="dev-btn" id="bi-ok">${T('save')}</button>
        <button class="dev-btn ghost" id="bi-cancel">${T('cancel')}</button>
      </div>
    </div>`;
    document.body.appendChild(box);
    const close = () => box.remove();
    $('bi-cancel').onclick = close;
    box.onclick = e => { if (e.target === box) close(); };
    $('bi-ok').onclick = () => {
      b.title = $('bi-title').value.trim() || b.id;
      b.subtitle = $('bi-sub').value.trim();
      b.desc = $('bi-desc').value.trim();
      b.author = { name: $('bi-author').value.trim() };
      b.license = $('bi-license').value.trim();
      b.stage = $('bi-stage').value.trim();
      b.level = $('bi-level').value.trim();
      const L = [];
      if ($('bi-zh').checked) L.push('zh');
      if ($('bi-en').checked) L.push('en');
      b.langs = L.length ? L : ['zh'];
      b.repo = ($('bi-repo').value.trim() || 'al-book-' + b.id);
      putBook(b);
      const t = $('de-booktitle');
      if (t) t.value = b.title;
      drawFoot();
      flush(true);
      close();
    };
  }

  /* ================= 评审报告 ================= */

  function showReport(b) {
    const files = toFiles(b);
    const rep = BookCheck.validate(files);
    const s = rep.stats;
    const box = document.createElement('div');
    box.className = 'dev-modal';
    box.innerHTML = `<div class="dev-modal-box wide">
      <h3>${T('reportTitle')} · ${esc(b.title)}</h3>
      <div class="dev-verdict ${rep.ok ? 'ok' : 'bad'}">
        ${rep.ok ? '✓ ' + T('reportClean') : '✗ ' + rep.errors.length + ' ' + T('mustFix')}
        <small>${s.lessons} ${T('lessons')} · ${s.questions} ${T('questions')} · ${s.languages} ${T('langLabel')}</small>
      </div>
      ${rep.errors.length ? `<div class="dev-h bad">${T('mustFix')}</div>
        <ul class="dev-issues">${rep.errors.map(e => `<li>${esc(e)}</li>`).join('')}</ul>` : ''}
      ${rep.warnings.length ? `<div class="dev-h warn">${lang === 'zh' ? '建议改进' : 'Suggestions'}</div>
        <ul class="dev-issues">${rep.warnings.map(e => `<li>${esc(e)}</li>`).join('')}</ul>` : ''}
      ${!rep.errors.length && !rep.warnings.length ? `<div class="dev-empty">${T('reportClean')}</div>` : ''}
      <div class="dev-modal-actions">
        <button class="dev-btn ghost" id="rep-close">${lang === 'zh' ? '关闭' : 'Close'}</button>
      </div>
    </div>`;
    document.body.appendChild(box);
    const close = () => box.remove();
    $('rep-close').onclick = close;
    box.onclick = e => { if (e.target === box) close(); };
  }

  /* ================= 发布 ================= */

  function showPublish(b, root) {
    if (!api) { alert(T('needLogin')); return; }
    const rep = BookCheck.validate(toFiles(b));

    const box = document.createElement('div');
    box.className = 'dev-modal';
    box.innerHTML = `<div class="dev-modal-box wide">
      <h3>${tf('publishTitle', { t: b.title })}</h3>
      ${!rep.ok ? `<div class="dev-verdict bad">${T('mustFix')}
        <ul class="dev-issues">${rep.errors.slice(0, 10).map(e => `<li>${esc(e)}</li>`).join('')}</ul></div>
        <p class="dim">${lang === 'zh' ? '修好这些问题再发布吧。也可以先发布，之后随时改。' : 'Fix these first — or publish anyway and fix later.'}</p>` : ''}
      <div class="dev-h">${T('visibility')}</div>
      <label class="dev-radio"><input type="radio" name="vis" value="public" checked> ${T('pub')}</label>
      <label class="dev-radio"><input type="radio" name="vis" value="private"> ${T('priv')}</label>
      <p class="dim">${T('topicsHint')}</p>
      <div class="dev-steps" id="pb-steps"></div>
      <div class="dev-modal-actions">
        <button class="dev-btn" id="pb-go">${T('startPublish')}</button>
        <button class="dev-btn ghost" id="pb-cancel">${T('cancel')}</button>
      </div>
    </div>`;
    document.body.appendChild(box);
    const close = () => box.remove();
    $('pb-cancel').onclick = close;
    box.onclick = e => { if (e.target === box) close(); };

    $('pb-go').onclick = async () => {
      const priv = document.querySelector('input[name=vis]:checked').value === 'private';
      const steps = $('pb-steps');
      const names = [T('stepCheck'), T('stepRepo'), T('stepFiles'), T('stepTopic')];
      const paint = (i, state, extra) => {
        steps.innerHTML = names.map((n, k) => {
          let cls = k < i ? 'done' : (k === i ? (state || 'run') : '');
          let mark = k < i ? '✓' : (k === i ? (state === 'fail' ? '✗' : '◐') : '○');
          return `<div class="dev-step ${cls}"><span>${mark}</span>${esc(n)}${k === i && extra ? ` <i class="dim">${esc(extra)}</i>` : ''}</div>`;
        }).join('');
      };
      $('pb-go').disabled = true;
      $('pb-go').textContent = T('publishing');

      try {
        paint(0);
        const files = toFiles(b);
        const r0 = BookCheck.validate(files);
        if (!r0.ok) throw new Error(r0.errors.length + ' ' + T('mustFix'));

        // 建仓库
        paint(1);
        const owner = await api.getUsername();
        let exists = true;
        try { await api.getRepository(owner, b.repo); }
        catch (e) { exists = false; }
        if (!exists) {
          await api.createRepository(b.repo, {
            description: `${b.title} — AnyLearn book`,
            private: priv, autoInit: true,
          });
          await new Promise(r => setTimeout(r, 2500));
        } else if (!exists === false) {
          // 已存在：按用户选择改可见性
          try { await api.setVisibility(owner, b.repo, priv); } catch (e) {}
        }
        const branch = await api.getDefaultBranch(owner, b.repo).catch(() => 'main');

        // 推文件
        paint(2);
        const paths = Object.keys(files);
        let n = 0;
        const queue = paths.slice();
        async function worker() {
          while (queue.length) {
            const p = queue.shift();
            try { await api.createOrUpdateFile(owner, b.repo, p, files[p], `publish: ${p}`, branch); n++; }
            catch (e) { /* 单个失败不阻断 */ }
            if (n % 5 === 0) paint(2, 'run', `${n}/${paths.length}`);
          }
        }
        await Promise.all(Array.from({ length: Math.min(6, paths.length) }, worker));
        paint(2, 'done', `${n} ${T('filesPushed')}`);

        // 打 topic
        paint(3);
        try { await api.setTopics(owner, b.repo, ['al-book']); } catch (e) {}

        b.published = {
          repo: `${owner}/${b.repo}`, owner, name: b.repo, branch,
          url: `https://github.com/${owner}/${b.repo}`,
          visibility: priv ? 'private' : 'public',
          at: Date.now(),
        };
        putBook(b);
        if (window.__refreshExternal) window.__refreshExternal();
        paint(4, 'done');
        steps.innerHTML += `<div class="dev-step done"><span>🎉</span>${T('publishOk')}
          <a href="${esc(b.published.url)}" target="_blank" rel="noopener">${T('openRepo')}</a></div>`;
        $('pb-go').textContent = T('done');
        $('pb-go').disabled = true;
        setTimeout(close, 2200);
      } catch (e) {
        paint(-1, 'fail');
        steps.innerHTML += `<div class="dev-step fail"><span>✗</span>${T('publishFail')}：${esc(e.message || e)}</div>`;
        $('pb-go').disabled = false;
        $('pb-go').textContent = T('startPublish');
      }
    };
  }

  /* ================= 管理已发布的仓库 ================= */

  function showManage(b, root) {
    const p = b.published;
    if (!p) return;
    const box = document.createElement('div');
    box.className = 'dev-modal';
    box.innerHTML = `<div class="dev-modal-box wide">
      <h3>${tf('manageTitle', { t: b.title })}</h3>
      <div class="dev-h">${T('repoUrl')}</div>
      <div><a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.repo)} ↗</a></div>
      <div class="dev-h">${T('visLabel')}</div>
      <div class="dev-vis">
        <span class="dev-badge ${p.visibility === 'public' ? 'ok' : ''}">${
          p.visibility === 'public' ? T('pub') : T('priv')}</span>
        ${p.visibility === 'private'
          ? `<button class="dev-btn sm" id="mg-public">${T('makePublic')}</button>`
          : `<button class="dev-btn sm ghost" id="mg-private">${T('makePrivate')}</button>`}
      </div>
      <p class="dim">${p.visibility === 'private' ? T('visWarn') : T('visPubNote')}</p>
      <div class="dev-modal-actions">
        <button class="dev-btn ghost" id="mg-report">${T('report')}</button>
        <button class="dev-btn danger" id="mg-unpub">${T('unpublish')}</button>
        <button class="dev-btn ghost" id="mg-close">${lang === 'zh' ? '关闭' : 'Close'}</button>
      </div>
    </div>`;
    document.body.appendChild(box);
    const close = () => { box.remove(); mountList(root); };
    $('mg-close').onclick = close;
    box.onclick = e => { if (e.target === box) close(); };

    const switchVis = async (toPrivate) => {
      if (!api) { alert(T('needLogin')); return; }
      try {
        await api.setVisibility(p.owner, p.name, toPrivate);
        p.visibility = toPrivate ? 'private' : 'public';
        putBook(b);
        box.remove();
        showManage(b, root);
      } catch (e) { alert(T('publishFail') + '：' + (e.message || e)); }
    };
    if ($('mg-public')) $('mg-public').onclick = () => switchVis(false);
    if ($('mg-private')) $('mg-private').onclick = () => switchVis(true);
    $('mg-report').onclick = () => showReport(b);
    $('mg-unpub').onclick = () => {
      if (!confirm(T('unpublishConfirm'))) return;
      b.published = null;
      putBook(b);
      box.remove();
      mountList(root);
    };
  }

  /* ================= 挂载 ================= */

  const CSS = `
  .dev-wrap{max-width:1320px;margin:0 auto;padding:26px 22px 70px;color:var(--text);line-height:1.7}
  .dev-head{margin-bottom:20px}
  .dev-back{font-size:13px;color:var(--dim)}
  .dev-head h1{font-size:25px;margin:6px 0 4px;font-weight:740;letter-spacing:-.02em}
  .dev-sub{color:var(--dim);font-size:14px;margin:0}
  .dev-bar{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:18px}
  .dev-hint{font-size:12.5px;color:var(--faint)}
  .dev-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:9px;
    border:1px solid var(--accent);background:var(--accent);color:#fff;font-size:13.5px;font-weight:600;
    cursor:pointer;font-family:inherit;text-decoration:none;transition:.15s}
  .dev-btn:hover{filter:brightness(1.1);text-decoration:none}
  .dev-btn:disabled{opacity:.5;cursor:not-allowed}
  .dev-btn.ghost{background:var(--panel);color:var(--text);border-color:var(--border)}
  .dev-btn.danger{background:transparent;color:#c9372c;border-color:#c9372c}
  .dev-btn.sm{padding:6px 12px;font-size:12.5px}
  .dev-btn.xs{padding:4px 9px;font-size:11.5px}
  .dev-btn.wide{width:100%;justify-content:center;margin-top:8px}

  .dev-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:14px}
  .dev-card{background:var(--panel);border:1px solid var(--border);border-radius:13px;
    padding:16px 18px;display:flex;flex-direction:column;gap:7px;transition:.15s}
  .dev-card:hover{border-color:color-mix(in srgb,var(--accent) 50%,var(--border));transform:translateY(-2px)}
  .dev-card-top{display:flex;align-items:flex-start;gap:8px;justify-content:space-between}
  .dev-card-top h3{margin:0;font-size:16.5px;font-weight:680;line-height:1.4}
  .dev-card-sub{color:var(--accent-2);font-size:13px;margin:-3px 0 0}
  .dev-card-meta{font-size:12.5px;color:var(--dim)}
  .dev-card-meta.dim{color:var(--faint)}
  .dev-card-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:5px}
  .dev-badge{font-size:11px;font-weight:650;padding:3px 9px;border-radius:99px;
    background:var(--border-soft);color:var(--dim);white-space:nowrap}
  .dev-badge.ok{background:#e8f5ec;color:#1a7f37}
  .dev-empty{color:var(--faint);font-size:13.5px;padding:26px 0;text-align:center}

  /* 编辑器三栏 */
  .dev-ed-top{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:14px}
  .de-title{flex:1;min-width:200px;padding:9px 13px;border:1px solid var(--border);border-radius:9px;
    background:var(--panel);color:var(--text);font-size:15px;font-weight:640;font-family:inherit}
  .dev-state{font-size:12px;color:var(--faint)}
  .dev-state.dirty{color:#9a6700}
  .dev-ed{display:grid;grid-template-columns:250px 1fr 1fr;gap:12px;align-items:start}
  @media(max-width:1000px){.dev-ed{grid-template-columns:1fr}}
  .dev-tree,.dev-edit,.dev-view{background:var(--panel);border:1px solid var(--border);
    border-radius:12px;overflow:hidden}
  .dev-tree{padding:12px}
  .dev-tree-head,.dev-pane-head{font-size:11px;letter-spacing:.12em;text-transform:uppercase;
    color:var(--faint);font-weight:700;margin-bottom:8px;padding:0 4px}
  .dev-ch{display:flex;gap:6px;align-items:center;margin-top:10px}
  .dev-ch-t{flex:1;padding:5px 8px;border:1px solid var(--border);border-radius:7px;
    background:transparent;color:var(--text);font-size:13px;font-weight:640;font-family:inherit}
  .dev-x{border:none;background:transparent;color:var(--faint);cursor:pointer;font-size:15px;
    padding:0 4px;line-height:1}
  .dev-x:hover{color:#c9372c}
  .dev-lss{margin-left:8px;border-left:1px solid var(--border);padding-left:10px;margin-bottom:4px}
  .dev-ls{display:flex;gap:8px;align-items:center;padding:4px 6px;border-radius:6px;
    cursor:pointer;font-size:13px}
  .dev-ls:hover{background:var(--border-soft)}
  .dev-ls.on{background:color-mix(in srgb,var(--accent) 18%,transparent)}
  .dev-ls .n{color:var(--faint);font-variant-numeric:tabular-nums;min-width:22px;font-size:12px}
  .dev-ls .t{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .dev-ls.test{border-top:1px dashed var(--border);margin-top:3px;padding-top:6px}
  .dev-edit,.dev-view{display:flex;flex-direction:column}
  .dev-edit textarea{flex:1;min-height:460px;border:none;outline:none;resize:vertical;
    padding:12px 16px;background:transparent;color:var(--text);font-size:13.5px;line-height:1.75;
    font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
  .dev-pane-head{padding:10px 16px 0}
  .dev-ls-t{flex:1;padding:4px 8px;border:1px solid var(--border);border-radius:7px;
    background:transparent;color:var(--text);font-size:13px;font-family:inherit}
  #de-lshead{display:flex;gap:8px;align-items:center;padding:10px 12px 8px}
  .dev-pv-body{padding:6px 18px 20px;max-height:560px;overflow:auto;font-size:14px}
  .dev-pv-body h1{font-size:19px;margin:10px 0 6px}
  .dev-pv-body h2{font-size:16px;margin:14px 0 6px}
  .dev-pv-body h3{font-size:14px;margin:12px 0 5px}
  .dev-pv-body pre{background:var(--border-soft);padding:10px 12px;border-radius:7px;overflow:auto;font-size:12.5px}
  .dev-pv-body blockquote{border-left:3px solid var(--accent);margin:8px 0;padding:4px 12px;color:var(--dim)}
  .dev-ed-foot{display:flex;gap:14px;flex-wrap:wrap;font-size:12.5px;color:var(--dim);
    margin-top:10px;padding-top:10px;border-top:1px solid var(--border)}
  .dim{color:var(--faint)}

  /* 题目卡片 */
  .dev-qhead{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);
    font-weight:700;margin:16px 0 6px}
  .dev-qbox{border:1px solid var(--border);border-radius:8px;padding:10px 13px;margin:8px 0;
    background:var(--panel)}
  .dev-qbox.exam{border-color:color-mix(in srgb,var(--accent) 45%,var(--border))}
  .dev-qt{font-size:13px;font-weight:640}
  .dev-qo{font-size:12.5px;color:var(--dim);padding-left:8px}
  .dev-tag{font-size:10.5px;font-weight:600;padding:2px 7px;border-radius:99px;
    background:color-mix(in srgb,var(--accent) 20%,transparent);color:var(--accent)}



  /* 预览里的题目卡片（内嵌真 Quiz 组件） */
  .dev-qbox-inline{margin:10px 0}
  .dev-qbox-inline.exam .quiz{border-color:color-mix(in srgb,var(--accent) 45%,var(--border))}
  .dev-pv-body .quiz{margin:0}
  .dev-tag{font-size:10.5px;font-weight:600;padding:2px 7px;border-radius:99px;
    background:color-mix(in srgb,var(--accent) 20%,transparent);color:var(--accent);
    margin-left:8px;white-space:nowrap}


  /* 导入：候选书列表 */
  .dev-pick{margin:8px 0;max-height:190px;overflow:auto}
  .dev-pick-h{font-size:12px;color:var(--faint);font-weight:600;margin:8px 0 5px}
  .dev-pick-i{display:flex;flex-direction:column;gap:1px;align-items:flex-start;width:100%;
    padding:7px 10px;border:1px solid var(--border);border-radius:8px;background:transparent;
    color:var(--text);font-size:13px;cursor:pointer;text-align:left;font-family:inherit;margin-bottom:5px}
  .dev-pick-i:hover{border-color:var(--accent)}
  .dev-pick-i span{font-size:11.5px;color:var(--faint)}
  .dev-out{margin:6px 0}

  /* 书籍信息表单 */
  .dev-form{display:flex;flex-direction:column;gap:9px;margin:4px 0}
  .dev-form label{display:flex;flex-direction:column;gap:4px;font-size:12px;
    color:var(--faint);font-weight:600}
  .dev-form input[type=text],.dev-form textarea{padding:8px 11px;border:1px solid var(--border);
    border-radius:8px;background:transparent;color:var(--text);font-size:13.5px;
    font-family:inherit;resize:vertical}
  .dev-form-row{display:flex;gap:10px}
  .dev-form-row label{flex:1}
  .dev-checks{display:flex;gap:14px;padding-top:3px}
  .dev-checks label{flex-direction:row;align-items:center;font-size:13px;color:var(--text)}

  /* 弹窗 */
  .dev-modal{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:999;
    display:flex;align-items:center;justify-content:center;padding:24px}
  .dev-modal-box{background:var(--panel);border:1px solid var(--border);border-radius:14px;
    padding:22px 24px;max-width:440px;width:100%;max-height:86vh;overflow:auto;
    display:flex;flex-direction:column;gap:10px}
  .dev-modal-box.wide{max-width:620px}
  .dev-modal-box h3{margin:0 0 4px;font-size:17px;font-weight:700}
  .dev-modal-box input[type=text]{padding:9px 12px;border:1px solid var(--border);border-radius:8px;
    background:transparent;color:var(--text);font-size:13.5px;font-family:inherit;width:100%}
  .dev-modal-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:6px}
  .dev-err{background:#fdeceb;border:1px solid #f5c6c2;color:#7d201b;border-radius:8px;
    padding:9px 12px;font-size:12.5px}
  .dev-h{font-size:13px;font-weight:700;margin:12px 0 4px}
  .dev-h.bad{color:#c9372c}.dev-h.warn{color:#9a6700}
  .dev-issues{margin:0 0 8px;padding-left:20px;font-size:13px;max-height:200px;overflow:auto}
  .dev-issues li{margin-bottom:5px}
  .dev-verdict{padding:12px 16px;border-radius:9px;font-size:14px;font-weight:620}
  .dev-verdict.ok{background:#e8f5ec;color:#1a7f37}
  .dev-verdict.bad{background:#fdeceb;color:#c9372c}
  .dev-verdict small{display:block;font-weight:400;font-size:12px;margin-top:3px;opacity:.85}
  .dev-verdict ul{margin:6px 0 0;padding-left:18px;font-weight:400}
  .dev-radio{display:flex;gap:8px;align-items:center;font-size:13.5px;cursor:pointer}
  .dev-vis{display:flex;gap:10px;align-items:center}
  .dev-steps{display:flex;flex-direction:column;gap:5px;margin:12px 0 4px}
  .dev-step{display:flex;gap:9px;align-items:center;font-size:13px;color:var(--faint)}
  .dev-step.done{color:#1a7f37}
  .dev-step.run{color:var(--text)}
  .dev-step.fail{color:#c9372c}
  .dev-step span{width:16px;text-align:center}
  `;

  function mount(root, view, opts) {
    opts = opts || {};
    if (opts.lang) lang = opts.lang;
    else lang = document.documentElement.lang === 'en' ? 'en' : 'zh';
    const st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);
    root.className = 'dev-wrap';
    root.id = 'dev-root';
    // 复用主站的登录态
    try {
      const raw = localStorage.getItem('pytut:token');
      const t = raw ? JSON.parse(raw) : '';
      if (t && typeof t === 'string' && t.trim()) api = new GitHubAPI(t.trim());
    } catch (e) {}
    if (view === 'editor') mountEditor(root); else mountList(root);
  }

  return { mount, loadAll, stats, toFiles, blank, lessonTemplate, previewMd, fetchBookForImport, isLoggedIn: () => !!api };
})();
