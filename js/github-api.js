/**
 * GitHub REST API 封装（浏览器直连，无需后端）
 *
 * 设计要点（沿用 GitHub Drive 的实践）：
 * 1. 一切走 Contents API —— 提交由 GitHub 自动生成，不必自己管理 tree/commit/blob，
 *    也就避开了手动维护分支引用带来的各种缓存问题。
 * 2. 更新文件必须先取 sha，409 冲突就重取 sha 重试。
 * 3. base64 解码必须按字节走 UTF-8，否则中文笔记会乱码。
 */
class GitHubAPI {
  constructor(token) {
    this.token = (token || '').trim();
    this.base = 'https://api.github.com';
  }

  _headers(extra = {}) {
    return Object.assign({
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json'
    }, extra);
  }

  async _req(method, path, body = null, opts = {}) {
    const url = path.startsWith('http') ? path : this.base + path;
    const res = await fetch(url, {
      method,
      headers: this._headers(opts.headers),
      body: body === null ? undefined : JSON.stringify(body)
    });

    if (res.status === 204) return null;

    let data = null;
    const text = await res.text();
    if (text) { try { data = JSON.parse(text); } catch (e) { data = text; } }

    if (!res.ok) {
      const err = new Error(data?.message || `HTTP ${res.status}`);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    // 把最后一次响应挂在实例上，供读取 X-OAuth-Scopes 这类响应头
    this.lastResponse = res;
    return data;
  }

  /**
   * 读取当前 token 的实际授权范围。
   *
   * 为什么要有这个：站点只需要一个仓库的写权限，但用户可能给了全权限的
   * classic token。让权限可见，是"这个页面到底能碰什么"唯一能被验证的方式。
   *
   * @returns {Promise<{type:'fine-grained'|'classic', scopes:string[], accepted:string, raw:string|null}>}
   */
  async getScopes() {
    const res = await fetch(this.base + '/user', {
      method: 'GET',
      headers: this._headers()
    });
    // X-OAuth-Scopes 只有 classic token 会返回；fine-grained 返回的是
    // X-OAuth-Token-Type: app 且不带 scopes
    const scopesHeader = res.headers.get('X-OAuth-Scopes');
    const tokenType = res.headers.get('X-OAuth-Token-Type');
    const accepted = res.headers.get('X-Accepted-OAuth-Scopes') || '';

    if (!res.ok) {
      const err = new Error('HTTP ' + res.status);
      err.status = res.status;
      throw err;
    }

    const scopes = (scopesHeader || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    return {
      type: tokenType === 'app' ? 'fine-grained' : (scopes.length ? 'classic' : 'unknown'),
      scopes,
      accepted: accepted.split(',').map(s => s.trim()).filter(Boolean),
      raw: scopesHeader
    };
  }

  /** 校验 token、取用户名 */
  async getUsername() {
    const u = await this._req('GET', '/user');
    return u.login;
  }

  /** 仓库是否存在 */
  async getRepository(owner, repo) {
    return this._req('GET', `/repos/${owner}/${repo}`);
  }

  /** 创建仓库（笔记仓库用 private: true） */
  async createRepository(name, { description = '', private: isPrivate = true, autoInit = true } = {}) {
    return this._req('POST', '/user/repos', {
      name, description, private: isPrivate, auto_init: autoInit
    });
  }

  /** 读文件，返回 { content(原文), sha, ... }；404 返回 null */
  async getFileContents(owner, repo, path, ref = 'main') {
    try {
      const d = await this._req('GET', `/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(ref)}${this._cacheBuster()}`);
      if (!d || typeof d !== 'object') return null;
      return { content: GitHubAPI.decodeBase64(d.content || ''), sha: d.sha, path: d.path };
    } catch (e) {
      if (e.status === 404) return null;
      throw e;
    }
  }

  /** 创建或更新文件；sha 为空表示新建 */
  async createOrUpdateFile(owner, repo, path, content, message, branch = 'main', sha = null) {
    const body = {
      message,
      content: GitHubAPI.encodeBase64(content),
      branch
    };
    if (sha) body.sha = sha;
    return this._req('PUT', `/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`, body);
  }

  /**
   * 一次提交里写多个文件 / 删多个文件（Git Tree API）。
   *
   * 为什么需要它：开发者平台的草稿是"一本几十个文件"，
   * 用 contents API 一个一个写要几十次请求，慢且容易中途失败留半截。
   * 走 tree 则是一次提交，要么全成要么全不成。
   *
   * 删文件：把 sha 显式设为 null（GitHub 用这个表示删除）。
   */
  async commitTree(owner, repo, branch, message, changes) {
    const ref = await this._req('GET',
      `/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(branch)}`)
      .catch(async () => {
        // 分支不存在（空仓库）：拿默认分支再试
        const b = await this.getDefaultBranch(owner, repo);
        return this._req('GET', `/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(b)}`);
      });
    const baseSha = ref.object.sha;
    const baseCommit = await this._req('GET',
      `/repos/${owner}/${repo}/git/commits/${baseSha}`);

    // 一次性建 blob（并发，但别太猛）
    const blobs = [];
    const queue = changes.slice();
    async function worker() {
      while (queue.length) {
        const c = queue.shift();
        if (c.delete) { blobs.push({ path: c.path, sha: null }); continue; }
        const b = await this._req('POST', `/repos/${owner}/${repo}/git/blobs`,
          { content: c.content, encoding: 'utf-8' });
        blobs.push({ path: c.path, sha: b.sha, mode: '100644', type: 'blob' });
      }
    }
    await Promise.all(Array.from({ length: Math.min(6, changes.length) },
      () => worker.call(this)));

    const tree = await this._req('POST', `/repos/${owner}/${repo}/git/trees`,
      { base_tree: baseCommit.tree.sha, tree: blobs });
    const commit = await this._req('POST', `/repos/${owner}/${repo}/git/commits`,
      { message, tree: tree.sha, parents: [baseSha] });
    await this._req('PATCH',
      `/repos/${owner}/${repo}/git/refs/heads/${encodeURIComponent(branch)}`,
      { sha: commit.sha });
    return commit;
  }

  /** 读一棵树（用于列出草稿仓库里有哪些书） */
  async getTree(owner, repo, branch, recursive = true) {
    const d = await this._req('GET',
      `/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}${recursive ? '?recursive=1' : ''}`);
    return (d && d.tree) || [];
  }

  /** 设置仓库的 topic（发布第三方书时用来打 al-book 标记） */
  async setTopics(owner, repo, names) {
    return this._req('PUT', `/repos/${owner}/${repo}/topics`, { names });
  }

  /** 改仓库可见性：private true/false */
  async setVisibility(owner, repo, isPrivate) {
    return this._req('PATCH', `/repos/${owner}/${repo}`, { private: !!isPrivate });
  }

  /** 删仓库（谨慎：不可撤销） */
  async deleteRepository(owner, repo) {
    return this._req('DELETE', `/repos/${owner}/${repo}`);
  }

  /** 仓库默认分支名（有的仓库是 master） */
  async getDefaultBranch(owner, repo) {
    const r = await this.getRepository(owner, repo);
    return r?.default_branch || 'main';
  }

  /** 列出某个用户的仓库名，用于判断笔记仓库是否已存在 */
  async listRepoNames(perPage = 100) {
    const r = await this._req('GET', `/user/repos?per_page=${perPage}&sort=updated&affiliation=owner`);
    return (r || []).map(x => x.name);
  }

  /* ===== 第三方书籍：搜索 + 整仓拉取 ===== */

  /**
   * 搜索仓库。
   *
   * 用登录用户的 token 走 5000 次/小时的额度，而不是未认证的 60 次/小时 ——
   * 未认证限流在书多起来以后根本扫不动。
   */
  async searchRepositories(q, { perPage = 100, page = 1, sort = 'updated' } = {}) {
    const url = `${this.base}/search/repositories?q=${encodeURIComponent(q)}` +
                `&per_page=${perPage}&page=${page}&sort=${sort}`;
    const d = await this._req('GET', url);
    return d?.items || [];
  }

  /** 仓库的 topic 列表 */
  async getTopics(owner, repo) {
    try {
      const d = await this._req('GET', `/repos/${owner}/${repo}/topics`);
      return d?.names || [];
    } catch (e) {
      return [];
    }
  }

  /** 递归文件树，返回 [{path, sha, size}] */
  async getTree(owner, repo, ref = 'main') {
    const d = await this._req(
      'GET',
      `/repos/${owner}/${repo}/git/trees/${encodeURIComponent(ref)}?recursive=1`
    );
    return (d?.tree || []).filter(x => x.type === 'blob');
  }

  /** 分支最新提交的 sha，用来判断缓存是否过期 */
  async getBranchSha(owner, repo, branch = 'main') {
    try {
      const d = await this._req('GET', `/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(branch)}`);
      return d?.object?.sha || null;
    } catch (e) {
      return null;
    }
  }

  /**
   * 批量读文件。并发但有上限 —— 一次几百个请求会把浏览器连接打满，
   * 也会更快撞上限流。
   */
  async getManyFiles(owner, repo, paths, ref = 'main', concurrency = 8) {
    const out = {};
    let i = 0;
    async function worker() {
      while (i < paths.length) {
        const p = paths[i++];
        try {
          const f = await this.getFileContents(owner, repo, p, ref);
          if (f) out[p] = { text: f.content, sha: f.sha };
        } catch (e) {
          // 单个文件失败不影响整本书
        }
      }
    }
    const workers = [];
    for (let n = 0; n < Math.min(concurrency, paths.length || 1); n++) {
      workers.push(worker.call(this));
    }
    await Promise.all(workers);
    return out;
  }

  _cacheBuster() {
    return `&t=${Date.now()}`;
  }

  /* ---- base64：必须按字节处理，保证中文不乱码 ---- */
  static encodeBase64(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = '';
    const CHUNK = 0x8000; // 分块避免 apply 参数过多爆栈
    for (let i = 0; i < bytes.length; i += CHUNK) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
    }
    return btoa(bin);
  }

  static decodeBase64(b64) {
    const bin = atob(b64.replace(/\s/g, ''));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder('utf-8').decode(bytes);
  }
}
