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
  },

  speakers: {
    listTitle: 'All speakers',
    introHeadline: ['The people shaping', 'what comes next in', 'the future'],
    introNote: 'Meet the high-level participants and speakers',
    sessionsLabel: 'Sessions',
    items: [
      {
        id: 'regina-cervera',
        firstName: 'Regina',
        lastName: 'Cervera',
        role: 'Head of innovation programmes',
        organization: 'C Minds',
        organizationUrl: 'https://www.cminds.co',
        linkedinUrl: 'https://www.linkedin.com',
        sessions: [
          { id: 's1', title: 'Bioregions panel: nature and the economies of the future' },
        ],
      },
      {
        id: 'mateo-vargas',
        firstName: 'Mateo',
        lastName: 'Vargas',
        role: 'Director of impact investment',
        organization: 'IDB Lab',
        organizationUrl: 'https://bidlab.org',
        linkedinUrl: 'https://www.linkedin.com',
        sessions: [
          { id: 's2', title: 'Natural capital as an engine for new economies' },
          { id: 's3', title: 'Strategic conversation: financing for biodiversity' },
        ],
      },
      {
        id: 'lucia-ordonez',
        firstName: 'Lucía',
        lastName: 'Ordóñez',
        role: 'Bioeconomy coordinator',
        organization: 'Amazon Fund',
        linkedinUrl: 'https://www.linkedin.com',
        sessions: [{ id: 's4', title: 'Amazonian bioeconomy: from the plot to the market' }],
      },
      {
        id: 'andres-quispe',
        firstName: 'Andrés',
        lastName: 'Quispe',
        role: 'Communities and territory lead',
        organization: 'Amazonía Viva',
        linkedinUrl: 'https://www.linkedin.com',
        sessions: [{ id: 's5', title: 'Indigenous knowledge and public policy design' }],
      },
      {
        id: 'camila-restrepo',
        firstName: 'Camila',
        lastName: 'Restrepo',
        role: 'Founder',
        organization: 'Natura500',
        organizationUrl: 'https://www.cminds.co',
        linkedinUrl: 'https://www.linkedin.com',
        sessions: [{ id: 's6', title: 'Recognising nature economy initiatives' }],
      },
      {
        id: 'joao-pereira',
        firstName: 'João',
        lastName: 'Pereira',
        role: 'Lead climate researcher',
        organization: 'Climate Collective',
        organizationUrl: 'https://climatecollective.org',
        sessions: [{ id: 's7', title: 'Open data for measuring natural capital' }],
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
