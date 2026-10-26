const storageKey = 'dda_com-8l4nk-collection-v1';

function setupMemberCollection() {
  const dialog = document.querySelector<HTMLDialogElement>('#surprise-collection');
  if (!dialog || typeof dialog.showModal !== 'function') return () => '';
  const photos: string[] = JSON.parse(dialog.dataset.photos || '[]');
  const entry = document.querySelector<HTMLElement>('[data-surprise-entry]')!;
  const ko = document.documentElement.lang === 'ko';
  const text = (korean: string, english: string) => ko ? korean : english;
  const slots = [...dialog.querySelectorAll<HTMLButtonElement>('[data-collection-photo]')];
  const counts = [...document.querySelectorAll<HTMLElement>('[data-surprise-count]')];
  const progress = dialog.querySelector<HTMLProgressElement>('[data-collection-progress]')!;
  const complete = dialog.querySelector<HTMLElement>('[data-collection-complete]')!;
  const storageNotice = dialog.querySelector<HTMLElement>('[data-collection-storage]')!;
  const detail = dialog.querySelector<HTMLElement>('[data-collection-detail]')!;
  const fullPhoto = dialog.querySelector<HTMLImageElement>('[data-collection-full-photo]')!;
  const caption = dialog.querySelector<HTMLElement>('[data-collection-detail-caption]')!;
  const imageStatus = dialog.querySelector<HTMLElement>('[data-collection-image-status]')!;
  const retry = dialog.querySelector<HTMLButtonElement>('[data-collection-retry]')!;
  let selected = '';
  let opener: HTMLElement | undefined;

  const parse = (raw: string | null): string[] => {
    try {
      const value: unknown = JSON.parse(raw || '[]');
      return Array.isArray(value) ? value.filter((src): src is string => typeof src === 'string' && photos.includes(src)) : [];
    } catch { return []; }
  };
  const read = () => {
    try { return parse(localStorage.getItem(storageKey)); }
    catch { storageNotice.hidden = false; return []; }
  };
  const collected = new Set(read());
  const photoName = (src: string) => `${text('사진', 'Photo')} ${String(photos.indexOf(src) + 1).padStart(2, '0')}`;

  const render = () => {
    entry.hidden = collected.size === 0;
    entry.dataset.complete = String(collected.size === photos.length);
    dialog.querySelectorAll<HTMLElement>('[data-collection-stamp]').forEach(stamp => { stamp.dataset.found = String(collected.has(stamp.dataset.collectionStamp!)); });
    counts.forEach(count => { count.textContent = `${collected.size}/${photos.length}`; });
    progress.value = collected.size;
    complete.hidden = collected.size !== photos.length;
    slots.forEach(slot => {
      const src = slot.dataset.collectionPhoto!;
      const found = collected.has(src);
      const image = slot.querySelector<HTMLImageElement>('[data-collection-thumbnail]')!;
      slot.disabled = !found;
      slot.setAttribute('aria-pressed', String(found && selected === src));
      slot.setAttribute('aria-label', `${photoName(src)} · ${found ? text('크게 보기', 'View photo') : text('미발견', 'Undiscovered')}`);
      slot.querySelector<HTMLElement>('[data-collection-lock]')!.hidden = found;
      slot.querySelector<HTMLElement>('[data-collection-label]')!.textContent = found ? text('수집 완료', 'Collected') : text('미발견', 'Not found');
      image.hidden = !found;
      if (found && image.getAttribute('src') !== src) image.src = src;
    });
    detail.hidden = !collected.has(selected);
    if (!detail.hidden) {
      if (fullPhoto.getAttribute('src') !== selected) loadPhoto(selected);
      fullPhoto.alt = `8l4nk · ${photoName(selected)}`;
      caption.textContent = photoName(selected);
    }
  };
  const loadPhoto = (src: string) => {
    detail.dataset.state = 'loading';
    imageStatus.textContent = text('사진 불러오는 중…', 'Loading photo…');
    imageStatus.hidden = false;
    retry.hidden = true;
    fullPhoto.src = src;
  };
  fullPhoto.addEventListener('load', () => {
    detail.dataset.state = 'success';
    imageStatus.hidden = true;
    retry.hidden = true;
  });
  fullPhoto.addEventListener('error', () => {
    detail.dataset.state = 'error';
    imageStatus.textContent = text('사진을 불러오지 못했어요.', 'Could not load this photo.');
    imageStatus.hidden = false;
    retry.hidden = false;
  });
  retry.addEventListener('click', () => loadPhoto(`${selected}?retry=${Date.now()}`));
  const mergeSaved = () => { read().forEach(src => collected.add(src)); };
  const record = (src: string) => {
    if (!photos.includes(src)) return '';
    mergeSaved();
    const isNew = !collected.has(src);
    collected.add(src);
    try {
      localStorage.setItem(storageKey, JSON.stringify([...collected]));
      storageNotice.hidden = true;
    } catch { storageNotice.hidden = false; }
    render();
    const message = isNew ? text('새 사진 발견!', 'New photo found!') : text('이미 모은 사진!', 'Already collected!');
    return `${message} ${collected.size}/${photos.length}${isNew && collected.size === photos.length ? text(' · 도감 완성 🎉', ' · Collection complete 🎉') : ''}`;
  };

  document.querySelectorAll<HTMLElement>('[data-surprise-collection-open]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      if (!collected.size || document.querySelector('dialog[open]')) return;
      opener = trigger;
      mergeSaved();
      if (!selected) selected = photos.find(src => collected.has(src)) || '';
      render();
      dialog.showModal();
    });
  });
  slots.forEach(slot => slot.addEventListener('click', () => {
    const src = slot.dataset.collectionPhoto!;
    if (!collected.has(src)) return;
    selected = src;
    render();
    detail.scrollIntoView({ block: 'nearest' });
  }));
  dialog.querySelector('[data-collection-close]')!.addEventListener('click', () => dialog.close());
  let backdropPointer = false;
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
    backdropPointer = false;
    opener?.focus({ preventScroll: true });
  });
  window.addEventListener('storage', event => {
    if (event.key !== storageKey) return;
    parse(event.newValue).forEach(src => collected.add(src));
    render();
  });
  render();
  return record;
}

export const recordMemberPhoto = setupMemberCollection();
