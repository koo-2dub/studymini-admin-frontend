import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const port = Number(process.env.PORT || 4173);
const root = process.cwd();
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };

createServer((req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${port}`);
  let file = normalize(join(root, decodeURIComponent(url.pathname)));
  if (!file.startsWith(root)) file = join(root, 'index.html');
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) file = join(root, 'index.html');
  res.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
  createReadStream(file).pipe(res);
}).listen(port, '0.0.0.0', () => console.log(`Serving Studymini admin at http://0.0.0.0:${port}`));
