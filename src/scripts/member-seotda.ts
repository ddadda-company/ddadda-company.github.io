import { createSeotdaEffects } from './seotda-effects';
import { flowers, seotdaMemes, type MemeId } from '../data/seotda';
import { animal, applyStory, applyTable, betCost, bright, deal, enterShowdown, openingReady, storyBalance, month, newStory, newTable, rankHand, restoreSeotda, saveSeotda, tableOver, type Bet, type Card, type StoryEvent, type TableEvent } from '../lib/seotda';
import type { Localized } from '../data/team';

function setupSeotda() {
  const dialog = document.querySelector<HTMLDialogElement>('#member-seotda');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const locale = document.documentElement.lang === 'ko' ? 'ko' : 'en';
  const t = (v: Localized) => v[locale];
  const text = (ko: string, en: string) => locale === 'ko' ? ko : en;
  const find = <T extends HTMLElement = HTMLElement>(selector: string) => dialog.querySelector<T>(selector)!;
  const actions = find('[data-seotda-actions]'), board = find('[data-seotda-table]'), score = find('[data-seotda-score]');
  const dialogue = find('[data-seotda-dialogue]'), title = find('[data-seotda-scene-title]'), line = find('[data-seotda-line]');
  const hint = find('[data-seotda-action-hint]'), saveNotice = find('[data-seotda-save]');
  const photo = find<HTMLImageElement>('[data-seotda-image]'), photoStatus = find('[data-seotda-image-status]'), retry = find('[data-seotda-image-retry]');
  const key = 'dda_com-axii-seotda-v1';
  let raw: string | null = null, storage = true, currentMeme: MemeId | null = null;
  try { raw = localStorage.getItem(key); } catch { storage = false; }
  let save = restoreSeotda(raw);
  let opener: HTMLElement | undefined;
  const el = <K extends keyof HTMLElementTagNameMap>(tag: K, content = '', className = '') => { const node = document.createElement(tag); node.textContent = content; node.className = className; return node; };
  const persist = () => { try { localStorage.setItem(key, saveSeotda(save)); storage = true; } catch { storage = false; } };
  const focus = () => { const target = dialog.dataset.cut === 'true' ? find('[data-seotda-cut-next]') : save.mode === 'free' ? board : dialogue; target.focus({ preventScroll: true }); };
  const effects = createSeotdaEffects(dialog, locale === 'ko', focus);
  const button = (id: string, label: string, action: () => void, disabled = false, note = '') => {
    const b = el('button'); b.type = 'button'; b.dataset.seotdaAction = id; b.disabled = disabled;
    b.append(el('span', label)); if (note) b.append(el('small', note));
    b.addEventListener('click', () => { action(); focus(); }, { once: true }); actions.append(b);
  };
  const status = (heading: string, body: string, instruction = '') => { title.textContent = heading; line.textContent = body; hint.textContent = instruction; };
  const meme = (id: MemeId) => {
    const visible = save.mode === 'story' && save.stage === 'showdown' && ['stop', 'guess', 'ending'].includes(save.story.phase) && save.story.log.some(e => e === 'call' || e === 'double');
    find('[data-seotda-meme]').hidden = !visible;
    if (!visible) return;
    find('[data-seotda-caption]').textContent = t(seotdaMemes[id].title);
    if (id === currentMeme) return;
    currentMeme = id; photo.hidden = true; photoStatus.hidden = false; retry.hidden = true;
    photoStatus.textContent = text('장면 불러오는 중…', 'Loading scene…');
    find('[data-seotda-meme]').dataset.state = 'loading';
    photo.alt = t(seotdaMemes[id].alt); photo.src = `/images/tazza/${id}.jpg`;
  };
  photo.addEventListener('load', () => { photo.hidden = false; photoStatus.hidden = true; retry.hidden = true; find('[data-seotda-meme]').dataset.state = 'success'; });
  photo.addEventListener('error', () => { photo.hidden = true; photoStatus.hidden = false; retry.hidden = false; photoStatus.textContent = text('사진을 못 불러왔어요. 게임은 계속할 수 있어요.', 'Photo unavailable. You can still keep playing.'); find('[data-seotda-meme]').dataset.state = 'error'; });
  retry.addEventListener('click', () => { const id = currentMeme!; currentMeme = null; meme(id); });

  // Existing Korean Hwatu artwork, downloaded unchanged from Wikimedia Commons.
  // Engine IDs alternate each month's two cards; August's second card is geese.
  const card = (value: Card | null | undefined, extra = '') => {
    const node = el('div', '', `seotda-card ${value === null ? 'seotda-card--back' : ''} ${extra}`);
    node.setAttribute('role', 'img');
    if (value === undefined) { node.classList.add('seotda-card--empty'); node.setAttribute('aria-label', text('아직 받지 않은 패', 'Card not dealt yet')); node.append(el('span', '·')); return node; }
    let filename = 'back';
    let label = text('뒤집힌 화투', 'Face-down card');
    if (value !== null) {
      const m = month(value);
      node.dataset.month = String(m); node.dataset.cardId = String(value);
      const kind = bright(value) ? text('광', 'Bright') : animal(value) ? text('열', 'Animal') : text('띠', 'Ribbon');
      label = `${m}${text('월', '')} ${t(flowers[m - 1])} · ${kind}`;
      filename = `m${String(m).padStart(2, '0')}-0${value % 2 + 1}`;
    }
    node.setAttribute('aria-label', label); node.title = label;
    const image = el('img'); image.alt = ''; image.setAttribute('aria-hidden', 'true');
    image.width = 103; image.height = 168; image.draggable = false;
    image.addEventListener('error', () => { image.hidden = true; node.append(el('span', label, 'seotda-card-fallback')); }, { once: true });
    image.src = `/images/hwatu/${filename}.svg`; node.append(image);
    return node;
  };
  let exercise = 0;
  const examples = [
    { left: [2, 8], right: [10, 14], answer: 'left', why: text('왼쪽은 2+5=7끗, 오른쪽은 6+8=14라 4끗. 7끗이 더 높아요.', 'Left: 2+5=7 points. Right: 6+8=14, so 4 points. Seven is higher.') },
    { left: [0, 2], right: [16, 17], answer: 'right', why: text('왼쪽은 1·2 알리, 오른쪽은 9월 두 장이라 9땡. 땡은 알리보다 높아요.', 'Left is Alli (1·2). Right is a pair of 9s. Pairs beat named hands like Alli.') },
    { left: [4, 14], right: [18, 19], answer: 'left', why: text('왼쪽은 3광·8광이라 삼팔광땡! 가장 높은 패라 오른쪽 장땡도 이겨요.', 'Left has 3 bright + 8 bright, the strongest hand. It beats the pair of 10s on the right.') },
  ];
  const practice = () => {
    const box = find('[data-seotda-practice]'), result = find('[data-seotda-practice-result]');
    const example = examples[exercise]; box.replaceChildren(); result.textContent = '';
    box.append(el('p', text(`연습 ${exercise + 1}/3 · 어느 패가 이길까요?`, `Practice ${exercise + 1}/3 · Which hand wins?`)));
    const hands = el('div', '', 'seotda-practice-hands');
    for (const side of ['left', 'right'] as const) {
      const hand = el('div', '', 'seotda-hand'); hand.append(...example[side].map(value => card(value)));
      const choice = el('button', side === 'left' ? text('왼쪽 승', 'Left wins') : text('오른쪽 승', 'Right wins')); choice.type = 'button'; choice.dataset.seotdaPractice = side;
      choice.addEventListener('click', () => {
        result.textContent = `${side === example.answer ? text('정답! ', 'Correct! ') : text('다시 살펴볼까요? ', 'Let’s take a closer look. ')}${example.why}`;
        box.querySelectorAll<HTMLButtonElement>('[data-seotda-practice]').forEach(b => { b.disabled = true; });
        next.hidden = false;
      });
      const group = el('div'); group.append(hand, choice); hands.append(group);
    }
    const next = el('button', exercise < 2 ? text('다음 연습', 'Next example') : text('다시 연습', 'Practice again')); next.type = 'button'; next.hidden = true; next.dataset.seotdaPracticeNext = '';
    next.addEventListener('click', () => { exercise = (exercise + 1) % examples.length; practice(); find<HTMLButtonElement>('[data-seotda-practice="left"]').focus({ preventScroll: true }); });
    box.append(hands, next);
  };
  // Do not fetch tutorial cards until the optional guide is opened.
  find<HTMLDetailsElement>('#seotda-beginner').addEventListener('toggle', event => {
    if ((event.currentTarget as HTMLDetailsElement).open && !find('[data-seotda-practice]').hasChildNodes()) practice();
  });
  const notes = find('[data-seotda-notes]');
  const panel = find('#seotda-notes');
  let panelOpener: HTMLElement = notes;
  const setPanel = (open: boolean) => {
    panel.hidden = !open; dialog.dataset.panel = String(open);
    for (const selector of ['.seotda-modes', '.seotda-score', '.seotda-body', '.seotda-controls']) find(selector).inert = open;
    if (open) find('[data-seotda-notes-close]').focus({ preventScroll: true });
    else panelOpener.focus({ preventScroll: true });
  };
  find('[data-seotda-enlarge]').addEventListener('click', () => {
    panelOpener = find('[data-seotda-enlarge]'); setPanel(true);
    const gallery = find<HTMLDetailsElement>('[data-seotda-gallery]'); gallery.open = true;
    dialog.querySelectorAll<HTMLElement>('[data-seotda-gallery-id]').forEach(node => { delete node.dataset.expanded; });
    const target = find(`[data-seotda-gallery-id="${currentMeme}"]`);
    target.dataset.expanded = 'true';
    target.tabIndex = -1; target.focus({ preventScroll: true }); target.scrollIntoView({ block: 'center' });
  });
  notes.addEventListener('click', () => { panelOpener = notes; setPanel(true); });
  find('[data-seotda-notes-close]').addEventListener('click', () => setPanel(false));
  find('[data-seotda-help]').addEventListener('click', () => {
    panelOpener = find('[data-seotda-help]'); setPanel(true);
    const help = find<HTMLDetailsElement>('#seotda-beginner'); help.open = true;
    help.querySelector('summary')!.focus({ preventScroll: true }); help.scrollIntoView({ block: 'start' });
  });
  find('[data-seotda-skip-tutorial]').addEventListener('click', () => { find<HTMLDetailsElement>('#seotda-beginner').open = false; setPanel(false); focus(); });
  dialog.addEventListener('cancel', event => { if (effects.active()) { event.preventDefault(); effects.dismiss(); } else if (!panel.hidden) { event.preventDefault(); setPanel(false); } });
  const seat = (name: string, cards: (Card | null | undefined)[], label: string, className = '') => {
    const box = el('div', '', `seotda-seat ${className}`); box.append(el('h4', name));
    const hand = el('div', '', 'seotda-hand'); hand.append(...cards.map(c => card(c))); box.append(hand, el('p', label)); board.append(box);
  };
  const pot = (label: string) => board.append(el('div', label, 'seotda-pot'));
  const resource = (label: string, value: string) => { const item = el('span'); item.append(el('small', label), el('strong', value)); score.append(item); };
  const storyAction = (event: StoryEvent) => {
    const next = applyStory(save.story, event); if (!next) return;
    save.story = next; persist(); render();
    if (event === 'call' || event === 'double') effects.show('stop');
    else if (event === 'reveal') effects.show('reveal');
    else if (event === 'deal') {
      const targets = ['.seotda-seat--player .seotda-card', '.seotda-seat--opponent .seotda-card', '.seotda-seat--madam .seotda-card', '.seotda-seat--player .seotda-card:last-child', '.seotda-seat--opponent .seotda-card:last-child'];
      effects.animateCard(board.querySelector(targets[next.dealt - 1]));
      if (next.dealt === 4) void effects.cue('tension');
    } else if (event === 'challenge') void effects.cue('chips');
  };
  const tableAction = (event: TableEvent, opening = false) => { const target = opening ? 'opening' : 'table'; const next = applyTable(save[target], event); if (!next) return; save[target] = next; persist(); render(); if (event.type === 'deal' || event.type === 'peek') effects.animateCard(board.querySelector('.seotda-seat--player .seotda-card:last-child')); else if (event.type === 'bet') void effects.cue('chips'); };
  const restart = () => { save.stage = 'opening'; save.opening = newTable(); save.story = newStory(); persist(); render(); };
  const switchMode = (mode: 'story' | 'free') => { effects.dismiss(false); save.mode = mode; persist(); render(); };

  const renderStory = () => {
    const s = save.story;
    dialog.dataset.phase = s.phase;
    const tense = s.log.some(e => e === 'call' || e === 'double');
    const committed = tense && s.phase !== 'ending';
    resource(text('나', 'You'), String(storyBalance(save)));
    resource(text('건 칩', 'Stake'), String(committed ? s.stake : 0));
    resource(text('진행', 'Round'), s.phase === 'ending' ? text('종료', 'Finished') : text(`${save.opening.round + 1}판`, `Round ${save.opening.round + 1}`));
    const end = s.phase === 'ending' && s.outcome !== 'leave';
    const agwiOpen = ['guess', 'reveal', 'ending'].includes(s.phase);
    seat(tense ? text('아귀', 'Agwi') : 'Axii', [s.dealt >= 2 ? agwiOpen ? 16 : null : undefined, s.dealt >= 5 ? agwiOpen ? 17 : null : undefined], agwiOpen ? text('9땡', 'Pair of 9s') : text('패 비공개', 'Hidden hand'), 'seotda-seat--opponent');
    seat(tense ? text('정마담', 'Madam Jeong') : text('새로 온 손님', 'New guest'), [s.dealt >= 3 ? end ? 1 : null : undefined, s.dealt >= 5 ? end ? 5 : null : undefined], end ? text('3월 · 벚꽃', 'March · Cherry') : text('패 비공개', 'Hidden hand'), 'seotda-seat--madam');
    pot(text(`판돈 ${committed ? s.stake * 2 : 0} 칩`, `Pot ${committed ? s.stake * 2 : 0} chips`));
    seat(tense ? text('나 · 고니', 'You · Goni') : text('나', 'You'), [s.dealt >= 1 ? 2 : undefined, s.dealt >= 4 ? 11 : undefined], s.dealt >= 4 ? t(rankHand([2, 11]).name) : text('패를 돌리는 중', 'Dealing'), 'seotda-seat--player');
    if (s.phase === 'intro' || s.phase === 'deal') {
      meme(s.dealt ? 'goni' : 'welcome');
      const beats = [text('“자리 있지?” 의자 하나가 끌려온다. Axii가 말없이 패를 건넨다.', '“Room for one more?” A chair scrapes closer. Axii slides the deck across.'), text('탁. 내 앞에 한 장. 맞은편에서 칩 부딪히는 소리가 난다.', 'A card lands. Chips clink across the table.'), text('탁. 건너편에 한 장. 아까까지 웃던 사람이 입을 다문다.', 'Another card lands. The laughter stops.'), text('옆자리까지 한 장. 패를 내려놓는 내 손목에 시선이 꽂힌다.', 'One for the guest. Those eyes are fixed on your wrist now.'), text('8끗. 나쁘지 않다. 그런데 저 사람은 패도 안 보고 판돈을 민다.', 'Eight points. Not bad. Across the table, chips slide forward before a glance at the cards.')];
      status(s.dealt < 3 ? text('한 사람 더', 'Room for one more') : text('왜 손만 보지?', 'Why watch my hands?'), beats[s.dealt]);
      button('story-deal', s.dealt ? text('다음 패 돌리기', 'Deal next card') : text('첫 패 돌리기', 'Deal first card'), () => storyAction('deal'));
    } else if (s.phase === 'bet') {
      meme('goni'); status(text('받을 거면 받아.', 'Call it, then.'), text('칩이 한꺼번에 밀려온다. 마지막 패를 쥔 손이 멈칫한다. 웃고 있는 건 맞은편뿐이다.', 'A stack of chips slides forward. You pause with the last card in your hand. Only the other side is smiling.'), text('콜은 맞추기 · 더블은 두 배 · 물러나면 칩을 지켜요.', 'Call to match · Double to raise · Walk away to keep your chips.'));
      button('story-call', text(`${s.stake}칩 콜`, `Call ${s.stake}`), () => storyAction('call'));
      const doubled = Math.min(s.stake * 2, s.limit);
      button('story-double', text(`${doubled}칩 더블`, `Double to ${doubled}`), () => storyAction('double'), doubled === s.stake);
      button('story-leave', text('물러나기', 'Walk away'), () => storyAction('leave'));
    } else if (s.phase === 'stop') {
      meme('stop'); status(text('동작 그만', 'Hold it'), text('“마지막 패, 밑에서 뺐지.” 아귀가 손목을 놓지 않는다. 정마담 앞에 엎어진 패 한 장. 아무도 웃지 않는다.', '“That last card came from the bottom.” Agwi will not let go. One card lies face down in front of Madam Jeong. Nobody is smiling.'), text('손목은 잡혔다. 선택은 아직 내 것이다.', 'Your wrist is caught. The choice is still yours.'));
      button('story-challenge', text('그 패 확인하자', 'Check that card'), () => storyAction('challenge'));
      button('story-leave', text('승부에서 빠지기', 'Walk away'), () => storyAction('leave'));
    } else if (s.phase === 'guess') {
      meme('yerim'); status(text('확실해?', 'You sure?'), text('아귀가 9땡을 깐다. “저건 단풍이야.” 정마담의 패를 가리키는 손끝엔 망설임이 없다.', 'Agwi lays down a pair of nines. “That’s maple.” He points at Madam Jeong’s card without a flicker of doubt.'), text('그는 마지막 패가 10월 단풍이라고 확신한다.', 'He insists the last card is October maple.'));
      button('story-maple', text('10월 단풍이다', 'October maple'), () => storyAction('maple'));
      button('story-cherry', text('단풍이 아니다', 'Not maple'), () => storyAction('cherry'));
    } else if (s.phase === 'reveal') {
      meme('goni'); status(text('말은 끝났고.', 'Enough talk.'), text(`${s.pick === 'cherry' ? '단풍이 아니다' : '단풍이다'}에 ${s.stake}칩을 걸었다. 모든 시선이 정마담의 마지막 패로 모인다.`, `Your ${s.stake} chips are on “${s.pick === 'cherry' ? 'not maple' : 'maple'}.” No one looks away from that card.`), text('뒤집어서 직접 확인하자.', 'Turn it over and find out.'));
      button('story-reveal', text('마지막 패 확인', 'See the final card'), () => storyAction('reveal'));
    } else {
      meme(s.outcome === 'leave' ? 'welcome' : 'sakura');
      status(s.outcome === 'win' ? text('사쿠라네.', 'Cherry blossom. You read the table') : s.outcome === 'lose' ? text('그 확신이 틀렸다.', 'His certainty fooled you') : text('오늘은 여기까지', 'Walk away for today'), s.outcome === 'leave' ? tense ? text(`판을 접었다. 이미 건 ${s.stake}칩은 남기고, 나머지를 챙겨 일어선다.`, `You fold, leaving the ${s.stake} committed chips and taking the rest.`) : text('베팅하기 전에 일어섰다. 지금까지 모은 칩은 그대로다.', 'You leave before betting. The chips you collected are yours to keep.') : text(`마지막 패는 10월 단풍이 아닌 3월 벚꽃. ${s.outcome === 'win' ? `이번 승부에서 ${s.stake}칩을 땄다.` : `${s.stake}칩을 잃었다. 상대의 자신감만 믿으면 안 된다.`}`, `The last card is March cherry blossom, not October maple. ${s.outcome === 'win' ? `You won ${s.stake} chips.` : `You lost ${s.stake} chips. Confidence is not proof.`}`));
      button('story-restart', text('다시 한 판 앉기', 'Take a seat again'), restart);
      button('play-free', text('자유게임으로', 'Free play'), () => switchMode('free'));
    }
  };
  const renderTable = (opening = false) => {
    const g = opening ? save.opening : save.table;
    const play = (event: TableEvent) => tableAction(event, opening);
    const opponent = 'Axii';
    dialog.dataset.phase = g.phase;
    resource(text('나', 'You'), `${g.player}`); resource(opponent, `${g.dealer}`); resource(text('판돈', 'Pot'), `${g.pot}`); resource(text('진행', 'Round'), opening ? text(`${g.round || 1}판`, `Round ${g.round || 1}`) : `${g.round}/5`);
    const shown = g.phase === 'result';
    seat(opponent, [g.cards.length ? shown ? g.cards[2] : null : undefined, g.cards.length ? shown ? g.cards[3] : null : undefined], shown ? t(rankHand(g.cards.slice(2)).name) : text(`이번 판에 건 칩 ${g.paid[1]}`, `Committed ${g.paid[1]} chips`));
    pot(text(`${g.pot} 칩`, `${g.pot} chips`));
    const own = g.cards.length && g.phase !== 'peek';
    seat(text('나', 'You'), [g.cards.length ? g.cards[0] : undefined, g.cards.length ? own ? g.cards[1] : null : undefined], own ? t(rankHand(g.cards.slice(0, 2)).name) : g.cards.length ? text('두 번째 패를 확인하세요', 'Check your second card') : text('패를 기다리는 중', 'Waiting for cards'), 'seotda-seat--player');
    if (g.phase === 'ready') {
      meme('welcome'); status(opening ? text('가볍게 한 판?', 'Fancy a quick game?') : text('5판짜리 승부', 'A five-round match'), opening ? text('Axii가 방석을 툭툭 친다. 각자 1,000칩. 패 두 장 받고, 좋은 쪽이 가져가는 거다. 일단 앉자.', 'Axii pats the cushion. A thousand chips each, two cards, best hand wins. Pull up a seat.') : text('각자 1,000칩으로 5판. 마지막에 칩이 더 많은 쪽이 이긴다.', 'A thousand chips each. The larger stack after five rounds wins.'), text('참가비 20칩 · 족보는 ‘더 보기’에서', 'Ante 20 · Ranks in More'));
      button('deal', text('패 받기', 'Deal me in'), () => play(deal()));
    } else if (g.phase === 'peek') {
      meme('goni'); status(opening && g.round > 1 ? text('손이 좀 빨라졌네', 'Those hands are getting quick') : text('내 패부터 확인', 'Check your hand'), text(`Axii가 ${g.paid[1] - g.paid[0]}칩을 먼저 올렸다. 두 번째 패까지 보고 결정하자.`, `Axii opens for ${g.paid[1] - g.paid[0]} chips. Check your second card before deciding.`));
      button('peek', text('두 번째 패 보기', 'Check second card'), () => play({ type: 'peek' }));
    } else if (g.phase === 'bet') {
      meme('goni'); const call = betCost(g, 'call');
      status(text('받을까, 밀어붙일까?', 'Call, raise, or walk away?'), text('Axii는 자기 패와 내가 건 칩을 보고 응수한다. 약한 패로도 상대를 물러나게 할 수 있다.', 'Axii responds to his own cards and your wager. Even a weak hand can make him fold.'), text(`콜 ${call}칩 · 각 버튼의 숫자는 지금 추가로 낼 칩이에요.`, `Call ${call} · Button amounts are the chips you add now.`));
      const names: Record<Bet, string> = { call: text('콜', 'Call'), half: text('하프', 'Half'), double: text('더블', 'Double'), allin: text('올인', 'All-in'), fold: text('다이', 'Fold') };
      for (const bet of ['call', 'half', 'double', 'allin', 'fold'] as Bet[]) button(`bet-${bet}`, names[bet], () => play({ type: 'bet', bet }), !['call', 'fold'].includes(bet) && betCost(g, bet) <= call, bet === 'fold' ? text('포기', 'Give up') : text(`${betCost(g, bet)}칩`, `${betCost(g, bet)} chips`));
    } else if (g.phase === 'reveal') {
      meme('goni');
      status(g.pending === 'dealer-fold' ? text('Axii가 다이했다', 'Axii folds') : g.pending === 'player-fold' ? text('이번 판은 접는다', 'You fold this hand') : text('Axii도 받았다', 'Axii calls'), text('베팅은 끝났다. 패를 공개하고 판돈의 주인을 정할 차례다.', 'Betting is complete. Reveal the hands and settle the pot.'));
      button('show', text('패 공개 · 정산', 'Reveal & settle'), () => play({ type: 'show' }));
    } else {
      const v = g.verdict!;
      meme('goni');
      const labels = { player: text('내가 이겼다', 'You win'), dealer: text('Axii가 이겼다', 'Axii wins'), draw: text('무승부', 'A tie'), replay: text('구사 재경기', 'Gusa redeal') };
      const over = tableOver(g);
      status(over ? text(`대국 종료 · ${g.player > g.dealer ? '내 승리' : g.player < g.dealer ? 'Axii 승리' : '무승부'}`, `Match over · ${g.player > g.dealer ? 'You win' : g.player < g.dealer ? 'Axii wins' : 'Tie'}`) : labels[v.winner], `${labels[v.winner]}. ${t(v.reason)}`, over ? text('새 대국은 두 사람 모두 1,000칩으로 시작해요.', 'A new match starts both players at 1,000 chips.') : '');
      if (opening && openingReady(g)) {
        status(labels[v.winner], `${t(v.reason)} ${text('옆에서 구경하던 손님이 의자를 끌어온다. Axii가 말없이 패를 모은다.', 'A spectator pulls up a chair. Axii quietly gathers the cards.')}`);
        button('join-table', text('자리 내주고 다음 판', 'Make room & deal'), () => { const next = enterShowdown(save); if (next) { save = next; persist(); render(); } });
      } else if (over) button('new-match', text('새 대국', 'New match'), () => { if (opening) restart(); else { save.table = newTable(); persist(); render(); } });
      else button('deal', v.winner === 'replay' ? text('판돈 유지 · 다시 받기', 'Redeal with pot') : text('다음 판', 'Next round'), () => play(deal()));
    }
  };
  const render = () => {
    board.replaceChildren(); score.replaceChildren(); actions.replaceChildren(); hint.textContent = '';
    const opening = save.mode === 'story' && save.stage === 'opening';
    const tense = save.stage === 'showdown' && save.story.log.some(e => e === 'call' || e === 'double');
    dialog.dataset.mode = opening ? 'free' : save.mode;
    dialog.dataset.stage = save.stage;
    dialog.dataset.tension = String(save.mode === 'story' && tense);
    dialog.dataset.dread = String(save.mode === 'story' && save.stage === 'showdown' && save.story.dealt >= 3);
    find('#seotda-title').textContent = save.mode === 'story' && tense ? text('마지막 한 장', 'The final card') : text('Axii와 섯다', 'Seotda with Axii');
    find('[data-seotda-gallery]').hidden = !tense;
    find('[data-seotda-help]').hidden = save.mode !== 'free';
    find('[data-seotda-rules]').hidden = false;
    find('[data-seotda-history-panel]').hidden = save.mode !== 'free';
    const beginner = find<HTMLDetailsElement>('#seotda-beginner');
    beginner.hidden = save.mode !== 'free';
    if (beginner.hidden) beginner.open = false;
    dialog.querySelectorAll<HTMLButtonElement>('[data-seotda-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.seotdaMode === save.mode)));
    saveNotice.textContent = storage ? text('자동 저장 · 닫아도 다음에 이어 할 수 있어요. 게임용 칩만 사용해요.', 'Auto-saved · Continue next time. Play chips only.') : text('저장이 차단되어 이번 페이지에서만 진행이 유지돼요.', 'Storage is blocked. Progress lasts only on this page.');
    saveNotice.dataset.error = String(!storage);
    find('[data-seotda-history]').replaceChildren(...save.table.history.map(row => el('li', text(`${row.round}판 · ${row.verdict.winner === 'player' ? '승' : row.verdict.winner === 'dealer' ? '패' : row.verdict.winner === 'draw' ? '무승부' : '재경기'} · 내 칩 ${row.chips}`, `Round ${row.round} · ${row.verdict.winner} · Your chips ${row.chips}`))));
    if (save.mode === 'free' || opening) renderTable(opening);
    else renderStory();
  };
  dialog.querySelectorAll<HTMLButtonElement>('[data-seotda-mode]').forEach(b => b.addEventListener('click', () => { switchMode(b.dataset.seotdaMode as 'story' | 'free'); focus(); }));
  find<HTMLDetailsElement>('[data-seotda-gallery]').addEventListener('toggle', event => {
    if (!(event.currentTarget as HTMLDetailsElement).open) return;
    dialog.querySelectorAll<HTMLImageElement>('[data-seotda-gallery-src]').forEach(img => { if (!img.getAttribute('src')) img.src = img.dataset.seotdaGallerySrc!; });
  });
  document.querySelectorAll<HTMLElement>('[data-seotda-open]').forEach(trigger => trigger.addEventListener('click', () => {
    if (document.hidden || document.querySelector('dialog[open]')) return;
    panel.hidden = true; dialog.dataset.panel = 'false';
    dialog.querySelectorAll<HTMLElement>('[inert]').forEach(node => { node.inert = false; });
    opener = trigger; save.mode = 'story'; persist(); render(); dialog.showModal(); dialogue.focus({ preventScroll: true });
  }));
  const close = () => { if (dialog.open) dialog.close(); };
  find('[data-seotda-close]').addEventListener('click', close);
  dialog.addEventListener('close', () => { effects.close(); opener?.focus({ preventScroll: true }); });
  const outside = (e: MouseEvent) => { const r = dialog.getBoundingClientRect(); return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom; };
  let backdrop = false;
  dialog.addEventListener('pointerdown', e => { backdrop = e.target === dialog && outside(e); });
  dialog.addEventListener('click', e => { if (backdrop && e.target === dialog && outside(e)) close(); backdrop = false; });
  document.addEventListener('visibilitychange', () => { if (document.hidden) close(); });
  window.addEventListener('pagehide', close);
}
setupSeotda();
