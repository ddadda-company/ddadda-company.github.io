const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll<HTMLElement>('[data-playroom]').forEach(room => {
  const track = room.querySelector<HTMLOListElement>('[data-room-track]');
  if (!track) return;
  const stations = [...track.querySelectorAll<HTMLElement>('[data-result]')];
  const dates = [...room.querySelectorAll<HTMLAnchorElement>('[data-room-date]')];
  const previous = room.querySelector<HTMLButtonElement>('[data-room-step="-1"]');
  const next = room.querySelector<HTMLButtonElement>('[data-room-step="1"]');
  const status = room.querySelector<HTMLElement>('[data-room-status]');
  let current = stations[0];
  let destination: HTMLElement | undefined;
  let frame = 0;
  let positions: { station: HTMLElement; left: number }[] = [];
  let measuredWidth = 0;
  let step = 1;
  let drag: { pointer: number; x: number; y: number; left: number; lastX: number; lastTime: number; velocity: number; active: boolean } | undefined;
  let suppressClick = false;

  const measure = () => {
    measuredWidth = track.clientWidth;
    const bounds = track.getBoundingClientRect();
    positions = stations.filter(item => !item.hidden).map(station => {
      const rect = station.getBoundingClientRect();
      return { station, left: track.scrollLeft + rect.left - bounds.left - (track.clientWidth - rect.width) / 2 };
    });
    step = positions.length > 1 ? positions[1].left - positions[0].left : track.clientWidth;
  };
  const nearest = (left = track.scrollLeft) => positions.reduce<(typeof positions)[number] | undefined>((closest, item) =>
    !closest || Math.abs(item.left - left) < Math.abs(closest.left - left) ? item : closest, undefined)?.station;
  const select = (station: HTMLElement, force = false) => {
    if (current === station && !force) return;
    current = station;
    stations.forEach(item => item.classList.toggle('is-current', item === current));
    dates.forEach(date => {
      if (date.dataset.roomDate === current.id) date.setAttribute('aria-current', 'true');
      else date.removeAttribute('aria-current');
    });
    const index = positions.findIndex(item => item.station === current);
    if (previous) previous.disabled = index <= 0;
    if (next) next.disabled = index < 0 || index === positions.length - 1;
  };
  // Cache layout on resize/filter. Scroll frames only read the scroll offset;
  // scale follows position continuously instead of restarting a CSS transition.
  const render = () => {
    frame = 0;
    if (track.clientWidth !== measuredWidth) measure();
    const left = track.scrollLeft;
    positions.forEach(item => {
      const distance = Math.min(1, Math.abs(item.left - left) / step);
      const scale = reducedMotion.matches ? 1 : .85 + .15 * (1 + Math.cos(distance * Math.PI)) / 2;
      const value = scale.toFixed(4);
      if (item.station.style.getPropertyValue('--toy-scale') !== value) item.station.style.setProperty('--toy-scale', value);
    });
    const closest = nearest(left);
    if (!destination && closest) select(closest);
  };
  const queueRender = () => { if (!frame) frame = requestAnimationFrame(render); };
  const settle = () => {
    if (drag?.active) return;
    destination = undefined;
    track.classList.remove('is-settling');
    render();
    if (status && current) status.textContent = `${current.querySelector('h4')?.textContent} · ${current.querySelector('.visually-hidden')?.textContent}`;
    const date = dates.find(date => date.dataset.roomDate === current?.id);
    const rail = date?.parentElement?.parentElement;
    if (!date || !rail) return;
    const bounds = rail.getBoundingClientRect();
    const item = date.getBoundingClientRect();
    const delta = item.left < bounds.left ? item.left - bounds.left : item.right > bounds.right ? item.right - bounds.right : 0;
    if (delta) rail.scrollTo({ left: rail.scrollLeft + delta, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  };
  const scrollTo = (station: HTMLElement, smooth = true) => {
    if (track.clientWidth !== measuredWidth) measure();
    const target = positions.find(item => item.station === station);
    if (!target) return;
    const moving = Math.abs(target.left - track.scrollLeft) > 1;
    destination = smooth && !reducedMotion.matches && moving ? station : undefined;
    select(station, true);
    track.scrollTo({ left: target.left, behavior: destination ? 'smooth' : 'instant' });
    queueRender();
    if (!destination) settle();
  };
  const go = (direction: number) => {
    const index = positions.findIndex(item => item.station === (destination ?? current));
    const target = positions[Math.max(0, Math.min(positions.length - 1, index + direction))]?.station;
    if (target) scrollTo(target);
  };
  room.querySelectorAll<HTMLButtonElement>('[data-room-step]').forEach(button => {
    button.addEventListener('click', () => go(Number(button.dataset.roomStep)));
  });
  dates.forEach(date => date.addEventListener('click', event => {
    const target = stations.find(station => station.id === date.dataset.roomDate);
    if (!target || target.hidden) return;
    event.preventDefault();
    scrollTo(target);
  }));
  track.addEventListener('keydown', event => {
    if (event.target !== track || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home' || event.key === 'End') {
      const target = (event.key === 'Home' ? positions[0] : positions.at(-1))?.station;
      if (target) scrollTo(target);
    } else go(event.key === 'ArrowRight' ? 1 : -1);
  });
  track.addEventListener('scroll', queueRender, { passive: true });
  track.addEventListener('scrollend', settle);
  const interrupt = () => {
    if (destination) track.scrollTo({ left: track.scrollLeft, behavior: 'instant' });
    destination = undefined;
    track.classList.remove('is-settling');
  };
  // Touch and trackpad keep browser-native momentum; only mouse dragging needs
  // pointer handling. A simple click still opens the competition result.
  track.addEventListener('pointerdown', event => {
    interrupt();
    suppressClick = false;
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    drag = { pointer: event.pointerId, x: event.clientX, y: event.clientY, left: track.scrollLeft, lastX: event.clientX, lastTime: event.timeStamp, velocity: 0, active: false };
  });
  track.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.pointer) return;
    const dx = event.clientX - drag.x;
    if (!drag.active) {
      if (Math.abs(dx) < 6) return;
      if (Math.abs(event.clientY - drag.y) > Math.abs(dx)) { drag = undefined; return; }
      drag.active = true;
      track.classList.add('is-dragging');
      track.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    const elapsed = Math.max(1, event.timeStamp - drag.lastTime);
    drag.velocity = drag.velocity * .35 + (drag.lastX - event.clientX) / elapsed * .65;
    drag.lastX = event.clientX;
    drag.lastTime = event.timeStamp;
    track.scrollLeft = drag.left - dx;
  });
  const finishDrag = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.pointer) return;
    const gesture = drag;
    drag = undefined;
    if (!gesture.active) return;
    suppressClick = true;
    const velocity = event.type === 'pointercancel' || event.timeStamp - gesture.lastTime > 100 ? 0 : gesture.velocity;
    const projected = track.scrollLeft + Math.max(-step, Math.min(step, velocity * 160));
    const target = nearest(projected);
    track.classList.add('is-settling');
    track.classList.remove('is-dragging');
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    if (target) scrollTo(target);
    else settle();
  };
  track.addEventListener('pointerup', finishDrag);
  track.addEventListener('pointercancel', finishDrag);
  track.addEventListener('lostpointercapture', finishDrag);
  track.addEventListener('pointerleave', () => { if (drag && !drag.active) drag = undefined; });
  track.addEventListener('dragstart', event => event.preventDefault());
  track.addEventListener('click', event => {
    if (!suppressClick || event.detail === 0) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClick = false;
  }, true);
  track.addEventListener('wheel', interrupt, { passive: true });

  const refresh = () => {
    dates.forEach(date => {
      const item = stations.find(station => station.id === date.dataset.roomDate);
      if (date.parentElement) date.parentElement.hidden = !item || item.hidden;
    });
    if (room.hidden) return;
    interrupt();
    measure();
    const first = positions[0]?.station;
    if (first) scrollTo(first, false);
  };
  document.addEventListener('results-filtered', refresh);
  let trackWidth = track.clientWidth;
  new ResizeObserver(() => {
    const width = track.clientWidth;
    if (width === trackWidth) return;
    trackWidth = width;
    if (room.hidden) return;
    const selected = destination ?? current;
    interrupt();
    measure();
    if (selected && !selected.hidden) scrollTo(selected, false);
  }).observe(track, { box: 'border-box' });
  reducedMotion.addEventListener('change', () => {
    if (destination && reducedMotion.matches) scrollTo(destination, false);
    queueRender();
  });
  room.classList.add('playroom-ready');
  refresh();
});
