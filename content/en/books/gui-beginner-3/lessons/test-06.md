# Chapter 6 · Packaging and Delivery · Big Test

> 8 questions. This chapter is about turning your finished program into something a user can double-click, so that crashes are not scary, the bundle is not bloated, and nothing is missing from the release.
> **You must get every question right to pass this chapter.**

## Part 1 · Multiple Choice

```quiz
type: choice
q: Which is the correct way to install a global exception hook in a desktop application?
options:
- try: ... except: pass, swallowing every exception
- Use sys.excepthook to set a handler that prints the full stack trace and then shows a friendly dialog
- Wrap only the outermost main function in try and handle nothing else
- Show the raw traceback to the user so they can debug it themselves
answer: 1
explain: sys.excepthook is the last line of defence: print the full stack for the developer, then show a friendly messagebox without the stack for the user. A bare except hides bugs, wrapping only main gives no useful feedback, and dumping the stack on the user is neither friendly nor helpful.
```

```quiz
type: choice
q: Where should a desktop application keep its configuration file?
options:
- In the program's installation directory, for convenience
- On Windows use %APPDATA%, on macOS use ~/Library/Application Support, on Linux use ~/.config
- The ledger database file and config.ini must live in the same directory
- Config files must use pickle because it is the fastest format
answer: 1
explain: Each platform has its own conventional user-config directory; hardcoding a path or using the install directory is wrong. Ledger data belongs in the user's documents rather than the config directory, and config should use a text format (ini/json) rather than pickle for cross-version stability.
```

```quiz
type: choice
q: Regarding PyInstaller's --onefile and --onedir, which statement is correct?
options:
- --onefile starts faster because it does not need to unpack
- --onefile must unpack the runtime into a temp directory on startup, so it is usually slower than --onedir
- --onedir compresses the program into a single file for easy distribution
- The two differ dramatically in disk usage, with --onefile saving about half the space
answer: 1
explain: --onefile unpacks the entire runtime into %TEMP%/_MEIxxxxxx on every launch, which is why it starts slowly. --onedir skips unpacking and loads instantly. Their actual disk usage is similar; onefile only adds a compression wrapper.
```

```quiz
type: choice
q: When sizing a tkinter application with PyInstaller, which statement is closest to reality?
options:
- The bulk of the package size is the developer's own business code
- A tkinter Hello World is around 10MB, and adding matplotlib pushes it past 60MB, with dependencies making up the bulk
- --onefile significantly reduces disk usage, usually halving the onedir size
- The more modules you exclude, the better, since unused ones should be removed
answer: 1
explain: Real-world sizes: a tkinter Hello World is around 10MB; with matplotlib it passes 60MB. The bulk is the Python runtime and its dependencies (numpy, matplotlib fonts, and so on); your own code compresses to under 100KB. --onefile does not save space, it only adds a compression shell, and over-excluding modules can lead to runtime ModuleNotFoundError.
```

```quiz
type: choice
q: What is the correct way to handle resource files when releasing an application?
options:
- Use a relative path like open("data/xxx.json") and it will still resolve after packaging
- Locate resources with sys._MEIPASS and bundle them explicitly using --add-data
- Add the data directory to .gitignore and let PyInstaller ignore it automatically
- Bundle the database file so the user gets pre-populated data
answer: 1
explain: After packaging, the program runs from a temp unpack directory _MEIxxxxxx, so source-relative paths all break. You must use sys._MEIPASS to locate resources and --add-data to bundle them. Database files should not be bundled (they contain test data and should be created fresh each time); they belong in .gitignore.
```

---

## Part 2 · Hands-On Questions

