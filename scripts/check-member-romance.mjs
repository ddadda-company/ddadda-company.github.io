import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const base = process.env.SITE_URL || 'http://localhost:4321';
const browser = await chromium.launch({ executablePath: process.env.BROWSER_PATH || undefined });
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const game = page.locator('#member-romance');
const surprise = page.locator('#member-surprise');
const trigger = page.locator('[data-surprise-open]').first();
const count = page.locator('[data-surprise-entry] [data-surprise-count]');
const album = page.locator('#surprise-collection');
const quest = page.locator('[data-surprise-collection-open]');
const resume = album.locator('[data-collection-romance-resume]');
const option = id => game.locator(`[data-romance-option="${id}"]`);
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
const choice = async (action, id) => {
  await option(`action-${action}`).click();
  await expect(game).toHaveAttribute('data-phase', 'scene');
  await option(`choice-${id}`).click();
  await expect(game).toHaveAttribute('data-phase', 'result');
  await expect(game.locator('.romance-effect')).toHaveCount(3);
};
const continueGame = () => option('continue').click();
const stat = (id, value) => expect(game.locator(`[data-romance-stat="${id}"]`)).toHaveText(String(value));
try {
  await mkdir('.qa', { recursive: true });
  await page.goto(`${base}/members/`, { waitUntil: 'networkidle' });
  await encounter(.2);
  await expect(game).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(quest).toContainText('Special Quest');
  await expect(quest).not.toContainText('사진 도감');
  await quest.click();
  await expect(resume).toBeDisabled();
  await page.keyboard.press('Escape');
  await encounter(.199999);
  await expect(game.locator('[data-romance-choices] button')).toHaveCount(6);
  await expect(game).toHaveAttribute('data-phase', 'hub');
  await expect(option('action-solve')).toBeDisabled();
  const initialCount = await count.textContent();
  for (const cheek of await game.locator('.romance-blush').all()) {
    await expect(cheek).toBeVisible();
    assert(await cheek.evaluate(el => parseFloat(getComputedStyle(el).opacity) >= .7));
  }
  for (const [width, height] of [[1440, 900], [768, 900], [414, 844], [375, 812], [320, 700], [844, 390]]) {
    await page.setViewportSize({ width, height });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert(await game.evaluate(el => el.scrollWidth <= el.clientWidth));
    await expect(game.locator('[data-romance-close]')).toBeInViewport();
    await expect(game.locator('[data-romance-meter="affection"]')).toBeInViewport();
    await option('action-gift').scrollIntoViewIfNeeded();
    await expect(game.locator('[data-romance-close]')).toBeInViewport();
    await expect(game.locator('[data-romance-meter="trust"]')).toBeInViewport();
    await game.locator('.romance-body').evaluate(el => el.scrollTop = 0);
    if (width === 1440 || width === 375) await page.screenshot({ path: `.qa/romance-game-${width}.png` });
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  const accessibility = await new AxeBuilder({ page }).include('#member-romance').analyze();
  assert.deepEqual(accessibility.violations.map(v => `${v.id}: ${v.nodes.map(n => n.target).join(', ')}`), []);
  // Locked intimate choices explain the requirement and consume no action.
  await option('action-walk').click();
  await expect(option('choice-hand')).toBeDisabled();
  await expect(option('choice-hand')).toContainText('40');
  await game.locator('[data-romance-back]').click();
  await choice('listen', 'patient');
  await stat('trust', 28);
  await continueGame();
  await choice('talk', 'honest');
  await continueGame();
  await option('action-gift').click();
  await expect(option('choice-cocoa')).toContainText('좋아한다고 했던 것');
  // A reload restores the exact scene, resources and memories.
  await page.reload({ waitUntil: 'networkidle' });
  // The album bypasses random encounters and restores the saved scene directly.
  await page.evaluate(() => { Math.random = () => .99; });
  await quest.click();
  await expect(resume).toBeEnabled();
  await expect(resume).toHaveText('미연시 이어서 하기');
  await expect(album.locator('[data-collection-romance-status]')).toContainText('호감 24');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: '.qa/romance-album-resume-375.png' });
  assert(await album.evaluate(el => el.scrollWidth <= el.clientWidth));
  const albumAccessibility = await new AxeBuilder({ page }).include('#surprise-collection').analyze();
  assert.deepEqual(albumAccessibility.violations.map(v => v.id), []);
  await resume.click();
  await expect(game).toBeVisible();
  await expect(album).not.toBeVisible();
  await expect(page.locator('dialog[open]')).toHaveCount(1);
  await expect(game.locator('[data-romance-dialogue]')).toBeFocused();
  await expect(game).toHaveAttribute('data-phase', 'scene');
  await stat('affection', 24);
  await option('choice-cocoa').click();
  await expect(game.locator('[data-romance-notes]')).toContainText('취향을 기억한 선물');
  await stat('affection', 40);
  // Language changes preserve the result, rather than repeating its reward.
  await page.keyboard.press('Escape');
  await expect(album).toBeVisible();
  await expect(resume).toBeFocused();
  await expect(album.locator('[data-collection-romance-status]')).toContainText('호감 40');
  await page.keyboard.press('Escape');
  await expect(quest).toBeFocused();
  await page.goto(`${base}/en/members/`, { waitUntil: 'networkidle' });
  await quest.click();
  await expect(resume).toHaveText('Continue mini-game');
  await resume.click();
  await expect(game).toHaveAttribute('data-phase', 'result');
  await stat('affection', 40);
  await expect(game.locator('[data-romance-line]')).toContainText('remembered');
  await continueGame();
  await expect(game).toHaveAttribute('data-phase', 'night');
  await option('next').click();
  await expect(game).toHaveAttribute('data-day', '2');
  for (const [action, id] of [['listen', 'patient'], ['walk', 'hand'], ['solve', 'together']]) {
    await choice(action, id);
    await continueGame();
  }
  await option('next').click();
  await expect(game).toHaveAttribute('data-day', '3');
  for (const [action, id] of [['talk', 'tease'], ['rest', 'company'], ['walk', 'hand']]) {
    await choice(action, id);
    await continueGame();
  }
  await expect(game).toHaveAttribute('data-phase', 'finale');
  await stat('affection', 100); await stat('trust', 83); await stat('tension', 14);
  await option('ending-confess').click();
  await expect(game.locator('[data-romance-ending]')).toHaveText('A date tomorrow?');
  await expect(game).toHaveAttribute('data-affection', 'high');
  await expect(game.locator('[data-romance-gallery-summary]')).toContainText('1/5');
  await expect(count).toHaveText(initialCount);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: '.qa/romance-game-ending.png' });
  await game.locator('[data-romance-close]').click();
  await expect(resume).toHaveText('View your ending');
  await expect(resume).toBeFocused();
  await resume.click();
  await expect(game).toHaveAttribute('data-phase', 'ending');
  await option('restart').click();
  await stat('affection', 10);
  await expect(game.locator('[data-romance-gallery-summary]')).toContainText('1/5');
  await game.locator('[data-romance-close]').click();
  await expect(resume).toHaveText('Continue mini-game');
  await expect(album).toBeVisible();
  await expect(resume).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(album).not.toBeVisible();
  for (let attempt = 0; attempt < 30; attempt++) {
    await page.evaluate(() => { Math.random = () => .1; });
    const opener = page.locator('[data-surprise-open]').nth(attempt % 2);
    await opener.click();
    await expect(game).toBeVisible();
    await expect(surprise).not.toBeVisible();
    await expect(game).toHaveAttribute('data-phase', 'hub');
    if (attempt % 2) await page.keyboard.press('Escape');
    else await game.locator('[data-romance-close]').click();
    await expect(opener).toBeFocused();
  }
  await page.evaluate(() => { Math.random = () => .9; });
  await trigger.click();
  await expect(surprise).toBeVisible();
  await surprise.locator('[data-surprise-photo]').click();
  await expect(game).not.toBeVisible();
  await expect(trigger).toBeFocused();
  // Invalid saves reset safely, and storage denial still allows in-page progress.
  await page.evaluate(() => localStorage.setItem('dda_com-romance-v2', '{broken'));
  await page.reload({ waitUntil: 'networkidle' });
  await encounter(.1);
  await stat('affection', 10);
  const blocked = await browser.newContext();
  await blocked.addInitScript(() => {
    const get = Storage.prototype.getItem; const set = Storage.prototype.setItem;
    Storage.prototype.getItem = function (key) { if (key === 'dda_com-romance-v2') throw new Error('blocked'); return get.call(this, key); };
    Storage.prototype.setItem = function (key, value) { if (key === 'dda_com-romance-v2') throw new Error('blocked'); return set.call(this, key, value); };
    Math.random = () => .1;
  });
  const denied = await blocked.newPage();
  await denied.goto(`${base}/members/`, { waitUntil: 'networkidle' });
  await denied.locator('[data-surprise-open]').first().click();
  await denied.locator('[data-romance-option="action-listen"]').click();
  await denied.locator('[data-romance-option="choice-patient"]').click();
  await expect(denied.locator('[data-romance-save-note]')).toHaveAttribute('data-error', 'true');
  await denied.keyboard.press('Escape');
  await denied.locator('[data-surprise-open]').first().click();
  await expect(denied.locator('[data-romance-stat="trust"]')).toHaveText('28');
  await blocked.close();
  assert.deepEqual(errors, []);
  console.log('Romance browser checks passed: 20% immediate entry, 30 rapid reopenings, blush, stats, locks, gifts, 3-day route, endings, restart, reload/language resume, corrupt/blocked storage, Special Quest album resume without randomness, dialog return/focus, responsive layout and accessibility.');
} finally { await browser.close(); }
