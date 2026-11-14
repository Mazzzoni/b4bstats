import { publicApiError } from '@utils/publicApiError';
import { clientIp } from '@utils/clientIp';
import type { NextApiRequest, NextApiResponse } from 'next';
export const config = { api: { bodyParser: { sizeLimit: '16kb' } } };
let activeRequests = 0;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  const parts = req.query.path;
  if (!Array.isArray(parts) || !parts.length || parts.some((p) => p === '..' || p.includes('/'))) {
    res.status(400).json({ error: { message: 'Invalid API path' } });
    return;
  }
  const path = '/' + parts.map(encodeURIComponent).join('/');
  if (
    !/^\/(players|community|leaderboards|health|ready)(\/|$)/.test(path) ||
    !['GET', 'POST'].includes(req.method ?? '') ||
    (req.method === 'POST' && !path.endsWith('/refresh'))
  ) {
    res.status(404).end();
    return;
  }
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'path') continue;
    for (const item of Array.isArray(value) ? value : [value])
      if (item !== undefined) query.append(key, item);
  }
  if (activeRequests >= 64) {
    res.setHeader('Retry-After', '5');
    res.status(503).json({
      error: { code: 'SERVICE_BUSY', message: 'The service is busy. Please try again later.' },
    });
    return;
  }
  activeRequests++;
  try {
    const configuredBase = process.env.B4BSTATS_API_URL?.trim();
    if (!configuredBase) throw new Error('Service URL is not configured.');
    const base = configuredBase.replace(/\/$/, '');
    const headers: Record<string, string> = {};
    const token = process.env.B4BSTATS_PROXY_TOKEN?.trim();
    if (token) {
      const ip = clientIp(
        req.socket.remoteAddress,
        req.headers['x-forwarded-for'],
        process.env.B4BSTATS_TRUSTED_PROXIES ?? '',
      );
      if (ip) {
        headers['x-b4bstats-proxy-token'] = token;
        headers['x-b4bstats-client-ip'] = ip;
      }
    }
    const response = await fetch(base + path + (query.size ? '?' + query : ''), {
      method: req.method,
      headers,
      redirect: 'error',
      signal: AbortSignal.timeout(30000),
    });
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json');
    const retry = response.headers.get('retry-after');
    if (retry) res.setHeader('Retry-After', retry);
    const text = await response.text();
    if (!response.ok) {
      let code: unknown;
      try {
        code = JSON.parse(text).error?.code;
      } catch {
        /* The upstream body is private even when it is not JSON. */
      }
      res.status(response.status).json({ error: publicApiError(response.status, code) });
      return;
    }
    res.status(response.status).send(text);
  } catch {
    res.status(503).json({
      error: {
        code: 'UNAVAILABLE',
        message: 'The player service is temporarily unavailable. Please try again later.',
      },
    });
  } finally {
    activeRequests--;
  }
}
