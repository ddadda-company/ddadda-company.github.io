import { romanceScenes, romanceEndings } from '../data/member-romance';

export function setupMemberRomance() {
  const dialog = document.querySelector<HTMLDialogElement>('#member-romance');
  if (!dialog || typeof dialog.showModal !== 'function') return () => false;
  const locale = document.documentElement.lang === 'ko' ? 'ko' : 'en';
  const page = dialog.querySelector<HTMLElement>('[data-romance-page]')!;
  const dialogue = dialog.querySelector<HTMLElement>('[data-romance-dialogue]')!;
  const reply = dialog.querySelector<HTMLElement>('[data-romance-reply]')!;
  const line = dialog.querySelector<HTMLElement>('[data-romance-line]')!;
  const ending = dialog.querySelector<HTMLElement>('[data-romance-ending]')!;
  const choices = dialog.querySelector<HTMLElement>('[data-romance-choices]')!;
  const finish = dialog.querySelector<HTMLButtonElement>('[data-romance-finish]')!;
  let step = 0;
  let score = 0;
  let opener: HTMLElement | undefined;

  const render = (response = '') => {
    const done = step === romanceScenes.length;
    dialog.dataset.affection = score >= 3 ? 'high' : 'warm';
    dialog.dataset.step = String(step);
    reply.textContent = response;
    reply.hidden = !response;
    choices.replaceChildren();
    ending.hidden = !done;
    finish.hidden = !done;
    if (done) {
      const result = romanceEndings.find(result => score >= result.minimum)!;
      page.textContent = locale === 'ko' ? '우리의 엔딩' : 'Our ending';
      ending.textContent = result.title[locale];
      line.textContent = result.line[locale];
    } else {
      page.textContent = `${step + 1} / ${romanceScenes.length}`;
      line.textContent = romanceScenes[step].line[locale];
      romanceScenes[step].choices.forEach(choice => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = choice.label[locale];
        button.addEventListener('click', () => {
          score += choice.points;
          step++;
          render(choice.reply[locale]);
          dialogue.focus({ preventScroll: true });
        }, { once: true });
        choices.append(button);
      });
    }
  };
  const close = () => { if (dialog.open) dialog.close(); };
  dialog.querySelector('[data-romance-close]')!.addEventListener('click', close);
  finish.addEventListener('click', close);
  dialog.addEventListener('close', () => opener?.focus({ preventScroll: true }));
  let backdropPointer = false;
  const outside = (event: MouseEvent) => {
    const rect = dialog.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  };
  dialog.addEventListener('pointerdown', event => { backdropPointer = event.target === dialog && outside(event); });
  dialog.addEventListener('click', event => {
    if (backdropPointer && event.target === dialog && outside(event)) close();
    backdropPointer = false;
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) close(); });
  window.addEventListener('pagehide', close);
  return (trigger?: HTMLElement) => {
    if (document.hidden || document.querySelector('dialog[open]')) return false;
    opener = trigger;
    step = 0;
    score = 0;
    render();
    dialog.showModal();
    dialogue.focus({ preventScroll: true });
    return true;
  };
}
