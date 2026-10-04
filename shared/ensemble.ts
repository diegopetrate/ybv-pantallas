import '@fontsource/manrope/300.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/dm-mono/300.css';
import '@fontsource/dm-mono/400.css';
import '@fontsource/dm-mono/500.css';
import './ensemble.css';

/** Small DOM helper: element with optional class and text. */
export function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/** The exhibition header, identical on all four screens: the show's name, then what this screen is. */
export function ensembleHeader(subtitle: string, meta?: string): HTMLElement {
  const header = el('header', 'ensemble-header');
  const brand = el('div', 'brand');
  const name = el('span', 'brand-name');
  for (const word of ['Yellow', 'Blue', 'Vase']) name.append(el('b', undefined, word));
  brand.append(name, el('small', undefined, subtitle));
  header.append(brand);
  if (meta) header.append(el('div', 'header-meta', meta));
  return header;
}

export interface Horizon {
  element: HTMLElement;
  setHead(left: string, right: string): void;
  setLabels(left: string, right: string): void;
  /** Marks along the line, as fractions of its length (e.g. where each section starts). */
  setTicks(positions: number[]): void;
  /** Moves the progress from one fraction to another at constant speed over `ms`. */
  run(from: number, to: number, ms: number): void;
}

export interface HorizonOptions {
  /** Makes the line draggable, like Memory on the sculpture screens: called with the fraction under
   * the pointer while dragging (`final` false) and once more when it is released (`final` true). */
  onSeek?: (fraction: number, final: boolean) => void;
}

/** The Memory line of the sculpture screens, reused as this screen's progress. */
export function horizon(options: HorizonOptions = {}): Horizon {
  const element = el('footer', 'horizon');
  const head = el('div', 'horizon-head'), headLeft = el('span'), headRight = el('span', 'live');
  head.append(headLeft, headRight);
  const track = el('div', 'horizon-track'), ticks = el('div', 'horizon-ticks'), fill = el('div', 'horizon-fill'), thumb = el('div', 'horizon-thumb');
  track.append(ticks, fill, thumb);
  const labels = el('div', 'horizon-labels'), labelLeft = el('span'), labelRight = el('span');
  labels.append(labelLeft, labelRight);
  element.append(head, track, labels);

  let last = { from: 0, to: 0, ms: 0, started: 0 }, runs = 0;
  const place = (fraction: number, ms: number) => {
    const width = track.clientWidth;
    const transition = ms > 0 ? `transform ${ms}ms linear` : 'none';
    fill.style.transition = transition;
    thumb.style.transition = transition;
    fill.style.transform = `scaleX(${fraction})`;
    thumb.style.transform = `translateX(${fraction * width}px)`;
  };
  // Keep the thumb on the line if the window is resized mid-run.
  window.addEventListener('resize', () => {
    const elapsed = Math.min(1, last.ms ? (performance.now() - last.started) / last.ms : 1);
    const now = last.from + (last.to - last.from) * elapsed;
    place(now, 0);
    if (elapsed < 1) requestAnimationFrame(() => place(last.to, last.ms * (1 - elapsed)));
  });

  const seek = options.onSeek;
  if (seek) {
    element.classList.add('seekable');
    const fractionAt = (clientX: number) => { const box = track.getBoundingClientRect(); return Math.max(0, Math.min(1, (clientX - box.left) / Math.max(1, box.width))); };
    let dragging = false;
    const follow = (event: PointerEvent, final: boolean) => {
      const fraction = fractionAt(event.clientX);
      runs++; // Cancels a run that was about to start.
      place(fraction, 0);
      seek(fraction, final);
    };
    track.addEventListener('pointerdown', event => {
      event.preventDefault();
      dragging = true;
      // Some pointers (remotes, synthetic events) cannot be captured; dragging still works without it.
      try { track.setPointerCapture(event.pointerId); } catch { /* Not capturable. */ }
      element.classList.add('dragging');
      follow(event, false);
    });
    track.addEventListener('pointermove', event => { if (dragging) follow(event, false); });
    const release = (event: PointerEvent) => { if (!dragging) return; dragging = false; element.classList.remove('dragging'); follow(event, true); };
    track.addEventListener('pointerup', release);
    track.addEventListener('pointercancel', release);
  }

  return {
    element,
    setHead(left, right) {
      headLeft.textContent = left;
      headRight.replaceChildren(el('i', 'dot'), document.createTextNode(right));
    },
    setLabels(left, right) { labelLeft.textContent = left; labelRight.textContent = right; },
    setTicks(positions) {
      ticks.replaceChildren(...positions.map(position => { const tick = el('i'); tick.style.left = `${position * 100}%`; return tick; }));
    },
    run(from, to, ms) {
      last = { from, to, ms, started: performance.now() };
      const run = ++runs;
      place(from, 0);
      // Commit the start position before animating to the end.
      void track.offsetWidth;
      requestAnimationFrame(() => { if (run === runs) place(to, ms); });
    },
  };
}

