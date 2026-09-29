# Chapter 3 · Version Control · Final Test

> 8 questions. This chapter asks: how do you change code with others, preserve history, and keep things from going wrong?
> **You must answer all correctly to pass this chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: What are git's three areas, in order?
options:
- Repository → Staging Area → Working Directory
- Working Directory → Staging Area → Repository
- Staging Area → Working Directory → Repository
- Working Directory → Repository → Staging Area
answer: 1
explain: The working directory holds the files you are editing on disk; git add moves them to the staging area; git commit moves them into the repository (version history). Understanding this flow answers "why didn't my change get committed?"
```

```quiz
type: choice
q: Which statement about commit granularity is correct?
options:
- Commits should be as coarse as possible to reduce their number
- One commit should do exactly one independently describable thing, so it can be reviewed and reverted on its own
- Every commit should contain changes to at least 10 files
- As long as a commit message is written, the content does not matter
answer: 1
explain: Fine-grained commits make every change a reversible, reviewable unit. Commits that are too coarse make it impossible to revert a single change, destroying the value of version control.
```

```quiz
type: choice
q: Which Conventional Commits format is correct?
options:
- Any text is fine; format does not matter
- <type>(<scope>): <subject>, with the body explaining why rather than what
- type: subject is enough; scope and body are unnecessary
- The title should run to 200 characters with every detail packed in
answer: 1
explain: The standard format is type(scope): subject, where scope may be omitted. The subject uses the imperative mood and stays under 72 characters; the body explains why the change was made without duplicating the diff.
```

```quiz
type: choice
q: When should you use rebase rather than merge?
options:
- Always use rebase for a cleaner history
- Use rebase to tidy history on a local, unpushed branch; use merge for an already-pushed public branch
- Rebase is safer for branches that have already been pushed
- Merge and rebase are completely equivalent, so either is fine
answer: 1
explain: Rebase rewrites commit history (changing commit hashes) and suits only local unpushed commits. Using rebase on an already-pushed public branch corrupts collaborators' history, so merge is required.
```

```quiz
type: choice
q: You accidentally committed .env to a Git repository. What should you do?
options:
- git rm .env followed by another commit is enough
- Rotate every secret immediately, rewrite history with git filter-repo and force-push, then ask collaborators to re-clone
- Renaming .env to .env.bak is sufficient
- Deleting that branch makes it safe
answer: 1
explain: Deleting only the current commit still leaves the old versions in history. You must rewrite the entire history and force-push, then ask every collaborator to re-clone. Public-repository history cannot be trusted; rotating secrets is the only reliable止损 measure.
```

## Part 2 · Hands-on Exercises

```quiz
type: function
q: Implement `plan_merge(base_commits, branch_commits, strategy)`, which models a merge plan. `base_commits` is the number of commits on main, `branch_commits` the number of commits on the branch. When strategy is "merge", return {"commits": base_commits + branch_commits + 1, "note": "preserves forked history"}; when strategy is "rebase", return {"commits": base_commits + branch_commits, "note": "linear history, commit hashes rewritten"}. Any other strategy returns None.
func: plan_merge
starter: |
  def plan_merge(base_commits, branch_commits, strategy):
      # Fill in here
      return None
cases: |
  (10, 3, "merge") -> {"commits": 14, "note": "preserves forked history"}
  (10, 3, "rebase") -> {"commits": 13, "note": "linear history, commit hashes rewritten"}
  (5, 2, "squash") -> None
hint: merge adds one extra merge commit (+1); rebase creates no merge commit; any other strategy returns None.
explain: This is a simplified model of merge-strategy choice: merge preserves the fork and adds a merge commit, while rebase replays commits into a linear history.
```

```quiz
type: function
q: Implement `review_summary(comments)`, which summarises a set of review comments. `comments` is a list of strings; each may carry a prefix — blocking:/must: (blocking), nit: (nitpick), question: (question), and no prefix means suggestion. Return a dict: {"total": count, "blocking": count, "nit": count, "question": count, "suggestion": count, "needs_work": bool (true if there is at least one blocking comment)}.
func: review_summary
starter: |
  def review_summary(comments):
      result = {
          "total": 0,
          "blocking": 0,
          "nit": 0,
          "question": 0,
          "suggestion": 0,
          "needs_work": False,
      }
      # Fill in here
      result["needs_work"] = result["blocking"] > 0
      return result
cases: |
  (["blocking: missing validation", "nit: naming", "plain suggestion", "MUST: fix SQL injection"]) -> {"total": 4, "blocking": 2, "nit": 1, "question": 0, "suggestion": 1, "needs_work": True}
  (["question: why this approach", "nit: whitespace"]) -> {"total": 2, "blocking": 0, "nit": 1, "question": 1, "suggestion": 0, "needs_work": False}
  ([]) -> {"total": 0, "blocking": 0, "nit": 0, "question": 0, "suggestion": 0, "needs_work": False}
hint: Lowercase first, then use startswith to detect prefixes (both blocking and must count as blocking), tally each category, then set needs_work at the end.
explain: Review systems commonly use this kind of summary to decide whether a PR may be merged: a single blocking comment prevents merging.
```

## Part 3 · Mini Project

```quiz
type: project
q: In your project, run through the full feature-branch workflow once: branch from main, make two meaningful commits, open a PR, and merge. The acceptance checklist follows.
checklist:
- Make sure the local main is up to date (git checkout main && git pull)
- Create a branch using a conventional name such as feature/xxx or fix/xxx
- On the branch, complete one complete small feature or fix, split into 2 independent commits (each doing exactly one thing)
- Write every commit message in Conventional Commits format: type(scope): subject
- Run a formatter (black or ruff) and the tests (pytest) locally before committing
- Push to the remote (git push -u origin <branch_name>)
- If this is a GitHub/GitLab project, open a Pull Request / Merge Request describing the change
- After merging, delete the branch, switch back to main, and pull to confirm it is current
starter: |
  # Reference command order
  git checkout main
  git pull
  git checkout -b feature/your-feature
  # ... edit code ...
  git add <specific files>
  git commit -m "feat(scope): what changed"
  # ... edit more ...
  git add <specific files>
  git commit -m "test(scope): add tests"
  black . && pytest
  git push -u origin feature/your-feature
```
