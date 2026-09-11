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
    terms: {
      title: 'Terms and conditions',
      description: 'Terms for using this site and registering for CEIBA Quito.',
    },
    tanusas: {
      title: 'Tanusas Retreat 2026',
      description:
        'CEIBA Council retreat at Tanusas, Puerto Cayo: three days to co-design the Capital Architecture for BioProsperity.',
    },
    privacy: {
      title: 'Privacy notice',
      description: 'What data we ask for to register you for CEIBA Quito, and what we do with it.',
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
    feature: {
      name: 'Premio 2026',
      time: '16:00 - 16:45',
      venue: 'UDLA Arena · Quito, Ecuador',
    },
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
    introNotePending: 'Speaker reveal coming soon',
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
      stepGuest: 'Step 2/3',
      headlineLine1: 'Secure',
      headlineLine2: 'your spot',
      guestHeadlineLine1: 'Invite',
      guestHeadlineLine2: 'your guest',
      marquee: 'The earth we inhabit',
      fields: {
        name: 'Your name',
        surname: 'Your surname',
        organization: 'Your organization',
        role: 'Your role',
        linkedin: 'LinkedIn',
      },
      guestFields: {
        name: 'Their name',
        email: 'Their email address',
      },
      guestNote: 'We will email them to complete their registration and confirm their place.',
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
      required: 'Upload a photo to continue',
      tooBig: 'That image is over 8 MB. Pick another or make it smaller.',
      notImage: 'That file is not an image.',
      failed: 'We could not confirm. Please try again.',
      edit: {
        step: 'Your badge',
        headlineLine1: 'Change',
        headlineLine2: 'your photo',
        intro: 'Upload the image you want on your virtual card.',
        submit: 'Save image',
        sending: 'Saving',
      },
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
      guestLabel: 'Your guest:',
      guestPending: 'Yet to complete their registration',
      guestConfirmed: 'Registration complete',
      addPhoto: 'Add my photo',
      changePhoto: 'Change my photo',
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

  legal: {
    common: {
      updated: 'Last reviewed:',
      contactTitle: 'Contact',
      controllerLabel: 'Data controller',
      emailLabel: 'Contact email',
      jurisdictionLabel: 'Governing law',
      pending: 'To be defined',
    },

    privacy: {
      title: 'Privacy notice',
      intro:
        'This notice explains what personal data we ask for when you register for CEIBA Quito, what we use it for, where it is stored and what you can ask us to do with it. It is written to be understood without a law degree.',
      contact:
        'To exercise any of your rights, or if anything here is unclear, write to us. We reply to the address you write from.',
      sections: [
        {
          id: 'datos',
          title: 'What we ask for',
          body: ['When you register we collect only what we need to issue your badge and manage capacity:'],
          list: [
            'First name and surname.',
            'Email address.',
            'Organization and role.',
            'LinkedIn profile, if you choose to add it.',
            'A photo of you, which goes on the badge.',
            'Which of the day’s events you will attend.',
            'If you bring a companion, the same details for them.',
          ],
        },
        {
          id: 'usos',
          title: 'What we use it for',
          body: ['For the event only. Specifically:'],
          list: [
            'Managing your registration and the capacity, which is limited.',
            'Issuing your digital badge with your name, organization and photo.',
            'Sending you the attendance confirmation and the practical details.',
            'Identifying you at the door on the day.',
            'Telling you if anything about the programme or the venue changes.',
          ],
        },
        {
          id: 'base',
          title: 'On what basis',
          body: [
            'On your consent, which you give by completing the registration. Registering is voluntary: you may withhold consent, and you may withdraw it later by asking us to delete your data — though in that case we cannot issue your badge or let you in.',
          ],
          list: [],
        },
        {
          id: 'fotografia',
          title: 'Your photo',
          body: [
            'The photo is processed in your own browser: that is where the background is removed and the image is cropped to the framing you pick. Only the cropped version is stored, and it is used solely for your badge.',
            'We do not run facial recognition or any other biometric analysis on it.',
          ],
          list: [],
        },
        {
          id: 'proveedores',
          title: 'Where it is stored and who helps us process it',
          body: [
            'We run no servers of our own: we use providers that process the data on our instructions and only for what is described here.',
          ],
          list: [
            'The registration database is on Prisma Postgres.',
            'Photos are stored on Cloudflare R2.',
            'Confirmation emails are sent through Resend.',
            'The site is served from Vercel.',
            'Their servers are outside Ecuador, so your data is transferred internationally in order to provide the service.',
          ],
        },
        {
          id: 'plazo',
          title: 'How long we keep it',
          body: [
            'Up to twelve months after the event, so we can answer later questions and account for the convening. After that it is deleted. If you ask us to delete it sooner, we do.',
          ],
          list: [],
        },
        {
          id: 'terceros',
          title: 'Who we share it with',
          body: [
            'Nobody beyond the providers listed above. We do not sell, rent or pass on your data for advertising, and we do not share it with other attendees, sponsors or event partners.',
            'We would hand it to an authority only where a rule obliges us to.',
          ],
          list: [],
        },
        {
          id: 'acompanante',
          title: 'Your companion’s data',
          body: [
            'If you register a companion, you are telling us you have their permission to give us their details and that you have shown them this notice. We treat their data exactly as we treat yours, for the same period, and they have exactly the same rights.',
          ],
          list: [],
        },
        {
          id: 'derechos',
          title: 'What you can ask of us',
          body: ['At any time, by writing to the address at the end of this page:'],
          list: [
            'Access the data we hold about you.',
            'Correct anything wrong or incomplete.',
            'Delete your registration, photo included.',
            'Withdraw your consent.',
            'Object to a particular use of your data.',
          ],
        },
        {
          id: 'navegador',
          title: 'What the site stores in your browser',
          body: [
            'We use no advertising, tracking or third-party cookies, and we do not measure your browsing with analytics tools.',
            'All that stays in your browser is what the site needs to work: your attendance confirmation, the draft of your registration while you complete it, and your light or dark theme preference. None of it leaves your device, and clearing the site data removes it.',
          ],
          list: [],
        },
        {
          id: 'cambios',
          title: 'Changes to this notice',
          body: [
            'If we change anything, we update the review date shown above. If the change affects what we use your data for, we will tell you at the address you registered with.',
          ],
          list: [],
        },
      ],
    },

    terms: {
      title: 'Terms and conditions',
      intro:
        'These terms govern the use of this site and registration for CEIBA Quito on October 5, 2026. By registering, you accept them.',
      contact:
        'If you have questions about these terms, or need anything from the organizing team, write to us.',
      sections: [
        {
          id: 'registro',
          title: 'Registration',
          body: [
            'Capacity is limited and registrations are handled in the order they arrive. Completing the form does not secure your place until you receive the confirmation.',
            'The details you give us must be yours and must be true. A registration with false details, or under someone else’s identity, may be cancelled without notice.',
            'One registration is one person. If you bring a companion, you must register them too, with their own details.',
          ],
          list: [],
        },
        {
          id: 'credencial',
          title: 'Your badge',
          body: [
            'The badge the site generates is personal and non-transferable: it identifies you at the door and may not be passed on or shared.',
            'On the day we may ask for photo ID to check that it matches the badge.',
          ],
          list: [],
        },
        {
          id: 'acceso',
          title: 'Access to the event',
          body: [
            'Entry is free and by invitation. The organizing team may refuse or withdraw access to anyone who cannot evidence their registration, who arrives with someone else’s badge, or whose behaviour puts at risk or disturbs other attendees, the staff or the venue.',
            'Inside the venue, its rules and the staff’s instructions apply.',
          ],
          list: [],
        },
        {
          id: 'programa',
          title: 'The programme may change',
          body: [
            'The published agenda is preliminary: times, sessions and the people taking part may change up to the day itself.',
            'If the event has to change date, venue or format, we will tell you at the address you registered with.',
          ],
          list: [],
        },
        {
          id: 'imagenes',
          title: 'Photography and recording at the event',
          body: [
            'The event may be photographed and filmed for reporting and for promoting the convening. By attending, you may appear in those images.',
            'If you would rather not appear, tell us in writing before the event or on arrival and we will take it into account.',
          ],
          list: [],
        },
        {
          id: 'propiedad',
          title: 'Site content',
          body: [
            'The text, images, logos and design of this site belong to the event organizers or to those who licensed them to us. You are free to share the links and your own badge; any other use — reproducing content, using the marks — needs written permission.',
          ],
          list: [],
        },
        {
          id: 'enlaces',
          title: 'Links to other sites',
          body: [
            'The site links out to third-party pages — LinkedIn profiles, maps, calendars, the sites of participating organizations. We do not control their content or their terms, so what happens there is their responsibility.',
          ],
          list: [],
        },
        {
          id: 'responsabilidad',
          title: 'Availability and liability',
          body: [
            'We take care to keep the site working and the information current, but we cannot guarantee uninterrupted availability or freedom from errors. If you spot one, we appreciate the heads-up.',
            'We are not liable for damage arising from using the site other than as intended, or from failures outside our control such as your connection or your device.',
          ],
          list: [],
        },
        {
          id: 'datos',
          title: 'Your personal data',
          body: [
            'How we handle registration data is set out in the privacy notice, which forms part of these terms.',
          ],
          list: [],
        },
        {
          id: 'ley',
          title: 'Governing law',
          body: [
            'These terms are governed by the law stated at the end of this page, and any dispute will be submitted to its courts.',
          ],
          list: [],
        },
        {
          id: 'cambios',
          title: 'Changes to these terms',
          body: [
            'We may update them; the review date above says when we last did. If a change is substantive and affects you as a registered attendee, we will tell you by email.',
          ],
          list: [],
        },
      ],
    },
  },

  tanusas: {
    nav: {
      label: 'Retreat sections',
      invitation: 'Invitation',
      concept: 'Concept',
      architecture: 'Architecture',
      place: 'Place',
      agenda: 'Agenda',
      rsvp: 'Confirm',
    },

    hero: {
      wordmarkAlt: 'Tanusas',
      headline:
        'Three days to co-design the Capital Architecture for BioProsperity in Latin America and the Caribbean.',
      facts: [
        { label: 'Dates', value: 'October 8 – 10, 2026' },
        { label: 'Place', value: 'Tanusas, Puerto Cayo · Manabí, Ecuador' },
        { label: 'Format', value: 'Residential retreat · 12 – 15 people' },
      ],
      cta: 'Confirm attendance',
      emailLabel: 'Your email address',
      emailPlaceholder: 'Your email address',
      emailSubmit: 'Continue with this email',
      emailChecking: 'Checking your email',
      emailInvalid: 'Please enter a valid email',
      note: 'Please confirm before September 15*',
      personal: 'Personal invitation',
      partners: {
        initiative: 'An initiative by',
        coled: 'Co-led by',
      },
    },

    invitation: {
      number: '01',
      kicker: 'The invitation',
      title: 'We want you at the table where this gets built',
      body: [
        'After the GET Forum, from October 8 to 10, we will gather at Tanusas, on the coast of Ecuador, a small group of people from the CEIBA Council whose experience, vision and capacity to act we consider essential to take a next step towards BioProsperity in the region.',
        'We want three days away from the usual pace and formats, and to create the conditions to think deeply, question ourselves, build trust and work together.',
        'We are not looking to arrive with all the answers. We are looking for perspectives that put pressure on the assumptions, enrich the architecture and help us turn it into something that can be tested in the territories.',
      ],
      questionLabel: 'We start from one question',
      question:
        'How can we innovate in the building of prosperity by recognizing the economy as part of a living system, and making it possible for nature, the cultures and the communities that sustain it to prosper together?',
    },

    concept: {
      number: '02',
      kicker: 'The concept',
      title: 'What is a BioProsperity System?',
      body: [
        'The problem is not only that funding for biodiversity is missing: it is that the systems sustaining ecological integrity and socioeconomic prosperity are financed, governed and managed as if they were separate. Capital arrives fragmented and reinforces silos instead of coherence.',
        'We have become very effective at financing production and transactions, and very ineffective at financing the conditions that make prosperity possible.',
        'BioProsperity names a simple conviction: ecological integrity, community wellbeing, cultural continuity and regenerative economic value are not competing goals. They are interdependent outcomes of healthy territorial systems. If resilience is systemic, the ways to finance and govern it must be systemic too.',
        'A BioProsperity System is transition infrastructure: an integrated portfolio of interrelated processes, coordinated and financed together under a 10 to 20 year transformation path, to strengthen the capacity of a biodiverse and biocultural territory to generate, retain and recirculate ecological, social, cultural and economic value across generations.',
      ],
      facts: [
        {
          label: 'Demonstrator scale',
          value:
            '500,000 hectares across biodiversity and culture hotspots, aggregated among the system’s custodial partners.',
        },
        {
          label: 'Horizon',
          value: '10–20 years of a transformation path coordinated and financed as a single portfolio.',
        },
        {
          label: 'Flagship metric · Territorial value retention',
          value:
            'The share of generated value that stays, is reinvested or recirculates within the territory.',
        },
      ],
      dimensionsTitle: 'Five interdependent dimensions',
      dimensionsNote:
        'They are not separate sectors: they work as a coordinated portfolio. None holds up in isolation. Open each one to see what it contains.',
      dimensions: [
        {
          question: '01 · Processes that increase ecological integrity',
          answer:
            'Water function, biodiversity, ecosystem connectivity, soil regeneration and ecosystem health, maintained and expanded as resilience infrastructure.',
        },
        {
          question: '02 · Nature-positive industries and associative value systems',
          answer:
            'Diversified, regenerative economic activity: agroforestry, fisheries, restoration services, nature tourism, value-added processing and emerging bioeconomy.',
        },
        {
          question: '03 · Cultural continuity and biocultural heritage',
          answer:
            'Languages, traditional knowledge and technologies, intergenerational learning, biocultural governance and place-based identities.',
        },
        {
          question: '04 · Community wellbeing and Buen Vivir',
          answer:
            'Communities’ own life plans: food sovereignty, clean water, health and energy, with explicit commitments to child nutrition and gender equity in local governance.',
        },
        {
          question: '05 · Capital flows and territorial connectivity',
          answer:
            'Circulation and coordination of financial, intellectual, social, technological, political and cultural capital between rural and urban territories.',
        },
        {
          question: '↺ · And, cutting across all of them: territorial governance and coordination',
          answer:
            'The articulating mechanism that aligns conservation, economic development, culture and wellbeing into a shared territorial vision.',
        },
      ],
    },

    architecture: {
      number: '03',
      kicker: 'The architecture',
      title: 'The Custodial Capital Architecture',
      body: [
        'The innovation is not a new fund: it is a new way of coordinating capital around the resilience of living systems. Each BioProsperity System works as an integrated portfolio whose performance depends on the health of the whole territory, not on maximizing returns project by project.',
        'It is in early design stages: that is why we are going to Tanusas.',
      ],
      principlesTitle: 'Three principles',
      principles: [
        {
          title: 'Sequencing',
          body: 'Philanthropic and concessional capital opens governance, trust and evidence; as risk comes down, impact, commercial and institutional capital step in.',
        },
        {
          title: 'Stacking',
          body: 'Grants, catalytic capital, concessional finance, impact investment and commercial capital coexist in the same system according to their risk tolerance and expected return.',
        },
        {
          title: 'Diversification',
          body: 'Economic sovereignty grows stronger with complementary sources of value, not with dependence on a single chain or commodity.',
        },
      ],
      functionsTitle: 'Functions of capital',
      functions: [
        {
          question: 'Philanthropic and catalytic',
          answer:
            'Governance, systems mapping, resilience measurement, trust and first risk mitigations.',
        },
        {
          question: 'Performance-linked investment',
          answer:
            'Long-term financing for productive activity and infrastructure, with returns tied to the system’s flows.',
        },
        {
          question: 'Results-based capital',
          answer: 'Recognizes verified ecological performance: biodiversity, carbon, water, soils.',
        },
      ],
      portfolioTitle: 'The portfolio, in three horizons',
      portfolio: [
        {
          question: 'Transition enterprises',
          answer: 'Productive sectors and regenerative industries with short-term revenue and stability.',
        },
        {
          question: 'Emerging nature-positive industries',
          answer:
            'New enterprises and value systems with medium-term growth, diversification and innovation.',
        },
        {
          question: 'Future pipelines',
          answer: 'Research, science and experimentation that build tomorrow’s adaptive capacity.',
        },
      ],
      thesisTitle: 'The investment thesis',
      thesis: [
        'Long-term financial performance depends on the resilience of the ecological, governance and productive systems that sustain economic activity. Regeneration is not a cost of performance: it is its condition.',
        'A second enabling mechanism goes with it: the BioProsperous Value System, multicapital and biocultural, which makes visible the forms of value that sustain resilience without reducing nature or culture to monetary terms.',
      ],
    },

    goals: {
      number: '04',
      kicker: 'What we are after',
      title: 'Leaving Tanusas with three things built',
      intro:
        'We will work on how to finance the resilience of a territory as a whole system: what capital must sustain, which kinds of capital need to meet, in what sequence, how to build portfolios that jointly finance ecological integrity, territorial economies, culture, wellbeing and governance, and which principles should be non-negotiable.',
      outcomes: [
        {
          number: '01',
          title: 'A first Capital Architecture for BioProsperity',
          body: 'Functions, sequence, capital mix and safeguards.',
        },
        {
          number: '02',
          title: 'The decisions to publish the BioProsperity Systems Framework',
          body: 'Structure, authorship, scope and publication path for the framework and its capital architecture.',
        },
        {
          number: '03',
          title: 'A 12-month path to test it',
          body: 'Candidate territories in Latin America and the Caribbean, with first actors, responsibilities and milestones.',
        },
      ],
      planesTitle: 'How we will work · five planes at once',
      planes: [
        {
          title: 'Relational',
          body: 'Trust and bonds able to hold disagreement and long collaboration.',
        },
        {
          title: 'Conceptual',
          body: 'A shared language about value, wellbeing, governance and regeneration.',
        },
        {
          title: 'Strategic',
          body: 'Clarity on architecture, pilots, risks and questions to test.',
        },
        {
          title: 'Practical',
          body: 'Owners, contributions and concrete next steps.',
        },
        {
          title: 'Personal',
          body: 'A renewed connection with nature, the body and the meaning of the work.',
        },
      ],
      format: 'Format: four deep working tables, walks, sea and food from the forest.',
    },

    place: {
      number: '05',
      kicker: 'The place',
      title: 'Tanusas: edible forest, sea and territory',
      body: [
        'Tanusas sits in Puerto Cayo, on the coast of Manabí: a place where the tropical dry forest reaches the sea. We chose this setting because the territory works too: walking, eating and talking there changes the conversation.',
        'Its restaurant Boca Valdivia, by chef Rodrigo Pacheco, cooks from an edible forest planted in that same territory: hundreds of native species, agroforestry and artisanal fishing in dialogue with neighbouring communities. It is, in practice, a living demonstration of bioprosperity and one of our classrooms during these days.',
        'The programme moves between the working table, the forest and the beach: guayusa mornings, a swim in the sea for whoever wants one, observation walks with Rodrigo, and gatherings facing the sunset to think out loud.',
      ],
      locationTitle: 'Location',
      location: [
        { label: 'Venue', value: 'Puerto Cayo · Manabí' },
        { label: 'From Manta', value: '≈ 1 h by car' },
        { label: 'Quito – Manta flight', value: '≈ 55 min' },
        { label: 'Ecosystem', value: 'Tropical dry forest' },
      ],
      closing:
        'Activities include walking the edible forest, gatherings by the sea and dedicated work to build the capital architecture: a curated group, from several countries and perspectives, with the intention of getting to work.',
    },

    agenda: {
      number: '06',
      kicker: 'General agenda',
      title: 'Three days, a different pace',
      days: [
        {
          tab: 'Thursday 8',
          title: 'Arrival, transfer and opening',
          rows: [
            { time: 'Morning', text: 'Arrival in Quito. Each person arranges their own flight to Quito.' },
            {
              time: '12:00',
              text: 'Meeting point at Quito airport. We travel together from here.',
            },
            { time: '15:45', text: 'Quito → Manta flight.' },
            {
              time: 'Afternoon',
              text: 'Arrival in Manta and road transfer to Tanusas. Check-in and time to land.',
            },
            {
              time: 'Evening',
              text: 'Bonfire of intentions: a shared dinner, the CEIBA opening and a round. What am I arriving with? What do I want to understand? What can I contribute?',
            },
          ],
        },
        {
          tab: 'Friday 9',
          title: 'A full day of working tables',
          rows: [
            {
              time: 'Sunrise',
              text: 'Optional: silence, guayusa and tobacco with our Indigenous allies, a swim in the sea.',
            },
            {
              time: 'Breakfast',
              text: 'Edible forest breakfast with Rodrigo Pacheco: where food comes from and how it relates to territory, nutrition and regeneration.',
            },
            {
              time: 'Morning',
              text: 'Tables I and II · Capital stacking. What must capital sustain? Which capitals and capabilities need to meet, and what function does each one serve?',
            },
            { time: 'Midday', text: 'Edible forest lunch and unscheduled rest.' },
            {
              time: 'Afternoon',
              text: 'Table III · Portfolio. How to finance resilience as a system and not as a set of profitable assets.',
            },
            {
              time: 'Sunset',
              text: 'A walk in pairs facing the sea. Which idea did I let go of? What do I see now that I did not see before? Then a celebration dinner.',
            },
          ],
        },
        {
          tab: 'Saturday 10',
          title: 'Forest, synthesis and closing',
          rows: [
            {
              time: 'Early',
              text: 'Into the edible forest with Rodrigo Pacheco: walking, observing and conversations on foot. Circle in the forest: one lesson from the territory per person.',
            },
            {
              time: 'Morning',
              text: 'Table IV · Weaving the path. Synthesis, decisions, publication structure, demonstration route and commitments.',
            },
            {
              time: '13:00',
              text: 'Closing lunch and final circle: one gratitude, one commitment and a connection that continues.',
            },
            {
              time: '15:00',
              text: 'Coordinated departure to Manta airport and other connection points.',
            },
          ],
        },
      ],
      note: 'General agenda, subject to adjustments. Flight and transfer times will be confirmed with each person before tickets are bought.',
    },

    practical: {
      number: '07',
      kicker: 'The practical side',
      title: 'What accepting this invitation involves',
      items: [
        {
          title: 'Participation',
          body: 'A personal, non-transferable invitation, with active participation across all three days.',
        },
        {
          title: 'Group',
          body: 'Between 12 and 15 people from the CEIBA Council and allies, from multiple countries and perspectives.',
        },
        {
          title: 'Transfers and stay',
          body: 'We coordinate the Quito–Manta flight, road transfers, accommodation and meals at Tanusas.',
        },
        {
          title: 'What to bring',
          body: 'Light and walking clothes, swimwear, sun protection, and a question you really care about.',
        },
      ],
    },

    registration: {
      details: {
        step: 'Step 1/3',
        headlineLine1: 'Save',
        headlineLine2: 'your place',
        intro:
          'We are twelve to fifteen people, so every place counts. We use these details to prepare your arrival and to design the three days.',
        fields: {
          name: 'First name',
          surname: 'Last name',
          organization: 'Organisation',
          role: 'Role',
          city: 'City you fly from',
          question: 'A question that really matters to you',
        },
        placeholders: {
          name: 'Your first name',
          surname: 'Your last name',
          organization: 'Where you work',
          role: 'What you do there',
          city: 'Where you fly to Quito from',
          question: 'The one you would bring to the table',
        },
        hints: {
          city: 'We coordinate the Quito–Manta leg together.',
          question: 'It feeds into the design of the retreat conversations.',
        },
        submit: 'Continue',
        required: 'Please complete the highlighted fields',
      },

      diet: {
        step: 'Step 2/3',
        headlineLine1: 'How we',
        headlineLine2: 'look after you',
        intro:
          'We eat together all three days and the kitchen is prepared around what you tell us. Tick everything that applies.',
        options: {
          none: 'No restrictions',
          vegetarian: 'Vegetarian',
          vegan: 'Vegan',
          glutenFree: 'Gluten free',
          lactoseFree: 'Lactose free',
          allergy: 'Food allergy',
          health: 'Health condition',
        },
        descriptions: {
          none: 'I eat everything',
          vegetarian: 'No meat or fish',
          vegan: 'Nothing of animal origin',
          glutenFree: 'Coeliac or intolerant',
          lactoseFree: 'Lactose intolerant',
          allergy: 'Tell us what to, below',
          health: 'Something we should know',
        },
        notesLabel: 'Tell us the details',
        notesPlaceholder: 'What you are allergic to, or what we should bear in mind',
        notesRequired: 'Please tell us the details of what you ticked',
        needOne: 'Tick at least one option',
        selected: 'Selected',
        submit: 'Continue',
        back: 'Back',
      },

      done: {
        greeting: 'Hello',
        greetingFallback: 'Your place is saved',
        body:
          'We will write to coordinate the Quito–Manta flight and transfers, and to send you the detailed agenda with the pre-reading materials.',
        emailLabel: 'Email',
        retreatLabel: 'Retreat',
        retreatValue: 'Oct 8 – 10, 2026 · Tanusas',
        dietLabel: 'At the table',
        edit: 'Edit my registration',
        addToCalendar: 'Add to my calendar',
        calendarLabel: 'Choose your calendar',
        calendars: {
          google: 'Google Calendar',
          outlook: 'Outlook',
          ics: 'Download .ics',
        },
        calendarTitle: 'CEIBA Retreat · Tanusas',
        calendarDescription:
          'Three days to co-design the Capital Architecture for BioProsperity in Latin America and the Caribbean.',
        card: 'See my badge',
        cardTitle: 'Your retreat badge',
        cardFlip: 'Flip the card',
        cardClose: 'Close',
        preparing: 'Preparing your badge',
        download: 'Download',
        share: 'Share',
        shareTitle: 'CEIBA Retreat · Tanusas 2026',
        shareText: 'See you at Tanusas, October 8 – 10, 2026.',
        shared: 'Badge shared',
        copied: 'Link copied',
        shareFailed: 'Could not share. Download it and share it yourself.',
      },

      failed: 'We could not save your registration. Please try again.',
    },

    closing: {
      quote: 'New economies are being woven from the forests, the coasts and the communities.',
      invite: 'It would give us enormous joy to build this next step with you.',
      cta: 'Confirm my place',
      partners:
        'NaturaTech LAC is an initiative driven by IDB Lab and co-led by C Minds, with the support of Sweden, the Government of France, Climate Collective and the CEIBA Council network.',
      credit: 'CEIBA Council · NaturaTech LAC',
    },
  },
};
