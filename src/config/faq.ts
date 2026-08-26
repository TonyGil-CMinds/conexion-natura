/**
 * Preguntas frecuentes. Fuera de los componentes, como el resto del copy.
 *
 * El orden es el de publicación: la primera abierta por defecto es la que da
 * contexto al resto.
 */
export type FaqItem = {
  /** Identificador estable: sirve de ancla y de clave de estado. */
  id: string;
  question: string;
  answer: string;
};

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    id: 'cuando',
    question: '¿Cuándo se realizará el evento?',
    answer:
      'El foro se llevará a cabo el lunes 5 de octubre de 2026, en Quito, Ecuador.',
  },
  {
    id: 'horario',
    question: '¿Cuál será el horario?',
    answer:
      'El evento tendrá lugar de 5:00 PM a 9:00 PM. El registro de asistentes comenzará a partir de las 4:30 PM.',
  },
  {
    id: 'organiza',
    question: '¿Quién organiza el evento?',
    answer:
      'El foro es organizado por NaturaTech LAC, iniciativa multi-donante liderada por C Minds, con apoyo del BID Lab, el Gobierno de Francia, el Fondo Amazónico MDTF y Sida/Suecia.',
  },
  {
    id: 'objetivo',
    question: '¿Cuál es el objetivo del foro?',
    answer:
      'El encuentro busca posicionar la biodiversidad, la diversidad cultural y el capital natural de América Latina y el Caribe como motores de innovación, emprendimiento, inversión y desarrollo de economías más resilientes y regenerativas.',
  },
  {
    id: 'participantes',
    question: '¿Quiénes participarán?',
    answer:
      'El foro reunirá a representantes de gobiernos, comunidades indígenas, emprendimientos, banca de desarrollo, filantropía, tecnología y sector privado, generando un espacio multisectorial para el diálogo y la construcción de alianzas.',
  },
  {
    id: 'formato',
    question: '¿Cuál será el formato del evento?',
    answer:
      'Será un foro de tarde que combinará plenarias de alto nivel, paneles multisectoriales, conversaciones estratégicas, un acto de reconocimiento a iniciativas destacadas y un cóctel de cierre.',
  },
  {
    id: 'publico',
    question: '¿El evento está abierto al público?',
    answer:
      'Sí. El foro será abierto al público, sujeto al aforo y al proceso de registro establecido por la organización.',
  },
  {
    id: 'aforo',
    question: '¿Cuál es el aforo esperado?',
    answer: 'Se espera la participación de aproximadamente 150 personas.',
  },
  {
    id: 'idiomas',
    question: '¿En qué idiomas se desarrollará?',
    answer:
      'Las actividades podrán realizarse en español e inglés. Se contempla la posibilidad de contar con traducción simultánea, aunque no es un requisito indispensable para el desarrollo del evento.',
  },
  {
    id: 'alimentos',
    question: '¿Habrá alimentos y bebidas?',
    answer:
      'Sí. Se contempla un coffee break de bienvenida y un cóctel de cierre, ambos dentro del venue.',
  },
  {
    id: 'natura500',
    question: '¿Qué es Natura500 y qué papel tendrá durante el evento?',
    answer:
      'Natura500 es una convocatoria regional enfocada en identificar y visibilizar empresas e iniciativas que forman parte de la economía de la naturaleza en América Latina y el Caribe. Durante el foro se realizará un acto de reconocimiento a las iniciativas ganadoras, seguido de un cóctel de celebración.',
  },
  {
    id: 'quito',
    question: '¿Por qué se realiza el evento en Quito?',
    answer:
      'El encuentro busca posicionar a Quito como un nodo regional para el diálogo, la colaboración y la innovación alrededor de la biodiversidad, la cultura y las economías del futuro.',
  },
  {
    id: 'cop17',
    question: '¿Cómo se relaciona el foro con la COP17?',
    answer:
      'El evento forma parte de las conversaciones y acciones en el camino hacia la COP17 de Biodiversidad, que se celebrará en Armenia en octubre de 2026, promoviendo desde América Latina y el Caribe nuevas alianzas, modelos de inversión y soluciones vinculadas con la naturaleza.',
  },
  {
    id: 'get-forum',
    question: '¿Cómo se relaciona con el GET Forum del BID Lab?',
    answer:
      'El foro se realizará el 5 de octubre de 2026, un día antes del GET Forum del BID Lab, creando un espacio complementario para reunir al ecosistema regional de innovación, inversión y biodiversidad en Quito.',
  },
];

/** Rótulo de la sección. */
export const FAQ_TITLE = 'FAQ';
