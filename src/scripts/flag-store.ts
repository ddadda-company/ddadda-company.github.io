import { flags, type FlagId } from '../data/escape';

const key = 'dda_com-flags-v1';
const known = new Set<string>(flags.map(flag => flag.id));
let memory = new Set<FlagId>();

function stored(): FlagId[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(value) ? value.filter((id): id is FlagId => typeof id === 'string' && known.has(id)) : [];
  } catch { return []; }
}

export function foundFlags(): Set<FlagId> {
  memory = new Set([...memory, ...stored()]);
  return new Set(memory);
}

export function collectFlag(id: FlagId): void {
  if (!known.has(id) || foundFlags().has(id)) return;
  memory.add(id);
  try { localStorage.setItem(key, JSON.stringify([...memory])); } catch { /* Play still works in this tab. */ }
  window.dispatchEvent(new CustomEvent('dda:flag-found', { detail: id }));
}

window.addEventListener('storage', event => {
  if (event.key === key || event.key === null) {
    memory = new Set(stored());
    window.dispatchEvent(new Event('dda:flags-updated'));
  }
});
