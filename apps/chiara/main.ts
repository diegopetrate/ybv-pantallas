import { autoHideCursor, el, ensembleHeader, horizon, keepAwake, onArrows, textLoop, wait } from '../../shared/ensemble';
import { DIPTYCH_SECONDS, TITLE, diptychs, statements, type Diptych } from './content';
import './style.css';

const screen = document.getElementById('screen')!;
const pad = (n: number) => String(n).padStart(2, '0');

/** One diptych, recomposed on the dark ground of the exhibition: the lover's words on the left, the
 * beloved on the right, as in the artist's frames. */
function compose(article: HTMLElement, diptych: Diptych): HTMLImageElement {
  const voice = el('div', 'voice');
  if (diptych.speaker) voice.append(el('p', 'speaker', diptych.speaker));
  const poem = el('blockquote', 'poem');
  diptych.poem.forEach((line, index) => {
    const row = el('span', 'line');
    if (index === 0) row.append(el('span', 'quote open', '“'));
    row.append(document.createTextNode(line));
    if (index === diptych.poem.length - 1) row.append(el('span', 'quote close', '”'));
    poem.append(row);
  });
  voice.append(poem);
  if (diptych.attribution) voice.append(el('p', 'attribution', diptych.attribution));

  const figure = el('figure', 'beloved'), image = el('img');
  image.src = diptych.image;
  image.alt = diptych.beloved ?? diptych.poem.join(' ');
  image.decoding = 'async';
  figure.append(image);
  if (diptych.beloved) figure.append(el('figcaption', undefined, diptych.beloved));
  article.replaceChildren(voice, figure);
  return image;
}

const statementSections = statements.map(statement => {
  const section = el('section');
  section.lang = statement.language === 'Italiano' ? 'it' : statement.language === 'English' ? 'en' : 'es';
  const list = el('ul');
  for (const organism of statement.organisms) list.append(el('li', undefined, organism));
  section.append(el('p', 'eyebrow', statement.language), el('h2', undefined, TITLE), ...statement.paragraphs.map(text => el('p', undefined, text)), list, el('p', undefined, statement.closing));
  return section;
});

const stage = el('section', 'diptych-stage');
const layers = [el('article', 'diptych'), el('article', 'diptych')];
stage.append(...layers);
// Dragging the line picks a diptych; on release the sequence carries on from it.
const line = horizon({
  onSeek: (fraction, final) => {
    const index = Math.min(diptychs.length - 1, Math.floor(fraction * diptychs.length));
    screen.classList.toggle('scrubbing', !final);
    if (final) show(index); else if (index !== current) show(index, false);
  },
});
line.setTicks(diptychs.map((_, index) => index / diptychs.length));
screen.append(ensembleHeader('Chiara Scarpitti', TITLE), stage, textLoop(statementSections), line.element);
keepAwake();
autoHideCursor();
onArrows(direction => show((current + direction + diptychs.length) % diptychs.length));

// Load every photograph up front: the sequence never waits on the network once it has started.
for (const diptych of diptychs) { const image = new Image(); image.src = diptych.image; }

let front = 0, current = 0, timer = 0, request = 0;
const decoded = (image: HTMLImageElement) => (image.decode ? image.decode() : Promise.resolve()).catch(() => undefined);

/** Cross-fades to a diptych once its photograph is decoded (or after 1.5 s at most, so a slow decode
 * never stalls the sequence), then moves the line to match what is on screen. While the line is being
 * dragged (`playing` false) the clock waits; a newer request always wins over a slower older one. */
function show(index: number, playing = true) {
  const diptych = diptychs[index], incoming = layers[1 - front], outgoing = layers[front], ticket = ++request;
  window.clearTimeout(timer);
  current = index;
  const image = compose(incoming, diptych);
  Promise.race([decoded(image), wait(1500)]).then(() => {
    if (ticket !== request) return;
    incoming.classList.add('shown');
    outgoing.classList.remove('shown');
    front = 1 - front;
    line.setHead('Dípticos', `${pad(index + 1)} / ${pad(diptychs.length)}`);
    line.setLabels(diptych.beloved && diptych.speaker ? `${diptych.speaker} → ${diptych.beloved}` : `${diptych.poem.join(' ')} · ${diptych.attribution ?? ''}`, 'Chiara Scarpitti');
    if (!playing) return;
    line.run(index / diptychs.length, (index + 1) / diptychs.length, DIPTYCH_SECONDS * 1000);
    timer = window.setTimeout(() => show((index + 1) % diptychs.length), DIPTYCH_SECONDS * 1000);
  });
}

show(0);
