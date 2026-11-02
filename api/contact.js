module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });
  const b = req.body || {};
  const name = String(b.name || '').trim();
  const email = String(b.email || '').trim();
  const message = String(b.message || '').trim();
  if (b.website) return res.status(200).json({ ok: true });
  if (!name || name.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120 || !message || message.length > 1000)
    return res.status(400).json({ error: 'invalid input' });
  const text = 'KV contact\nName: ' + name + '\nEmail: ' + email + '\n' + message;
  const hook = process.env.CONTACT_WEBHOOK_URL;
  if (hook) {
    try {
      const r = await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, content: text }) });
      if (!r.ok) return res.status(502).json({ error: 'delivery failed' });
    } catch (e) {
      return res.status(502).json({ error: 'delivery failed' });
    }
  } else {
    console.log(text);
  }
  return res.status(200).json({ ok: true });
};
