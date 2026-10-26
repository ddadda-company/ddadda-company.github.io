import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';

// Run against `npm run preview`, or set SITE_URL to verify a deployment.
const base = process.env.SITE_URL || 'http://localhost:4321';
const browser = await chromium.launch({ executablePath: process.env.BROWSER_PATH || undefined });
const key = 'dda_com-8l4nk-collection-v1';
const errors = [];
const context = await browser.newContext();
await context.addInitScript(() => {
  window.photoDecodeOrder = [];
  const decode = HTMLImageElement.prototype.decode;
  HTMLImageElement.prototype.decode = async function () {
    await decode.call(this);
    if (this.src.includes('/surprises/8l4nk/')) window.photoDecodeOrder.push(new URL(this.src).pathname);
  };
});
const page = await context.newPage();
page.on('pageerror', error => errors.push(error.message));
const counter = page.locator('[data-surprise-entry] [data-surprise-count]');
const trigger = page.locator('[data-surprise-open]').first();
const collectionTrigger = page.locator('[data-surprise-collection-open]');
const collection = page.locator('#surprise-collection');
const surprise = page.locator('#member-surprise');

try {
  await page.goto(`${base}/members/`);
  await page.waitForFunction(() => window.photoDecodeOrder.length === 6);
  await expect(counter).toHaveText('0/6');
  await collectionTrigger.click();
  await expect(collection.locator('[data-collection-photo]:disabled')).toHaveCount(6);
  await expect(collection.locator('img[src]')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(collectionTrigger).toBeFocused();
  const photos = await page.evaluate(() => window.photoDecodeOrder);
  let last = '';
  const found = new Set();
  for (const index of [0, 1, 0, 2, 3, 4, 5]) {
    const src = photos[index];
    const candidates = photos.filter(photo => photo !== last);
    const random = (candidates.indexOf(src) + .1) / candidates.length;
    await page.evaluate(value => { Math.random = () => value; }, random);
    await trigger.click();
    await expect(surprise).toBeVisible();
    await expect(surprise.locator('[data-surprise-photo]')).toHaveAttribute('src', src);
    const duplicate = found.has(src);
    found.add(src);
    await expect(counter).toHaveText(`${found.size}/6`);
    await expect(surprise.locator('[data-surprise-discovery]')).toContainText(duplicate ? '이미 모은' : '새 사진');
    if (index === 5) await expect(surprise).not.toBeVisible({ timeout: 3000 });
    else await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    last = src;
  }
  assert.equal((await page.evaluate(k => JSON.parse(localStorage.getItem(k)), key)).length, 6);
  await page.reload();
  await expect(counter).toHaveText('6/6');
  await page.goto(`${base}/en/members/`);
  await expect(counter).toHaveText('6/6');
  await collectionTrigger.click();
  await expect(collection.locator('[data-collection-photo]:enabled')).toHaveCount(6);
  await expect(collection.locator('[data-collection-complete]')).toHaveText('Found them all! Collection complete 🎉');
  for (const slot of await collection.locator('[data-collection-photo]').all()) {
    await slot.click();
    await expect(slot).toHaveAttribute('aria-pressed', 'true');
    await expect(collection.locator('[data-collection-full-photo]')).toHaveAttribute('src', await slot.getAttribute('data-collection-photo'));
    await expect(collection.locator('[data-collection-full-photo]')).toBeVisible();
  }
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    assert(await collection.evaluate(el => el.scrollWidth <= el.clientWidth));
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await expect(collection.locator('[data-collection-close]')).toBeInViewport();
  }
  await collection.locator('[data-collection-close]').click();
  await expect(collectionTrigger).toBeFocused();

  // Invalid or stale storage entries must not unlock arbitrary URLs or inflate counts.
  await page.evaluate(k => localStorage.setItem(k, JSON.stringify(['https://invalid.example/photo.png', 123, '/images/surprises/8l4nk/photo-01.png', '/images/surprises/8l4nk/photo-01.png'])), key);
  await page.reload();
  await expect(counter).toHaveText('1/6');
  await page.evaluate(k => localStorage.setItem(k, '{broken'), key);
  await page.reload();
  await expect(counter).toHaveText('0/6');

  // A cancelled download cannot collect a photo that was never shown.
  let releasePhotos;
  const photoGate = new Promise(resolve => { releasePhotos = resolve; });
  await page.route('**/images/surprises/8l4nk/*', async route => {
    await photoGate;
    await route.continue();
  });
  await page.goto(`${base}/members/`, { waitUntil: 'domcontentloaded' });
  await trigger.click();
  await page.keyboard.press('Escape');
  releasePhotos();
  await page.waitForFunction(() => window.photoDecodeOrder.length === 6);
  await expect(counter).toHaveText('0/6');
  await expect(surprise).not.toBeVisible();
  await page.unroute('**/images/surprises/8l4nk/*');

  await page.route('**/images/surprises/8l4nk/*', route => route.abort());
  await page.reload({ waitUntil: 'networkidle' });
  await trigger.click();
  await expect(page.locator('[data-surprise-status]')).toContainText('새로고침');
  await expect(counter).toHaveText('0/6');
  await expect(surprise).not.toBeVisible();
  await page.unroute('**/images/surprises/8l4nk/*');

  // Storage-disabled browsers still collect in memory; reduced motion remains respected.
  const blocked = await browser.newContext({ reducedMotion: 'reduce' });
  await blocked.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('Blocked'); };
    Storage.prototype.setItem = () => { throw new Error('Blocked'); };
  });
  const blockedPage = await blocked.newPage();
  blockedPage.on('pageerror', error => errors.push(error.message));
  await blockedPage.goto(`${base}/members/`, { waitUntil: 'networkidle' });
  await blockedPage.locator('[data-surprise-open]').first().click();
  await expect(blockedPage.locator('#member-surprise')).toBeVisible();
  assert.equal(await blockedPage.locator('[data-surprise-photo]').evaluate(el => getComputedStyle(el).animationName), 'none');
  await expect(blockedPage.locator('[data-surprise-entry] [data-surprise-count]')).toHaveText('1/6');
  await blockedPage.keyboard.press('Escape');
  await blockedPage.locator('[data-surprise-collection-open]').click();
  await expect(blockedPage.locator('[data-collection-storage]')).toBeVisible();
  await blocked.close();
  assert.deepEqual(errors, []);
  console.log('Collection checks passed: six discoveries, duplicates, viewing, completion, persistence, languages, mobile, cancellation, blocked storage, reduced motion and focus.');
} finally {
  await browser.close();
}
