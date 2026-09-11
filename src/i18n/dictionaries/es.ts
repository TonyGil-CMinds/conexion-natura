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
    terms: {
      title: 'Términos y condiciones',
      description: 'Condiciones de uso del sitio y del registro a CEIBA Quito.',
    },
    tanusas: {
      title: 'Retiro Tanusas 2026',
      description:
        'Retiro del Consejo CEIBA en Tanusas, Puerto Cayo: tres días para co-diseñar la Arquitectura de Capital para la BioProsperidad.',
    },
    privacy: {
      title: 'Aviso de privacidad',
      description: 'Qué datos pedimos para registrarte en CEIBA Quito y qué hacemos con ellos.',
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
    /**
     * La fila que abre el programa: el Premio, que ocurre antes de que empiece
     * la noche y en otra sede. El nombre no se traduce; la sede y la franja sí
     * viven aquí, como las de los demás momentos.
     */
    feature: {
      name: 'Premio 2026',
      time: '16:00 - 16:45',
      venue: 'UDLA Arena · Quito, Ecuador',
    },
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
    /** Mientras la lista no se enseña. La hoja lo pone en versales. */
    introNotePending: 'Revelación de speakers en breve',
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
      /** De qué va cada acto, dentro de su tarjeta. */
      taglines: {
        night: 'Noche de innovación e inversión para la biodiversidad y las economías del futuro',
        award: 'Premiación del Premio NaturaTech LAC 2026',
      },
      /** La premiación aún no tiene hora confirmada. */
      scheduleTbc: 'Horario por confirmar',
    },

    /**
     * Tercer paso: los datos de quien se registra y, si viene acompañado, los de
     * su acompañante en una segunda pasada por la misma pantalla. De ahí que
     * haya dos juegos de rótulos: los mismos campos, pero hablando de otra
     * persona.
     */
    details: {
      step: 'Paso 2/3',
      stepGuest: 'Paso 2/3',
      headlineLine1: 'Garantiza',
      headlineLine2: 'tu lugar',
      guestHeadlineLine1: 'Invita a',
      guestHeadlineLine2: 'tu acompañante',
      marquee: 'La tierra que habitamos',
      fields: {
        name: 'Tu nombre',
        surname: 'Tu apellido',
        organization: 'Tu organización',
        role: 'Tu rol',
        linkedin: 'LinkedIn',
      },
      /**
       * Del invitado solo se piden dos datos: los demás los pondrá esa persona
       * desde el enlace que le llega, que es quien los sabe de verdad.
       */
      guestFields: {
        name: 'Su nombre',
        email: 'Su correo electrónico',
      },
      guestNote:
        'Le enviaremos un correo para que complete su registro y confirme su asistencia.',
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
      /** La fotografía es obligatoria: es la cara de la credencial. */
      required: 'Sube una fotografía para continuar',
      tooBig: 'La imagen pesa más de 8 MB. Elige otra o hazla más pequeña.',
      notImage: 'Ese archivo no es una imagen.',
      failed: 'No se pudo confirmar. Inténtalo de nuevo.',
      /**
       * La misma pantalla, usada para cambiar el retrato de un registro que ya
       * existe: solo cambian los rótulos.
       */
      edit: {
        step: 'Tu credencial',
        headlineLine1: 'Cambia',
        headlineLine2: 'tu fotografía',
        intro: 'Sube la imagen que quieres que salga en tu tarjeta virtual.',
        submit: 'Guardar imagen',
        sending: 'Guardando',
      },
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
      /** Se completa con el nombre del acto que se está mirando. */
      soonIn: '¡Nos vemos pronto en',
      /** Nombres de los dos actos, como se anuncian aquí. */
      events: {
        night: 'Natura500 Night',
        award: 'Premiación Natura500',
      },
      /** Paso de un acto al otro, para quien va a los dos. */
      nextEvent: 'Ver el otro evento',
      previousEvent: 'Ver el evento anterior',
      /** La premiación aún no tiene hora ni sala confirmadas. */
      scheduleTbc: 'Horario por confirmar',
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
      /** Se completa con el nombre del acto: el título lo compone la pantalla. */
      calendarTitle: 'CEIBA Quito',
      calendarDescription:
        'Noche de Innovación e Inversión para la Biodiversidad y las Economías del Futuro.',
      share: 'Compartir',
      /** Con la credencial sin retrato, poner uno es lo que falta por hacer. */
      /** Cómo va el invitado, en la pantalla de quien lo invitó. */
      guestLabel: 'Tu invitado:',
      guestPending: 'Pendiente de completar su registro',
      guestConfirmed: 'Registro completado',
      addPhoto: 'Añadir mi fotografía',
      changePhoto: 'Cambiar mi fotografía',
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

  /**
   * Páginas legales. Redacción de partida, hecha con lo que el sitio hace de
   * verdad: los datos que pide el registro, dónde acaban y con qué proveedores.
   * Lo que no se puede saber leyendo el código —razón social, correo de
   * contacto, jurisdicción— vive vacío en `src/config/legal.ts` y sale marcado
   * en la página. **Falta que lo revise asesoría legal antes de publicar.**
   */
  legal: {
    /** Rótulos que comparten los dos documentos. */
    common: {
      updated: 'Última revisión:',
      contactTitle: 'Contacto',
      controllerLabel: 'Responsable del tratamiento',
      emailLabel: 'Correo de contacto',
      jurisdictionLabel: 'Ley aplicable',
      /** Sale donde falta un dato por definir. */
      pending: 'Por definir',
    },

    privacy: {
      title: 'Aviso de privacidad',
      intro:
        'Este aviso explica qué datos personales pedimos para registrarte en CEIBA Quito, para qué los usamos, dónde se guardan y qué puedes pedirnos que hagamos con ellos. Está escrito para que se entienda sin ser abogado.',
      contact:
        'Para ejercer cualquiera de tus derechos, o si algo de este aviso no queda claro, escríbenos. Contestamos a la misma dirección desde la que nos escribas.',
      sections: [
        {
          id: 'datos',
          title: 'Qué datos te pedimos',
          body: ['Al registrarte recogemos únicamente lo necesario para emitir tu credencial y organizar el aforo:'],
          list: [
            'Nombre y apellido.',
            'Correo electrónico.',
            'Organización y rol.',
            'Perfil de LinkedIn, si decides añadirlo.',
            'Una fotografía tuya, que va en la credencial.',
            'A qué acto o actos del día asistirás.',
            'Si vienes acompañado, los mismos datos de tu acompañante.',
          ],
        },
        {
          id: 'usos',
          title: 'Para qué los usamos',
          body: ['Solo para el evento. Concretamente:'],
          list: [
            'Gestionar tu registro y el aforo, que es limitado.',
            'Emitir tu credencial digital con tu nombre, tu organización y tu fotografía.',
            'Enviarte la confirmación de asistencia y la información práctica del acto.',
            'Identificarte en el acceso el día del evento.',
            'Avisarte si algo del programa o de la sede cambia.',
          ],
        },
        {
          id: 'base',
          title: 'Con qué base los tratamos',
          body: [
            'Con tu consentimiento, que das al completar el registro. El registro es voluntario: puedes no darlo, y puedes retirarlo después pidiéndonos que eliminemos tus datos, aunque en ese caso no podremos emitir tu credencial ni darte acceso al acto.',
          ],
          list: [],
        },
        {
          id: 'fotografia',
          title: 'Tu fotografía',
          body: [
            'La fotografía se procesa en tu propio navegador: ahí se le quita el fondo y se recorta al encuadre que elijas. Solo se guarda la versión recortada, y se usa únicamente para tu credencial.',
            'No aplicamos reconocimiento facial ni ningún otro análisis biométrico sobre ella.',
          ],
          list: [],
        },
        {
          id: 'proveedores',
          title: 'Dónde se guardan y quién nos ayuda a tratarlos',
          body: [
            'No tenemos servidores propios: usamos proveedores que tratan los datos por encargo nuestro y solo para lo que se describe aquí.',
          ],
          list: [
            'La base de datos del registro está en Prisma Postgres.',
            'Las fotografías están en Cloudflare R2.',
            'Los correos de confirmación salen por Resend.',
            'El sitio se sirve desde Vercel.',
            'Sus servidores están fuera de Ecuador, así que tus datos se transfieren internacionalmente para poder prestarte el servicio.',
          ],
        },
        {
          id: 'plazo',
          title: 'Cuánto tiempo los conservamos',
          body: [
            'Hasta doce meses después del evento, para poder atender consultas posteriores y rendir cuentas de la convocatoria. Pasado ese plazo se eliminan. Si nos pides antes que los borremos, los borramos antes.',
          ],
          list: [],
        },
        {
          id: 'terceros',
          title: 'Con quién los compartimos',
          body: [
            'Con nadie más allá de los proveedores citados. No vendemos, alquilamos ni cedemos tus datos para publicidad, ni los compartimos con otros asistentes, patrocinadores o socios del evento.',
            'Solo los entregaríamos a una autoridad si una norma nos obligara a hacerlo.',
          ],
          list: [],
        },
        {
          id: 'acompanante',
          title: 'Los datos de tu acompañante',
          body: [
            'Si registras a un acompañante, nos estás diciendo que cuentas con su permiso para darnos sus datos y que le has explicado este aviso. Tratamos sus datos igual que los tuyos y por el mismo tiempo, y esa persona tiene exactamente los mismos derechos.',
          ],
          list: [],
        },
        {
          id: 'derechos',
          title: 'Qué puedes pedirnos',
          body: ['En cualquier momento, escribiendo a la dirección del final de esta página:'],
          list: [
            'Acceder a los datos que tenemos sobre ti.',
            'Corregir lo que esté mal o incompleto.',
            'Eliminar tu registro, con su fotografía.',
            'Retirar tu consentimiento.',
            'Oponerte a un uso concreto de tus datos.',
          ],
        },
        {
          id: 'navegador',
          title: 'Qué guarda el sitio en tu navegador',
          body: [
            'No usamos cookies de publicidad, de seguimiento ni de terceros, y no medimos tu navegación con herramientas de analítica.',
            'Lo único que queda en tu navegador es lo que hace falta para que el sitio funcione: tu confirmación de asistencia, el borrador del registro mientras lo completas y tu preferencia de tema claro u oscuro. Nada de eso sale de tu equipo, y se borra vaciando los datos del sitio.',
          ],
          list: [],
        },
        {
          id: 'cambios',
          title: 'Cambios en este aviso',
          body: [
            'Si cambiamos algo, actualizamos la fecha de revisión que aparece arriba. Si el cambio afecta a para qué usamos tus datos, te avisaremos al correo con el que te registraste.',
          ],
          list: [],
        },
      ],
    },

    terms: {
      title: 'Términos y condiciones',
      intro:
        'Estas condiciones rigen el uso de este sitio y el registro al evento CEIBA Quito del 5 de octubre de 2026. Al registrarte las aceptas.',
      contact:
        'Si tienes dudas sobre estas condiciones, o necesitas algo del equipo organizador, escríbenos.',
      sections: [
        {
          id: 'registro',
          title: 'El registro',
          body: [
            'El aforo es limitado y el registro se atiende por orden de llegada. Completar el formulario no garantiza tu lugar hasta que recibas la confirmación.',
            'Los datos que nos das tienen que ser tuyos y ser ciertos. Un registro con datos falsos o con la identidad de otra persona puede anularse sin aviso.',
            'Un registro es una persona. Si vienes acompañado, tienes que registrar también a tu acompañante con sus propios datos.',
          ],
          list: [],
        },
        {
          id: 'credencial',
          title: 'Tu credencial',
          body: [
            'La credencial que genera el sitio es personal e intransferible: sirve para identificarte en el acceso y no puede cederse ni compartirse.',
            'El día del evento podremos pedirte un documento de identidad para comprobar que coincide con la credencial.',
          ],
          list: [],
        },
        {
          id: 'acceso',
          title: 'El acceso al evento',
          body: [
            'La entrada es gratuita y por invitación. El equipo organizador puede negar o retirar el acceso a quien no pueda acreditar su registro, a quien acuda con una credencial ajena o a quien tenga un comportamiento que ponga en riesgo o incomode al resto de asistentes, al personal o a la sede.',
            'Dentro del recinto se siguen las normas de la sede y las indicaciones del personal.',
          ],
          list: [],
        },
        {
          id: 'programa',
          title: 'El programa puede cambiar',
          body: [
            'La agenda publicada es preliminar: los horarios, las intervenciones y las personas que participan pueden variar hasta el mismo día.',
            'Si el evento tuviera que cambiar de fecha, de sede o de formato, te avisaremos al correo con el que te registraste.',
          ],
          list: [],
        },
        {
          id: 'imagenes',
          title: 'Fotografía y grabación del acto',
          body: [
            'Durante el evento puede haber fotografía y grabación de vídeo con fines informativos y de difusión de la convocatoria. Al asistir es posible que aparezcas en esas imágenes.',
            'Si no quieres aparecer, dínoslo por escrito antes del evento o al llegar, y lo tendremos en cuenta.',
          ],
          list: [],
        },
        {
          id: 'propiedad',
          title: 'Contenidos del sitio',
          body: [
            'Los textos, las imágenes, los logotipos y el diseño de este sitio pertenecen a quienes organizan el evento o a quienes se los han cedido. Puedes compartir los enlaces y tu propia credencial libremente; para cualquier otro uso —reproducir contenidos, usar las marcas— hace falta permiso por escrito.',
          ],
          list: [],
        },
        {
          id: 'enlaces',
          title: 'Enlaces a otros sitios',
          body: [
            'El sitio enlaza a páginas de terceros —perfiles de LinkedIn, mapas, calendarios, sitios de las organizaciones participantes—. No controlamos su contenido ni sus condiciones, así que la responsabilidad de lo que allí ocurra es suya.',
          ],
          list: [],
        },
        {
          id: 'responsabilidad',
          title: 'Disponibilidad y responsabilidad',
          body: [
            'Ponemos cuidado en que el sitio funcione y en que la información esté al día, pero no podemos garantizar que esté disponible sin interrupciones ni que no contenga errores. Si detectas uno, agradecemos el aviso.',
            'No respondemos de los daños derivados de un uso del sitio distinto del previsto, ni de fallos ajenos a nosotros como los de tu conexión o tu equipo.',
          ],
          list: [],
        },
        {
          id: 'datos',
          title: 'Tus datos personales',
          body: [
            'Cómo tratamos los datos del registro se explica en el aviso de privacidad, que forma parte de estas condiciones.',
          ],
          list: [],
        },
        {
          id: 'ley',
          title: 'Ley aplicable',
          body: [
            'Estas condiciones se rigen por la legislación que se indica al final de esta página, y cualquier controversia se someterá a sus tribunales.',
          ],
          list: [],
        },
        {
          id: 'cambios',
          title: 'Cambios en estas condiciones',
          body: [
            'Podemos actualizarlas; la fecha de revisión de arriba dice cuándo se hizo la última vez. Si el cambio es de fondo y te afecta como persona registrada, te avisaremos por correo.',
          ],
          list: [],
        },
      ],
    },
  },

  /**
   * Micropágina del retiro del Consejo CEIBA en Tanusas (`/tanusas`).
   *
   * Es una invitación, no una página de producto: el texto es largo a propósito
   * porque quien la recibe tiene que poder decidir con lo que lee. Está
   * transcrito del documento de la organización; lo que no depende del idioma
   * —fechas, sede, aforo, imágenes— vive en `src/config/tanusas.ts`.
   */
  tanusas: {
    /** Navegación de la propia página: son anclas, no rutas. */
    nav: {
      /** Nombre accesible del bloque. No es una de las anclas. */
      label: 'Secciones del retiro',
      invitation: 'Invitación',
      concept: 'Concepto',
      architecture: 'Arquitectura',
      place: 'Lugar',
      agenda: 'Agenda',
      rsvp: 'Confirmar',
    },

    hero: {
      /** Nombre del rótulo, para quien no ve la imagen. */
      wordmarkAlt: 'Tanusas',
      /**
       * Fecha y sede, en una línea sobre el rótulo. Son las mismas de `facts`,
       * de donde se componen al pintar: un solo sitio donde corregirlas.
       */
      headline:
        'Tres días para co-diseñar la Arquitectura de Capital para la BioProsperidad en América Latina y el Caribe.',
      /** Los tres datos de cabecera, en el orden del diseño. */
      facts: [
        { label: 'Fechas', value: '8 – 10 de octubre de 2026' },
        { label: 'Lugar', value: 'Tanusas, Puerto Cayo · Manabí, Ecuador' },
        { label: 'Formato', value: 'Retiro residencial · 12 – 15 personas' },
      ],
      cta: 'Confirmar asistencia',
      /** El campo en que se convierte el botón al pulsarlo. */
      emailLabel: 'Tu correo electrónico',
      emailPlaceholder: 'Tu correo electrónico',
      emailSubmit: 'Continuar con este correo',
      /** Mientras se comprueba si ese correo ya tiene registro. */
      emailChecking: 'Comprobando tu correo',
      emailInvalid: 'Escribe un correo válido',
      note: 'Confirmación antes del 15 de septiembre*',
      personal: 'Invitación personal',
      /** Rótulos de los dos logotipos del pie del hero. */
      partners: {
        initiative: 'Una iniciativa de',
        coled: 'Co-liderada por',
      },
    },

    invitation: {
      number: '01',
      kicker: 'La invitación',
      title: 'Te queremos en la mesa donde esto se construye',
      body: [
        'Después del GET Forum, del 8 al 10 de octubre, reuniremos en Tanusas, en la costa de Ecuador, a un grupo pequeño de personas del Consejo CEIBA cuya experiencia, visión y capacidad de acción consideramos fundamentales para dar un siguiente paso hacia la BioProsperidad en la región.',
        'Queremos alejarnos durante tres días del ritmo y los formatos habituales, y crear las condiciones para pensar profundamente, cuestionarnos, construir confianza y trabajar de forma colaborativa.',
        'No buscamos llegar con todas las respuestas. Buscamos perspectivas que tensionen los supuestos, enriquezcan la arquitectura y nos ayuden a convertirla en algo que pueda ponerse a prueba en los territorios.',
      ],
      questionLabel: 'Partimos de una pregunta',
      marquee: 'Un tejido',
      pauseMarquee: 'Pausar marquesina',
      playMarquee: 'Reanudar marquesina',
      question:
        '¿Cómo podemos innovar en la construcción de prosperidad reconociendo a la economía como parte de un sistema vivo, y haciendo posible que la naturaleza, las culturas y las comunidades que la sostienen prosperen conjuntamente?',
    },

    concept: {
      number: '02',
      kicker: 'El concepto',
      title: '¿Qué es un Sistema de BioProsperidad?',
      body: [
        'El problema no es solo que falte financiamiento para la biodiversidad: es que los sistemas que sostienen la integridad ecológica y la prosperidad socioeconómica se financian, gobiernan y gestionan como si fueran separados. El capital llega fragmentado y refuerza silos en lugar de coherencia.',
        'Nos hemos vuelto muy eficaces financiando producción y transacciones, y muy poco eficaces financiando las condiciones que hacen posible la prosperidad.',
        'BioProsperidad nombra una convicción simple: la integridad ecológica, el bienestar comunitario, la continuidad cultural y el valor económico regenerativo no son objetivos que compiten. Son resultados interdependientes de sistemas territoriales sanos. Si la resiliencia es sistémica, las vías para financiarla y gobernarla también deben serlo.',
        'Un Sistema de BioProsperidad es una infraestructura de transición: un portafolio integrado de procesos interrelacionados, coordinados y financiados juntos bajo una ruta de transformación de 10 a 20 años, para fortalecer la capacidad de un territorio biodiverso y biocultural de generar, retener y recircular valor ecológico, social, cultural y económico entre generaciones.',
      ],
      facts: [
        {
          label: 'Escala del demostrador',
          value:
            '500.000 hectáreas en hotspots de biodiversidad y cultura, agregadas entre los socios custodios del sistema.',
        },
        {
          label: 'Horizonte',
          value:
            '10–20 años de ruta de transformación coordinada y financiada como un solo portafolio.',
        },
        {
          label: 'Métrica insignia · Retención de valor territorial',
          value:
            'La proporción del valor generado que permanece, se reinvierte o recircula dentro del territorio.',
        },
      ],
      dimensionsTitle: 'Cinco dimensiones interdependientes',
      dimensionsNote:
        'No son sectores separados: funcionan como un portafolio coordinado. Ninguna se sostiene en aislamiento. Abre cada una para ver qué contiene.',
      dimensions: [
        {
          question: '01 · Procesos que aumentan la integridad ecológica',
          answer:
            'Función hídrica, biodiversidad, conectividad de ecosistemas, regeneración de suelos y salud ecosistémica, mantenidas y ampliadas como infraestructura de resiliencia.',
        },
        {
          question: '02 · Industrias nature-positive y sistemas asociativos de valor',
          answer:
            'Actividad económica diversificada y regenerativa: agroforestería, pesca, servicios de restauración, turismo de naturaleza, procesamiento con valor agregado y bioeconomía emergente.',
        },
        {
          question: '03 · Continuidad cultural y patrimonio biocultural',
          answer:
            'Lenguas, conocimientos y tecnologías tradicionales, aprendizaje intergeneracional, gobernanza biocultural e identidades ligadas al lugar.',
        },
        {
          question: '04 · Bienestar comunitario y Buen Vivir',
          answer:
            'Planes de vida propios: soberanía alimentaria, agua limpia, salud y energía, con compromisos explícitos con la nutrición infantil y la equidad de género en la gobernanza local.',
        },
        {
          question: '05 · Flujos de capital y conectividad territorial',
          answer:
            'Circulación y coordinación de capital financiero, intelectual, social, tecnológico, político y cultural entre territorios rurales y urbanos.',
        },
        {
          question: '↺ · Y, atravesando todas: gobernanza y coordinación territorial',
          answer:
            'El mecanismo articulador que alinea conservación, desarrollo económico, cultura y bienestar en una visión territorial compartida.',
        },
      ],
    },

    architecture: {
      number: '03',
      kicker: 'La arquitectura',
      title: 'La Arquitectura de Capital de Custodia',
      body: [
        'La innovación no es un fondo nuevo: es una forma nueva de coordinar capital alrededor de la resiliencia de sistemas vivos. Cada Sistema de BioProsperidad funciona como un portafolio integrado cuyo desempeño depende de la salud del territorio completo, no de maximizar retornos proyecto por proyecto.',
        'Está en etapas tempranas de diseño: por eso vamos a Tanusas.',
      ],
      principlesTitle: 'Tres principios',
      principles: [
        {
          title: 'Secuenciación',
          body: 'Lo filantrópico y concesional abre gobernanza, confianza y evidencia; a medida que baja el riesgo entra capital de impacto, comercial e institucional.',
        },
        {
          title: 'Stacking',
          body: 'Donaciones, capital catalítico, finanzas concesionales, inversión de impacto y capital comercial coexisten en un mismo sistema según su tolerancia al riesgo y su retorno esperado.',
        },
        {
          title: 'Diversificación',
          body: 'La soberanía económica se fortalece con fuentes de valor complementarias, no con dependencia de una sola cadena o commodity.',
        },
      ],
      functionsTitle: 'Funciones del capital',
      functions: [
        {
          question: 'Filantrópico y catalítico',
          answer:
            'Gobernanza, mapeo de sistemas, medición de resiliencia, confianza y primeras mitigaciones de riesgo.',
        },
        {
          question: 'Inversión ligada a desempeño',
          answer:
            'Financiamiento de largo plazo para actividad productiva e infraestructura, con retornos atados a flujos del sistema.',
        },
        {
          question: 'Capital basado en resultados',
          answer: 'Reconoce desempeño ecológico verificado: biodiversidad, carbono, agua, suelos.',
        },
      ],
      portfolioTitle: 'El portafolio, en tres tiempos',
      portfolio: [
        {
          question: 'Empresas de transición',
          answer:
            'Sectores productivos e industrias regenerativas con ingresos y estabilidad de corto plazo.',
        },
        {
          question: 'Industrias nature-positive emergentes',
          answer:
            'Nuevas empresas y sistemas de valor con crecimiento, diversificación e innovación a mediano plazo.',
        },
        {
          question: 'Pipelines de futuro',
          answer:
            'Investigación, ciencia y experimentación que crean la capacidad adaptativa de mañana.',
        },
      ],
      thesisTitle: 'La tesis de inversión',
      thesis: [
        'El desempeño financiero de largo plazo depende de la resiliencia de los sistemas ecológicos, de gobernanza y productivos que sostienen la actividad económica. La regeneración no es un costo del desempeño: es su condición.',
        'Un segundo mecanismo habilitante la acompaña: el Sistema de Valor BioPróspero, multicapital y biocultural, que hace visibles las formas de valor que sostienen la resiliencia sin reducir la naturaleza ni la cultura a términos monetarios.',
      ],
    },

    goals: {
      number: '04',
      kicker: 'Qué buscamos',
      title: 'Salir de Tanusas con tres cosas construidas',
      intro:
        'Trabajaremos sobre cómo financiar la resiliencia de un territorio como un sistema completo: qué debe sostener el capital, qué tipos de capital necesitan encontrarse, en qué secuencia, cómo construir portafolios que financien conjuntamente integridad ecológica, economías territoriales, cultura, bienestar y gobernanza, y qué principios deberían ser no negociables.',
      outcomes: [
        {
          number: '01',
          title: 'Una primera Arquitectura de Capital para la BioProsperidad',
          body: 'Funciones, secuencia, combinación de capitales y salvaguardas.',
        },
        {
          number: '02',
          title: 'Las decisiones para publicar el Marco de Sistemas de BioProsperidad',
          body: 'Estructura, autoría, alcance y ruta de publicación del marco y su arquitectura de capital.',
        },
        {
          number: '03',
          title: 'Una ruta de 12 meses para ponerla a prueba',
          body: 'Territorios candidatos en América Latina y el Caribe, con primeros actores, responsabilidades e hitos.',
        },
      ],
      planesTitle: 'Cómo trabajaremos · cinco planos al mismo tiempo',
      planes: [
        {
          title: 'Relacional',
          body: 'Confianza y vínculos capaces de sostener desacuerdos y colaboración larga.',
        },
        {
          title: 'Conceptual',
          body: 'Un lenguaje compartido sobre valor, bienestar, gobernanza y regeneración.',
        },
        {
          title: 'Estratégico',
          body: 'Claridad sobre arquitectura, pilotos, riesgos y preguntas por probar.',
        },
        {
          title: 'Práctico',
          body: 'Responsables, contribuciones y próximos pasos concretos.',
        },
        {
          title: 'Personal',
          body: 'Una conexión renovada con la naturaleza, el cuerpo y el sentido del trabajo.',
        },
      ],
      format: 'Formato: cuatro mesas de trabajo profundo, caminatas, mar y comida del bosque.',
    },

    place: {
      number: '05',
      kicker: 'El lugar',
      title: 'Tanusas: bosque comestible, mar y territorio',
      body: [
        'Tanusas está en Puerto Cayo, en la costa de Manabí: un lugar donde el bosque seco tropical llega hasta el mar. Es el escenario que elegimos porque el territorio también trabaja: caminar, comer y conversar allí cambia la conversación.',
        'Su restaurante Boca Valdivia, del chef Rodrigo Pacheco, cocina desde un bosque comestible sembrado en el mismo territorio: cientos de especies nativas, agroforestería y pesca artesanal en diálogo con las comunidades vecinas. Es, en la práctica, una demostración viva de bioprosperidad y una de nuestras aulas durante estos días.',
        'El programa se mueve entre la mesa de trabajo, el bosque y la playa: mañanas de guayusa, baño en el mar para quien quiera, caminatas de observación con Rodrigo, y encuentros frente al atardecer para pensar en voz alta.',
      ],
      locationTitle: 'Ubicación',
      location: [
        { label: 'Sede', value: 'Puerto Cayo · Manabí' },
        { label: 'Desde Manta', value: '≈ 1 h en auto' },
        { label: 'Vuelo Quito – Manta', value: '≈ 55 min' },
        { label: 'Ecosistema', value: 'Bosque seco tropical' },
      ],
      closing:
        'Las actividades incluyen caminar el bosque comestible, encuentros frente al mar y trabajo dedicado a construir la arquitectura de capital: un grupo curado, de varios países y perspectivas, con la intención de poner manos a la obra.',
    },

    agenda: {
      number: '06',
      kicker: 'Agenda general',
      title: 'Tres días, un ritmo distinto',
      days: [
        {
          tab: 'Jueves 8',
          title: 'Llegada, traslado y apertura',
          rows: [
            { time: 'Mañana', text: 'Llegada a Quito. Cada persona gestiona su vuelo hasta Quito.' },
            {
              time: '12:00',
              text: 'Punto de encuentro en el aeropuerto de Quito. Viajamos juntas y juntos desde aquí.',
            },
            { time: '15:45', text: 'Vuelo Quito → Manta.' },
            {
              time: 'Tarde',
              text: 'Llegada a Manta y traslado terrestre a Tanusas. Check-in y tiempo para aterrizar.',
            },
            {
              time: 'Noche',
              text: 'Fogata de las intenciones: cena compartida, apertura de CEIBA y una ronda. ¿Con qué llego?, ¿qué quiero comprender?, ¿qué puedo aportar?',
            },
          ],
        },
        {
          tab: 'Viernes 9',
          title: 'Día completo de mesas de trabajo',
          rows: [
            {
              time: 'Amanecer',
              text: 'Opcional: silencio, guayusa y tabaco con nuestros aliados indígenas, baño en el mar.',
            },
            {
              time: 'Desayuno',
              text: 'Desayuno del bosque comestible con Rodrigo Pacheco: el origen de los alimentos y su relación con territorio, nutrición y regeneración.',
            },
            {
              time: 'Mañana',
              text: 'Mesas I y II · Capital stacking. ¿Qué debe sostener el capital? ¿Qué capitales y capacidades necesitan encontrarse, y qué función cumple cada uno?',
            },
            { time: 'Mediodía', text: 'Almuerzo del bosque comestible y descanso sin programación.' },
            {
              time: 'Tarde',
              text: 'Mesa III · Portafolio. Cómo financiar la resiliencia como sistema y no como un conjunto de activos rentables.',
            },
            {
              time: 'Atardecer',
              text: 'Caminata en pares frente al mar. ¿Qué idea solté?, ¿qué veo ahora que antes no veía? Y cena de celebración.',
            },
          ],
        },
        {
          tab: 'Sábado 10',
          title: 'Bosque, síntesis y cierre',
          rows: [
            {
              time: 'Temprano',
              text: 'Entrada al bosque comestible con Rodrigo Pacheco: caminar, observar y conversaciones caminadas. Círculo en el bosque: una lección del territorio por persona.',
            },
            {
              time: 'Mañana',
              text: 'Mesa IV · Tejer el camino. Síntesis, decisiones, estructura de publicación, ruta de demostración y compromisos.',
            },
            {
              time: '13:00',
              text: 'Almuerzo de cierre y círculo final: una gratitud, un compromiso y una conexión que continúa.',
            },
            {
              time: '15:00',
              text: 'Salida coordinada hacia el aeropuerto de Manta y otros puntos de conexión.',
            },
          ],
        },
      ],
      note: 'Agenda general y sujeta a ajustes. Horarios de vuelo y traslados se confirmarán con cada persona antes de la compra de boletos.',
    },

    practical: {
      number: '07',
      kicker: 'Lo práctico',
      title: 'Qué implica aceptar esta invitación',
      items: [
        {
          title: 'Participación',
          body: 'Invitación personal y no transferible, con participación activa durante los tres días completos.',
        },
        {
          title: 'Grupo',
          body: 'Entre 12 y 15 personas del Consejo CEIBA y aliados, de múltiples países y perspectivas.',
        },
        {
          title: 'Traslados y estadía',
          body: 'Coordinamos el vuelo Quito–Manta, los traslados terrestres, el alojamiento y la alimentación en Tanusas.',
        },
        {
          title: 'Qué traer',
          body: 'Ropa ligera y de caminata, traje de baño, protección solar, y una pregunta que te importe de verdad.',
        },
      ],
    },

    /**
     * Registro del retiro, en tres pasos: datos, restricciones y fotografía.
     * El paso de la fotografía reutiliza el del registro de Quito, así que su
     * copia vive en `registration.photo` y no aquí.
     */
    registration: {
      details: {
        step: 'Paso 1/3',
        headlineLine1: 'Reserva',
        headlineLine2: 'tu lugar',
        intro:
          'Somos entre doce y quince personas, así que cada lugar cuenta. Con estos datos preparamos tu llegada y el diseño de los tres días.',
        fields: {
          name: 'Nombre',
          surname: 'Apellido',
          organization: 'Organización',
          role: 'Rol',
          city: 'Ciudad de origen del vuelo',
          question: 'Una pregunta que te importe de verdad',
        },
        placeholders: {
          name: 'Tu nombre',
          surname: 'Tu apellido',
          organization: 'Dónde trabajas',
          role: 'Qué haces ahí',
          city: 'Desde dónde vuelas a Quito',
          question: 'La que traerías a la mesa',
        },
        /** Por qué se pide cada uno de los dos campos que no son obvios. */
        hints: {
          city: 'Coordinamos juntos el tramo Quito–Manta.',
          question: 'Entra en el diseño de las conversaciones del retiro.',
        },
        submit: 'Continuar',
        required: 'Completa los datos marcados',
      },

      diet: {
        step: 'Paso 2/3',
        headlineLine1: 'Cómo',
        headlineLine2: 'te cuidamos',
        intro:
          'Comemos juntos las tres jornadas y la cocina se prepara con lo que nos digas. Marca todo lo que aplique.',
        options: {
          none: 'Sin restricciones',
          vegetarian: 'Vegetariana',
          vegan: 'Vegana',
          glutenFree: 'Sin gluten',
          lactoseFree: 'Sin lactosa',
          allergy: 'Alergia alimentaria',
          health: 'Condición de salud',
        },
        descriptions: {
          none: 'Como de todo',
          vegetarian: 'Sin carne ni pescado',
          vegan: 'Sin nada de origen animal',
          glutenFree: 'Celiaquía o intolerancia',
          lactoseFree: 'Intolerancia a la lactosa',
          allergy: 'Cuéntanos a qué, abajo',
          health: 'Algo que debamos saber',
        },
        notesLabel: 'Cuéntanos los detalles',
        notesPlaceholder: 'A qué eres alérgico, o qué debemos tener en cuenta',
        notesRequired: 'Cuéntanos los detalles de lo que marcaste',
        needOne: 'Marca al menos una opción',
        selected: 'Elegido',
        submit: 'Continuar',
        back: 'Volver',
      },

      done: {
        greeting: 'Hola',
        greetingFallback: 'Tu lugar queda reservado',
        body:
          'Te escribiremos para coordinar el vuelo Quito–Manta, los traslados y enviarte la agenda detallada con los materiales de lectura previa.',
        emailLabel: 'Correo',
        retreatLabel: 'Retiro',
        retreatValue: '8 – 10 oct 2026 · Tanusas',
        dietLabel: 'En la mesa',
        edit: 'Editar mi registro',
        /** Calendario: se elige plataforma, no se impone el .ics. */
        addToCalendar: 'Añadir a mi calendario',
        calendarLabel: 'Elige tu calendario',
        calendars: {
          google: 'Google Calendar',
          outlook: 'Outlook',
          ics: 'Descargar .ics',
        },
        calendarTitle: 'Retiro CEIBA · Tanusas',
        calendarDescription:
          'Tres días para co-diseñar la Arquitectura de Capital para la BioProsperidad en América Latina y el Caribe.',
        /** La credencial. */
        card: 'Ver mi credencial',
        cardTitle: 'Tu credencial del retiro',
        cardFlip: 'Gira la tarjeta',
        cardClose: 'Cerrar',
        preparing: 'Preparando tu credencial',
        download: 'Descargar',
        share: 'Compartir',
        shareTitle: 'Retiro CEIBA · Tanusas 2026',
        shareText: 'Nos vemos en Tanusas del 8 al 10 de octubre de 2026.',
        shared: 'Credencial compartida',
        copied: 'Enlace copiado',
        shareFailed: 'No se pudo compartir. Descárgala y compártela tú.',
      },

      failed: 'No se pudo guardar el registro. Inténtalo de nuevo.',
    },

    closing: {
      quote:
        'Nuevas economías se están tejiendo desde las selvas, las costas y las comunidades.',
      invite: 'Nos daría muchísima alegría construir este siguiente paso contigo.',
      cta: 'Confirmar mi lugar',
      partners:
        'NaturaTech LAC es una iniciativa impulsada por BID Lab y co-liderada por C Minds, con el apoyo de Suecia, el Gobierno de Francia, Climate Collective y la red del Consejo CEIBA.',
      credit: 'Consejo CEIBA · NaturaTech LAC',
    },
  },
} as const;
