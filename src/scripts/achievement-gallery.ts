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
  const galleries = [...document.querySelectorAll<HTMLAnchorElement>('a[data-gallery]')].flatMap(link => {
    const template = document.getElementById(link.dataset.gallery!);
    return template instanceof HTMLTemplateElement ? [{ link, template }] : [];
  });
  let photos: { link: HTMLAnchorElement; template: HTMLTemplateElement; slide: HTMLElement }[] = [];
  let current = 0;
  let opener: HTMLAnchorElement | undefined;
  let backdropPointer = false;
  let gesture: { pointer: number; x: number; y: number; dragging: boolean } | undefined;

  const show = (index: number) => {
    if (!photos.length) return;
    current = (index + photos.length) % photos.length;
    const photo = photos[current];
    const slide = photo.slide.cloneNode(true) as HTMLElement;
    slide.hidden = false;
    title.textContent = photo.template.dataset.title!;
    summary.textContent = photo.template.dataset.summary!;
    source.hidden = !photo.template.dataset.source;
    if (photo.template.dataset.source) source.href = photo.template.dataset.source;
    else source.removeAttribute('href');
    container.replaceChildren(slide);
    const img = slide.querySelector<HTMLImageElement>('img')!;
    error.hidden = true;
    img.addEventListener('error', () => {
      if (dialog.contains(img)) error.hidden = false;
    });
    // Only the selected image enters the DOM and starts loading.
    img.draggable = false;
    img.src = img.dataset.src!;
    fullSize.href = img.dataset.src!;
    count.textContent = `${current + 1} / ${photos.length}`;
    count.setAttribute('aria-label', `${count.textContent} · ${title.textContent} · ${img.alt}`);
    steps.forEach(button => { button.hidden = photos.length < 2; });
  };

  galleries.forEach(({ link }) => {
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
      // Follow the visible competition order, including every photo of each block.
      photos = galleries.filter(gallery => !gallery.link.closest('[hidden]')).flatMap(gallery =>
        [...gallery.template.content.querySelectorAll<HTMLElement>('[data-gallery-slide]')].map(slide => ({ ...gallery, slide })));
      const start = photos.findIndex(photo => photo.link === link);
      if (start < 0) return;
      event.preventDefault();
      opener = link;
      show(start);
      dialog.showModal();
      dialog.scrollTop = 0;
      document.documentElement.classList.add('gallery-open');
    });
  });

  dialog.querySelector('[data-gallery-close]')?.addEventListener('click', () => dialog.close());
  steps.forEach(button => button.addEventListener('click', () => show(current + Number(button.dataset.galleryStep))));
  dialog.addEventListener('keydown', event => {
    if (photos.length < 2 || event.ctrlKey || event.metaKey || event.altKey || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    show(current + (event.key === 'ArrowRight' ? 1 : -1));
  });

  const cancelGesture = () => {
    const pointer = gesture?.pointer;
    gesture = undefined;
    container.classList.remove('is-swiping');
    if (pointer !== undefined && container.hasPointerCapture(pointer)) container.releasePointerCapture(pointer);
  };
  container.addEventListener('pointerdown', event => {
    // A second finger cancels navigation so native pinch zoom remains available.
    if (!event.isPrimary) { cancelGesture(); return; }
    if (event.button !== 0 || photos.length < 2 || !(event.target instanceof HTMLImageElement)) return;
    gesture = { pointer: event.pointerId, x: event.clientX, y: event.clientY, dragging: false };
  });
  container.addEventListener('pointermove', event => {
    if (!gesture || gesture.pointer !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (!gesture.dragging) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
      if (Math.abs(dx) <= Math.abs(dy) * 1.25) { cancelGesture(); return; }
      gesture.dragging = true;
      container.setPointerCapture(event.pointerId);
      container.classList.add('is-swiping');
    }
    event.preventDefault();
  });
  container.addEventListener('pointerup', event => {
    if (!gesture || gesture.pointer !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    const threshold = Math.min(80, Math.max(40, container.clientWidth * .08));
    const navigate = gesture.dragging && Math.abs(dx) >= threshold && Math.abs(dx) > Math.abs(dy) * 1.25;
    cancelGesture();
    if (navigate) show(current + (dx < 0 ? 1 : -1));
  });
  container.addEventListener('pointercancel', cancelGesture);
  container.addEventListener('lostpointercapture', event => {
    // Touch starts with implicit capture on the image. Its bubbling loss during
    // the handover to the container must not cancel the active swipe.
    if (event.target === container) cancelGesture();
  });
  container.addEventListener('pointerleave', () => { if (!gesture?.dragging) cancelGesture(); });
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
    cancelGesture();
    document.documentElement.classList.remove('gallery-open');
    container.replaceChildren();
    photos = [];
    backdropPointer = false;
    opener?.focus({ preventScroll: true });
  });
}

setupAchievementGallery();
export {};
