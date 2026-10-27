/** Finite, user-triggered card-table sounds and cinematic beats. No media or voice samples. */
export function createSeotdaEffects(dialog: HTMLDialogElement, ko: boolean, onReturn: () => void) {
  const text = (a: string, b: string) => ko ? a : b;
  const find = <T extends HTMLElement = HTMLElement>(selector: string) => dialog.querySelector<T>(selector)!;
  const cut = find('[data-seotda-cut]');
  const cutTitle = find('[data-seotda-cut-title]'), cutLine = find('[data-seotda-cut-line]');
  const cutSpeaker = find('[data-seotda-cut-speaker]'), cutButton = find<HTMLButtonElement>('[data-seotda-cut-next]');
  const cutPhoto = find<HTMLImageElement>('[data-seotda-cut-photo]'), cutCard = find<HTMLImageElement>('[data-seotda-cut-card]');
  const audioButton = find<HTMLButtonElement>('[data-seotda-sound]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const surfaces = ['.seotda-modes', '.seotda-score', '.seotda-body', '.seotda-controls'];
  const soundKey = 'dda_com-seotda-sound';
  let enabled = true, context: AudioContext | undefined, epoch = 0;
  let kind: 'stop' | 'reveal' = 'stop', flipped = false;
  const nodes = new Set<AudioScheduledSourceNode>();
  try { enabled = localStorage.getItem(soundKey) !== 'off'; } catch { /* Session preference still works. */ }
  const labelSound = () => {
    audioButton.setAttribute('aria-pressed', String(enabled));
    audioButton.setAttribute('aria-label', enabled ? text('효과음 끄기', 'Mute sound effects') : text('효과음 켜기', 'Enable sound effects'));
    audioButton.title = audioButton.getAttribute('aria-label')!;
  };
  labelSound();
  const silence = () => {
    epoch++;
    for (const node of nodes) { try { node.stop(); } catch { /* Already ended. */ } node.disconnect(); }
    nodes.clear();
  };
  const unlock = async () => {
    if (!enabled) return null;
    try {
      context ??= new AudioContext();
      if (context.state === 'suspended') await context.resume();
      return context.state === 'running' ? context : null;
    } catch {
      enabled = false; labelSound(); audioButton.dataset.state = 'error';
      audioButton.title = text('이 브라우저에서는 효과음을 사용할 수 없어요.', 'Sound effects are unavailable in this browser.');
      return null;
    }
  };
  const cue = async (type: 'card' | 'chips' | 'tension' | 'stop' | 'reveal') => {
    const stamp = epoch, ctx = await unlock();
    if (!ctx || stamp !== epoch || !enabled || !dialog.open) return;
    const now = ctx.currentTime;
    const tone = (frequency: number, end: number, duration: number, level: number, delay = 0) => {
      const source = ctx.createOscillator(), gain = ctx.createGain();
      source.type = 'sine'; source.frequency.setValueAtTime(frequency, now + delay);
      source.frequency.exponentialRampToValueAtTime(end, now + delay + duration);
      gain.gain.setValueAtTime(.0001, now + delay);
      gain.gain.linearRampToValueAtTime(level, now + delay + .008);
      gain.gain.exponentialRampToValueAtTime(.0001, now + delay + duration);
      source.connect(gain); gain.connect(ctx.destination); nodes.add(source);
      source.onended = () => { nodes.delete(source); source.disconnect(); gain.disconnect(); };
      source.start(now + delay); source.stop(now + delay + duration + .01);
    };
    const tap = (duration: number, level: number, frequency: number) => {
      const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
      const samples = buffer.getChannelData(0);
      for (let i = 0; i < samples.length; i++) samples[i] = (Math.random() * 2 - 1) * (1 - i / samples.length) ** 3;
      const source = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain();
      source.buffer = buffer; filter.type = 'lowpass'; filter.frequency.value = frequency; gain.gain.value = level;
      source.connect(filter); filter.connect(gain); gain.connect(ctx.destination); nodes.add(source);
      source.onended = () => { nodes.delete(source); source.disconnect(); filter.disconnect(); gain.disconnect(); };
      source.start(now);
    };
    if (type === 'card') { tap(.065, .13, 2400); tone(180, 80, .08, .04); }
    if (type === 'chips') { tone(1200, 700, .07, .025); tone(960, 640, .09, .025, .065); }
    if (type === 'tension') { tone(92, 73, .65, .035); tone(98, 77, .65, .02); }
    if (type === 'stop') { tap(.13, .28, 1300); tone(130, 40, .38, .12); tone(74, 48, .9, .035, .1); }
    if (type === 'reveal') { tap(.055, .11, 2100); tone(330, 330, .32, .045); tone(495, 495, .6, .03, .08); }
  };
  audioButton.addEventListener('click', () => {
    enabled = !enabled; delete audioButton.dataset.state; silence(); labelSound();
    try { localStorage.setItem(soundKey, enabled ? 'on' : 'off'); } catch { /* Optional. */ }
    if (enabled) void cue('card');
  });
  const dismiss = (returnFocus = true) => {
    silence(); cut.hidden = true; dialog.dataset.cut = 'false';
    for (const selector of surfaces) find(selector).inert = false;
    if (returnFocus && dialog.open) onReturn();
  };
  const show = (next: 'stop' | 'reveal') => {
    silence(); kind = next; flipped = false;
    cut.dataset.kind = kind; cut.dataset.flipped = 'false'; cut.dataset.state = 'loading';
    cut.hidden = false; dialog.dataset.cut = 'true';
    for (const selector of surfaces) find(selector).inert = true;
    cutSpeaker.textContent = next === 'stop' ? text('아귀', 'AGWI') : text('모두가 패만 본다.', 'ALL EYES ON THE CARD.');
    cutTitle.textContent = next === 'stop' ? text('동작\n그만.', 'HOLD\nIT.') : text('뒤집어.', 'TURN IT.');
    cutLine.textContent = next === 'stop' ? text('손은 그대로. 마지막 패, 어디서 뺐어?', 'Keep that hand still. Where did the last card come from?') : text('말은 끝났다. 남은 건 이 한 장.', 'No more talk. Just this one card.');
    cutPhoto.hidden = next !== 'stop'; cutCard.hidden = next !== 'reveal';
    if (next === 'stop') {
      cutPhoto.alt = text('화투판 너머로 고니의 손목을 붙잡은 아귀', 'Agwi catches Goni’s wrist across the card table');
      cutPhoto.src = '/images/tazza/stop.jpg';
      cutButton.textContent = text('손을 멈춘다', 'Hold your nerve');
      void cue('stop');
    } else {
      cutCard.src = '/images/hwatu/back.svg'; cutCard.alt = text('아직 뒤집지 않은 마지막 패', 'The final card, face down');
      cutButton.textContent = text('패를 뒤집는다', 'Turn the card');
      void cue('tension');
    }
    cutButton.focus({ preventScroll: true });
  };
  for (const img of [cutPhoto, cutCard]) {
    img.addEventListener('load', () => { if (!img.hidden) cut.dataset.state = 'success'; });
    img.addEventListener('error', () => { if (!img.hidden) { img.hidden = true; cut.dataset.state = 'error'; } });
  }
  cutButton.addEventListener('click', () => {
    if (kind === 'reveal' && !flipped) {
      flipped = true; cut.dataset.flipped = 'true';
      cutCard.hidden = false; cutCard.src = '/images/hwatu/m03-02.svg'; cutCard.alt = text('3월 벚꽃 홍단. 단풍이 아니다.', 'March cherry blossom ribbon. Not October maple.');
      cutSpeaker.textContent = text('고니', 'GONI'); cutTitle.textContent = text('사쿠라네.', 'CHERRY\nBLOSSOM.');
      cutLine.textContent = text('10월 단풍? 아니. 3월 벚꽃.', 'October maple? No. March cherry blossom.');
      cutButton.textContent = text('판으로 돌아간다', 'Back to the table');
      silence(); void cue('reveal');
    } else dismiss();
  });
  const animateCard = (card: HTMLElement | null) => {
    void cue('card');
    if (!card || reduced.matches) return;
    card.animate([{ opacity: .3, transform: 'translateY(-10px) rotate(-5deg)' }, { opacity: 1, transform: 'none' }], { duration: 280, easing: 'cubic-bezier(.22,1,.36,1)' });
  };
  const close = () => { dismiss(false); if (context?.state === 'running') void context.suspend().catch(() => {}); };
  return { show, dismiss, close, cue, animateCard, active: () => !cut.hidden };
}
