const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const pages = ['index.html', '404.html'].map((f) => [f, fs.readFileSync(path.join(root, f), 'utf8')]);
test('no inline style attributes (blocked by CSP)', () => { for (const [f, s] of pages) assert.ok(!/\sstyle=/.test(s), f); });
test('no inline scripts except JSON-LD', () => {
  for (const [f, s] of pages) for (const m of s.matchAll(/<script([^>]*)>/g)) assert.ok(/src=|ld\+json/.test(m[1]), f);
});
test('local assets referenced by pages exist', () => {
  for (const [f, s] of pages) for (const m of s.matchAll(/(?:href|src)="([^"#:]+?)"/g)) { let p = m[1].replace(/^\//, '').split('?')[0]; if (p.startsWith('api/')) p += '.js'; assert.ok(fs.existsSync(path.join(root, p)), f + ' -> ' + m[1]); }
});
test('CSP forbids unsafe-inline scripts in meta and vercel.json', () => {
  assert.ok(!/script-src[^;]*unsafe/.test(pages[0][1]));
  assert.ok(!/script-src[^;]*unsafe/.test(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8')));
});
