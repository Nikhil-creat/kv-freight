const { status } = require('./_llm');
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const deep = req.query && req.query.deep === '1';
  res.status(200).json({ ok: true, providers: await status(deep), webhookConfigured: Boolean(process.env.CONTACT_WEBHOOK_URL), time: new Date().toISOString() });
};
