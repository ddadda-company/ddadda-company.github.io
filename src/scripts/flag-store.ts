import { flags, invisibleFlag, type FlagId } from '../data/escape';

const key = 'dda_com-flags-v2';
const known = new Map(flags.map(flag => [flag.id, flag.digest]));
let memory = new Map<FlagId, string>();
let loadVersion = 0;
// These locally authored flags use a deliberately small, bounded alphabet.
// No answer is interpreted as markup, a URL, a property name, or source code.
export const isFlagInput = (value: unknown): value is string => typeof value === 'string'
  && value.length <= 133 && /^dda\{[A-Za-z0-9_]{1,128}\}$/.test(value);
export const flagDigest = async (value: string): Promise<string> => {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(bytes)].map(byte => byte.toString(16).padStart(2, '0')).join('');
};
const valid = async (id: FlagId, answer: string) => known.has(id) && isFlagInput(answer) && await flagDigest(answer) === known.get(id);
function read(): Record<string, unknown> {
  try {
    const raw = localStorage.getItem(key) ?? '{}';
    if (raw.length > 4096) return {};
    const value: unknown = JSON.parse(raw);
    return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
  } catch { return {}; }
}
function save(): void {
  try { localStorage.setItem(key, JSON.stringify(Object.fromEntries(memory))); } catch { /* This tab still works. */ }
}
async function hydrate(): Promise<void> {
  const version = ++loadVersion;
  const saved = read();
  const entries = await Promise.all([...known.keys()].map(async id => {
    const answer = Object.hasOwn(saved, id) ? saved[id] : undefined;
    if (typeof answer !== 'string' || !known.has(id as FlagId)) return undefined;
    return await valid(id as FlagId, answer) ? [id as FlagId, answer] as const : undefined;
  }));
  if (version !== loadVersion) return;
  memory = new Map(entries.filter((entry): entry is readonly [FlagId, string] => !!entry));
  // Only the unchanged transparent-text discovery survives the old edition.
  try {
    const raw = localStorage.getItem('dda_com-flags-v1') ?? '[]';
    const old: unknown = raw.length <= 1024 ? JSON.parse(raw) : [];
    if (Array.isArray(old) && old.includes('invisible')) {
      memory.set('invisible', invisibleFlag);
      save();
    }
  } catch { /* Optional migration. */ }
  window.dispatchEvent(new Event('dda:flags-updated'));
}
export const flagsReady = hydrate().catch(() => { /* The UI reports unavailable verification on submission. */ });
export function foundFlags(): Map<FlagId, string> { return new Map(memory); }
export async function collectFlag(id: FlagId, answer: string): Promise<boolean> {
  await flagsReady;
  if (!await valid(id, answer)) return false;
  if (memory.has(id)) return true;
  memory.set(id, answer);
  save();
  window.dispatchEvent(new CustomEvent('dda:flag-found', { detail: id }));
  return true;
}
window.addEventListener('storage', event => {
  if (event.key === key || event.key === null) void hydrate().catch(() => {});
});
