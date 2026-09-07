/**
 * Copia en español. Es el diccionario de referencia: el tipo `Dictionary` sale de
 * aquí, así que al añadir una clave el inglés deja de compilar hasta traducirla.
 *
 * Solo vive aquí lo que depende del idioma. Lo que no —fechas numéricas, semillas
 * del mosaico, rutas de imagen, enlaces, horas en UTC— se queda en `src/config`.
 */
export const es = {
  meta: {
    /** Sufijo de los títulos de página. */
    siteName: 'CEIBA Quito',
    home: {
      title:
        'CEIBA Quito - Noche de Innovación e Inversión para la Biodiversidad y las Economías del Futuro',
      description:
        'Foro de innovación e inversión para la biodiversidad y las economías del futuro. 05 de octubre de 2026, Quito, Ecuador.',
    },
    agenda: {
      title: 'Agenda',
      description:
        'Programa de CEIBA Quito: plenarias, paneles y actividades del 5 de octubre de 2026 en Quito.',
    },
    speakers: {
      title: 'Ponentes',
      description:
        'Quienes dan forma a lo que viene: participantes y ponentes de alto nivel de CEIBA Quito.',
    },
    faq: {
      title: 'Preguntas Frecuentes',
      description:
        'Preguntas frecuentes sobre CEIBA Quito: fecha, sede, formato, aforo e idiomas.',
    },
    registration: {
      title: 'Registro',
      description: 'Confirma tu asistencia a CEIBA Quito.',
    },
  },

  nav: {
    agenda: 'Agenda',
    speakers: 'Ponentes',
    faq: 'FAQ',
    register: 'Regístrate',
    /** Rótulo del menú para lectores de pantalla. */
    ariaLabel: 'Navegación principal',
  },

  header: {
    home: 'inicio',
    themeToLight: 'Activar tema claro',
    themeToDark: 'Activar tema oscuro',
    language: 'Idioma',
  },

  hero: {
    dateLabel: '05 octubre 2026',
    /** Por líneas: el salto es decisión de diseño, no del navegador. */
    subtitle: [
      'Noche de Innovación e Inversión para la',
      'Biodiversidad y las Economías del Futuro',
    ],
    ctaLabel: 'Registro abierto',
    ctaNote: 'Cupo limitado*',
    countdownLabel: 'CEIBA Quito',
  },

  footer: {
    farewellLead: 'Nos vemos en',
    ctaLabel: 'Regístrate ahora',
    copyright: 'Todos los derechos reservados.',
    legal: {
      terms: 'Términos y condiciones',
      privacy: 'Aviso de privacidad',
    },
    partners: {
      led: 'Iniciativa liderada por',
      funding: 'Socios financiadores',
    },
  },

  agenda: {
    empty: 'Agenda en construcción',
  },

  speakers: {
    listTitle: 'Todos los ponentes',
    introHeadline: ['Quienes dan forma', 'a lo que viene en', 'el futuro'],
    introNote: 'Conoce la lista de participantes y ponentes de alto nivel',
    sessionsLabel: 'Sesiones',
    /**
     * Datos de relleno hasta que exista el endpoint, y por eso están duplicados
     * en cada idioma: cuando llegue la API, los ponentes vendrán con su copia y
     * este bloque desaparece de los diccionarios.
     */
    items: [
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
        sessions: [{ id: 's5', title: 'Saberes indígenas y diseño de política pública' }],
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
    ],
  },

  faq: {
    title: 'FAQ',
    items: [
      {
        id: 'cuando',
        question: '¿Cuándo se realizará el evento?',
        answer: 'El foro se llevará a cabo el lunes 5 de octubre de 2026, en Quito, Ecuador.',
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
    ],
  },

  registration: {
    eyebrowOpen: 'Quedan: 5 lugares',
    eyebrowConfirmed: 'Eres uno de los 100 invitados',
    titleVerify: 'Verifica tu información',
    titleEdit: 'Edita tu información',
    greeting: 'Hola',
    photoUpload: 'Cargar una imagen',
    photoChange: 'Cambiar imagen',
    photoRemoving: 'Quitando fondo…',
    cropAdjust: 'Ajustar encuadre de la fotografía',
    fields: {
      name: 'Nombre',
      surname: 'Apellido',
      email: 'Correo',
      organization: 'Organización',
      role: 'Rol',
      linkedin: 'LinkedIn (opcional)',
    },
    emailSuggestions: 'Sugerencias de correo',
    submit: 'Confirmar asistencia',
    submitSaving: 'Guardando',
    submitUploading: 'Subiendo tu imagen',
    save: 'Guardar cambios',
    cancel: 'Cancelar',
    confirmedCta: 'Asistencia confirmada',
    yourInformation: 'Tu información',
    edit: 'Editar mis datos',
    eventInformation: 'Información del evento',
    dateLongLabel: 'Lunes 5 de octubre de 2026',
    scheduleNote: 'con registro desde las 4:30 pm',
    addToCalendar: 'Añadir a mi calendario',
    download: 'Descargar',
    share: 'Compartir credencial',
    shareTitle: 'Mi credencial CEIBA Quito',
    shareText: 'Nos vemos en Quito, Ecuador.',
    badgeName: 'Tu nombre',
    badgeSurname: 'Apellido',
    badgeOrganization: 'Tu organización',
    badgePreview: 'Vista previa de credencial',
    cropTitle: 'Ajusta tu fotografía',
    cropHint: 'Arrastra para encuadrar la imagen',
    cropClose: 'Cerrar editor',
    cropConfirm: 'Usar este encuadre',
    cropZoom: 'Zoom',
    cropHorizontal: 'Horizontal',
    cropVertical: 'Vertical',
    errors: {
      required: 'Este dato es obligatorio.',
      email: 'Escribe un correo válido.',
      photo: 'Sube una fotografía para generar tu credencial.',
      photoType: 'Elige un archivo de imagen.',
      photoPrepare: 'No se pudo preparar la imagen.',
      save: 'No se pudo guardar el registro.',
    },
  },
} as const;
