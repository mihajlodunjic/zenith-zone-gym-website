import { createReadStream } from 'node:fs';
import { access, stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(projectRoot, 'dist');
const portArgIndex = process.argv.indexOf('--port');
const port = portArgIndex >= 0 ? Number(process.argv[portArgIndex + 1]) : 4173;

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8'
};

function getContentType(filePath) {
  return mimeTypes[path.extname(filePath)] ?? 'application/octet-stream';
}

async function resolveFile(requestUrl) {
  const url = requestUrl === '/' ? '/index.html' : requestUrl;
  const resolved = path.normalize(path.join(distDir, url));

  if (!resolved.startsWith(distDir)) {
    return path.join(distDir, '404.html');
  }

  try {
    const fileStats = await stat(resolved);
    return fileStats.isDirectory() ? path.join(resolved, 'index.html') : resolved;
  } catch {
    return path.join(distDir, '404.html');
  }
}

await access(path.join(distDir, 'index.html')).catch(() => {
  throw new Error('Missing dist/index.html. Run "npm run build" before preview.');
});

const server = http.createServer(async (request, response) => {
  const filePath = await resolveFile(request.url || '/');
  const stream = createReadStream(filePath);

  response.setHeader('Content-Type', getContentType(filePath));
  response.statusCode = filePath.endsWith('404.html') ? 404 : 200;

  stream.pipe(response);
});

server.listen(port, () => {
  console.log(`Preview server running at http://localhost:${port}`);
});
