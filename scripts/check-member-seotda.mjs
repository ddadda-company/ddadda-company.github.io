import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { month, bright, animal } from '../src/lib/seotda.ts';
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
  await expect.poll(() => game.locator('.seotda-table .seotda-card img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0))).toBe(true);
  await game.evaluate(root => Promise.all(root.getAnimations({ subtree: true }).map(a => a.finished.catch(() => {}))));
  const problem = await game.evaluate(root => {
    const body = root.querySelector('.seotda-body'), table = root.querySelector('.seotda-table');
    const contains = (outer, inner) => inner.left >= outer.left - 1 && inner.top >= outer.top - 1 && inner.right <= outer.right + 1 && inner.bottom <= outer.bottom + 1;
    const viewport = { left: 0, top: 0, right: innerWidth, bottom: innerHeight };
    if (root.scrollWidth > root.clientWidth || root.scrollHeight > root.clientHeight + 1 || body.scrollHeight > body.clientHeight + 1) return 'gameplay overflows';
    for (const node of root.querySelectorAll('.seotda-table .seotda-card, .seotda-table h4, .seotda-table p, .seotda-pot')) {
      if (!contains(table.getBoundingClientRect(), node.getBoundingClientRect())) return `outside table: ${node.className}`;
    }
    for (const img of root.querySelectorAll('.seotda-table .seotda-card img')) {
      if (!contains(img.parentElement.getBoundingClientRect(), img.getBoundingClientRect())) return 'card image is clipped';
      if (getComputedStyle(img).objectFit !== 'contain') return 'card art is cropped';
    }
    if (root.querySelector('.seotda-card svg')) return 'generated card drawing remains';
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
const choose = async id => { await action(id).click(); await finishCut(); await allLayouts(); };
const seenCuts = new Set();
const finishCut = async () => {
  const cut = game.locator('[data-seotda-cut]');
  if (!await cut.isVisible()) return;
  const kind = await cut.getAttribute('data-kind');
  await expect(game.locator('.seotda-controls')).toHaveAttribute('inert', '');
  await expect(cut.locator('[data-seotda-cut-next]')).toBeFocused();
  const checkCut = async () => {
    const original = page.viewportSize();
    for (const [width, height] of viewports) {
      await page.setViewportSize({width,height});
      await game.evaluate(root => Promise.all(root.getAnimations({subtree:true}).map(a => a.finished.catch(() => {}))));
      assert(await cut.evaluate(el => el.scrollHeight <= el.clientHeight + 1 && el.scrollWidth <= el.clientWidth + 1));
      for (const selector of ['[data-seotda-cut-title]', '[data-seotda-cut-line]', '[data-seotda-cut-next]']) await expect(cut.locator(selector)).toBeInViewport();
      await expect(game.locator('[data-seotda-close]')).toBeInViewport();
      if (width === 375 || width === 1440) await page.screenshot({path: `.qa/seotda-cut-${kind}-${await cut.getAttribute('data-flipped')}-${width}.png`});
    }
    await page.setViewportSize(original);
  };
  if (!seenCuts.has(kind)) { await checkCut(); const audit = await new AxeBuilder({page}).include('#member-seotda').analyze(); assert.deepEqual(audit.violations.map(v=>v.id), []); }
  if (kind === 'reveal') {
    await expect(cut.locator('[data-seotda-cut-card]')).toHaveAttribute('src', '/images/hwatu/back.svg');
    await cut.locator('[data-seotda-cut-next]').click();
    await expect(cut).toHaveAttribute('data-flipped', 'true');
    await expect(cut.locator('[data-seotda-cut-card]')).toHaveAttribute('src', '/images/hwatu/m03-02.svg');
    if (!seenCuts.has(kind)) await checkCut();
  }
  if (!seenCuts.has(kind)) await page.keyboard.press('Escape');
  else await cut.locator('[data-seotda-cut-next]').click();
  seenCuts.add(kind);
  await expect(cut).not.toBeVisible(); await expect(game).toBeVisible();
  await expect(game.locator('.seotda-controls')).not.toHaveAttribute('inert', '');
};
const phase = value => expect(game).toHaveAttribute('data-phase', value);
const imageReady = async () => { await expect(game.locator('[data-seotda-image]')).toBeVisible(); assert(await game.locator('[data-seotda-image]').evaluate(el => el.complete && el.naturalWidth >= 1000 && el.naturalHeight >= 667)); };
const start = async () => { await trigger.click(); await expect(game).toBeVisible(); };
const fiveCards = async () => { for (let i = 0; i < 5; i++) await choose('story-deal'); await phase('bet'); };
const openingRounds = async (verifyLayouts = false) => {
  const play = async id => { await action(id).click(); if (verifyLayouts) await allLayouts(); };
  for (let i = 0; i < 2; i++) {
    await play('deal'); await phase('peek'); await play('peek'); await phase('bet');
    await play('bet-fold'); await phase('reveal'); await play('show'); await phase('result');
    await expect(game.locator('[data-seotda-meme]')).not.toBeVisible();
    if (verifyLayouts && i === 0) {
      await page.reload({ waitUntil: 'networkidle' }); await start(); await phase('result');
      await expect(game).toHaveAttribute('data-stage', 'opening');
    }
  }
  await play('join-table'); await phase('intro');
  await expect(game).toHaveAttribute('data-stage', 'showdown');
  await expect(game.locator('[data-seotda-score]')).toContainText('960');
};
try {
  await mkdir('.qa', { recursive: true });
  for (const route of ['/', '/achievements/', '/contact/', '/en/', '/en/achievements/', '/en/contact/']) {
    await page.goto(`${base}${route}`); await expect(game).toHaveCount(0); await expect(page.locator('[data-seotda-open]')).toHaveCount(0);
  }
  await page.goto(`${base}/members/`, { waitUntil: 'networkidle' });
  // Verify the downloaded files, source card types, and browser decoding of all 21 assets.
  const sources = JSON.parse(await readFile('public/images/hwatu/sources.json', 'utf8')).assets;
  assert.equal(sources.length, 21);
  for (const asset of sources) {
    const data = await readFile(`public/images/hwatu/${asset.cardId}.svg`);
    assert.equal(createHash('sha256').update(data).digest('hex'), asset.sha256);
    if (asset.cardId !== 'back') {
      const id = (Number(asset.cardId.slice(1, 3)) - 1) * 2 + Number(asset.cardId.slice(-2)) - 1;
      assert.equal(month(id), Number(asset.cardId.slice(1, 3)));
      assert.equal(bright(id), asset.title.includes('Hikari'));
      assert.equal(animal(id), asset.title.includes('Tane'));
    }
  }
  await page.evaluate(async ids => {
    await Promise.all(ids.map(async id => { const img = new Image(); img.src = `/images/hwatu/${id}.svg`; await img.decode(); if (!img.naturalWidth) throw new Error(id); }));
  }, sources.map(asset => asset.cardId));
  await expect(page.locator('[data-seotda-open]')).toHaveCount(2);
  await expect(game.locator('img[src]')).toHaveCount(0);
  await start(); await phase('ready'); await expect(game).toHaveAttribute('data-stage', 'opening');
  await expect(game.locator('[data-seotda-help]')).not.toBeVisible();
  await expect(game.locator('#seotda-beginner')).not.toBeVisible();
  await expect(action('deal')).toBeVisible();
  const sound = game.locator('[data-seotda-sound]');
  await expect(sound).toHaveAttribute('aria-pressed', 'true');
  await sound.click(); await expect(sound).toHaveAttribute('aria-pressed', 'false');
  await sound.click(); await expect(sound).toHaveAttribute('aria-pressed', 'true');
  await sound.click();
  await expect(game.locator('[data-seotda-image]')).not.toHaveAttribute('src', /./);
  await expect(game.locator('[data-seotda-gallery]')).not.toBeVisible();
  await expect(game.locator('.seotda-body')).not.toContainText(/아귀|고니|타짜|영화/);
  for (const [width, height] of viewports) {
    await page.setViewportSize({ width, height });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await layout();
    await expect(game.locator('[data-seotda-close]')).toBeInViewport();
    await expect(action('deal')).toBeInViewport();
    if (width === 1440 || width === 375) await page.screenshot({ path: `.qa/seotda-story-${width}.png` });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  let audit = await new AxeBuilder({ page }).include('#member-seotda').analyze();
  assert.deepEqual(audit.violations.map(v => `${v.id} ${v.nodes.map(n => n.target).join(',')}`), []);
  await openingRounds(true);
  await fiveCards();
  await expect(game).toHaveAttribute('data-tension', 'false');
  await expect(game.locator('[data-seotda-image]')).not.toHaveAttribute('src', /./);
  await expect(game.locator('.seotda-seat').first()).toContainText('Axii');
  await choose('story-double'); await phase('stop'); await imageReady();
  await expect(game).toHaveAttribute('data-tension', 'true');
  await expect(game.locator('[data-seotda-score]')).toContainText('760');
  await expect(game.locator('[data-seotda-image]')).toHaveAttribute('src', '/images/tazza/stop.jpg');
  await page.setViewportSize({ width: 375, height: 812 }); await page.screenshot({ path: '.qa/seotda-turn-375.png' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await game.locator('[data-seotda-enlarge]').click();
  await expect(game.locator('#seotda-notes')).toBeVisible();
  await expect(game.locator('[data-seotda-gallery]')).toHaveAttribute('open', '');
  assert((await game.locator('[data-expanded="true"] img').boundingBox()).height > 155);
  await page.keyboard.press('Escape');
  await expect(game.locator('[data-seotda-enlarge]')).toBeFocused();
  // Persist the cinematic branch across closing, reload and language switch.
  await page.keyboard.press('Escape'); await expect(trigger).toBeFocused();
  await page.goto(`${base}/en/members/`, { waitUntil: 'networkidle' });
  await page.locator('[data-seotda-open]').nth(1).click(); await phase('stop');
  await expect(sound).toHaveAttribute('aria-pressed', 'false');
  await expect(game.locator('[data-seotda-cut]')).not.toBeVisible();
  await choose('story-challenge'); await choose('story-cherry'); await phase('reveal');
  await choose('story-reveal'); await phase('ending'); await imageReady();
  await expect(game.locator('[data-seotda-scene-title]')).toContainText('You read the table');
  await expect(game.locator('[data-seotda-image]')).toHaveAttribute('src', '/images/tazza/sakura.jpg');
  await expect(game.locator('.seotda-seat--madam [data-month="3"]')).toBeVisible();
  await expect(game.locator('.seotda-seat--madam [data-card-id="5"] img')).toHaveAttribute('src', '/images/hwatu/m03-02.svg');
  await page.screenshot({ path: '.qa/seotda-sakura.png' });
  await choose('story-restart'); await openingRounds(); await fiveCards(); await choose('story-call'); await choose('story-challenge'); await choose('story-maple'); await choose('story-reveal');
  await expect(game.locator('[data-seotda-scene-title]')).toContainText('fooled you');
  await choose('story-restart'); await openingRounds(); await fiveCards(); await choose('story-call'); await choose('story-leave');
  await expect(game.locator('[data-seotda-scene-title]')).toContainText('Walk away');
  // Tutorial is opt-in, available only after choosing free play, and can be skipped.
  await game.locator('[data-seotda-mode="free"]').click(); await phase('ready');
  await expect(game.locator('#seotda-beginner')).not.toHaveAttribute('open', '');
  await game.locator('[data-seotda-help]').click();
  await expect(game.locator('#seotda-beginner')).toHaveAttribute('open', '');
  for (let lesson = 0; lesson < 4; lesson++) await game.locator('[data-guide-next]').click();
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
  await page.reload({ waitUntil: 'networkidle' }); await start(); await phase('ready');
  await expect(page.locator('#member-romance')).not.toBeVisible();
  assert.deepEqual(errors, []);
  const denied = await browser.newContext({ reducedMotion: 'reduce' });
  await denied.addInitScript(() => { window.AudioContext = class { constructor() { throw new Error('audio unavailable'); } }; Storage.prototype.getItem = () => { throw new Error('blocked'); }; Storage.prototype.setItem = () => { throw new Error('blocked'); }; });
  const deniedPage = await denied.newPage(); await deniedPage.goto(`${base}/members/`); await deniedPage.locator('[data-seotda-open]').first().click();
  await deniedPage.locator('[data-seotda-action="deal"]').click(); await expect(deniedPage.locator('[data-seotda-save]')).toHaveAttribute('data-error', 'true');
  await expect(deniedPage.locator('[data-seotda-sound]')).toHaveAttribute('data-state', 'error');
  assert.equal(await deniedPage.locator('#member-seotda').evaluate(el => el.getAnimations({subtree:true}).length), 0);
  await deniedPage.keyboard.press('Escape'); await deniedPage.locator('[data-seotda-open]').first().click(); await expect(deniedPage.locator('#member-seotda')).toHaveAttribute('data-phase', 'peek');
  await denied.close();
  // Static cutscene controls work without motion or film images; closing a cut leaves no inert UI.
  const quiet = await browser.newContext({reducedMotion: 'reduce'});
  const qp = await quiet.newPage();
  await qp.goto(`${base}/members/`);
  await qp.evaluate(() => localStorage.setItem('dda_com-axii-seotda-v1', JSON.stringify({version: 1, mode: 'story', story: ['deal','deal','deal','deal','deal'], table: []})));
  await qp.reload(); await qp.locator('[data-seotda-open]').first().click();
  await qp.route('**/images/tazza/*.jpg', route => route.abort());
  await qp.locator('[data-seotda-action="story-call"]').click();
  const qcut = qp.locator('[data-seotda-cut]');
  await expect(qcut).toBeVisible(); await expect(qcut).toHaveAttribute('data-state', 'error');
  await expect(qcut.locator('.seotda-cut-error')).toBeVisible();
  assert.equal(await qcut.evaluate(el => el.getAnimations({subtree:true}).length), 0);
  await qp.keyboard.press('Escape'); await expect(qcut).not.toBeVisible();
  for (const id of ['story-challenge','story-cherry','story-reveal']) await qp.locator(`[data-seotda-action="${id}"]`).click();
  await expect(qcut).toBeVisible(); await qp.locator('[data-seotda-close]').click();
  await expect(qp.locator('#member-seotda')).not.toBeVisible();
  await qp.locator('[data-seotda-open]').first().click();
  await expect(qp.locator('#member-seotda')).toHaveAttribute('data-phase','ending');
  await expect(qcut).not.toBeVisible();
  await expect(qp.locator('[data-seotda-action="story-restart"]')).toBeEnabled();
  await quiet.close();
  console.log('Seotda browser passed: Axii portrait/name, full-frame stop/reveal cuts at nine sizes, keyboard cut skip, persistent mute, ordinary two-round opening, saved chips across the surprise transition, no early film spoilers, restart from ordinary play, all story endings, 21 original Hwatu assets with source checksums and bright/animal mapping, 7 caption-free 1000px film stills, bilingual persistence, free-game betting, optional/skippable tutorial and practice, all phases without gameplay scrolling at nine viewport sizes, accessibility, image retry and blocked/corrupt saves.');
} finally { await browser.close(); }
