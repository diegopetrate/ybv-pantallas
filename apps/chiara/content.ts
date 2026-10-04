/** Chiara Scarpitti, «Fragments of a More-Than-Human Lover's Discourse»: the cover and the five
 * diptychs of «Sequenza Dialoghi – Progetto Vladimir Nabokov». On the left speaks the lover, on the
 * right is the beloved, each with their taxonomic name. Poems as in the artist's diptychs. */
export interface Diptych {
  /** Who speaks (left panel, top). */
  speaker?: string;
  /** Attribution under the words (the cover). */
  attribution?: string;
  poem: string[];
  /** Who is loved (right panel, under the photograph). */
  beloved?: string;
  image: string;
}

export const DIPTYCH_SECONDS = 10;

/** Photographs are served from this screen's own path on the site (e.g. /app2/obras/…). */
const photo = (file: string) => `${import.meta.env.BASE_URL}obras/${file}`;

export const diptychs: Diptych[] = [
  { poem: ['ya lyublyu vas'], attribution: 'Vladimir Nabokov', image: photo('01-ya-lyublyu-vas.jpg') },
  { speaker: 'Pinctada margaritifera', poem: ['Ho ingoiato', 'il tuo corpo', 'per farti risplendere.', 'Strato su strato'], beloved: 'Arena', image: photo('02-pinctada-margaritifera.jpg') },
  { speaker: 'Xanthoria parietina', poem: ['Consumo', 'la tua superficie.', 'È l’unico modo', 'per restarti dentro'], beloved: 'Saxum', image: photo('03-xanthoria-parietina.jpg') },
  { speaker: 'Coccinella septempunctata', poem: ['Mille corpi', 'in una fessura.', 'Non bastiamo', 'in due'], beloved: 'Cortex', image: photo('04-coccinella-septempunctata.jpg') },
  { speaker: 'Eucera longicornis', poem: ['Ti ho cercata', 'tutta la primavera.', 'Me ne vado', 'piena di te'], beloved: 'Ophrys apifera', image: photo('05-eucera-longicornis.jpg') },
  { speaker: 'Aliivibrio fischeri', poem: ['Il tuo ventre', 'è luce,', 'e vita', 'nell’abisso'], beloved: 'Euprymna scolopes', image: photo('06-aliivibrio-fischeri.jpg') },
];

export const TITLE = 'Fragments of a More-Than-Human Lover’s Discourse';

export interface Statement { language: string; paragraphs: string[]; organisms: string[]; closing: string }

/** The artist's statement, as provided, in the order the panel scrolls through it. */
export const statements: Statement[] = [
  {
    language: 'Italiano',
    paragraphs: [
      'Partendo dall’aneddoto di Nabokov, il «vaso giallo blu» diventa «ti amo» solo per un errore di ascolto “ya lyublyu vas” e ho riflettuto su questo dialogo immaginato tra due entità stranianti.',
      'E allora, rifacendomi al libro di Barthes “Frammenti di un discorso amoroso”, ho costruito questo progetto dedicato all’amore non umano e al dialogo possibile/impossibile che esiste tra due entità non umane, appunto.',
      'Il titolo del lavoro è: Fragments of a More-Than-Human Lover’s Discourse',
      'Consiste in sei dittici impaginati in cornici, ciascuno delle dimensioni di 16 x 22 x 4 cm, in cui diversi organismi viventi non umani dichiarano il loro amore, in una maniera inconsueta e immaginaria.',
      'Tra gli organismi, ho scelto:',
    ],
    organisms: [
      'la madreperla che stratifica un corpo estraneo,',
      'il lichene che corrode la pietra,',
      'l’ape che si nutre dell’orchidea,',
      'le coccinelle che in simbiosi popolano i tronchi,',
      'una specie di pesce che vive grazie a un batterio luminescente.',
    ],
    closing: 'A sinistra trovi chi parla, a destra chi è amato, con i rispettivi nomi tassonomici.',
  },
  {
    language: 'English',
    paragraphs: [
      'Starting from Nabokov’s tale, the “yellow blue vase” becomes “I love you” only through a mishearing “ya lyublyu vas”, and I began to reflect on this imagined dialogue between two estranging entities.',
      'And so, drawing on Barthes’ book A Lover’s Discourse: Fragments, I developed this project devoted to non-human love and to the possible/impossible dialogue that exists between two non-human entities, precisely.',
      'The title of my work is: Fragments of a More-Than-Human Lover’s Discourse',
      'The work consists of six diptychs, mounted and framed, each measuring 16 × 22 × 4 cm, in which different non-human living organisms declare their love for one another in an unusual and imaginary way.',
      'Among the organisms, I chose:',
    ],
    organisms: [
      'mother-of-pearl, which layers itself around a foreign body,',
      'lichen, which corrodes stone,',
      'the bee, which feeds on the orchid,',
      'ladybirds, which inhabit tree trunks in symbiosis,',
      'a species of fish that lives thanks to a bioluminescent bacterium.',
    ],
    closing: 'On the left is the speaker, and on the right, the beloved, each identified by their respective taxonomic names.',
  },
  {
    language: 'Español',
    paragraphs: [
      'Partiendo de la anécdota de Nabokov, el «yellow blue vase» se convierte en «te amo» únicamente por un error de escucha, “ya lyublyu vas”, y a partir de ahí reflexioné sobre este diálogo imaginado entre dos entidades extrañantes.',
      'Y entonces, retomando el libro de Barthes Fragmentos de un discurso amoroso, construí este proyecto dedicado al amor no humano y al diálogo posible/imposible que existe entre dos entidades no humanas, precisamente.',
      'El título de la obra es: Fragments of a More-Than-Human Lover’s Discourse',
      'Consiste en seis dípticos enmarcados, cada uno de 16 × 22 × 4 cm, en los que distintos organismos vivos no humanos declaran su amor de una manera inusual e imaginaria.',
      'Entre los organismos, elegí:',
    ],
    organisms: [
      'la madreperla que estratifica un cuerpo extraño,',
      'el liquen que corroe la piedra,',
      'la abeja que se alimenta de la orquídea,',
      'las mariquitas que, en simbiosis, habitan los troncos,',
      'una especie de pez que vive gracias a una bacteria luminiscente.',
    ],
    closing: 'A la izquierda se encuentra quien habla y, a la derecha, quien es amado, con sus respectivos nombres taxonómicos.',
  },
];
