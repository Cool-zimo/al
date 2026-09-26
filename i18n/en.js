/** AnyLearn UI strings · English */
window.I18N = {
  lang: 'en',
  brand: 'AnyLearn',
  brandSub: 'Learn Anything',

  gate: {
    tagline: 'Programming tutorials that actually run in your browser · notes · spaced repetition',
    feats: ['Live code runner', 'Ebbinghaus review', 'Cross-device sync', 'Pace guardian'],
    cardTitle: 'Sign in with GitHub',
    cardDesc: 'Your notes, progress and review schedule live in your own private repo — no third-party server involved.',
    stepTitle: 'Get a token in 3 steps',
    steps: [
      'Open <a href="https://github.com/settings/personal-access-tokens" target="_blank" rel="noopener">GitHub → Personal access tokens</a>',
      'Choose <b>Fine-grained token</b>, grant exactly one permission: <code>Contents: Read and write</code>',
      'Set an expiry (90 days is fine), copy the token — it is shown only once'
    ],
    inputPlaceholder: 'github_pat_... or ghp_...',
    submit: 'Sign in and start learning',
    submitting: 'Verifying…',
    note: '🔒 The token stays in your own browser. This site is a static page with no backend — it has nowhere to send your data.',
    foot: 'No GitHub account yet? <a href="https://github.com/signup" target="_blank" rel="noopener">Create one for free</a> — takes a minute.',
    errEmpty: 'Please paste your token first',
    err401: 'Token is invalid or expired. Generate a new one.',
    errNetwork: 'Cannot reach GitHub. Check your connection and retry.',
    errOther: 'Sign-in failed: ',
    switchLang: '中文 →'
  },

  topbar: { home: 'Back to library', settings: 'Settings', sync: 'Sync' },

  sync: {
    off: 'Offline', ok: 'Synced', syncing: 'Syncing', err: 'Sync failed',
    connecting: 'Connecting', init: 'Initialised', latest: 'Up to date', pending: 'Pending',
    invalid: 'token expired', failed: 'Sync failed', retry: 'Retry failed'
  },

  home: {
    title: 'Learn Anything',
    sub: 'Programming tutorials · real code execution in the browser · notes and review schedule synced across devices',
    statDone: 'Lessons done',
    statDue: 'Due today',
    statMem: 'In memory',
    start: 'Start learning →',
    building: '🚧 Coming soon'
  },

  toc: { all: 'All tutorials', review: 'Review today', chapterTest: 'Chapter test' },

  lesson: { done: '✅ Completed', undone: '⭕ Finished this lesson?', markDone: 'Mark as done', unmark: 'Undo', nextReview: 'Next review' },

  notes: {
    title: '📝 Notes', edit: 'Edit', preview: 'Preview', clear: 'Clear', syncNow: 'Sync now',
    placeholder: 'Write down what you understood, the traps you hit, the code you want to rewrite…\n\nMarkdown supported. Auto-saved to your private repo, readable on any device.',
    saved: 'Not synced', syncing: 'Syncing…', cleared: 'Cleared, pending sync',
    confirmClear: 'Clear the notes for this lesson? This syncs to your private repo.',
    emptyPreview: '_（No notes yet）_'
  },

  quiz: {
    choice: 'Multiple choice', fill: 'Fill in the blank', code: 'Coding', project: 'Mini project',
    submit: 'Submit', run: '▶ Run & check', running: 'Checking…', hint: 'Hint', reset: 'Reset code',
    done: 'I finished it', finished: 'Done ✅', passed: 'Passed', retry: 'Try again',
    right: 'Correct. ', wrong: 'Not quite. ', pickFirst: 'Pick an answer first',
    remain: (n) => `${n} item(s) still unchecked — review them yourself first`,
    noHint: 'Re-read the example above. Remember: a function must return its result.',
    refAnswer: 'Answer: '
  },

  review: {
    title: '🔁 Review today',
    sub: 'Scheduled on the Ebbinghaus curve: 1d → 2d → 4d → 7d → 15d → 30d → 60d → graduated',
    dueTitle: (n) => `Due now (${n})`,
    upcoming: 'Next 7 days',
    empty: '<b>Nothing to review today</b>',
    emptyDesc: 'Either you have not started a new lesson yet, or your next review is not due.<br>Learn a new lesson and it comes back here in 1 day.',
    go: 'Review →',
    graduated: 'Graduated 🎓',
    dueNow: 'Due now',
    laterToday: 'Later today',
    daysAfter: (n) => `in ${n} days`,
    stage: (n, d) => `Round ${n} · in ${d}d`
  },

  guardian: {
    dailyTitle: 'You have studied enough today',
    breakTitle: 'Time for a break',
    dailyMsg: (t) => `You have studied <b>${t}</b> today.<br>Cramming too much at once actually lowers retention — that is not a pep talk, it is what Ebbinghaus measured.`,
    breakMsg: (c, d) => `You have been going for <b>${c}</b> straight.<br>Stand up, walk for two minutes, look at something far away.<br><span class="dim">Today's total: ${d}</span>`,
    restHint: 'Resting is not wasted time. Memory consolidates when you are <b>not</b> studying — the brain needs gaps to file things away.',
    takeBreak: 'OK, break for 10 minutes',
    continueAnyway: 'I hear you, let me continue',
    breakToast: 'Back in 10 minutes ✨',
    fmt: (m) => m >= 60 ? `${Math.floor(m/60)}h ${m%60}m` : `${m}m`
  },

  settings: {
    title: 'Settings',
    todayTime: 'Study time today',
    learned: (t, b) => `Studied <b>${t}</b> · interrupted <b>${b}</b> time(s) today`,
    tokenTitle: '1. Generate a token',
    tokenStep: '2. Paste it below',
    save: 'Save and connect',
    saving: 'Connecting…',
    disconnect: 'Disconnect (keep local notes)',
    warn: 'The token stays in your own browser and is never uploaded anywhere.',
    account: (o) => `Account: <code>${o}</code> 　Notes repo: `,
    exportTitle: 'Export all notes',
    exportBtn: 'Download my notes (Markdown)',
    connected: 'Connected — notes and review schedule will sync automatically',
    disconnected: 'Disconnected'
  },

  toast: {
    loadFail: 'Failed to load the catalogue',
    noContent: 'This book has no content yet',
    chapterPass: '🎉 Chapter test fully passed',
    addedReview: 'Added to your review schedule — it comes back in 1 day 🔁',
    needLogin: 'Not connected to GitHub',
    syncOk: 'Synced',
    syncFail: 'Sync failed — check your token in the top right',
    connectFail: 'Connection failed: ',
    invalidToken: 'token is invalid or expired',
    exportOk: 'Exported'
  },
  codeblock: { edit:'Edit', run:'▶ Run', copy:'Copy', reset:'Reset', done:'Done', copied:'Copied', running:'Running…', copyFail:'Copy failed — select manually' },
  logout: 'Sign out',
  confirmLogout: 'Sign out? Local notes are kept.',
  prevLabel: 'Previous',
  nextLabel: 'Next',
  loading: 'Loading…',
  loadFailTitle: 'Failed to load'
};
