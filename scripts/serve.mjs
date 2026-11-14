import { existsSync, cpSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawn } from 'node:child_process';
const root = process.cwd();
if (existsSync('.env.local')) {
  const environment = { ...process.env };
  process.loadEnvFile('.env.local');
  Object.assign(process.env, environment);
}
const dist = process.env.NEXT_DIST_DIR || '.next/main';
const output = resolve(root, dist, 'standalone');
const server = join(output, 'server.js');
if (!existsSync(server)) throw new Error('Production output is missing. Run pnpm build first.');
cpSync(resolve(root, 'public'), join(output, 'public'), { recursive: true });
cpSync(resolve(root, dist, 'static'), join(output, dist, 'static'), { recursive: true });
const child = spawn(process.execPath, [server], {
  cwd: output,
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production' },
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', (code) => {
  process.exitCode = code ?? 0;
});