```quiz
type: local
q: Add full exception handling to your ledger entry form: 1) write validate() to check that the category is not empty, the amount converts to float and is greater than 0, the date matches YYYY-MM-DD (using datetime.strptime), and the note does not exceed 200 characters, with showwarning on failure; 2) in on_save(), use try/except to catch ValueError (bad amount format) and OSError (disk full or permission denied), with distinct messages for each; 3) install a sys.excepthook global hook that prints any uncaught exception to the console and shows a showerror dialog (the hook should check whether tk._default_root exists, to avoid crashing while trying to show the dialog). A window can't open inside a web page — click 'Open in VS Code' to run it.
starter: |
  import sys, traceback
  import tkinter as tk
  import tkinter.ttk as ttk
  import tkinter.messagebox as mb
  from datetime import datetime

  def global_exc_handler(exc_type, exc_value, exc_tb):
      text = "".join(traceback.format_exception(exc_type, exc_value, exc_tb))
      print("Uncaught exception:\n", text)
      try:
          if tk._default_root is not None:
              mb.showerror("Something went wrong", f"An unexpected error occurred:\n{exc_value}")
      except Exception:
          pass

  sys.excepthook = global_exc_handler

  class EntryForm(ttk.Frame):
      def __init__(self, master):
          super().__init__(master)
          self.category = tk.StringVar(value="Food")
          self.amount = tk.StringVar()
          self.date = tk.StringVar(value="2026-09-27")
          self.note = tk.StringVar()
          for label, var in [("Category", self.category), ("Amount", self.amount),
                             ("Date", self.date), ("Note", self.note)]:
              ttk.Label(self, text=label).pack()
              ttk.Entry(self, textvariable=var).pack()
          ttk.Button(self, text="Save", command=self.on_save).pack(pady=6)
          ttk.Button(self, text="Trigger an exception",
                     command=lambda: 1/0).pack()

      def validate(self):
          # TODO: category, amount, date, note
          return True

      def on_save(self):
          if not self.validate():
              return
          try:
              amt = float(self.amount.get())
              if amt <= 0:
                  raise ValueError("Amount must be greater than 0")
          except ValueError as e:
              mb.showwarning("Bad input", f"Amount format is wrong: {e}")
              return
          try:
              datetime.strptime(self.date.get(), "%Y-%m-%d")
          except ValueError:
              mb.showwarning("Bad input", "Date must be in YYYY-MM-DD format")
              return
          # TODO: simulate a database write and catch OSError
          mb.showinfo("Success", "One record saved")

  root = tk.Tk()
  root.title("Exception handling test")
  EntryForm(root).pack()
  root.mainloop()
checklist:
- validate checks four items: category, amount, date, and note
- The date uses datetime.strptime and warns on a bad format
- A non-numeric or zero/negative amount gives distinct warnings
- on_save uses try/except to catch ValueError and OSError
- sys.excepthook is installed and can show a dialog and print the stack
- The hook checks tk._default_root to avoid a second crash
- Clicking the "Trigger an exception" button exercises the global hook
```

```quiz
type: local
q: Implement three configuration functions: config_dir() (returning the correct directory on all three platforms), save_config(), and load_config() (with fallback defaults). On exit, save the window geometry and the last selected tab through WM_DELETE_WINDOW. Print the loaded config, then edit config.ini by hand and run again to confirm the new value is read. A window can't open inside a web page — click 'Open in VS Code' to run it.
starter: |
  import os, platform
  import tkinter as tk
  import tkinter.ttk as ttk
  import configparser
  from pathlib import Path

  def config_dir():
      app = "Ledger"
      sysname = platform.system()
      if sysname == "Windows":
          base = os.environ.get("APPDATA")
      elif sysname == "Darwin":
          base = os.path.expanduser("~/Library/Application Support")
      else:
          base = os.environ.get("XDG_CONFIG_HOME") or os.path.expanduser("~/.config")
      p = Path(base) / app
      p.mkdir(parents=True, exist_ok=True)
      return p

  def save_config(path, geometry, last_file, last_tab):
      cp = configparser.ConfigParser()
      cp["Window"] = {"geometry": geometry}
      cp["Recent"] = {"last_file": last_file, "last_tab": str(last_tab)}
      with open(path, "w", encoding="utf-8") as f:
          cp.write(f)

  def load_config(path):
      cp = configparser.ConfigParser()
      cp.read(path, encoding="utf-8")
      return {
          "geometry": cp.get("Window", "geometry", fallback="1000x650+100+100"),
          "last_file": cp.get("Recent", "last_file", fallback=""),
          "last_tab": cp.getint("Recent", "last_tab", fallback=0),
      }

  root = tk.Tk()
  root.title("Config system test")
  root.geometry("600x400")
  nb = ttk.Notebook(root)
  for name in ["Entry", "Statistics", "Settings"]:
      nb.add(ttk.Frame(nb), text=name)
  nb.pack(fill="both", expand=True)

  cfg = load_config(config_dir() / "config.ini")
  print("Loaded config:", cfg)
  print("Config directory:", config_dir())

  def on_close():
      save_config(config_dir() / "config.ini",
                  root.geometry(), "", nb.index(nb.select()))
      print("Saved config, geometry =", root.geometry(),
            "last_tab =", nb.index(nb.select()))
      root.destroy()

  root.protocol("WM_DELETE_WINDOW", on_close)
  root.mainloop()
checklist:
- config_dir branches correctly for all three platforms (Windows APPDATA / macOS ~/Library / Linux ~/.config)
- save_config writes the [Window] and [Recent] sections and their keys
- load_config uses fallback and does not crash when the file is missing
- WM_DELETE_WINDOW saves geometry and last_tab correctly
- After reopening, the config is restored (window size or tab position)
- Editing config.ini by hand and running again picks up the new value
```

