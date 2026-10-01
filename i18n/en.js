/** AnyLearn UI strings · English */
window.I18N = {
  lang: 'en',
  brand: 'AnyLearn',
  brandSub: 'Learn Anything',

  gate: {
    toggleText: 'How do I get a token?',
    steps: [
      'Open <a href="https://github.com/settings/personal-access-tokens" target="_blank" rel="noopener">GitHub → Personal access tokens</a>',
      'Choose <b>Fine-grained token</b>, grant only <code>Contents: Read and write</code>',
      'Set a 90-day expiry, copy the token (shown once)'
    ],
    inputPlaceholder: 'Paste your GitHub token (ghp_ or github_pat_)',
    submit: 'Sign in',
    submitting: 'Verifying…',
    note: '🔒 The token stays in your browser. No backend, nowhere to send it.',
    errEmpty: 'Paste your token first',
    err401: 'Token is invalid or expired — generate a new one',
    errNetwork: 'Cannot reach GitHub — check your connection',
    errOther: 'Sign-in failed: '
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

  lesson: {
    done: '✅ Lesson complete', undone: '⭕ Finished this lesson?', markDone: 'Mark done', unmark: 'Undo',
    nextReview: 'Next review',
    needQuiz: '⭕ Pass the quiz to complete this lesson',
    goQuiz: (n) => `Take the quiz (${n}) →`,
    quizAgain: 'Retake quiz'
  },
  lq: {
    title: 'Lesson quiz',
    back: 'Back to lesson',
    passed: '🎉 All passed — this lesson is complete',
    notPassed: 'Some questions still failing — revisit the examples above',
    noQuiz: 'No quiz has been set for this lesson yet',
    noQuizHint: 'The exercises inside the lesson are for practising as you read — they do not count as the quiz.',
    inlineTitle: 'Lesson quiz',
    inlineHint: n => `Answer these ${n} question${n > 1 ? 's' : ''} to complete the lesson.`,
    inlineGo: n => `Take the quiz (${n} question${n > 1 ? 's' : ''}) →`
  },

  notes: {
    title: '📝 Notes', edit: 'Edit', preview: 'Preview', clear: 'Clear', syncNow: 'Sync now',
    placeholder: 'Write down what you understood, the traps you hit, the code you want to rewrite…\n\nMarkdown supported. Auto-saved to your private repo, readable on any device.',
    saved: 'Not synced', syncing: 'Syncing…', cleared: 'Cleared, pending sync',
    confirmClear: 'Clear the notes for this lesson? This syncs to your private repo.',
    emptyPreview: '_（No notes yet）_',
    noLesson: '_（Pick a lesson — each one gets its own note）_'
  },

  quiz: {
    choice: 'Multiple choice', fill: 'Fill in the blank', code: 'Coding', project: 'Mini project',
    submit: 'Submit', run: '▶ Run & check', running: 'Checking…', hint: 'Hint', reset: 'Reset code',
    done: 'I finished it', finished: 'Done ✅', passed: 'Passed', retry: 'Try again',
    right: 'Correct. ', wrong: 'Not quite. ', pickFirst: 'Pick an answer first', todoTip: 'The TODO in the starter code is what you need to fill in — replace it with real code before running.', todoLeft: 'You have not replaced the TODO in the starter code yet — you just ran the placeholder, so of course it failed. Read the task again and swap that TODO line for real code.',
    remain: (n) => `${n} item(s) still unchecked — review them yourself first`,
    noHint: 'Re-read the example above. Remember: a function must return its result.',
    refAnswer: 'Answer: '
  ,
    verify: '▶ Check it runs',
    noBug: 'Runs clean, no errors',
    hasBug: "It doesn't run yet — fix this first:",
    noCodeOk: 'No code pasted is fine — you can build the project in your own editor',
    verifyFirst: 'Click "Check it runs" first to confirm there are no errors',
    projectPlaceholder: 'Paste your code here (optional). If you paste it, it must run clean; if not, you can still submit — build it in VS Code instead.',
    projectNote: 'Mini projects are not judged on functionality (too subjective). The bar is: it runs + you ticked the checklist above.',
    local: 'Run locally',
    html: 'HTML', css: 'CSS', js: 'JavaScript',
    preview: 'Live preview',
    noCheck: 'This question has no checks configured — the question data is broken',
    localWhyTitle: 'Why this must run on your machine: ',
    localWhy: 'tkinter, pygame and Qt all need a real windowing system. The browser sandbox has neither a display nor a GUI backend, so running them online always fails — not because your code is wrong, but because the environment cannot support it. So these exercises work differently: take the code back to VS Code, run it locally, and self-check against the list above.',
    localOpen: 'Open in VS Code',
    localOpened: 'Copied ✓',
    localDownloaded: '.py downloaded',
    localCheck: 'Run it locally, then self-check against the list above',
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
    shelfUsage: (n, kb) => `Cached ${n} chapters (~${kb} KB)`,
    shelfTitle: "Third-party book cache",
    shelfDesc: "Books are cached chapter by chapter — only the chapter you open gets downloaded. By default the cache lives in this tab and is cleared when you close it.",
    shelfPersist: "Keep in browser storage (survives closing the tab, enables offline reading)",
    shelfClear: "Clear cache",
    shelfPersistOn: "Cache will now persist in browser storage",
    shelfPersistOff: "Cache is tab-only again and will be cleared on close",
    shelfClearConfirm: "Clear all cached third-party book content? You'll need to re-download next time.",
    shelfCleared: "Cache cleared",
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
  codeblock: { edit:'Edit', run:'▶ Run', copy:'Copy', reset:'Reset', done:'Done', copied:'Copied', vscodeTip:'Open this code in VS Code (copied + .py downloaded)', vscodeDone:'Copied ✓', lab:'Lab', labTip:'Open this code in the code lab', running:'Running…', copyFail:'Copy failed — select manually' },
  logout: 'Sign out',
  confirmLogout: 'Sign out? Local notes are kept.',
  prevLabel: 'Previous',
  nextLabel: 'Next',
  loading: 'Loading…',
  loadFailTitle: 'Failed to load',

  ide: {
    run: 'Run',
    runTip: 'Run the current file (Ctrl / Cmd + Enter)',
    running: '⏳ Running…',
    done: 'Finished in',
    editor: 'Editor',
    term: 'Terminal',
    explorer: 'Explorer',
    clear: 'Clear',
    close: 'Close lab (Esc)',
    newFile: 'New',
    newFilePrompt: 'Filename (should end with .py):',
    save: 'Save',
    saveAs: 'Examples are read-only — save as your own file:',
    saved: 'Saved',
    created: 'Created',
    exists: 'A file with that name already exists',
    delete: 'Delete',
    confirmDelete: 'Delete',
    cannotDelete: 'Lesson examples cannot be deleted — use "Save" to copy it to your own files first',
    groupLesson: 'Lesson examples',
    groupMine: 'My files',
    noFiles: 'No files of your own yet',
    noExamples: 'No example code in this lesson',
    noFile: 'No file open',
    readonly: 'Read-only · use Save to copy it to your own files',
    kernel: 'Local kernel',
    engineLocal: 'Local kernel',
    engineCE: 'Compiler Explorer',
    engineTip: 'Click to switch the execution engine',
    switchedLocal: 'Switched to the local kernel (Pyodide, works offline)',
    switchedCE: 'Switched to Compiler Explorer (real CPython, needs network)',
    loadingCE: 'Loading Compiler Explorer…',
    ceFail: 'Embedding failed (iframe not allowed) — falling back to the local kernel',
    ceTip: 'Open in Compiler Explorer (real Python 3.12) in a new tab',
    ceToast: 'Opened in Compiler Explorer',
    welcome: 'Tip: Ctrl / Cmd + Enter runs the file, Ctrl / Cmd + S saves it.',
    opened: 'Opened in the lab'
  },

  exam: {
    pos: (n, t) => `Question ${n} of ${t}`,
    score: (r, d) => `${r} correct　${d} answered`,
    prev: '← Previous',
    next: 'Next →',
    finish: 'Submit & see score',
    kindChoice: 'Multiple choice',
    kindFill: 'Fill in the blank',
    kindFunction: 'Algorithm · write a function',
    kindCode: 'Coding',
    kindProject: 'Mini project',
    kindConcept: 'Concepts',
    kindAlgorithm: 'Algorithms',
    kindProjectName: 'Project',
    grade: {
      excellent: 'Excellent — you have really got this chapter',
      good: 'Good — mostly solid, a couple of points to revisit',
      pass: 'Pass — redo the ones you missed',
      again: 'Not yet — no rush, go back over the lesson'
    },
    wrongTitle: (n) => `${n} question(s) not passed yet`,
    wrongTip: 'These go into your review schedule automatically — you will be tested again tomorrow.',
    allOk: '🎊 All passed — this chapter is done',
    retryWrong: 'Try again',
    back: 'Back to library'
  },

  vscode: {
    copied: 'Code copied to clipboard',
    copyFail: 'Copy failed — please select the code manually',
    downloaded: ', .py file downloaded'
  },

  perm: {
    none: 'Not connected',
    fineTitle: 'Fine-grained token ✓',
    fineDesc: 'The scope is decided by which repository you ticked on GitHub — nothing outside it is reachable. This is the recommended setup.',
    wideTitle: '⚠️ This token is broader than needed',
    wideDesc: 'This site only needs Contents read/write on one repository. Switch to a fine-grained token limited to a single repo.',
    regen: 'Generate a new one',
    okTitle: 'Classic token',
    okDesc: 'Current scopes shown below. For tighter control, switch to a fine-grained token limited to one repository.',
    unknown: 'Could not read the scope',
    fail: 'Scope check failed'
  },

  quota: {
    side: 'New lessons today',
    remain: (n) => `${n} more available`,
    usedUp: 'Daily limit reached',
    capNote: (n) => `${n} per day`,
    title: '🫗 Daily limit reached',
    msg: (bookTitle, level, cap) =>
      `<b>${bookTitle}</b> is <b>${level}</b> level, which allows at most <b>${cap}</b> new lessons a day.<br>You have hit that today.`,
    hint: 'This is not a restriction — it is a brake on your behalf. New knowledge consolidates during sleep; anything you cram in now is likely gone by tomorrow. Reviewing what you already studied pays far better than opening something new.',
    goReview: 'Review what I learned →',
    continueAnyway: 'Got it, continuing anyway'
  },
  bookshelf: {
    syncing: "Downloading this book to your device…",
    done: "Saved locally",
    failTitle: "Could not download this book",
    failHint: "The repository may be gone, or your token lacks read access."
  }
};
