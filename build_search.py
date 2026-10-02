#!/usr/bin/env python3
"""
生成全站搜索索引 content/{lang}/search-index.json。

只收「教材名 + 目录」：书名、副标题、简介、标签、作者、章标题、课标题、引言。
不收正文 —— 搜正文听着好，实际噪音太大（任何词都能命中几十篇课文，
真正想找的那篇反而被淹），而且索引要大十倍。

索引里也不存代码：代码里全是 print、return 这类高频词，存进去全是噪音。
"""
import os, re, json, sys, urllib.request, urllib.error

ROOT = os.path.dirname(os.path.abspath(__file__))
CONTENT = os.path.join(ROOT, 'content')

# 第三方书在作者自己的仓库里，构建时扫不到。
# 以前是浏览器运行时去 al-docs 拉 registry —— 三个源都可能挂（jsDelivr 间歇 502、
# GitHub Pages 403），一挂就搜不到第三方书。
# 改成构建时拉一次写进索引，运行时零依赖：一定能搜到。
# 新收录的书靠下次构建进来（机器人本来就是 6 小时扫一次，够用）。
REGISTRY_URLS = [
    'https://raw.githubusercontent.com/Cool-zimo/al-docs/main/registry.json',
    'https://cdn.jsdelivr.net/gh/Cool-zimo/al-docs@main/registry.json',
]
TOKFILE = os.path.join(os.path.dirname(ROOT), '.tokens')


def _http(url, tok=None, timeout=60):
    """带 token 走 GitHub API / raw。token 只是提高限流额度，没有也能读公开文件。"""
    h = {'User-Agent': 'al-build'}
    if tok:
        h['Authorization'] = 'Bearer ' + tok
    r = urllib.request.Request(url, headers=h)
    with urllib.request.urlopen(r, timeout=timeout) as resp:
        return resp.read().decode('utf-8', 'replace')


def load_registry():
    toks = []
    try:
        toks = [l.strip() for l in open(TOKFILE, encoding='utf-8') if l.strip()]
    except Exception:
        pass
    for url in REGISTRY_URLS:
        for tok in (toks + [None]):
            try:
                reg = json.loads(_http(url, tok))
                if isinstance(reg, dict) and reg.get('books'):
                    return reg
            except Exception:
                continue
    print('  ! registry 拉取失败，第三方书不进索引')
    return None


def fetch_lessons(repo, branch, lang, toc):
    """第三方书：从原作者仓库抓课标题和引言。只抓这两个，不抓正文。"""
    chs, items = [], []
    for ci, ch in enumerate(toc.get('chapters', []) if isinstance(toc, dict) else []):
        chs.append(ch.get('title', ''))
        for lid in ch.get('lessons', []):
            lid = str(lid)
            t, sm = lid, ''
            try:
                u = ('https://raw.githubusercontent.com/%s/%s/content/%s/lessons/%s.md'
                     % (repo, branch or 'main', lang, lid))
                md = _http(u, timeout=30)
                m = re.search(r'^#\s+(.+)$', md, re.M)
                if m:
                    t = re.sub(r'^\d+\s*', '', m.group(1).strip())
                m = re.search(r'^>\s+(.+)$', md, re.M)
                if m:
                    sm = m.group(1).strip()
            except Exception:
                pass
            items.append({'b': 0, 'c': ci, 'id': lid, 't': t, 's': sm})
    return chs, items


