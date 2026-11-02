const test = require('node:test');
const assert = require('node:assert');
const llm = require('../api/_llm.js');
const real = global.fetch;
const json = (b, ok = true, status = 200) => ({ ok, status, json: async () => b });
function mock(routes) {
  global.fetch = async (url) => { for (const [k, v] of routes) if (String(url).includes(k)) return typeof v === 'function' ? v() : v; throw new Error('unrouted ' + url); };
}
test.beforeEach(() => { llm.reset(); process.env.GROQ_API_KEY = 'g'; process.env.GEMINI_API_KEY = 'm'; delete process.env.GROQ_MODEL; delete process.env.GEMINI_MODEL; });
test.after(() => { global.fetch = real; delete process.env.GROQ_API_KEY; delete process.env.GEMINI_API_KEY; });
const groqModels = json({ data: [{ id: 'whisper-large-v3' }, { id: 'llama-3.1-8b-instant' }, { id: 'llama-3.3-70b-versatile' }] });
const gemModels = json({ models: [{ name: 'models/text-embedding-004', supportedGenerationMethods: ['embedContent'] }, { name: 'models/gemini-2.0-flash', supportedGenerationMethods: ['generateContent'] }] });
test('order prefers known-good models and drops non-chat ones', () => {
  assert.deepEqual(llm.order(['x-new', 'llama-3.1-8b-instant', 'llama-3.3-70b-versatile'], 'groq'), ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'x-new']);
});
test('groq answers with auto-detected best model', async () => {
  mock([['/models', groqModels], ['chat/completions', json({ choices: [{ message: { content: 'hi' } }] })]]);
  const r = await llm.ask('q', 'c');
  assert.equal(r.provider, 'groq'); assert.equal(r.model, 'llama-3.3-70b-versatile');
});
test('falls back to gemini when groq is down', async () => {
  mock([['api.groq.com/openai/v1/models', groqModels], ['chat/completions', json({}, false, 500)], ['v1beta/models?', gemModels], [':generateContent', json({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] })]]);
  const r = await llm.ask('q', 'c');
  assert.equal(r.provider, 'gemini'); assert.equal(r.model, 'gemini-2.0-flash');
});
test('no keys gives 503 and all-fail gives 502', async () => {
  delete process.env.GROQ_API_KEY; delete process.env.GEMINI_API_KEY;
  await assert.rejects(llm.ask('q', 'c'), (e) => e.status === 503);
  process.env.GROQ_API_KEY = 'g';
  mock([['/models', json({}, false, 401)]]);
  await assert.rejects(llm.ask('q', 'c'), (e) => e.status === 502);
});
