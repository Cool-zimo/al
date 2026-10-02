#!/usr/bin/env python3
"""
生成全站搜索索引 content/{lang}/search-index.json。

为什么需要它：搜索"关于爬虫"这种词，光匹配书名和课标题根本搜不到，
必须搜正文。但正文散在 700+ 个 md 文件里，浏览器现抓要几百次请求。
所以构建时抽一次，压成一个文件。

索引里不存代码 —— 代码里全是 print、return 这类高频噪音词，
存进去会让任何搜索都命中一堆无关课文。
"""
import os, re, json, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
CONTENT = os.path.join(ROOT, 'content')
MAX_BODY = 1200          # 每课正文最多存这么多字符
# 轻量索引没有正文，只有「书名 + 课标题 + 引言」，几十 KB，能秒开；
# 正文索引 1MB 量级，后台慢慢拉，拉到了再补一轮全文结果。


def strip_md(md):
    """把 Markdown 抽成可搜索的纯文本：去代码块、去 quiz 块、去标记符号。"""
    out, in_fence, fence = [], False, None
    for line in md.split('\n'):
        s = line.strip()
        if not in_fence:
            m = re.match(r'^(`{3,}|\~{3,})(.*)$', s)
            if m:
                in_fence, fence = True, m.group(1)
                continue
        else:
            if s.startswith(fence):
                in_fence, fence = False, None
            continue
        if s.startswith('#'):                      # 标题单独抽，正文里不重复存
            continue
        if s.startswith('>'):                      # 引言同理
            continue
        out.append(line)
    txt = '\n'.join(out)
    txt = re.sub(r'<!--.*?-->', ' ', txt, flags=re.S)
    txt = re.sub(r'!\[[^\]]*\]\([^)]*\)', ' ', txt)          # 图片
    txt = re.sub(r'\[([^\]]*)\]\([^)]*\)', r'\1', txt)       # 链接留文字
    txt = re.sub(r'`([^`]*)`', r'\1', txt)                   # 行内代码留内容
    txt = re.sub(r'[*_|~]', ' ', txt)
    txt = re.sub(r'^\s*[-+]\s+', ' ', txt, flags=re.M)
    txt = re.sub(r'\s+', ' ', txt)
    return txt.strip()


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
                body = strip_md(md)[:MAX_BODY]
                items.append({
                    'b': bi, 'c': ci, 'id': lid,
                    't': title, 's': intro, 'x': body,
                })

    light = {'v': 1, 'lang': lang, 'books': booklist,
             'items': [{'b': i['b'], 'c': i['c'], 'id': i['id'], 't': i['t'], 's': i['s']}
                       for i in items]}
    return light, {'v': 1, 'lang': lang, 'items': [i['x'] for i in items]}


if __name__ == '__main__':
    langs = sys.argv[1:] or ['zh', 'en']
    for L in langs:
        light, full = build(L)
        p1 = os.path.join(CONTENT, L, 'search-index.json')
        p2 = os.path.join(CONTENT, L, 'search-full.json')
        for p, d in ((p1, light), (p2, full)):
            with open(p, 'w', encoding='utf-8') as f:
                json.dump(d, f, ensure_ascii=False, separators=(',', ':'))
        print(f'{L}: {len(light["books"])} 本 / {len(light["items"])} 课  '
              f'轻量 {os.path.getsize(p1)//1024}KB  正文 {os.path.getsize(p2)//1024}KB')
