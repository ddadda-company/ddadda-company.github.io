import { animal, bright, type Card } from '../lib/seotda';
import { flowers } from '../data/seotda';

/** A lookup sheet shared by the optional lessons and table notes. */
export function createSeotdaCardChart(root: HTMLElement, ko: boolean, card: (value: Card) => HTMLElement) {
  const text = (a: string, b: string) => ko ? a : b;
  const sheet = root.querySelector<HTMLElement>('#seotda-card-chart')!;
  const list = sheet.querySelector<HTMLOListElement>('[data-seotda-months]')!;
  const back = sheet.querySelector<HTMLButtonElement>('[data-seotda-chart-close]')!;
  const notes = root.querySelector<HTMLElement>('#seotda-notes')!;
  const background = Array.from(notes.children).filter(node => node !== sheet) as HTMLElement[];
  let opener: HTMLElement | undefined;
  const el = (tag: string, content = '', className = '') => { const node = document.createElement(tag); node.textContent = content; node.className = className; return node; };
  const close = (restoreFocus = true) => {
    if (sheet.hidden) return;
    sheet.hidden = true; delete notes.dataset.chart;
    background.forEach(node => { node.inert = false; });
    if (restoreFocus) opener?.focus({ preventScroll: true });
  };
  root.querySelectorAll<HTMLElement>('[data-seotda-chart-open]').forEach(trigger => trigger.addEventListener('click', () => {
    opener = trigger;
    // Fetch the 20 original card images only when the reference is requested.
    if (!list.childElementCount) {
      flowers.forEach((flower, i) => {
        const item = el('li'); item.dataset.month = String(i + 1);
        const title = el('h4'); title.append(el('strong', text(`${i + 1}월`, String(i + 1))), el('span', flower[ko ? 'ko' : 'en']));
        const hand = el('div', '', 'seotda-hand');
        for (const value of [i * 2, i * 2 + 1]) {
          const figure = el('figure');
          const kind = bright(value) ? text('광 · 光', 'Bright · 光') : animal(value) ? text('열', 'Animal') : text('띠', 'Ribbon');
          figure.append(card(value), el('figcaption', kind)); hand.append(figure);
        }
        item.append(title, hand); list.append(item);
      });
    }
    back.textContent = trigger.closest('[data-seotda-guide]') ? text('← 튜토리얼로', '← Lesson') : text('← 노트로', '← Notes');
    sheet.hidden = false; notes.dataset.chart = 'true';
    background.forEach(node => { node.inert = true; });
    sheet.querySelector('.seotda-chart-scroll')!.scrollTop = 0;
    sheet.querySelector<HTMLElement>('#seotda-chart-title')!.focus({ preventScroll: true });
  }));
  back.addEventListener('click', () => close());
  return { close, active: () => !sheet.hidden };
}
