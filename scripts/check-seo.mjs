import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const read = name => readFile(path.join(dist, name), 'utf8');
const decode = text => text.replace(/&(?:amp|quot|apos|lt|gt|#39);/g, entity => ({
  '&amp;': '&', '&quot;': '"', '&apos;': "'", '&#39;': "'", '&lt;': '<', '&gt;': '>',
}[entity]));
// Inspect Astro's emitted HTML, rather than the source metadata configuration.
const tags = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b([^>]*)>`, 'g'))].map(([, attributes]) =>
  Object.fromEntries([...attributes.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, name, value]) => [name, decode(value)])),
);
const fileFor = url => `${decodeURIComponent(url.pathname).replace(/^\//, '')}index.html`;

const sitemap = await read('sitemap.xml');
assert.match(sitemap, /xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"/);
assert.match(sitemap, /xmlns:xhtml="http:\/\/www.w3.org\/1999\/xhtml"/);
const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, entry]) => ({
  url: new URL(decode(entry.match(/<loc>([^<]+)<\/loc>/)?.[1] ?? '')),
  alternates: tags(entry, 'xhtml:link'),
}));
assert(entries.length > 0, 'Sitemap must contain public pages');
const urls = new Set(entries.map(({ url }) => url.href));
assert.equal(urls.size, entries.length, 'Duplicate sitemap URL');
const origin = entries[0].url.origin;
assert.match(origin, /^https:\/\//);
assert(!/localhost|127\.0\.0\.1/.test(origin), 'Sitemap uses a development origin');
const htmlFiles = (await readdir(dist, { recursive: true })).filter(file => file.endsWith('.html') && file !== '404.html');
assert.deepEqual(new Set(entries.map(({ url }) => fileFor(url))), new Set(htmlFiles), 'Sitemap must cover every public HTML page');
const titles = new Set();
const descriptions = new Set();
const alternatesByUrl = new Map();

for (const { url, alternates } of entries) {
  assert.equal(url.origin, origin, 'Mixed origins in sitemap');
  assert.equal(url.search + url.hash, '', 'Sitemap contains a query or fragment');
  assert(url.pathname.endsWith('/'), 'Canonical URL must have a trailing slash');
  const html = await read(fileFor(url));
  const head = html.split('</head>')[0];
  const meta = tags(head, 'meta');
  const links = tags(head, 'link');
  const content = name => meta.filter(tag => tag.name === name || tag.property === name).map(tag => tag.content);
  assert.deepEqual(links.filter(tag => tag.rel === 'canonical').map(tag => tag.href), [url.href], `Canonical mismatch: ${url}`);
  assert.equal(content('robots').length, 1);
  assert(!/noindex|nosnippet|nofollow/.test(content('robots')[0]), `Search blocked: ${url}`);
  assert.equal(content('description').length, 1);
  assert(content('description')[0]?.trim(), `Missing description: ${url}`);
  assert(!descriptions.has(content('description')[0]), `Duplicate description: ${url}`);
  descriptions.add(content('description')[0]);
  const title = decode(head.match(/<title>([^<]+)<\/title>/)?.[1] ?? '');
  assert(title && !titles.has(title), `Empty or duplicate title: ${url}`);
  titles.add(title);
  assert.deepEqual(content('og:url'), [url.href]);
  assert.deepEqual(content('og:title'), [title]);
  assert.deepEqual(content('og:description'), content('description'));
  const image = new URL(content('og:image')[0]);
  assert.equal(image.origin, origin);
  assert(existsSync(path.join(dist, decodeURIComponent(image.pathname))), `Missing social image: ${image}`);
  assert.deepEqual(content('twitter:image'), [image.href]);
  assert(Number(content('og:image:width')[0]) > 0 && Number(content('og:image:height')[0]) > 0);

  const htmlAlternates = links.filter(tag => tag.rel === 'alternate' && tag.hreflang);
  assert.deepEqual(htmlAlternates, alternates, `HTML/sitemap language mismatch: ${url}`);
  assert.deepEqual(new Set(alternates.map(tag => tag.hreflang)), new Set(['ko', 'en', 'x-default']));
  for (const alternate of alternates) assert(urls.has(alternate.href), `Unknown language URL: ${alternate.href}`);
  const language = tags(html, 'html')[0]?.lang;
  assert.equal(alternates.find(tag => tag.hreflang === language)?.href, url.href);
  alternatesByUrl.set(url.href, alternates);

  const scripts = [...head.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1, `Missing or duplicate JSON-LD: ${url}`);
  const schema = JSON.parse(scripts[0][1]);
  assert.equal(schema['@context'], 'https://schema.org');
  const graph = schema['@graph'];
  const ids = new Set(graph.map(node => node['@id']));
  assert.equal(ids.size, graph.length, 'Duplicate structured-data entity IDs');
  const page = graph.find(node => node['@id'] === `${url.href}#webpage`);
  assert(page && page.name === title && page.url === url.href && page.inLanguage === language);
  assert.equal(page.description, content('description')[0]);
  assert(graph.some(node => node['@type'] === 'Organization'));
  assert(graph.some(node => node['@type'] === 'WebSite'));
  for (const person of graph.filter(node => node['@type'] === 'Person')) {
    assert(html.includes(`id="${new URL(person.url).hash.slice(1)}"`), `Member schema has no visible profile: ${person.name}`);
  }
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `Expected one primary heading: ${url}`);
}

for (const [url, alternates] of alternatesByUrl) {
  for (const alternate of alternates) assert.deepEqual(alternatesByUrl.get(alternate.href), alternates, `Non-reciprocal hreflang: ${url}`);
}
const robots = await read('robots.txt');
assert.match(robots, /User-agent: \*\r?\nAllow: \/(?:\r?\n|$)/);
assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
assert(!/^Disallow:\s*\/\s*$/m.test(robots), 'Public website is blocked');
const errorHead = (await read('404.html')).split('</head>')[0];
assert(tags(errorHead, 'meta').some(tag => tag.name === 'robots' && tag.content.includes('noindex')));
assert(!tags(errorHead, 'link').some(tag => tag.rel === 'canonical' || tag.hreflang), '404 inherits valid-page identity');
assert(!errorHead.includes('application/ld+json'));
console.log(`SEO checks passed: ${entries.length} pages, reciprocal languages, metadata, assets, JSON-LD, robots.txt, sitemap and 404.`);
