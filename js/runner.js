/**
 * Python 代码执行器（Pyodide，纯浏览器内）
 *
 * 关键设计：
 * - 懒加载：只有第一次点「运行」才去 CDN 拉内核（约 10MB），不拖慢首屏。
 * - 命名空间按「节」隔离：同一节内多个代码块共享变量（前面的定义后面能用），
 *   切到下一节自动重置，避免上一节的变量污染教学效果。
 * - stdout / stderr 重定向到页面上的输出区，input() 通过一个输入框批量喂入。
 */
const Runner = (() => {
  let pyodide = null;
  let loading = null;
  let ns = null;          // 当前节的 globals
  let nsOwner = null;     // 当前命名空间属于哪一节
  let stdinQueue = [];
  const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/';

  async function ensure() {
    if (pyodide) return pyodide;
    if (loading) return loading;
    loading = (async () => {
      if (typeof loadPyodide !== 'function') {
        throw new Error('Pyodide 脚本未加载成功，请检查网络');
      }
      pyodide = await loadPyodide({ indexURL: PYODIDE_URL });
      pyodide.setStdin({
        stdin: () => (stdinQueue.length ? stdinQueue.shift() + '\n' : '\n'),
        autoEOF: true
      });
      return pyodide;
    })();
    return loading;
  }

  /** 从代码里猜出需要加载哪些包 */
  function detectPackages(...sources) {
    const src = sources.filter(Boolean).join('\n');
    const out = [];
    if (/^\s*(import\s+numpy|from\s+numpy\b|import\s+numpy\s+as)/m.test(src) || /\bnp\./.test(src)) out.push('numpy');
    if (/^\s*(import\s+pandas|from\s+pandas\b|import\s+pandas\s+as)/m.test(src) || /\bpd\./.test(src)) out.push('pandas');
    if (/^\s*(import\s+matplotlib|from\s+matplotlib\b)/m.test(src) || /\bplt\./.test(src)) out.push('matplotlib');
    return [...new Set(out)];
  }

  /** 确保包已加载（已加载的会被跳过） */
  async function ensurePackages(pkgs) {
    await ensure();
    if (!pkgs || !pkgs.length) return;
    const loaded = pyodide.loadedPackages || {};
    const want = pkgs.filter(p => !loaded[p]);
    if (want.length) await pyodide.loadPackage(want);
  }

  /** 切换章节：重置命名空间 */
  function resetNamespace(lessonId) {
    if (!pyodide || nsOwner === lessonId) return;
    ns = pyodide.runPython('{}');   // 新建空的 globals dict
    nsOwner = lessonId;
  }

  /** 收集 input() 需要的内容 */
  function collectStdin(code, out) {
    const count = (code.match(/(^|[^.\w])input\s*\(/g) || []).length;
    if (!count) return true;
    const ans = prompt(`这段代码调用了 ${count} 次 input()\n请按顺序列出每行要输入的内容（多行）：`);
    if (ans === null) { out.write('sys', '（已取消运行）\n'); return false; }
    stdinQueue = ans.split('\n');
    return true;
  }

  /**
   * 执行代码
   * @param {string} code
   * @param {string} lessonId
   * @param {{write:(cls:string,text:string)=>void, end:(ms:number)=>void}} out
   */
  async function run(code, lessonId, out) {
    try {
      await ensure();
      await ensurePackages(detectPackages(code));
    } catch (e) {
      out.write('err', '运行环境加载失败：' + e.message + '\n（多半是网络问题，刷新页面重试）');
      out.end(0);
      return;
    }
    try {
      resetNamespace(lessonId);

      let buf = '';
      pyodide.setStdout({ batched: s => { buf += s + '\n'; out.write('', s + '\n'); } });
      pyodide.setStderr({ batched: s => { out.write('err', s + '\n'); } });

      if (!collectStdin(code, out)) { out.end(0); return; }

      const t0 = performance.now();
      // 用独立 globals，让同一节内变量互通、不同节互不干扰
      const result = pyodide.runPython(code, { globals: ns });

      const ms = Math.round(performance.now() - t0);
      // 最后一行是表达式时，回显其值（REPL 体验）
      if (result !== undefined && result !== null) {
        try {
          const rep = pyodide.globals.get('repr')(result);
          if (rep && rep !== 'None') out.write('', '→ ' + rep + '\n');
        } catch (e) { /* 某些对象无法 repr，忽略 */ }
      }
      out.end(ms);
    } catch (e) {
      // Python 异常信息里含调用栈，直接展示更有教学价值
      out.write('err', String(e.message || e));
      out.end(0);
    }
  }

  /**
   * 结构化执行：给测试引擎用
   * @param {string} code 用户代码
   * @param {string[]} tests 断言语句数组，如 ["assert add(1,2)==3"]
   * @param {string} nsKey 命名空间钥匙（同一课内共享）
   * @param {string|string[]} [stdin] 判分时喂给 input() 的内容（每行一次）。
   *        不传则 input() 返回空字符串——这对"只用预置变量"的题是安全的，
   *        但想真正考 input() 的题必须靠这个字段把输入喂进去。
   * @returns {Promise<{ok:boolean, stdout:string, error:string|null, failed:number}>}
   */
  async function execWithTests(code, tests, nsKey = '__quiz__', stdin = null) {
    const result = { ok: false, stdout: '', error: null, failed: 0 };
    try {
      await ensure();
      await ensurePackages(detectPackages(code, (tests || []).join('\n')));
    } catch (e) {
      result.error = '运行环境加载失败：' + e.message;
      return result;
    }
    if (nsOwner !== nsKey || !ns) {
      ns = pyodide.runPython('{}');
      nsOwner = nsKey;
    }
    // 题目声明了 stdin 就按行排队喂给 input()，用完补空串（不会卡住）
    stdinQueue = [];
    if (stdin != null) {
      const arr = Array.isArray(stdin) ? stdin : String(stdin).split('\n');
      stdinQueue = arr.map(v => String(v));
    }
    pyodide.setStdin({
      stdin: () => (stdinQueue.length ? stdinQueue.shift() + '\n' : '\n'),
      autoEOF: true
    });

    let buf = '';
    pyodide.setStdout({ batched: s => { buf += s + '\n'; } });
    pyodide.setStderr({ batched: s => { buf += s + '\n'; } });

    try {
      pyodide.runPython(code, { globals: ns });
    } catch (e) {
      result.error = String(e.message || e);
      result.stdout = buf;
      return result;
    }

    // 把用户代码的输出暴露成变量 __out，
    // 这样测试就能写 assert "xxx" in __out，用来验证"打印了什么"
    try { ns.set('__out', buf); } catch (e) { /* 某些 proxy 不支持 set，忽略 */ }

    for (let i = 0; i < tests.length; i++) {
      try {
        pyodide.runPython(tests[i], { globals: ns });
      } catch (e) {
        result.failed = i + 1;
        // AssertionError 通常不带消息，补一句人话
        const raw = String(e.message || e).trim();
        result.error = raw || `第 ${i + 1} 个测试没有通过`;
        result.stdout = buf;
        return result;
      }
    }
    result.ok = true;
    result.stdout = buf;
    return result;
  }

  /**
   * 函数题判分：执行用户代码 -> 取出指定函数 -> 逐个用例调用并比对返回值
   *
   * 这是"算法题能自动批阅"的关键：不比对 stdout，而是真正调用用户写的函数，
   * 看返回值是否符合预期。比 execWithTests 更结构化，能给出逐用例的对比表。
   *
   * @param {string} code 用户代码
   * @param {string} funcName 要调用的函数名
   * @param {Array<{args:Array, expect:any}>} cases 测试用例
   * @param {string} nsKey
   * @returns {Promise<{ok:boolean, results:Array, error:string|null, stdout:string}>}
   */
  async function execFunction(code, funcName, cases, nsKey = '__fn__') {
    const result = { ok: false, results: [], error: null, stdout: '' };
    try {
      await ensure();
      await ensurePackages(detectPackages(code, JSON.stringify(cases)));
    } catch (e) {
      result.error = '运行环境加载失败：' + e.message;
      return result;
    }

    if (nsOwner !== nsKey || !ns) {
      ns = pyodide.runPython('{}');
      nsOwner = nsKey;
    }
    let buf = '';
    pyodide.setStdout({ batched: s => { buf += s + '\n'; } });
    pyodide.setStderr({ batched: s => { buf += s + '\n'; } });

    // 1) 先执行用户代码
    try {
      pyodide.runPython(code, { globals: ns });
    } catch (e) {
      result.error = String(e.message || e);
      result.stdout = buf;
      return result;
    }

    // 2) 取函数对象
    let fn;
    try {
      fn = ns.get(funcName);
    } catch (e) { fn = undefined; }
    if (fn === undefined || fn === null) {
      result.error = `没有找到名为 ${funcName} 的函数 —— 检查一下是不是拼错了，或者忘了用 def 定义`;
      result.stdout = buf;
      return result;
    }
    if (typeof fn !== 'function' && !(fn && fn.type === 'function')) {
      result.error = `${funcName} 不是一个可以调用的函数`;
      result.stdout = buf;
      return result;
    }

    // 3) 在 Python 端逐用例调用并比对
    pyodide.globals.set('__fn_obj', fn);
    pyodide.globals.set('__cases_json', JSON.stringify(cases));

    const py = `
import json as __json
try:
    import numpy as __np
except Exception:
    __np = None

def __eq(a, b):
    # numpy 数组：== 返回的是数组，不能直接当布尔用，
    # 必须用 array_equal / allclose
    if __np is not None:
        try:
            if isinstance(a, __np.ndarray) or isinstance(b, __np.ndarray):
                __x, __y = __np.asarray(a), __np.asarray(b)
                if __x.shape != __y.shape:
                    return False
                try:
                    return bool(__np.array_equal(__x, __y))
                except Exception:
                    return bool(__np.allclose(__x.astype(float), __y.astype(float)))
        except Exception:
            pass
    # 浮点：允许极小误差
    if isinstance(a, float) or isinstance(b, float):
        try:
            return abs(float(a) - float(b)) < 1e-9
        except Exception:
            return False
    # 严格类型：避免 1 == True 这种"值相等但类型不同"的误判
    # int / float 之间放宽（写 6 和 6.0 都算对）
    __same = (
        type(a) is type(b)
        or (isinstance(a, (int, float)) and isinstance(b, (int, float))
            and not isinstance(a, bool) and not isinstance(b, bool))
    )
    try:
        return bool(a == b) and __same
    except Exception:
        return False

def __short(v):
    try:
        r = __repr(v)
    except Exception:
        r = str(v)
    return r if len(r) <= 60 else r[:57] + "..."

__cs = __json.loads(__cases_json)
__res = []
for __c in __cs:
    __args = __c.get("args", []) or []
    __exp = __c.get("expect")
    __row = {"args": __short(__args)[1:-1], "expect": __short(__exp), "got": None, "ok": False}
    try:
        __got = __fn_obj(*__args)
        __row["got"] = __short(__got)
        __row["ok"] = bool(__eq(__got, __exp))
    except Exception as __e:
        __row["got"] = None
        __row["error"] = str(__e)
    __res.append(__row)
__json.dumps(__res, ensure_ascii=False)
`;

    try {
      const jsonStr = pyodide.runPython(py);
      result.results = JSON.parse(jsonStr);
      result.ok = result.results.length > 0 && result.results.every(r => r.ok);
    } catch (e) {
      result.error = String(e.message || e);
    }
    result.stdout = buf;
    return result;
  }

  /**
   * 小项目验收：只要求"跑得通"—— 没有语法错误、没有未捕获异常。
   * 不做功能正确性判断（开放式项目自动批阅本就不现实），
   * 是否满足需求由用户自己勾选验收清单来确认。
   *
   * @returns {Promise<{ok:boolean, error:string|null, stdout:string, lines:number}>}
   */
  async function execCheck(code, nsKey = '__proj__') {
    const result = { ok: false, error: null, stdout: '', lines: 0 };
    try {
      await ensure();
      await ensurePackages(detectPackages(code));
    } catch (e) {
      result.error = '运行环境加载失败：' + e.message;
      return result;
    }
    if (nsOwner !== nsKey || !ns) {
      ns = pyodide.runPython('{}');
      nsOwner = nsKey;
    }
    let buf = '';
    pyodide.setStdout({ batched: s => { buf += s + '\n'; } });
    pyodide.setStderr({ batched: s => { buf += s + '\n'; } });

    result.lines = code.split('\n').filter(l => l.trim()).length;

    try {
      pyodide.runPython(code, { globals: ns });
      result.ok = true;
    } catch (e) {
      result.error = String(e.message || e);
    }
    result.stdout = buf;
    return result;
  }

  return { run, execWithTests, execFunction, execCheck, ensure, ensurePackages, detectPackages, resetNamespace, get ready() { return !!pyodide; } };
})();
