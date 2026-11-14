const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const env = { B4BSTATS_API_URL: 'https://api.example.test', B4BSTATS_PROXY_TOKEN: 'a'.repeat(64) };
let transport,
  calls = [];
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} };
  cache.set(file, module);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  const localRequire = (name) =>
    name.startsWith('@utils/')
      ? load(path.join(root, 'src/utils', name.slice(7) + '.ts'))
      : require(name);
  vm.runInNewContext(
    code,
    {
      module,
      exports: module.exports,
      require: localRequire,
      process: { env },
      URLSearchParams,
      AbortSignal,
      fetch: async (...args) => {
        calls.push(args);
        return transport(...args);
      },
    },
    { filename: file },
  );
  return module.exports;
}
const { default: handler, config } = load(path.join(root, 'src/pages/api/game/[...path].ts'));
function response() {
  return {
    code: 200,
    headers: {},
    body: undefined,
    setHeader(key, value) {
      this.headers[key] = value;
    },
    status(code) {
      this.code = code;
      return this;
    },
    json(body) {
      this.body = body;
    },
    send(body) {
      this.body = body;
    },
    end() {},
  };
}
const request = (parts = ['community', 'weapons']) => ({
  query: { path: parts },
  method: 'GET',
  socket: { remoteAddress: '203.0.113.1' },
  headers: {
    'x-forwarded-for': '198.51.100.1',
    'x-b4bstats-client-ip': '198.51.100.2',
    'x-b4bstats-proxy-token': 'attacker',
    authorization: 'Bearer private-operator-token',
  },
});
(async () => {
  transport = async () => new Response('{"data":[]}', { status: 200 });
  let res = response();
  await handler(request(), res);
  assert.equal(res.code, 200);
  assert.equal(calls[0][1].headers['x-b4bstats-client-ip'], '203.0.113.1');
  assert.equal(calls[0][1].headers['x-b4bstats-proxy-token'], env.B4BSTATS_PROXY_TOKEN);
  assert.equal(calls[0][1].headers.authorization, undefined);
  assert.equal(config.api.bodyParser.sizeLimit, '16kb');
  env.B4BSTATS_TRUSTED_PROXIES = '127.0.0.1';
  const proxied = request();
  proxied.socket.remoteAddress = '127.0.0.1';
  proxied.headers['x-forwarded-for'] = '192.0.2.99,198.51.100.1';
  res = response();
  await handler(proxied, res);
  assert.equal(calls.at(-1)[1].headers['x-b4bstats-client-ip'], '198.51.100.1');
  const token = env.B4BSTATS_PROXY_TOKEN;
  delete env.B4BSTATS_PROXY_TOKEN;
  res = response();
  await handler(request(), res);
  assert.equal(Object.keys(calls.at(-1)[1].headers).length, 0);
  env.B4BSTATS_PROXY_TOKEN = token;
  for (const body of [
    'private-path-and-token',
    '{"error":{"code":"AUTH_EXPIRED","message":"private-path-and-token"}}',
  ]) {
    transport = async () => new Response(body, { status: 503 });
    res = response();
    await handler(request(), res);
    assert.equal(res.code, 503);
    assert.equal(res.body.error.code, 'SERVICE_UNAVAILABLE');
    assert.ok(!JSON.stringify(res.body).includes('private'));
  }
  calls = [];
  res = response();
  await handler(request(['operations']), res);
  assert.equal(res.code, 404);
  assert.equal(calls.length, 0);
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  transport = async () => {
    await gate;
    return new Response('{"data":[]}', { status: 200 });
  };
  const pending = Array.from({ length: 64 }, () => {
    const res = response();
    return handler(request(), res).then(() => res);
  });
  res = response();
  await handler(request(), res);
  assert.equal(res.code, 503);
  assert.equal(res.headers['Retry-After'], '5');
  release();
  assert.ok((await Promise.all(pending)).every((res) => res.code === 200));
  transport = async () => new Response('{"data":[]}', { status: 200 });
  res = response();
  await handler(request(), res);
  assert.equal(res.code, 200);
  assert.equal(res.headers['Cache-Control'], 'no-store');
  assert.equal(res.headers['X-Content-Type-Options'], 'nosniff');
  console.log(
    'Proxy security checks passed: authenticated IP claims, spoof rejection, no operator-header forwarding, safe errors, blocked operations and concurrency cleanup.',
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
