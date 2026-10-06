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
  const CLOUD_KEY = 'pytut:devCloud';
  const DRAFT_REPO = 'al-drafts';      // 固定仓库名：一个私有仓装所有草稿
  const $ = id => document.getElementById(id);

  let api = null;
  let owner = '';          // 登录用户名，草稿仓库的 owner
  let cloudReady = false;  // 私有草稿仓库是否已就绪
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
      stepCheck: '校验内容', stepRepo: '创建仓库', stepFiles: '推送文件',
      stepVerify: '核对已发布文件', stepTopic: '打上 al-book 标记',
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
      artBtn: "从文章导入",
      artTitle: "从一篇文章导入",
      artDesc: "手上有一篇现成的 Markdown？贴进来，自动拆成章和课。不用先懂 al-book 格式。",
      artName: "书名",
      artNamePh: "不填就用文章的第一个标题",
      artPh: "把 Markdown 贴到这里，或者把 .md 文件直接拖进来…",
      artGo: "拆成书并打开",
      artBadFile: "只支持 .md / .markdown / .txt 文件",
      artEmpty: "先贴点内容进来",
      artNoSplit: "没能拆出任何一节，检查一下内容",
      artPreview: "会拆成 {c} 章 {l} 课",
      artMore: "还有 {n} 章没显示",
      artNoChapter: "（未命名章）",
      artChapter: "第 {n} 章",
      artSubtitle: "由一篇文章导入",
      artDefaultTitle: "未命名",
      artDone: "已拆成 {c} 章 {l} 课，可以开始改了",
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
      cloudPush: "存到云端",
      cloudPushTitle: "把草稿存进你的私有仓库，换设备也能接着写",
      cloudPushTitle2: "草稿存在你的私有仓库 {repo} 里（停止改动 3 秒后自动保存）",
      cloudPushing: "上传中…",
      cloudOk: "已存到云端",
      cloudPull: "从云端拉取",
      cloudPulling: "拉取中…",
      cloudPulled: "拉到 {n} 本草稿",
      cloudEmpty: "云端还没有草稿",
      cloudFail: "云端操作失败",
      cloudNeedLogin: "需要先登录 GitHub",
      cloudHint: "草稿存在你的私有仓库 {repo} 里",
      cloudSaved: "已在云端",
      cloudLocal: "仅本设备",
      cloudNotFound: "云端没有这本书",
      cloudBadMeta: "云端 meta.json 读不出来",
      justNow: "刚刚",
      minAgo: "分钟前",
      hourAgo: "小时前",
      dayAgo: "天前",
      focus: "专注",
      focusExit: "退出专注",
      focusTitle: "收起章节树，只留编辑和预览（Ctrl/Cmd+B，Esc 退出）",
      snipLib: "题目库",
      snipTitle: "插入一道题的模板（字段齐全，插进来就能判分）",
      fKind: "这本书的类型",
      fKindHint: "教材要求每课有题；小说、笔记不要求题目。写了的题照常校验是否合法。",
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
      stepCheck: 'Validate content', stepRepo: 'Create repo', stepFiles: 'Push files',
      stepVerify: 'Verify published files', stepTopic: 'Add al-book topic',
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
      artBtn: "From an article",
      artTitle: "Import from an article",
      artDesc: "Already have a Markdown file? Paste it and we split it into chapters and lessons. No need to learn the al-book format first.",
      artName: "Book title",
      artNamePh: "Defaults to the article's first heading",
      artPh: "Paste Markdown here, or drop a .md file…",
      artGo: "Split into a book",
      artBadFile: "Only .md / .markdown / .txt files",
      artEmpty: "Paste something first",
      artNoSplit: "Could not split anything — check the content",
      artPreview: "Will split into {c} chapters, {l} lessons",
      artMore: "{n} more chapters not shown",
      artNoChapter: "(untitled chapter)",
      artChapter: "Chapter {n}",
      artSubtitle: "Imported from an article",
      artDefaultTitle: "Untitled",
      artDone: "Split into {c} chapters, {l} lessons — start editing",
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
      cloudPush: "Save to cloud",
      cloudPushTitle: "Store drafts in your private repo so you can continue on another device",
      cloudPushTitle2: "Drafts live in your private repo {repo} (auto-saved 3s after you stop typing)",
      cloudPushing: "Uploading…",
      cloudOk: "Saved to cloud",
      cloudPull: "Pull from cloud",
      cloudPulling: "Pulling…",
      cloudPulled: "Pulled {n} drafts",
      cloudEmpty: "No drafts in the cloud yet",
      cloudFail: "Cloud operation failed",
      cloudNeedLogin: "Sign in to GitHub first",
      cloudHint: "Drafts are stored in your private repo {repo}",
      cloudSaved: "in cloud",
      cloudLocal: "local only",
      cloudNotFound: "Not found in the cloud",
      cloudBadMeta: "Cloud meta.json is unreadable",
      justNow: "just now",
      minAgo: "min ago",
      hourAgo: "h ago",
      dayAgo: "d ago",
      focus: "Focus",
      focusExit: "Exit focus",
      focusTitle: "Hide the chapter tree, keep editor + preview (Ctrl/Cmd+B, Esc to exit)",
      snipLib: "Snippets",
      snipTitle: "Insert a question template (complete fields, gradeable as-is)",
      fKind: "Book kind",
      fKindHint: "Textbooks require questions per lesson; novels and notes do not. Any questions you do write are still checked.",
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

  /* ================= 重名检查 =================
   * 书名重复不管 id 是否不同，一律不让发：
   *   · 对读者是干扰 —— 搜一个名字出来两本书，不知道看哪本
   *   · 对原作者是侵权 —— 抄一本同名书冒充原作
   * 比对前先规范化：去空格、转小写、全角转半角。
   * 中文连写（"python自动化办公" vs "Python 自动化办公"）必须算同一个名字，
   * 否则加个空格就能绕过。
   */
  function normTitle(t) {
    return String(t || '')
      .replace(/[\uFF01-\uFF5E]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)) // 全角→半角
      .replace(/[\u3000\s]+/g, '')   // 去所有空白（含中文全角空格）
      .toLowerCase()
      .trim();
  }

  /** 已上架的书名（官方 + 第三方），由主站注入 */
  function takenTitles() {
    return Array.isArray(window.__takenTitles) ? window.__takenTitles : [];
  }

  /**
   * 查重。跳过自己 —— 同一本书重新发布不该被自己拦下。
   * @returns {null | {title, id, external, author, repo}}
   */
  function findDupTitle(book) {
    const t = normTitle(book.title);
    if (!t) return null;
    return takenTitles().find(x => x.id !== book.id && normTitle(x.title) === t) || null;
  }

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
      kind: 'textbook',          // 决定要不要卡题目数量；小说/笔记不卡
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
  1, 2 -> 3
  5, 7 -> 12
