import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import config from '../astro.config.mjs';

const dryRun = process.argv.includes('--dry-run');
const site = new URL(config.site);
assert.equal(site.protocol, 'https:', 'IndexNow requires the production HTTPS site');
const key = (await readFile(new URL('../public/indexnow-key.txt', import.meta.url), 'utf8')).trim();
assert.match(key, /^[a-zA-Z0-9-]{8,128}$/);
const keyLocation = new URL('/indexnow-key.txt', site).href;
const sitemapUrl = new URL('/sitemap.xml', site).href;
const fetchOptions = { signal: AbortSignal.timeout(20000), redirect: 'error' };

let sitemap;
if (dryRun) {
  sitemap = await readFile(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
} else {
  const keyResponse = await fetch(keyLocation, fetchOptions);
  assert.equal(keyResponse.status, 200, 'Deploy the ownership file before submitting');
  assert.equal((await keyResponse.text()).trim(), key, 'Live ownership file does not match this checkout');
  const response = await fetch(sitemapUrl, { ...fetchOptions, signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200, 'Live sitemap could not be read');
  sitemap = await response.text();
}

const urlList = [...new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, value]) => value.replaceAll('&amp;', '&')))];
assert(urlList.length > 0 && urlList.length <= 10000, 'Invalid IndexNow batch size');
for (const value of urlList) {
  const url = new URL(value);
  assert.equal(url.origin, site.origin, 'Sitemap contains another site');
  assert.equal(url.search + url.hash, '', 'Only canonical page URLs may be submitted');
}

if (dryRun) {
  console.log(JSON.stringify({ dryRun, host: site.host, keyLocation, urlList }, null, 2));
} else {
  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST', redirect: 'error', signal: AbortSignal.timeout(30000),
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: site.host, key, keyLocation, urlList }),
  });
  const detail = (await response.text()).slice(0, 500);
  assert([200, 202].includes(response.status), `IndexNow HTTP ${response.status}: ${detail}`);
  console.log(JSON.stringify({
    submittedAt: new Date().toISOString(), endpoint: 'https://api.indexnow.org/indexnow',
    status: response.status, urlCount: urlList.length, urlList,
    result: response.status === 202 ? 'Received; ownership-key validation pending.' : 'URL submission received successfully.',
    note: 'Submission does not confirm crawling, indexing, or webmaster-account verification.',
  }, null, 2));
}
