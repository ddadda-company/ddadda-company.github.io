document.querySelectorAll<HTMLAnchorElement>('[data-language]').forEach(link => {
  link.addEventListener('click', () => {
    try { localStorage.setItem('dda_com-language', link.dataset.language!); } catch { /* Optional preference. */ }
  });
});

const menuButton = document.querySelector<HTMLButtonElement>('.menu-toggle');
const mobileNav = document.querySelector<HTMLElement>('#mobile-nav');
function closeMenu(restoreFocus = false) {
  if (!menuButton || !mobileNav) return;
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.querySelector('[data-menu-label]')!.textContent = menuButton.dataset.openLabel!;
  if (restoreFocus) menuButton.focus();
}
menuButton?.addEventListener('click', () => {
  if (!mobileNav) return;
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  if (isOpen) return closeMenu();
  mobileNav.hidden = false;
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.querySelector('[data-menu-label]')!.textContent = menuButton.dataset.closeLabel!;
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
document.addEventListener('click', event => {
  if (event.target instanceof Node && !document.querySelector('.site-header')?.contains(event.target)) closeMenu();
});
matchMedia('(min-width: 60rem)').addEventListener('change', event => { if (event.matches) closeMenu(); });

// Filters only work on rendered, verified records; no API request is needed.
let resultFilter = 'all';
const yearSelect = document.querySelector<HTMLSelectElement>('[data-year-filter]');
const resultButtons = document.querySelectorAll<HTMLButtonElement>('[data-result-filter]');
function filterResults() {
  let visible = 0;
  document.querySelectorAll<HTMLElement>('[data-result]').forEach(row => {
    const yearMatches = !yearSelect || yearSelect.value === 'all' || row.dataset.year === yearSelect.value;
    const rankMatches = resultFilter === 'all' || Number(row.dataset.rank) <= 3;
    row.hidden = !(yearMatches && rankMatches);
    if (!row.hidden) visible++;
  });
  const empty = document.querySelector<HTMLElement>('[data-results-empty]');
  document.querySelectorAll<HTMLElement>('[data-result-year]').forEach(group => {
    group.hidden = !group.querySelector('[data-result]:not([hidden])');
  });
  if (empty) empty.hidden = visible > 0;
  const count = document.querySelector('[data-results-count]');
  if (count) count.textContent = document.documentElement.lang === 'ko' ? `${visible}개의 기록` : `${visible} records`;
  document.dispatchEvent(new Event('results-filtered'));
}
resultButtons.forEach(button => button.addEventListener('click', () => {
  resultFilter = button.dataset.resultFilter!;
  resultButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  filterResults();
}));
yearSelect?.addEventListener('change', filterResults);

const memberButtons = document.querySelectorAll<HTMLButtonElement>('[data-member-filter]');
memberButtons.forEach(button => button.addEventListener('click', () => {
  memberButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  let visible = 0;
  document.querySelectorAll<HTMLElement>('[data-member]').forEach(member => {
    member.hidden = button.dataset.memberFilter !== 'all' && !member.dataset.disciplines?.split(',').includes(button.dataset.memberFilter!);
    if (!member.hidden) visible++;
  });
  const empty = document.querySelector<HTMLElement>('[data-members-empty]');
  if (empty) empty.hidden = visible > 0;
}));

document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach(button => {
  let timeout: ReturnType<typeof setTimeout>;
  const original = button.textContent;
  button.addEventListener('click', async () => {
    const feedback = document.querySelector('[data-copy-feedback]');
    button.disabled = true;
    try {
      await navigator.clipboard.writeText(button.dataset.copy!);
      button.textContent = button.dataset.copied!;
      if (feedback) feedback.textContent = '';
      clearTimeout(timeout);
      timeout = setTimeout(() => { button.textContent = original; }, 2500);
    } catch {
      if (feedback) feedback.textContent = button.dataset.error!;
    } finally {
      button.disabled = false;
    }
  });
});
