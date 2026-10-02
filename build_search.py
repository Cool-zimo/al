#!/usr/bin/env python3
"""
生成全站搜索索引 content/{lang}/search-index.json。

只收「教材名 + 目录」：书名、副标题、简介、标签、作者、章标题、课标题、引言。
不收正文 —— 搜正文听着好，实际噪音太大（任何词都能命中几十篇课文，
真正想找的那篇反而被淹），而且索引要大十倍。

索引里也不存代码：代码里全是 print、return 这类高频词，存进去全是噪音。
"""
import os, re, json, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
CONTENT = os.path.join(ROOT, 'content')


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
        d = build(L)
        p = os.path.join(CONTENT, L, 'search-index.json')
        with open(p, 'w', encoding='utf-8') as f:
            json.dump(d, f, ensure_ascii=False, separators=(',', ':'))
        print(f'{L}: {len(d["books"])} 本 / {len(d["items"])} 课 / '
              f'{os.path.getsize(p)//1024}KB')
