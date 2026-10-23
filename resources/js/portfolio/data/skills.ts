import type { SkillCategory } from '../types/portfolio';

export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    description: 'Semantic, responsive interfaces that work for everyone.',
    icon: 'frontend',
    skills: [
      { name: 'HTML5', icon: 'html' },
      { name: 'CSS3', icon: 'css' },
      { name: 'JavaScript', icon: 'js' },
      { name: 'Responsive Web Design', icon: 'responsive' },
      { name: 'Accessibility Fundamentals', icon: 'a11y' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend Development',
    description: 'Server-side logic that is validated and secure by default.',
    icon: 'backend',
    skills: [
      { name: 'PHP', icon: 'php' },
      { name: 'Server-side Validation', icon: 'validation' },
      { name: 'REST API Fundamentals', icon: 'api' },
      { name: 'Authentication & Sessions', icon: 'auth' },
    ],
  },
  {
    id: 'database',
    title: 'Database Management',
    description: 'Relational data modelled cleanly and queried efficiently.',
    icon: 'database',
    skills: [
      { name: 'MySQL', icon: 'mysql' },
      { name: 'Schema Design', icon: 'schema' },
      { name: 'SQL Queries', icon: 'sql' },
      { name: 'CRUD Operations', icon: 'crud' },
      { name: 'Relational Fundamentals', icon: 'relations' },
    ],
  },
  {
    id: 'tools',
    title: 'Development Tools',
    description: 'The everyday workflow for building and shipping.',
    icon: 'tools',
    skills: [
      { name: 'Git', icon: 'git' },
      { name: 'GitHub', icon: 'github' },
      { name: 'VS Code', icon: 'vscode' },
      { name: 'XAMPP', icon: 'xampp' },
      { name: 'Composer', icon: 'composer' },
    ],
  },
];
