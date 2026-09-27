/**
 * Markdown 渲染 + 代码块提取
 * 优先用 marked（CDN），失败时退回内置精简渲染器，保证离线也能读。
 * 渲染后用 DOMPurify 清洗，防止内容注入。
 */
const MD = (() => {

  /** 把 Markdown 里的围栏块抽出来：普通代码进 blocks，题目进 quizzes
   *  （保留给外部工具用；主渲染走 renderLesson 的分段逻辑，不使用占位符） */
  function extract(md) {
    const blocks = [];
    const quizzes = [];
    const out = md.replace(/```(\w+)?\n([\s\S]*?)```/g, (m, lang, code) => {
      const L = (lang || 'text').toLowerCase();
      const body = code.replace(/\n$/, '');
      if (L === 'quiz') {
        const i = quizzes.length;
        quizzes.push(body);
        return `%%ALQUIZ:${i}%%`;
      }
      const i = blocks.length;
      blocks.push({ lang: L, code: body });
      return `%%ALBLOCK:${i}%%`;
    });
    return { md: out, blocks, quizzes };
  }

  /** 内置极简渲染器：够用、零依赖 */
  function fallbackRender(src) {
    const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    let s = esc(src);

    // 行内代码先占位，避免被其他规则破坏
    const inlines = [];
    s = s.replace(/`([^`\n]+)`/g, (m, c) => {
      inlines.push(c); return `\u0000INL${inlines.length - 1}\u0000`;
    });

    const lines = s.split('\n');
    const out = [];
    let list = null, inQuote = false;

    const flushList = () => { if (list) { out.push(`</${list}>`); list = null; } };
    const flushQuote = () => { if (inQuote) { out.push('</blockquote>'); inQuote = false; } };

    for (let li = 0; li < lines.length; li++) {
      const raw = lines[li];
      const line = raw.trimEnd();

      // 引用块里嵌代码围栏：> ```python ... > ```
      // 之前 ^> 分支把每行都包成 <p>，围栏被当成纯文本显示出来。
      // 这里先一步吃掉整个 "引用 + 围栏" 段，原样渲染成一个真正的代码块。
      const fenceInQuote = line.match(/^(?:>|&gt;)\s*```(\w*)\s*$/);
      if (fenceInQuote) {
        flushList();
        if (!inQuote) { out.push('<blockquote>'); inQuote = true; }
        const lang = fenceInQuote[1] || '';
        const body = [];
        li++;
        while (li < lines.length) {
          const cur = lines[li];
          if (/^(?:>|&gt;)\s*```\s*$/.test(cur.trimEnd())) break;   // 围栏结束
          if (/^(?:>|&gt;)\s?/.test(cur)) body.push(cur.replace(/^(?:>|&gt;)\s?/, ''));
          else break;                                        // 引用断了
          li++;
        }
        const code = body.join('\n').replace(/\u0000INL(\d+)\u0000/g, (m, i) => '`' + inlines[+i] + '`');
        out.push(`<pre><code${lang ? ` class="lang-${lang}"` : ''}>${code}</code></pre>`);
        continue;
      }

      if (/^\s*$/.test(line)) { flushList(); flushQuote(); continue; }

      let m;
      if ((m = line.match(/^(#{1,6})\s+(.*)$/))) {
        flushList(); flushQuote();
        const lv = m[1].length;
        out.push(`<h${lv}>${m[2]}</h${lv}>`);
      } else if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
        flushList(); flushQuote(); out.push('<hr>');
      } else if ((m = line.match(/^(?:>|&gt;)\s?(.*)$/))) {
        flushList();
        if (!inQuote) { out.push('<blockquote>'); inQuote = true; }
        const qtxt = m[1].replace(/^&gt;\s?/, '');
        if (qtxt.trim()) out.push(`<p>${qtxt}</p>`);
      } else if ((m = line.match(/^[-*+]\s+(.*)$/))) {
        flushQuote();
        if (list !== 'ul') { flushList(); out.push('<ul>'); list = 'ul'; }
        out.push(`<li>${m[1]}</li>`);
      } else if ((m = line.match(/^\d+[.)]\s+(.*)$/))) {
        flushQuote();
        if (list !== 'ol') { flushList(); out.push('<ol>'); list = 'ol'; }
        out.push(`<li>${m[1]}</li>`);
      } else {
        flushList(); flushQuote();
        out.push(`<p>${line}</p>`);
      }
    }
    flushList(); flushQuote();

    s = out.join('\n');
    // 行内标记
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
         .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
         .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, t, h) =>
            `<a href="${/^(https?:|#|\/)/.test(h) ? h : '#'}"${/^https?:/.test(h) ? ' target="_blank" rel="noopener"' : ''}>${t}</a>`);
    // 还原行内代码
    s = s.replace(/\u0000INL(\d+)\u0000/g, (m, i) => `<code>${inlines[+i]}</code>`);
    return s;
  }

  function render(src) {
    let html;
    try {
      if (window.marked) {
        html = marked.parse(src, { gfm: true, breaks: false });
      } else {
        html = fallbackRender(src);
      }
    } catch (e) {
      console.warn('[MD] 渲染失败，使用 fallback:', e.message);
      html = fallbackRender(src);
    }
    return window.DOMPurify ? DOMPurify.sanitize(html) : html;
  }

  /**
   * 渲染一节课。
   *
   * 采用「分段渲染」而不是占位符替换：
   * 早期版本用 \u0000BLOCK0\u0000 之类的控制字符做占位，但 DOMPurify 清洗时
   * 会吞掉控制字符，占位符就退化成纯文本 "BLOCK0" 显示在页面上。
   * 现在改成按围栏把原文切成若干段，文本段各自走 render()（marked + sanitize），
   * 代码块/题目由我们自己拼出可信 HTML —— 挂载点永不经过清洗，不可能泄漏。
   *
   * @returns {{html:string, blocks:Array, quizzes:Array}}
   */
  function renderLesson(src) {
    // 按围栏切段，保留分隔符以便判断类型。
    // 注意：引用块（> 开头）里的围栏不能被切走 —— 否则代码内容会带着 "> " 前缀
    // 变成一个非法代码块。这类围栏留给 render()/fallbackRender 在 blockquote 内处理。
    const segs = [];
    const re = /```(\w+)?\n([\s\S]*?)```/g;
    let last = 0, m;

    while ((m = re.exec(src)) !== null) {
      // 围栏起点所在行以 ">" 开头 → 属于引用块，跳过（不切）
      const lineStart = src.lastIndexOf('\n', m.index) + 1;
      if (/^\s*>/.test(src.slice(lineStart, m.index + 3))) continue;

      if (m.index > last) segs.push({ type: 'text', text: src.slice(last, m.index) });
      const lang = (m[1] || 'text').toLowerCase();
      const body = m[2].replace(/\n$/, '');
      segs.push({ type: lang === 'quiz' ? 'quiz' : 'block', lang, code: body });
      last = m.index + m[0].length;
    }
    if (last < src.length) segs.push({ type: 'text', text: src.slice(last) });

    const blocks = [];
    const quizzes = [];
    const html = segs.map(seg => {
      if (seg.type === 'text') {
        // 纯空段（围栏之间只剩换行）跳过，避免渲染出空 <p>
        return seg.text.trim() ? render(seg.text) : '';
      }
      if (seg.type === 'quiz') {
        const i = quizzes.length;
        quizzes.push(seg.code);
        return `<div data-quiz="${i}"></div>`;
      }
      const i = blocks.length;
      blocks.push({ lang: seg.lang, code: seg.code });
      return `<div data-codeblock="${i}"></div>`;
    }).join('\n');

    return { html, blocks, quizzes };
  }

  return { render, renderLesson, extract, parseQuiz: parseQuizText, parseQuizText };

  /** 供外部直接用：把 quiz 文本解析成对象 */
  function parseQuizText(text) {
    const data = {};
    const lines = text.split('\n');
    let i = 0;
    while (i < lines.length) {
      const m = lines[i].match(/^(\w+)\s*:\s*(.*)$/);
      if (!m) { i++; continue; }
      const key = m[1], val = m[2];
      if (val === '|' || val === '>') {
        const buf = []; i++;
        while (i < lines.length && (/^\s{2,}/.test(lines[i]) || lines[i].trim() === '')) {
          if (lines[i].trim() !== '') buf.push(lines[i].replace(/^\s{2}/, ''));
          i++;
        }
        data[key] = buf.join('\n');
        continue;
      }
      if (val === '') {
        const buf = []; i++;
        while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
          buf.push(lines[i].replace(/^\s*-\s+/, '').trim()); i++;
        }
        data[key] = buf;
        continue;
      }
      data[key] = val.trim(); i++;
    }
    return data;
  }
})();
