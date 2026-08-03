export default function handler(req, res) {
  const host = `https://${req.headers.host}`;
  res.status(200).json({
    issuer: host,
    authorization_endpoint: `${host}/api/oauth/authorize`,
    token_endpoint: `${host}/api/oauth/token`,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"]
  });
}
