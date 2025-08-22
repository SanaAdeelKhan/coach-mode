const store = new Map(); // sessionId -> steps[]

export function appendStep(req, res) {
  const { sessionId = "default", step } = req.body || {};
  const cur = store.get(sessionId) || [];
  cur.push({ ...step, t: new Date().toISOString() });
  store.set(sessionId, cur);
  res.json({ ok: true, count: cur.length });
}

export function getTranscript(req, res) {
  const { sessionId } = req.params;
  res.json({ sessionId, steps: store.get(sessionId) || [] });
}
