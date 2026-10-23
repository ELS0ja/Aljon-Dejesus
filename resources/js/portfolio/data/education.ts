import type { Certification, EducationEntry } from '../types/portfolio';

export const education: EducationEntry[] = [
  {
    id: 'ed1',
    institution: 'North Eastern Mindanao State University',
    degree: 'Bachelor of Science in Computer Science',
    field: '',
    start: '2023',
    end: '2027',
    coursework: [
      'Web Development',
      'Database Systems',
      'Object-Oriented Programming',
      'Data Structures & Algorithms',
      'Software Engineering',
      'Information Security',
    ],
    academicProjects: ['[Replace] Capstone project title', '[Replace] Course project title'],
    honors: [],
  },
];

// Leave empty until you have real certifications — the section stays hidden while empty.
export const certifications: Certification[] = [];