/** The scrolling text panel of the sculpture screens. Content is laid out twice so the loop is seamless;
 * the speed is constant whatever the length of the text. */
export function textLoop(sections: HTMLElement[], pixelsPerSecond = 15): HTMLElement {
  const panel = el('aside', 'text-loop'), track = el('div', 'text-loop-track');
  const copy = (hidden: boolean) => {
    const group = el('div');
    for (const section of sections) group.append(hidden ? section.cloneNode(true) : section);
    if (hidden) group.setAttribute('aria-hidden', 'true');
    return group;
  };
  const visible = copy(false), duplicate = copy(true);
  track.append(visible, duplicate);
  panel.append(track);
  const pace = () => { const height = visible.offsetHeight; if (height) track.style.setProperty('--loop-seconds', `${Math.round(height / pixelsPerSecond)}s`); };
  requestAnimationFrame(pace);
  document.fonts?.ready.then(pace);
  window.addEventListener('resize', pace);
  return panel;
}

/** The pointer shows while the mouse moves and hides after a few idle seconds, so on the
 * televisions it never rests over the work. */
export function autoHideCursor(ms = 3000): void {
  let timer = 0;
  const wake = () => { document.body.classList.remove('pointer-idle'); window.clearTimeout(timer); timer = window.setTimeout(() => document.body.classList.add('pointer-idle'), ms); };
  document.body.classList.add('pointer-idle');
  window.addEventListener('pointermove', wake, { passive: true });
  window.addEventListener('pointerdown', wake, { passive: true });
}

/** Left and right arrows, on a keyboard or a television remote, step back and forth. */
export function onArrows(step: (direction: 1 | -1) => void): void {
  document.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'PageDown') { event.preventDefault(); step(1); }
    else if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); step(-1); }
  });
}

/** Ask the browser not to dim or sleep the display while the screen runs unattended. */
export function keepAwake(): void {
  const lock = (navigator as Navigator & { wakeLock?: { request(type: 'screen'): Promise<unknown> } }).wakeLock;
  if (!lock) return;
  const request = () => { lock.request('screen').catch(() => { /* Not allowed here: nothing to do. */ }); };
  request();
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') request(); });
}

/** Pause until the next animation frame, or for a delay. */
export const wait = (ms: number) => new Promise<void>(resolve => window.setTimeout(resolve, ms));

/** Read-only URL option, e.g. ?modo=scroll, remembered on this device so it survives reloads. */
export function option(name: string, allowed: readonly string[], fallback: string): string {
  const key = `ybv-pantallas-${name}`;
  const requested = new URLSearchParams(location.search).get(name);
  try {
    if (requested && allowed.includes(requested)) localStorage.setItem(key, requested);
    const stored = localStorage.getItem(key);
    if (stored && allowed.includes(stored)) return stored;
  } catch { /* Private mode: use the URL only. */ }
  return requested && allowed.includes(requested) ? requested : fallback;
}
