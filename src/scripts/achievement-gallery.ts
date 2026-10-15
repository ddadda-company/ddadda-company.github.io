function setupAchievementGallery() {
  const dialog = document.querySelector<HTMLDialogElement>('#achievement-gallery');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const title = dialog.querySelector<HTMLElement>('#gallery-title')!;
  const summary = dialog.querySelector<HTMLElement>('#gallery-summary')!;
  const container = dialog.querySelector<HTMLElement>('[data-gallery-slides]')!;
  const count = dialog.querySelector<HTMLElement>('[data-gallery-count]')!;
  const fullSize = dialog.querySelector<HTMLAnchorElement>('[data-gallery-full]')!;
  const source = dialog.querySelector<HTMLAnchorElement>('[data-gallery-source]')!;
  const error = dialog.querySelector<HTMLElement>('[data-gallery-error]')!;
  const steps = [...dialog.querySelectorAll<HTMLButtonElement>('[data-gallery-step]')];
  let slides: HTMLElement[] = [];
  let current = 0;
  let opener: HTMLAnchorElement | undefined;
  let backdropPointer = false;

  const show = (index: number) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== current; });
    const img = slides[current].querySelector<HTMLImageElement>('img')!;
    // Templates and data-src keep every image off the network until selected.
    if (!img.hasAttribute('src')) img.src = img.dataset.src!;
    fullSize.href = img.dataset.src!;
    error.hidden = img.dataset.failed !== 'true';
    count.textContent = `${current + 1} / ${slides.length}`;
    count.setAttribute('aria-label', `${count.textContent} · ${img.alt}`);
    steps.forEach(button => { button.hidden = slides.length < 2; });
  };

  document.querySelectorAll<HTMLAnchorElement>('a[data-gallery]').forEach(link => {
    const template = document.getElementById(link.dataset.gallery!);
    if (!(template instanceof HTMLTemplateElement)) return;
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-controls', dialog.id);
    link.setAttribute('role', 'button');
    link.addEventListener('keydown', event => {
      if (event.key === ' ') { event.preventDefault(); link.click(); }
    });
    link.addEventListener('click', event => {
      // The room's capture-phase drag guard runs before this listener.
      // Modified clicks keep the full-size image link's native behavior.
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      title.textContent = template.dataset.title!;
      summary.textContent = template.dataset.summary!;
      source.hidden = !template.dataset.source;
      if (template.dataset.source) source.href = template.dataset.source;
      else source.removeAttribute('href');
      container.replaceChildren(template.content.cloneNode(true));
      slides = [...container.querySelectorAll<HTMLElement>('[data-gallery-slide]')];
      slides.forEach(slide => {
        const img = slide.querySelector<HTMLImageElement>('img')!;
        img.addEventListener('error', () => {
          img.dataset.failed = 'true';
          if (dialog.contains(img) && !slide.hidden) error.hidden = false;
        });
      });
      show(0);
      dialog.showModal();
      dialog.scrollTop = 0;
      document.documentElement.classList.add('gallery-open');
    });
  });

  dialog.querySelector('[data-gallery-close]')?.addEventListener('click', () => dialog.close());
  steps.forEach(button => button.addEventListener('click', () => show(current + Number(button.dataset.galleryStep))));
  dialog.addEventListener('keydown', event => {
    if (slides.length < 2 || event.ctrlKey || event.metaKey || event.altKey || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
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
    document.documentElement.classList.remove('gallery-open');
    container.replaceChildren();
    slides = [];
    backdropPointer = false;
    opener?.focus({ preventScroll: true });
  });
}

setupAchievementGallery();
export {};
