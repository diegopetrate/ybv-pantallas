/** Words a visitor reads per second standing in front of a screen (about 160 a minute). */
export const WORDS_PER_SECOND = 2.7;

export const wordCount = (text: string) => (text.match(/\S+/g) ?? []).length;

/** Time a page stays on screen: a moment to find the start, then the words at reading pace. */
export const pageSeconds = (words: number) => Math.min(120, Math.max(12, 6 + words / WORDS_PER_SECOND));

/** Splits a paragraph into sentences, each keeping its closing quotes and the space after it, so that
 * joining the pieces gives back exactly the original text. */
export function sentences(text: string): string[] {
  const pieces = text.match(/[^.!?…]+(?:[.!?…]+|$)[»”)"’]*\s*|[.!?…]+\s*/g);
  return pieces && pieces.join('') === text ? pieces : [text];
}
