import React, { useEffect } from 'react';
import { PlaceholderNotesProvider } from './contexts/PlaceholderNotesContext';
import { SiteHeader } from './components/layout/SiteHeader';
import { SiteFooter } from './components/layout/SiteFooter';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { EducationSection } from './components/sections/EducationSection';
import { CertificationsSection } from './components/sections/CertificationsSection';
import { ContactSection } from './components/sections/ContactSection';
import { navItems } from './data/navigation';
import { profile } from './data/profile';

interface AppProps {
  showPlaceholderNotes?: boolean;
}

export function App({ showPlaceholderNotes = true }: AppProps) {
  useEffect(() => {
    document.title = `${profile.name} — ${profile.title} Portfolio`;
  }, []);

  return (
    <PlaceholderNotesProvider show={showPlaceholderNotes}>
      <div className="min-h-screen w-full bg-base text-ink">
        <SiteHeader items={navItems} />
        <main id="main">
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <EducationSection />
          <CertificationsSection />
          <ContactSection />
        </main>
        <SiteFooter items={navItems} />
      </div>
    </PlaceholderNotesProvider>
  );
}
