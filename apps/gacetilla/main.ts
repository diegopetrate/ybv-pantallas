import { autoHideCursor, el, ensembleHeader, horizon, keepAwake, onArrows, option } from '../../shared/ensemble';
import { artists, presentation, type Block } from './content';
import { pageSeconds, sentences, wordCount } from './reading';
import './style.css';

/** ?modo=paginas (default) or ?modo=scroll; ?ritmo=lento|normal|rapido. Both are remembered on the device. */
const MODE = option('modo', ['paginas', 'scroll'], 'paginas');
const PACE = ({ lento: 1.35, normal: 1, rapido: .75 } as Record<string, number>)[option('ritmo', ['lento', 'normal', 'rapido'], 'normal')];

interface Section { group: number; eyebrow: string; title: string; blocks: Block[] }
const groups = ['Presentación', ...artists.map(artist => artist.name)];
const sections: Section[] = [
  { group: 0, eyebrow: 'Presentación', title: presentation.title, blocks: presentation.blocks },
  ...artists.flatMap((artist, index): Section[] => [
    { group: index + 1, eyebrow: `Artista ${index + 1} / ${artists.length}`, title: artist.name, blocks: artist.bio },
    { group: index + 1, eyebrow: `${artist.name} · Obra`, title: artist.work.title, blocks: artist.work.blocks },
  ]),
];

const screen = document.getElementById('screen')!;
screen.classList.add(MODE);
const pad = (n: number) => String(n).padStart(2, '0');

function renderBlock(block: Block): HTMLElement {
  switch (block.kind) {
    case 'paragraph': return el('p', undefined, block.text);
    case 'note': return el('p', 'note', block.text);
    case 'signature': return el('p', 'signature', block.text);
    case 'technique': return el('p', 'technique', block.text);
    case 'list': { const list = el('ul'); for (const item of block.items) list.append(el('li', undefined, item)); return list; }
    case 'credits': { const credits = el('div', 'credits'); credits.append(el('span', 'eyebrow', block.label), el('p', 'names', block.names)); return credits; }
    case 'steps': {
      const steps = el('div', 'steps'), list = el('ol');
      for (const line of block.lines) { const item = el('li'); item.append(el('b', undefined, line.text), el('small', undefined, line.gloss)); list.append(item); }
      steps.append(el('span', 'eyebrow', block.label), list);
      return steps;
    }
  }
}
const splittable = (node: HTMLElement) => node.tagName === 'P' && !node.classList.contains('signature');

/** What the visitor's gestures do; each mode fills these in. Whatever the gesture, the loop then
 * carries on by itself from the chosen point. */
const controls = {
  /** Dragging the line: `final` when it is released. */
  seek: (_fraction: number, _final: boolean) => {},
  /** A name in the index. */
  jump: (_group: number) => {},
  /** Arrow keys or the television remote. */
  step: (_direction: 1 | -1) => {},
};

// Index of the show on the left: the current artist is lit, as the live dot of the sculpture screens.
// Each name opens that artist.
const index = el('nav', 'index');
const indexItems = groups.map((name, i) => {
  const item = el('button', i === 0 ? 'index-item intro' : 'index-item', name);
  item.type = 'button';
  item.addEventListener('click', () => controls.jump(i));
  index.append(item);
  return item;
});
const highlight = (group: number) => indexItems.forEach((item, i) => item.classList.toggle('current', i === group));

const line = horizon({ onSeek: (fraction, final) => controls.seek(fraction, final) });
screen.append(ensembleHeader('Muestra multidisciplinaria', 'Propuesta y curaduría · Carlos Campos y Guigui Kohon'), index, line.element);
keepAwake();
autoHideCursor();
onArrows(direction => controls.step(direction));

function heading(section: Section, part: number, parts: number) {
  const head = el('div', 'page-head');
  head.append(el('p', 'eyebrow', parts > 1 ? `${section.eyebrow} · ${part} / ${parts}` : section.eyebrow), el('h2', undefined, section.title));
  return head;
}

/* ---------- Pages ---------- */

interface Page { section: Section; part: number; parts: number; columns: HTMLElement[][]; words: number; seconds: number }

/** Lays the text into pages of two columns that fit the screen exactly. A paragraph that does not
 * fit is cut between sentences (or words, for a single long sentence) and continues in the next column. */
