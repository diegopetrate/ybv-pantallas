import test from 'node:test';
import assert from 'node:assert/strict';
import { pageSeconds, sentences, wordCount } from '../apps/gacetilla/reading.ts';
import { FOOTNOTE_MARK, artists, presentation, type Block } from '../apps/gacetilla/content.ts';

const texts = (blocks: Block[]) => blocks.flatMap(block => 'text' in block ? [block.text] : []);
const allTexts = [...texts(presentation.blocks), ...artists.flatMap(artist => [...texts(artist.bio), ...texts(artist.work.blocks)])];

test('cutting any paragraph of the press release into sentences never loses or changes a character', () => {
  assert.ok(allTexts.length > 30);
  for (const text of allTexts) assert.equal(sentences(text).join(''), text);
});

test('long paragraphs offer several places to break', () => {
  const longest = allTexts.reduce((a, b) => (b.length > a.length ? b : a));
  assert.ok(sentences(longest).length >= 4);
  assert.deepEqual(sentences('¿Y el amarillo?'), ['¿Y el amarillo?']);
  assert.deepEqual(sentences('Uno. Dos… “Tres.” Cuatro'), ['Uno. ', 'Dos… ', '“Tres.” ', 'Cuatro']);
});

test('the presentation stays 7 seconds and every other page 20, whatever its length', () => {
  assert.equal(wordCount('  la palabra y su  sombra '), 5);
  assert.equal(pageSeconds(true), 7);
  assert.equal(pageSeconds(false), 20);
});

test('every artist of the show has a biography and a work', () => {
  assert.equal(artists.length, 7);
  for (const artist of artists) { assert.ok(artist.bio.length > 0, artist.name); assert.ok(artist.work.title && artist.work.blocks.length > 0, artist.name); }
});

test('artists are always in alphabetical order by surname, matching the credits of the show', () => {
  const surnames = artists.map(artist => artist.surname);
  assert.deepEqual(surnames, [...surnames].sort((a, b) => a.localeCompare(b, 'es')));
  assert.deepEqual(artists.map(artist => artist.name), ['Lorena Bonilla', 'Alejandro Borrachia', 'Carlos Campos', 'Guigui Kohon', 'Diego Petrate', 'Chiara Scarpitti', 'Yamila Zÿnda Aiub']);
  const credits = presentation.blocks.find(block => block.kind === 'credits');
  assert.equal(credits && 'names' in credits ? credits.names : '', `${artists.map(artist => artist.name).join(', ')}.`);
});

test('a footnote is called once by its paragraph, and no cut can split the mark', () => {
  const called = artists.flatMap(artist => [...artist.bio, ...artist.work.blocks]).filter(block => block.kind === 'paragraph' && block.footnote);
  assert.equal(called.length, 1);
  for (const block of called) {
    if (block.kind !== 'paragraph') continue;
    assert.equal(block.text.split(FOOTNOTE_MARK).length, 2);
    assert.ok(block.footnote?.startsWith(FOOTNOTE_MARK));
    assert.equal(sentences(block.text).filter(piece => piece.includes(FOOTNOTE_MARK)).length, 1);
    assert.equal((block.text.match(/\S+\s*/g) ?? []).filter(word => word.includes(FOOTNOTE_MARK)).length, 1);
  }
});
