/**
 * 笔记面板：编辑 / 预览 / 保存 / 触发同步
 * 保存策略：输入即写 localStorage（绝不丢），1.2 秒防抖后推到私有仓库。
 */
const Notes = (() => {
  let currentId = null;
  let sync = null;
  let saveTimer = null;
  let mode = 'preview';    // edit | preview —— 默认预览，避免一进页面就弹出键盘
  let onChange = null;

  const $input = () => document.getElementById('note-input');
  const $prev = () => document.getElementById('note-preview');
  const $status = () => document.getElementById('note-status');
  const N = () => window.I18N.notes;

  function attach(syncInstance, changeCb) {
    sync = syncInstance;
    onChange = changeCb;

    const input = $input();
    if (input && !input._bound) {
      input._bound = true;
      input.addEventListener('input', () => {
        const id = currentId;
        if (!id) return;
        const text = input.value;
        Store.update(Store.K.NOTES, {}, n => {
          n[id] = { text, updatedAt: new Date().toISOString() };
          return n;
        });
        setStatus(N().saved);
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => { if (sync) sync.schedulePush(); }, 1200);
        if (onChange) onChange();
      });
    }

    const bp = document.getElementById('btn-note-preview');
    const be = document.getElementById('btn-note-edit');
    const bc = document.getElementById('btn-note-clear');
    const bs = document.getElementById('btn-note-sync');
    if (bp) bp.textContent = N().preview;
    if (be) be.textContent = N().edit;
    if (bc) bc.textContent = N().clear;
    if (bs) bs.textContent = N().syncNow;
    if (bp && !bp._bound) { bp._bound = true; bp.onclick = () => setMode('preview'); }
    if (be && !be._bound) { be._bound = true; be.onclick = () => setMode('edit'); }
    if (bc && !bc._bound) { bc._bound = true; bc.onclick = clearCurrent; }
    if (bs && !bs._bound) {
      bs._bound = true;
      bs.onclick = async () => {
        if (!sync) return toast(window.I18N.toast.needLogin);
        setStatus(N().syncing);
        const ok = await sync.syncNow();
        setStatus(ok ? `${window.I18N.sync.ok} · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : window.I18N.sync.failed);
      };
    }
  }

  function setMode(m) {
    mode = m;
    const input = $input(), prev = $prev();
    const bp = document.getElementById('btn-note-preview');
    const be = document.getElementById('btn-note-edit');
    if (bp) bp.classList.toggle('active', m === 'preview');
    if (be) be.classList.toggle('active', m === 'edit');
    if (m === 'edit') {
      input.hidden = false; prev.hidden = true; input.focus();
    } else {
      prev.innerHTML = MD.render(input.value || N().emptyPreview);
      input.hidden = true; prev.hidden = false;
    }
  }

  function setStatus(s) { const el = $status(); if (el) el.textContent = s; }

  function load(lessonId) {
    currentId = lessonId;
    if (!lessonId) return;
    const notes = Store.get(Store.K.NOTES, {}) || {};
    const item = notes[lessonId];
    const text = typeof item === 'string' ? item : (item?.text || '');
    $input().value = text;
    setMode(mode === 'edit' ? 'edit' : 'preview');
    const at = Store.get(Store.K.SYNCED_AT, 0);
    setStatus(at
      ? `${window.I18N.sync.ok} ${new Date(at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      : N().saved);
  }

  function clearCurrent() {
    if (!currentId) return;
    if (!confirm(N().confirmClear)) return;
    Store.update(Store.K.NOTES, {}, n => {
      n[currentId] = { text: '', updatedAt: new Date().toISOString() };
      return n;
    });
    $input().value = '';
    setMode('preview');
    if (sync) sync.schedulePush();
    if (onChange) onChange();
    setStatus(N().cleared);
  }

  function exportAll(toc, book) {
    const notes = Store.get(Store.K.NOTES, {}) || {};
    const title = book ? `${book.title} · ` : '';
    const lines = [`# ${title}${window.I18N.notes.title.replace('📝 ', '')}`, '',
      `> ${new Date().toLocaleString()}`, ''];
    const prefix = book ? book.id + '/' : '';
    for (const ch of (toc || [])) {
      lines.push(`## ${ch.title}`, '');
      for (const it of ch.items) {
        const n = notes[prefix + it.id];
        const t = typeof n === 'string' ? n : (n?.text || '');
        if (!t.trim()) continue;
        lines.push(`### ${it.title}`, '', t, '');
      }
    }
    return lines.join('\n');
  }

  function toast(m) { window.__toast && window.__toast(m); }

  return { attach, load, exportAll, get currentId() { return currentId; } };
})();
