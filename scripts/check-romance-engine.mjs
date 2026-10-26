import assert from 'node:assert/strict';
import { actionLock, advanceRomance, canConfess, newRomanceGame, restoreRomance, serializeRomance } from '../src/lib/member-romance.ts';

const choose = (game, action, choice) => {
  const next = advanceRomance(game, { type: 'choice', action, choice });
  assert(next, `${action}/${choice} should be available`);
  return next;
};
const route = [
  [['listen', 'patient'], ['talk', 'honest'], ['gift', 'cocoa']],
  [['listen', 'patient'], ['walk', 'hand'], ['solve', 'together']],
  [['talk', 'tease'], ['rest', 'company'], ['walk', 'hand']],
];
const play = days => {
  let game = newRomanceGame();
  for (let i = 0; i < days.length; i++) {
    for (const [action, choice] of days[i]) game = choose(game, action, choice);
    assert.equal(game.energy, 0);
    assert.equal(advanceRomance(game, { type: 'choice', action: 'talk', choice: 'honest' }), null);
    if (i < 2) game = advanceRomance(game, { type: 'next' });
  }
  return game;
};
const fresh = newRomanceGame();
assert(actionLock(fresh, 'solve'));
assert(actionLock(fresh, 'walk', 'hand'));
assert.equal(advanceRomance(fresh, { type: 'choice', action: 'walk', choice: 'hand' }), null);
assert.equal(advanceRomance(fresh, { type: 'next' }), null);
assert.equal(advanceRomance(fresh, { type: 'ending', approach: 'confess' }), null);
const listened = choose(fresh, 'listen', 'patient');
assert.equal(fresh.energy, 3, 'Reducer must not mutate its input');
assert.equal(actionLock(listened, 'solve'), null);
assert.equal(choose(listened, 'gift', 'cocoa').last.delta.affection, 16);
assert.equal(choose(fresh, 'gift', 'cocoa').last.delta.affection, 8);
const repeat = choose(listened, 'listen', 'patient');
assert.equal(repeat.last.delta.affection, 2);
assert.equal(repeat.last.delta.tension, 8);
assert.equal(repeat.memories.length, 1);
assert.equal(choose(fresh, 'talk', 'tease').last.delta.affection, -4);
const gifts = choose(choose(fresh, 'gift', 'cocoa'), 'gift', 'keycap');
assert.equal(gifts.gifts, 0);
assert(actionLock(gifts, 'gift'));
assert.equal(advanceRomance(gifts, { type: 'choice', action: 'gift', choice: 'cocoa' }), null);
let day2 = newRomanceGame();
for (const args of route[0]) day2 = choose(day2, ...args);
day2 = advanceRomance(day2, { type: 'next' });
assert.equal(day2.day, 2);
assert.deepEqual(day2.uses, {});
assert.equal(choose(day2, 'solve', 'together').last.delta.tension, 12);
assert.equal(choose(day2, 'listen', 'patient').last.delta.affection, 9);
const good = play(route);
assert(canConfess(good));
assert.deepEqual([good.affection, good.trust, good.tension], [100, 83, 14]);
for (const [approach, ending] of [['confess', 'love'], ['slow', 'slow'], ['team', 'partner']]) {
  const completed = advanceRomance(good, { type: 'ending', approach });
  assert.equal(completed.ending, ending);
  assert.equal(completed.log.length, 12);
  assert.equal(advanceRomance(completed, { type: 'next' }), null);
  const restored = restoreRomance(serializeRomance({ game: completed, view: 'hub', active: null, unlocked: [ending], started: true }));
  assert.deepEqual(restored.game, completed);
  assert.deepEqual(restored.unlocked, [ending]);
}
const quiet = play(Array.from({ length: 3 }, () => [['rest', 'space'], ['walk', 'lead'], ['talk', 'boast']]));
assert.equal(advanceRomance(quiet, { type: 'ending', approach: 'slow' }).ending, 'friend');
const strained = play(Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => ['listen', 'dismiss'])));
assert.equal(strained.affection, 0);
assert.equal(strained.trust, 0);
assert.equal(strained.tension, 100);
assert.equal(advanceRomance(strained, { type: 'ending', approach: 'confess' }).ending, 'distance');
const savedScene = { game: listened, view: 'scene', active: 'gift', unlocked: ['slow'], started: true };
assert.deepEqual(restoreRomance(serializeRomance(savedScene)), savedScene);
assert.equal(restoreRomance(serializeRomance({ ...savedScene, view: 'result', active: null })).view, 'result');
for (const raw of ['{', 'null', '[]', JSON.stringify({ version: 2, events: [{ type: 'next' }] }), JSON.stringify({ version: 2, events: [{ type: 'choice', action: 'unknown', choice: 'unknown' }] }), 'x'.repeat(16001)]) {
  assert.deepEqual(restoreRomance(raw).game, fresh);
}
const forged = restoreRomance(JSON.stringify({ version: 2, events: [], affection: 100, trust: 100, unlocked: ['love', 'love', 'toString'], view: 'scene', active: 'solve' }));
assert.deepEqual(forged.game, fresh);
assert.deepEqual(forged.unlocked, ['love']);
assert.equal(forged.view, 'hub');
console.log('Engine passed: 5 reachable endings, 9-action budget, trust locks, remembered gifts, repeats, moods, stat bounds, persistence replay, invalid saves and immutable updates.');
