import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';

const base = process.env.SITE_URL || 'http://localhost:4321';
const browser = await chromium.launch({ executablePath: process.env.BROWSER_PATH || undefined });
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const game = page.locator('#member-romance');
const surprise = page.locator('#member-surprise');
const trigger = page.locator('[data-surprise-open]').first();
const options = game.locator('[data-romance-choices] button');
const count = page.locator('[data-surprise-entry] [data-surprise-count]');

const encounter = async chance => {
  await page.evaluate(value => { Math.random = () => value; }, chance);
  await trigger.click();
  if (chance < .2) {
    await expect(game).toBeVisible();
    await expect(surprise).not.toBeVisible();
  } else {
    await expect(surprise).toBeVisible();
    await expect(surprise).not.toBeVisible({ timeout: 3000 });
  }
};
try {
  await page.goto(`${base}/members/`, { waitUntil: 'networkidle' });
  // The probability boundary is exactly 20%: below .2 enters; .2 does not.
  await encounter(.2);
  await expect(game).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await encounter(.199999);
  await expect(game).toBeVisible();
  await expect(options).toHaveCount(3);
  await expect(game).toHaveAttribute('data-step', '0');
  const initialCount = await count.textContent();
  const cheeks = game.locator('.romance-blush');
  await expect(cheeks).toHaveCount(2);
  for (const cheek of await cheeks.all()) {
    await expect(cheek).toBeVisible();
    assert(await cheek.evaluate(el => parseFloat(getComputedStyle(el).opacity) >= .7));
  }
  for (const [width, height] of [[1440, 900], [768, 900], [414, 844], [375, 812], [320, 700], [844, 390]]) {
    await page.setViewportSize({ width, height });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert(await game.evaluate(el => el.scrollWidth <= el.clientWidth));
    await expect(game.locator('[data-romance-close]')).toBeInViewport();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  for (let i = 0; i < 3; i++) await options.nth(0).click();
  await expect(game.locator('[data-romance-ending]')).toHaveText('우리, 내일도 볼까?');
  await expect(game).toHaveAttribute('data-affection', 'high');
  await expect(count).toHaveText(initialCount);
  await game.locator('[data-romance-finish]').click();
  await expect(trigger).toBeFocused();
  await encounter(.1);
  await expect(game).toBeVisible();
  await expect(game).toHaveAttribute('data-step', '0');
  for (let i = 0; i < 3; i++) await options.nth(1).click();
  await expect(game.locator('[data-romance-ending]')).toHaveText('내 옆자리 예약');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await page.goto(`${base}/en/members/`, { waitUntil: 'networkidle' });
  await encounter(.1);
  await expect(game).toBeVisible();
  for (let i = 0; i < 3; i++) await options.nth(2).click();
  await expect(game.locator('[data-romance-ending]')).toHaveText('A little shy, for now');
  await game.locator('[data-romance-close]').click();
  // Regression: even rapid clicks must open a winning encounter immediately.
  for (let attempt = 0; attempt < 30; attempt++) {
    await page.evaluate(() => { Math.random = () => .1; });
    await page.locator('[data-surprise-open]').nth(attempt % 2).click();
    await expect(game).toBeVisible();
    await expect(surprise).not.toBeVisible();
    await expect(game).toHaveAttribute('data-step', '0');
    if (attempt % 2) await page.keyboard.press('Escape');
    else await game.locator('[data-romance-close]').click();
    await expect(page.locator('[data-surprise-open]').nth(attempt % 2)).toBeFocused();
  }
  // Losing rolls stay normal photos, including when dismissed immediately.
  await page.evaluate(() => { Math.random = () => .9; });
  await trigger.click();
  await expect(surprise).toBeVisible();
  await surprise.locator('[data-surprise-photo]').click();
  await expect(game).not.toBeVisible();
  await expect(trigger).toBeFocused();
  assert.deepEqual(errors, []);
  console.log('Romance checks passed: immediate 20% branch, 30 rapid encounters, three choices per scene, all three endings, blush, replay reset, collection preserved, Korean/English, mobile/landscape, cancellation and focus.');
} finally { await browser.close(); }