hint: ${zh ? '多个参数用逗号分隔' : 'Separate multiple args with commas'}
\`\`\`
`;
  }

  /* ================= 云端草稿仓库 ================= */
  /**
   * 草稿存在用户自己的私有仓库 al-drafts 里。
   *
   * 为什么不用 localStorage：换台设备就没了，清理浏览器数据也没了。
   * 私有仓库天然跨设备、天然备份，而且用户能在 GitHub 上直接看历史提交。
   *
   * 本地 localStorage 仍然是工作区 —— 离线也能写，联网了再推上去。
   *
   * 目录结构（按书分目录，不塞一个巨大 JSON）：
   *   drafts/{id}/meta.json              书籍元数据 + 章节结构
   *   drafts/{id}/lessons/{lid}.md       课文
   *   drafts/{id}/lessons/{test}.md      章测
   *   drafts/{id}/published.json         发布记录（可选）
   */
  function cloudInfo() {
    try { return JSON.parse(localStorage.getItem(CLOUD_KEY) || 'null') || {}; }
    catch (e) { return {}; }
  }
  function setCloudInfo(o) {
    try { localStorage.setItem(CLOUD_KEY, JSON.stringify(o)); } catch (e) {}
  }

  /**
   * 确保私有仓库存在。
   * autoInit 之后 GitHub 需要一点时间才建好默认分支，
   * 所以创建后轮询几次确认能拿到 ref，否则第一次提交会 404。
   */
  async function ensureCloud() {
    if (!api) return false;
    if (cloudReady && owner) return true;
    if (!owner) {
      try { owner = await api.getUsername(); }
      catch (e) { return false; }
    }
    const info = cloudInfo();
    let ok = false;
    try {
      await api.getRepository(owner, DRAFT_REPO);
      ok = true;
    } catch (e) {
      try {
        await api.createRepository(DRAFT_REPO, {
          description: 'AnyLearn 教材草稿（私有）',
          private: true, autoInit: true,
        });
        // 等仓库真的可用
        for (let i = 0; i < 12; i++) {
          await new Promise(r => setTimeout(r, 1200));
          try { await api.getRepository(owner, DRAFT_REPO); ok = true; break; }
          catch (e2) { /* 再等等 */ }
        }
      } catch (e2) { ok = false; }
    }
    if (ok) {
      cloudReady = true;
      setCloudInfo({ ...info, repo: DRAFT_REPO, owner });
    }
    return ok;
  }

  async function cloudBranch() {
    try { return await api.getDefaultBranch(owner, DRAFT_REPO); }
    catch (e) { return 'main'; }
  }

  /* ================= 自定义片段（存在草稿仓库里，跨设备） ================= */
  const SNIP_PATH = 'snippets.json';

  /** 打开面板时后台拉一次，拉到就覆盖本地缓存 */
  async function pullSnippets() {
    if (!await ensureCloud()) return;
    try {
      const branch = await cloudBranch();
      const f = await api.getFileContents(owner, DRAFT_REPO, SNIP_PATH, branch);
      if (!f || !f.content) return;
      const d = JSON.parse(f.content);
      if (!d || !Array.isArray(d.items)) return;
      Snippets.saveCustom(d.items, null);       // 不回推，否则会和云端互相追
    } catch (e) {
      if (String(e.message || e).indexOf('404') < 0) console.warn('[dev] 拉自定义片段失败', e.message);
    }
  }

  /** 改完立刻推一次。一次提交就一个文件，很快。 */
  async function pushSnippets() {
    if (!await ensureCloud()) return;
    try {
      const branch = await cloudBranch();
      const payload = JSON.stringify({
        format: 'al-snippets', version: 1,
        updatedAt: Date.now(), items: Snippets.loadCustom(),
      }, null, 2);
      await api.createOrUpdateFile(owner, DRAFT_REPO, SNIP_PATH, payload,
        'snippets: update', branch,
        (await api.getFileContents(owner, DRAFT_REPO, SNIP_PATH, branch) || {}).sha || null);
    } catch (e) { console.warn('[dev] 存自定义片段失败', e.message); }
  }

  /** 一本书要写哪些文件 */
  function bookFiles(b) {
    const out = [];
    const meta = {
      format: 'al-draft', version: 1,
      id: b.id, repo: b.repo, title: b.title, subtitle: b.subtitle, desc: b.desc,
      stage: b.stage, level: b.level, langs: b.langs, license: b.license,
      kind: b.kind || 'textbook',
      author: b.author, tags: b.tags || [],
      published: b.published || null,
      importedFrom: b.importedFrom || null,
      updatedAt: b.updatedAt || Date.now(),
      chapters: (b.chapters || []).map(ch => ({
        title: ch.title, test: ch.test || null,
        lessons: (ch.lessons || []).map(ls => ({ id: ls.id, title: ls.title })),
      })),
    };
    out.push({ path: `drafts/${b.id}/meta.json`, content: JSON.stringify(meta, null, 2) });
    for (const ch of (b.chapters || [])) {
      for (const ls of (ch.lessons || [])) {
        out.push({ path: `drafts/${b.id}/lessons/${ls.id}.md`, content: ls.md || '' });
      }
      if (ch.test) {
        out.push({ path: `drafts/${b.id}/lessons/${ch.test}.md`, content: ch.testMd || '' });
      }
    }
    return out;
  }

  /** 把一本草稿推到云端（一次提交） */
  async function pushBook(b) {
    if (!await ensureCloud()) throw new Error(T('cloudNeedLogin'));
    const branch = await cloudBranch();
    const files = bookFiles(b);
    // 改名/删课留下的旧文件一并删掉，避免草稿仓库里堆孤儿
    const mine = pendingDeletes.filter(d => d.book === b.id);
    for (const d of mine) files.push({ path: d.path, delete: true });
    await api.commitTree(owner, DRAFT_REPO, branch,
      `draft: ${b.title} (${new Date().toISOString().slice(0, 16).replace('T', ' ')})`, files);
    for (const d of mine) pendingDeletes.splice(pendingDeletes.indexOf(d), 1);
    const shas = {};
    shas[b.id] = Date.now();
    const info = cloudInfo();
    setCloudInfo({ ...info, shas: { ...(info.shas || {}), ...shas } });
    b.cloudAt = Date.now();
    putBook(b);
    return true;
  }

  /** 列出云端有哪些草稿（读树，1 次请求） */
  async function cloudList() {
    if (!await ensureCloud()) return [];
    const branch = await cloudBranch();
    const tree = await api.getTree(owner, DRAFT_REPO, branch, true);
    const ids = new Set();
    for (const it of tree) {
      const m = (it.path || '').match(/^drafts\/([^/]+)\/meta\.json$/);
      if (m) ids.add(m[1]);
    }
    return [...ids];
  }

  /** 从云端拉一本草稿下来 */
  async function pullBook(id) {
    if (!await ensureCloud()) throw new Error(T('cloudNeedLogin'));
    const branch = await cloudBranch();
    const tree = await api.getTree(owner, DRAFT_REPO, branch, true);
    const base = `drafts/${id}/`;
    const paths = tree.filter(x => x.type === 'blob' && x.path.startsWith(base)).map(x => x.path);
    if (!paths.length) throw new Error(T('cloudNotFound'));

    // 必须走 API：草稿在私有仓库里，raw / jsDelivr 都读不到 ——
    // 私有仓库的 raw 链接要带 token，CDN 更是只能读公开仓库。
    // 这是和"读第三方书"最大的区别，那边可以走 CDN，这边不行。
    const raw = await api.getManyFiles(owner, DRAFT_REPO, paths, branch);
    const got = {};
    for (const p of paths) if (raw[p]) got[p] = raw[p].text;

    let meta = null;
    try { meta = JSON.parse(got[base + 'meta.json'] || '{}'); }
    catch (e) { throw new Error(T('cloudBadMeta')); }

    const b = {
      id, repo: meta.repo || ('al-book-' + id),
      title: meta.title || id, subtitle: meta.subtitle || '', desc: meta.desc || '',
      stage: meta.stage || '基础', level: meta.level || '入门',
      langs: (meta.langs && meta.langs.length) ? meta.langs : ['zh'],
      kind: meta.kind || 'textbook',
      license: meta.license || 'CC BY-NC 4.0',
      author: meta.author || { name: '' }, tags: meta.tags || [],
      published: meta.published || null,
      importedFrom: meta.importedFrom || null,
      chapters: [], cloudAt: Date.now(),
      createdAt: meta.createdAt || Date.now(), updatedAt: meta.updatedAt || Date.now(),
    };
    for (const ch of (meta.chapters || [])) {
      const lessons = [];
      for (const it of (ch.lessons || [])) {
        const md = got[`${base}lessons/${it.id}.md`];
        if (md == null) continue;
        lessons.push({ id: String(it.id), title: it.title || String(it.id), md });
      }
      b.chapters.push({
        title: ch.title, lessons, test: ch.test || null,
        testMd: ch.test ? (got[`${base}lessons/${ch.test}.md`] || '') : '',
      });
    }
    return b;
  }

  /** 删掉云端的一本草稿 */
  async function removeBook(id) {
    if (!await ensureCloud()) throw new Error(T('cloudNeedLogin'));
    const branch = await cloudBranch();
    const tree = await api.getTree(owner, DRAFT_REPO, branch, true);
    const base = `drafts/${id}/`;
    const dels = tree.filter(x => x.path.startsWith(base))
      .map(x => ({ path: x.path, delete: true }));
    if (dels.length) {
      await api.commitTree(owner, DRAFT_REPO, branch, `draft: remove ${id}`, dels);
    }
    const info = cloudInfo();
    const shas = { ...(info.shas || {}) };
    delete shas[id];
    setCloudInfo({ ...info, shas });
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
      // kind 决定机器人要不要卡题目数量。小说 / 笔记必须真的写进文件里 ——
      // 丢了它，发布出去会被当成教材，因为"一道题都没有"而不予收录。
      ...(b.kind && b.kind !== 'textbook' ? { kind: b.kind } : {}),
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

  function cloudHintText() {
    if (!api) return T('cloudNeedLogin');
    return tf('cloudHint', { repo: DRAFT_REPO });
  }

  function ago(t) {
    const d = Math.floor((Date.now() - t) / 1000);
    if (d < 60) return T('justNow');
    if (d < 3600) return Math.floor(d / 60) + ' ' + T('minAgo');
    if (d < 86400) return Math.floor(d / 3600) + ' ' + T('hourAgo');
    return Math.floor(d / 86400) + ' ' + T('dayAgo');
  }

  function toast(msg) {
    const el = document.createElement('div');
    el.className = 'dev-toast';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2600);
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
          // 写完立刻能看出来的问题，别等到发布或运行时才发现
          const warn = quizWarning(q);
          if (warn) {
            const w = document.createElement('div');
            w.className = 'dev-qwarn';
            w.innerHTML = '⚠ ' + esc(warn);
            wrap.appendChild(w);
          }
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

  /** 题面里"当场就能查出来"的问题 —— 在预览卡片上直接标出来 */
  function quizWarning(q) {
    const zh = lang === 'zh';
    const t = String(q.type || 'choice');
    if (t === 'function') {
      if (!String(q.func || '').trim()) return zh ? 'function 题缺 func' : 'function question needs func';
      const bad = BookCheck.badCaseLine ? BookCheck.badCaseLine(q.cases) : null;
      if (bad) return zh
        ? `cases 里 "${bad}" 的参数要用逗号分隔（如 1, 2 -> 3）`
        : `in cases, "${bad}" args must be comma-separated (e.g. 1, 2 -> 3)`;
      if (!String(q.cases || '').trim()) return zh ? 'function 题缺 cases' : 'function question needs cases';
      return '';
    }
    if (t === 'choice') {
      const opts = q.options || [];
      if (opts.length < 2) return zh ? '选择题至少 2 个选项' : 'choice needs at least 2 options';
      const a = Number(q.answer);
      if (!(a >= 0 && a < opts.length)) return zh ? `answer=${q.answer} 越界（共 ${opts.length} 个选项）` : `answer out of range (${opts.length} options)`;
      return '';
    }
    if (['js', 'css', 'html'].includes(t) && !(q.checks || []).length) {
      return zh ? `${t} 题没有 checks，无法判分` : `${t} question has no checks — cannot be graded`;
    }
    if (t === 'local' && !(q.checklist || []).length) {
      return zh ? 'local 题缺 checklist' : 'local question needs a checklist';
    }
    return '';
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

    // 把本地草稿里"已发布"的仓库登记给主站。
    // 这样就算当初发布时的即时并入没生效（比如随后又刷新了页面），
    // 下次打开首页也能按确切仓库名恢复，不用等 GitHub 搜索索引。
    if (window.__registerMyBooks) {
      window.__registerMyBooks(books.filter(b => b.published && b.published.repo)
        .map(b => b.published.repo));
    }

    root.innerHTML = `
      <div class="dev-head">
        <a class="dev-back" href="#/">${lang === 'zh' ? '← 回到书城' : '← Back to library'}</a>
        <h1>${T('devTitle')}</h1>
        <p class="dev-sub">${T('devSub')}</p>
      </div>
      <div class="dev-bar">
        <button class="dev-btn" id="dev-new">${T('newBook')}</button>
        <button class="dev-btn ghost" id="dev-import">${T('importBtn')}</button>
        <button class="dev-btn ghost" id="dev-artimport">${T('artBtn')}</button>
        <button class="dev-btn ghost" id="dev-pull">${T('cloudPull')}</button>
        <span class="dev-hint" id="dev-cloud">${cloudHintText()}</span>
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
          <div class="dev-card-meta dim">${b.cloudAt ? '☁ ' + T('cloudSaved') + ' · ' + ago(b.cloudAt) : '○ ' + T('cloudLocal')}</div>
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
    $('dev-artimport').onclick = showImportArticleDialog;
    $('dev-pull').onclick = async () => {
      const btn = $('dev-pull');
      btn.disabled = true; btn.textContent = T('cloudPulling');
      try {
        const ok = await ensureCloud();
        if (!ok) { alert(T('cloudNeedLogin')); return; }
        const ids = await cloudList();
        let n = 0;
        for (const id of ids) {
          try { const b = await pullBook(id); b.cloudAt = Date.now(); putBook(b); n++; }
          catch (e) { /* 单本失败不阻断 */ }
        }
        toast(n ? tf('cloudPulled', { n }) : T('cloudEmpty'));
      } catch (e) {
        alert(T('cloudFail') + '：' + (e.message || e));
      } finally {
        btn.disabled = false; btn.textContent = T('cloudPull');
        mountList(root);
      }
    };
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
        // 云端那本也删掉，否则下次拉取又冒出来
        removeBook(b.id).catch(() => {});
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
      const r = await fetch(`https://api.github.com/repos/${full}`, { cache: 'no-store' });
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

  /* ================= 从一篇文章导入 =================
   *
   * 为什么要有这条路：al-book 最小可收录要 3 个文件 + 九个必填字段，
   * 对一个"我写了篇笔记想变成教材"的人来说，门槛高到根本不会开始。
   * 而绝大多数人手上已经有一篇现成的 Markdown —— 那就从这篇出发。
   *
   * 拆分的头号陷阱：代码块里的 # 是 Python 注释，不是 Markdown 标题。
   * 不先把围栏剥掉再扫标题，一篇带代码注释的文章会被切成几十个"课"，
   * 每个注释行一课。所以第一步就是标记哪些行在代码块里。
   */
  /**
   * 从文章里摘一句当简介。
   * 不能简单删掉 # > * - 了事 —— 代码块、列表符号会混进来，
   * 摘出来的东西读不通，还会把标题文字当成正文。
   */
  function artSummary(md) {
    const body = String(md || '')
      .replace(/```[\s\S]*?```/g, ' ')      // 先去掉代码块
      .split(/\n{2,}/);                        // 再按段落取
    for (const para of body) {
      const t = para
        .split('\n')
        .filter(l => !/^\s{0,3}#{1,6}\s/.test(l))   // 去标题行
        .filter(l => !/^\s{0,3}>/.test(l))           // 去引用
        .filter(l => !/^\s*([-*+]|\d+\.)\s/.test(l)) // 去列表符号
        .join(' ')
        .replace(/[*`_]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (t.length >= 12) return t.slice(0, 110);
    }
    return '';
  }

  function splitArticle(md) {
    const lines = String(md || '').replace(/\r\n?/g, '\n').split('\n');

    // 一、标出代码块内的行
    const inFence = [];
    let fence = null;
    for (let i = 0; i < lines.length; i++) {
      const t = lines[i].trim();
      if (fence === null) {
        const m = t.match(/^(```+|~~~+)/);
        if (m) { fence = m[1]; inFence[i] = true; continue; }
        inFence[i] = false;
      } else {
        inFence[i] = true;
        if (t.startsWith(fence)) fence = null;
      }
    }

    // 二、只收代码块外的标题
    const heads = [];
    for (let i = 0; i < lines.length; i++) {
      if (inFence[i]) continue;
      const m = lines[i].match(/^(#{1,6})\s+(.+?)\s*$/);
      if (m) heads.push({ i, level: m[1].length, text: m[2].trim() });
    }

    const chapters = [];
    if (!heads.length) {
      // 通篇没有标题：按篇幅切，别硬切成一课一课
      const chunks = byLength(lines, 700);
      if (chunks.length) {
        chapters.push({
          title: '', lessons: chunks.map((c, k) => ({ title: '第 ' + (k + 1) + ' 节', md: c })),
        });
      }
    } else {
      const has1 = heads.some(h => h.level === 1);
      const has2 = heads.some(h => h.level === 2);
      if (has1 && has2) {
        // h1 是章，h2 是课 —— 最理想的结构
        let cur = null, curLesson = null;
        for (let n = 0; n < heads.length; n++) {
          const h = heads[n];
          const end = (n + 1 < heads.length) ? heads[n + 1].i : lines.length;
          const body = lines.slice(h.i, end).join('\n').trim();
          if (h.level === 1) {
            curLesson = null;
            cur = { title: h.text, lessons: [] };
            chapters.push(cur);
          } else if (h.level === 2) {
            if (!cur) { cur = { title: '', lessons: [] }; chapters.push(cur); }
            curLesson = { title: h.text, md: body };
            cur.lessons.push(curLesson);
          } else if (curLesson) {
            curLesson.md += '\n\n' + body;          // h3+ 并入当前课
          } else if (cur) {
            cur.lessons.push({ title: h.text, md: body });
          }
        }
        // 章下面直接是正文（没有 h2）：整章当一课
        for (const ch of chapters) {
          if (!ch.lessons.length) ch.lessons.push({ title: ch.title || '正文', md: '' });
        }
      } else {
        // 只有单一层级：每个标题一课
        const lv = has1 ? 1 : heads[0].level;
        const use = heads.filter(h => h.level === lv);
        const lessons = [];
        for (let n = 0; n < use.length; n++) {
          const h = use[n];
          const end = (n + 1 < use.length) ? use[n + 1].i : lines.length;
          lessons.push({ title: h.text, md: lines.slice(h.i, end).join('\n').trim() });
        }
        if (lessons.length) chapters.push({ title: '', lessons });
      }
    }
    return chapters.filter(c => c.lessons.length);
  }

  /** 按篇幅切段，在空行处断开，不硬切 */
  function byLength(lines, target) {
    const out = [];
    let buf = [], n = 0;
    for (const ln of lines) {
      buf.push(ln); n += ln.length;
      if (n >= target && ln.trim() === '') { out.push(buf.join('\n').trim()); buf = []; n = 0; }
    }
    const tail = buf.join('\n').trim();
    if (tail) out.push(tail);
    return out.filter(x => x.length);
  }

  /**
   * 补引言：al-book 约定课文第一行是 `# 标题`，紧接着 `> 一句话引言`。
   * 导入的文章通常没有引言，没它目录和搜索结果里就是空的。
   * 从正文第一段摘一句，总比空白强 —— 作者后面随手就能改。
   */
  function ensureLead(md, fallbackTitle) {
    const src = String(md || '').trim();
    if (!src) return '# ' + fallbackTitle + '\n\n> 待补充引言\n\n正文待写。\n';
    if (/^#{1,6}\s+/m.test(src) && /^>\s+/m.test(src)) return src + '\n';
    const lines = src.split('\n');
    let head, rest = lines;
    // 注意：首行可能是任意级别的标题（## 也算）。
    // 只认 `^# ` 的话，`## 变量名` 不会被识别，于是又补一个 `# 变量名`，
    // 同一课里出现两个标题 —— 所以要用 `#{1,6}`，并把级别统一提升成 h1。
    const m = lines[0] && lines[0].match(/^#{1,6}\s+(.+?)\s*$/);
    if (m) { head = '# ' + m[1]; rest = lines.slice(1); }
    else head = '# ' + fallbackTitle;
    while (rest.length && rest[0].trim() === '') rest.shift();
    // 摘第一句当引言
    let lead = '';
    for (const ln of rest) {
      const t = ln.trim();
      if (!t || t.startsWith('#') || t.startsWith('>') || t.startsWith('```')) continue;
      lead = t; break;
    }
    const cut = lead.search(/[。！？.!?]/);
    if (cut > 0) lead = lead.slice(0, cut + 1);
    if (lead.length > 60) lead = lead.slice(0, 60) + '…';
    if (!lead) lead = fallbackTitle;

    // 引言是从正文第一句摘来的，得把那句从正文里去掉 ——
    // 否则读者会看到同一句话出现两遍：先是引言，紧接着又是正文开头。
    const trimmed = [];
    let done = false;
    for (const ln of rest) {
      if (!done && ln.trim().startsWith(lead.slice(0, Math.min(12, lead.length)))) {
        const left = ln.trim().slice(lead.length).trim();
        if (left) trimmed.push(left);
        done = true;
        continue;
      }
      trimmed.push(ln);
    }
    if (done) rest = trimmed;
    while (rest.length && rest[0].trim() === '') rest.shift();
    return [head, '', '> ' + lead, ''].concat(rest).join('\n') + '\n';
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
          kind: (r.meta.kind === 'textbook' || !r.meta.kind) ? 'textbook' : r.meta.kind,
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
        <button class="dev-btn sm ghost" id="de-cloud" title="${T('cloudPushTitle')}">☁ ${T('cloudPush')}</button>
        <button class="dev-btn sm ghost" id="de-snip" title="${T('snipTitle')}">⊞ ${T('snipLib')}</button>
        <button class="dev-btn sm ghost" id="de-focus" title="${T('focusTitle')}">⤢ ${T('focus')}</button>
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
          <div class="dev-snips" id="de-snips" hidden></div>
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
    applyFocus();
    paintCloudState();
    // 登录了就后台建好私有草稿仓，这样第一次自动保存不会卡住
    ensureCloud().then(() => paintCloudState()).catch(() => {});

    $('de-back').onclick = () => {
      flush(); scheduleCloud();
      document.removeEventListener('keydown', onDevKey);
      mountList(root);
    };
    $('de-info').onclick = () => showBookInfo(b);
    $('de-focus').onclick = () => toggleFocus();
    $('de-snip').onclick = () => toggleSnips();
    document.addEventListener('keydown', onDevKey);

    $('de-cloud').onclick = async () => {
      const btn = $('de-cloud');
      btn.disabled = true;
      const old = btn.textContent;
      btn.textContent = T('cloudPushing');
      try { await pushBook(b); toast(T('cloudOk')); }
      catch (e) { alert(T('cloudFail') + '：' + (e.message || e)); }
      finally { btn.disabled = false; btn.textContent = old; paintCloudState(); }
    };
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
      // 章测也当作一"课"来编辑，只是内容存在 chapter.testMd 上。
      // 注意：这里每次调用都返回一个新对象，所以别往它上面写持久字段 ——
      // 章测在 al-book 格式里只有文件名（toc 的 test 字段），没有"标题"这一说。
      return { id: ch.test || 'test', isTest: true,
               get md() { return ch.testMd || ''; },
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
            <span class="t">${esc(T('testName'))}<i class="fn">${esc(ch.test)}.md</i>${
              ch.testMd ? '' : ` <i class="dim">${T('testEmpty')}</i>`}</span>
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
    if (ls.isTest) {
      // 章测没有"标题"这个字段（格式里只有文件名），
      // 所以这里给的是文件名本身 —— 改它才是真的改了显示出来的那个名字。
      head.innerHTML = `<span class="dev-ls-tag">${esc(T('testName'))}</span>
        <input type="text" class="dev-ls-t" id="de-testid" value="${esc(ls.id)}"
          spellcheck="false" placeholder="test-01"><span class="dim">.md</span>`;
      // 用 change（输完/回车/失焦）而不是 input：
      // 边打字边改的话，"test-02" 打成 "quiz-02" 会中途经过 q / qu / qui…，
      // 每步都是一次真实改名，还会攒下一串根本不存在的待删路径。
      const ti = $('de-testid');
      ti.onchange = () => renameTest(ti.value);
      ti.onblur = () => {                       // 输了非法字符就退回上一个合法值
        const ch = (cur.chapters || [])[curLesson.chIdx];
        if (ch && ti.value.trim() !== ch.test) ti.value = ch.test || '';
      };
    } else {
      head.innerHTML = `<input type="text" class="dev-ls-t" id="de-lstitle" value="${esc(ls.title || '')}"
        placeholder="${T('lsTitlePh')}"><span class="dim">${esc(ls.id)}.md</span>`;
      $('de-lstitle').oninput = () => { ls.title = $('de-lstitle').value; markDirty(); drawTree(); };
    }
    ta.value = ls.md || '';
    lastQuizSig = null;
    drawPreview();
    drawFoot();
  }

  /** 改名留下的云端旧文件，下次推送时一并删掉（否则草稿仓库里会攒一堆孤儿） */
  const pendingDeletes = [];

  /**
   * 改章测文件名。
   *
   * 为什么要能改：目录树和编辑器里显示的就是这个文件名，
   * 而章测在格式里没有"标题"字段 —— 想改显示的名字，只能改文件名。
   *
   * 只接受安全字符：这是要落盘的文件名，空格和斜杠会写出脏路径。
   */
  function renameTest(v) {
    const ch = (cur && cur.chapters || [])[curLesson.chIdx];
    if (!ch) return;
    // 允许中文等 Unicode 字符（GitHub 存得住），只挡空白和会写出脏路径的符号。
    // 只挡 ASCII 字母数字的话，中文作者想叫「章测-01」就被拒了，没必要。
    const next = String(v || '').trim().replace(/\.md$/i, '');
    if (!next || /[\s/\\:*?"<>|]/.test(next)) return;
    if (next === ch.test) return;
    const oldName = ch.test;
    if (oldName && cur.id) {
      const p = `drafts/${cur.id}/lessons/${oldName}.md`;
      if (!pendingDeletes.some(d => d.book === cur.id && d.path === p)) {
        pendingDeletes.push({ book: cur.id, path: p });
      }
    }
    ch.test = next;
    curLesson = { chIdx: curLesson.chIdx, isTest: true };
    putBook(cur);
    markDirty();
    drawTree();
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

  /* ================= 题目库面板 ================= */
  /**
   * 打开面板前先记住光标位置：点到面板上时 textarea 已经失焦，
   * 不记的话片段会被插到开头，而不是作者正在写的地方。
   */
  let snipRange = null;

  function toggleSnips() {
    const box = $('de-snips');
    if (!box) return;
    if (box.hidden) openSnips(box); else { box.hidden = true; toggleBtn(false); }
  }
  function toggleBtn(on) {
    const b = $('de-snip');
    if (b) b.classList.toggle('on', on);
  }
  function closeSnips() {
    const box = $('de-snips');
    if (box) box.hidden = true;
    toggleBtn(false);
  }

  function openSnips(box, skipPull) {
    // 只在首次打开时拉云端。重画时必须跳过，否则 openSnips → pull → openSnips 无限递归。
    if (!skipPull) {
      pullSnippets().then(() => { if (!box.hidden) openSnipsQuiet(box); }).catch(() => {});
    }
    const ta = $('de-md');
    if (ta) snipRange = { start: ta.selectionStart, end: ta.selectionEnd };
    const zh = lang === 'zh';

    box.hidden = false;
    toggleBtn(true);
    box.innerHTML = `
      <div class="dev-snip-top">
        <span class="dev-snip-h">${T('snipLib')}</span>
        <label class="dev-radio"><input type="checkbox" id="snip-exam">
          ${zh ? '带 exam: true（计入学完）' : 'with exam: true (counts as done)'}</label>
        <span class="dim" style="font-size:12px">${zh
          ? '一课要 1 道随堂 + 2 道本节测验'
          : 'Each lesson needs 1 in-class + 2 section-quiz questions'}</span>
        <button class="dev-x" id="snip-close" title="${zh ? '关闭' : 'Close'}">×</button>
      </div>
      <div class="dev-snip-grid">
        ${Snippets.customAsSnips().map(sp => `
          <button class="dev-snip mine" data-snip="${esc(sp.id)}">
            <span class="si">✦</span>
            <span class="sn">${esc(sp.name[lang] || sp.name.zh)}</span>
            <span class="sd">${esc(sp.desc[lang] || '')}</span>
            <span class="st">${esc(sp.type)}</span>
            <span class="dev-snip-x" data-del="${esc(sp.id)}" title="${zh ? '删除' : 'Delete'}">×</span>
          </button>`).join('')}
        <button class="dev-snip add" id="snip-new">
          <span class="si">＋</span>
          <span class="sn">${zh ? '存成自定义片段' : 'Save as snippet'}</span>
          <span class="sd">${zh ? '把选中的 quiz 存起来，以后一键插入'
                          : 'Store the selected quiz for one-click insert'}</span>
        </button>
      </div>
      ${zh ? '<div class="dev-snip-note">自定义片段存在你的私有草稿仓库里，换设备也能用。</div>'
           : '<div class="dev-snip-note">Custom snippets live in your private drafts repo — available on any device.</div>'}
      <div class="dev-snip-sec">${zh ? '内置模板' : 'Built-in'}</div>
      <div class="dev-snip-grid">
        ${Snippets.list().map(sp => `
          <button class="dev-snip" data-snip="${esc(sp.id)}">
            <span class="si">${esc(sp.icon)}</span>
            <span class="sn">${esc(sp.name[lang] || sp.name.zh)}</span>
            <span class="sd">${esc(sp.desc[lang] || sp.desc.zh)}</span>
            <span class="st">${esc(sp.type)}</span>
          </button>`).join('')}
      </div>`;

    $('snip-close').onclick = closeSnips;

    // 存成自定义片段：优先用选中的文本，没有就取光标所在的那个 quiz 块
    $('snip-new').onclick = () => {
      const t = $('de-md');
      if (!t) return;
      const sel = t.value.slice(t.selectionStart, t.selectionEnd);
      const src = sel.trim() || quizBlockAt(t.value, t.selectionStart);
      if (!src || !src.includes('```quiz')) {
        alert(zh ? '先选中一段 quiz 代码，或把光标放在某道题里'
                 : 'Select a quiz block first, or put the cursor inside one');
        return;
      }
      const clean = src.replace(/^```quiz\s*\n?/, '').replace(/\n?```\s*$/, '').replace(/\s+$/, '');
      const name = (zh ? '我的题 ' : 'Snippet ') + (Snippets.loadCustom().length + 1);
      const type = Snippets.detectType(clean);
      const items = Snippets.loadCustom().concat([{
        id: 'c' + Date.now().toString(36), name, desc: '',
        type, src: clean, updatedAt: Date.now(),
      }]);
      Snippets.saveCustom(items, pushSnippets);
      openSnips(box);            // 重画，让新片段出现
    };

    box.querySelectorAll('[data-del]').forEach(el => {
      el.onclick = ev => {
        ev.stopPropagation();          // 别触发外层"插入"
        const id = el.dataset.del.replace(/^custom-/, '');
        const items = Snippets.loadCustom().filter(c => c.id !== id);
        Snippets.saveCustom(items, pushSnippets);
        openSnips(box);
      };
    });

    box.querySelectorAll('[data-snip]').forEach(el => {
      el.onclick = () => {
        const sp = Snippets.list().find(x => x.id === el.dataset.snip);
        if (!sp) return;
        const exam = $('snip-exam') && $('snip-exam').checked;
        const text = '\n\n' + sp.body(lang, exam) + '\n';
        const t = $('de-md');
        if (!t || t.disabled) return;
        if (snipRange) { t.focus(); t.setSelectionRange(snipRange.start, snipRange.end); }
        Snippets.insert(t, text);
        Snippets.placeCursor(t, text);
        // 走一遍 oninput 的逻辑：存草稿 + 重画预览 + 排云端
        const ls = lessonAt();
        if (ls) ls.md = t.value;
        snipRange = null;
        closeSnips();
        markDirty();
        lastQuizSig = null;
        drawPreview();
      };
    });
  }

  /** 只重画面板，不重新拉云端（避免递归）；保留滚动位置和 exam 勾选 */
  function openSnipsQuiet(box) {
    const keepExam = $('snip-exam') && $('snip-exam').checked;
    const keepScroll = box.scrollTop;
    openSnips(box, true);
    const cb = $('snip-exam');
    if (cb && keepExam !== cb.checked) cb.checked = keepExam;
    box.scrollTop = keepScroll;
  }

  /**
   * 找出光标所在的那道 quiz 块。
   * 作者没选中文本时，用这个"取当前这道题"，比要求他精确选中友好得多。
   */
  function quizBlockAt(md, pos) {
    const re = /```quiz\n[\s\S]*?^```\s*$/gm;
    let m;
    while ((m = re.exec(md)) !== null) {
      if (pos >= m.index && pos <= m.index + m[0].length) return m[0];
    }
    return '';
  }

  /** Esc 关面板（在 onDevKey 里统一处理） */
  function snipsOpen() {
    const b = $('de-snips');
    return !!(b && !b.hidden);
  }

  /**
   * 专注模式：收起章节树，只留编辑 + 预览两栏。
   *
   * 写长课文时左侧那棵树纯占地方 —— 一课的 Markdown 能有几千行，
   * 编辑区宽一点能少滚很多屏。
   *
   * Esc 退出。状态记在 localStorage，下次进编辑器还是上次的模式。
   */
  let focused = false;
  try { focused = localStorage.getItem('pytut:devFocus') === '1'; } catch (e) {}

  function toggleFocus() {
    focused = !focused;
    try { localStorage.setItem('pytut:devFocus', focused ? '1' : '0'); } catch (e) {}
    applyFocus();
  }

  function applyFocus() {
    const ed = document.querySelector('.dev-ed');
    const btn = $('de-focus');
    if (ed) ed.classList.toggle('focused', focused);
    if (btn) {
      btn.textContent = (focused ? '⤡ ' : '⤢ ') + (focused ? T('focusExit') : T('focus'));
      btn.classList.toggle('on', focused);
    }
  }

  /** 编辑器内的快捷键：Esc 退出专注，Ctrl/Cmd+S 保存 */
  function onDevKey(e) {
    const inField = /^(INPUT|TEXTAREA)$/.test((e.target && e.target.tagName) || '');
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      flush(true);
      if (cur) pushBook(cur).then(() => paintCloudState()).catch(() => {});
      return;
    }
    if (e.key === 'Escape') {
      if (snipsOpen()) { closeSnips(); return; }   // 面板先关，别一按 Esc 就退出专注模式
      if (focused) toggleFocus();
      return;
    }
    // Ctrl/Cmd+B 切换专注（在输入框里也能用）
    if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B') && inField) {
      e.preventDefault();
      toggleFocus();
    }
  }

  function markDirty() {
    const el = $('de-state');
    if (el) { el.textContent = T('dirty'); el.className = 'dev-state dirty'; }
    scheduleCloud();
  }

  /**
   * 停止改动 3 秒后自动推云端。
   *
   * 为什么不是每次改动都推：一次 commitTree 是好几笔 API（建 blob + 建 tree + 建 commit），
   * 打字时每 400ms 触发一次的话，一节课没写完就能耗掉上百次请求。
   */
  let cloudTimer = null;
  let cloudBusy = false;
  function scheduleCloud() {
    if (!api || cloudBusy) return;
    clearTimeout(cloudTimer);
    cloudTimer = setTimeout(async () => {
      if (!cur || cloudBusy) return;
      cloudBusy = true;
      try {
        await pushBook(cur);
        paintCloudState();
      } catch (e) {
        console.warn('[dev] 云端保存失败', e.message);
      } finally { cloudBusy = false; }
    }, 3000);
  }

  function paintCloudState() {
    const btn = $('de-cloud');
    if (!btn) return;
    if (!api) { btn.textContent = '☁ ' + T('cloudPush'); btn.title = T('cloudNeedLogin'); return; }
    btn.textContent = cur && cur.cloudAt
      ? '☁ ' + T('cloudSaved') + ' · ' + ago(cur.cloudAt)
      : '☁ ' + T('cloudPush');
    btn.title = tf('cloudPushTitle2', { repo: DRAFT_REPO });
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
        <label>${T('fTitle')}<input type="text" id="bi-title" value="${esc(b.title)}">
          <i class="dup-warn" id="bi-dup" hidden></i></label>
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
        <label class="dev-form-wide">${T('fKind')}
          <select id="bi-kind">
            ${(BookCheck.KINDS || ['textbook','novel','notes','other']).map(k =>
              `<option value="${esc(k)}"${(b.kind || 'textbook') === k ? ' selected' : ''}>${
                esc((BookCheck.KINDS_ZH && BookCheck.KINDS_ZH[k]) || k)}</option>`).join('')}
          </select>
          <i class="dim" style="font-size:11.5px;font-weight:400">${T('fKindHint')}</i>
        </label>
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
    // 改名时实时查重 —— 等到点发布才被拦，用户已经白写了一堆
    const dupEl = $('bi-dup');
    const checkDup = () => {
      const t = $('bi-title').value.trim();
      const d = findDupTitle({ ...b, title: t });
      if (d) {
        dupEl.hidden = false;
        dupEl.textContent = '⚠ ' + T('dupTitle').replace('{t}', t).replace('{o}', d.title);
        $('bi-title').classList.add('dup-bad');
      } else {
        dupEl.hidden = true;
        $('bi-title').classList.remove('dup-bad');
      }
      return !d;
    };
    $('bi-title').oninput = checkDup;
    checkDup();

    $('bi-ok').onclick = () => {
      b.title = $('bi-title').value.trim() || b.id;
      b.subtitle = $('bi-sub').value.trim();
      b.desc = $('bi-desc').value.trim();
      b.author = { name: $('bi-author').value.trim() };
      b.license = $('bi-license').value.trim();
      b.stage = $('bi-stage').value.trim();
      b.level = $('bi-level').value.trim();
      b.kind = $('bi-kind').value;
      const L = [];
      if ($('bi-zh').checked) L.push('zh');
      if ($('bi-en').checked) L.push('en');
      b.langs = L.length ? L : ['zh'];
      b.repo = ($('bi-repo').value.trim() || 'al-book-' + b.id);
      checkDup();
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
      const names = [T('stepCheck'), T('stepRepo'), T('stepFiles'),
        T('stepVerify'), T('stepTopic')];
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

        // 重名：id 不同也不行
        const dup = findDupTitle(b);
        if (dup) {
          const who = dup.author ? `${dup.title}（${dup.author}）` : dup.title;
          throw new Error(T('dupTitle').replace('{t}', b.title).replace('{o}', who));
        }

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

        // 推文件 —— 一次 commitTree，不用 contents API 一个个写。
        //
        // 之前就是这里出的事：6 路并发各提交一次，GitHub 的 contents API
        // 每次提交都基于当前 HEAD，并发时后面的用的是过期的 base，直接 409；
        // 再加上 autoInit 建出来的 README 没有 sha 会 422。实测 15 个文件里
        // 挂了 5 个（33%），而错误被 catch 吞掉 —— 用户看到"发布成功"，
        // 实际推上去的是半本书，albook.json 一旦缺失机器人就永远发现不了它。
        //
        // commitTree 是一次提交：要么全成要么全不成，不会留半截。
        paint(2);
        const paths = Object.keys(files);
        await api.commitTree(
          owner, b.repo, branch,
          `publish: ${b.title}`,
          paths.map(p => ({ path: p, content: files[p] })),
        );
        paint(2, 'done', `${paths.length} ${T('filesPushed')}`);

        // 推完必须回头验一遍 —— 提交返回成功不等于文件真的都在。
        // 尤其 albook.json：没了它机器人读不到这本书，书会凭空消失。
        paint(3, 'run', T('verifying'));
        const live = new Set(
          (await api.getTree(owner, b.repo, branch))
            .filter(x => x.type === 'blob').map(x => x.path));
        const missing = paths.filter(p => !live.has(p));
        if (missing.length) {
          throw new Error(T('filesMissing').replace('{n}', missing.length) +
            '：' + missing.slice(0, 3).join('、') + (missing.length > 3 ? ' …' : ''));
        }

        // 打 topic：这是机器人发现书的入口，失败必须让用户知道
        paint(4);
        await api.setTopics(owner, b.repo, ['al-book']);

        b.published = {
          repo: `${owner}/${b.repo}`, owner, name: b.repo, branch,
          url: `https://github.com/${owner}/${b.repo}`,
          visibility: priv ? 'private' : 'public',
          at: Date.now(),
        };
        putBook(b);
        // 先按确切仓库名并入 —— 搜索索引有延迟，不能让作者刚发的书自己搜不到
        if (window.__addExternalRepo) await window.__addExternalRepo(`${owner}/${b.repo}`);
        if (window.__refreshExternal) window.__refreshExternal();
        paint(5, 'done');
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
        <button class="dev-btn ghost" id="mg-health">${T('health')}</button>
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
    $('mg-health').onclick = async () => {
      if (!api) { alert(T('needLogin')); return; }
      const btn = $('mg-health');
      btn.disabled = true; btn.textContent = T('healthRunning');
      try {
        const res = await checkPublished(b);
        btn.disabled = false; btn.textContent = T('health');
        showHealth(b, res);
      } catch (e) {
        btn.disabled = false; btn.textContent = T('health');
        alert(T('healthFail') + '：' + (e.message || e));
      }
    };
    $('mg-unpub').onclick = () => {
      if (!confirm(T('unpublishConfirm'))) return;
      b.published = null;
      putBook(b);
      box.remove();
      mountList(root);
    };
  }

  /* ================= 发布后体检 =================
   * 为什么需要：之前发布用 contents API 并发提交，一部分文件会 409 失败但被吞掉，
   * 用户看到"发布成功"，实际推上去的是半本书 —— 缺了 albook.json 机器人就永远
   * 发现不了它，表现就是"发布了却搜不到"。改完发布流程后新书不会再这样，
   * 但老书还残缺着，得有个地方能看出来并一键补发。
   */
  async function checkPublished(b) {
    const p = b.published;
    const files = toFiles(b);
    const want = Object.keys(files);
    const live = new Set(
      (await api.getTree(p.owner, p.name, p.branch))
        .filter(x => x.type === 'blob').map(x => x.path));
    const missing = want.filter(x => !live.has(x));
    // 最关键的两个：没了 albook.json 机器人发现不了，没了 toc 目录打不开
    const fatal = missing.filter(x => x === 'albook.json' || /toc\.json$/.test(x));
    let topics = [];
    try {
      const r = await api.getRepository(p.owner, p.name);
      topics = r.topics || [];
    } catch (e) { /* 读不到就当没有 */ }
    return { missing, fatal, topics, hasTopic: topics.includes('al-book'), total: want.length };
  }

  function showHealth(b, res) {
    const box = document.createElement('div');
    box.className = 'dev-modal';
    const okAll = !res.missing.length && res.hasTopic;
    box.innerHTML = `<div class="dev-modal-box wide">
      <h3>${tf('healthTitle', { t: b.title })}</h3>
      <div class="dev-h">${okAll ? '✅ ' + T('healthOk') : '⚠ ' + T('healthBad')}</div>
      <ul class="dev-check-list">
        <li>${res.hasTopic ? '✓' : '✗'} topic: al-book ${res.hasTopic ? '' :
          `<i class="dim">— ${T('healthNoTopic')}</i>`}</li>
        <li>${res.missing.length ? '✗' : '✓'} ${tf('healthFiles',
          { n: res.total - res.missing.length, t: res.total })}
          ${res.missing.length ? `<i class="dim">— ${T('healthMissing')}：${
            esc(res.missing.slice(0, 4).join('、'))}${res.missing.length > 4 ? ' …' : ''}</i>` : ''}
        </li>
      </ul>
      ${res.missing.length ? `<p class="dim">${T('healthFixTip')}</p>` : ''}
      <div class="dev-modal-actions">
        ${res.missing.length ? `<button class="dev-btn" id="hl-repub">${T('republish')}</button>` : ''}
        <button class="dev-btn ghost" id="hl-close">${lang === 'zh' ? '关闭' : 'Close'}</button>
      </div>
    </div>`;
    document.body.appendChild(box);
    const close = () => box.remove();
    $('hl-close').onclick = close;
    box.onclick = e => { if (e.target === box) close(); };
    const rb = $('hl-repub');
    if (rb) {
      rb.onclick = async () => {
        close();
        try {
          await api.commitTree(b.published.owner, b.published.name, b.published.branch,
            `republish: ${b.title}`,
            Object.keys(toFiles(b)).map(p => ({ path: p, content: toFiles(b)[p] })));
          await api.setTopics(b.published.owner, b.published.name, ['al-book']);
          toast(T('repubOk'));
          if (window.__addExternalRepo) await window.__addExternalRepo(b.published.repo);
          if (window.__refreshExternal) window.__refreshExternal();
        } catch (e) { alert(T('publishFail') + '：' + (e.message || e)); }
      };
    }
  }

  /* ================= 从文章导入的界面 ================= */

  function showImportArticleDialog() {
    const root = $('dev-root') || document.querySelector('.dev-wrap');
    const box = document.createElement('div');
    box.className = 'dev-modal';
    box.innerHTML = `<div class="dev-modal-box wide">
      <h3>${T('artTitle')}</h3>
      <p class="dim" style="font-size:12.5px">${T('artDesc')}</p>
      <div class="dev-form">
        <label>${T('artName')}<input type="text" id="ar-title" placeholder="${T('artNamePh')}"></label>
      </div>
      <textarea id="ar-md" rows="12" spellcheck="false"
        placeholder="${T('artPh')}" class="dev-md-input"></textarea>
      <div class="dev-pick" id="ar-pick"></div>
      <div id="ar-out" class="dev-out"></div>
      <div class="dev-modal-actions">
        <button class="dev-btn" id="ar-go">${T('artGo')}</button>
        <button class="dev-btn ghost" id="ar-cancel">${T('cancel')}</button>
      </div>
    </div>`;
    document.body.appendChild(box);
    const close = () => box.remove();
    $('ar-cancel').onclick = close;
    box.onclick = e => { if (e.target === box) close(); };
    setTimeout(() => $('ar-md').focus(), 120);

    // 支持拖入 .md 文件
    const ta = $('ar-md');
    ta.addEventListener('dragover', e => { e.preventDefault(); ta.classList.add('drag'); });
    ta.addEventListener('dragleave', () => ta.classList.remove('drag'));
    ta.addEventListener('drop', async e => {
      e.preventDefault();
      ta.classList.remove('drag');
      const f = e.dataTransfer.files && e.dataTransfer.files[0];
      if (!f) return;
      if (!/\.(md|markdown|txt)$/i.test(f.name)) { alert(T('artBadFile')); return; }
      ta.value = await f.text();
      if (!$('ar-title').value.trim()) {
        $('ar-title').value = f.name.replace(/\.(md|markdown|txt)$/i, '');
      }
      previewArticle();
    });

    // 边贴边预览会拆成什么样，别等导入完才知道
    let timer = null;
    ta.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(previewArticle, 400);
    });

    function previewArticle() {
      const out = $('ar-out');
      const md = ta.value;
      if (!md.trim()) { out.innerHTML = ''; return; }
      const chs = splitArticle(md);
      const nL = chs.reduce((a, c) => a + c.lessons.length, 0);
      out.innerHTML = `<div class="dev-step done"><span>✓</span>${
        T('artPreview').replace('{c}', chs.length).replace('{l}', nL)}</div>` +
        `<div class="dev-pick">` + chs.slice(0, 6).map(c =>
          `<div class="dev-pick-i" style="cursor:default">
             <b>${esc(c.title || T('artNoChapter'))}</b>
             <span>${esc(c.lessons.map(x => x.title).join(' · ').slice(0, 90))}</span>
           </div>`).join('') + (chs.length > 6 ? `<div class="dim" style="font-size:11.5px">…${
          esc(T('artMore').replace('{n}', chs.length - 6))}</div>` : '') + `</div>`;
    }

    $('ar-go').onclick = () => {
      const md = ta.value.trim();
      if (!md) { alert(T('artEmpty')); return; }
      const chs = splitArticle(md);
      const nL = chs.reduce((a, c) => a + c.lessons.length, 0);
      if (!nL) { alert(T('artNoSplit')); return; }

      // 书名：用户填的 > 文章第一个 h1 > 默认
      let title = $('ar-title').value.trim();
      if (!title) {
        const m = md.match(/^#\s+(.+?)\s*$/m);
        title = m ? m[1] : T('artDefaultTitle');
      }
      title = title.slice(0, 60);

      // id 只认 [a-z0-9-]（校验器硬性要求）。
      // 中文标题做不出拼音，如果把汉字留在 id 里，albook.json 会报"id 不合法"，
      // 表现就是：兴冲冲导入完，点发布被拦下，还看不出为什么。
      // 所以纯中文标题一律回退到 'book'，再靠避重变成 book-2、book-3。
      const slug = String(title).toLowerCase()
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 24);
      let id = /^[a-z0-9]/.test(slug) ? slug : 'book';
      if (!id || id === '-') id = 'book';
      const all = loadAll();
      let nid = id, k = 2;
      while (all[nid]) { nid = id + '-' + k; k++; }

      const chapters = [];
      let li = 0;
      for (const c of chs) {
        const lessons = [];
        for (const l of c.lessons) {
          li++;
          const lid = String(li).padStart(2, '0');
          lessons.push({ id: lid, title: l.title, md: ensureLead(l.md, l.title) });
        }
        // 章测默认不建 —— 文章本来就没题，建了也是空的，
        // 反而会因为"一道题都没有"被教材模式卡住。
        chapters.push({ title: c.title || T('artChapter').replace('{n}', chapters.length + 1),
                        lessons, test: null, testMd: '' });
      }

      const b = {
        id: nid,
        repo: 'al-book-' + nid,
        title,
        subtitle: T('artSubtitle'),
        desc: artSummary(md) || title,
        stage: 'other',
        level: '入门',
        langs: [lang === 'zh' ? 'zh' : 'en'],
        // 关键：文章没有题，设成 notes 才能过校验。
        // 设成 textbook 会因为"一道题都没有"不予收录 —— 作者想做成教材
        // 自己在书籍信息里改，然后加题。
        kind: 'notes',
        license: 'CC BY-NC 4.0',
        author: { name: (Store.get(Store.K.OWNER, '')) || '' },
        tags: [],
        chapters,
        importedFrom: { fromArticle: true, at: Date.now() },
        published: null,
        createdAt: Date.now(), updatedAt: Date.now(),
      };

      putBook(b);
      close();
      cur = b;
      curLesson = { chIdx: 0, lsIdx: 0 };
      mountEditor(root);
      toast(T('artDone').replace('{c}', chapters.length).replace('{l}', li));
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
  .dev-ls .fn{font-style:normal;color:var(--faint);font-size:11.5px;margin-left:6px}
  .dev-ls-tag{font-size:12px;font-weight:650;color:var(--accent);white-space:nowrap}
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
  .dev-qwarn{background:#fff6e5;border:1px solid #f0d9a8;color:#8a5a00;border-radius:7px;
    padding:6px 11px;font-size:12.5px;margin:8px 0 0}
  .dev-qbox-inline{margin:10px 0}
  .dev-qbox-inline.exam .quiz{border-color:color-mix(in srgb,var(--accent) 45%,var(--border))}
  .dev-pv-body .quiz{margin:0}
  .dev-tag{font-size:10.5px;font-weight:600;padding:2px 7px;border-radius:99px;
    background:color-mix(in srgb,var(--accent) 20%,transparent);color:var(--accent);
    margin-left:8px;white-space:nowrap}



  /* 整页模式下三栏要撑满，不再受 900px 的正文宽度限制 */
  body.wide-view .dev-wrap{max-width:1560px;padding:26px 30px 70px}
  body.wide-view .dev-ed{grid-template-columns:260px minmax(0,1fr) minmax(0,1fr)}

  /* 题目库面板 */
  .dev-snips{border-bottom:1px solid var(--border);background:var(--bg-soft);
    padding:12px 14px;max-height:340px;overflow:auto}
  .dev-snip-top{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:10px}
  .dev-snip-h{font-size:13px;font-weight:700}
  .dev-snip-top .dev-radio{font-size:12.5px;color:var(--text)}
  .dev-snip-top .dev-x{margin-left:auto;font-size:17px}
  .dev-snip-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(215px,1fr));gap:9px}
  .dev-snip{display:flex;flex-direction:column;align-items:flex-start;gap:2px;
    padding:10px 12px;border:1px solid var(--border);border-radius:9px;background:var(--panel);
    color:var(--text);cursor:pointer;text-align:left;font-family:inherit;transition:.14s}
  .dev-snip:hover{border-color:var(--accent);transform:translateY(-1px)}
  .dev-snip .si{font-size:15px;color:var(--accent);font-weight:700;line-height:1}
  .dev-snip .sn{font-size:13.5px;font-weight:660;margin-top:2px}
  .dev-snip .sd{font-size:11.5px;color:var(--faint);line-height:1.45}
  .dev-snip .st{font-size:10px;font-weight:650;padding:1px 7px;border-radius:99px;
    background:var(--border-soft);color:var(--faint);margin-top:4px}
  .dev-snip{position:relative}
  .dev-snip.mine{border-color:color-mix(in srgb,var(--accent) 40%,var(--border))}
  .dev-snip.mine .si{color:var(--amber)}
  .dev-snip-x{position:absolute;top:5px;right:7px;font-size:14px;color:var(--faint);
    padding:0 4px;border-radius:5px;line-height:1}
  .dev-snip-x:hover{background:var(--red-soft);color:var(--red)}
  .dev-snip.add{border-style:dashed;align-items:center;text-align:center}
  .dev-snip.add .sn{color:var(--accent)}
  .dev-snip-sec{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
    color:var(--faint);margin:14px 0 8px}
  .dev-snip-note{font-size:11.5px;color:var(--faint);margin-top:9px;line-height:1.5}

  /* 专注模式：收起章节树 */
  .dev-ed.focused{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
  .dev-ed.focused .dev-tree{display:none}
  .dev-wrap.focused .dev-ed-top{max-width:1560px}
  .dev-btn.sm.on{border-color:var(--accent);color:var(--accent);
    background:color-mix(in srgb,var(--accent) 14%,transparent)}
  body.wide-view .dev-ed.focused .dev-edit textarea{min-height:620px}
  /* 窄屏不隐藏预览，改成上下堆叠 —— 直接藏掉的话作者就没法边写边看了 */
  @media(max-width:1180px){
    body.wide-view .dev-ed{grid-template-columns:230px minmax(0,1fr)}
    body.wide-view .dev-view{grid-column:1/-1}
    body.wide-view .dev-edit textarea{min-height:340px}
  }
  @media(max-width:820px){ body.wide-view .dev-ed{grid-template-columns:1fr} }

  /* 轻提示 */
  .dev-toast{position:fixed;left:50%;bottom:34px;transform:translateX(-50%);
    background:var(--text);color:var(--panel);padding:10px 20px;border-radius:9px;
    font-size:13.5px;z-index:2000;box-shadow:0 6px 24px rgba(0,0,0,.22)}

  /* 导入：候选书列表 */
  .dev-pick{margin:8px 0;max-height:190px;overflow:auto}
  .dev-pick-h{font-size:12px;color:var(--faint);font-weight:600;margin:8px 0 5px}
  .dev-pick-i{display:flex;flex-direction:column;gap:1px;align-items:flex-start;width:100%;
    padding:7px 10px;border:1px solid var(--border);border-radius:8px;background:transparent;
    color:var(--text);font-size:13px;cursor:pointer;text-align:left;font-family:inherit;margin-bottom:5px}
  .dev-pick-i:hover{border-color:var(--accent)}
  .dev-pick-i span{font-size:11.5px;color:var(--faint)}
  .dev-out{margin:6px 0}

  /* 文章导入：大文本框 + 拖拽高亮 */
  .dev-md-input{width:100%;box-sizing:border-box;padding:11px 13px;margin-top:10px;
    border:1px solid var(--border);border-radius:9px;background:transparent;color:var(--text);
    font-size:13px;line-height:1.65;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
    resize:vertical;min-height:200px}
  .dev-md-input:focus{outline:none;border-color:var(--accent)}
  .dev-md-input.drag{border-color:var(--accent);
    background:color-mix(in srgb, var(--accent) 7%, transparent)}

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
  .dev-form-wide select{padding:8px 11px;border:1px solid var(--border);border-radius:8px;
    background:transparent;color:var(--text);font-size:13.5px;font-family:inherit}
  .dev-form-wide .dim{display:block;margin-top:5px;line-height:1.5}
  .dev-checks label{flex-direction:row;align-items:center;font-size:13px;color:var(--text)}

  .dev-check-list{list-style:none;margin:8px 0 0;padding:0;display:flex;flex-direction:column;gap:7px}
  .dev-check-list li{font-size:13px}
  .dev-check-list .dim{font-style:normal;margin-left:6px}

  /* 重名警告：书名输入框正下方，别让作者写完一堆才发现发不出去 */
  .dup-warn{display:block;margin-top:4px;font-size:11.5px;font-weight:400;line-height:1.55;
    color:#e0a33a;font-style:normal}
  .dev-form input.dup-bad{border-color:#e0a33a}

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
    // 仅注入登录态、不渲染（供脚本/测试调用云端接口用）
    if (!root) {
      if (opts.api) api = opts.api;
      if (opts.lang) lang = opts.lang;
      return;
    }
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
    // 主站已登录时会直接把 api 传进来，省一次 /user 请求
    if (opts.api) api = opts.api;
    if (view === 'editor') mountEditor(root); else mountList(root);
  }

  return { mount, loadAll, stats, toFiles, blank, lessonTemplate, previewMd,
           fetchBookForImport, bookFiles, cloudList, pullBook, pushBook,
           isLoggedIn: () => !!api };
})();
