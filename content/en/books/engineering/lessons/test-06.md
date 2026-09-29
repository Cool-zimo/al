# Chapter 6 Quiz · The Final Gate Before Release

> This is the closing assessment for lessons 26 through 30, and a review of the book's full engineering foundation: environment, configuration, naming, lint, git, CI, versioning, and Docker. Completing it means the book is truly closed.

## Part 1 · Multiple choice

```quiz
type: choice
q: A program runs slowly. What should your first reaction be?
options:
- Immediately rewrite the list comprehension as a hand-rolled for loop.
- Run cProfile first to get real hotspot data, then decide where to optimize.
- Switch from Python to C++ and be done with it.
- Delete all the print calls; performance will improve on its own.
answer: 1
explain: The first rule of optimization is to measure. cProfile locates the real bottleneck; rewriting on instinct usually guesses the wrong target.
```

```quiz
type: choice
q: Which statement about production logs is correct?
options:
- More is always better; logging full request bodies makes debugging easier.
- Structured logs carry levels and context, and sensitive information (passwords, tokens) must be redacted.
- Mixing print and logging is fine; they do the same thing.
- Logging tokens makes auth debugging easier and carries no security risk.
answer: 1
explain: Production logs must be structured, contextual, and searchable; sensitive data in logs is a second leak and must be redacted.
```

```quiz
type: choice
q: Which of these defends against both SQL injection and command injection?
options:
- String concatenation plus manually replacing a single quote with two single quotes.
- SQL with parameterized queries (%s / ?), and subprocess calls as a list while avoiding shell=True.
- Frontend validation is enough; the backend can skip it.
- json.dumps the user input first and then concatenate it into SQL and shell commands.
answer: 1
explain: SQL injection is defeated by parameterized queries; command injection by passing arguments as a list to subprocess and avoiding shell=True. Both treat input as data rather than code.
```

```quiz
type: choice
q: A secret was accidentally committed to a Git repository. What is the correct response?
options:
- Just delete .env from the working tree and commit once.
- Clean the file from Git history and rotate (invalidate) the secret immediately; the old one is dead.
- Leave the secret in history; just do not add new ones.
- Change the secret's value but do not rotate it; the old value in history is still usable.
answer: 1
explain: Deleting the file alone does not erase it from history, forks, or CI caches. You must clean history and rotate the secret; old secrets are invalidated.
```

```quiz
type: choice
q: A web service keeps restarting immediately after deployment. What is the most likely cause?
options:
- The health-check endpoint is too lightweight and does not do a full-table scan.
- The restart policy is set to always, and the app crashes on startup because of a config error, entering an infinite restart loop.
- The image was not tagged, so rollback is impossible.
- The logs are not structured.
answer: 1
explain: restart: always will loop forever on an app that fails at startup; use on-failure / unless-stopped with backoff instead.
```

## Part 2 · Hands-on

```quiz
type: local
q: Run cProfile as a "checkup" on your project. Requirements: ① pick a script that actually runs (or write a 30-line script with a loop and function calls); ② run python -m cProfile -s tottime your_script.py; ③ record the top three functions by tottime; ④ decide whether the hotspot is the one you expected. Paste the conclusion and the cProfile output into the answer area.
hint: Run it in a VS Code terminal or command line; if the top function by tottime is one you did not expect, that is the point of "measure before optimizing."
checklist:
- Pick a real script that runs (not an empty file).
- Use cProfile to get function-level timings.
- Identify the three most time-consuming functions.
- Record a baseline before optimizing so you can compare after.
```

```quiz
type: local
q: Add structured logging and a request ID to your project. Requirements: ① use the logging module (not print) and emit one JSON object per line as structured logs; ② define a sensitive-field redaction function that replaces password/token/api_key/secret with "***"; ③ use contextvars.ContextVar to carry a request/job ID so it appears in every log line; ④ deliberately write one "bad" log line containing password=xxx and confirm the redacted output never shows the plaintext. Paste the before-and-after log output into the answer area.
hint: Use a logging.Filter to inject the ContextVar value into every record; the redaction function should accept a dict, return a new dict, and not mutate the original.
checklist:
- Uses logging rather than print.
- The log format includes timestamp, level, and message.
- Every request has a unique request_id visible in the logs.
- Passwords, tokens, and ID numbers never appear in the logs.
```

## Part 3 · Small project

```quiz
type: project
q: Take a small tool you actually have (a scraper, data processor, CLI, or automation script) and bring it to a "releasable" state, walking through every tool from lessons 1–30 and completing HEALTH.md as the self-checklist.
checklist:
- An isolated virtual environment with dependencies locked in requirements.txt or pyproject.toml.
- .gitignore excludes .env, __pycache__, .venv, and build artifacts.
- Configuration and secrets come only from environment variables; no hardcoded secrets in the project.
- black / ruff formatting and lint pass; naming is clear and functions have a single responsibility.
- Critical paths have pytest tests that run in a clean environment.
- CI (GitHub Actions or another provider) runs tests + lint automatically.
- Git history is clean with clear commit messages; significant changes are reviewed or self-reviewed with notes.
- The version follows SemVer and CHANGELOG.md records this change.
- pip-audit shows no high-severity vulnerabilities.
- Logging uses logging + structured format + redaction, with a job ID attached.
- A /health endpoint or equivalent readiness check exists (for a batch job, record a clear "finished / failed" terminal state).
- A Dockerfile or systemd config manages the process, with a restart policy.
- The previous version's build artifact (image tag or archive) is retained, and rollback steps are written down.
- Walk the project health checklist item by item and submit the checked HEALTH.md.
hint: Do not do everything at once. Follow "control risk → add quality → add deliverables," changing one category at a time and keeping the project runnable at each step. Lock behavior with tests before and after the refactor.
explain: This is the book's capstone project: combining isolated topics into one complete, deliverable artifact. HEALTH.md is the acceptance criterion — fully green means you pass.
```
