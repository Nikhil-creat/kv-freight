const { ask } = require('./_llm');
const hits = new Map();
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60000);
  if (recent.length >= 10) return res.status(429).json({ error: 'rate limit' });
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  const { q, ctx } = req.body || {};
  if (typeof q !== 'string' || typeof ctx !== 'string' || !q.trim() || q.length > 300 || ctx.length > 4000)
    return res.status(400).json({ error: 'invalid input' });
  if (/ignore (all|previous)|system prompt|jailbreak/i.test(q)) return res.status(400).json({ error: 'blocked' });
  try {
    return res.status(200).json(await ask(q, ctx));
  } catch (e) {
    return res.status(e.status === 503 ? 503 : 502).json({ error: e.status === 503 ? 'LLM not configured' : 'upstream error' });
  }
};
