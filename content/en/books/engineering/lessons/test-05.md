# Chapter 5 Quiz · Delivery and Maintenance

> This chapter covers semantic versioning, packaging and publishing, containers, and documentation. Eight questions total: five multiple choice, two hands-on, and one small project.

## Part 1 · Multiple choice

```quiz
type: choice
q: In the semantic version MAJOR.MINOR.PATCH, when does each segment go up?
options:
- MAJOR is a backward-compatible feature addition; MINOR is a bug fix; PATCH is a breaking change.
- MAJOR means an incompatible API change; MINOR means a backward-compatible feature addition; PATCH means a backward-compatible bug fix.
- The three have no fixed meaning; bump them however you like.
- MAJOR only goes up when the codebase doubles in size; MINOR and PATCH are arbitrary.
answer: 1
explain: SemVer: MAJOR = incompatible change (remove a function, change a parameter), MINOR = backward-compatible feature, PATCH = backward-compatible bug fix. The version is a contract with your users.
```

```quiz
type: choice
q: Which statement about packaging and publishing is correct?
options:
- A Python project only needs to zip its .py files and send them around; no metadata required.
- Modern Python packaging uses pyproject.toml for project metadata (name, version, dependencies, entry points), a build backend to produce distribution artifacts, and twine or a build tool to upload them.
- setup.py is the only correct packaging method, forever.
- Packaging breaks the code; you should always run source directly.
answer: 1
explain: pyproject.toml is the standard config file defined by PEP 517/518, describing metadata and the build system; setuptools/poetry/hatch are common backends; the resulting artifacts are uploaded to PyPI via a build tool or twine.
```

```quiz
type: choice
q: What is the relationship between a Docker image and a container?
options:
- They are completely independent and unrelated concepts.
- An image is a read-only static template; a container is a running instance of that image, and one image can start many containers.
- A container is a static file and an image is the running process.
- There can be only one image; containers are infinite in number but cannot be removed.
answer: 1
explain: Image = template (read-only, distributable); container = an instance (a running process). One image can start many containers, and a stopped container's changes are not kept by default.
```

```quiz
type: choice
q: Which statement about "secrets must not enter the image" is correct?
options:
- Writing a secret into a Dockerfile and then RUN rm-ing it is fine.
- Once a secret is COPY-ed or written into an image layer, it stays in that read-only layer and can be recovered; the fix is .dockerignore plus runtime injection through environment variables or a secret manager.
- Only the maintainer can pull the image, so putting secrets in it does not matter.
- As long as the README mentions the secret, it is acceptable.
answer: 1
explain: Image layers are read-only, so deleting a secret does not erase it from earlier layers. .dockerignore prevents accidental copies; runtime injection or a Secret manager is the safe route. Any leak requires rotating the secret.
```

```quiz
type: choice
q: Which statement about READMEs and CHANGELOGs is correct?
options:
- The README only needs the project name; nothing else matters, and the CHANGELOG is just the git log copy-pasted.
- The README must let users copy and paste commands into a working state (install, use, configure, contribute, license); the CHANGELOG is a user-facing, reverse-order record of changes per version.
- The README is for machines and the CHANGELOG is for humans.
- Neither matters as long as the code runs.
answer: 1
explain: The README is the project's front door and usage guide; the CHANGELOG is for users, documenting each version's changes and helping them judge an upgrade's impact. It is not the git log.
```

## Part 2 · Hands-on

```quiz
type: local
q: Write a Dockerfile and a .dockerignore for a fictional Python project. Requirements: pin the base image (python:3.11-slim), copy requirements.txt and install dependencies before copying the source, use exec form for CMD, and expose port 8000. The .dockerignore must exclude at least .git, .env, __pycache__, and .venv. After writing, build with docker build and start it with docker run --rm to verify it runs. Submit both files and the build/run log.
hint: Use the Dockerfile template from lesson 23; tag the build so it is easy to reference.
explain: A hands-on exercise in the two core container files, validating secret isolation and the build flow.
checklist:
- The Dockerfile specifies a base image (e.g. python:3.12-slim).
- The dependency file is copied and installed before the source (taking advantage of Docker layer caching).
- .env or any secret is never COPY-ed into the image.
- A .dockerignore is present, excluding __pycache__ / .git / .env.
- WORKDIR is used instead of working from the root directory.
```

```quiz
type: function
q: Implement check_changelog(text), which validates a CHANGELOG's format. Rules: ① it must start with a top-level heading (Changelog or 变更记录) beginning with "#"; ② it must contain at least one version block starting with "## [" (e.g. "## [1.3.0]"), and the version must match x.y.z (x/y/z are digits and may have leading zeros but must be digits); ③ it must contain at least one category label (Added / Changed / Fixed / Removed). Return a dict: {"valid": bool, "issues": list}. issues may contain "missing_title" (no top-level heading), "no_version" (no version block or wrong format), "no_category" (no category label). Fully valid returns {"valid": True, "issues": []}.
func: check_changelog
starter: |
  def check_changelog(text):
      # fill in here
      return {"valid": True, "issues": []}
cases: |
  "# Changelog\n\n## [1.3.0]\n### Added\n- new feature" -> {"valid": True, "issues": []}
  "## [1.3.0]\n### Fixed\n- fixed a bug" -> {"valid": False, "issues": ["missing_title"]}
  "# Changelog\n### Added\n- new feature" -> {"valid": False, "issues": ["no_version"]}
  "# Changelog\n## [1.3.0]" -> {"valid": False, "issues": ["no_category"]}
  "just some text" -> {"valid": False, "issues": ["missing_title", "no_version", "no_category"]}
hint: Split by line; use the regex r"^## \[(\d+)\.(\d+)\.(\d+)\]" for version blocks; the title is a line starting with "# "; categories are lines starting with "### " whose following word is in the set. When valid is True, issues must be empty.
explain: Validating a CHANGELOG format automatically is a common CI gate in release pipelines and an executable understanding of this chapter's conventions.
```

## Part 3 · Small project

```quiz
type: project
q: Take a real "script that runs" (a CSV-statistics script, or any small tool you already have) and turn it into a deliverable. Requirements: ① add unit tests (pytest) covering the core logic; ② add GitHub Actions / GitLab CI to run the tests automatically; ③ write a complete README (install, use, configure, contribute) and a CHANGELOG; ④ version it with SemVer and update the version field in pyproject.toml; ⑤ add .gitignore and confirm .env/secrets never enter version control; ⑥ (bonus) write a Dockerfile and verify it runs. Submit the project file listing + CI log + run screenshot.
checklist:
- Runnable pytest tests covering the core logic.
- A CI configuration that triggers and passes on push.
- A README with installation, usage, configuration, and contribution sections.
- A CHANGELOG recording changes in reverse version order.
- pyproject.toml with a correct version field.
- .gitignore configured, with sensitive files excluded.
- (bonus) A Dockerfile that builds and runs.
hint: Follow lesson 25's改造 order: control risk first, then add quality, then add deliverables. Change one category at a time.
explain: A combined application of every topic in chapter 5, closing the loop from script to deliverable.
```
