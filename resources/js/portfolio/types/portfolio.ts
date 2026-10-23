export type ProjectCategory = 'Frontend' | 'Backend' | 'Full-Stack';
export type ProjectAccent = 'blue' | 'violet' | 'emerald';
export type ThumbnailLayout = 'dashboard' | 'tasks' | 'showcase' | 'api' | 'landing';

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  problem: string;
  description: string;
  technologies: string[];
  features: string[];
  contribution: string;
  githubUrl?: string;
  demoUrl?: string;
  accent: ProjectAccent;
  thumbnail: ThumbnailLayout;
  isPlaceholder: boolean;
}

export type SkillIconKey =
  | 'html' | 'css' | 'js' | 'responsive' | 'a11y'
  | 'php' | 'validation' | 'api' | 'auth'
  | 'mysql' | 'schema' | 'sql' | 'crud' | 'relations'
  | 'git' | 'github' | 'vscode' | 'xampp' | 'composer'
  | 'frontend' | 'backend' | 'database' | 'tools';

export interface Skill {
  name: string;
  icon: SkillIconKey;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  icon: SkillIconKey;
  skills: Skill[];
}

export interface ExperienceEntry {
  id: string;
  title: string;
  organization: string;
  type: string;
  start: string;
  end: string;
  responsibilities: string[];
  technologies: string[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start: string;
  end: string;
  coursework: string[];
  academicProjects: string[];
  honors: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issued: string;
  credentialUrl?: string;
  description: string;
}

export interface NavItem {
  id: string;
  label: string;
}

export interface AboutPhoto {
  src: string;
  alt: string;
  position?: string;
  width?: number;
  height?: number;
}

export type SocialIconKey = 'github' | 'linkedin' | 'mail';

export interface SocialLink {
  label: string;
  href: string;
  icon: SocialIconKey;
}
