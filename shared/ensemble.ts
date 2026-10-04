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

/** The Memory line of the sculpture screens, reused as this screen's progress. */
export function horizon(): Horizon {
  const element = el('footer', 'horizon');
  const head = el('div', 'horizon-head'), headLeft = el('span'), headRight = el('span', 'live');
  head.append(headLeft, headRight);
  const track = el('div', 'horizon-track'), ticks = el('div', 'horizon-ticks'), fill = el('div', 'horizon-fill'), thumb = el('div', 'horizon-thumb');
  track.append(ticks, fill, thumb);
  const labels = el('div', 'horizon-labels'), labelLeft = el('span'), labelRight = el('span');
  labels.append(labelLeft, labelRight);
  element.append(head, track, labels);

  let last = { from: 0, to: 0, ms: 0, started: 0 };
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
      place(from, 0);
      // Commit the start position before animating to the end.
      void track.offsetWidth;
      requestAnimationFrame(() => place(to, ms));
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
