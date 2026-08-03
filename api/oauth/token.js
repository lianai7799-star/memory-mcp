export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { grant_type, code, refresh_token } = req.body || {};
  if (grant_type === 'authorization_code' && code) {
    return res.status(200).json({ access_token: process.env.MCP_AUTH_TOKEN, token_type: 'Bearer', expires_in: 31536000, refresh_token: 'memory_refresh_' + Date.now() });
  }
  if (grant_type === 'refresh_token' && refresh_token) {
    return res.status(200).json({ access_token: process.env.MCP_AUTH_TOKEN, token_type: 'Bearer', expires_in: 31536000, refresh_token: 'memory_refresh_' + Date.now() });
  }
  return res.status(400).json({ error: 'invalid_grant' });
}
