import { el, ensembleHeader, horizon, keepAwake, textLoop, wait } from '../../shared/ensemble';
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
const line = horizon();
line.setTicks(diptychs.map((_, index) => index / diptychs.length));
screen.append(ensembleHeader('Chiara Scarpitti', TITLE), stage, textLoop(statementSections), line.element);
keepAwake();

// Load every photograph up front: the sequence never waits on the network once it has started.
for (const diptych of diptychs) { const image = new Image(); image.src = diptych.image; }

let front = 0;
const decoded = (image: HTMLImageElement) => (image.decode ? image.decode() : Promise.resolve()).catch(() => undefined);

/** Cross-fades to a diptych once its photograph is decoded (or after 1.5 s at most, so a slow decode
 * never stalls the sequence), then moves the line to match what is on screen. */
function show(index: number) {
  const diptych = diptychs[index], incoming = layers[1 - front], outgoing = layers[front];
  const image = compose(incoming, diptych);
  Promise.race([decoded(image), wait(1500)]).then(() => {
    incoming.classList.add('shown');
    outgoing.classList.remove('shown');
    front = 1 - front;
    line.setHead('Dípticos', `${pad(index + 1)} / ${pad(diptychs.length)}`);
    line.setLabels(diptych.beloved && diptych.speaker ? `${diptych.speaker} → ${diptych.beloved}` : `${diptych.poem.join(' ')} · ${diptych.attribution ?? ''}`, 'Chiara Scarpitti');
    line.run(index / diptychs.length, (index + 1) / diptychs.length, DIPTYCH_SECONDS * 1000);
    window.setTimeout(() => show((index + 1) % diptychs.length), DIPTYCH_SECONDS * 1000);
  });
}

show(0);
