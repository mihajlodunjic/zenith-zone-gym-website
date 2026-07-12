import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { site } from '../src/config/site.js';
import { renderHome } from '../src/templates/home.js';
import { renderLayout } from '../src/templates/layout.js';
import { renderNotFound } from '../src/templates/notFound.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(projectRoot, 'dist');
const publicDir = path.join(projectRoot, 'public');
const nodeModulesDir = path.join(projectRoot, 'node_modules');

const fontVariants = [
  { packageName: '@fontsource/barlow', sourcePattern: /barlow-latin-500-normal\.woff2$/, outputName: 'barlow-500.woff2' },
  { packageName: '@fontsource/barlow', sourcePattern: /barlow-latin-600-normal\.woff2$/, outputName: 'barlow-600.woff2' },
  { packageName: '@fontsource/barlow', sourcePattern: /barlow-latin-700-normal\.woff2$/, outputName: 'barlow-700.woff2' },
  { packageName: '@fontsource/barlow-condensed', sourcePattern: /barlow-condensed-latin-600-normal\.woff2$/, outputName: 'barlow-condensed-600.woff2' },
  { packageName: '@fontsource/barlow-condensed', sourcePattern: /barlow-condensed-latin-700-normal\.woff2$/, outputName: 'barlow-condensed-700.woff2' }
];

function normalizeSiteUrl(siteUrl) {
  if (!siteUrl) {
    return '';
  }

  const trimmed = siteUrl.trim();

  if (!trimmed) {
    return '';
  }

  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
}

async function ensureFileExists(filePath) {
  try {
    await stat(filePath);
  } catch {
    throw new Error(`Required file is missing: ${filePath}`);
  }
}

async function copyDirectoryContents(source, destination) {
  await cp(source, destination, { recursive: true });
}

async function copyFonts() {
  const fontsDir = path.join(distDir, 'assets', 'fonts');
  await mkdir(fontsDir, { recursive: true });

  for (const variant of fontVariants) {
    const packageFilesDir = path.join(nodeModulesDir, variant.packageName, 'files');

    try {
      const fileNames = await readdir(packageFilesDir);
      const sourceFileName = fileNames.find((fileName) => variant.sourcePattern.test(fileName));

      if (!sourceFileName) {
        throw new Error(`Font variant not found for ${variant.packageName}: ${variant.sourcePattern}`);
      }

      await cp(path.join(packageFilesDir, sourceFileName), path.join(fontsDir, variant.outputName));
    } catch (error) {
      throw new Error(
        `Unable to copy fonts from ${variant.packageName}. Run "npm install" before building. ${error.message}`
      );
    }
  }
}

function createRobotsTxt(siteUrl) {
  const lines = ['User-agent: *', 'Allow: /'];

  if (siteUrl) {
    lines.push(`Sitemap: ${siteUrl}/sitemap.xml`);
  } else {
    lines.push('# Set SITE_URL to expose the production sitemap URL.');
  }

  return `${lines.join('\n')}\n`;
}

function createSitemapXml(siteUrl) {
  if (!siteUrl) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Set SITE_URL to generate canonical production URLs. -->
</urlset>
`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
  </url>
</urlset>
`;
}

function createManifest() {
  return JSON.stringify(
    {
      name: site.name,
      short_name: site.shortName,
      start_url: '/',
      display: 'standalone',
      background_color: site.themeColor,
      theme_color: site.themeColor,
      icons: [
        {
          src: '/logo.png',
          sizes: '1254x1254',
          type: 'image/png'
        }
      ]
    },
    null,
    2
  );
}

export async function buildSite() {
  const siteUrl = normalizeSiteUrl(process.env.SITE_URL);
  const currentYear = new Date().getUTCFullYear();
  const homeHtml = renderLayout({
    content: renderHome(currentYear),
    siteUrl,
    pathname: '/'
  });
  const notFoundHtml = renderLayout({
    content: renderNotFound(),
    siteUrl,
    pathname: '/404.html',
    pageTitle: `404 | ${site.name}`,
    description: 'Tražena stranica na Zenith Zone Gym sajtu nije pronađena.',
    is404: true
  });
  const css = await readFile(path.join(projectRoot, 'src', 'styles', 'main.css'), 'utf8');
  const clientScript = await readFile(path.join(projectRoot, 'src', 'scripts', 'site.js'), 'utf8');

  await ensureFileExists(path.join(publicDir, 'logo.png'));
  await rm(distDir, { recursive: true, force: true });
  await mkdir(path.join(distDir, 'assets'), { recursive: true });

  await copyDirectoryContents(publicDir, distDir);
  await copyFonts();

  await Promise.all([
    writeFile(path.join(distDir, 'index.html'), homeHtml),
    writeFile(path.join(distDir, '404.html'), notFoundHtml),
    writeFile(path.join(distDir, 'robots.txt'), createRobotsTxt(siteUrl)),
    writeFile(path.join(distDir, 'sitemap.xml'), createSitemapXml(siteUrl)),
    writeFile(path.join(distDir, 'site.webmanifest'), createManifest()),
    writeFile(path.join(distDir, 'assets', 'main.css'), css),
    writeFile(path.join(distDir, 'assets', 'site.js'), clientScript)
  ]);

  return {
    currentYear,
    distDir,
    siteUrl
  };
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  buildSite().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
