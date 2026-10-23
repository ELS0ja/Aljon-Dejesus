import type { ExperienceEntry } from '../types/portfolio';

// Set to true once you add formal work experience — the section title switches to "Experience".
export const hasFormalExperience = false;

// PLACEHOLDER — replace with your real academic, personal, and collaborative work.
export const experience: ExperienceEntry[] = [
  {
    id: 'e1',
    title: 'Full-Stack Developer — Capstone Project',
    organization: '[Your University]',
    type: 'Academic Project',
    start: '[Month YYYY]',
    end: '[Month YYYY]',
    responsibilities: [
      '[Replace] Designed the relational database schema and wrote the SQL migrations.',
      '[Replace] Built PHP controllers for CRUD operations using PDO prepared statements.',
      '[Replace] Implemented a responsive interface and client-side validation.',
    ],
    technologies: ['PHP', 'MySQL', 'JavaScript', 'Git'],
  },
  {
    id: 'e2',
    title: 'Personal Development Projects',
    organization: 'Self-directed',
    type: 'Personal Projects',
    start: '[Month YYYY]',
    end: 'Present',
    responsibilities: [
      '[Replace] Building small web apps to practice authentication, sessions, and secure forms.',
      '[Replace] Publishing source code and documentation on GitHub.',
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'PHP'],
  },
  {
    id: 'e3',
    title: 'Team Collaboration',
    organization: '[Course or Club Name]',
    type: 'Collaboration',
    start: '[Month YYYY]',
    end: '[Month YYYY]',
    responsibilities: [
      '[Replace] Collaborated in a team using Git branches and pull requests.',
      '[Replace] Participated in code reviews and task planning.',
    ],
    technologies: ['Git', 'GitHub'],
  },
];
