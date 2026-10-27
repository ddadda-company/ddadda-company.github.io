import {mkdir} from 'node:fs/promises';
import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
await mkdir('.qa/seotda-tutorial', {recursive:true});
const base=process.env.SITE_URL || 'http://localhost:4321';
const browser=await chromium.launch({executablePath:process.env.BROWSER_PATH || '/usr/bin/google-chrome'});
const context=await browser.newContext();const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
for(const lang of ['ko','en']) {
 await page.goto(`${base}/${lang==='en'?'en/':''}members/`);
 await page.locator('[data-seotda-open]').first().click();
 await page.locator('[data-seotda-mode="free"]').click();
 const before=await page.evaluate(()=>localStorage.getItem('dda_com-axii-seotda-v1'));
 await page.locator('[data-seotda-help]').click();
 const guide=page.locator('[data-seotda-guide]');
 for(let step=0;step<5;step++) {
  await expect(guide).toHaveAttribute('data-step',String(step));
  for(const [width,height] of [[1440,1000],[768,900],[414,844],[375,812],[320,700],[320,568],[320,500],[844,390],[568,320]]) {
   await page.setViewportSize({width,height});await page.evaluate(()=>document.fonts.ready);
   await expect.poll(()=>guide.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);
   const issue=await guide.evaluate(g=>{
    const box=g.getBoundingClientRect();
    for(const n of g.querySelectorAll('button,[data-guide-title],.seotda-card,.seotda-guide-feedback')) {
     const r=n.getBoundingClientRect();
     if(r.left<box.left-1||r.right>box.right+1||r.top<box.top-1||r.bottom>box.bottom+1) return `out of guide: ${n.outerHTML.slice(0,120)}`;
    }
    const area=g.querySelector('.seotda-guide-content');
    if(area.scrollWidth>area.clientWidth+1) return 'horizontal overflow';
    if(area.scrollHeight>area.clientHeight+1) return `scroll ${area.scrollHeight}/${area.clientHeight}`;
    return null;
   });
   assert.equal(issue,null,`${lang} step${step} ${width}x${height}: ${issue}`);
   if([375,568,1440].includes(width)) await page.screenshot({path:`.qa/seotda-tutorial/${lang}-${step}-${width}.png`});
  }
  const axe=await new AxeBuilder({page}).include('#member-seotda').analyze();assert.deepEqual(axe.violations.map(v=>v.id),[],`${lang}/${step} axe`);
  if(step===3) {
   await guide.locator('.seotda-guide-choices button').first().click();
   await expect(guide.locator('[data-seotda-practice-result]')).toContainText('40');
   await guide.locator('.seotda-guide-choices button').last().click();
   await expect(guide.locator('[data-seotda-practice-result]')).toContainText('20');
  }
  if(step<4) await guide.locator('[data-guide-next]').click();
 }
 for(let quiz=0;quiz<3;quiz++) {
  await expect(guide.locator('[data-guide-next]')).toBeDisabled();
  await guide.locator('[data-seotda-practice="left"]').click();
  await expect(guide.locator('[data-seotda-practice-result]')).toHaveAttribute('data-correct',String(quiz!==1));
  for(const [width,height] of [[320,500],[375,812],[568,320]]) {
   await page.setViewportSize({width,height});
   assert(await guide.locator('.seotda-guide-content').evaluate(n=>n.scrollWidth<=n.clientWidth+1 && n.scrollHeight<=n.clientHeight+1), `${lang}: answer ${quiz} overflows at ${width}x${height}`);
   await expect(guide.locator('[data-guide-next]')).toBeInViewport();
  }
  if(quiz<2) await guide.locator('[data-guide-next]').click();
 }
 await guide.locator('[data-guide-prev]').click();
 await expect(guide.locator('[data-seotda-practice-result]')).toHaveAttribute('data-correct','false');
 await guide.locator('[data-guide-next]').click(); await guide.locator('[data-guide-next]').click();
 await expect(page.locator('#seotda-notes')).not.toBeVisible();
 assert.equal(await page.evaluate(()=>localStorage.getItem('dda_com-axii-seotda-v1')),before,'tutorial must not change save');
 await page.locator('[data-seotda-help]').click();
 await page.locator('[data-seotda-skip-tutorial]').click();
 await expect(page.locator('[data-seotda-table]')).toBeFocused();
 await page.locator('[data-seotda-notes]').click();
 await page.locator('[data-seotda-rules] summary').click();
 assert(await page.locator('.seotda-notebooks').evaluate(n=>n.scrollWidth<=n.clientWidth+1));
 await page.keyboard.press('Escape');
 await page.locator('[data-seotda-close]').click();
}
assert.deepEqual(errors,[]);
await browser.close();console.log('Bilingual visual tutorial: five steps, nine sizes, quiz, betting, navigation, completion/skip, unchanged saves, a11y passed.');
