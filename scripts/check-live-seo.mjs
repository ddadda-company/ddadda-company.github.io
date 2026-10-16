import assert from 'node:assert/strict';

// Check GitHub Pages' real HTTP responses, independently of the local build.
// This is not a Googlebot simulation or proof that Google has indexed a URL.
const site = new URL(process.argv[2] || 'https://ddadda-company.github.io/');
assert.equal(site.protocol, 'https:');
assert.equal(site.pathname, '/', 'This site is deployed at the domain root');
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b([^>]*)>`, 'g'))].map(([, attributes]) =>
  Object.fromEntries([...attributes.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key, value])),
);

async function get(path, type, status = 200) {
  const url = new URL(path, site);
  assert.equal(url.origin, site.origin, `Unexpected origin: ${url}`);
  const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, status, `${url}: HTTP ${response.status}, expected ${status}`);
  assert.match(response.headers.get('content-type') ?? '', type, `Wrong MIME type: ${url}`);
  if (status === 200) assert(!/\b(noindex|none)\b/i.test(response.headers.get('x-robots-tag') ?? ''), `Indexing blocked by HTTP header: ${url}`);
  return response.text();
}

const [xml, text, robots] = await Promise.all([
  get('/sitemap.xml', /(?:application|text)\/xml/i),
  get('/sitemap.txt', /text\/plain/i),
  get('/robots.txt', /text\/plain/i),
]);
assert.match(xml, /<urlset\s[^>]*xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"/);
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
assert(urls.length > 0, 'Empty sitemap');
assert.equal(new Set(urls).size, urls.length, 'Duplicate sitemap URLs');
assert.deepEqual(text.trim().split(/\r?\n/), urls, 'Live XML/text sitemap mismatch');
assert.match(robots, /User-agent: \*\r?\nAllow: \/(?:\r?\n|$)/);
assert(!/^Disallow:\s*\/\s*$/mi.test(robots), 'robots.txt blocks the site');
assert(robots.includes(`Sitemap: ${new URL('/sitemap.xml', site)}`));

const pages = new Map();
// Small batches keep load on the public site bounded.
for (let i = 0; i < urls.length; i += 4) {
  await Promise.all(urls.slice(i, i + 4).map(async url => {
    const address = new URL(url);
    assert.equal(address.search + address.hash, '');
    assert(address.pathname.endsWith('/'), `Non-canonical sitemap URL: ${url}`);
    const html = await get(url, /text\/html/i);
    const head = html.split('</head>')[0];
    const meta = tags(head, 'meta');
    const links = tags(head, 'link');
    assert.deepEqual(links.filter(tag => tag.rel === 'canonical').map(tag => tag.href), [url], `Canonical mismatch: ${url}`);
    const rules = meta.filter(tag => /^(robots|googlebot)$/i.test(tag.name ?? ''));
    assert(rules.some(tag => tag.name === 'robots'), `Missing robots meta: ${url}`);
    assert(rules.every(tag => !/\b(noindex|none)\b/i.test(tag.content ?? '')), `Indexing blocked in HTML: ${url}`);
    assert(meta.some(tag => tag.name === 'google-site-verification' && tag.content), `Google verification missing: ${url}`);
    assert.match(head, /<title>[^<]+<\/title>/);
    assert(meta.some(tag => tag.name === 'description' && tag.content));
    assert.equal(tags(html, 'h1').length, 1, `Missing primary heading: ${url}`);
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '';
    assert(main.replace(/<[^>]+>/g, '').trim().length > 40, `Missing static content: ${url}`);
    const alternates = links.filter(tag => tag.rel === 'alternate' && tag.hreflang);
    assert.deepEqual(new Set(alternates.map(tag => tag.hreflang)), new Set(['ko', 'en', 'x-default']));
    for (const alternate of alternates) assert(urls.includes(alternate.href), `Unknown language target: ${alternate.href}`);
    pages.set(url, { html, alternates });
    console.log(`OK ${url}`);
  }));
}

for (const [url, { html, alternates }] of pages) {
  for (const alternate of alternates) assert.deepEqual(pages.get(alternate.href)?.alternates, alternates, `Non-reciprocal languages: ${url}`);
  for (const link of tags(html, 'a')) {
    if (!link.href) continue;
    const target = new URL(link.href, url);
    if (target.origin !== site.origin || !target.pathname.endsWith('/')) continue;
    const fragment = target.hash;
    target.hash = '';
    target.search = '';
    assert(pages.has(target.href), `Internal page absent from sitemap: ${target}`);
    if (fragment) {
      const id = decodeURIComponent(fragment.slice(1));
      assert(pages.get(target.href).html.includes(`id="${id}"`), `Broken anchor: ${target}${fragment}`);
    }
  }
}
const missing = await get('/__seo-check-missing-page__/', /text\/html/i, 404);
assert(tags(missing, 'meta').some(tag => tag.name === 'robots' && /\bnoindex\b/.test(tag.content)), '404 must be excluded from indexing');
assert(!tags(missing, 'link').some(tag => tag.rel === 'canonical'), '404 inherits a valid canonical');
console.log(`Live SEO checks passed: ${pages.size} pages, HTTP/MIME, verification, canonical, languages, links, sitemaps, robots and real 404.`);