function paginate(area: HTMLElement): Page[] {
  // The probe is a hidden page with both columns, so the first one has a real column's width.
  const probe = el('article', 'page measuring'), columns = el('div', 'columns'), column = el('div', 'column');
  columns.append(column, el('div', 'column'));
  area.append(probe);
  const pages: Page[] = [];
  for (const section of sections) {
    probe.replaceChildren(heading(section, 2, 2), columns);
    const capacity = columns.clientHeight;
    const sectionPages: HTMLElement[][][] = [];
    let current: HTMLElement[][] = [[], []], slot = 0;
    const queue = section.blocks.map(renderBlock);
    const fits = () => column.scrollHeight <= capacity + 1;
    const nextColumn = () => { slot++; column.replaceChildren(); if (slot > 1) { sectionPages.push(current); current = [[], []]; slot = 0; } };
    column.replaceChildren();
    while (queue.length) {
      const node = queue.shift()!;
      column.append(node);
      if (fits()) { current[slot].push(node); continue; }
      node.remove();
      const empty = column.childElementCount === 0;
      if (splittable(node)) {
        const pieces = sentences(node.textContent ?? '');
        const units = pieces.length > 1 ? pieces : (node.textContent ?? '').match(/\S+\s*/g) ?? [];
        let taken = 0;
        const trial = node.cloneNode() as HTMLElement;
        column.append(trial);
        while (taken < units.length) { trial.textContent = units.slice(0, taken + 1).join('').trimEnd(); if (!fits()) break; taken++; }
        trial.remove();
        if (taken > 0) {
          const head = node.cloneNode() as HTMLElement, rest = node.cloneNode() as HTMLElement;
          head.textContent = units.slice(0, taken).join('').trimEnd();
          rest.textContent = units.slice(taken).join('').trimStart();
          current[slot].push(head);
          queue.unshift(rest);
          nextColumn();
          continue;
        }
      }
      if (empty) { current[slot].push(node); nextColumn(); continue; } // Too tall even alone: let it run.
      queue.unshift(node);
      nextColumn();
    }
    if (current[0].length || current[1].length) sectionPages.push(current);
    sectionPages.forEach((cols, i) => {
      const words = wordCount(section.title) + cols.flat().reduce((sum, node) => sum + wordCount(node.textContent ?? ''), 0);
      pages.push({ section, part: i + 1, parts: sectionPages.length, columns: cols, words, seconds: pageSeconds(section.group === 0) * PACE });
    });
  }
  probe.remove();
  return pages;
}

function runPages() {
  const area = el('section', 'pages'), layers = [el('article', 'page'), el('article', 'page')];
  area.append(...layers);
  screen.append(area);
  let pages: Page[] = [], current = -1, front = 0, timer = 0;
  const total = () => pages.reduce((sum, page) => sum + page.seconds, 0);
  const startOf = (i: number) => pages.slice(0, i).reduce((sum, page) => sum + page.seconds, 0);

  /** Shows page i. While the line is being dragged (`playing` false) the page changes but the clock
   * waits; otherwise the line runs and the next page follows on its own. */
  const show = (i: number, playing = true) => {
    const page = pages[i], incoming = layers[1 - front], outgoing = layers[front];
    const columns = el('div', 'columns');
    for (const nodes of page.columns) { const column = el('div', 'column'); for (const node of nodes) column.append(node.cloneNode(true)); columns.append(column); }
    incoming.replaceChildren(heading(page.section, page.part, page.parts), columns);
    incoming.classList.add('shown');
    outgoing.classList.remove('shown');
    front = 1 - front;
    current = i;
    highlight(page.section.group);
    const next = pages[(i + 1) % pages.length];
    line.setHead('Gacetilla', `${pad(i + 1)} / ${pad(pages.length)}`);
    line.setLabels(groups[page.section.group], next.section.group !== page.section.group ? `Sigue · ${groups[next.section.group]}` : 'Continúa');
    window.clearTimeout(timer);
    if (!playing) return;
    line.run(startOf(i) / total(), (startOf(i) + page.seconds) / total(), page.seconds * 1000);
    timer = window.setTimeout(() => show((i + 1) % pages.length), page.seconds * 1000);
  };
  const pageAt = (fraction: number) => { const time = fraction * total(); for (let i = 0; i < pages.length; i++) if (startOf(i + 1) > time) return i; return pages.length - 1; };
  controls.seek = (fraction, final) => {
    screen.classList.toggle('scrubbing', !final);
    const i = pageAt(fraction);
    if (final) show(i); else if (i !== current) show(i, false);
  };
  controls.jump = group => { const i = pages.findIndex(page => page.section.group === group); if (i >= 0) show(i); };
  controls.step = direction => show((current + direction + pages.length) % pages.length);

  /** Paginates for the current screen size; after a resize, reading resumes at the same section. */
  const layout = (resume?: Section) => {
    pages = paginate(area);
    const groupStarts = groups.map((_, group) => pages.findIndex(page => page.section.group === group)).filter(i => i >= 0);
    line.setTicks(groupStarts.map(i => startOf(i) / total()));
    show(Math.max(0, resume ? pages.findIndex(page => page.section === resume) : 0));
  };
  let resizeTimer = 0;
  window.addEventListener('resize', () => { window.clearTimeout(resizeTimer); resizeTimer = window.setTimeout(() => layout(pages[current]?.section), 400); });
  layout();
  // Development only: step through the pages to check the layout without waiting for the cycle.
  if (import.meta.env.DEV) Object.assign(window, { gacetilla: { pages: () => pages, show } });
}

