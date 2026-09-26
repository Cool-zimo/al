/** AnyLearn 界面文案 · 简体中文 */
window.I18N = {
  lang: 'zh',
  brand: 'AnyLearn',
  brandSub: '通学万义',

  gate: {
    tagline: '浏览器里真跑代码的编程教程 · 会记笔记 · 会安排复习',
    feats: ['代码现场运行', '艾宾浩斯复习', '跨设备同步', '节奏守护'],
    cardTitle: '用 GitHub 登录',
    cardDesc: '你的笔记、进度和复习计划都存在你自己的私有仓库里 —— 不经过任何第三方服务器。',
    stepTitle: '三步拿到令牌',
    steps: [
      '打开 <a href="https://github.com/settings/personal-access-tokens" target="_blank" rel="noopener">GitHub → Personal access tokens</a>',
      '选 <b>Fine-grained token</b>，只勾一个权限：<code>Contents: Read and write</code>',
      '有效期建议 90 天，生成后复制（只显示一次）'
    ],
    inputPlaceholder: 'github_pat_... 或 ghp_...',
    submit: '登录并开始学习',
    submitting: '正在验证…',
    note: '🔒 令牌只保存在你自己的浏览器里。本站是纯静态页面，没有后端，也无法把你的数据发到任何地方。',
    foot: '没有 GitHub 账号？<a href="https://github.com/signup" target="_blank" rel="noopener">免费注册一个</a>，一分钟就好。',
    errEmpty: '请先粘贴令牌',
    err401: '令牌无效或已过期，请重新生成',
    errNetwork: '连不上 GitHub，检查网络后重试',
    errOther: '登录失败：',
    switchLang: 'English →'
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

  toc: { all: '全部教程', review: '今日复习', chapterTest: '本章大测验' },

  lesson: { done: '✅ 已完成这一节', undone: '⭕ 学完这一节？', markDone: '标记完成', unmark: '取消标记', nextReview: '下次复习' },

  notes: {
    title: '📝 本节笔记', edit: '编辑', preview: '预览', clear: '清空', syncNow: '立即同步',
    placeholder: '读完写下你的理解、踩过的坑、想改写的代码…\n\n支持 Markdown。自动保存到你的私有仓库，换设备也能接着看。',
    saved: '未同步', syncing: '同步中…', cleared: '已清空，待同步',
    confirmClear: '清空这一节的笔记？此操作会同步到你的私有仓库。',
    emptyPreview: '_（还没有笔记）_'
  },

  quiz: { choice: '选择题', fill: '填空题', code: '程序题', project: '小项目', submit: '提交', run: '▶ 运行并检查', running: '检查中…', hint: '提示', reset: '还原初始代码', done: '我完成了', finished: '已完成 ✅', passed: '已通过', retry: '再试一次', right: '对了。', wrong: '再看看。', pickFirst: '先选一个答案', remain: (n) => `还有 ${n} 项没勾，先自己验收一遍`, noHint: '再读一遍上面的示例代码，注意函数要用 return 把结果返回出去。', refAnswer: '参考答案：' },

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
  codeblock: { edit:'编辑', run:'▶ 运行', copy:'复制', reset:'还原', done:'完成', copied:'已复制', running:'运行中…', copyFail:'复制失败，请手动选择' },
  logout: '退出登录',
  confirmLogout: '退出登录？本地笔记会保留。',
  prevLabel: '上一节',
  nextLabel: '下一节',
  loading: '加载中…',
  loadFailTitle: '加载失败'
};
