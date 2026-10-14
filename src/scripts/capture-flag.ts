const game = document.querySelector<HTMLElement>('[data-capture]');
if (game) {
  const piece = game.querySelector<HTMLButtonElement>('[data-capture-piece]')!;
  const reset = game.querySelector<HTMLButtonElement>('[data-capture-reset]')!;
  const copy = game.querySelector<HTMLButtonElement>('[data-capture-copy]')!;
  const result = game.querySelector<HTMLElement>('[data-capture-result]')!;
  const instruction = game.querySelector<HTMLElement>('[data-capture-instruction]')!;
  const status = game.querySelector<HTMLElement>('[data-capture-status]')!;
  const copyLabel = copy.textContent;
  let won = false;
  let drag: { id: number; x: number; y: number; moved: boolean } | undefined;
  let suppressClick = false;
  const place = (x: number, y: number) => {
    piece.style.setProperty('--flag-x', `${x}px`);
    piece.style.setProperty('--flag-y', `${y}px`);
  };
  const capture = () => {
    if (won) return;
    won = true;
    game.classList.add('capture-won');
    piece.setAttribute('aria-pressed', 'true');
    instruction.hidden = true;
    result.hidden = false;
    status.textContent = status.dataset.success!;
    copy.focus({ preventScroll: true });
  };
  piece.addEventListener('pointerdown', event => {
    if (won || event.button !== 0) return;
    suppressClick = false;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
    piece.setPointerCapture(event.pointerId);
    game.classList.add('capture-dragging');
  });
  piece.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.hypot(dx, dy) > 5) drag.moved = true;
    place(Math.max(-28, Math.min(28, dx)) * .5, Math.max(-85, Math.min(25, dy)));
  });
  const finish = (event: PointerEvent) => {
    if (!drag || drag.id !== event.pointerId) return;
    const { moved, y } = drag;
    drag = undefined;
    game.classList.remove('capture-dragging');
    if (piece.hasPointerCapture(event.pointerId)) piece.releasePointerCapture(event.pointerId);
    const cancelled = event.type !== 'pointerup';
    suppressClick = moved || cancelled;
    if (!cancelled && moved && event.clientY - y <= -45) capture();
    else place(0, 0);
  };
  piece.addEventListener('pointerup', finish);
  piece.addEventListener('pointercancel', finish);
  piece.addEventListener('lostpointercapture', finish);
  piece.addEventListener('click', event => {
    if (suppressClick && event.detail !== 0) { suppressClick = false; return; }
    capture();
  });
  reset.addEventListener('click', () => {
    won = false;
    game.classList.remove('capture-won');
    piece.setAttribute('aria-pressed', 'false');
    place(0, 0);
    result.hidden = true;
    instruction.hidden = false;
    copy.textContent = copyLabel;
    status.textContent = '';
    piece.focus({ preventScroll: true });
  });
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copy.dataset.flag!);
      if (won) { copy.textContent = copy.dataset.copied!; status.textContent = copy.dataset.copied!; }
    } catch {
      status.textContent = copy.dataset.copyError!;
    }
  });
  piece.disabled = false;
  piece.setAttribute('aria-pressed', 'false');
  game.classList.add('capture-ready');
}

const secret = document.querySelector<HTMLElement>('[data-secret]');
if (secret) {
  const flag = secret.querySelector<HTMLElement>('[data-secret-flag]')!;
  const actions = secret.querySelector<HTMLElement>('[data-secret-actions]')!;
  const copy = secret.querySelector<HTMLButtonElement>('[data-secret-copy]')!;
  const status = secret.querySelector<HTMLElement>('[data-secret-status]')!;
  const reveal = () => {
    if (flag.hasAttribute('data-found')) return;
    flag.setAttribute('data-found', '');
    actions.hidden = false;
    status.textContent = status.dataset.success!;
  };
  document.addEventListener('selectionchange', () => {
    const selection = document.getSelection();
    if (selection && !selection.isCollapsed && selection.toString().trim() && flag.firstChild && selection.containsNode(flag.firstChild, true)) reveal();
  });
  flag.addEventListener('focus', () => {
    if (flag.matches(':focus-visible')) reveal();
  });
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copy.dataset.flag!);
      copy.textContent = copy.dataset.copied!;
      status.textContent = copy.dataset.copied!;
    } catch {
      status.textContent = copy.dataset.copyError!;
    }
  });
}
