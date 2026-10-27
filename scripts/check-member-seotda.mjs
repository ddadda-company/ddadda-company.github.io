import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const base = process.env.SITE_URL || 'http://localhost:4321';
const browser = await chromium.launch({ executablePath: process.env.BROWSER_PATH || '/usr/bin/google-chrome' });
const context = await browser.newContext();
const page = await context.newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
const game = page.locator('#member-seotda'), trigger = page.locator('[data-seotda-open]').first();
const action = id => game.locator(`[data-seotda-action="${id}"]`);
const viewports = [[1440,1000], [768,900], [414,844], [375,812], [320,700], [320,568], [320,500], [844,390], [568,320]];
const layout = async () => {
  const problem = await game.evaluate(root => {
    const body = root.querySelector('.seotda-body'), table = root.querySelector('.seotda-table');
    const contains = (outer, inner) => inner.left >= outer.left - 1 && inner.top >= outer.top - 1 && inner.right <= outer.right + 1 && inner.bottom <= outer.bottom + 1;
    const viewport = { left: 0, top: 0, right: innerWidth, bottom: innerHeight };
    if (root.scrollWidth > root.clientWidth || root.scrollHeight > root.clientHeight + 1 || body.scrollHeight > body.clientHeight + 1) return 'gameplay overflows';
    for (const node of root.querySelectorAll('.seotda-table .seotda-card, .seotda-table h4, .seotda-table p, .seotda-pot')) {
      if (!contains(table.getBoundingClientRect(), node.getBoundingClientRect())) return `outside table: ${node.className}`;
    }
    for (const mark of root.querySelectorAll('.seotda-table .seotda-card-mark')) {
      if (!contains(mark.parentElement.getBoundingClientRect(), mark.getBoundingClientRect())) return 'card label is clipped';
    }
    for (const node of root.querySelectorAll('.seotda-dialogue, .seotda-table, [data-seotda-actions] button, [data-seotda-close]')) {
      if (!contains(viewport, node.getBoundingClientRect())) return `outside viewport: ${node.className}`;
    }
    const a = table.getBoundingClientRect(), b = root.querySelector('.seotda-cinema').getBoundingClientRect();
    if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) return 'scene overlaps table';
    return null;
  });
  assert.equal(problem, null, `${await game.getAttribute('data-mode')}/${await game.getAttribute('data-phase')} ${JSON.stringify(page.viewportSize())}: ${problem}`);
};
const allLayouts = async () => { const original = page.viewportSize(); for (const [width,height] of viewports) { await page.setViewportSize({width,height}); await layout(); } await page.setViewportSize(original); };
const choose = async id => { await action(id).click(); await allLayouts(); };
const phase = value => expect(game).toHaveAttribute('data-phase', value);
const imageReady = async () => { await expect(game.locator('[data-seotda-image]')).toBeVisible(); assert(await game.locator('[data-seotda-image]').evaluate(el => el.complete && el.naturalWidth >= 1000 && el.naturalHeight >= 667)); };
const start = async () => { await trigger.click(); await expect(game).toBeVisible(); };
const fiveCards = async () => { for (let i = 0; i < 5; i++) await choose('story-deal'); await phase('bet'); };
try {
  await mkdir('.qa', { recursive: true });
  for (const route of ['/', '/achievements/', '/contact/', '/en/', '/en/achievements/', '/en/contact/']) {
    await page.goto(`${base}${route}`); await expect(game).toHaveCount(0); await expect(page.locator('[data-seotda-open]')).toHaveCount(0);
  }
  await page.goto(`${base}/members/`, { waitUntil: 'networkidle' });
  await expect(page.locator('[data-seotda-open]')).toHaveCount(2);
  await expect(game.locator('img[src]')).toHaveCount(0);
  await start(); await phase('intro'); await expect(game).toHaveAttribute('data-mode', 'story');
  await expect(game.locator('[data-seotda-help]')).not.toBeVisible();
  await expect(game.locator('#seotda-beginner')).not.toBeVisible();
  await expect(action('story-deal')).toBeVisible(); await imageReady();
  for (const [width, height] of viewports) {
    await page.setViewportSize({ width, height });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await layout();
    await expect(game.locator('[data-seotda-close]')).toBeInViewport();
    await expect(action('story-deal')).toBeInViewport();
    if (width === 1440 || width === 375) await page.screenshot({ path: `.qa/seotda-story-${width}.png` });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  let audit = await new AxeBuilder({ page }).include('#member-seotda').analyze();
  assert.deepEqual(audit.violations.map(v => `${v.id} ${v.nodes.map(n => n.target).join(',')}`), []);
  await game.locator('[data-seotda-enlarge]').click();
  await expect(game.locator('#seotda-notes')).toBeVisible();
  await expect(game.locator('[data-seotda-gallery]')).toHaveAttribute('open', '');
  assert((await game.locator('[data-expanded="true"] img').boundingBox()).height > 155);
  await page.keyboard.press('Escape');
  await expect(game.locator('[data-seotda-enlarge]')).toBeFocused();
  await fiveCards(); await choose('story-double'); await phase('stop'); await imageReady();
  await expect(game.locator('[data-seotda-image]')).toHaveAttribute('src', '/images/tazza/stop.jpg');
  // Persist the cinematic branch across closing, reload and language switch.
  await page.keyboard.press('Escape'); await expect(trigger).toBeFocused();
  await page.goto(`${base}/en/members/`, { waitUntil: 'networkidle' });
  await page.locator('[data-seotda-open]').nth(1).click(); await phase('stop');
  await choose('story-challenge'); await choose('story-cherry'); await phase('reveal');
  await choose('story-reveal'); await phase('ending'); await imageReady();
  await expect(game.locator('[data-seotda-scene-title]')).toContainText('You read the table');
  await expect(game.locator('[data-seotda-image]')).toHaveAttribute('src', '/images/tazza/sakura.jpg');
  await expect(game.locator('.seotda-seat--madam [data-month="3"]')).toBeVisible();
  await page.screenshot({ path: '.qa/seotda-sakura.png' });
  await choose('story-restart'); await fiveCards(); await choose('story-call'); await choose('story-challenge'); await choose('story-maple'); await choose('story-reveal');
  await expect(game.locator('[data-seotda-scene-title]')).toContainText('fooled you');
  await choose('story-restart'); await fiveCards(); await choose('story-leave');
  await expect(game.locator('[data-seotda-scene-title]')).toContainText('Walk away');
  // Tutorial is opt-in, available only after choosing free play, and can be skipped.
  await game.locator('[data-seotda-mode="free"]').click(); await phase('ready');
  await expect(game.locator('#seotda-beginner')).not.toHaveAttribute('open', '');
  await game.locator('[data-seotda-help]').click();
  await expect(game.locator('#seotda-beginner')).toHaveAttribute('open', '');
  await game.locator('[data-seotda-practice="left"]').click();
  await expect(game.locator('[data-seotda-practice-result]')).toContainText('Correct');
  await game.locator('[data-seotda-practice-next]').click(); await game.locator('[data-seotda-practice="left"]').click();
  await expect(game.locator('[data-seotda-practice-result]')).toContainText('closer look');
  await game.locator('[data-seotda-practice-next]').click(); await game.locator('[data-seotda-practice="left"]').click();
  await expect(game.locator('[data-seotda-practice-result]')).toContainText('strongest');
  await game.locator('[data-seotda-skip-tutorial]').click();
  await expect(game.locator('#seotda-beginner')).not.toHaveAttribute('open', '');
  await expect(game.locator('[data-seotda-table]')).toBeFocused();
  await choose('deal'); await phase('peek'); await choose('peek'); await phase('bet');
  await expect(game.locator('[data-seotda-actions] button')).toHaveCount(5);
  for (const [width, height] of viewports) {
    await page.setViewportSize({ width, height });
    await layout();
    for (const b of await game.locator('[data-seotda-actions] button').all()) await expect(b).toBeInViewport();
    if (width === 375) { await game.locator('.seotda-body').evaluate(el => el.scrollTop = 0); await page.screenshot({ path: '.qa/seotda-free-375.png' }); }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await choose('bet-double'); await phase('reveal'); await choose('show'); await phase('result');
  const before = await page.evaluate(() => localStorage.getItem('dda_com-axii-seotda-v1'));
  await page.reload({ waitUntil: 'networkidle' }); await start();
  // The profile always opens the cinematic mode; the free match still resumes from its tab.
  await expect(game).toHaveAttribute('data-mode', 'story');
  await game.locator('[data-seotda-mode="free"]').click(); await phase('result');
  assert.equal(JSON.parse(await page.evaluate(() => localStorage.getItem('dda_com-axii-seotda-v1'))).table.length, JSON.parse(before).table.length);
  await game.locator('[data-seotda-notes]').click();
  const gallery = game.locator('[data-seotda-gallery]'); await gallery.evaluate(el => { el.open = true; });
  for (const img of await gallery.locator('img').all()) { await img.scrollIntoViewIfNeeded(); await expect.poll(() => img.evaluate(el => el.complete && el.naturalWidth >= 1000 && el.naturalHeight >= 667)).toBe(true); }
  await expect(gallery.locator('img')).toHaveCount(7);
  audit = await new AxeBuilder({ page }).include('#member-seotda').analyze();
  assert.deepEqual(audit.violations.map(v => `${v.id} ${v.nodes.map(n => n.target).join(',')}`), []);
  await page.keyboard.press('Escape'); await expect(game.locator('[data-seotda-notes]')).toBeFocused();
  await expect(game).toBeVisible();
  await page.keyboard.press('Escape'); await expect(trigger).toBeFocused();
  // Image failures do not block play and have a real retry action.
  await page.route('**/images/tazza/*.jpg', route => route.abort());
  await page.reload({ waitUntil: 'networkidle' }); await start();
  await expect(game.locator('[data-seotda-image-retry]')).toBeVisible();
  await page.unroute('**/images/tazza/*.jpg'); await game.locator('[data-seotda-image-retry]').click(); await imageReady();
  // Corrupt storage is discarded without affecting the other Easter eggs.
  await page.evaluate(() => localStorage.setItem('dda_com-axii-seotda-v1', '{bad'));
  await page.reload({ waitUntil: 'networkidle' }); await start(); await phase('intro');
  await expect(page.locator('#member-romance')).not.toBeVisible();
  assert.deepEqual(errors, []);
  const denied = await browser.newContext({ reducedMotion: 'reduce' });
  await denied.addInitScript(() => { Storage.prototype.getItem = () => { throw new Error('blocked'); }; Storage.prototype.setItem = () => { throw new Error('blocked'); }; });
  const deniedPage = await denied.newPage(); await deniedPage.goto(`${base}/members/`); await deniedPage.locator('[data-seotda-open]').first().click();
  await deniedPage.locator('[data-seotda-action="story-deal"]').click(); await expect(deniedPage.locator('[data-seotda-save]')).toHaveAttribute('data-error', 'true');
  await deniedPage.keyboard.press('Escape'); await deniedPage.locator('[data-seotda-open]').first().click(); await expect(deniedPage.locator('#member-seotda')).toHaveAttribute('data-phase', 'deal');
  await denied.close();
  console.log('Seotda browser passed: Axii portrait/name, immediate story, all story endings, 7 caption-free 1000px film stills, bilingual persistence, free-game betting, optional/skippable tutorial and practice, all phases without gameplay scrolling at nine viewport sizes, accessibility, image retry and blocked/corrupt saves.');
} finally { await browser.close(); }
