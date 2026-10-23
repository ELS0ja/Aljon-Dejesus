import type { SocialLink } from '../types/portfolio';

export const profile = {
  name: 'ALJON DE JESUS',
  initials: 'ADJ',
  // Use the original supplied photo; apply its circular crop through CSS only.
  portraitUrl: '/images/profile-original.jpg',
  portraitRotation: -90,
  portraitPosition: '50% 54%',
  title: 'Full-Stack Developer',
  availability: 'Open to Internship Opportunities',
  headlineLead: 'Building Digital Experiences From',
  headlineAccent: 'Frontend to Backend.',
  intro:
    'I design and build web applications end to end — responsive interfaces, secure PHP backends, and well-structured MySQL databases. I enjoy breaking down problems and turning them into reliable, maintainable software.',
  email: 'aljondejesus090@gmail.com',
  phone: '+639451392004',
  location: 'Purok 3 Pagbahanan, Marihatag, Surigao del Sur',
  // Set to a real file URL (e.g. "/assets/documents/resume.pdf") once your CV is ready.
  cvUrl: '',
};

export const socialLinks: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/ELS0ja', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/your-profile', icon: 'linkedin' },
  { label: 'Email', href: `mailto:${profile.email}`, icon: 'mail' },
];
