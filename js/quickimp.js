/**
 * 一键导入：把一篇现成的 Markdown 变成一本 AnyLearn 书。
 *
 * 为什么要有这个：写书最大的门槛不是"不会写"，而是"我有一篇笔记 /
 * 一篇文章，要把它变成符合格式的书" —— 得理解 albook.json 九个必填字段、
 * toc.json 的结构、课文命名规则。这些坑我们自己全踩过。
 * 一键导入让这件事变成：粘贴 → 看预览 → 完事。
 *
 * 两个核心难点：
 *
 * 1. 代码里的 # 注释。Python 的 `# 计算总数` 长得就像 Markdown 标题，
 *    直接按 /^#/m 切会把一段完整代码切成好几课。必须跟踪围栏状态。
 *
 * 2. 课文必须以一级标题开头。原文切片通常自带 `## xxx`（那是章下面的课），
 *    要升为 `# xxx`；直接补一个标题的话开头会出现两遍同一个标题。
 */
const QuickImport = (() => {

function scanHeadings(md) {
  const lines = md.split(/\r?\n/);
  const out = [];
  let fence = null;              // 当前围栏的结束标记（``` 或 ~~~）
  let fenceIndent = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const indent = line.match(/^\s*/)[0].length;
    const trimmed = line.trim();

    // ---- 围栏开关（先于标题判断，围栏内的一切都不算标题）----
    const fm = trimmed.match(/^(```+|~~~+)(.*)$/);
    if (fm) {
      if (!fence) {
        fence = fm[1];
        fenceIndent = indent;
      } else if (fm[1][0] === fence[0] && fm[1].length >= fence.length && !fm[2].trim()) {
        fence = null;            // 闭合
      }
      continue;
    }
    if (fence) continue;         // 围栏内：整行忽略

    // ---- ATX 标题：# 到 ######，最多 3 个前导空格 ----
    if (indent > 3) continue;
    const hm = trimmed.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (hm) out.push({ line: i, level: hm[1].length, text: hm[2].trim() });
  }
  return out;
}

/** 清掉标题里的 markdown 语法，留纯文本 */
function plainTitle(s) {
  return String(s || '')
    .replace(/`([^`]+)`/g, '$1')          // 行内代码
    .replace(/\*\*?([^*]+)\*\*?/g, '$1')  // 粗体斜体
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // 链接
    .replace(/^[\s\d.、]+/, '')            // 去掉 "1." "1、" 这类编号
    .trim();
}

/** 统计各级别标题出现次数（只数围栏外的） */
function countLevels(headings) {
  const c = {};
  for (const h of headings) c[h.level] = (c[h.level] || 0) + 1;
  return c;
}

/**
 * 决定怎么切。
 * 优先用「# 做章、## 做课」—— 这是人写文档最自然的层级。
 * 只有一级标题时，用它做课，全部归入一章（课多了再分章）。
 */
function pickLevels(headings) {
  const c = countLevels(headings);
  // 「# 做章、## 做课」是最自然的层级，但只在 ## 真的比 # 更细时才成立。
  // 一篇随手写的笔记可能有一个 ##，那不该改变整体切法 ——
  // 所以要求 ## 的数量不少于 #，才是"章下面还有若干课"的结构。
  if ((c[1] || 0) >= 2 && (c[2] || 0) >= (c[1] || 0)) return { chapter: 1, lesson: 2 };
  if ((c[1] || 0) >= 2) return { chapter: null, lesson: 1 };
  if ((c[2] || 0) >= 2) return { chapter: null, lesson: 2 };
  if ((c[3] || 0) >= 2) return { chapter: null, lesson: 3 };
  return { chapter: null, lesson: null };   // 切不了：整篇一课
}

const LESSONS_PER_CHAPTER = 8;   // 只有课没有章时，按这个数分组

/** 切块：返回 [{start, end, level, title}]，end 不含 */
function slice(md, headings, level) {
  const lines = md.split(/\r?\n/);
  const marks = headings.filter(h => h.level === level);
  const out = [];
  for (let i = 0; i < marks.length; i++) {
    const start = marks[i].line;
    const end = i + 1 < marks.length ? marks[i + 1].line : lines.length;
    out.push({ start, end, title: marks[i].text, md: lines.slice(start, end).join('\n') });
  }
  return out;
}

/**
 * 保证课文以一级标题开头。
 * 已有 `## xxx` / `### xxx` → 降级符号去掉，升为 `# xxx`；
 * 一个标题都没有 → 补一个。
 */
function ensureH1(md, fallback) {
  const lines = String(md || '').split('\n');
  let i = 0;
  while (i < lines.length && !lines[i].trim()) i++;
  const first = lines[i] || '';
  const m = first.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);
  if (m) {
    if (m[1].length !== 1) {
      lines[i] = '# ' + m[2];      // 升为一级
      return lines.join('\n');
    }
    return md;                      // 已经是一级，原样
  }
  return `# ${fallback || '未命名'}\n\n${md}`;
}

/** 去掉首尾空行 */
function trimBlock(s) {
  return String(s || '').replace(/^\s*\n+/, '').replace(/\n{3,}/g, '\n\n').replace(/\s+$/, '');
}

/** 正文里有没有 quiz 块 —— 决定这本书要不要按教材卡题目数量 */
function hasQuiz(md) {
  return /```quiz[\s\S]*?^```\s*$/m.test(md);
}

function slug(s) {
  let x = String(s || '').toLowerCase().trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!/^[a-z0-9]/.test(x)) x = 'b-' + x;
  return x.slice(0, 40) || 'book';
}

/**
 * 主函数。
 * @param md   原文
 * @param opt  { fileName, wantLevel }  wantLevel 可强制切分级别
 */
function build(md, opt = {}) {
  const lang = opt.lang || 'zh';
  md = String(md || '');
  const lines = md.split(/\r?\n/);
  const headings = scanHeadings(md);
  const auto = pickLevels(headings);
  const want = opt.wantLevel || null;

  let lessonLevel = auto.lesson, chapterLevel = auto.chapter;
  if (want === 'h1') { lessonLevel = 1; chapterLevel = null; }
  else if (want === 'h2') { lessonLevel = 2; chapterLevel = null; }
  else if (want === 'h3') { lessonLevel = 3; chapterLevel = null; }
  else if (want === 'h1h2') { chapterLevel = 1; lessonLevel = 2; }
  else if (want === 'none') { lessonLevel = null; chapterLevel = null; }

  // ---- 书名：优先取文档开头的唯一 # 标题，其次第一个标题，再次文件名 ----
  let title = '';
  const h1s = headings.filter(h => h.level === 1);
  if (h1s.length === 1 && h1s[0].line <= 2) title = plainTitle(h1s[0].text);
  else if (headings.length) title = plainTitle(headings[0].text);
  if (!title && opt.fileName) title = String(opt.fileName).replace(/\.(md|markdown|txt)$/i, '').trim();
  if (!title) title = '导入的书';

  // ---- 切课 ----
  let lessons = [];
  if (lessonLevel == null) {
    lessons = [{ title: title, md: trimBlock(md) }];
  } else {
    lessons = slice(md, headings, lessonLevel)
      .map(b => ({ title: plainTitle(b.title), md: trimBlock(lines.slice(b.start, b.end).join('\n')) }))
      .filter(x => x.md.length > 0);
  }
  if (!lessons.length) lessons = [{ title: title, md: trimBlock(md) }];

  // ---- 切章 ----
  let chapters = [];
  if (chapterLevel != null) {
    // slice() 只给行号范围，内容要自己切出来
    for (const cb of slice(md, headings, chapterLevel)) {
      const body = lines.slice(cb.start, cb.end).join('\n');
      const sub = slice(body, scanHeadings(body), 2).map(b => ({
        title: plainTitle(b.title),
        md: trimBlock(b.md != null ? b.md : body.split('\n').slice(b.start, b.end).join('\n')),
      })).filter(x => x.md.length);
      const items = sub.length ? sub
        : [{ title: plainTitle(cb.title), md: trimBlock(body) }];
      if (items.length) chapters.push({ title: plainTitle(cb.title), lessons: items });
    }
  } else {
    const per = LESSONS_PER_CHAPTER;
    const n = Math.max(1, Math.ceil(lessons.length / per));
    const size = Math.ceil(lessons.length / n);
    for (let i = 0; i < lessons.length; i += size) {
      chapters.push({ title: `第 ${chapters.length + 1} 章`, lessons: lessons.slice(i, i + size) });
    }
  }
  if (!chapters.length) chapters = [{ title: '第 1 章', lessons }];

  // desc：取第一处非标题、非代码的实质文字做摘要
  let desc = '';
  for (const b of lessons) {
    const t = b.md.replace(/^#{1,6}\s+.*$/gm, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/^>\s?/gm, '')
      .replace(/\s+/g, ' ').trim();
    if (t.length >= 10) { desc = t.slice(0, 110); break; }
  }
  // 课文太短或全是标题时摘不出摘要 —— 校验器要求 desc 非空，必须兜底
  if (desc.length < 10) {
    desc = lang === 'zh'
      ? '从一篇 Markdown 导入。可以在「书籍信息」里改成你自己的介绍。'
      : 'Imported from a Markdown file. Edit the description in Book info.';
  }

  return { title, subtitle: '', desc, chapters, hasQuiz: hasQuiz(md),
           levels: { lessonLevel, chapterLevel }, auto };
}

/** 转成 dev.js 的草稿结构 */
function toDraft(r, { id, lang = 'zh', authorName = '' } = {}) {
  let n = 0;
  const chapters = r.chapters.map((ch, ci) => {
    const lessons = ch.lessons.map(ls => {
      n++;
      // 阅读器靠 `^# 标题` 抓课名，所以每课必须以一级标题开头。
      // 原文切片通常自带 `## xxx` —— 那是一级标题降级来的，要升回一级；
      // 直接再补一个 # 标题的话，课文开头会出现两遍同一个标题。
      const md = ensureH1(ls.md, ls.title);
      return { id: String(n).padStart(2, '0'), title: ls.title, md };
    });
    return {
      title: ch.title,
      lessons,
      test: `test-${String(ci + 1).padStart(2, '0')}`,
      testMd: '',
    };
  });

  // 有题才当教材；没有就设为"笔记"，不然会因为缺题发布不出去。
  const kind = r.hasQuiz ? 'textbook' : 'notes';

  return {
    id,
    repo: 'al-book-' + id,
    title: r.title,
    // 校验器要求这两个非空 —— 空着的话刚导入完点发布就被拦，很莫名其妙。
    // desc 用原文摘要填，比占位文字有用。
    subtitle: r.subtitle || (lang === 'zh' ? '导入的笔记' : 'Imported notes'),
    desc: r.desc || '',
    stage: '基础',
    level: '入门',
    langs: [lang],
    kind,
    license: 'CC BY-NC 4.0',
    author: { name: authorName },
    tags: [],
    chapters,
    published: null,
    createdAt: Date.now(), updatedAt: Date.now(),
  };
}

  return { scanHeadings, plainTitle, countLevels, pickLevels,
           build, toDraft, slice, slug, hasQuiz, trimBlock, ensureH1 };
})();
