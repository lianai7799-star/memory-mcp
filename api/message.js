import { TOOLS, SERVER_INFO, SERVER_CAPABILITIES } from '../lib/tools.js';
import { handleAction } from '../lib/memory.js';

function getToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) return authHeader.slice(7);
  return req.query.token;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = getToken(req);
  if (token !== process.env.MCP_AUTH_TOKEN) return res.status(401).json({ error: 'Unauthorized' });

  const body = req.body;
  if (!body || !body.jsonrpc) return res.status(400).json({ error: 'Invalid JSON-RPC request' });

  const { id, method, params } = body;
  try {
    let result;
    switch (method) {
      case 'initialize':
        result = { protocolVersion: "2024-11-05", serverInfo: SERVER_INFO, capabilities: SERVER_CAPABILITIES };
        break;
      case 'notifications/initialized':
        return res.status(200).json({ jsonrpc: '2.0', id, result: {} });
      case 'tools/list':
        result = { tools: TOOLS };
        break;
      case 'tools/call': {
        const toolName = params?.name;
        const toolArgs = params?.arguments || {};
        if (toolName !== 'memory') {
          result = { content: [{ type: 'text', text: JSON.stringify({ error: `Unknown tool: ${toolName}` }) }], isError: true };
          break;
        }
        const { action, ...restArgs } = toolArgs;
        const actionResult = await handleAction(action, restArgs);
        result = { content: [{ type: 'text', text: JSON.stringify(actionResult, null, 2) }] };
        break;
      }
      case 'ping':
        result = {};
        break;
      default:
        return res.status(200).json({ jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } });
    }
    return res.status(200).json({ jsonrpc: '2.0', id, result });
  } catch (err) {
    return res.status(200).json({ jsonrpc: '2.0', id, error: { code: -32000, message: err.message || String(err) } });
  }
}
