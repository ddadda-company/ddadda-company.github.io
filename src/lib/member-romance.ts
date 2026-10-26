import { l, romanceActions, romanceEndings, type ActionId, type EndingId, type MemoryId, type Stats } from '../data/member-romance.ts';
import type { Localized } from '../data/team';

export type RomanceEvent = { type: 'choice'; action: ActionId; choice: string } | { type: 'next' } | { type: 'ending'; approach: 'confess' | 'slow' | 'team' };
export interface Outcome { action: ActionId; choice: string; reply: Localized; delta: Stats; notes: Localized[]; }
export interface RomanceGame extends Stats {
  day: number; energy: number; gifts: number; memories: MemoryId[];
  uses: Partial<Record<ActionId, number>>; log: RomanceEvent[]; last: Outcome | null; ending: EndingId | null;
}
export type RomanceView = 'hub' | 'scene' | 'result';
export const newRomanceGame = (): RomanceGame => ({ affection: 10, trust: 15, tension: 20, day: 1, energy: 3, gifts: 2, memories: [], uses: {}, log: [], last: null, ending: null });
const clamp = (value: number) => Math.max(0, Math.min(100, value));
export const actionById = (id: string) => romanceActions.find(action => action.id === id);

export function actionLock(game: RomanceGame, id: ActionId, choiceId?: string): Localized | null {
  const action = actionById(id);
  if (!action || game.ending || game.energy <= 0) return l('오늘의 행동을 모두 사용했어요.', 'No actions left today.');
  if (id === 'gift' && game.gifts <= 0) return l('선물권을 모두 사용했어요.', 'No gift tickets left.');
  const choice = action.choices.find(choice => choice.id === choiceId);
  const required = Math.max(action.trustRequired || 0, choice?.trustRequired || 0);
  return game.trust < required ? l(`신뢰 ${required} 이상 필요`, `Requires trust ${required}`) : null;
}
export function relationship(game: RomanceGame): Localized {
  if (game.tension >= 70) return l('잠깐 거리가 필요해요', 'Needs a little space');
  if (game.affection >= 75 && game.trust >= 60) return l('두근거리는 사이', 'Hearts racing');
  if (game.affection >= 45 && game.trust >= 35) return l('마음이 열리는 중', 'Opening up');
  if (game.trust >= 30) return l('편안해진 사이', 'Comfortable together');
  return l('서로 알아가는 중', 'Getting acquainted');
}
export const canConfess = (g: RomanceGame) => g.affection >= 75 && g.trust >= 60 && g.tension <= 40 && g.memories.length >= 2;

