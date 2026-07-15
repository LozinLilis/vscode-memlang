const vscode = require('vscode');

const DIRECTIVES = [
  ['where', '声明坐标'],
  ['overlap', '软归属分布'],
  ['topics', '话题词列表'],
  ['ties', '关联关系'],
  ['text', '正文'],
];

const FIELD_KEYS = [
  ['room', '主题房间'],
  ['scope', '场景归属'],
  ['state', '热度状态'],
  ['purpose', '功能分类'],
  ['owner', '所属主体'],
  ['speaker', '说话主体'],
  ['authority', '权威权重（float）'],
];

const STATES = ['hot', 'warm', 'cold', 'permanent'];
const OWNERS = ['agent', 'user'];
const SPEAKERS = ['agentY', 'userX', 'tool', 'system'];

const RELATIONS = [
  'supports', 'contradicts', 'supersedes',
  'derived_from', 'related_to', 'explains',
  'requires', 'blocks',
];

let eidIndex = new Set();

async function refreshEidIndex() {
  eidIndex.clear();
  if (!vscode.workspace.workspaceFolders) return;
  const files = await vscode.workspace.findFiles('**/*.mem');
  for (const file of files) {
    try {
      const content = (await vscode.workspace.fs.readFile(file)).toString();
      for (const m of content.matchAll(/@memory\s+(\S+)/g)) eidIndex.add(m[1]);
    } catch (_) {}
  }
}

function activate(ctx) {
  refreshEidIndex();
  const w = vscode.workspace.createFileSystemWatcher('**/*.mem');
  w.onDidChange(() => refreshEidIndex());
  w.onDidCreate(() => refreshEidIndex());
  w.onDidDelete(() => refreshEidIndex());
  ctx.subscriptions.push(w);

  ctx.subscriptions.push(
    vscode.languages.registerCompletionItemProvider('memlang', {
      provideCompletionItems(document, position) {
        const before = document.lineAt(position).text.substring(0, position.character);
        const word = document.getWordRangeAtPosition(position, /[a-zA-Z0-9_-]+/);
        const typed = word ? document.getText(word) : '';
        const items = [];

        // @ 后→block+directive
        if (/@\w*$/.test(before)) {
          const partial = (before.match(/@(\w*)$/) || ['', ''])[1];
          for (const [n, d] of DIRECTIVES) {
            if (n.startsWith(partial)) items.push(mk('@' + n, vscode.CompletionItemKind.Keyword, d));
          }
          return items;
        }

        const ctx = blockCtx(document, position);
        if (!ctx) return [];

        if (ctx === 'where') {
          for (const [k, d] of FIELD_KEYS) {
            if (k.startsWith(typed)) items.push(mk(k + ':', vscode.CompletionItemKind.Field, d));
          }
          return items;
        }

        if (ctx === 'after-state') return STATES.map(s => mk(s, vscode.CompletionItemKind.EnumMember, '热/温/冷/永久'));
        if (ctx === 'after-owner') return OWNERS.map(s => mk(s, vscode.CompletionItemKind.EnumMember, 'user/agent'));
        if (ctx === 'after-speaker') return SPEAKERS.map(s => mk(s, vscode.CompletionItemKind.EnumMember, '说话主体'));
        if (ctx === 'after-authority') {
          return ['0.25', '0.5', '0.75', '1.0'].map(s => mk(s, vscode.CompletionItemKind.Value, '权威权重（float）'));
        }

        if (ctx === 'ties-rel') {
          for (const r of RELATIONS) {
            if (r.startsWith(typed)) items.push(mk(r + ':', vscode.CompletionItemKind.EnumMember, '关系'));
          }
          return items;
        }

        if (ctx === 'ties-eid') {
          for (const eid of eidIndex) items.push(mk(eid, vscode.CompletionItemKind.Reference, ''));
          return items;
        }

        return items;
      }
    }, '@', ' ')
  );
}

function blockCtx(doc, pos) {
  const ln = doc.lineAt(pos).text.substring(0, pos.character);

  if (/state:\s*$/.test(ln)) return 'after-state';
  if (/owner:\s*$/.test(ln)) return 'after-owner';
  if (/speaker:\s*$/.test(ln)) return 'after-speaker';
  if (/authority:\s*$/.test(ln)) return 'after-authority';

  let inTies = false;
  for (let i = pos.line; i >= 0; i--) {
    const t = doc.lineAt(i).text;
    if (/@ties\b/.test(t)) { inTies = true; break; }
    if (/^\s*}\s*$/.test(t) && !/@/.test(doc.lineAt(Math.max(i - 3, 0)).text)) break;
  }
  if (inTies) {
    if (/:\s*$/.test(ln)) return 'ties-eid';
    return 'ties-rel';
  }

  for (let i = pos.line; i >= 0; i--) {
    const t = doc.lineAt(i).text;
    if (/@where\b/.test(t)) return 'where';
    if (/\}\s*$/.test(t) && !/@/.test(doc.lineAt(i).text)) break;
  }

  return null;
}

function mk(label, kind, detail) {
  const i = new vscode.CompletionItem(label, kind);
  i.insertText = label;
  i.detail = detail || '';
  return i;
}

function deactivate() {}
module.exports = { activate, deactivate };
