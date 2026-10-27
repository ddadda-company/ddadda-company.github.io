import assert from 'node:assert/strict';
import { rankHand, compareHands, enterShowdown, openingReady, storyBalance, applyTable, newTable, betCost, tableOver, deal, applyStory, newStory, newSeotdaSave, restoreSeotda, saveSeotda } from '../src/lib/seotda.ts';
const rank = (cards, value) => assert.equal(rankHand(cards).rank, value);
rank([4, 14], 400); rank([0, 4], 390); rank([0, 14], 390); rank([18, 19], 210);
rank([0, 2], 106); rank([0, 6], 105); rank([0, 16], 104); rank([1, 19], 103); rank([7, 18], 102); rank([6, 10], 101);
rank([2, 12], 9); rank([2, 14], 0);
for (let m = 0; m < 10; m++) rank([m * 2, m * 2 + 1], 201 + m);
const match = (a, b, expected) => { assert.equal(compareHands(a, b).winner, expected); assert.equal(compareHands(b, a).winner, expected === 'player' ? 'dealer' : expected === 'dealer' ? 'player' : expected); };
match([6, 12], [0, 14], 'player'); // inspector defeats 18 bright
match([6, 12], [4, 14], 'dealer'); // never 38 bright
match([4, 12], [16, 17], 'player'); // pair catcher
match([4, 12], [18, 19], 'dealer'); // not pair 10
match([7, 17], [0, 2], 'replay'); // ordinary Gusa vs Alli
match([7, 17], [10, 11], 'dealer'); // ordinary Gusa cannot replay a pair
match([6, 16], [10, 11], 'replay'); // special Gusa vs pair 6
match([6, 16], [18, 19], 'dealer'); // special Gusa cannot replay pair 10
match([4, 12], [2, 8], 'dealer'); // ineffective special becomes 0 points
match([2, 8], [0, 10], 'draw');
assert.throws(() => compareHands([0, 2], [2, 3]));
assert.throws(() => rankHand([0, 0]));
// All 29,070 disjoint pairs are symmetric and return a supported verdict.
let comparisons = 0;
for (let a = 0; a < 20; a++) for (let b = a + 1; b < 20; b++) for (let c = 0; c < 20; c++) for (let d = c + 1; d < 20; d++) {
  if (new Set([a, b, c, d]).size !== 4) continue;
  const r = compareHands([a, b], [c, d]).winner;
  assert(['player', 'dealer', 'draw', 'replay'].includes(r));
  const inverse = compareHands([c, d], [a, b]).winner;
  assert.equal(inverse, r === 'player' ? 'dealer' : r === 'dealer' ? 'player' : r); comparisons++;
}
const step = (g, e) => { const n = applyTable(g, e); assert(n, JSON.stringify(e)); assert.equal(n.player + n.dealer + n.pot, 2000); assert(n.player >= 0 && n.dealer >= 0 && n.pot >= 0); return n; };
const hand = (cards, roll = .9, previous = newTable()) => step(step(previous, { type: 'deal', cards, roll }), { type: 'peek' });
for (const bet of ['call', 'half', 'double', 'allin', 'fold']) {
  const g = hand([4, 14, 0, 2]);
  const cost = betCost(g, bet);
  const response = step(g, { type: 'bet', bet });
  assert.equal(g.player - response.player, cost);
  assert.equal(applyTable(response, { type: 'bet', bet }), null);
  const result = step(response, { type: 'show' });
  assert.equal(result.verdict.winner, bet === 'fold' ? 'dealer' : 'player');
  assert.equal(result.pot, 0);
  assert.equal(applyTable(result, { type: 'show' }), null);
  if (bet === 'allin') { assert.equal(result.player, 2000); assert(tableOver(result)); }
}
const bluff = step(step(hand([2, 14, 8, 12], .1), { type: 'bet', bet: 'double' }), { type: 'show' });
assert.equal(bluff.pending, 'dealer-fold'); assert.equal(bluff.verdict.winner, 'player');
let replay = step(step(hand([7, 17, 0, 2]), { type: 'bet', bet: 'call' }), { type: 'show' });
assert.equal(replay.verdict.winner, 'replay'); assert(replay.pot > 0);
const carried = replay.pot;
replay = step(replay, { type: 'deal', cards: [4, 14, 0, 2], roll: .9 });
assert.equal(replay.round, 1); assert.equal(replay.pot, carried + 80);
// Stress betting and replay: bounded resources, shuffled cards, valid resume each phase.
let seed = 471; const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
for (let run = 0; run < 120; run++) {
  let g = newTable(); let safety = 0;
  while (!tableOver(g)) {
    assert(++safety < 50);
    g = step(g, deal(random)); g = step(g, { type: 'peek' });
    const valid = ['call', 'half', 'double', 'allin', 'fold'].filter(b => ['call', 'fold'].includes(b) || betCost(g, b) > betCost(g, 'call'));
    g = step(g, { type: 'bet', bet: valid[Math.floor(random() * valid.length)] });
    const saved = { ...newSeotdaSave(), mode: 'free', table: g };
    assert.deepEqual(restoreSeotda(saveSeotda(saved)), saved);
    g = step(g, { type: 'show' });
  }
}
for (const choice of ['maple', 'cherry', 'leave']) {
  let g = newStory();
  assert.equal(applyStory(g, 'reveal'), null);
  for (let i = 0; i < 5; i++) g = applyStory(g, 'deal');
  assert.equal(g.phase, 'bet');
  g = applyStory(g, 'double'); assert.equal(g.stake, 200);
  if (choice === 'leave') g = applyStory(g, 'leave');
  else { g = applyStory(g, 'challenge'); g = applyStory(g, choice); g = applyStory(g, 'reveal'); }
  assert.equal(g.outcome, choice === 'cherry' ? 'win' : choice === 'maple' ? 'lose' : 'leave');
  assert.equal(applyStory(g, 'deal'), null);
  const s = { ...newSeotdaSave(), stage: 'showdown', story: g }; assert.deepEqual(restoreSeotda(saveSeotda(s)), s);
}
// Ordinary rounds settle before the story turn; no pot or bank balance is reset.
let opening = newTable();
assert.equal(enterShowdown(newSeotdaSave()), null);
for (let i = 0; i < 2; i++) {
  opening = step(opening, { type: 'deal', cards: [2, 8, 10, 14], roll: .9 });
  opening = step(opening, { type: 'peek' });
  opening = step(opening, { type: 'bet', bet: 'fold' });
  assert(!openingReady(opening));
  opening = step(opening, { type: 'show' });
  const saved = { ...newSeotdaSave(), opening };
  assert.deepEqual(restoreSeotda(saveSeotda(saved)), saved);
  assert.equal(openingReady(opening), i === 1);
}
const joined = enterShowdown({ ...newSeotdaSave(), opening });
assert(joined); assert.equal(storyBalance(joined), 960);
assert.deepEqual(restoreSeotda(saveSeotda(joined)), joined);
assert.equal(enterShowdown(joined), null);
for (const pick of ['cherry', 'maple', 'leave']) {
  let s = joined;
  for (const e of ['deal', 'deal', 'deal', 'deal', 'deal', 'double']) s = { ...s, story: applyStory(s.story, e) };
  assert.equal(storyBalance(s), 760); // the 200-chip wager is committed
  for (const e of pick === 'leave' ? ['leave'] : ['challenge', pick, 'reveal']) s = { ...s, story: applyStory(s.story, e) };
  assert.equal(storyBalance(s), pick === 'cherry' ? 1160 : 760);
  assert.deepEqual(restoreSeotda(saveSeotda(s)), s);
}
let unbet = joined;
for (const e of ['deal', 'deal', 'deal', 'deal', 'deal', 'leave']) unbet = { ...unbet, story: applyStory(unbet.story, e) };
assert.equal(storyBalance(unbet), 960);
// Gusa and an exhausted bank must never silently discard a pot or enter the turn.
assert(!openingReady({ ...opening, pot: 40 }));
assert(!openingReady({ ...opening, player: 0 }));
let limited = newStory(37);
for (const e of ['deal', 'deal', 'deal', 'deal', 'deal', 'double']) limited = applyStory(limited, e);
assert.equal(limited.stake, 37);
// Keep unfinished v1 scenes and free matches; completed v1 scenes get the new opening.
const legacyLog = ['deal', 'deal', 'deal', 'deal', 'deal', 'call'];
const legacy = restoreSeotda(JSON.stringify({ version: 1, mode: 'free', story: legacyLog, table: opening.log }));
assert.equal(legacy.stage, 'showdown'); assert.equal(legacy.story.phase, 'stop');
assert.deepEqual(legacy.table.log, opening.log);
assert.deepEqual(restoreSeotda(saveSeotda(legacy)), legacy);
const finishedLegacy = restoreSeotda(JSON.stringify({ version: 1, mode: 'story', story: [...legacyLog, 'challenge', 'cherry', 'reveal'], table: opening.log }));
assert.equal(finishedLegacy.stage, 'opening'); assert.equal(finishedLegacy.story.phase, 'intro');
assert.deepEqual(finishedLegacy.table.log, opening.log);
for (const raw of ['{', 'null', JSON.stringify({ version: 1, mode: 'free', story: [], table: [{ type: 'show' }] }), JSON.stringify({ version: 1, mode: 'story', story: ['reveal'], table: [] }), 'x'.repeat(32001)]) assert.deepEqual(restoreSeotda(raw), newSeotdaSave());
console.log(`Seotda engine passed: ${comparisons} hand comparisons, all ranks and special hands, 120 seeded matches, bankroll conservation, every betting action, folds, replays, story branches and save replay.`);
