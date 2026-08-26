/**
 * Ponentes.
 *
 * Datos de relleno hasta que exista el endpoint. La forma del tipo es la que
 * importa: cuando llegue la API, lo único que cambia es de dónde sale el array —
 * `SPEAKERS` pasa a ser el resultado de un `fetch` en el componente de servidor y
 * la lista no se entera.
 */
export type SpeakerSession = {
  id: string;
  title: string;
};

export type Speaker = {
  id: string;
  /** Nombre y apellidos por separado: el diseño los pinta con distinto peso. */
  firstName: string;
  lastName: string;
  role: string;
  organization: string;
  /** Enlace a la organización; si falta, el nombre se muestra sin enlazar. */
  organizationUrl?: string;
  linkedinUrl?: string;
  sessions: readonly SpeakerSession[];
  /** Retrato recortado sobre fondo de color. Falta mientras sean datos de relleno. */
  photo?: string;
};

export const SPEAKERS_TITLE = 'Todos los ponentes';

export const SPEAKERS: readonly Speaker[] = [
  {
    id: 'regina-cervera',
    firstName: 'Regina',
    lastName: 'Cervera',
    role: 'Jefa de programas de innovación',
    organization: 'C Minds',
    organizationUrl: 'https://www.cminds.co',
    linkedinUrl: 'https://www.linkedin.com',
    sessions: [
      { id: 's1', title: 'Panel de bioregiones en la naturaleza y las economías del futuro' },
    ],
  },
  {
    id: 'mateo-vargas',
    firstName: 'Mateo',
    lastName: 'Vargas',
    role: 'Director de inversión de impacto',
    organization: 'BID Lab',
    organizationUrl: 'https://bidlab.org',
    linkedinUrl: 'https://www.linkedin.com',
    sessions: [
      { id: 's2', title: 'Capital natural como motor de nuevas economías' },
      { id: 's3', title: 'Conversación estratégica: financiamiento para la biodiversidad' },
    ],
  },
  {
    id: 'lucia-ordonez',
    firstName: 'Lucía',
    lastName: 'Ordóñez',
    role: 'Coordinadora de bioeconomía',
    organization: 'Fondo Amazónico',
    linkedinUrl: 'https://www.linkedin.com',
    sessions: [{ id: 's4', title: 'Bioeconomía amazónica: de la parcela al mercado' }],
  },
  {
    id: 'andres-quispe',
    firstName: 'Andrés',
    lastName: 'Quispe',
    role: 'Líder de comunidades y territorio',
    organization: 'Amazonía Viva',
    linkedinUrl: 'https://www.linkedin.com',
    sessions: [
      { id: 's5', title: 'Saberes indígenas y diseño de política pública' },
    ],
  },
  {
    id: 'camila-restrepo',
    firstName: 'Camila',
    lastName: 'Restrepo',
    role: 'Fundadora',
    organization: 'Natura500',
    organizationUrl: 'https://www.cminds.co',
    linkedinUrl: 'https://www.linkedin.com',
    sessions: [
      { id: 's6', title: 'Reconocimiento a iniciativas de la economía de la naturaleza' },
    ],
  },
  {
    id: 'joao-pereira',
    firstName: 'João',
    lastName: 'Pereira',
    role: 'Investigador principal en clima',
    organization: 'Climate Collective',
    organizationUrl: 'https://climatecollective.org',
    sessions: [{ id: 's7', title: 'Datos abiertos para medir capital natural' }],
  },
];
