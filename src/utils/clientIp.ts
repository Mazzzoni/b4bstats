import { BlockList, isIP } from 'node:net';

const normalize = (ip: string) =>
  ip.toLowerCase().startsWith('::ffff:') && isIP(ip.slice(7)) === 4 ? ip.slice(7) : ip;

/** Walk only known proxy hops, from the socket peer towards the original visitor. */
export function clientIp(
  peer: string | undefined,
  forwarded: string | string[] | undefined,
  trusted: string,
) {
  const socket = normalize(peer ?? '');
  if (!isIP(socket)) return undefined;
  const list = new BlockList();
  for (const entry of trusted
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)) {
    const [address, prefix, extra] = entry.split('/');
    const version = isIP(address);
    if (!version || extra !== undefined || (prefix !== undefined && !/^\d+$/.test(prefix)))
      throw new Error('Invalid B4BSTATS_TRUSTED_PROXIES');
    if (prefix !== undefined && Number(prefix) === 0)
      throw new Error('B4BSTATS_TRUSTED_PROXIES cannot trust every address');
    const type = version === 4 ? 'ipv4' : 'ipv6';
    if (prefix === undefined) list.addAddress(address, type);
    else list.addSubnet(address, Number(prefix), type);
  }
  const isTrusted = (ip: string) => list.check(ip, isIP(ip) === 4 ? 'ipv4' : 'ipv6');
  if (!isTrusted(socket) || typeof forwarded !== 'string') return socket;
  const chain = forwarded.split(',').map((value) => normalize(value.trim()));
  if (chain.length > 20 || chain.some((ip) => !isIP(ip))) return socket;
  let current = socket;
  for (let i = chain.length - 1; i >= 0 && isTrusted(current); i--) current = chain[i];
  return current;
}
