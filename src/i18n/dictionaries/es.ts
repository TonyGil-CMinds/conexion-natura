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
    /**
     * Nombres largos de los idiomas, para el selector del menú móvil. En la
     * cabecera de escritorio siguen siendo las siglas: ahí no hay sitio.
     */
    localeNames: {
      es: 'Español',
      en: 'Inglés',
    },
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
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
    /** Sale cuando `items` está vacío: la lista puede volver a estar en obras. */
    empty: 'Agenda en construcción',
    intro:
      'Una tarde-noche para conocer innovaciones y a quienes las están construyendo, entender por qué las industrias verdes y azules son una oportunidad económica para América Latina y el Caribe, y tener tiempo real para encontrarse, probar, conversar y conectar.',
    /** Rótulos de las dos funciones dentro de un momento. */
    hostLabel: 'Presenta',
    peopleLabel: 'Participan',
    /**
     * Distintivo de la fecha, sobre la lista. Es copia y no dato: la fecha vive
     * en `SITE.event.date`, pero cómo se abrevia un mes cambia con el idioma.
     */
    dateLabel: '5 oct',
    /** Buscador del programa. */
    searchLabel: 'Buscar en la agenda',
    searchPlaceholder: 'Buscar...',
    searchEmpty: 'Ningún momento coincide con la búsqueda',
    /**
     * Programa preliminar, transcrito del documento de la organización. Los
     * momentos cuyo presentador o intervención está por decidir van sin nombres:
     * publicar una opción como si estuviera confirmada es peor que no ponerla.
     */
    items: [
      {
        id: 'recorrido',
        time: '17:00 — 17:25',
        title: 'Recorrido vivo',
        description:
          'Bebida de bienvenida, música, visuales territoriales, productos, demostraciones y primeras conexiones.',
      },
      {
        id: 'apertura',
        time: '17:30 — 17:37',
        title: 'Apertura: por qué estamos aquí',
        description: 'Bienvenida desde NaturaTech LAC, CEIBA y Natura500.',
        host: {
          name: 'Constanza Gómez Mont',
          role: 'CEO y fundadora, C Minds; directora, NaturaTech LAC',
        },
      },
      {
        id: 'territorio',
        time: '17:40 — 17:45',
        title: 'La prosperidad comienza en el territorio',
        host: { name: 'Constanza Gómez Mont' },
        people: [
          { name: 'Juan Carlos Jintiach', organization: 'Global Alliance of Territorial Communities' },
        ],
      },
      {
        id: 'historias',
        time: '17:47 — 18:17',
        title: 'Historias Natura500',
        description:
          'Tres innovadores cuentan su historia: qué les llevó a iniciar este camino, qué sueñan lograr y cómo es su relación con la naturaleza.',
        host: { name: 'Carlo Angeles' },
      },
      {
        id: 'idea-spark-inversion',
        time: '18:20 — 18:30',
        title: 'Idea Spark: invertir en empresas que cambian la historia',
        description:
          '¿Cuál es el propósito de los nuevos modelos de negocio? ¿Qué paradigma estamos transitando y cómo se vive desde el lado del inversionista?',
        host: { name: 'Regina Cervera' },
        people: [
          { name: 'Nathalie Molina Niño', organization: 'BRAVA Investments' },
          { name: 'Israel Pons', organization: 'Angel Nest Lat' },
        ],
      },
      {
        id: 'idea-spark-industria',
        time: '18:32 — 18:42',
        title: 'Idea Spark: de solución a industria',
        host: { name: 'Carolina Proaño', role: 'CEIBA' },
        people: [
          { name: 'Gustavo Manrique', organization: 'Premios Verdes Latam' },
          { name: 'Salah Goss', organization: 'Skoll Foundation' },
        ],
      },
      {
        id: 'continente',
        time: '18:45 — 18:55',
        title: 'El continente que queremos habitar',
        description:
          '¿Qué pasaría si América Latina y el Caribe decidieran construir el futuro con —y no a costa de— lo que está vivo?',
        people: [{ name: 'Pablo A. González', organization: 'El Gato y La Caja' }],
      },
      {
        id: 'brindis',
        time: '19:00 — 21:00',
        title: 'Brindis y cóctel de conexiones',
      },
      {
        id: 'cultural',
        time: '19:05 — 19:15',
        title: 'Demostración cultural',
      },
      {
        id: 'dj',
        time: '19:15 — 21:00',
        title: 'DJ set',
      },
    ],
  },

  speakers: {
    listTitle: 'Todos los ponentes',
    introHeadline: ['Quienes dan forma', 'a lo que viene en', 'el futuro'],
    introNote: 'Conoce la lista de participantes y ponentes de alto nivel',
    sessionsLabel: 'Sesiones',
    /**
     * Del programa de la organización. Solo entran quienes constan con cargo y
     * organización: inventarle un título a una persona real es peor que no
     * listarla. Cuando llegue el endpoint, este bloque sale de los diccionarios.
     */
    items: [
      {
        id: 'constanza-gomez-mont',
        firstName: 'Constanza',
        lastName: 'Gómez Mont',
        // Solo una afiliación: la ficha tiene un cargo y una organización, y
        // metiendo las dos quedaba «NaturaTech LAC, C Minds». Su dirección de
        // NaturaTech LAC consta en la agenda, donde el crédito sí cabe entero.
        role: 'CEO y fundadora',
        organization: 'C Minds',
        organizationUrl: 'https://www.cminds.co',
        sessions: [
          { id: 'apertura', title: 'Apertura: por qué estamos aquí' },
          { id: 'territorio', title: 'La prosperidad comienza en el territorio' },
        ],
      },
      {
        id: 'juan-carlos-jintiach',
        firstName: 'Juan Carlos',
        lastName: 'Jintiach',
        role: 'Secretario ejecutivo',
        organization: 'Global Alliance of Territorial Communities',
        sessions: [{ id: 'territorio', title: 'La prosperidad comienza en el territorio' }],
      },
      {
        id: 'nathalie-molina-nino',
        firstName: 'Nathalie',
        lastName: 'Molina Niño',
        role: 'Fundadora',
        organization: 'BRAVA Investments',
        sessions: [
          {
            id: 'idea-spark-inversion',
            title: 'Idea Spark: invertir en empresas que cambian la historia',
          },
        ],
      },
      {
        id: 'israel-pons',
        firstName: 'Israel',
        lastName: 'Pons',
        role: 'CEO',
        organization: 'Angel Nest Lat',
        sessions: [
          {
            id: 'idea-spark-inversion',
            title: 'Idea Spark: invertir en empresas que cambian la historia',
          },
        ],
      },
      {
        id: 'gustavo-manrique',
        firstName: 'Gustavo',
        lastName: 'Manrique',
        role: 'Fundador',
        organization: 'Premios Verdes Latam',
        sessions: [{ id: 'idea-spark-industria', title: 'Idea Spark: de solución a industria' }],
      },
      {
        id: 'salah-goss',
        firstName: 'Salah',
        lastName: 'Goss',
        role: 'Chief Program Officer',
        organization: 'Skoll Foundation',
        sessions: [{ id: 'idea-spark-industria', title: 'Idea Spark: de solución a industria' }],
      },
      {
        id: 'pablo-a-gonzalez',
        firstName: 'Pablo A.',
        lastName: 'González',
        role: 'Cofundador',
        organization: 'El Gato y La Caja',
        sessions: [{ id: 'continente', title: 'El continente que queremos habitar' }],
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
    /**
     * Primera pantalla del registro: el titular grande y la captura del correo.
     *
     * El titular va en dos líneas porque el salto es decisión de diseño. Los
     * iconos sustituyen a las letras «o» en el orden en que aparecen, así que
     * al traducir basta con que la frase tenga alguna.
     */
    join: {
      headlineLine1: 'Acompáñanos',
      headlineLine2: 'en natura500 night',
      /** Tramo de la segunda línea que va en lima. Debe aparecer tal cual en ella. */
      headlineAccent: 'natura500',
      emailLabel: 'Tu correo electrónico',
      submit: 'Continuar',
      saving: 'Espera un momento...',
      note: 'Cupo limitado',
      invalid: 'Escribe un correo válido',
    },

    /**
     * Segundo paso: a cuál de los dos actos del día se asiste. La elección es
     * múltiple, y el titular lo dice —«uno o los dos»— porque unas tarjetas con
     * marca de verificación se leen igual de bien como si fueran excluyentes.
     */
    choice: {
      step: 'Paso 1/3',
      headlineLine1: 'Asiste a uno',
      headlineLine2: 'o a los dos',
      marquee: 'Océanos que nos conectan',
      awardNote:
        'Si participas en GET Forum te invitamos a celebrar a los ganadores del Premio NaturaTech LAC 2026.',
      submit: 'Continuar',
      needOne: 'Elige al menos uno para continuar',
      selected: 'Seleccionado',
      events: {
        night: 'Natura500 Night',
        award: 'Premio NaturaTech LAC 2026',
      },
    },

    /**
     * Tercer paso: los datos de quien se registra y, si viene acompañado, los de
     * su acompañante en una segunda pasada por la misma pantalla. De ahí que
     * haya dos juegos de rótulos: los mismos campos, pero hablando de otra
     * persona.
     */
    details: {
      step: 'Paso 2/3',
      stepCompanion: 'Paso 2/3',
      headlineLine1: 'Garantiza',
      headlineLine2: 'tu lugar',
      companionHeadlineLine1: 'Y los datos',
      companionHeadlineLine2: 'de tu acompañante',
      marquee: 'La tierra que habitamos',
      fields: {
        name: 'Tu nombre',
        surname: 'Tu apellido',
        organization: 'Tu organización',
        role: 'Tu rol',
        linkedin: 'LinkedIn',
      },
      companionFields: {
        name: 'Su nombre',
        surname: 'Su apellido',
        organization: 'Su organización',
        role: 'Su rol',
        linkedin: 'LinkedIn',
      },
      withCompanion: 'Asistiré con acompañante',
      submit: 'Continuar',
      back: 'Volver',
      required: 'Completa los datos que faltan',
    },

    /** Último paso: la fotografía de la credencial y la confirmación. */
    photo: {
      step: 'Paso 3/3',
      headlineLine1: 'Ya casi',
      headlineLine2: 'terminamos',
      marquee: 'Conexiones que creamos',
      intro: 'Sube una fotografía de tu preferencia para crear tu tarjeta virtual.',
      upload: 'Subir imagen',
      change: 'Cambiar imagen',
      /** Mientras el modelo recorta la silueta. Es lo más lento del paso. */
      removing: 'Quitando fondo',
      adjust: 'Ajustar encuadre',
      /** Editor de encuadre, que se abre solo al elegir la imagen. */
      cropTitle: 'Ajusta tu fotografía',
      cropHint: 'Arrastra para encuadrar la imagen',
      cropClose: 'Cerrar editor',
      cropConfirm: 'Usar este encuadre',
      cropZoom: 'Zoom',
      cropHorizontal: 'Horizontal',
      cropVertical: 'Vertical',
      submit: 'Confirmar asistencia',
      sending: 'Confirmando',
      back: 'Volver',
      tooBig: 'La imagen pesa más de 8 MB. Elige otra o hazla más pequeña.',
      notImage: 'Ese archivo no es una imagen.',
      failed: 'No se pudo confirmar. Inténtalo de nuevo.',
    },

    /**
     * Pantalla final: el registro ya está guardado.
     *
     * Es también la vista de reposo de `/registro` —quien vuelve más tarde llega
     * aquí—, así que la copia no habla de «acabas de registrarte» sino del
     * evento: la fecha, el sitio y la tarjeta.
     */
    welcome: {
      greeting: 'Hola',
      invitedLead: 'Eres uno de los',
      invitedCount: '100',
      invitedTail: 'invitados',
      soon: '¡Nos vemos pronto!',
      /** Para lectores de pantalla: la fecha grande va en bloques sin sentido. */
      dateLabel: '5 de octubre de 2026',
      addToCalendar: 'Añadir a mi calendario',
      calendarLabel: 'Elige tu calendario',
      calendars: {
        google: 'Google Calendar',
        outlook: 'Outlook',
        ics: 'Apple u otro (.ics)',
      },
      /** Lo que se escribe en el evento del calendario. */
      calendarTitle: 'CEIBA Quito — Natura500 Night',
      calendarDescription:
        'Noche de Innovación e Inversión para la Biodiversidad y las Economías del Futuro.',
      share: 'Compartir',
      cardTitle: 'Tu tarjeta',
      cardFlip: 'Haz clic para girarla',
      preparing: 'Creando tu tarjeta',
      shareCard: 'Compartir',
      download: 'Descargar',
      close: 'Cerrar',
      shareTitle: 'Mi credencial CEIBA Quito',
      shareText: 'Nos vemos en Quito, Ecuador.',
      copied: 'Enlace copiado al portapapeles',
    },
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
    /** Acceso para quien ya se registró. */
    lookupLink: '¿Ya te has registrado? Haz click aquí',
    lookupTitle: 'Añade tu correo previamente confirmado',
    /**
     * El diseño decía «enviar enlace de acceso», pero no se manda ningún enlace:
     * se consulta el correo y se muestra el registro. El rótulo dice lo que hace.
     */
    lookupSubmit: 'Acceder a mi registro',
    lookupLoading: 'Buscando',
    lookupBack: '¿Aún no te registras? Haz click aquí',
    lookupNotFound: 'Ese correo no está registrado todavía',
    lookupError: 'No se pudo comprobar el correo. Inténtalo de nuevo.',
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
