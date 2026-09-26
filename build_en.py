#!/usr/bin/env python3
"""
从 zh/index.html 生成 en/index.html。

两个语言站共享同一份 css/ 与 js/，只有文案与内容路径不同。
每次改过 zh/index.html 后都要跑一次本脚本 —— 手工改 en 迟早漏字段，
之前就因为只做局部替换，把英文站的 <title> 覆盖回了中文。
"""
import re, sys

SRC = 'zh/index.html'
DST = 'en/index.html'

# (中文原文, 英文替换)，按顺序逐条替换，缺一条就会漏翻
REPLACES = [
    ('<html lang="zh-CN">', '<html lang="en">'),
    ('<title>AnyLearn · 通学万义</title>', '<title>AnyLearn · Learn Anything</title>'),
    ('content="AnyLearn 通学万义 —— 浏览器内真跑代码的编程教程，会记笔记、按艾宾浩斯曲线安排复习"',
     'content="AnyLearn — programming tutorials that actually run in your browser, with notes and Ebbinghaus-spaced review"'),
    ('<p class="slogan">通学万义</p>', '<p class="slogan">Learn Anything</p>'),
    ('<span class="title">AnyLearn<small>通学万义</small></span>',
     '<span class="title">AnyLearn<small>Learn Anything</small></span>'),
    ('<div class="loading">加载目录…</div>', '<div class="loading">Loading…</div>'),
    ('<div class="loading">加载中…</div>', '<div class="loading">Loading…</div>'),
    ('<span class="notes-title">📝 本节笔记</span>', '<span class="notes-title">📝 Notes</span>'),
    ('id="btn-note-preview">预览<', 'id="btn-note-preview">Preview<'),
    ('id="btn-note-edit">编辑<', 'id="btn-note-edit">Edit<'),
    ('id="btn-note-clear">清空<', 'id="btn-note-clear">Clear<'),
    ('id="btn-note-sync">立即同步<', 'id="btn-note-sync">Sync now<'),
    ('<span class="sync-text">未连接</span>', '<span class="sync-text">Offline</span>'),
    ('<a href="../en/">English →</a>', '<a href="../zh/">中文 →</a>'),
    ("window.AL_CONFIG = { lang: 'zh', content: '../content/zh' };",
     "window.AL_CONFIG = { lang: 'en', content: '../content/en' };"),
    ('<script src="../i18n/zh.js', '<script src="../i18n/en.js'),
    ('<!-- ===================== 登录门 ===================== -->',
     '<!-- ===================== Sign-in gate ===================== -->'),
    ('<!-- ===================== 主应用 ===================== -->',
     '<!-- ===================== Main app ===================== -->'),
    ('aria-label="目录"', 'aria-label="Table of contents"'),
    ('aria-label="笔记"', 'aria-label="Notes"'),
    ('aria-label="代码实验室" title="代码实验室"', 'aria-label="Code lab" title="Code lab"'),
    ('<!-- ===================== 代码实验室（全屏面板） ===================== -->',
     '<!-- ===================== Code lab (full-screen panel) ===================== -->'),
]


def build():
    s = open(SRC, encoding='utf-8').read()
    missing = []
    for zh, en in REPLACES:
        if zh not in s:
            missing.append(zh)
        s = s.replace(zh, en)
    open(DST, 'w', encoding='utf-8').write(s)

    # 自检：英文站不该再出现中文（排除"中文 →"这个切换链接本身）
    body = s.replace('中文 →', '')
    cn = re.findall(r'[一-鿿]{2,}', body)
    if cn:
        print('⚠️  英文站仍有中文残留：', sorted(set(cn))[:12])
    if missing:
        print('⚠️  未匹配到的规则（zh 结构可能已改）：')
        for m in missing:
            print('   ', m[:70])
        return 1
    print(f'✓ {DST} 已生成（{len(s)} 字节）' + ('，无中文残留' if not cn else '，⚠️ 有残留'))
    return 0


if __name__ == '__main__':
    sys.exit(build())
