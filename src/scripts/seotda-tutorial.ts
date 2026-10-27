import { month, type Card } from '../lib/seotda';

/** Optional, read-only lessons. All examples use the game's original Hwatu assets. */
export function createSeotdaTutorial(root: HTMLElement, ko: boolean, card: (value: Card) => HTMLElement, exit: () => void) {
  const text = (a: string, b: string) => ko ? a : b;
  const find = <T extends HTMLElement = HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const details = find<HTMLDetailsElement>('#seotda-beginner');
  const guide = find('[data-seotda-guide]'), visual = find('[data-guide-visual]');
  const heading = find('[data-guide-title]'), description = find('[data-guide-description]');
  const feedback = find('[data-seotda-practice-result]');
  const next = find<HTMLButtonElement>('[data-guide-next]'), prev = find<HTMLButtonElement>('[data-guide-prev]');
  const el = (tag: string, content = '', className = '') => { const node = document.createElement(tag); node.textContent = content; node.className = className; return node; };
  let step = 0, exercise = 0;
  const answers = new Map<number, string>();
  const examples = [
    { hands: [[2, 8], [10, 14]], answer: 'left', why: text('7끗 > 4끗. 14는 끝자리 4만 봐요.', '7 beats 4 points. Keep only the last digit of 14.') },
    { hands: [[0, 2], [16, 17]], answer: 'right', why: text('9땡 > 알리. 같은 월 두 장은 이름 있는 패보다 높아요.', 'A pair of 9s beats Alli, the named 1·2 hand.') },
    { hands: [[4, 14], [18, 19]], answer: 'left', why: text('삼팔광땡 > 장땡. 3광·8광이 가장 강해요!', '3 bright + 8 bright is the strongest hand, even above a pair of 10s!') },
  ];
  const hand = (values: number[], caption: string) => {
    const group = el('figure', '', 'seotda-guide-hand');
    const cards = el('div', '', 'seotda-hand');
    for (const value of values) {
      const item = el('div', '', 'seotda-guide-card');
      item.append(card(value), el('span', `${month(value)}${text('월', '')}${[0, 4, 14].includes(value) ? text(' · 광', ' · bright') : ''}`));
      cards.append(item);
    }
    group.append(cards, el('figcaption', caption)); return group;
  };
  const pair = (left: number[], leftLabel: string, right: number[], rightLabel: string) => {
    const row = el('div', '', 'seotda-guide-hands'); row.append(hand(left, leftLabel), hand(right, rightLabel)); visual.append(row); return row;
  };
  const render = (moveFocus = false) => {
    guide.dataset.step = String(step);
    find('[data-guide-progress]').textContent = text(`${step + 1} / 5 · ${['끗', '땡', '광땡', '베팅', '연습'][step]}`, `${step + 1} / 5 · ${['Points', 'Pairs', 'Bright pairs', 'Betting', 'Practice'][step]}`);
    visual.replaceChildren(); feedback.textContent = ''; delete feedback.dataset.correct;
    prev.disabled = step === 0; next.disabled = false;
    next.textContent = step === 4 ? exercise === 2 ? text('게임 시작 →', 'Play →') : text('다음 문제 →', 'Next hand →') : text('다음 →', 'Next →');
    delete next.dataset.seotdaPracticeNext;
    if (step === 0) {
      heading.textContent = text('더하고, 끝자리만!', 'Add. Keep the last digit.');
      description.textContent = text('패의 숫자는 월이에요. 끗은 9가 가장 높아요.', 'Each card has a month. Nine is the highest point hand.');
      pair([2, 8], text('2 + 5 = 7끗', '2 + 5 = 7 points'), [10, 14], text('6 + 8 = 14 → 4끗', '6 + 8 = 14 → 4 points'));
      feedback.textContent = text('7끗 승! 그림 아래 숫자로 비교해 보세요.', 'Seven wins! Compare the month labels below the cards.');
    } else if (step === 1) {
      heading.textContent = text('같은 월이면, 땡!', 'Matching months? A pair!');
      description.textContent = text('땡은 끗보다 높아요. 땡끼리는 큰 월이 이겨요.', 'Pairs beat points. Between pairs, the higher month wins.');
      pair([16, 17], text('9월 두 장 = 9땡', 'Two 9s = a pair of 9s'), [6, 8], text('4 + 5 = 9끗', '4 + 5 = 9 points'));
      feedback.textContent = text('9땡 승! 같은 9여도 땡이 더 높아요.', 'The pair wins! A pair of 9s beats 9 points.');
    } else if (step === 2) {
      heading.textContent = text('이 두 장이 최강', 'Meet the strongest hand');
      description.textContent = text('3월·8월 중 ‘光’이 있는 패 두 장을 찾아요.', 'Look for the 光 mark on the March and August cards.');
      pair([4, 14], text('삼팔광땡 · 최강', '3–8 bright · strongest'), [18, 19], text('장땡 · 10월 두 장', 'Pair of 10s'));
      feedback.textContent = text('광땡 > 땡 > 이름 있는 패 > 끗. 내 족보는 게임에서 자동 표시돼요.', 'Bright pairs > pairs > named hands > points. Your rank appears automatically in play.');
    } else if (step === 3) {
      heading.textContent = text('받을까, 이번엔 접을까?', 'Call, or sit this one out?');
      description.textContent = text('상대가 60칩, 내가 20칩 냈다면? 버튼을 눌러봐요.', 'They put in 60 chips; you put in 20. Try a button.');
      const row = el('div', '', 'seotda-guide-betting'); row.append(hand([2, 8], text('내 패 · 7끗', 'Your hand · 7 points')));
      const choices = el('div', '', 'seotda-guide-choices');
      for (const [label, result] of [
        [text('콜 · 40칩 더 내기', 'Call · add 40 chips'), text('60 − 20 = 40칩 추가. 패를 비교해서 이긴 쪽이 판돈을 가져가요.', 'Add 60 − 20 = 40 chips. The stronger hand takes the pot.')],
        [text('다이 · 이번 판 포기', 'Fold · leave this round'), text('추가로 내지 않아요. 이미 낸 20칩은 상대가 가져가요.', 'Pay nothing more. Your opponent keeps the 20 chips you already put in.')],
      ]) {
        const b = el('button', label) as HTMLButtonElement; b.type = 'button'; b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', () => { choices.querySelectorAll('button').forEach(c => c.setAttribute('aria-pressed', String(c === b))); feedback.textContent = result; }); choices.append(b);
      }
      row.append(choices); visual.append(row);
      feedback.textContent = text('연습이라 칩은 그대로예요. 하프·더블은 더 올리기, 올인은 받을 수 있는 만큼 전부 걸기예요.', 'Practice costs nothing. Half and Double raise; All-in bets up to the smaller stack.');
    } else {
      const example = examples[exercise];
      heading.textContent = text(`어느 패가 이길까요? · ${exercise + 1}/3`, `Which hand wins? · ${exercise + 1}/3`);
      description.textContent = text('패를 골라보세요. 칩은 그대로예요.', 'Pick a hand. No chips spent.');
      const row = pair(example.hands[0], '', example.hands[1], '');
      const answer = (side: string) => {
        answers.set(exercise, side); feedback.dataset.correct = String(side === example.answer);
        feedback.textContent = `${side === example.answer ? text('정답! ', 'Correct! ') : text('아깝다! ', 'Let’s take a closer look. ')}${example.why}`;
        row.querySelectorAll<HTMLButtonElement>('button').forEach(b => { b.disabled = true; b.dataset.winner = String(b.dataset.seotdaPractice === example.answer); });
        next.disabled = false;
      };
      ['left', 'right'].forEach((side, i) => {
        const b = el('button', i === 0 ? text('왼쪽 승', 'Left wins') : text('오른쪽 승', 'Right wins')) as HTMLButtonElement;
        b.type = 'button'; b.dataset.seotdaPractice = side; b.addEventListener('click', () => answer(side)); row.children[i].append(b);
      });
      next.dataset.seotdaPracticeNext = ''; next.disabled = !answers.has(exercise);
      if (answers.has(exercise)) answer(answers.get(exercise)!);
      else feedback.textContent = text('정답을 고르면 다음 문제로 갈 수 있어요.', 'Choose a hand to continue.');
    }
    find('.seotda-guide-content').scrollTop = 0;
    if (moveFocus) heading.focus({ preventScroll: true });
  };
  next.addEventListener('click', () => { if (step < 4) step++; else if (exercise < 2) exercise++; else { exit(); return; } render(true); });
  prev.addEventListener('click', () => { if (step === 4 && exercise > 0) exercise--; else step = Math.max(0, step - 1); render(true); });
  find('[data-seotda-skip-tutorial]').addEventListener('click', exit);
  // Lazy rendering avoids downloading any lesson cards before the guide opens.
  details.addEventListener('toggle', () => { if (details.open) render(true); });
  return { open() { details.open = true; render(true); } };
}
