export const wordCount = (text: string) => (text.match(/\S+/g) ?? []).length;

/** Fixed time on screen, as Diego set it: the presentation 7 s, every other page 10 s. */
export const PRESENTATION_SECONDS = 7;
export const PAGE_SECONDS = 10;
export const pageSeconds = (isPresentation: boolean) => (isPresentation ? PRESENTATION_SECONDS : PAGE_SECONDS);

/** Splits a paragraph into sentences, each keeping its closing quotes and the space after it, so that
 * joining the pieces gives back exactly the original text. */
export function sentences(text: string): string[] {
  const pieces = text.match(/[^.!?…]+(?:[.!?…]+|$)[»”)"’]*\s*|[.!?…]+\s*/g);
  return pieces && pieces.join('') === text ? pieces : [text];
}
