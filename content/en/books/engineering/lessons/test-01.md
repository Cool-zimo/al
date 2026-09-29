# Chapter 1 · Environment and Dependencies · Final Test

> 8 questions. This chapter asks: where does the project run, what does it need, and how do you manage it?
> **You must answer all correctly to pass this chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: Which statement about virtual environments and system Python is correct?
options:
- A virtual environment is a full copy of system Python; the two are completely independent
- A virtual environment reuses the system Python interpreter but has its own package directory, avoiding pollution of the system
- A virtual environment must be pip installed inside system Python to work
- System Python breaking cannot affect the virtual environment, so installing packages into the system is harmless
answer: 1
explain: A virtual environment is created using the system Python executable, but its site-packages is independent — packages install into the environment's own directory. It is isolated from the system but is not a complete separate copy.
```

```quiz
type: choice
q: Why should you not commit a .env file to a Git repository?
options:
- The .env file is too large and slows down cloning
- .env usually contains secrets and sensitive configuration; committing it counts as a leak and it remains in Git history
- .env is a binary file that Git does not support
- .env can only be read on Windows
answer: 1
explain: .env holds API keys, database passwords, and other sensitive information. Once committed, anyone with access to the repository can read it, and removing the file does not erase it from history.
```

```quiz
type: choice
q: What is the main difference between requirements.txt and pyproject.toml?
options:
- They are fully equivalent, only the extension differs
- requirements.txt is primarily an installation list, while pyproject.toml also describes project metadata (name, version, author, etc.)
- pyproject.toml can only be read by poetry; pip does not support it
- requirements.txt can hold author and licence information
answer: 1
explain: requirements.txt focuses on declaring dependencies for pip to install; pyproject.toml is the PEP 621 project description, covering dependencies, project name, version, author, and licence.
```

```quiz
type: choice
q: Which statement about the output of pip freeze is correct?
options:
- pip freeze outputs only the packages you installed directly with pip install
- pip freeze outputs every package in the current environment with its exact version, including transitive dependencies
- pip freeze automatically omits transitive dependencies
- The output of pip freeze can be used as a hand-written development-dependency list indefinitely
answer: 1
explain: pip freeze exports every package in the environment with exact versions, including transitive dependencies such as urllib3 and certifi pulled in by requests. Using it directly as a hand-written list pins transitive versions.
```

```quiz
type: choice
q: What is uv's main advantage over traditional pip + venv?
options:
- uv is written in Rust and implements dependency resolution and installation much faster, and can manage environments and lock files
- uv bypasses Python version restrictions and runs any version on any system
- uv installs packages without an internet connection
- uv is pip's official replacement, maintained by the Python core team
answer: 0
explain: uv's core advantage is that it rewrites dependency resolution (solver speed) and parallel installation in Rust, while integrating virtual environment management, project initialisation, and lock files into a single toolchain.
```

## Part 2 · Hands-on Exercises

```quiz
type: function
q: Implement `env_priority(env_value, default_value)`, which models configuration-read precedence. `env_value` is the environment-variable value (a string, possibly empty), and `default_value` is the default. Rules: when env_value is non-empty, return env_value; when env_value is the empty string, return default_value; when env_value is None, also return default_value.
func: env_priority
starter: |
  def env_priority(env_value, default_value):
      # Fill in here
      return default_value
cases: |
  ("prod", "dev") -> "prod"
  ("", "dev") -> "dev"
  (None, 8000) -> 8000
  ("true", False) -> "true"
hint: Test whether env_value is None or equal to the empty string; if so return default_value, otherwise return env_value.
explain: This is the simplified precedence logic of configuration loading: use the environment value when present, otherwise fall back to the default.
```

```quiz
type: function
q: Implement `normalize_dep(spec)`, which normalises a dependency declaration. `spec` is a string that may or may not carry a version constraint. Return a dict {"name": package_name, "constraint": constraint_or_None}. The constraint is the first version operator (== >= <= ~= < >) and everything after it; if no operator is present, constraint is None. The package name is lowercased. For example, "Django>=4.0,<5.0" has constraint ">=4.0,<5.0".
func: normalize_dep
starter: |
  def normalize_dep(spec):
      import re
      result = {"name": "", "constraint": None}
      # Fill in here
      return result
cases: |
  ("Django>=4.0,<5.0") -> {"name": "django", "constraint": ">=4.0,<5.0"}
  ("requests==2.31.0") -> {"name": "requests", "constraint": "==2.31.0"}
  ("pandas") -> {"name": "pandas", "constraint": None}
  ("Flask~=3.0") -> {"name": "flask", "constraint": "~=3.0"}
hint: Find the position of the first version operator (scan the string for >=, <=, ==, ~=, <, >); everything before is the name and everything after is the constraint. Note that >= and <= must be matched first (two characters) or > and < will steal the match.
explain: A dependency resolver must first parse the package name and constraint uniformly; this is the simplified normalisation step.
```

## Part 3 · Mini Project

```quiz
type: project
q: On your own machine, use the command line to build a Python project skeleton that follows the src layout, including a virtual environment, a dependency list, .gitignore, and a README. The acceptance checklist follows.
checklist:
- In the project root, create a virtual environment with python3 -m venv .venv and activate it
- Create src/<project_name>/ containing __init__.py and an empty main.py
- Create a tests/ directory containing __init__.py and an empty test_main.py
- Write a requirements.txt listing at least 2 real dependencies (e.g. requests, pytest)
- Write a .gitignore that ignores at least .venv/, __pycache__/, and .env
- Write a README.md containing the project name, a one-line description, and "Installation" and "Running" sections
- Run git init && git add . && git status and confirm that .venv does not appear in the list of files to be committed
starter: |
  # Reference command order (run in the project root)
  python3 -m venv .venv
  source .venv/bin/activate
  mkdir -p src/myproject tests
  touch src/myproject/__init__.py src/myproject/main.py
  touch tests/__init__.py tests/test_main.py
  # then create requirements.txt / .gitignore / README.md
  git init
  git add .
  git status
```
