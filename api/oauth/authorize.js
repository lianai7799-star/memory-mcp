export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { client_id, redirect_uri, state, response_type } = req.query;
  if (req.method === 'GET') {
    const html = `<!DOCTYPE html><html><head><title>Memory MCP Auth</title><style>body{font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#f5f5f5}.card{background:white;padding:40px;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.1);text-align:center}button{background:#000;color:white;border:none;padding:12px 32px;border-radius:8px;font-size:16px;cursor:pointer}</style></head><body><div class="card"><h2>Memory MCP</h2><p>Allow Claude to access your memory database?</p><form method="POST"><input type="hidden" name="redirect_uri" value="${redirect_uri || ''}"><input type="hidden" name="state" value="${state || ''}"><input type="hidden" name="client_id" value="${client_id || ''}"><button type="submit">Authorize</button></form></div></body></html>`;
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  }
  if (req.method === 'POST') {
    const rUri = req.body?.redirect_uri || req.query.redirect_uri;
    const st = req.body?.state || req.query.state;
    const code = 'memory_auth_' + Date.now();
    const redirectUrl = `${rUri}${rUri.includes('?') ? '&' : '?'}code=${code}&state=${st || ''}`;
    return res.redirect(302, redirectUrl);
  }
  res.status(405).json({ error: 'Method not allowed' });
}
