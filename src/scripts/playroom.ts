// Connect the rendered stops, so filtering and wrapped captions cannot detach
// the trail. Native document scrolling and result links need no JS handlers.
document.querySelectorAll<HTMLElement>('[data-room-trail]').forEach(trail => {
  const route = trail.querySelector<SVGSVGElement>('[data-trail-route]');
  if (!route) return;
  const paths = route.querySelectorAll('path');
  const compact = matchMedia('(max-width: 59.99rem)');
  let frame = 0;

  const draw = () => {
    frame = 0;
    const bounds = trail.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const stops = [...trail.querySelectorAll<HTMLElement>('[data-result]:not([hidden]) [data-trail-stop]')].map(stop => {
      const rect = stop.getBoundingClientRect();
      return { x: rect.left + rect.width / 2 - bounds.left, y: rect.top + rect.height / 2 - bounds.top };
    });
    if (!stops.length) return;
    const endX = compact.matches ? stops[0].x : bounds.width / 2;
    const points = [{ x: endX, y: 8 }, ...stops, { x: compact.matches ? stops.at(-1)!.x : endX, y: bounds.height - 16 }];
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const previous = points[i - 1];
      const current = points[i];
      const middleY = (previous.y + current.y) / 2;
      d += ` C ${previous.x} ${middleY}, ${current.x} ${middleY}, ${current.x} ${current.y}`;
    }
    route.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    paths.forEach(path => path.setAttribute('d', d));
    trail.classList.add('trail-ready');
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
  new ResizeObserver(schedule).observe(trail);
  document.addEventListener('results-filtered', schedule);
  compact.addEventListener('change', schedule);
  document.fonts.ready.then(schedule);
  schedule();
});
