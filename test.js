// Self-check for placeholder filling and in-place replacement: node test.js
const vm = require('vm'), fs = require('fs'), assert = require('assert');
const ctx = {}; vm.runInNewContext(fs.readFileSync(__dirname + '/Code.gs', 'utf8'), ctx);
const H = ['Name', 'Course', 'Email'], R = ['Ana <3', 'Intro {{Name}}', 'a@x.com'];
assert.equal(ctx.fill_('Hi {{ Name }}, {{Missing}}done', H, R), 'Hi Ana <3, done');
assert.equal(ctx.fill_('{{Name}}', H, R, true), 'Ana &lt;3');

// Fake Docs section: findText/deleteText/insertText over one string.
function section(s) {
  const text = {
    getText: () => s,
    deleteText: (a, b) => { s = s.slice(0, a) + s.slice(b + 1); },
    insertText: (a, v) => { s = s.slice(0, a) + v + s.slice(a); },
  };
  return {
    get: () => s,
    findText(p) {
      const m = new RegExp(p).exec(s);
      return m && { getElement: () => ({ asText: () => text }), getStartOffset: () => m.index, getEndOffsetInclusive: () => m.index + m[0].length - 1 };
    },
  };
}
const sec = section('Certificate: {{Name}} completed {{Course}}. {{Nope}}End');
ctx.replacePlaceholders_(sec, H, R); // must terminate even though a value contains {{Name}}
assert.equal(sec.get(), 'Certificate: Ana <3 completed Intro { {Name}}. End');
console.log('ok');
