import type { AboutPhoto } from '../types/portfolio';

// Add original photos here; position uses CSS object-position (horizontal vertical).
export const aboutPhotos: AboutPhoto[] = [
  {
    src: '/images/about-original.jpg',
    alt: 'Working on web development projects at a computer workstation',
    position: '50% 50%',
    width: 828,
    height: 1104,
  },
  {
    src: '/images/about-slide-03.jpg',
    alt: 'Friends gathering outdoors for a group photo at night',
    position: '42% 50%',
    width: 2048,
    height: 1536,
  },
  {
    src: '/images/about-slide-04.jpg',
    alt: 'A group of friends celebrating together indoors around a table',
    position: '50% 50%',
    width: 2048,
    height: 1536,
  },
  {
    src: '/images/about-slide-02.jpg',
    alt: 'Computer science students posing together along a campus balcony',
    position: '50% 50%',
    width: 720,
    height: 480,
  },
];

// PLACEHOLDER — rewrite in your own words.
export const aboutBio =
  "I'm a passionate Full-Stack Developer interested in building reliable, user-friendly web applications. I enjoy transforming ideas into practical digital solutions by combining clean frontend interfaces, secure backend logic, and well-structured databases. I'm continuously improving my skills through hands-on projects and exploring opportunities to contribute to a professional development team.";

export const aboutHighlights = [
  {
    id: 'philosophy',
    icon: 'compass',
    title: 'Development philosophy',
    text: 'Readable code, secure defaults, and interfaces that respect the people using them. I would rather ship something simple that works than something clever that breaks.',
  },
  {
    id: 'problem-solving',
    icon: 'lightbulb',
    title: 'Problem-solving approach',
    text: 'Understand the requirement, sketch the data model, build the smallest working version, then test and refine — one verified step at a time.',
  },
  {
    id: 'learning',
    icon: 'target',
    title: 'Currently learning',
    text: '[Replace] e.g. REST API design, automated testing in PHP, and deploying applications to production hosting.',
  },
] as const;

export const projectTypes = [
  'Database-driven web apps',
  'Admin dashboards & CRUD tools',
  'Responsive marketing sites',
  'Form-heavy, validated workflows',
];
