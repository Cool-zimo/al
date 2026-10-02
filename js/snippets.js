/**
 * 题目库：把各种题型做成可一键插入的片段。
 *
 * 为什么需要它：手写 quiz 的 YAML 很容易漏字段（cases 的逗号、answer 越界、
 * html/css/js 题缺 checks），漏了之后题意能显示但判不了分 ——
 * 作者自己很难发现。片段保证插进来就是合法的。
 *
 * 所有片段都满足：
 *   - 字段齐全，能通过 BookCheck
 *   - cases 用逗号分隔（空格会被解析成一个参数）
 *   - 占位文本用「__」标出要改的地方，方便一眼看到
 *
 * 片段体用数组 join 而不是模板字符串：内容里有 ``` 围栏，
 * 在模板字符串里写反引号会提前终止字符串（这个项目踩过一次）。
 */
const Snippets = (() => {

  const fence = '```';
  const q = body => body.join('\n');

  /** 多选题的 answer 用逗号分隔多个下标；multi: true 才渲染成复选框 */
  const SNIPS = [
    {
      id: 'choice', type: 'choice', icon: '◉',
      name: { zh: '单选题', en: 'Single choice' },
      desc: { zh: '几个选项里选一个', en: 'Pick one from several options' },
      body: (L, exam) => {
        const zh = L === 'zh';
        return q([
          fence + 'quiz',
          'type: choice',
          exam ? 'exam: true' : null,
          'q: ' + (zh ? '下面哪个说法是对的？' : 'Which statement is correct?'),
          'options:',
          '- ' + (zh ? '选项 A（正确答案）' : 'Option A (correct)'),
          '- ' + (zh ? '选项 B' : 'Option B'),
          '- ' + (zh ? '选项 C' : 'Option C'),
          'answer: 0',
          'hint: ' + (zh ? '提示：想想……' : 'Hint: think about…'),
          'explain: ' + (zh ? '因为……所以选 A' : 'Because… so A'),
          fence,
        ].filter(x => x !== null));
      },
    },
    {
      id: 'choice-multi', type: 'choice', icon: '☑',
      name: { zh: '多选题', en: 'Multiple choice' },
      desc: { zh: '可多选，answer 用逗号分隔', en: 'Several correct; answer comma-separated' },
      body: (L, exam) => {
        const zh = L === 'zh';
        return q([
          fence + 'quiz',
          'type: choice',
          exam ? 'exam: true' : null,
          'multi: true',
          'q: ' + (zh ? '下面哪些是对的？（多选）' : 'Which are correct? (multiple)'),
          'options:',
          '- ' + (zh ? '选项 A（对）' : 'Option A (correct)'),
          '- ' + (zh ? '选项 B（对）' : 'Option B (correct)'),
          '- ' + (zh ? '选项 C' : 'Option C'),
          'answer: 0, 1',
          'explain: ' + (zh ? 'A 和 B 都对' : 'Both A and B'),
          fence,
        ].filter(x => x !== null));
      },
    },
    {
      id: 'fill', type: 'fill', icon: '✎',
      name: { zh: '填空题', en: 'Fill in the blank' },
      desc: { zh: '填关键词，可用 | 给多个可接受答案', en: 'Keyword; | separates accepted answers' },
      body: (L, exam) => {
        const zh = L === 'zh';
        return q([
          fence + 'quiz',
          'type: fill',
          exam ? 'exam: true' : null,
          'q: ' + (zh ? 'Python 里定义函数用什么关键字？' : 'Which keyword defines a function in Python?'),
          'answer: ' + (zh ? 'def' : 'def'),
          'placeholder: ' + (zh ? '在这里填' : 'type here'),
          'hint: ' + (zh ? '三个字母' : 'Three letters'),
          'explain: ' + (zh ? '用 def 定义函数' : 'Use def'),
          fence,
        ].filter(x => x !== null));
      },
    },
    {
      id: 'function', type: 'function', icon: 'ƒ',
      name: { zh: '函数题', en: 'Function' },
      desc: { zh: '真调用你写的函数，逐用例比对返回值', en: 'Really calls your function, compares returns' },
      body: (L, exam) => {
        const zh = L === 'zh';
        return q([
          fence + 'quiz',
          'type: function',
          exam ? 'exam: true' : null,
          'q: ' + (zh ? '写一个函数 add(a, b)，返回两数之和' : 'Write add(a, b) returning the sum'),
          'func: add',
          'starter: |',
          '  def add(a, b):',
          '      return 0',
          'cases: |',
          '  1, 2 -> 3',
          '  5, 7 -> 12',
          '  -1, 1 -> 0',
          'hint: ' + (zh ? '多个参数用逗号分隔' : 'Separate args with commas'),
          'explain: ' + (zh ? '直接 return a + b' : 'Just return a + b'),
          fence,
        ].filter(x => x !== null));
      },
    },
    {
      id: 'function-random', type: 'function', icon: '🎲',
      name: { zh: '随机结果题', en: 'Random result' },
      desc: { zh: '掷骰子这类：调 N 次，每次落在区间内', en: 'Dice-like: call N times, each within range' },
      body: (L, exam) => {
        const zh = L === 'zh';
        return q([
          fence + 'quiz',
          'type: function',
          exam ? 'exam: true' : null,
          'q: ' + (zh ? '写 roll_dice()，返回 1~6 的随机整数' : 'Write roll_dice() returning 1..6'),
          'func: roll_dice',
          'starter: |',
          '  import random',
          '',
          '  def roll_dice():',
          '      return 0',
          'cases: |',
          '  *30 -> 1..6',
          'hint: ' + (zh ? '用 random.randint(1, 6)' : 'Use random.randint(1, 6)'),
          'explain: ' + (zh
            ? '*30 表示调用 30 次；1..6 表示每次结果都要落在 1~6。只判范围挡不住 return 3，所以还会检查取值是否真的出现了多种。'
            : '*30 calls it 30 times; 1..6 means every result must land in 1..6. Range alone would let `return 3` pass, so distinct values are also checked.'),
          fence,
        ].filter(x => x !== null));
      },
    },
    {
      id: 'code', type: 'code', icon: '▶',
      name: { zh: '程序题', en: 'Code' },
      desc: { zh: '在浏览器里真跑，用 assert 判', en: 'Really runs in the browser, graded by assert' },
      body: (L, exam) => {
        const zh = L === 'zh';
        return q([
          fence + 'quiz',
          'type: code',
          exam ? 'exam: true' : null,
          'q: ' + (zh ? '打印 1 到 5，每行一个' : 'Print 1 to 5, one per line'),
          'starter: |',
          '  for i in range(1, 6):',
          '      print(i)',
          'tests: |',
          '  assert __out.count("1") == 1',
          '  assert "5" in __out',
          'hint: ' + (zh ? '__out 里是完整输出' : '__out holds the full output'),
          fence,
        ].filter(x => x !== null));
      },
    },
    {
      id: 'html', type: 'html', icon: '◧',
      name: { zh: 'HTML 题', en: 'HTML' },
      desc: { zh: '查 DOM 结构，不比源码字符串', en: 'Checks the DOM, not source text' },
      body: (L, exam) => {
        const zh = L === 'zh';
        return q([
          fence + 'quiz',
          'type: html',
          exam ? 'exam: true' : null,
          'q: ' + (zh ? '写一个含三项的无序列表' : 'Write an unordered list with three items'),
          'starter: |',
          '  <ul>',
          '    <li>第一项</li>',
          '  </ul>',
          'checks: |',
          '  document.querySelectorAll("li").length === 3',
          'html: |',
          '  <!DOCTYPE html>',
          '  <html><body></body></html>',
          'hint: ' + (zh ? '用 <ul> 和三个 <li>' : 'Use <ul> with three <li>'),
          fence,
        ].filter(x => x !== null));
      },
    },
    {
      id: 'css', type: 'css', icon: '◐',
      name: { zh: 'CSS 题', en: 'CSS' },
      desc: { zh: '查计算后的样式，写法不同也算对', en: 'Checks computed style; any equivalent syntax passes' },
      body: (L, exam) => {
        const zh = L === 'zh';
        return q([
          fence + 'quiz',
          'type: css',
          exam ? 'exam: true' : null,
          'q: ' + (zh ? '把 h1 的文字变成红色' : 'Make the h1 text red'),
          'starter: |',
          '  h1 {',
          '    color: black;',
          '  }',
          'checks: |',
          "  getComputedStyle(document.querySelector('h1')).color === 'rgb(255, 0, 0)'",
          'html: |',
          '  <!DOCTYPE html>',
          '  <html><head><style></style></head><body><h1>标题</h1></body></html>',
          'hint: ' + (zh
            ? 'red / #f00 / rgb(255,0,0) 都算对 —— 判的是计算后的值'
            : 'red, #f00 and rgb(255,0,0) all pass — computed value is compared'),
          fence,
        ].filter(x => x !== null));
      },
    },
    {
      id: 'js', type: 'js', icon: 'JS',
      name: { zh: 'JavaScript 题', en: 'JavaScript' },
      desc: { zh: '真跑 JS，或查 DOM 操作结果', en: 'Runs JS for real, or checks DOM results' },
      body: (L, exam) => {
        const zh = L === 'zh';
        return q([
          fence + 'quiz',
          'type: js',
          exam ? 'exam: true' : null,
          'q: ' + (zh ? '写 sum(a, b)，返回两数之和' : 'Write sum(a, b) returning the sum'),
          'func: sum',
          'starter: |',
          '  function sum(a, b) {',
          '    return 0;',
          '  }',
          'cases: |',
          '  1, 2 -> 3',
          '  10, 20 -> 30',
          'hint: ' + (zh ? '多个参数用逗号分隔' : 'Separate args with commas'),
          fence,
        ].filter(x => x !== null));
      },
    },
    {
      id: 'local', type: 'local', icon: '⌂',
      name: { zh: '本地运行题', en: 'Run locally' },
      desc: { zh: '浏览器跑不了（GUI 等），给清单自评', en: 'Cannot run in browser (GUI etc.), self-checked' },
      body: (L, exam) => {
        const zh = L === 'zh';
        return q([
          fence + 'quiz',
          'type: local',
          exam ? 'exam: true' : null,
          'q: ' + (zh ? '用 tkinter 做一个带按钮的窗口' : 'Build a tkinter window with a button'),
          'starter: |',
          '  import tkinter as tk',
          '',
          '  root = tk.Tk()',
          '  root.title("我的窗口")',
          '  root.mainloop()',
          'checklist: |',
          '  - ' + (zh ? '窗口能打开' : 'The window opens'),
          '  - ' + (zh ? '有一个按钮' : 'There is a button'),
          '  - ' + (zh ? '点按钮有反应' : 'Clicking the button does something'),
          'hint: ' + (zh ? '点「在 VS Code 里打开」跑' : 'Use "Open in VS Code" to run it'),
          fence,
        ].filter(x => x !== null));
      },
    },
    {
      id: 'project', type: 'project', icon: '★',
      name: { zh: '小项目', en: 'Project' },
      desc: { zh: '开放式，给初始代码 + 验收清单', en: 'Open-ended: starter code + checklist' },
      body: (L, exam) => {
        const zh = L === 'zh';
        return q([
          fence + 'quiz',
          'type: project',
          exam ? 'exam: true' : null,
          'q: ' + (zh ? '做一个通讯录：能增删改查，能存到文件' : 'Build a contacts app: CRUD + save to file'),
          'starter: |',
          '  contacts = {}',
          '',
          '  def add(name, phone):',
          '      contacts[name] = phone',
          'checklist: |',
          '  - ' + (zh ? '能添加联系人' : 'Can add a contact'),
          '  - ' + (zh ? '能按名字查' : 'Can look up by name'),
          '  - ' + (zh ? '退出后数据还在' : 'Data survives restart'),
          fence,
        ].filter(x => x !== null));
      },
    },
  ];

  /**
   * 插入到 textarea 的光标处。
   *
   * 用 execCommand('insertText') 而不是直接改 value：
   * 直接赋值会清掉浏览器的撤销栈，作者改错了按 Ctrl+Z 会撤销到很久之前，
   * 甚至把整篇课文搞没。execCommand 虽然被标记废弃，但仍是唯一能
   * 把插入记进原生 undo 历史的方法。
   */
  function insert(ta, text) {
    ta.focus();
    let ok = false;
    try { ok = document.execCommand('insertText', false, text); }
    catch (e) { ok = false; }
    if (!ok) {
      // 回退：手动拼，代价是丢 undo 历史
      const s = ta.selectionStart, e2 = ta.selectionEnd;
      const v = ta.value;
      ta.value = v.slice(0, s) + text + v.slice(e2);
      ta.selectionStart = ta.selectionEnd = s + text.length;
    }
    return true;
  }

  /** 插完把光标挪到第一个要填的地方（题干那行的末尾） */
  function placeCursor(ta, text) {
    const at = ta.value.lastIndexOf(text);
    if (at < 0) return;
    const rel = text.search(/^q: /m);
    const pos = rel >= 0 ? at + rel + 3 : at + text.length;
    ta.focus();
    ta.setSelectionRange(pos, pos);
  }

  /**
   * 给片段文本加上 exam 行。
   *
   * 自定义片段存的是原始 quiz 源（不带 exam），插入时按面板上的开关决定加不加。
   * 这样同一个片段既能当随堂练习，也能当本节测验。
   */
  function applyExam(src, exam) {
    if (!exam) return src;
    if (/^exam\s*:/m.test(src)) return src;
    const withExam = src.replace(/^type\s*:.*$/m, m => m + '\nexam: true');
    return withExam === src ? src.replace(/^```quiz\s*$/m, '```quiz\nexam: true') : withExam;
  }

  /** 从 quiz 源里认出题型（用于给片段标个类型标签） */
  function detectType(src) {
    const m = /^type\s*:\s*(.+)$/m.exec(src || '');
    return m ? m[1].trim() : (src.includes('```quiz') ? 'choice' : 'text');
  }

  /* ================= 自定义片段 ================= */
  /**
   * 作者自己的常用题。存在草稿私有仓库里（snippets.json），跨设备可用。
   *
   * 为什么存云端而不是 localStorage：和草稿一个道理 ——
   * 换台设备或清了浏览器数据就没了。
   *
   * 本地缓存是为了打开面板时能立刻显示，不用等网络。
   */
  const CUSTOM_KEY = 'pytut:devSnippets';
  let custom = null;

  function loadCustom() {
    if (custom) return custom;
    try { custom = JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]') || []; }
    catch (e) { custom = []; }
    return custom;
  }

  function saveCustom(list, sync) {
    custom = list || [];
    try { localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom)); } catch (e) {}
    if (sync) sync();                    // 由 dev.js 注入：推到云端
  }

  /** 去掉可能存在的 ```quiz 围栏，保证存的是纯净的字段区 */
  function stripFence(src) {
    return String(src || '').replace(/^\s*```quiz\s*\n?/, '').replace(/\n?```\s*$/, '').replace(/\s+$/, '');
  }

  /** 转成和内置片段一样的形状，好一起渲染 */
  function customAsSnips() {
    return loadCustom().map(c => ({
      id: 'custom-' + c.id,
      type: c.type || 'choice',
      icon: '✦',
      name: { zh: c.name, en: c.name },
      desc: { zh: c.desc || '', en: c.desc || '' },
      custom: true,
      // 存的时候剥掉了 ```quiz 围栏（只存内部字段），插回来时必须补上 ——
      // 不然插进去的是裸 YAML，渲染和解析都认不出这是道题。
      body: (L, exam) => '```quiz\n' + applyExam(stripFence(c.src || ''), exam) + '\n```',
    }));
  }

  return {
    list: () => SNIPS,
    insert, placeCursor,
    applyExam, detectType, stripFence,
    loadCustom, saveCustom, customAsSnips, CUSTOM_KEY,
  };
})();
