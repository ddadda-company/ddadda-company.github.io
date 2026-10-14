import { flags, calendarAnswer, type FlagId, type PuzzleId } from '../data/escape';
import { collectFlag, foundFlags } from './flag-store';

const dialog = document.querySelector<HTMLDialogElement>('[data-escape-dialog]');
if (dialog) {
  const ko = document.documentElement.lang === 'ko';
  const text = (korean: string, english: string) => ko ? korean : english;
  const title = dialog.querySelector<HTMLElement>('#escape-title')!;
  const feedback = dialog.querySelector<HTMLElement>('[data-escape-feedback]')!;
  const collection = dialog.querySelector<HTMLElement>('[data-escape-collection]')!;
  const solved = dialog.querySelector<HTMLElement>('[data-escape-solved]')!;
  const panels = [...dialog.querySelectorAll<HTMLElement>('[data-puzzle-panel]')];
  let active: PuzzleId | undefined;
  let returnFocus: HTMLElement | null = null;
  let memoryTimer: ReturnType<typeof setTimeout> | undefined;
  let openBlocks: HTMLButtonElement[] = [];
  let matchedPairs = 0;
  let calendarOrder: string[] = [];
  let copyGeneration = 0;
  const copyLabel = text('플래그 복사', 'Copy flag');

  const say = (message: string, error = false) => {
    feedback.textContent = message;
    feedback.dataset.error = String(error);
    feedback.classList.toggle('visually-hidden', !error);
  };
  const updateCollection = () => {
    const found = foundFlags();
    document.querySelectorAll('[data-flag-count]').forEach(el => { el.textContent = `${found.size}/${flags.length}`; });
    dialog.querySelector<HTMLElement>('[data-collection-summary]')!.textContent = found.size === flags.length
      ? text('일곱 개 전부 찾았네요. 탈출 성공!', 'All seven found. You escaped!')
      : text(`${flags.length}개 중 ${found.size}개를 찾았어요. 남은 단서는 다른 페이지에도 숨어 있어요.`, `${found.size} of ${flags.length} found. There are more clues tucked away across the site.`);
    dialog.querySelectorAll<HTMLElement>('[data-collection-item]').forEach(item => {
      const collected = found.has(item.dataset.collectionItem as FlagId);
      item.dataset.found = String(collected);
      item.querySelector<HTMLElement>('.collection-mark')!.textContent = collected ? '✓' : '?';
      item.querySelector<HTMLElement>('[data-collection-clue]')!.hidden = collected;
      item.querySelector<HTMLElement>('[data-collection-code]')!.hidden = !collected;
      item.querySelector<HTMLElement>('[data-collection-copy]')!.hidden = !collected;
    });
  };
  const showResult = (id: PuzzleId) => {
    const flag = flags.find(flag => flag.id === id)!;
    solved.hidden = false;
    dialog.querySelector<HTMLElement>('[data-escape-flag]')!.textContent = flag.flag;
    dialog.querySelector<HTMLButtonElement>('[data-escape-copy]')!.textContent = copyLabel;
  };
  const win = () => {
    if (!active) return;
    collectFlag(active);
    showResult(active);
    say(text('플래그를 찾았어요. 수집함에 추가했습니다.', 'Flag found and added to your collection.'));
    requestAnimationFrame(() => {
      if (dialog.open && !solved.hidden) solved.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    });
  };

  const memoryButtons = [...dialog.querySelectorAll<HTMLButtonElement>('[data-memory-block]')];
  const symbolName = (symbol: string) => ({
    '{ }': text('중괄호', 'curly braces'),
    '[ ]': text('대괄호', 'square brackets'),
    '< >': text('꺾쇠괄호', 'angle brackets'),
  }[symbol] ?? symbol);
  const memoryProgress = dialog.querySelector<HTMLElement>('[data-memory-progress]')!;
  const resetMemory = () => {
    clearTimeout(memoryTimer);
    memoryTimer = undefined;
    openBlocks = [];
    matchedPairs = 0;
    const symbols = ['{ }', '{ }', '[ ]', '[ ]', '< >', '< >'];
    for (let i = symbols.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
    }
    memoryButtons.forEach((button, index) => {
      button.dataset.memoryBlock = symbols[index];
      button.dataset.matched = 'false';
      button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-label', text(`${index + 1}번 블록 뒤집기`, `Turn over block ${index + 1}`));
      button.querySelector<HTMLElement>('.memory-back')!.textContent = symbols[index];
    });
    memoryProgress.textContent = text('세 쌍 중 0쌍', '0 of 3 pairs');
  };
  const calendarButtons = [...dialog.querySelectorAll<HTMLButtonElement>('[data-calendar-event]')];
  const resetCalendar = () => {
    calendarOrder = [];
    dialog.querySelectorAll('[data-calendar-name]').forEach(slot => { slot.textContent = ''; });
    calendarButtons.forEach(button => { button.disabled = false; });
  };
  const angle = dialog.querySelector<HTMLInputElement>('[data-mirror-angle]')!;
  const letter = dialog.querySelector<HTMLElement>('[data-mirror-letter]')!;
  const setAngle = (value: number) => {
    angle.value = String(value);
    angle.setAttribute('aria-valuetext', text(`${value}도`, `${value} degrees`));
    letter.style.setProperty('--letter-angle', `${value}deg`);
    letter.dataset.readable = String(value === 180);
    if (value === 180) win();
  };
  const prepare = () => {
    copyGeneration++;
    say('');
    panels.forEach(panel => { panel.hidden = true; });
    collection.hidden = true;
    solved.hidden = true;
    clearTimeout(memoryTimer);
    dialog.querySelectorAll('details').forEach(details => { details.open = false; });
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
    prepare();
    active = undefined;
    title.textContent = text('찾은 플래그', 'Your flags');
    collection.hidden = false;
    dialog.dataset.mode = 'collection';
    updateCollection();
    present(opener);
  };
  const openPuzzle = (id: string, opener: HTMLElement) => {
    const panel = panels.find(panel => panel.dataset.puzzlePanel === id);
    const flag = flags.find(flag => flag.id === id);
    if (!panel || !flag) return;
    prepare();
    active = id as PuzzleId;
    title.textContent = flag.title[ko ? 'ko' : 'en'];
    dialog.dataset.mode = id;
    panel.hidden = false;
    if (id === 'keyboard') (dialog.querySelector<HTMLFormElement>('[data-keyboard-form]')!).reset();
    if (id === 'binary') (dialog.querySelector<HTMLFormElement>('[data-binary-form]')!).reset();
    if (id === 'timeline') resetCalendar();
    if (id === 'blocks') resetMemory();
    if (id === 'mirror') setAngle(0);
    if (foundFlags().has(active)) showResult(active);
    present(opener);
  };
  document.querySelectorAll<HTMLElement>('[data-escape-puzzle]').forEach(trigger => {
    trigger.hidden = false;
    trigger.removeAttribute('disabled');
    trigger.addEventListener('click', () => openPuzzle(trigger.dataset.escapePuzzle!, trigger));
  });
  document.querySelectorAll<HTMLButtonElement>('[data-open-collection]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => showCollection(button));
  });
  document.querySelectorAll<HTMLElement>('[data-puzzle-fallback]').forEach(fallback => { fallback.hidden = true; });
  dialog.querySelector('[data-escape-close]')!.addEventListener('click', () => dialog.close());
  let backdropDown = false;
  dialog.addEventListener('pointerdown', event => { backdropDown = event.target === dialog; });
  dialog.addEventListener('click', event => { if (event.target === dialog && backdropDown) dialog.close(); });
  dialog.addEventListener('close', () => {
    clearTimeout(memoryTimer);
    copyGeneration++;
    document.documentElement.classList.remove('escape-open');
    returnFocus?.focus({ preventScroll: true });
  });

  const input = dialog.querySelector<HTMLInputElement>('#cipher-answer')!;
  dialog.querySelectorAll<HTMLButtonElement>('[data-letter]').forEach(button => {
    button.addEventListener('click', () => {
      input.value = (input.value + button.dataset.letter).slice(0, 4).toUpperCase();
      say('');
    });
  });
  input.addEventListener('input', () => { input.value = input.value.toUpperCase(); say(''); });
  dialog.querySelector('[data-keyboard-clear]')!.addEventListener('click', () => { input.value = ''; say(''); input.focus(); });
  dialog.querySelector('[data-keyboard-form]')!.addEventListener('submit', event => {
    event.preventDefault();
    if (input.value.trim().toUpperCase() === 'FLAG') win();
    else say(text('아직 다른 글자예요. 알파벳을 한 칸씩 뒤로 옮겨보세요.', 'Not quite. Move each letter one place back in the alphabet.'), true);
  });
  dialog.querySelector('[data-binary-form]')!.addEventListener('submit', event => {
    event.preventDefault();
    const digits = [...dialog.querySelectorAll<HTMLSelectElement>('[data-binary-form] select')].map(select => select.value).join('');
    if (digits === '153') win();
    else say(text('잠겨 있어요. 1이 있는 자리의 값만 더해보세요.', 'Still locked. Add only the places that have a 1.'), true);
  });
  calendarButtons.forEach(button => button.addEventListener('click', () => {
    if (calendarOrder.length >= calendarAnswer.length) return;
    calendarOrder.push(button.dataset.calendarEvent!);
    button.disabled = true;
    dialog.querySelectorAll('[data-calendar-name]')[calendarOrder.length - 1].textContent = button.dataset.calendarEvent!;
    if (calendarOrder.length === calendarAnswer.length) {
      if (calendarOrder.every((event, index) => event === calendarAnswer[index])) win();
      else say(text('시간 순서가 달라요. 날짜를 확인하고 다시 골라보세요.', 'The order is off. Check the dates and try again.'), true);
      dialog.querySelector<HTMLButtonElement>('[data-calendar-reset]')!.focus({ preventScroll: true });
    } else {
      say(text(`${calendarOrder.length}번째: ${button.dataset.calendarEvent}`, `Choice ${calendarOrder.length}: ${button.dataset.calendarEvent}`));
      calendarButtons.find(candidate => !candidate.disabled)?.focus({ preventScroll: true });
    }
  }));
  dialog.querySelector('[data-calendar-reset]')!.addEventListener('click', () => { resetCalendar(); say(''); });

  memoryButtons.forEach((button, index) => button.addEventListener('click', () => {
    if (memoryTimer || button.dataset.matched === 'true' || openBlocks.includes(button)) return;
    button.setAttribute('aria-pressed', 'true');
    const symbol = button.dataset.memoryBlock!;
    button.setAttribute('aria-label', text(`${index + 1}번 블록: ${symbolName(symbol)}`, `Block ${index + 1}: ${symbolName(symbol)}`));
    openBlocks.push(button);
    if (openBlocks.length === 1) { say(text(`첫 블록은 ${symbolName(symbol)}`, `First block: ${symbolName(symbol)}`)); return; }
    const [first, second] = openBlocks;
    if (first.dataset.memoryBlock === second.dataset.memoryBlock) {
      openBlocks.forEach(block => { block.dataset.matched = 'true'; });
      openBlocks = [];
      matchedPairs++;
      memoryProgress.textContent = text(`세 쌍 중 ${matchedPairs}쌍`, `${matchedPairs} of 3 pairs`);
      say(text(`같은 기호예요. ${matchedPairs}쌍을 찾았어요.`, `A match. ${matchedPairs} pairs found.`));
      if (matchedPairs === 3) win();
    } else {
      say(text(`${symbolName(first.dataset.memoryBlock!)}, ${symbolName(second.dataset.memoryBlock!)}. 서로 다른 기호예요.`, `${symbolName(first.dataset.memoryBlock!)}, ${symbolName(second.dataset.memoryBlock!)}. Different symbols.`));
      memoryTimer = setTimeout(() => {
        openBlocks.forEach(block => {
          block.setAttribute('aria-pressed', 'false');
          const number = memoryButtons.indexOf(block) + 1;
          block.setAttribute('aria-label', text(`${number}번 블록 뒤집기`, `Turn over block ${number}`));
        });
        openBlocks = [];
        memoryTimer = undefined;
      }, 1200);
    }
  }));
  dialog.querySelector('[data-memory-reset]')!.addEventListener('click', () => { resetMemory(); say(''); });
  angle.addEventListener('input', () => setAngle(Number(angle.value)));
  dialog.querySelector('[data-mirror-turn]')!.addEventListener('click', () => setAngle(180));

  const copyFlag = async (button: HTMLButtonElement, id: FlagId) => {
    const flag = flags.find(flag => flag.id === id);
    if (!flag || !foundFlags().has(id)) return;
    const generation = copyGeneration;
    button.disabled = true;
    try {
      await navigator.clipboard.writeText(flag.flag);
      if (generation === copyGeneration && dialog.open) {
        button.textContent = text('복사했어요', 'Copied');
        say(text('플래그를 복사했습니다.', 'Flag copied.'));
      }
    } catch {
      if (generation === copyGeneration && dialog.open) say(text('복사하지 못했어요. 플래그 글자를 직접 선택해 복사해 주세요.', 'Could not copy. Select the flag text to copy it.'), true);
    } finally { button.disabled = false; }
  };
  dialog.querySelector<HTMLButtonElement>('[data-escape-copy]')!.addEventListener('click', event => {
    if (active) void copyFlag(event.currentTarget as HTMLButtonElement, active);
  });
  dialog.querySelectorAll<HTMLButtonElement>('[data-collection-copy]').forEach(button => {
    button.addEventListener('click', () => { void copyFlag(button, button.dataset.collectionCopy as FlagId); });
  });
  dialog.querySelectorAll<HTMLAnchorElement>('[data-collection-clue]').forEach(link => {
    link.addEventListener('click', () => { dialog.close(); });
  });
  window.addEventListener('dda:flag-found', updateCollection);
  window.addEventListener('dda:flags-updated', updateCollection);
  updateCollection();
}
