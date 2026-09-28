import {spawn} from 'node:child_process';
import {createWriteStream} from 'node:fs';
const [label, ...args] = process.argv.slice(2);
if (!label || !args.length || !/^[a-z0-9-]+$/.test(label)) throw new Error('label and pnpm arguments required');
const root = '/tmp/shopify-deeplumen-bfs-20260916.4YK5eB';
const env = {
  PATH: `/Users/zezedabaobei/.local/share/mise/installs/node/24.19.0/bin:${process.env.PATH}`,
  HOME: process.env.HOME,
  TMPDIR: '/tmp',
  CI: '1',
  SHOPIFY_API_KEY: 'bfs-audit-synthetic-api-key',
  SHOPIFY_API_SECRET: 'bfs-audit-synthetic-api-secret',
  SHOPIFY_APP_URL: 'https://audit.example.test',
  SCOPES: 'read_content,read_products,write_app_proxy,read_themes,write_themes,write_online_store_navigation,write_products,write_content,read_orders,read_files,write_files',
  PARTNER_API_ORG_ID: '1001',
  PARTNER_API_ACCESS_TOKEN: 'bfs-audit-synthetic-partner-token',
  PARTNER_API_APP_ID: '2001',
  PARTNER_API_VERSION: '2026-07',
  CPS_METER_HANDLE: 'ap-commission-cf',
  DATABASE_URL: 'postgresql://bfs_audit:bfs_audit@127.0.0.1:65432/bfs_audit',
  CPS_TEST_DATABASE_URL: 'postgresql://bfs_audit:bfs_audit@127.0.0.1:65432/bfs_audit',
  REDIS_URL: 'redis://127.0.0.1:65433',
  ES_URL: 'http://127.0.0.1:65434',
};
const started = Date.now();
const log = createWriteStream(`${root}/${label}.log`);
const child = spawn('pnpm', args, {cwd: `${root}/repo`, env, stdio: ['ignore','pipe','pipe']});
child.stdout.pipe(log, {end: false});
child.stderr.pipe(log, {end: false});
child.on('error', error => {console.error(error.message); process.exitCode = 1;});
child.on('close', code => {
  log.end();
  console.log(JSON.stringify({label,command:['pnpm',...args],exitCode:code,durationSeconds:(Date.now()-started)/1000,log:`${root}/${label}.log`}));
  process.exitCode = code ?? 1;
});
