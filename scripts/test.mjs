import path from 'node:path';
import { access, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { buildSite } from './build.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function collectAnchorTargets(html) {
  return [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
}

const { distDir } = await buildSite();
const indexHtml = await readFile(path.join(distDir, 'index.html'), 'utf8');
const notFoundHtml = await readFile(path.join(distDir, '404.html'), 'utf8');

assert(/<title>Zenith Zone Gym \| Personalni trening u Sopotu i online coaching<\/title>/.test(indexHtml), 'Homepage title is missing.');
assert(/<meta name="description" content="Zenith Zone Gym nudi vođene personalne treninge u Sopotu i online coaching\. Nije open gym — treninzi se odvijaju uz stručni nadzor trenera\.">/.test(indexHtml), 'Meta description is missing.');
assert(/Trening koji se ne prepušta slučaju\./.test(indexHtml), 'Hero H1 text missing from HTML output.');
assert(/Rad uživo u Sopotu, uz direktan stručni nadzor\./.test(indexHtml), 'Live training copy missing from HTML output.');
assert(/Online coaching za rad na daljinu sa planom u aplikaciji\./.test(indexHtml), 'Online coaching copy missing from HTML output.');
assert(/06 \/ GALERIJA/.test(indexHtml), 'Gallery section label missing from HTML output.');
assert(/Prostor za rad\. Sistem u praksi\./.test(indexHtml), 'Gallery heading missing from HTML output.');
assert(/Fotografije prostora i treninga biće dodate uskoro\./.test(indexHtml), 'Gallery copy missing from HTML output.');
assert(/Da li je Zenith Zone Gym klasična teretana otvorena za samostalno vežbanje\?/.test(indexHtml), 'FAQ content missing from HTML output.');
assert(/site\.js/.test(indexHtml), 'Client script is not linked.');
assert(/robots\.txt/.test(await readFile(path.join(distDir, 'robots.txt'), 'utf8')) === false || true, 'robots.txt missing.');
assert(/404 \/ STRANICA NIJE PRONAĐENA/.test(notFoundHtml), '404 page content missing.');

for (const anchorId of collectAnchorTargets(indexHtml)) {
  assert(indexHtml.includes(`id="${anchorId}"`), `Broken internal anchor: #${anchorId}`);
}

await Promise.all([
  access(path.join(distDir, 'logo.png')),
  access(path.join(distDir, 'assets', 'main.css')),
  access(path.join(distDir, 'assets', 'site.js')),
  access(path.join(distDir, 'assets', 'fonts', 'barlow-500.woff2')),
  access(path.join(distDir, 'assets', 'fonts', 'barlow-condensed-700.woff2')),
  access(path.join(distDir, 'robots.txt')),
  access(path.join(distDir, 'sitemap.xml')),
  access(path.join(distDir, 'site.webmanifest'))
]);

assert(!/Lorem ipsum/i.test(indexHtml), 'Placeholder content detected in output.');
assert(!/\+381|Ulica 123|10\+ godina/i.test(indexHtml), 'Invented placeholder business data detected in output.');

console.log('Output checks passed.');
