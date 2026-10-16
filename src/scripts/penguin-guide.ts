function setupPenguinGuide() {
  const guide = document.querySelector<HTMLElement>('#penguin-guide');
  if (!guide || typeof HTMLDialogElement === 'undefined' || typeof HTMLDialogElement.prototype.showModal !== 'function') return;
  const pages = [...guide.querySelectorAll<HTMLElement>('[data-penguin-page]')];
  const selectors = [...guide.querySelectorAll<HTMLButtonElement>('[data-penguin-select]')];
  const modes = [...guide.querySelectorAll<HTMLButtonElement>('[data-penguin-mode]')];
  const count = guide.querySelector<HTMLElement>('[data-penguin-count]')!;
  const body = guide.querySelector<HTMLElement>('[data-penguin-body]')!;
  const close = guide.querySelector<HTMLButtonElement>('[data-penguin-close]')!;
  const triggers = [...document.querySelectorAll<HTMLAnchorElement>('[data-penguin-open]')];
  const dialog = document.createElement('dialog');
  dialog.id = 'penguin-dialog';
  dialog.className = 'penguin-dialog';
  dialog.setAttribute('aria-labelledby', 'penguin-guide-title');
  document.body.append(dialog);
  dialog.append(guide);
  close.hidden = false;
  close.autofocus = true;
  guide.querySelectorAll<HTMLElement>('[data-penguin-controls]').forEach(control => { control.hidden = false; });
  let current = 0;
  let lastSpecies = 0;
  let opener: HTMLElement | undefined;
  let backdropPointer = false;

  const show = (index: number) => {
    current = (index + pages.length) % pages.length;
    const chicks = current === pages.length - 1;
    if (!chicks) lastSpecies = current;
    pages.forEach((page, i) => { page.hidden = i !== current; });
    selectors.forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
    modes.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.penguinMode === (chicks ? 'chicks' : 'species'))));
    guide.classList.toggle('penguin-guide--chicks', chicks);
    // Keep all six species available so a reader can jump out of the nursery.
    count.textContent = `${String(current + 1).padStart(2, '0')} / ${String(pages.length).padStart(2, '0')}`;
    count.setAttribute('aria-label', `${current + 1} / ${pages.length} · ${pages[current].dataset.penguinName}`);
    body.scrollTop = 0;
  };

  const open = (trigger?: HTMLElement) => {
    if (dialog.open) return;
    opener = trigger;
    show(current);
    dialog.showModal();
    document.documentElement.classList.add('penguin-guide-open');
  };
  triggers.forEach(trigger => {
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', dialog.id);
    trigger.setAttribute('role', 'button');
    trigger.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      open(trigger);
    });
    trigger.addEventListener('keydown', event => {
      if (event.key === ' ') { event.preventDefault(); trigger.click(); }
    });
  });
  selectors.forEach(button => button.addEventListener('click', () => show(Number(button.dataset.penguinSelect))));
  modes.forEach(button => button.addEventListener('click', () => show(button.dataset.penguinMode === 'chicks' ? pages.length - 1 : lastSpecies)));
  guide.querySelectorAll<HTMLButtonElement>('[data-penguin-step]').forEach(button => button.addEventListener('click', () => show(current + Number(button.dataset.penguinStep))));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    show(current + (event.key === 'ArrowRight' ? 1 : -1));
  });
  const outside = (event: MouseEvent) => {
    const rect = dialog.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  };
  dialog.addEventListener('pointerdown', event => { backdropPointer = event.target === dialog && outside(event); });
  dialog.addEventListener('click', event => {
    if (backdropPointer && event.target === dialog && outside(event)) dialog.close();
    backdropPointer = false;
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('penguin-guide-open');
    backdropPointer = false;
    opener?.focus({ preventScroll: true });
  });
  // Native fragment links still reach the complete inline guide without JS.
  // With JS, the same URL can be shared or opened in a new tab as a dialog.
  const openFragment = () => { if (location.hash === '#penguin-guide') open(triggers[0]); };
  window.addEventListener('hashchange', openFragment);
  show(0);
  openFragment();
}

setupPenguinGuide();
export {};
