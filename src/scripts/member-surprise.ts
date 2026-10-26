import { recordMemberPhoto } from './member-collection';
import { setupMemberRomance } from './member-romance';

function setupMemberSurprise() {
  const dialog = document.querySelector<HTMLDialogElement>('#member-surprise');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const photos: string[] = JSON.parse(dialog.dataset.photos || '[]');
  const photo = dialog.querySelector<HTMLImageElement>('[data-surprise-photo]')!;
  const discovery = dialog.querySelector<HTMLElement>('[data-surprise-discovery]')!;
  const status = document.querySelector<HTMLElement>('[data-surprise-status]')!;
  const openRomance = setupMemberRomance();
  const readyPhotos: string[] = [];
  // Decode ahead of the click so opening the dialog never waits on a download.
  const preloads = photos.map(async src => {
    const image = new Image();
    image.src = src;
    await image.decode();
    readyPhotos.push(src);
    return src;
  });
  const firstReady = Promise.any(preloads);
  // A failed preload must not create an unhandled rejection before a click.
  void firstReady.catch(() => {});
  let opener: HTMLElement | undefined;
  let pending = false;
  let generation = 0;
  let lastPhoto = '';
  let timer: number | undefined;
  let continueToRomance = false;

  const reset = () => {
    generation++;
    pending = false;
    window.clearTimeout(timer);
  };
  const dismiss = () => {
    continueToRomance = false;
    reset();
    if (dialog.open) dialog.close();
  };
  document.querySelectorAll<HTMLElement>('[data-surprise-open]').forEach(trigger => {
    trigger.addEventListener('click', async () => {
      if (pending || dialog.open || document.querySelector('dialog[open]')) return;
      pending = true;
      opener = trigger;
      const attempt = ++generation;
      if (!readyPhotos.length) {
        // Only a click before the first image arrives needs to wait for loading.
        timer = window.setTimeout(reset, 8000);
        try { await firstReady; } catch {
          if (generation === attempt) {
            reset();
            status.textContent = document.documentElement.lang === 'ko' ? '사진을 불러오지 못했어요. 페이지를 새로고침해 주세요.' : 'Could not load a photo. Please reload the page.';
          }
          return;
        }
      }
      if (generation !== attempt) return;
      window.clearTimeout(timer);
      if (document.hidden || document.querySelector('dialog[open]')) { reset(); return; }
      const choices = readyPhotos.filter(src => src !== lastPhoto);
      const candidates = choices.length ? choices : readyPhotos;
      const src = candidates[Math.floor(Math.random() * candidates.length)];
      photo.src = src;
      lastPhoto = src;
      pending = false;
      dialog.showModal();
      discovery.textContent = recordMemberPhoto(src);
      const romanceEncounter = Math.random() < 0.2;
      timer = window.setTimeout(() => {
        continueToRomance = romanceEncounter && !document.hidden;
        dialog.close();
      }, 1600);
    });
  });
  dialog.addEventListener('click', dismiss);
  dialog.addEventListener('close', () => {
    const startRomance = continueToRomance;
    continueToRomance = false;
    reset();
    status.textContent = discovery.textContent;
    if (startRomance && openRomance(opener)) return;
    opener?.focus({ preventScroll: true });
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') dismiss(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) dismiss(); });
  window.addEventListener('pagehide', dismiss);
}

setupMemberSurprise();
export {};