---

## Part 3 · Mini Project

```quiz
type: project
q: Complete a "release-ready" check on your ledger project (or any tkinter project): add the release materials and run a full packaging verification. Requirements: 1) write README.md (features, download and run, run from source, PyInstaller build command, licence statement); 2) add _version.py as the single source of truth and show "Ledger v1.0.0" in the About area; 3) add a LICENSE file (MIT); 4) add .gitignore (including *.db, build/, dist/, __pycache__/, *.spec, config.ini); 5) configure logging to write to ledger_error.log next to the exe (located via sys.executable); 6) write a bash or Python script that runs the full sequence "clean development artefacts, read the version, build with --onefile --windowed, copy to a clean directory to verify startup". A window can't open inside a web page — click 'Open in VS Code' to run it.
starter: |
  # suggested layout:
  #   ./main.py         entry point
  #   ./_version.py     single source of truth for the version
  #   ./README.md       project description
  #   ./LICENSE         MIT licence
  #   ./.gitignore      ignore rules
  #
  # _version.py:
  #   VERSION = "1.0.0"
  #
  # main.py skeleton (logging + About area):
  import tkinter as tk
  import tkinter.ttk as ttk
  import logging
  import sys
  from pathlib import Path
  from _version import VERSION

  log_path = Path(sys.executable).parent / "ledger_error.log"
  logging.basicConfig(
      filename=str(log_path),
      level=logging.ERROR,
      format="%(asctime)s %(levelname)s %(message)s",
  )

  def main():
      root = tk.Tk()
      root.title("Ledger")
      root.geometry("400x200")
      ttk.Label(root, text=f"Ledger v{VERSION}", font=("", 16)).pack(expand=True)
      root.mainloop()

  if __name__ == "__main__":
      try:
          main()
      except Exception:
          logging.exception("Uncaught exception")
          raise

  # build_release.sh skeleton:
  #   #!/usr/bin/env bash
  #   set -e
  #   rm -rf build dist __pycache__ *.db
  #   VERSION=$(python -c "import _version; print(_version.VERSION)")
  #   pyinstaller --onefile --windowed --name "Ledger-$VERSION" main.py
  #   mkdir -p /tmp/ledger_test
  #   cp "dist/Ledger-$VERSION" /tmp/ledger_test/
  #   echo "Verify startup in the clean directory: /tmp/ledger_test/Ledger-$VERSION"
  #   zip -r "Ledger-$VERSION.zip" "dist/Ledger-$VERSION" README.md LICENSE
checklist:
- README.md is complete (features, download and run, run from source, build command, licence)
- _version.py exists and the About area shows the correct version
- A LICENSE file exists with a valid MIT licence text
- .gitignore includes *.db, build/, dist/, __pycache__/, *.spec, and config.ini
- logging writes to ledger_error.log next to the exe
- The release script cleans development artefacts, reads the version, packages, and copies for verification
- The build command uses --onefile --windowed and the output includes the version
- The final artifact is a versioned zip containing README and LICENSE
```
