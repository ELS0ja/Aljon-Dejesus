import type { Project } from '../types/portfolio';

// PLACEHOLDER PROJECTS — example entries only. Replace with projects you have actually built.
export const projects: Project[] = [
  {
    id: 'p1',
    slug: 'student-management-system',
    title: 'Student Management System',
    category: 'Full-Stack',
    problem: 'Schools often track student records in scattered spreadsheets that are hard to search and easy to corrupt.',
    description:
      'A web application for managing student information, academic records, and administrative tasks from one secure dashboard.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    features: [
      'Role-based login for administrators and staff',
      'Create, search, update, and archive student records',
      'Grade and enrollment tracking per course',
      'Server-side validation with PDO prepared statements',
    ],
    contribution: '[Replace] Describe what you personally designed and built — e.g. database schema, auth flow, UI.',
    githubUrl: 'https://github.com/your-username/student-management-system',
    accent: 'blue',
    thumbnail: 'dashboard',
    isPlaceholder: true,
  },
  {
    id: 'p2',
    slug: 'task-management-app',
    title: 'Personal Task Management App',
    category: 'Full-Stack',
    problem: 'Daily priorities get lost between notes apps, sticky notes, and memory.',
    description:
      'An application for organizing tasks, tracking completion, and managing daily priorities with due dates and categories.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    features: [
      'Add, edit, complete, and delete tasks',
      'Priority levels and due-date sorting',
      'Category filters and progress summary',
      'Per-user data with secure sessions',
    ],
    contribution: '[Replace] Describe your role and the parts you implemented.',
    githubUrl: 'https://github.com/your-username/task-manager',
    accent: 'violet',
    thumbnail: 'tasks',
    isPlaceholder: true,
  },
  {
    id: 'p3',
    slug: 'portfolio-showcase',
    title: 'Online Portfolio & Project Showcase',
    category: 'Full-Stack',
    problem: 'Updating a static portfolio means editing HTML by hand every time a project changes.',
    description:
      'A dynamic website for displaying development projects and professional information, with a PHP-powered admin dashboard.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    features: [
      'Admin CRUD for projects with image uploads',
      'Contact form with CSRF protection and rate limiting',
      'Message inbox with read/unread status',
      'Responsive, accessible public site',
    ],
    contribution: '[Replace] Describe your role and the parts you implemented.',
    githubUrl: 'https://github.com/your-username/portfolio',
    accent: 'emerald',
    thumbnail: 'showcase',
    isPlaceholder: true,
  },
  {
    id: 'p4',
    slug: 'inventory-rest-api',
    title: 'Inventory REST API',
    category: 'Backend',
    problem: 'Small shops need a simple, reliable way for other tools to read and update stock levels.',
    description:
      'A JSON REST API for products and stock movements, with token authentication and consistent error responses.',
    technologies: ['PHP', 'MySQL', 'REST', 'JSON'],
    features: [
      'Resource endpoints with proper HTTP status codes',
      'Input validation and structured error messages',
      'Pagination and filtering on list endpoints',
    ],
    contribution: '[Replace] Describe your role and the parts you implemented.',
    githubUrl: 'https://github.com/your-username/inventory-api',
    accent: 'blue',
    thumbnail: 'api',
    isPlaceholder: true,
  },
  {
    id: 'p5',
    slug: 'responsive-landing-page',
    title: 'Responsive Landing Page',
    category: 'Frontend',
    problem: 'A local business needed a fast, mobile-friendly page that clearly explains its services.',
    description:
      'A semantic, accessible landing page built mobile-first with CSS Grid, Flexbox, and lightweight vanilla JavaScript.',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    features: [
      'Mobile-first layout from 320px upwards',
      'Accessible navigation and keyboard support',
      'Optimized images with lazy loading',
    ],
    contribution: '[Replace] Describe your role and the parts you implemented.',
    githubUrl: 'https://github.com/your-username/landing-page',
    accent: 'violet',
    thumbnail: 'landing',
    isPlaceholder: true,
  },
];

export const projectFilters = ['All', 'Frontend', 'Backend', 'Full-Stack'] as const;