def build_external(lang):
    reg = load_registry()
    if not reg:
        return []
    toks = []
    try:
        toks = [l.strip() for l in open(TOKFILE, encoding='utf-8') if l.strip()]
    except Exception:
        pass
    out = []
    for b in reg.get('books', []):
        if not b.get('ok'):
            continue
        langs = b.get('langs') or []
        if langs and lang not in langs:
            continue
        repo, branch = b.get('repo'), b.get('branch') or 'main'
        if not repo:
            continue
        toc = None
        for tok in (toks + [None]):
            try:
                u = 'https://raw.githubusercontent.com/%s/%s/content/%s/toc.json' % (repo, branch, lang)
                toc = json.loads(_http(u, tok, timeout=30))
                break
            except Exception:
                continue
        if not toc:
            print('  ! 跳过 %s（toc 拉取失败）' % repo)
            continue
        chs, items = fetch_lessons(repo, branch, lang, toc)
        for it in items:
            it['b'] = len(out)          # 占位，下面统一改成真实下标
        out.append({
            'id': b.get('id'), 'title': b.get('title') or b.get('id'),
            'sub': b.get('subtitle') or '', 'stage': b.get('stage') or '第三方',
            'ext': True,
            'x': ' '.join([b.get('desc') or '', ' '.join(b.get('tags') or []),
                           (b.get('author') or {}).get('name', ''), ' '.join(chs)]),
            'chs': chs, '_items': items,
        })
        print('  + %s（%d 课）' % (b.get('title'), len(items)))
    return out


def first(md, pat):
    m = re.search(pat, md, re.M)
    return m.group(1).strip() if m else ''


def build(lang):
    base = os.path.join(CONTENT, lang, 'books')
    books = json.load(open(os.path.join(CONTENT, lang, 'books.json'), encoding='utf-8'))
    bmap = {b['id']: b for b in books}

    booklist, items = [], []
    for bid in sorted(os.listdir(base)):
        bdir = os.path.join(base, bid)
        if not os.path.isdir(bdir):
            continue
        meta = bmap.get(bid, {})
        bi = len(booklist)
        booklist.append({
            'id': bid,
            'title': meta.get('title') or bid,
            'sub': meta.get('subtitle') or '',
            'stage': meta.get('stage') or '',
            # desc / 标签 / 作者也进索引：搜「openpyxl」命中的就是 desc 和 tags
            'x': ' '.join([meta.get('desc') or '', ' '.join(meta.get('tags') or [])]),
            'chs': [],          # 章标题存一份，课文里用下标引用
        })

        toc_p = os.path.join(bdir, 'toc.json')
        if not os.path.exists(toc_p):
            continue
        toc = json.load(open(toc_p, encoding='utf-8'))
        ldir = os.path.join(bdir, 'lessons')

        # 官方 toc 是 [{title, items:[{id,title,summary}]}]；章测是 items 之外的 test 字段
        for ch in toc:
            booklist[bi]['chs'].append(ch.get('title', ''))
            ci = len(booklist[bi]['chs']) - 1
            for it in ch.get('items', []):
                lid = str(it.get('id', ''))
                fp = os.path.join(ldir, lid + '.md')
                if not os.path.exists(fp):
                    continue
                md = open(fp, encoding='utf-8').read()
                title = first(md, r'^#\s+(.+)$') or it.get('title') or lid
                intro = first(md, r'^>\s+(.+)$') or it.get('summary') or ''
                items.append({
                    'b': bi, 'c': ci, 'id': lid,
                    't': title, 's': intro,
                })

    return {'v': 1, 'lang': lang, 'books': booklist, 'items': items}


if __name__ == '__main__':
    langs = sys.argv[1:] or ['zh', 'en']
    for L in langs:
        print(f'== {L} ==')
        d = build(L)
        n_official = len(d['books'])

        # 第三方书并进来：书号要接着官方的往下排，items.b 指的是 books 下标
        ext = build_external(L)
        for e in ext:
            bi = len(d['books'])
            d['books'].append({k: v for k, v in e.items() if k != '_items'})
            for it in e['_items']:
                it['b'] = bi
                d['items'].append(it)

        p = os.path.join(CONTENT, L, 'search-index.json')
        with open(p, 'w', encoding='utf-8') as f:
            json.dump(d, f, ensure_ascii=False, separators=(',', ':'))
        print(f'{L}: 官方 {n_official} 本 + 第三方 {len(ext)} 本 / '
              f'{len(d["items"])} 课 / {os.path.getsize(p)//1024}KB')
