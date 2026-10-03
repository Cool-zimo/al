/** AnyLearn 界面文案 · 简体中文 */
window.I18N = {
  lang: 'zh',
  brand: 'AnyLearn',
  brandSub: '通学万义',

  gate: {
    toggleText: '怎么获取令牌？',
    steps: [
      '打开 <a href="https://github.com/settings/personal-access-tokens" target="_blank" rel="noopener">GitHub → Personal access tokens</a>',
      '选 <b>Fine-grained token</b>，只勾 <code>Contents: Read and write</code>',
      '有效期设 90 天，复制生成的令牌（只显示一次）'
    ],
    inputPlaceholder: '粘贴 GitHub 令牌（ghp_ 或 github_pat_ 开头）',
    submit: '登录',
    submitting: '验证中…',
    note: '🔒 令牌只存你自己的浏览器。本站无后端，无处可发。',
    errEmpty: '先粘贴令牌',
    err401: '令牌无效或已过期，请重新生成',
    errNetwork: '连不上 GitHub，检查网络后重试',
    errOther: '登录失败：'
  },

  topbar: { home: '回到书单', settings: '设置', sync: '同步' },

  sync: {
    off: '未连接', ok: '已同步', syncing: '同步中', err: '同步失败',
    connecting: '连接中', init: '已初始化', latest: '已是最新', pending: '待同步',
    invalid: 'token 失效', failed: '同步失败', retry: '同步重试失败'
  },

  home: {
    title: '通学万义',
    sub: '中文编程教程 · 浏览器内真跑代码 · 笔记与复习计划跨设备同步',
    statDone: '已完成课程',
    statDue: '今日待复习',
    statMem: '记忆中',
    start: '开始学习 →',
    building: '🚧 建设中'
  },
  homeThird: {
    allBooks: "全部教材",
    official: "官方教材",
    third: "第三方教材",
    badge: "第三方",
    searchPh: "搜索书（书名 / 作者 / 仓库）",
    searchAllPh: "搜索教材名与目录",
    searchAllBtn: "搜索",
    refresh: "刷新",
    thirdNote: "第三方书由社区作者提供，内容从原作者仓库直读。收录只代表格式合规。",
    more: "还有 {n} 本，向下滚动加载",
    allShown: "已全部显示",
    noMatch: "没有匹配的书",
    writeOne: "写一本你自己的教材",
    writeDesc: "在开发者平台里所见即所得地写，一键发布到你的 GitHub。",
    devPlatform: "开发者平台",
    browseMore: "浏览全部第三方书",
    refreshed: "刷新完成，新增 {n} 本",
    noNew: "刷新完成，暂无新书",
    howTo: "怎么写书（创作者帮助）",
  },


  toc: {
    all: '全部教程', review: '今日复习', chapterTest: '本章大测验',
    official: '官方教材', third: '第三方教材',
    thirdEmpty: '暂无第三方教材', thirdLoading: '加载中…',
    thirdMore: '加载更多', thirdAll: '已全部加载',
  },

  lesson: {
    done: '✅ 已完成这一节', undone: '⭕ 学完这一节？', markDone: '标记完成', unmark: '取消标记',
    nextReview: '下次复习',
    needQuiz: '⭕ 通过本节测试，才算学完这一节',
    goQuiz: (n) => `去做本节测试（${n} 题）→`,
    quizAgain: '再做一次测试'
  },
  lq: {
    title: '本节测试',
    back: '回到课文',
    passed: '🎉 全部通过 —— 这一节算学完了',
    notPassed: '还有题没通过，再看看课文里的例子',
    noQuiz: '这一节还没有配测试题',
    noQuizHint: '课文里的练习题是边读边做的，不算正式测验。',
    inlineTitle: '本节测验',
    inlineHint: n => `做完下面 ${n} 题，才算学完这一节。`,
    inlineGo: n => `去做本节测试（${n} 题）→`
  },

  notes: {
    title: '📝 本节笔记', edit: '编辑', preview: '预览', clear: '清空', syncNow: '立即同步',
    placeholder: '读完写下你的理解、踩过的坑、想改写的代码…\n\n支持 Markdown。自动保存到你的私有仓库，换设备也能接着看。',
    saved: '未同步', syncing: '同步中…', cleared: '已清空，待同步',
    confirmClear: '清空这一节的笔记？此操作会同步到你的私有仓库。',
    emptyPreview: '_（还没有笔记）_',
    noLesson: '_（选一节课，就能为它单独记笔记）_'
  },

  quiz: { choice: '选择题', fill: '填空题', code: '程序题', project: '小项目', submit: '提交', run: '▶ 运行并检查', running: '检查中…', hint: '提示', reset: '还原初始代码', done: '我完成了', finished: '已完成 ✅', passed: '已通过', retry: '再试一次', right: '对了。', wrong: '再看看。', pickFirst: '先选一个答案', todoTip: '初始代码里的 TODO 就是你要动手的地方 —— 把它改成真正的代码再运行。', todoLeft: '你还没改初始代码里的 TODO —— 现在跑的是占位代码，当然过不了。往下看题面，把 TODO 那行换成真正的代码。', remain: (n) => `还有 ${n} 项没勾，先自己验收一遍`, noHint: '再读一遍上面的示例代码，注意函数要用 return 把结果返回出去。', refAnswer: '参考答案：' ,
    verify: '▶ 检查能不能跑通',
    noBug: '代码能跑通，没有报错',
    hasBug: '代码跑不通，先修一下：',
    noCodeOk: '没填代码也没关系 —— 项目可以在你自己的编辑器里完成',
    verifyFirst: '先点「检查能不能跑通」，确认没报错再提交',
    projectPlaceholder: '把你的代码贴在这里（可选）。贴了就必须能跑通，没贴也能提交 —— 项目可以在 VSCode 里完成。',
    projectNote: '小项目不判功能对不对（那太主观了），只要求：代码跑得通 + 你自己对照上面的清单验收。',
    local: '本机运行题',
    html: 'HTML 题', css: 'CSS 题', js: 'JavaScript 题',
    preview: '实时预览',
    noCheck: '这道题没有配置检查项 —— 题目数据有问题',
    localWhyTitle: '为什么要在本机跑：',
    localWhy: 'tkinter / pygame / Qt 这类库需要真实的窗口系统。浏览器沙箱里既没有显示器，也没有 GUI 后端，在线运行必然失败 —— 不是代码写错了，是环境不支持。所以这类题改为：把代码带回 VS Code，在本机跑，自己按清单验收。',
    localOpen: '在 VS Code 里打开',
    localOpened: '已复制 ✓',
    localDownloaded: '.py 已下载',
    localCheck: '在本机跑通后，按上面的清单自评'
  },

  review: {
    title: '🔁 今日复习',
    sub: '按艾宾浩斯曲线安排：1 天 → 2 天 → 4 天 → 7 天 → 15 天 → 30 天 → 60 天 → 毕业',
    dueTitle: (n) => `该复习了（${n}）`,
    upcoming: '未来 7 天',
    empty: '<b>今天没有需要复习的内容</b>',
    emptyDesc: '要么你还没开始学新章节，要么之前的复习计划还没到期。<br>去学一节新课，它会在 1 天后回到这里。',
    go: '去复习 →',
    graduated: '已毕业 🎓',
    dueNow: '现在就该复习',
    laterToday: '今天晚些时候',
    daysAfter: (n) => `${n} 天后`,
    stage: (n, d) => `第 ${n} 轮 · ${d} 天后`
  },

  guardian: {
    dailyTitle: '今天学得够多了',
    breakTitle: '该休息一下了',
    dailyMsg: (t) => `你今天已经学了 <b>${t}</b>。<br>一次灌太多，能记住的比例反而会掉 —— 这不是鸡汤，是艾宾浩斯用实验量出来的。`,
    breakMsg: (c, d) => `你已经连续学了 <b>${c}</b>。<br>站起来走两分钟，看看远处，让眼睛和脑子都缓一缓。<br><span class="dim">今天累计：${d}</span>`,
    restHint: '休息不是浪费时间。记忆的巩固发生在你<b>不学习的时候</b> —— 大脑需要空档来整理刚才接收的东西。',
    takeBreak: '好，休息 10 分钟',
    continueAnyway: '我知道了，再学一会儿',
    breakToast: '10 分钟后再继续 ✨',
    fmt: (m) => m >= 60 ? `${Math.floor(m/60)} 小时 ${m%60} 分` : `${m} 分钟`
  },

  settings: {
    title: '设置',
    todayTime: '今日学习时长',
    learned: (t, b) => `已学 <b>${t}</b>　·　今天被打断 <b>${b}</b> 次`,
    tokenTitle: '1. 生成一个 token',
    tokenStep: '2. 粘贴到下面',
    save: '保存并连接',
    saving: '连接中…',
    disconnect: '断开连接（保留本地笔记）',
    warn: 'token 只保存在你自己的浏览器，不会上传到本仓库以外的任何地方。',
    account: (o) => `账号：<code>${o}</code>　笔记仓库：`,
    exportTitle: '导出全部笔记',
    exportBtn: '下载我的笔记（Markdown）',
    shelfUsage: (n, kb) => `已缓存 ${n} 章（约 ${kb} KB）`,
    srcTitle: "第三方书内容源",
    srcDesc: "raw.githubusercontent.com 在国内常常连不上。自动模式会依次尝试各个源，并记住上次成功的那个。",
    srcAuto: "自动（记住上次成功的）",
    srcAutoDesc: "依次尝试各源，成功一次就记住",
    srcProbe: "测一下",
    srcProbing: "测试中…",
    srcProbeOk: (n) => `可用 · ${n}ms`,
    srcProbeFail: (e) => `不可用：${e}`,
    srcSaved: "镜像已保存",
    shelfTitle: "第三方书籍缓存",
    shelfDesc: "看第三方书时按章缓存：看第几章就下第几章，不整本下。默认只存在当前标签页，关掉浏览器就清掉。",
    shelfPersist: "存到浏览器本地（关掉标签页也保留，可离线阅读）",
    shelfClear: "清空缓存",
    shelfPersistOn: "以后缓存会保留在浏览器本地",
    shelfPersistOff: "已改为只存在当前标签页，关掉即清空",
    shelfClearConfirm: "清空所有第三方书籍缓存？下次看需要重新下载。",
    shelfCleared: "缓存已清空",
    connected: '已连接，笔记与复习计划将自动同步',
    disconnected: '已断开'
  },

  toast: {
    loadFail: '目录加载失败',
    noContent: '这本书还没有内容',
    chapterPass: '🎉 本章大测验全部通过',
    addedReview: '已加入复习计划，1 天后回来考你 🔁',
    needLogin: '还没有连接 GitHub',
    syncOk: '已同步',
    syncFail: '同步失败，点右上角检查 token',
    connectFail: '连接失败：',
    invalidToken: 'token 无效或已过期',
    exportOk: '已导出'
  },
  codeblock: { edit:'编辑', run:'▶ 运行', copy:'复制', reset:'还原', done:'完成', copied:'已复制', vscodeTip:'用 VS Code 打开这段代码（源码已复制 + .py 已下载）', vscodeDone:'已复制 ✓', lab:'实验室', labTip:'在代码实验室里打开这段代码', running:'运行中…', copyFail:'复制失败，请手动选择' },
  logout: '退出登录',
  confirmLogout: '退出登录？本地笔记会保留。',
  prevLabel: '上一节',
  nextLabel: '下一节',
  loading: '加载中…',
  loadFailTitle: '加载失败',

  ide: {
    run: '运行',
    runTip: '运行当前文件（Ctrl / Cmd + Enter）',
    running: '⏳ 运行中…',
    done: '运行完毕',
    editor: '编辑器',
    term: '终端',
    explorer: '资源管理器',
    clear: '清空',
    close: '关闭实验室（Esc）',
    newFile: '新建',
    newFilePrompt: '文件名（以 .py 结尾）：',
    save: '保存',
    saveAs: '示例是只读的，另存为我的文件：',
    saved: '已保存',
    created: '已创建',
    exists: '同名文件已存在',
    delete: '删除',
    confirmDelete: '确认删除',
    cannotDelete: '本课示例不能删除，可以先"另存为"再改',
    groupLesson: '本课示例',
    groupMine: '我的代码',
    noFiles: '还没有自己的文件',
    noExamples: '本节课没有示例代码',
    noFile: '未打开文件',
    readonly: '只读 · 点"保存"可另存为我的文件',
    kernel: '本地内核',
    engineLocal: '本地内核',
    engineCE: 'Compiler Explorer',
    engineTip: '点一下切换运行引擎',
    switchedLocal: '已切到本地内核（Pyodide，断网可用）',
    switchedCE: '已切到 Compiler Explorer（真机环境，需联网）',
    loadingCE: '正在加载 Compiler Explorer…',
    ceFail: '嵌入失败（可能不允许被 iframe 嵌套），已自动切回本地内核',
    ceTip: '在新标签页用 Compiler Explorer 打开（Python 3.12 真实环境）',
    ceToast: '已在 Compiler Explorer 打开',
    welcome: '提示：Ctrl / Cmd + Enter 直接运行，Ctrl / Cmd + S 保存。',
    opened: '已在实验室里打开'
  },

  exam: {
    pos: (n, t) => `第 ${n} 题 / 共 ${t} 题`,
    score: (r, d) => `答对 ${r}　已答 ${d}`,
    prev: '← 上一题',
    next: '下一题 →',
    finish: '交卷，看成绩',
    kindChoice: '选择题',
    kindFill: '填空题',
    kindFunction: '算法题 · 写函数',
    kindCode: '程序题',
    kindProject: '小项目',
    kindConcept: '概念',
    kindAlgorithm: '算法',
    kindProjectName: '项目',
    grade: {
      excellent: '优秀 —— 这一章是真的会了',
      good: '良好 —— 主体掌握，个别点再看看',
      pass: '及格 —— 建议把错题重做一遍',
      again: '还差一点 —— 别急，回去再看一遍课文'
    },
    wrongTitle: (n) => `还有 ${n} 题没通过`,
    wrongTip: '这些题会自动进入你的复习计划，明天再来考你一次。',
    allOk: '🎊 全部通过 —— 这一章可以毕业了',
    retryWrong: '重做一遍',
    back: '回到书单'
  },

  vscode: {
    copied: '代码已复制到剪贴板',
    copyFail: '复制失败，请手动选中代码复制',
    downloaded: '，.py 文件已下载'
  },

  perm: {
    none: '未连接',
    fineTitle: 'Fine-grained token ✓',
    fineDesc: '权限范围由你在 GitHub 上勾选的仓库决定，站点碰不到范围外的东西。这是推荐用法。',
    wideTitle: '⚠️ 这个 token 的权限偏大',
    wideDesc: '本站只需要一个仓库的 Contents 读写权限。建议换成只授权单个仓库的 Fine-grained token。',
    regen: '去重新生成',
    okTitle: 'Classic token',
    okDesc: '当前权限范围如下。若想更稳妥，可换成只授权单个仓库的 Fine-grained token。',
    unknown: '无法读取权限范围',
    fail: '权限检查失败'
  },

  quota: {
    side: '今日新课额度',
    remain: (n) => `还能学 ${n} 节`,
    usedUp: '今天的额度用完了',
    capNote: (n) => `每天 ${n} 节`,
    title: '🫗 今天的额度用完了',
    msg: (bookTitle, level, cap) =>
      `《${bookTitle}》属于<b>${level}</b>难度，每天建议最多 <b>${cap}</b> 节新课。<br>今天已经学满了。`,
    hint: '这不是限制你，是替你踩刹车。新知识要靠睡眠来固化 —— 今天再灌进去的，明天大概率还回来。把已经学过的复习一遍，收益比开新课高得多。',
    goReview: '去复习已学的 →',
    continueAnyway: '我知道了，还是要继续'
  },
  bookshelf: {
    syncing: "正在把这本书下载到本地…",
    done: "已下载到本地",
    failTitle: "这本书没能下载",
    failHint: "可能是仓库已删除，或你的 token 没有读取权限。"
  }
};
