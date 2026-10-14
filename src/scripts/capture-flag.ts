import { collectFlag } from './flag-store';
import { invisibleFlag } from '../data/escape';

const secret = document.querySelector<HTMLElement>('[data-secret]');
if (secret) {
  const flag = secret.querySelector<HTMLElement>('[data-secret-flag]')!;
  const actions = secret.querySelector<HTMLElement>('[data-secret-actions]')!;
  const copy = secret.querySelector<HTMLButtonElement>('[data-secret-copy]')!;
  const status = secret.querySelector<HTMLElement>('[data-secret-status]')!;
  const reveal = () => {
    if (flag.hasAttribute('data-found')) return;
    flag.setAttribute('data-found', '');
    void collectFlag('invisible', invisibleFlag).catch(() => { /* The selected text remains readable. */ });
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
