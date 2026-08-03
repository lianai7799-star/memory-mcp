import { TOOLS, SERVER_INFO, SERVER_CAPABILITIES } from '../lib/tools.js';
import { handleAction } from '../lib/memory.js';

export const config = { maxDuration: 60 };

function getToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) return authHeader.slice(7);
  return req.query.token;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = getToken(req);
  if (token !== process.env.MCP_AUTH_TOKEN) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    const baseUrl = `https://${req.headers.host}`;
    const sessionId = crypto.randomUUID();
    const endpoint = `${baseUrl}/api/message?sessionId=${sessionId}`;
    res.write(`event: endpoint\ndata: ${endpoint}\n\n`);
    const keepAlive = setInterval(() => { res.write(`: keepalive\n\n`); }, 15000);
    req.on('close', () => clearInterval(keepAlive));
    return;
  }
  res.status(405).json({ error: 'Method not allowed' });
}