// One reducer owns resource costs, conditional reactions, day transitions and endings.
// Saves replay its bounded event log; stored stats are never trusted.
export function advanceRomance(game: RomanceGame, event: RomanceEvent): RomanceGame | null {
  if (game.ending || game.log.length >= 12) return null;
  const next: RomanceGame = { ...game, memories: [...game.memories], uses: { ...game.uses }, log: [...game.log, event] };
  if (event.type === 'next') {
    if (game.energy !== 0 || game.day >= 3) return null;
    next.day++;
    next.energy = 3;
    next.uses = {};
    next.last = null;
    next.tension = clamp(game.tension + (next.day === 2 ? 10 : -6));
    return next;
  }
  if (event.type === 'ending') {
    if (game.day !== 3 || game.energy !== 0 || !['confess', 'slow', 'team'].includes(event.approach)) return null;
    if (event.approach === 'confess') next.ending = canConfess(game) ? 'love' : game.tension >= 65 || game.trust < 30 ? 'distance' : 'friend';
    if (event.approach === 'slow') next.ending = game.affection >= 45 && game.trust >= 45 ? 'slow' : 'friend';
    if (event.approach === 'team') next.ending = game.trust >= 55 && game.memories.includes('team') ? 'partner' : 'friend';
    return next;
  }
  if (event.type !== 'choice') return null;
  const action = actionById(event.action);
  const choice = action?.choices.find(choice => choice.id === event.choice);
  if (!action || !choice || actionLock(game, action.id, choice.id)) return null;
  const effect = { ...choice.effect };
  let reply = choice.reply;
  const notes: Localized[] = [];
  if (action.id === 'talk' && choice.id === 'tease' && (game.trust < 30 || game.tension >= 50)) {
    Object.assign(effect, { affection: -4, trust: -3, tension: 14 });
    reply = l('아직 그런 장난은 좀… 진심인지 모르겠어.', 'I’m not ready for teasing like that… I can’t tell if you mean it.');
    notes.push(l('아직 장난을 편하게 받아들이지 못해요.', 'He is not comfortable with teasing yet.'));
  }
  if (action.id === 'gift' && choice.id === 'cocoa' && game.memories.includes('sweet')) {
    effect.affection += 8; effect.trust += 4; effect.tension -= 4;
    reply = l('내가 코코아 좋아한다고 한 거, 기억했어? …이건 좀 감동인데.', 'You remembered that I like cocoa? …That really means something.');
    notes.push(l('취향을 기억한 선물!', 'You remembered his favorite!'));
  }
  if (action.id === 'gift' && choice.id === 'flower' && game.trust < 35) {
    Object.assign(effect, { affection: 4, trust: 0, tension: 18 });
    reply = l('고마운데… 꽃은 아직 조금 빠른 것 같아.', 'Thank you… but flowers feel a little too soon.');
    notes.push(l('관계보다 선물이 앞서갔어요.', 'The gift came before the relationship was ready.'));
  }
  if (game.day === 2) {
    if (action.id === 'solve') { effect.tension += 8; notes.push(l('피곤한 날의 문제 풀이는 부담이 돼요.', 'Challenges add pressure on a tired day.')); }
    if (action.id === 'rest' || action.id === 'listen' && choice.id === 'patient') {
      effect.affection += 4;
      notes.push(l('오늘은 쉬어 갈 수 있게 해준 게 좋아요.', 'He appreciates getting a breather today.'));
    }
  }
  const repeated = game.uses[action.id] || 0;
  if (repeated) {
    effect.affection = effect.affection > 0 ? Math.floor(effect.affection / (repeated + 1)) : effect.affection;
    effect.trust = effect.trust > 0 ? Math.floor(effect.trust / (repeated + 1)) : effect.trust;
    effect.tension = Math.max(0, effect.tension) + 8;
    notes.push(l('같은 행동 반복: 호감·신뢰 상승 감소, 긴장 증가.', 'Repeated activity: smaller gains and extra tension.'));
  }
  if (game.tension >= 65 && action.id !== 'rest' && !(action.id === 'listen' && choice.id === 'patient')) {
    effect.affection = effect.affection > 0 ? Math.floor(effect.affection / 2) : effect.affection;
    effect.tension += 5;
    notes.push(l('긴장이 높아요. 먼저 마음을 풀어 주세요.', 'Tension is high. Help him relax first.'));
  }
  next.affection = clamp(game.affection + effect.affection);
  next.trust = clamp(game.trust + effect.trust);
  next.tension = clamp(game.tension + effect.tension);
  next.energy--;
  next.gifts -= action.id === 'gift' ? 1 : 0;
  next.uses[action.id] = repeated + 1;
  if (choice.memory && !next.memories.includes(choice.memory)) next.memories.push(choice.memory);
  next.last = { action: action.id, choice: choice.id, reply, notes, delta: { affection: next.affection - game.affection, trust: next.trust - game.trust, tension: next.tension - game.tension } };
  return next;
}

export interface RomanceSave { game: RomanceGame; view: RomanceView; active: ActionId | null; unlocked: EndingId[]; started: boolean; }
export function restoreRomance(raw: string | null): RomanceSave {
  const empty = (): RomanceSave => ({ game: newRomanceGame(), view: 'hub', active: null, unlocked: [], started: false });
  if (!raw || raw.length > 16000) return empty();
  try {
    const value = JSON.parse(raw);
    if (!value || value.version !== 2 || !Array.isArray(value.events) || value.events.length > 12) return empty();
    let game = newRomanceGame();
    for (const event of value.events) {
      if (!event || typeof event !== 'object') return empty();
      const next = advanceRomance(game, event);
      if (!next) return empty();
      game = next;
    }
    const unlocked: EndingId[] = Array.isArray(value.unlocked) ? [...new Set<EndingId>(value.unlocked.filter((id: unknown): id is EndingId => typeof id === 'string' && Object.hasOwn(romanceEndings, id)))] : [];
    if (game.ending && !unlocked.includes(game.ending)) unlocked.push(game.ending);
    const active = actionById(value.active)?.id || null;
    const view = value.view === 'result' && game.last ? 'result' : value.view === 'scene' && active && !actionLock(game, active) ? 'scene' : 'hub';
    return { game, view, active: view === 'scene' ? active : null, unlocked, started: value.started === true || game.log.length > 0 || unlocked.length > 0 };
  } catch { return empty(); }
}
export function serializeRomance(save: RomanceSave): string {
  return JSON.stringify({ version: 2, events: save.game.log, view: save.view, active: save.active, unlocked: save.unlocked, started: save.started });
}
