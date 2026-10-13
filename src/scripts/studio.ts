const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

if (!reduceMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
  document.documentElement.classList.add('studio-motion');
}

// No perpetual animation loop. Update at most once per paint while the pointer moves.
const tiltTargets = document.querySelectorAll<HTMLElement>('[data-tilt]');
tiltTargets.forEach(element => {
  let frame = 0;
  let x = 0;
  let y = 0;
  element.addEventListener('pointermove', event => {
    if (reduceMotion.matches || !finePointer.matches || event.pointerType === 'touch') return;
    const bounds = element.getBoundingClientRect();
    x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    if (!frame) frame = requestAnimationFrame(() => {
      element.style.setProperty('--tilt-x', `${-y * 7}deg`);
      element.style.setProperty('--tilt-y', `${x * 9}deg`);
      frame = 0;
    });
  });
  const reset = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    element.style.removeProperty('--tilt-x');
    element.style.removeProperty('--tilt-y');
  };
  element.addEventListener('pointerleave', reset);
  reduceMotion.addEventListener('change', reset);
});

const scene = document.querySelector<HTMLElement>('[data-scene]');
const picture = document.querySelector<HTMLElement>('[data-scene-image]');
if (scene && picture) {
  let frame = 0;
  let x = 0;
  let y = 0;
  scene.addEventListener('pointermove', event => {
    if (reduceMotion.matches || !finePointer.matches || innerWidth < 960 || event.pointerType === 'touch') return;
    const bounds = scene.getBoundingClientRect();
    x = (event.clientX - bounds.left) / bounds.width - .5;
    y = (event.clientY - bounds.top) / bounds.height - .5;
    if (!frame) frame = requestAnimationFrame(() => {
      picture.style.setProperty('--scene-x', `${x * -12}px`);
      picture.style.setProperty('--scene-y', `${y * -8}px`);
      picture.style.setProperty('--scene-rx', `${y * -4}deg`);
      picture.style.setProperty('--scene-ry', `${x * 6}deg`);
      frame = 0;
    });
  });
  const reset = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    picture.style.removeProperty('--scene-x');
    picture.style.removeProperty('--scene-y');
    picture.style.removeProperty('--scene-rx');
    picture.style.removeProperty('--scene-ry');
  };
  scene.addEventListener('pointerleave', reset);
  window.addEventListener('resize', reset);
  reduceMotion.addEventListener('change', reset);
}
