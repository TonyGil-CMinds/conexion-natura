import type { Dictionary } from '../index';

/**
 * Copia en inglés. El tipo sale del diccionario español, así que al añadir una
 * clave allí este archivo deja de compilar hasta traducirla: es el aviso.
 */
export const en: Dictionary = {
  meta: {
    siteName: 'CEIBA Quito',
    home: {
      title:
        'CEIBA Quito - A Night of Innovation and Investment for Biodiversity and the Economies of the Future',
      description:
        'A forum on innovation and investment for biodiversity and the economies of the future. October 5, 2026, Quito, Ecuador.',
    },
    agenda: {
      title: 'Agenda',
      description:
        'CEIBA Quito programme: plenaries, panels and activities on October 5, 2026 in Quito.',
    },
    speakers: {
      title: 'Speakers',
      description:
        'The people shaping what comes next: high-level participants and speakers at CEIBA Quito.',
    },
    faq: {
      title: 'FAQ',
      description:
        'Frequently asked questions about CEIBA Quito: date, venue, format, capacity and languages.',
    },
    registration: {
      title: 'Registration',
      description: 'Confirm your attendance at CEIBA Quito.',
    },
  },

  nav: {
    agenda: 'Agenda',
    speakers: 'Speakers',
    faq: 'FAQ',
    register: 'Register',
    ariaLabel: 'Main navigation',
  },

  header: {
    home: 'home',
    themeToLight: 'Switch to light theme',
    themeToDark: 'Switch to dark theme',
    language: 'Language',
    localeNames: {
      es: 'Spanish',
      en: 'English',
    },
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },

  hero: {
    dateLabel: 'october 05 2026',
    subtitle: [
      'A Night of Innovation and Investment for',
      'Biodiversity and the Economies of the Future',
    ],
    ctaLabel: 'Registration open',
    ctaNote: 'Limited capacity*',
    countdownLabel: 'CEIBA Quito',
  },

  footer: {
    farewellLead: 'See you in',
    ctaLabel: 'Register now',
    copyright: 'All rights reserved.',
    legal: {
      terms: 'Terms and conditions',
      privacy: 'Privacy notice',
    },
    partners: {
      led: 'Initiative led by',
      funding: 'Funding partners',
    },
  },

  agenda: {
    empty: 'Agenda in progress',
    intro:
      'An evening to meet the innovations and the people building them, to see why green and blue industries are an economic opportunity for Latin America and the Caribbean, and to have real time to meet, try things, talk and connect.',
    hostLabel: 'Hosted by',
    peopleLabel: 'With',
    dateLabel: 'Oct 5',
    searchLabel: 'Search the agenda',
    searchPlaceholder: 'Search...',
    searchEmpty: 'No moment matches your search',
    items: [
      {
        id: 'recorrido',
        time: '17:00 — 17:25',
        title: 'Living tour',
        description:
          'Welcome drink, music, visuals from the territories, products, demos and first connections.',
      },
      {
        id: 'apertura',
        time: '17:30 — 17:37',
        title: 'Opening: why we are here',
        description: 'A welcome from NaturaTech LAC, CEIBA and Natura500.',
        host: {
          name: 'Constanza Gómez Mont',
          role: 'CEO and founder, C Minds; director, NaturaTech LAC',
        },
      },
      {
        id: 'territorio',
        time: '17:40 — 17:45',
        title: 'Prosperity begins in the territory',
        host: { name: 'Constanza Gómez Mont' },
        people: [
          { name: 'Juan Carlos Jintiach', organization: 'Global Alliance of Territorial Communities' },
        ],
      },
      {
        id: 'historias',
        time: '17:47 — 18:17',
        title: 'Natura500 stories',
        description:
          'Three innovators tell their story: what set them on this path, what they dream of achieving and how they relate to nature.',
        host: { name: 'Carlo Angeles' },
      },
      {
        id: 'idea-spark-inversion',
        time: '18:20 — 18:30',
        title: 'Idea Spark: investing in companies that change the story',
        description:
          'What are the new business models for? Which paradigm are we moving through, and how does it look from the investor’s side?',
        host: { name: 'Regina Cervera' },
        people: [
          { name: 'Nathalie Molina Niño', organization: 'BRAVA Investments' },
          { name: 'Israel Pons', organization: 'Angel Nest Lat' },
        ],
      },
      {
        id: 'idea-spark-industria',
        time: '18:32 — 18:42',
        title: 'Idea Spark: from solution to industry',
        host: { name: 'Carolina Proaño', role: 'CEIBA' },
        people: [
          { name: 'Gustavo Manrique', organization: 'Premios Verdes Latam' },
          { name: 'Salah Goss', organization: 'Skoll Foundation' },
        ],
      },
      {
        id: 'continente',
        time: '18:45 — 18:55',
        title: 'The continent we want to live in',
        description:
          'What if Latin America and the Caribbean decided to build the future with —not at the expense of— what is alive?',
        people: [{ name: 'Pablo A. González', organization: 'El Gato y La Caja' }],
      },
      {
        id: 'brindis',
        time: '19:00 — 21:00',
        title: 'Toast and connections cocktail',
      },
      {
        id: 'cultural',
        time: '19:05 — 19:15',
        title: 'Cultural performance',
      },
      {
        id: 'dj',
        time: '19:15 — 21:00',
        title: 'DJ set',
      },
    ],
  },

  speakers: {
    listTitle: 'All speakers',
    introHeadline: ['The people shaping', 'what comes next in', 'the future'],
    introNote: 'Meet the high-level participants and speakers',
    sessionsLabel: 'Sessions',
    items: [
      {
        id: 'constanza-gomez-mont',
        firstName: 'Constanza',
        lastName: 'Gómez Mont',
        role: 'CEO and founder',
        organization: 'C Minds',
        organizationUrl: 'https://www.cminds.co',
        sessions: [
          { id: 'apertura', title: 'Opening: why we are here' },
          { id: 'territorio', title: 'Prosperity begins in the territory' },
        ],
      },
      {
        id: 'juan-carlos-jintiach',
        firstName: 'Juan Carlos',
        lastName: 'Jintiach',
        role: 'Executive secretary',
        organization: 'Global Alliance of Territorial Communities',
        sessions: [{ id: 'territorio', title: 'Prosperity begins in the territory' }],
      },
      {
        id: 'nathalie-molina-nino',
        firstName: 'Nathalie',
        lastName: 'Molina Niño',
        role: 'Founder',
        organization: 'BRAVA Investments',
        sessions: [
          {
            id: 'idea-spark-inversion',
            title: 'Idea Spark: investing in companies that change the story',
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
            title: 'Idea Spark: investing in companies that change the story',
          },
        ],
      },
      {
        id: 'gustavo-manrique',
        firstName: 'Gustavo',
        lastName: 'Manrique',
        role: 'Founder',
        organization: 'Premios Verdes Latam',
        sessions: [{ id: 'idea-spark-industria', title: 'Idea Spark: from solution to industry' }],
      },
      {
        id: 'salah-goss',
        firstName: 'Salah',
        lastName: 'Goss',
        role: 'Chief Program Officer',
        organization: 'Skoll Foundation',
        sessions: [{ id: 'idea-spark-industria', title: 'Idea Spark: from solution to industry' }],
      },
      {
        id: 'pablo-a-gonzalez',
        firstName: 'Pablo A.',
        lastName: 'González',
        role: 'Co-founder',
        organization: 'El Gato y La Caja',
        sessions: [{ id: 'continente', title: 'The continent we want to live in' }],
      },
    ],
  },

  faq: {
    title: 'FAQ',
    items: [
      {
        id: 'cuando',
        question: 'When will the event take place?',
        answer: 'The forum will be held on Monday, October 5, 2026, in Quito, Ecuador.',
      },
      {
        id: 'horario',
        question: 'What are the hours?',
        answer:
          'The event runs from 5:00 PM to 9:00 PM. Attendee check-in opens at 4:30 PM.',
      },
      {
        id: 'organiza',
        question: 'Who organises the event?',
        answer:
          'The forum is organised by NaturaTech LAC, a multi-donor initiative led by C Minds with support from IDB Lab, the Government of France, the Amazon Fund MDTF and Sida/Sweden.',
      },
      {
        id: 'objetivo',
        question: 'What is the goal of the forum?',
        answer:
          'The gathering aims to position the biodiversity, cultural diversity and natural capital of Latin America and the Caribbean as engines of innovation, entrepreneurship, investment and the development of more resilient and regenerative economies.',
      },
      {
        id: 'participantes',
        question: 'Who will take part?',
        answer:
          'The forum brings together representatives from governments, Indigenous communities, startups, development banks, philanthropy, technology and the private sector, creating a cross-sector space for dialogue and building alliances.',
      },
      {
        id: 'formato',
        question: 'What will the format be?',
        answer:
          'An afternoon forum combining high-level plenaries, cross-sector panels, strategic conversations, an award ceremony for outstanding initiatives and a closing cocktail.',
      },
      {
        id: 'publico',
        question: 'Is the event open to the public?',
        answer:
          'Yes. The forum is open to the public, subject to venue capacity and the registration process set by the organisers.',
      },
      {
        id: 'aforo',
        question: 'What attendance is expected?',
        answer: 'Around 150 people are expected to take part.',
      },
      {
        id: 'idiomas',
        question: 'Which languages will be used?',
        answer:
          'Sessions may be held in Spanish and English. Simultaneous interpretation is being considered, though it is not essential for the event to run.',
      },
      {
        id: 'alimentos',
        question: 'Will food and drinks be served?',
        answer:
          'Yes. A welcome coffee break and a closing cocktail are planned, both at the venue.',
      },
      {
        id: 'natura500',
        question: 'What is Natura500 and what is its role during the event?',
        answer:
          'Natura500 is a regional call to identify and showcase companies and initiatives that are part of the nature economy in Latin America and the Caribbean. During the forum the winning initiatives will be recognised in a ceremony, followed by a celebration cocktail.',
      },
      {
        id: 'quito',
        question: 'Why is the event being held in Quito?',
        answer:
          'The gathering aims to position Quito as a regional hub for dialogue, collaboration and innovation around biodiversity, culture and the economies of the future.',
      },
      {
        id: 'cop17',
        question: 'How does the forum relate to COP17?',
        answer:
          'The event is part of the conversations and actions on the road to the COP17 on Biodiversity, to be held in Armenia in October 2026, advancing new alliances, investment models and nature-linked solutions from Latin America and the Caribbean.',
      },
      {
        id: 'get-forum',
        question: 'How does it relate to IDB Lab’s GET Forum?',
        answer:
          'The forum takes place on October 5, 2026, the day before IDB Lab’s GET Forum, creating a complementary space to convene the regional innovation, investment and biodiversity ecosystem in Quito.',
      },
    ],
  },

  registration: {
    join: {
      headlineLine1: 'Join us',
      headlineLine2: 'at natura500 night',
      headlineAccent: 'natura500',
      emailLabel: 'Your email address',
      submit: 'Continue',
      saving: 'One moment...',
      note: 'Limited capacity',
      invalid: 'Enter a valid email',
    },

    choice: {
      step: 'Step 1/3',
      headlineLine1: 'Attend one',
      headlineLine2: 'or both',
      marquee: 'Oceans that connect us',
      awardNote:
        'If you are at GET Forum, join us to celebrate the winners of the NaturaTech LAC 2026 Award.',
      submit: 'Continue',
      needOne: 'Pick at least one to continue',
      selected: 'Selected',
      events: {
        night: 'Natura500 Night',
        award: 'NaturaTech LAC 2026 Award',
      },
      taglines: {
        night: 'A night of innovation and investment for biodiversity and the economies of the future',
        award: 'NaturaTech LAC 2026 Award ceremony',
      },
      scheduleTbc: 'Time to be confirmed',
    },

    details: {
      step: 'Step 2/3',
      stepCompanion: 'Step 2/3',
      headlineLine1: 'Secure',
      headlineLine2: 'your spot',
      companionHeadlineLine1: 'And your',
      companionHeadlineLine2: 'guest details',
      marquee: 'The earth we inhabit',
      fields: {
        name: 'Your name',
        surname: 'Your surname',
        organization: 'Your organization',
        role: 'Your role',
        linkedin: 'LinkedIn',
      },
      companionFields: {
        name: 'Their name',
        surname: 'Their surname',
        organization: 'Their organization',
        role: 'Their role',
        linkedin: 'LinkedIn',
      },
      withCompanion: 'I will bring a guest',
      submit: 'Continue',
      back: 'Back',
      required: 'Fill in the missing details',
    },

    photo: {
      step: 'Step 3/3',
      headlineLine1: 'Almost',
      headlineLine2: 'there',
      marquee: 'Connections we create',
      intro: 'Upload a photo of your choice to create your virtual card.',
      upload: 'Upload image',
      change: 'Change image',
      removing: 'Removing background',
      adjust: 'Adjust framing',
      cropTitle: 'Adjust your photo',
      cropHint: 'Drag to frame the image',
      cropClose: 'Close editor',
      cropConfirm: 'Use this framing',
      cropZoom: 'Zoom',
      cropHorizontal: 'Horizontal',
      cropVertical: 'Vertical',
      submit: 'Confirm attendance',
      sending: 'Confirming',
      back: 'Back',
      tooBig: 'That image is over 8 MB. Pick another or make it smaller.',
      notImage: 'That file is not an image.',
      failed: 'We could not confirm. Please try again.',
    },

    welcome: {
      greeting: 'Hello',
      soonIn: 'See you soon at',
      events: {
        night: 'Natura500 Night',
        award: 'Natura500 Awards',
      },
      nextEvent: 'See the other event',
      previousEvent: 'See the previous event',
      scheduleTbc: 'Time to be confirmed',
      dateLabel: 'October 5, 2026',
      addToCalendar: 'Add to my calendar',
      calendarLabel: 'Pick your calendar',
      calendars: {
        google: 'Google Calendar',
        outlook: 'Outlook',
        ics: 'Apple or other (.ics)',
      },
      /** Se completa con el nombre del acto: el título lo compone la pantalla. */
      calendarTitle: 'CEIBA Quito',
      calendarDescription:
        'A night of innovation and investment for biodiversity and the economies of the future.',
      share: 'Share',
      cardTitle: 'Your card',
      cardFlip: 'Click to flip it',
      preparing: 'Creating your card',
      shareCard: 'Share',
      download: 'Download',
      close: 'Close',
      shareTitle: 'My CEIBA Quito badge',
      shareText: 'See you in Quito, Ecuador.',
      copied: 'Link copied to clipboard',
    },
    eyebrowOpen: '5 spots left',
    eyebrowConfirmed: 'You are one of the 100 guests',
    titleVerify: 'Check your details',
    titleEdit: 'Edit your details',
    greeting: 'Hello',
    photoUpload: 'Upload an image',
    photoChange: 'Change image',
    photoRemoving: 'Removing background…',
    cropAdjust: 'Adjust the photo framing',
    fields: {
      name: 'First name',
      surname: 'Last name',
      email: 'Email',
      organization: 'Organisation',
      role: 'Role',
      linkedin: 'LinkedIn (optional)',
    },
    emailSuggestions: 'Email suggestions',
    submit: 'Confirm attendance',
    submitSaving: 'Saving',
    submitUploading: 'Uploading your image',
    save: 'Save changes',
    cancel: 'Cancel',
    confirmedCta: 'Attendance confirmed',
    lookupLink: 'Already registered? Click here',
    lookupTitle: 'Enter the email you registered with',
    lookupSubmit: 'Open my registration',
    lookupLoading: 'Looking up',
    lookupBack: 'Not registered yet? Click here',
    lookupNotFound: 'That email is not registered yet',
    lookupError: 'The email could not be checked. Try again.',
    yourInformation: 'Your details',
    edit: 'Edit my details',
    eventInformation: 'Event details',
    dateLongLabel: 'Monday, October 5, 2026',
    scheduleNote: 'check-in from 4:30 pm',
    addToCalendar: 'Add to my calendar',
    download: 'Download',
    share: 'Share badge',
    shareTitle: 'My CEIBA Quito badge',
    shareText: 'See you in Quito, Ecuador.',
    badgeName: 'Your name',
    badgeSurname: 'Surname',
    badgeOrganization: 'Your organisation',
    badgePreview: 'Badge preview',
    cropTitle: 'Adjust your photo',
    cropHint: 'Drag to frame the image',
    cropClose: 'Close editor',
    cropConfirm: 'Use this framing',
    cropZoom: 'Zoom',
    cropHorizontal: 'Horizontal',
    cropVertical: 'Vertical',
    errors: {
      required: 'This field is required.',
      email: 'Enter a valid email address.',
      photo: 'Upload a photo to generate your badge.',
      photoType: 'Choose an image file.',
      photoPrepare: 'The image could not be prepared.',
      save: 'The registration could not be saved.',
    },
  },
};
