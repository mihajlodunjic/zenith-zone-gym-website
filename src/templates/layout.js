import { site } from '../config/site.js';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function normalizeSiteUrl(siteUrl) {
  if (!siteUrl) {
    return '';
  }

  return siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
}

function absoluteUrl(pathname, siteUrl) {
  const base = normalizeSiteUrl(siteUrl);

  if (!base) {
    return pathname;
  }

  return `${base}${pathname}`;
}

function renderStructuredData(siteUrl) {
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);

  if (!normalizedSiteUrl) {
    return '';
  }

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: normalizedSiteUrl,
    logo: absoluteUrl('/logo.png', normalizedSiteUrl),
    sameAs: [site.instagramUrl]
  };

  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

export function renderLayout({
  content,
  siteUrl,
  pageTitle = site.title,
  description = site.description,
  pathname = '/',
  is404 = false
}) {
  const canonicalUrl = !is404 && normalizeSiteUrl(siteUrl) ? absoluteUrl(pathname, siteUrl) : '';
  const ogImage = absoluteUrl('/logo.png', siteUrl);
  const robots = is404 ? 'noindex, nofollow' : 'index, follow';

  return `<!doctype html>
<html lang="${site.lang}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="theme-color" content="${site.themeColor}">
    <meta name="robots" content="${robots}">
    ${canonicalUrl ? `<link rel="canonical" href="${canonicalUrl}">` : ''}
    <meta property="og:type" content="${is404 ? 'website' : 'article'}">
    <meta property="og:locale" content="sr_RS">
    <meta property="og:site_name" content="${escapeHtml(site.name)}">
    <meta property="og:title" content="${escapeHtml(pageTitle)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="${escapeHtml(ogImage)}">
    <meta property="og:image:alt" content="Zenith Zone Gym logo">
    ${canonicalUrl ? `<meta property="og:url" content="${canonicalUrl}">` : ''}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${escapeHtml(ogImage)}">
    <link rel="icon" href="/logo.png" type="image/png">
    <link rel="preload" href="/assets/fonts/barlow-condensed-700.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/assets/fonts/barlow-500.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="/assets/main.css">
    ${renderStructuredData(siteUrl)}
  </head>
  <body>
    ${content}
    <script src="/assets/site.js" defer></script>
  </body>
</html>`;
}
