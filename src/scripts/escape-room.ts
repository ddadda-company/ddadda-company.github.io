import { flags, type FlagId, type PuzzleId } from '../data/escape';
import { collectFlag, flagsReady, foundFlags, isFlagInput } from './flag-store';

const dialog = document.querySelector<HTMLDialogElement>('[data-escape-dialog]');
if (dialog) {
  const ko = document.documentElement.lang === 'ko';
  const text = (korean: string, english: string) => ko ? korean : english;
  const title = dialog.querySelector<HTMLElement>('#escape-title')!;
  const feedback = dialog.querySelector<HTMLElement>('[data-escape-feedback]')!;
  const collection = dialog.querySelector<HTMLElement>('[data-escape-collection]')!;
  const room = dialog.querySelector<HTMLElement>('[data-challenge-room]')!;
  const solved = dialog.querySelector<HTMLElement>('[data-escape-solved]')!;
  const finale = dialog.querySelector<HTMLElement>('[data-escape-finale]')!;
  const form = dialog.querySelector<HTMLFormElement>('[data-challenge-form]')!;
  const input = dialog.querySelector<HTMLInputElement>('#challenge-answer')!;
  const submit = dialog.querySelector<HTMLButtonElement>('[data-challenge-submit]')!;
  let active: PuzzleId | undefined;
  let returnFocus: HTMLElement | null = null;
  let generation = 0;
  const say = (message: string, error = false) => {
    feedback.textContent = message;
    feedback.dataset.error = String(error);
    feedback.classList.toggle('visually-hidden', !error);
  };
  const updateCollection = () => {
    const found = foundFlags();
    document.querySelectorAll('[data-flag-count]').forEach(el => { el.textContent = `${found.size}/${flags.length}`; });
    dialog.querySelector<HTMLElement>('[data-collection-summary]')!.textContent = text(`${flags.length}개 중 ${found.size}개 확보`, `${found.size} of ${flags.length} captured`);
    dialog.querySelector<HTMLElement>('[data-replay-finale]')!.hidden = found.size !== flags.length;
    dialog.querySelectorAll<HTMLElement>('[data-collection-item]').forEach(item => {
      const answer = found.get(item.dataset.collectionItem as FlagId);
      item.dataset.found = String(!!answer);
      item.querySelector<HTMLElement>('.collection-mark')!.textContent = answer ? '✓' : '?';
      item.querySelector<HTMLElement>('[data-collection-clue]')!.hidden = !!answer;
      const code = item.querySelector<HTMLElement>('[data-collection-code]')!;
      code.hidden = !answer;
      code.textContent = answer ?? '';
      item.querySelector<HTMLElement>('[data-collection-copy]')!.hidden = !answer;
    });
  };
  const showResult = (answer: string) => {
    solved.hidden = false;
    form.hidden = true;
    dialog.querySelector<HTMLElement>('[data-escape-flag]')!.textContent = answer;
    dialog.querySelector<HTMLButtonElement>('[data-escape-copy]')!.textContent = text('플래그 복사', 'Copy flag');
  };
  const prepare = () => {
    generation++;
    say('');
    collection.hidden = true;
    room.hidden = true;
    solved.hidden = true;
    finale.hidden = true;
    finale.classList.remove('is-celebrating');
    form.hidden = false;
    input.removeAttribute('aria-invalid');
    submit.disabled = false;
    submit.textContent = text('제출', 'Submit');
    dialog.querySelectorAll<HTMLButtonElement>('[data-collection-copy]').forEach(button => { button.textContent = text('복사', 'Copy'); });
  };
  const present = (opener?: HTMLElement) => {
    if (!dialog.open) {
      returnFocus = opener ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
      dialog.showModal();
      document.documentElement.classList.add('escape-open');
    }
    title.focus({ preventScroll: true });
    dialog.scrollTop = 0;
  };
  const showCollection = (opener?: HTMLElement) => {
    prepare(); active = undefined;
    title.textContent = text('찾은 플래그', 'Your flags');
    collection.hidden = false;
    dialog.dataset.mode = 'collection';
    updateCollection(); present(opener);
  };
  const openPuzzle = (id: string, opener: HTMLElement) => {
    const challenge = flags.find(flag => flag.id === id && flag.id !== 'invisible');
    if (!challenge) return;
    prepare(); active = challenge.id as PuzzleId;
    title.textContent = challenge.title[ko ? 'ko' : 'en'];
    dialog.dataset.mode = 'challenge';
    room.hidden = false;
    dialog.querySelector<HTMLElement>('[data-challenge-description]')!.textContent = challenge.description[ko ? 'ko' : 'en'];
    dialog.querySelectorAll<HTMLElement>('[data-materials-for]').forEach(material => { material.hidden = material.dataset.materialsFor !== id; });
    form.reset();
    const answer = foundFlags().get(active);
    if (answer) showResult(answer);
    present(opener);
  };
  const burst = dialog.querySelector<HTMLElement>('[data-finale-burst]')!;
  for (let index = 0; index < 64; index++) {
    const piece = document.createElement('i');
    piece.className = `burst-piece burst-piece--${index % 4}`;
    const direction = (index / 64) * Math.PI * 2;
    piece.style.setProperty('--burst-x', `${Math.cos(direction) * (22 + index % 27)}vw`);
    piece.style.setProperty('--burst-y', `${-18 - Math.abs(Math.sin(direction)) * 40}vh`);
    piece.style.setProperty('--burst-spin', `${(index % 2 ? 1 : -1) * (360 + index * 19)}deg`);
    piece.style.setProperty('--burst-delay', `${index % 8 * 30}ms`);
    burst.append(piece);
  }
  const playFinale = () => {
    finale.classList.remove('is-celebrating');
    void finale.offsetWidth;
    finale.classList.add('is-celebrating');
  };
  const showFinale = (opener?: HTMLElement) => {
    if (foundFlags().size !== flags.length) return;
    prepare(); active = undefined;
    title.textContent = text('탈출 성공', 'Escape complete');
    dialog.dataset.mode = 'complete';
    finale.hidden = false;
    present(opener); playFinale();
    say(text('일곱 개의 플래그를 모두 확보했습니다. 탈출 성공.', 'All seven flags captured. Escape complete.'));
  };
  document.querySelectorAll<HTMLElement>('[data-escape-puzzle]').forEach(trigger => {
    trigger.hidden = false; trigger.removeAttribute('disabled');
    trigger.addEventListener('click', () => openPuzzle(trigger.dataset.escapePuzzle!, trigger));
  });
  document.querySelectorAll<HTMLButtonElement>('[data-open-collection]').forEach(button => {
    button.hidden = false; button.addEventListener('click', () => showCollection(button));
  });
  document.querySelectorAll<HTMLElement>('[data-puzzle-fallback]').forEach(fallback => { fallback.hidden = true; });
  dialog.querySelector<HTMLButtonElement>('[data-replay-finale]')!.addEventListener('click', event => showFinale(event.currentTarget as HTMLElement));
  dialog.querySelector('[data-finale-again]')!.addEventListener('click', playFinale);
  dialog.querySelector('[data-escape-close]')!.addEventListener('click', () => dialog.close());
  let backdropDown = false;
  dialog.addEventListener('pointerdown', event => { backdropDown = event.target === dialog; });
  dialog.addEventListener('click', event => { if (event.target === dialog && backdropDown) dialog.close(); });
  dialog.addEventListener('close', () => {
    generation++;
    finale.classList.remove('is-celebrating');
    document.documentElement.classList.remove('escape-open');
    returnFocus?.focus({ preventScroll: true });
  });
  input.addEventListener('input', () => { input.removeAttribute('aria-invalid'); say(''); });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!active || submit.disabled) return;
    const id = active, submittedAt = generation, answer = input.value.trim();
    if (!isFlagInput(answer)) {
      input.setAttribute('aria-invalid', 'true');
      say(text('dda{...} 형식의 플래그를 입력해 주세요. 중괄호 안에는 영문, 숫자, 밑줄만 사용할 수 있습니다.', 'Use dda{...} with letters, digits, and underscores inside the braces.'), true);
      return;
    }
    submit.disabled = true; submit.textContent = text('확인 중', 'Checking');
    try {
      const accepted = await collectFlag(id, answer);
      if (submittedAt !== generation || !dialog.open) return;
      if (accepted) {
        showResult(answer);
        say(text('정답입니다. 플래그를 확보했습니다.', 'Correct. Flag captured.'));
        if (foundFlags().size < flags.length) solved.scrollIntoView({ block: 'nearest', behavior: 'instant' });
      } else {
        input.setAttribute('aria-invalid', 'true');
        say(text('플래그가 일치하지 않습니다.', 'That flag does not match.'), true);
      }
    } catch {
      if (submittedAt === generation) say(text('정답을 확인하지 못했습니다. HTTPS 주소에서 다시 시도해 주세요.', 'Could not verify the answer. Please retry on the HTTPS site.'), true);
    } finally {
      if (submittedAt === generation) { submit.disabled = false; submit.textContent = text('제출', 'Submit'); }
    }
  });
  const copyFlag = async (button: HTMLButtonElement, id: FlagId) => {
    const answer = foundFlags().get(id);
    if (!answer) return;
    const copiedAt = generation; button.disabled = true;
    try {
      await navigator.clipboard.writeText(answer);
      if (copiedAt === generation && dialog.open) { button.textContent = text('복사했어요', 'Copied'); say(text('플래그를 복사했습니다.', 'Flag copied.')); }
    } catch {
      if (copiedAt === generation && dialog.open) say(text('복사하지 못했습니다. 글자를 직접 선택해 복사해 주세요.', 'Could not copy. Select the flag text to copy it.'), true);
    } finally { button.disabled = false; }
  };
  dialog.querySelector<HTMLButtonElement>('[data-escape-copy]')!.addEventListener('click', event => {
    if (active) void copyFlag(event.currentTarget as HTMLButtonElement, active);
  });
  dialog.querySelectorAll<HTMLButtonElement>('[data-collection-copy]').forEach(button => {
    button.addEventListener('click', () => { void copyFlag(button, button.dataset.collectionCopy as FlagId); });
  });
  dialog.querySelectorAll<HTMLButtonElement>('[data-material-copy]').forEach(button => {
    const originalLabel = button.textContent;
    button.addEventListener('click', async () => {
      const code = document.getElementById(button.dataset.materialCopy!);
      if (!code) return;
      const copiedAt = generation; button.disabled = true;
      try {
        await navigator.clipboard.writeText(code.textContent ?? '');
        if (copiedAt === generation) { button.textContent = text('복사했어요', 'Copied'); say(text('자료를 복사했습니다.', 'Material copied.')); }
      } catch {
        if (copiedAt === generation) say(text('복사하지 못했습니다. 코드를 직접 선택해 복사해 주세요.', 'Could not copy. Select the code to copy it.'), true);
      } finally { button.disabled = false; }
    });
    button.addEventListener('blur', () => { button.textContent = originalLabel; });
  });
  dialog.querySelectorAll<HTMLAnchorElement>('[data-collection-clue]').forEach(link => {
    link.addEventListener('click', () => dialog.close());
  });
  window.addEventListener('dda:flag-found', () => {
    updateCollection();
    if (foundFlags().size === flags.length) requestAnimationFrame(() => showFinale());
  });
  window.addEventListener('dda:flags-updated', updateCollection);
  void flagsReady.then(updateCollection);
  updateCollection();
}