/* ---------- Scroll ---------- */

function runScroll() {
  const area = el('section', 'scroller'), track = el('div', 'scroll-track');
  const copy = (hidden: boolean) => {
    const group = el('div', 'scroll-copy');
    if (hidden) group.setAttribute('aria-hidden', 'true');
    for (const section of sections) {
      const block = el('article', 'scroll-section');
      block.dataset.group = String(section.group);
      block.append(heading(section, 1, 1), ...section.blocks.map(renderBlock));
      group.append(block);
    }
    return group;
  };
  const visible = copy(false);
  track.append(visible, copy(true));
  area.append(track);
  screen.append(area);
  const sectionsInView = [...visible.querySelectorAll<HTMLElement>('.scroll-section')];

  let seconds = 600, started = performance.now(), groupStarts: number[] = [];
  /** Moves the text to a fraction of the loop and lets it carry on from there. */
  const scrollTo = (fraction: number, final: boolean) => {
    track.style.animation = 'none';
    void track.offsetHeight;
    track.style.animation = '';
    track.style.animationDuration = `${seconds}s`;
    track.style.animationDelay = `${-fraction * seconds}s`;
    started = performance.now() - fraction * seconds * 1000;
    if (final) line.run(fraction, 1, (1 - fraction) * seconds * 1000);
  };
  /** Where the text is in its loop, read from the scroll animation itself when the browser exposes it,
   * so the line and the lit name stay in step even if the browser paused the page for a while. */
  const position = () => {
    const animation = track.getAnimations?.()[0];
    // A jump starts the animation with a negative delay, which counts as time already scrolled.
    const time = animation && typeof animation.currentTime === 'number' ? animation.currentTime - (Number(animation.effect?.getTiming().delay) || 0) : performance.now() - started;
    return (time / 1000 % seconds) / seconds;
  };
  controls.seek = (fraction, final) => scrollTo(fraction, final);
  controls.jump = group => { if (groupStarts[group] !== undefined) scrollTo(groupStarts[group], true); };
  controls.step = direction => {
    const now = position(), starts = groupStarts.filter(value => value !== undefined);
    const target = direction > 0 ? starts.find(start => start > now + .002) ?? 0 : [...starts].reverse().find(start => start < now - .01) ?? starts[starts.length - 1];
    scrollTo(target, true);
  };
  const pace = () => {
    const height = visible.offsetHeight, vh = window.innerHeight / 100;
    // Reading pace: about a tenth of a line height per second keeps roughly three words a second.
    const pixelsPerSecond = 1.05 * vh / PACE;
    seconds = Math.max(60, height / pixelsPerSecond);
    track.style.animationDuration = `${seconds}s`;
    const offsets = sectionsInView.map(section => section.offsetTop / height);
    groupStarts = groups.map((_, group) => offsets[sectionsInView.findIndex(section => Number(section.dataset.group) === group)]);
    line.setTicks(groupStarts.filter(value => value !== undefined));
    started = performance.now();
    line.run(0, 1, seconds * 1000);
  };
  track.addEventListener('animationiteration', () => { started = performance.now(); line.run(0, 1, seconds * 1000); });
  document.fonts?.ready.then(pace);
  window.addEventListener('resize', pace);
  pace();

  // Light the section being read (a third of the way down the view) and name the next one.
  window.setInterval(() => {
    const reading = position() * visible.offsetHeight + area.clientHeight * .33;
    let currentIndex = 0;
    sectionsInView.forEach((section, i) => { if (section.offsetTop <= reading) currentIndex = i; });
    const group = Number(sectionsInView[currentIndex].dataset.group), nextGroup = (group + 1) % groups.length;
    highlight(group);
    line.setHead('Gacetilla', 'Lectura continua');
    line.setLabels(groups[group], `Sigue · ${groups[nextGroup]}`);
  }, 500);
}

// Measure only once the fonts are in, or the pages would be cut for the fallback font.
(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => (MODE === 'scroll' ? runScroll() : runPages()));
