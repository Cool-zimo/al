/**
 * 每日学习配额（按难度分区）
 *
 * 为什么要有这个：
 *   艾宾浩斯的核心结论之一是「分散学习 > 集中填鸭」。一天灌 10 节新课，
 *   当时看得懂，第二天忘掉七成 —— 因为新知识的固化需要睡眠参与。
 *   所以按难度给每天的新课数设上限，逼着节奏慢下来。
 *
 * 难度越大，每天能"消化"的新课越少：
 *   入门 3 节 / 复习 4 节 / 进阶 2 节 / 高级 1 节 / 实战 1 节
 *
 * 口径说明：
 *   只统计「当天新完成」的课（通过小测，或没小测时手动标记）。
 *   单纯点进去看不算 —— 看了不等于消化。
 *   复习旧课不计入，那本来就该多做。
 *
 * 达到上限后不硬阻断：学新内容不该被强制拦住，但会明确提醒
 *   "今天的额度用完了，去复习比学新的划算"。
 */
const Quota = (() => {
  const K = 'quota';

  /** 每日新课上限：键是 books.json 里的 level */
  const CAPS = {
    '入门': 3, 'Beginner': 3,
    '复习': 4, 'Refresher': 4,
    '进阶': 2, 'Intermediate': 2,
    '高级': 1, 'Advanced': 1,
    '实战': 1, 'Practice': 1
  };
  const DEFAULT_CAP = 2;

  function capOf(level) {
    return CAPS[level] ?? DEFAULT_CAP;
  }

  function today() { return new Date().toDateString(); }

  /** 当日记录：{ date, log: [{ key, level, at }] } */
  function state() {
    const t = today();
    let s = Store.get(K, null);
    if (!s || s.date !== t) {
      s = { date: t, log: [] };
      Store.set(K, s);
    }
    return s;
  }

  /**
   * 已用了多少额度
   * @param {string} level 难度
   * @param {object} [s] 可选，避免重复读
   */
  function used(level, s) {
    const st = s || state();
    return st.log.filter(x => x.level === level).length;
  }

  /** 剩余额度 */
  function left(level) {
    return Math.max(0, capOf(level) - used(level));
  }

  /** 是否已用完 */
  function exhausted(level) {
    return left(level) <= 0;
  }

  /**
   * 记一课完成
   * 同一节课当天重复完成不重复计数（重做小测不该消耗额度）
   * @returns {boolean} 是否是「新的一课」（true = 消耗了额度）
   */
  function consume(key, level) {
    const s = state();
    if (s.log.some(x => x.key === key)) return false;   // 这课今天已计过
    s.log.push({ key, level, at: new Date().toISOString() });
    Store.set(K, s);
    return true;
  }

  /** 撤销一课完成（取消标记时调用） */
  function release(key) {
    const s = state();
    const n = s.log.length;
    s.log = s.log.filter(x => x.key !== key);
    if (s.log.length !== n) Store.set(K, s);
  }

  /** 今天一共完成了几节新课（不分难度） */
  function totalToday() {
    return state().log.length;
  }

  return { capOf, used, left, exhausted, consume, release, totalToday, state, CAPS };
})();
