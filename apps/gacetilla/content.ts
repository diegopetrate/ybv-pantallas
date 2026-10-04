/** The exhibition's press release («Yellow Blue Vase gacetilla 41026»), as structured content.
 * Wording as in the document; only plain typos were corrected (accents, doubled letters, missing
 * spaces after full stops). */
export type Block =
  /** `footnote` is shown on the same page as the paragraph's FOOTNOTE_MARK, never on the next one. */
  | { kind: 'paragraph'; text: string; footnote?: string }
  | { kind: 'signature'; text: string }
  | { kind: 'technique'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'credits'; label: string; names: string }
  /** Lines that transform step by step, shown in monospace. */
  | { kind: 'steps'; label: string; lines: { text: string; gloss: string }[] };

export interface Artist {
  name: string;
  /** Surname: artists are always listed alphabetically by it. */
  surname: string;
  bio: Block[];
  work: { title: string; blocks: Block[] };
}

/** The footnote call, as written in the press release. */
export const FOOTNOTE_MARK = '(*)';

const p = (text: string, footnote?: string): Block => (footnote ? { kind: 'paragraph', text, footnote } : { kind: 'paragraph', text });

const artistsAsWritten: Artist[] = [
  {
    name: 'Carlos Campos',
    surname: 'Campos',
    bio: [
      p('Carlos Campos es Doctor en Arquitectura por la Universidad de Buenos Aires. Arquitecto, músico contemporáneo, artista multidisciplinar. Curador y diseñador del Pabellón Argentino en la XI Biennale Internazionale di Architettura di Venezia, profesor visitante en diversas universidades en USA, Italia, Alemania, Rusia. Entre ellas: IUAV Venezia, Alma Mater Studiorum Bologna, La Sapienza Roma, Anhalt Dessau, Humboldt Berlin, Vanvitelli Napoli, SOA University of Florida USA, MArchI, Moscú, Jean Monnet St. Ettienne, y otras.'),
      p('Su trabajo se orienta hacia las Traducciones Intersemióticas, el diseño y operación de máquinas de dibujar, y en la experimentación en robótica al servicio de la representación en arquitectura. Actualmente se desempeña como Director de la Carrera de Arquitectura de la UM en CABA.'),
    ],
    work: {
      title: 'Traducciones',
      blocks: [
        p('Las obras presentadas para esta muestra exploran tres circunstancias materiales: un lienzo pintado con grafito y pastel de uno de los ángeles del Puente Vittorio Emmanuelle de Roma, un dibujo realizado por una máquina de dibujar y luego intervenido a mano con trazos de tinta y láminas de oro, y un tríptico: dibujos realizados por una máquina robótica sobre placas de acero, coloreadas y deformadas por el uso de soldadura eléctrica (*).',
          '(*) En colaboración con Carlos Guerrero, estudiante de la ESAD UM. Carlos trabajó en su taller de soldadura siguiendo los trazos de la máquina de dibujar.'),
        p('Las obras comparten algo más que el color amarillo y azul. El ángel es un híbrido humano-no humano: un contenedor metálico vacío que vincula el cielo con la tierra. Una figura hermosa y monstruosa al mismo tiempo. El dibujo generado a partir de un robot (máquina de dibujar) tiene rasgos no humanos, aleatorios, no busca un sentido ni un significado. Sin embargo, el sombreado y la aplicación de color, textura y láminas de oro activa nuestra comprensión, nuestra mente busca conexiones, reconociendo formas arquitectónicas, encontrando alegorías, narraciones, proyectando espacios, vasijas, ángeles.'),
        p('Las placas de acero, robustas, estables, se doblegan frente a la enorme liberación de energía que sigue las líneas de la máquina de dibujar. La enorme energía liberada por la soldadora aporta una deformación incontenible y la sorpresiva aparición del color. Surgen los amarillos y los azules. La placa se deforma, buscando convertirse en contenedor, vasija, ángel. Las sombras y los brillos aleatorios, y de nuevo la aplicación del oro reafirman esta condición inesperada, híbrida, monstruosa, siempre abierta a una interpretación. Las imágenes, como la perla de la joven de Vermeer, como el lenguaje y como el amor, son hermosas construcciones que pertenecen un poco a la mente, un poco a la aleatoriedad.'),
      ],
    },
  },
  {
    name: 'Guigui Kohon',
    surname: 'Kohon',
    bio: [
      p('Guigui Kohon es Arquitecta, UBA. Graduada en Artes y Oficios en la Escola La Massana de Barcelona. Luego de vivir doce años en Barcelona se traslada a Buenos Aires y cursa la Maestría en Comunicación y Creación Cultural en la Fundación W. Benjamin en UCAECE. Profesora Titular Asociada de Diseño de Accesorios (2011-20) Cát. Kweitel-Kohon, Carrera de Diseño de Indumentaria, Universidad de Buenos Aires, UBA FADU.'),
      p('Asiste a Talleres en el C. C. Rojas, el CIA y la Universidad Di Tella. Asiste al Taller de escultura con Terán, de visuales con Bazán, Clínica en Cazadores con Zanella, Barreda y A. Roux. Durante el 2025 participa en Proyecto Púrpura realizando Clínica de obra con Valansi y actualmente con A. Roux. Recibe la Beca “Fin de carrera” BCN. Realiza residencia “Off Massana” en Pueblo Español. Obtiene el Premio Marshall Baja Silesia y el Assembly KGHM Metale de Polonia; el 2º Premio Petrobras Libre Bs. As. Photo y Dibujo Calendario S.C.A.'),
      p('Sus obras han sido preseleccionadas en el Salón Nacional 2026 y seleccionada en: Del piso al techo, homenaje a Ale Vautier, Galería C. Caballero 2025; 51° Salón Nacional MUMBAT, Tandil 2024; XLIII Salón Provincial de Artes Visuales, Salta 2023; VI Artes Plásticas DCOOP, Málaga 2020; V Bienal de Artes Visuales Áreatec 2018; VII Salón de Pintura Vicentin, Sta. Fe 2018; XLIX Félix de Amador 2018; Trienal Art Tallin Omand Posesión Estonia 2001; 2º Festival internacional de investigación artística MUVIM, Valencia 2001; 5ta Ruta d’Art Jove, Premia de Mar 2000; Talente 99, Sonderschau der Internationalen Handwerksmess, Munich 1999 y X Bienal de Jóvenes Europa y Mediterráneo, La Merce 1998. Realiza exposiciones en Suiza, Alemania, Polonia, Estonia, España, Portugal, Estados Unidos, México, Uruguay, Chile y Argentina.'),
    ],
    work: {
      title: 'Antes del sentido',
      blocks: [
        p('¿Un tejido de equívocos puede hacer que un jarrón amarillo azul resuene a una declaración de amor? ¿La huella ancestral de miles de jarrones podría leerse como las miles de torsiones de aquello que no puede escribirse y adentrarnos en la invitación de Nabokov a no leer desde el sentido? Frente a la imposibilidad de decir todo, frente al agujero que bordea la palabra algo insiste y escapa.'),
        p('Así se abre la posibilidad a la dimensión poética, a lo que va más allá del sentido, a lo que resuena en el equívoco: “Yellow blue vase//Te amo” de Nabokov. Las obras de Guigui Kohon nos convidan a ese viaje de resonancias, de hiancias de sentido, de borde, de agujero, de poesía.'),
        { kind: 'signature', text: 'Gradiva Reiter, octubre 2026.' },
      ],
    },
  },
  {
    name: 'Yamila Zÿnda Aiub',
    surname: 'Zÿnda Aiub',
    bio: [
      p('Yamila Zÿnda Aiub es Arquitecta, bailarina y profesora universitaria en FADU, UBA, Curadora y autora del Pabellón Argentino de la XI Biennale di Architettura di Venezia, Italia, su trabajo fue premiado en Argentina y el exterior. Autora del Ícono del Bicentenario Argentino 2020, y numerosos proyectos ligados al ámbito de la cultura. Es titular del estudio ccyza arquitectos, con sede en Buenos Aires.'),
    ],
    work: {
      title: 'Cuando decir es tocar',
      blocks: [
        p('Existe un camino que todos conocemos, que compartimos… el paso del tiempo. El ir y volver a un lugar cercano, no al mismo. Las palabras, la repetición de las frases generan un mantra que se convierte en una meditación, guiada por el recorrido visual de las palabras y su sonido. Las palabras que se cargan con emociones, cuando conocemos la lengua y si no la conocemos, nos transmiten un sonido que sólo nos transporta en el tiempo, a vaciar la mente. En las palabras habita una emoción, que se va generando a lo largo de nuestras vidas, que puede ser diferente para cada uno. Las palabras pueden dañar o curar.'),
        p('En la lejanía se ven letritas que se repiten, se relacionan, se unen, se separan… y cuando nos acercamos podemos identificar que hay palabras que entendemos, si comprendemos el lenguaje. Y el sonido en ruso de я люблю вас (que significa Te amo) se asemeja al sonido en inglés de YELLOW BLUE VASE (que significa florero amarillo, azul). Ambas frases con un significado diferente y una similitud al pronunciarlas. Podemos establecer una transformación fonética y escrita en sílabas, viendo cómo se arma y se desarma esta transición, generando una sutileza en la variación sonora, el ir y volver del sonido, de las palabras.'),
        p('Ambos idiomas toman parte de sus caracteres de la escritura bustrofedónica, el paso del buey, una forma de escribir como el dibujo de la huella que deja el arado al ir y volver. ¿Y qué queda en la palabra dicha? Lo que queda al decir puede acompañarnos toda la vida, transitamos entre la palabra y su sombra.'),
        p('El bustrófedon es un método de escritura antigua en el cual los renglones cambian de dirección de manera alterna: uno va de izquierda a derecha y el siguiente de derecha a izquierda, imitando el movimiento de los bueyes al arar un campo. Viene del griego bous (buey) y strophein (dar la vuelta), lo que significa “dar la vuelta como un buey”.'),
        { kind: 'steps', label: 'Transformación de la frase del ruso al inglés', lines: [
          { text: 'я люблю вас', gloss: 'frase en ruso' },
          { text: 'YA LYUBLYU VAS', gloss: 'fonética en ruso' },
          { text: 'YE LLOWBLUE VASE', gloss: 'similitud fonética en inglés' },
          { text: 'YELLOW BLUE VASE', gloss: 'frase en inglés' },
        ] },
      ],
    },
  },
  {
    name: 'Lorena Bonilla',
    surname: 'Bonilla',
    bio: [
      p('Lorena Bonilla es Diseñadora e investigadora formada en la Universidad de Buenos Aires, especializada en la hibridación de diseño de indumentaria, tecnologías exponenciales y procesos de biofabricación. Su práctica transdisciplinar investiga los sistemas complejos, la corporalidad y la generación de formas vinculantes al cuerpo que disputan los paradigmas de estandarización industrial. Su trayectoria articula la producción científica y académica de frontera en el ámbito público con el desarrollo de proyectos de investigación material.'),
      p('Frontera Académica e Investigación (FADU-UBA): Profesora de las carreras de Diseño de Indumentaria, Industrial y Textil. Doctoranda y Magíster en Diseño Abierto por la Universidad de Buenos Aires en convenio transdisciplinar con la Humboldt-Universität zu Berlin (Alemania). Directora del Proyecto UBACYT en Biodiseño. Obtuvo la beca del Programa UBAINT Doctoral y del Programa Jóvenes Docentes Investigadores (Beca JIN).'),
      p('Alianzas y Cooperación Científica Internacional: Investigadora invitada en BESIGN The Sustainable Design School (Niza, Francia) y colaboradora en el Centro Studi Futuro Continuo de la Università IUAV di Venezia (Italia) en el área de impacto ambiental de sistemas productivos. Coordinadora académica general del Proyecto BioObjetos bajo el programa bilateral de cooperación científica INNOVART (Argentina-Francia) en articulación con la ENSAD París (2023). Autora del libro No Talle. Indagaciones entre el cuerpo, la naturaleza y la tecnología. Una propuesta a los problemas de la moda y compiladora del volumen BioObjetos. Diseño + Ciencia.'),
    ],
    work: {
      title: 'Yellow Blue Vase',
      blocks: [
        { kind: 'technique', text: 'Técnica / Materialidad: Hibridación de biofabricación. Fibras naturales y biomateriales locales: plátano, algas y lana, modelado e impresión tridimensional mediante software computacional sobre soporte de materia sustentable y biodegradable PLA. Proceso vincular a fieltrado y tintes naturales. Ladrillos de micelio.' },
        p('Hay declaraciones de afecto que solo se revelan a través del juego de la forma y el lenguaje. Inspirada en la premisa del “jarrón amarillo y azul” (yellow blue vase) —aquel mensaje que Vladimir Nabokov cifró en 1947 como un anagrama fonético del amor—, esta obra opera como un canal de comunicación secreto entre el espacio y la anatomía.'),
        p('Entendida como un sistema complejo y relacional, la pieza ensaya las nuevas generaciones tecnológicas de un objeto sistémico a través del cruce de biofabricación y corporalidad. A partir de la manipulación de materia sustentable y biodegradable, la propuesta actúa como una Tipología de Indumentaria Única (TIU) que decodifica la homogeneidad ficticia de los cuerpos.'),
        p('Su verdadero secreto reside en la generación de una forma vincular: ese íntimo y delicado pulso que habita la evolución de la anatomía.'),
      ],
    },
  },
  {
    name: 'Alejandro Borrachia',
    surname: 'Borrachia',
    bio: [
      p('Alejandro Borrachia es Arquitecto, Decano de la UM ESAD y Profesor Titular de arquitectura. Conduce el Estudio Borrachia desde el año 2000 con una mirada holística sobre el mundo y la arquitectura. Sus investigaciones y obras, diversas tanto en programas como en escalas, han obtenido una gran cantidad de premios, además de ser expuestas y publicadas en sitios, museos, salas y medios especializados de todo el mundo. Es autor del libro “Nuevas Arquitecturas en un mundo hiperconectado”.'),
    ],
    work: {
      title: '¿Y el amarillo?',
      blocks: [
        p('La anécdota de Nabokov comienza con un desplazamiento. Yellow blue vase, la descripción de una vasija, se transforma por semejanza fonética en ya lyublyu vas: “te amo”. El sonido permanece casi intacto, pero el sentido cambia por completo. Un objeto se convierte en afecto, lo material en inmaterial.'),
        p('La pieza parte de esa transformación. Una trama de líneas azules construye la sombra de una vasija, una especie de fantasma del objeto; porque en realidad no existe una superficie que la defina. No hay un borde preciso ni una separación que construya una diferencia sustancial entre interior y exterior. El espacio atraviesa la pieza y la pieza se confunde con el espacio. La vasija puede verse, pero no puede contener.'),
        p('Contenedor y contenido pierden entonces sus límites. Aquello que debería estar dentro se escapa, y aquello que debería envolverlo apenas consigue definir una forma provisional. La materia construye el límite de algo que no tiene límites.'),
        p('Como el amor en la frase de Nabokov, la vasija oscila entre presencia y ausencia, entre materia y vacío, entre aquello que puede verse y lo que se imagina o se percibe. Parece una cosa y, al mismo tiempo, es casi nada.'),
        p('¿Y el amarillo?'),
      ],
    },
  },
  {
    name: 'Diego Petrate',
    surname: 'Petrate',
    bio: [
      p('Diego Petrate es Arquitecto. Graduado en la UNLP, realizó estudios de posgrado en la Städelschule de Frankfurt y una maestría de arquitectura en UCLA. Trabajó por más de 6 años con Frank Gehry en numerosos proyectos, entre los que se incluyen: el Millenium Park en Chicago, Beekman Tower y las oficinas centrales de US Interactive en Nueva York, Walt Disney Concert Hall en Los Angeles, Le Clos Jordan Winery en Canadá y New World Symphony en Miami.'),
      p('Ha sido profesor de diseño y fabricación digital en la Maestría de Arquitectura del Southern California Institute of Architecture (SCI-Arc) y profesor visitante en las Universidades de Toronto, Utah, Nacional de Mar del Plata y Nacional de La Plata. Actualmente es docente de la facultad de arquitectura de la Universidad Torcuato Di Tella.'),
    ],
    work: {
      title: 'Ya lyublyu vas',
      blocks: [
        p('En una clase en Wellesley, Nabokov encontró sobre su escritorio un jarrón amarillo con flores azules. Escribió en el pizarrón yellow blue vase y explicó a sus alumnas que esas tres palabras inglesas, dichas en voz alta, son también la frase rusa ya lyublyu vas: te quiero.'),
        p('Yellow Blue Vase convierte ese intervalo en materia. La obra no muestra un jarrón: lo está diciendo, a razón de una vuelta por día, durante un mes. El azul es la geografía, la latitud fría de la ciudad que le da origen; el amarillo es el calor que cada lectura de temperatura deposita sobre el tramo que nace en ese instante. La escultura tiene los dos colores del jarrón de Nabokov porque está hecha del clima de un lugar y de un momento, no de una decisión estética.'),
        p('La línea de tiempo es el mecanismo del juego de palabras. La trayectoria directriz se escribe con veinticuatro horas de anticipación, a partir de la luz y el sonido que los teléfonos de los visitantes aportan minuto a minuto. Quien participa nunca ve el efecto de su gesto: lo ve el visitante de mañana. El sentido llega siempre después del sonido que lo produjo. Y como toda declaración dicha en voz alta, no admite corrección retroactiva; solo puede transformarse lo que todavía no existe.'),
        p('Sobre esa única directriz se enroscan dos generatrices, masculina y femenina. Ninguna de las dos es la obra, ni es traducción de la otra: la superficie existe únicamente donde ambas envuelven el mismo recorrido, igual que la frase existe únicamente donde el inglés y el ruso se superponen. Tres espirales entrelazadas para una sola forma.'),
      ],
    },
  },
  {
    name: 'Chiara Scarpitti',
    surname: 'Scarpitti',
    bio: [
      p('Chiara Scarpitti es diseñadora, investigadora y autora transdisciplinaria, y desarrolla su actividad en los ámbitos de la joyería contemporánea, los objetos de diseño y la moda. Es profesora adjunta con plaza permanente (tenure-track) en Diseño en el Departamento de Arquitectura y Diseño Industrial de la Università della Campania «Luigi Vanvitelli».'),
      p('Su práctica explora las dimensiones simbólicas y poéticas de los materiales, los cuerpos y las tecnologías desde un enfoque transdisciplinario que combina tecnologías avanzadas, alta artesanía y teoría. En particular, sus investigaciones más recientes abordan las intersecciones entre las perspectivas humanas y más-que-humanas, las tecnologías y la filosofía.'),
      p('Activa internacionalmente en los campos del diseño y la joyería desde 2006, ha recibido numerosos premios y ha expuesto su trabajo en importantes museos y galerías. Coordina la Comisión Nacional «Design for the Person» del ADI Design Index | Compasso d’Oro y, desde 2019, forma parte del Consejo de Administración de la AGC – Association for Contemporary Jewellery. Ha impartido clases de moda y diseño en el MFI Milan Fashion Institute, el IED Moda Milan, la Academia de Bellas Artes de Nápoles y la Tari Design School. Es autora de numerosos ensayos y de dos monografías, y ha coordinado científicamente diversos proyectos de investigación financiados.'),
    ],
    work: {
      title: 'Fragments of a More-Than-Human Lover’s Discourse',
      blocks: [
        p('Partiendo de la anécdota de Nabokov, el «yellow blue vase» se convierte en «te amo» únicamente por un error de escucha, “ya lyublyu vas”, y a partir de ahí reflexioné sobre este diálogo imaginado entre dos entidades extrañantes. Y entonces, retomando el libro de Barthes Fragmentos de un discurso amoroso, construí este proyecto dedicado al amor no humano y al diálogo posible/imposible que existe entre dos entidades no humanas, precisamente.'),
        p('Fragments of a More-Than-Human Lover’s Discourse. Consiste en seis dípticos enmarcados, cada uno de 16 × 22 × 4 cm, en los que distintos organismos vivos no humanos declaran su amor de una manera inusual e imaginaria.'),
        p('Entre los organismos, elegí:'),
        { kind: 'list', items: [
          'la madreperla que estratifica un cuerpo extraño,',
          'el liquen que corroe la piedra,',
          'la abeja que se alimenta de la orquídea,',
          'las mariquitas que, en simbiosis, habitan los troncos,',
          'una especie de pez que vive gracias a una bacteria luminiscente.',
        ] },
        p('A la izquierda se encuentra quien habla y, a la derecha, quien es amado, con sus respectivos nombres taxonómicos.'),
      ],
    },
  },
];

/** Always in alphabetical order by surname, as in the show's list of artists. */
export const artists: Artist[] = [...artistsAsWritten].sort((a, b) => a.surname.localeCompare(b.surname, 'es'));

export const presentation = {
  title: 'Yellow Blue Vase',
  blocks: [
    p('Es una muestra multidisciplinaria compuesta por arquitectos y diseñadores que muestra el carácter expansivo y poliédrico de nuestras disciplinas. Diseñadores y Arquitectos cuya expresión artística nos hacen reflexionar, mostrando al público y a los estudiantes el alcance de nuestro quehacer. Yellow Blue Vase es una oportunidad para proyectar UM hacia la comunidad, y también una oportunidad de reflexión interna a propósito de nuestras miras, intereses, alcances y repercusiones.'),
    { kind: 'credits', label: 'Artistas que componen la muestra', names: `${artists.map(artist => artist.name).join(', ')}.` },
    { kind: 'credits', label: 'Curaduría', names: 'Carlos Campos.' },
  ] as Block[],
};
