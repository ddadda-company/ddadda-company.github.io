import { words } from '../data/seotda.ts';
import type { Localized } from '../data/team';
export type Card = number; // 0..19: January a,b ... October a,b. a carries bright/animal.
export const month = (card: Card) => Math.floor(card / 2) + 1;
export const bright = (card: Card) => [0, 4, 14].includes(card);
export const animal = (card: Card) => card === 15 || card % 2 === 0 && !bright(card);
export const validCards = (cards: unknown, count: number): cards is Card[] => Array.isArray(cards) && cards.length === count && new Set(cards).size === count && cards.every(card => Number.isInteger(card) && card >= 0 && card < 20);
export interface Hand { rank: number; name: Localized; special: '' | 'inspector' | 'catcher' | 'gusa' | 'big-gusa'; }
export function rankHand(cards: Card[]): Hand {
  if (!validCards(cards, 2)) throw new Error('A hand needs two distinct cards from the 20-card deck.');
  const [a, b] = [...cards].sort((x, y) => x - y);
  const months = [month(a), month(b)];
  const key = months.join('-');
  if (bright(a) && bright(b)) return { rank: key === '3-8' ? 400 : 390, name: words(`${months[0]}${months[1]}광땡`, `${key} bright`), special: '' };
  if (months[0] === months[1]) return { rank: 200 + months[0], name: words(months[0] === 10 ? '장땡' : `${months[0]}땡`, `Pair of ${months[0]}`), special: '' };
  const named: Record<string, [number, string, string]> = { '1-2': [106, '알리', 'Alli'], '1-4': [105, '독사', 'Doksa'], '1-9': [104, '구삥', 'Gubbing'], '1-10': [103, '장삥', 'Jangbbing'], '4-10': [102, '장사', 'Jangsa'], '4-6': [101, '세륙', 'Seryuk'] };
  if (named[key]) { const [rank, ko, en] = named[key]; return { rank, name: words(ko, en), special: '' }; }
  const points = (months[0] + months[1]) % 10;
  const special = a === 6 && b === 12 ? 'inspector' : a === 4 && b === 12 ? 'catcher' : key === '4-9' ? a === 6 && b === 16 ? 'big-gusa' : 'gusa' : '';
  const name = special === 'inspector' ? words('암행어사', 'Royal inspector') : special === 'catcher' ? words('땡잡이', 'Pair catcher') : special === 'big-gusa' ? words('멍텅구리 구사', 'Special Gusa') : special === 'gusa' ? words('구사', 'Gusa') : words(points === 9 ? '갑오' : points === 0 ? '망통' : `${points}끗`, `${points} points`);
  return { rank: points, name, special };
}
export type Winner = 'player' | 'dealer' | 'draw' | 'replay';
export interface Verdict { winner: Winner; reason: Localized; }
export function compareHands(player: Card[], dealer: Card[]): Verdict {
  if (!validCards([...player, ...dealer], 4)) throw new Error('Hands cannot share a card.');
  const p = rankHand(player), d = rankHand(dealer);
  const counter = (a: Hand, b: Hand) => a.special === 'inspector' && b.rank === 390 || a.special === 'catcher' && b.rank >= 201 && b.rank <= 209;
  if (counter(p, d)) return { winner: 'player', reason: words('특수패가 상대 족보를 잡았어요.', 'A special hand counters the opponent’s rank.') };
  if (counter(d, p)) return { winner: 'dealer', reason: words('상대의 특수패가 내 족보를 잡았어요.', 'The opponent’s special hand counters yours.') };
  const replay = (a: Hand, b: Hand) => a.special === 'gusa' && b.rank <= 106 || a.special === 'big-gusa' && b.rank <= 209;
  if (replay(p, d) || replay(d, p)) return { winner: 'replay', reason: words('구사 재경기! 판돈을 그대로 다음 판에 넘깁니다.', 'Gusa replay! The pot carries into the redeal.') };
  return { winner: p.rank > d.rank ? 'player' : p.rank < d.rank ? 'dealer' : 'draw', reason: p.rank === d.rank ? words('동급 족보라 판돈을 반씩 돌려받아요.', 'Equal hands split the pot.') : words('공개한 두 패의 족보로 승부했어요.', 'The higher revealed hand wins.') };
}
export type Bet = 'call' | 'half' | 'double' | 'allin' | 'fold';
export type TableEvent = { type: 'deal'; cards: Card[]; roll: number } | { type: 'peek' } | { type: 'bet'; bet: Bet } | { type: 'show' };
export interface Table {
  player: number; dealer: number; pot: number; paid: [number, number]; cards: Card[]; roll: number;
  round: number; phase: 'ready' | 'peek' | 'bet' | 'reveal' | 'result'; pending: 'showdown' | 'player-fold' | 'dealer-fold';
  verdict: Verdict | null; log: TableEvent[]; history: { round: number; verdict: Verdict; chips: number }[];
}
export const newTable = (): Table => ({ player: 1000, dealer: 1000, pot: 0, paid: [0, 0], cards: [], roll: 0, round: 0, phase: 'ready', pending: 'showdown', verdict: null, log: [], history: [] });
export const tableOver = (g: Table) => g.phase === 'result' && g.verdict?.winner !== 'replay' && (g.round >= 5 || !g.player || !g.dealer);
export function betCost(g: Table, bet: Bet): number {
  const call = g.paid[1] - g.paid[0];
  const cap = Math.min(g.player, call + g.dealer);
  if (bet === 'fold') return 0;
  if (bet === 'call') return call;
  if (bet === 'allin') return cap;
  return Math.min(cap, call + (bet === 'half' ? Math.max(20, Math.floor((g.pot + call) / 2)) : Math.max(40, g.paid[1])));
}
export function applyTable(g: Table, event: TableEvent): Table | null {
  if (!event || g.log.length >= 150) return null;
  const n: Table = { ...g, paid: [...g.paid], cards: [...g.cards], log: [...g.log, event], history: [...g.history] };
  if (event.type === 'deal') {
    if (!['ready', 'result'].includes(g.phase) || tableOver(g) || !validCards(event.cards, 4) || !Number.isFinite(event.roll) || event.roll < 0 || event.roll >= 1) return null;
    if (g.verdict?.winner !== 'replay') n.round++;
    n.cards = [...event.cards]; n.roll = event.roll; n.verdict = null; n.pending = 'showdown'; n.phase = 'peek';
    const ante = Math.min(20, n.player, n.dealer);
    n.player -= ante; n.dealer -= ante; n.pot += ante * 2; n.paid = [ante, ante];
    const strength = rankHand(n.cards.slice(2)).rank;
    const raise = Math.min(n.player, n.dealer, strength >= 200 || n.roll < .25 ? 80 : 40);
    n.dealer -= raise; n.paid[1] += raise; n.pot += raise;
    return n;
  }
  if (event.type === 'peek' && g.phase === 'peek') { n.phase = 'bet'; return n; }
  if (event.type === 'bet' && g.phase === 'bet' && ['call', 'half', 'double', 'allin', 'fold'].includes(event.bet)) {
    const cost = betCost(g, event.bet), call = betCost(g, 'call');
    if (event.bet !== 'fold' && event.bet !== 'call' && cost <= call) return null;
    n.player -= cost; n.pot += cost; n.paid[0] += cost;
    if (event.bet === 'fold') n.pending = 'player-fold';
    else {
      const due = n.paid[0] - n.paid[1];
      // The opponent sees its own hand and the wager only, never the player's cards.
      const ownRank = rankHand(g.cards.slice(2)).rank;
      const foldChance = ownRank >= 200 ? .02 : ownRank >= 101 ? .15 : ownRank >= 7 ? .28 : .55;
      if (due > 0 && g.roll < foldChance) n.pending = 'dealer-fold';
      else { n.dealer -= due; n.pot += due; n.paid[1] += due; }
    }
    n.phase = 'reveal'; return n;
  }
  if (event.type === 'show' && g.phase === 'reveal') {
    n.phase = 'result';
    n.verdict = g.pending === 'player-fold' ? { winner: 'dealer', reason: words('다이. 이미 낸 칩은 판돈에 남아요.', 'You folded. Committed chips stay in the pot.') } : g.pending === 'dealer-fold' ? { winner: 'player', reason: words('상대가 다이했어요. 블러프도 승부입니다.', 'The opponent folded. A bluff can win, too.') } : compareHands(g.cards.slice(0, 2), g.cards.slice(2));
    if (n.verdict.winner === 'replay' && (!n.player || !n.dealer || n.log.length > 130)) n.verdict = { winner: 'draw', reason: words('추가 베팅이 어려워 재경기 판돈을 반씩 나눴어요.', 'The replay pot is split because no further betting is possible.') };
    if (n.verdict.winner === 'player') n.player += n.pot;
    if (n.verdict.winner === 'dealer') n.dealer += n.pot;
    if (n.verdict.winner === 'draw') { n.player += Math.floor(n.pot / 2); n.dealer += Math.ceil(n.pot / 2); }
    if (n.verdict.winner !== 'replay') n.pot = 0;
    n.history.push({ round: n.round, verdict: n.verdict, chips: n.player });
    return n;
  }
  return null;
}
export function deal(random = Math.random): TableEvent {
  const deck = Array.from({ length: 20 }, (_, i) => i);
  for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
  return { type: 'deal', cards: deck.slice(0, 4), roll: random() };
}
export type StoryEvent = 'deal' | 'call' | 'double' | 'challenge' | 'maple' | 'cherry' | 'reveal' | 'leave';
export interface Story { phase: 'intro' | 'deal' | 'bet' | 'stop' | 'guess' | 'reveal' | 'ending'; dealt: number; stake: number; limit: number; pick: 'maple' | 'cherry' | null; outcome: 'win' | 'lose' | 'leave' | null; log: StoryEvent[]; }
export const newStory = (limit = 200): Story => ({ phase: 'intro', dealt: 0, stake: Math.min(100, limit), limit, pick: null, outcome: null, log: [] });
export function applyStory(g: Story, event: StoryEvent): Story | null {
  const n: Story = { ...g, log: [...g.log, event] };
  if (g.log.length >= 12 || g.phase === 'ending') return null;
  if (event === 'deal' && ['intro', 'deal'].includes(g.phase)) { n.dealt++; n.phase = n.dealt === 5 ? 'bet' : 'deal'; return n; }
  if ((event === 'call' || event === 'double') && g.phase === 'bet') { n.stake = event === 'double' ? Math.min(g.stake * 2, g.limit) : g.stake; n.phase = 'stop'; return n; }
  if (event === 'challenge' && g.phase === 'stop') { n.phase = 'guess'; return n; }
  if ((event === 'maple' || event === 'cherry') && g.phase === 'guess') { n.pick = event; n.phase = 'reveal'; return n; }
  if (event === 'reveal' && g.phase === 'reveal') { n.phase = 'ending'; n.outcome = g.pick === 'cherry' ? 'win' : 'lose'; return n; }
  if (event === 'leave' && ['bet', 'stop', 'guess'].includes(g.phase)) { n.phase = 'ending'; n.outcome = 'leave'; return n; }
  return null;
}
// The ordinary opening uses the same betting/rank engine as free play.
// Settle all pots (including Gusa redeals) before allowing the cinematic turn.
export const openingReady = (g: Table) => g.phase === 'result' && g.round >= 2 && g.pot === 0 && g.player > 0 && g.dealer > 0;
export interface SeotdaSave { mode: 'story' | 'free'; stage: 'opening' | 'showdown'; opening: Table; story: Story; table: Table; }
export const newSeotdaSave = (): SeotdaSave => ({ mode: 'story', stage: 'opening', opening: newTable(), story: newStory(), table: newTable() });
export function enterShowdown(save: SeotdaSave): SeotdaSave | null {
  if (save.stage !== 'opening' || !openingReady(save.opening)) return null;
  return { ...save, stage: 'showdown', story: newStory(Math.min(save.opening.player, save.opening.dealer)) };
}
export function storyBalance(save: SeotdaSave): number {
  const { outcome, stake, log } = save.story;
  if (outcome === 'win') return save.opening.player + stake;
  if (outcome === 'lose') return save.opening.player - stake;
  return save.opening.player - (log.includes('call') || log.includes('double') ? stake : 0);
}
export const saveSeotda = (s: SeotdaSave) => JSON.stringify({ version: 2, mode: s.mode, stage: s.stage, opening: s.opening.log, story: s.story.log, table: s.table.log });
export function restoreSeotda(raw: string | null): SeotdaSave {
  if (!raw || raw.length > 64000) return newSeotdaSave();
  try {
    const v = JSON.parse(raw);
    if (![1, 2].includes(v.version) || !['story', 'free'].includes(v.mode) || !Array.isArray(v.story) || v.story.length > 12 || !Array.isArray(v.table) || v.table.length > 150) return newSeotdaSave();
    const save = newSeotdaSave(); save.mode = v.mode;
    for (const e of v.table) { const next = applyTable(save.table, e); if (!next) return newSeotdaSave(); save.table = next; }
    if (v.version === 2) {
      if (!['opening', 'showdown'].includes(v.stage) || !Array.isArray(v.opening) || v.opening.length > 150) return newSeotdaSave();
      save.stage = v.stage;
      for (const e of v.opening) {
        if (openingReady(save.opening)) return newSeotdaSave();
        const next = applyTable(save.opening, e); if (!next) return newSeotdaSave(); save.opening = next;
      }
      if (save.stage === 'opening' && v.story.length) return newSeotdaSave();
      if (save.stage === 'showdown') {
        // Empty opening logs are accepted for migrated, unfinished v1 games.
        if (v.opening.length && !openingReady(save.opening)) return newSeotdaSave();
        save.story = newStory(v.opening.length ? Math.min(save.opening.player, save.opening.dealer) : 200);
      }
    }
    for (const e of v.story) { const next = applyStory(save.story, e); if (!next) return newSeotdaSave(); save.story = next; }
    if (v.version === 1) {
      if (save.story.log.length && save.story.phase !== 'ending') save.stage = 'showdown';
      else save.story = newStory(); // Existing finished scenes start the new ordinary opening.
    }
    return save;
  } catch { return newSeotdaSave(); }
}
