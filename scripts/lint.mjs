import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { buildSite } from './build.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const { distDir } = await buildSite();
const html = await readFile(path.join(distDir, 'index.html'), 'utf8');
const sourceFiles = await Promise.all([
  readFile(path.join(projectRoot, 'src', 'templates', 'home.js'), 'utf8'),
  readFile(path.join(projectRoot, 'src', 'templates', 'layout.js'), 'utf8'),
  readFile(path.join(projectRoot, 'src', 'scripts', 'site.js'), 'utf8')
]);
const sourceBlob = sourceFiles.join('\n');

assert(!/Lorem ipsum/i.test(sourceBlob), 'Placeholder copy detected.');
assert(!/TODO/i.test(sourceBlob), 'TODO comment detected in source.');
assert(!/console\.log/.test(sourceBlob), 'console.log detected in source.');
assert(/<html lang="sr-Latn">/.test(html), 'Document lang attribute is missing or incorrect.');
assert((html.match(/<h1>/g) || []).length === 1, 'Homepage must contain exactly one H1.');
assert(/aria-controls="primary-navigation"/.test(html), 'Mobile navigation control is missing ARIA wiring.');
assert(/data-faq-trigger/.test(html), 'FAQ accordion triggers are missing.');
assert(/Pređi na glavni sadržaj/.test(html), 'Skip link is missing.');

console.log('Lint checks passed.');
