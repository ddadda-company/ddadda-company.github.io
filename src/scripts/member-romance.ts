import { l, romanceActions, romanceDays, romanceEndings, romanceMemories, type EndingId, type Stats } from '../data/member-romance';
import { actionById, actionLock, advanceRomance, canConfess, newRomanceGame, relationship, restoreRomance, serializeRomance, type RomanceEvent } from '../lib/member-romance';
import type { Localized } from '../data/team';

const storageKey = 'dda_com-romance-v2';
export function setupMemberRomance() {
  const dialog = document.querySelector<HTMLDialogElement>('#member-romance');
  if (!dialog || typeof dialog.showModal !== 'function') return () => false;
  const locale = document.documentElement.lang === 'ko' ? 'ko' : 'en';
  const t = (value: Localized) => value[locale];
  const text = (ko: string, en: string) => locale === 'ko' ? ko : en;
  const find = <T extends HTMLElement = HTMLElement>(selector: string) => dialog.querySelector<T>(selector)!;
  const page = find('[data-romance-page]');
  const context = find('[data-romance-context]');
  const dialogue = find('[data-romance-dialogue]');
  const line = find('[data-romance-line]');
  const endingTitle = find('[data-romance-ending]');
  const choices = find('[data-romance-choices]');
  const finish = find<HTMLButtonElement>('[data-romance-finish]');
  const back = find<HTMLButtonElement>('[data-romance-back]');
  const effects = find('[data-romance-effects]');
  const notes = find('[data-romance-notes]');
  const saveNote = find('[data-romance-save-note]');
  const statNames: Record<keyof Stats, Localized> = { affection: l('호감', 'Affection'), trust: l('신뢰', 'Trust'), tension: l('긴장', 'Tension') };
  let storageAvailable = true;
  let raw: string | null = null;
  try { raw = localStorage.getItem(storageKey); } catch { storageAvailable = false; }
  let save = restoreRomance(raw);
  let opener: HTMLElement | undefined;
  const album = document.querySelector<HTMLDialogElement>('#surprise-collection');
  const resume = document.querySelector<HTMLButtonElement>('[data-collection-romance-resume]');
  const resumeStatus = document.querySelector<HTMLElement>('[data-collection-romance-status]');
  let returnToAlbum = false;

  const renderResume = () => {
    if (!resume || !resumeStatus) return;
    resume.disabled = !save.started;
    if (!save.started) return;
    const g = save.game;
    resume.textContent = g.ending ? text('미연시 엔딩 보기', 'View your ending') : text('미연시 이어서 하기', 'Continue mini-game');
    resumeStatus.textContent = g.ending ? `${t(romanceEndings[g.ending].title)} · ${text('엔딩', 'Endings')} ${save.unlocked.length}/5` : text(`${g.day}일차 · 남은 행동 ${g.energy}/3 · 호감 ${g.affection} · 신뢰 ${g.trust}`, `Day ${g.day} · Actions ${g.energy}/3 · Affection ${g.affection} · Trust ${g.trust}`);
  };

  const persist = () => {
    try { localStorage.setItem(storageKey, serializeRomance(save)); storageAvailable = true; }
    catch { storageAvailable = false; }
    renderResume();
  };
  const make = <K extends keyof HTMLElementTagNameMap>(tag: K, content: string, className = '') => {
    const element = document.createElement(tag);
    element.textContent = content;
    if (className) element.className = className;
    return element;
  };
  const button = (label: string, hint: string, click: () => void, id: string, locked?: string) => {
    const control = document.createElement('button');
    control.type = 'button';
    control.dataset.romanceOption = id;
    control.append(make('span', label), make('small', locked || hint));
    control.disabled = !!locked;
    control.addEventListener('click', () => {
      click();
      dialogue.focus({ preventScroll: true });
      dialogue.scrollIntoView({ block: 'nearest' });
    }, { once: true });
    choices.append(control);
  };
  const commit = (event: RomanceEvent) => {
    const next = advanceRomance(save.game, event);
    if (!next) return;
    save.game = next;
    save.active = null;
    save.view = event.type === 'choice' ? 'result' : 'hub';
    if (next.ending && !save.unlocked.includes(next.ending)) save.unlocked.push(next.ending);
    persist();
    render();
  };
  const showHub = () => { save.view = 'hub'; save.active = null; persist(); render(); };
  const renderNotebook = () => {
    const g = save.game;
    const goals = [
      { ready: g.affection >= 75, label: text(`호감 ${g.affection}/75`, `Affection ${g.affection}/75`) },
      { ready: g.trust >= 60, label: text(`신뢰 ${g.trust}/60`, `Trust ${g.trust}/60`) },
      { ready: g.tension <= 40, label: text(`긴장 ${g.tension} · 40 이하`, `Tension ${g.tension} · at most 40`) },
      { ready: g.memories.length >= 2, label: text(`추억 ${g.memories.length}/2`, `Memories ${g.memories.length}/2`) },
    ];
    find('[data-romance-goal-summary]').textContent = text(`고백 준비 ${goals.filter(goal => goal.ready).length}/4`, `Ready to confess ${goals.filter(goal => goal.ready).length}/4`);
    const goalList = find('[data-romance-goals]');
    goalList.replaceChildren(...goals.map(goal => make('li', `${goal.ready ? '✓' : '○'} ${goal.label}`)));
    const memories = find('[data-romance-memories]');
    memories.replaceChildren(...(g.memories.length ? g.memories.map(id => make('li', t(romanceMemories[id]))) : [make('li', text('함께한 선택이 추억으로 남아요.', 'Your choices together become memories.'))]));
    const history = find('[data-romance-history]');
    history.replaceChildren();
    let day = 1;
    g.log.forEach(event => {
      if (event.type === 'next') day++;
      if (event.type !== 'choice') return;
      const action = actionById(event.action)!;
      const choice = action.choices.find(choice => choice.id === event.choice)!;
      history.append(make('li', `${text(`${day}일차`, `Day ${day}`)} · ${t(action.title)} — ${t(choice.label)}`));
    });
    find('[data-romance-gallery-summary]').textContent = text(`엔딩 수집 ${save.unlocked.length}/5`, `Endings ${save.unlocked.length}/5`);
    find('[data-romance-gallery]').replaceChildren(...Object.entries(romanceEndings).map(([id, ending]) => {
      const item = document.createElement('li');
      const unlocked = save.unlocked.includes(id as EndingId);
      item.dataset.unlocked = String(unlocked);
      item.append(make('strong', unlocked ? `✓ ${t(ending.title)}` : text('아직 만나지 못한 결말', 'An ending yet to be found')), make('p', t(ending.hint)));
      return item;
    }));
  };
  const render = () => {
    const g = save.game;
    const day = romanceDays[g.day - 1];
    dialog.dataset.affection = g.affection >= 45 ? 'high' : 'warm';
    dialog.dataset.phase = g.ending ? 'ending' : save.view === 'result' ? 'result' : g.energy === 0 ? (g.day < 3 ? 'night' : 'finale') : save.view;
    dialog.dataset.day = String(g.day);
    find('[data-romance-day]').textContent = text(`${g.day}일차 / 3일`, `Day ${g.day} / 3`);
    find('[data-romance-energy]').textContent = text(`남은 행동 ${g.energy}/3`, `Actions ${g.energy}/3`);
    find('[data-romance-gifts]').textContent = text(`선물권 ${g.gifts}/2`, `Gift tickets ${g.gifts}/2`);
    (Object.keys(statNames) as (keyof Stats)[]).forEach(stat => {
      find(`[data-romance-stat="${stat}"]`).textContent = String(g[stat]);
      find<HTMLProgressElement>(`[data-romance-meter="${stat}"]`).value = g[stat];
    });
    find('[data-romance-relationship]').textContent = t(relationship(g));
    find('[data-romance-mood]').textContent = g.tension >= 65 ? text('마음이 복잡해요', 'Overwhelmed') : t(day.mood);
    saveNote.textContent = storageAvailable ? text('자동 저장 · 다시 만나면 이어서 할 수 있어요.', 'Auto-save · Continue when you meet again.') : text('저장할 수 없어 이번 페이지에서만 진행이 유지돼요.', 'Storage unavailable. Progress lasts only on this page.');
    saveNote.dataset.error = String(!storageAvailable);
    page.textContent = t(day.title);
    context.textContent = t(day.hint);
    endingTitle.hidden = !g.ending;
    finish.hidden = !g.ending;
    back.hidden = true;
    effects.replaceChildren(); notes.replaceChildren(); choices.replaceChildren();
    choices.classList.toggle('romance-choices--activities', !g.ending && g.energy > 0 && save.view === 'hub');
    if (g.ending) {
      const ending = romanceEndings[g.ending];
      page.textContent = text('우리의 엔딩', 'Our ending');
      context.textContent = text('다른 선택으로 다른 이야기도 만나 보세요.', 'Different choices lead to different stories.');
      endingTitle.textContent = t(ending.title);
      line.textContent = t(ending.line);
      button(text('다른 엔딩에 도전', 'Try another ending'), text('엔딩 수집은 유지돼요.', 'Your collected endings are kept.'), () => {
        save = { game: newRomanceGame(), view: 'hub', active: null, unlocked: [...save.unlocked], started: true };
        persist(); render();
      }, 'restart');
    } else if (save.view === 'result' && g.last) {
      line.textContent = t(g.last.reply);
      const delta = g.last.delta;
      (Object.keys(delta) as (keyof Stats)[]).forEach(stat => {
        const chip = make('span', `${t(statNames[stat])} ${delta[stat] >= 0 ? '+' : ''}${delta[stat]}`, 'romance-effect');
        chip.dataset.good = String(stat === 'tension' ? delta[stat] < 0 : delta[stat] > 0);
        effects.append(chip);
      });
      notes.append(...g.last.notes.map(note => make('li', t(note))));
      button(text('계속', 'Continue'), text('이번 선택이 저장됐어요.', 'This choice has been saved.'), showHub, 'continue');
    } else if (g.energy === 0 && g.day < 3) {
      line.textContent = g.tension >= 65 ? text('오늘은 여기까지 할까. 조금 쉬고 다시 만나고 싶어.', 'Let’s stop here today. I’d like to rest before we meet again.') : text('벌써 시간이 이렇게 됐네. 내일도… 와줄 거지?', 'It’s gotten late already. You’ll come tomorrow… right?');
      button(text('다음 날 만나기', 'Meet the next day'), text('행동 3회 회복 · 기분이 달라져요.', '3 actions restored · A new mood awaits.'), () => commit({ type: 'next' }), 'next');
    } else if (g.energy === 0) {
      line.textContent = text('우리 같이 보낸 시간, 너한테는 어땠어? 이제 네 마음을 듣고 싶어.', 'How was our time together for you? I’d like to hear how you feel.');
      button(text('좋아한다고 고백하기', 'Confess your feelings'), canConfess(g) ? text('서로에게 충분히 가까워졌어요.', 'You have grown close enough.') : t(romanceEndings.love.hint), () => commit({ type: 'ending', approach: 'confess' }), 'ending-confess');
      button(text('천천히 알아가고 싶어', 'Let’s take our time'), t(romanceEndings.slow.hint), () => commit({ type: 'ending', approach: 'slow' }), 'ending-slow');
      button(text('계속 같은 팀이 되고 싶어', 'I want us to stay a team'), t(romanceEndings.partner.hint), () => commit({ type: 'ending', approach: 'team' }), 'ending-team');
    } else if (save.view === 'scene' && save.active) {
      const action = actionById(save.active)!;
      page.textContent = `${t(day.title)} · ${t(action.title)}`;
      line.textContent = t(action.lines[g.day - 1]);
      back.hidden = false;
      action.choices.forEach(choice => {
        const locked = actionLock(g, action.id, choice.id);
        const hint = choice.trustRequired ? text(`신뢰 ${choice.trustRequired}부터 가능`, `Available at trust ${choice.trustRequired}`) : action.id === 'gift' && choice.id === 'cocoa' && g.memories.includes('sweet') ? text('좋아한다고 했던 것!', 'His favorite — you remember!') : '';
        button(t(choice.label), hint, () => commit({ type: 'choice', action: action.id, choice: choice.id }), `choice-${choice.id}`, locked ? t(locked) : undefined);
      });
    } else {
      line.textContent = g.day === 2 && g.memories.includes('honest') ? text('어제 너랑 있는 게 좋다고 했잖아. 나, 그 말 계속 생각했어.', 'You said you like being with me yesterday. I kept thinking about that.') : t(day.line);
      romanceActions.forEach(action => {
        const locked = actionLock(g, action.id);
        const repeat = !!g.uses[action.id];
        button(t(action.title), repeat ? text('오늘 이미 했어요 · 반복 효과 감소', 'Already done today · Smaller gains') : t(action.hint), () => {
          save.active = action.id; save.view = 'scene'; persist(); render();
        }, `action-${action.id}`, locked ? t(locked) : undefined);
      });
    }
    renderNotebook();
  };
  back.addEventListener('click', () => { showHub(); dialogue.focus({ preventScroll: true }); dialogue.scrollIntoView({ block: 'nearest' }); });
  const close = () => { if (dialog.open) dialog.close(); };
  find('[data-romance-close]').addEventListener('click', close);
  finish.addEventListener('click', close);
  dialog.addEventListener('close', () => {
    const restoreAlbum = returnToAlbum;
    returnToAlbum = false;
    if (restoreAlbum && album && resume && !document.hidden && !document.querySelector('dialog[open]')) {
      album.showModal();
      resume.focus({ preventScroll: true });
    } else opener?.focus({ preventScroll: true });
  });
  let backdropPointer = false;
  const outside = (event: MouseEvent) => {
    const rect = dialog.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  };
  dialog.addEventListener('pointerdown', event => { backdropPointer = event.target === dialog && outside(event); });
  dialog.addEventListener('click', event => {
    if (backdropPointer && event.target === dialog && outside(event)) close();
    backdropPointer = false;
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { returnToAlbum = false; close(); } });
  window.addEventListener('pagehide', () => { returnToAlbum = false; close(); });
  const open = (trigger?: HTMLElement) => {
    if (document.hidden || document.querySelector('dialog[open]')) return false;
    opener = trigger;
    save.started = true;
    persist();
    render();
    dialog.showModal();
    dialogue.focus({ preventScroll: true });
    return true;
  };
  resume?.addEventListener('click', () => {
    if (!save.started || !album?.open || document.hidden) return;
    returnToAlbum = true;
    album.close();
    if (!open(resume)) returnToAlbum = false;
  });
  renderResume();
  return open;
}
