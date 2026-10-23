import React from 'react';
import { MapPin, Phone } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Reveal } from '../common/Reveal';
import { SocialIcon } from '../common/SocialIcon';
import { ContactForm } from '../contact/ContactForm';
import { profile, socialLinks } from '../../data/profile';

export function ContactSection() {
  const contactLinks = socialLinks.map((link) => {
    if (link.icon === 'linkedin') {
      return {
        label: 'Phone',
        href: profile.phone ? `tel:${profile.phone.replace(/[^\d+]/g, '')}` : undefined,
        icon: 'phone' as const,
        display: profile.phone || 'Add your phone number',
        isExternal: false,
      };
    }

    return {
      ...link,
      display: link.icon === 'mail' ? profile.email : link.href.replace(/^https?:\/\/(www\.)?/, ''),
      isExternal: link.icon !== 'mail',
    };
  });

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden py-24 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-brand-2/10 blur-[120px]"
      />
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
          <div>
            <SectionHeading
              id="contact-title"
              eyebrow="Contact"
              title="Let's build something together"
              description="Have an opportunity or project in mind? I'd be happy to connect."
            />
            <Reveal className="mt-10">
              <ul className="space-y-3">
                {contactLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={link.isExternal ? '_blank' : undefined}
                        rel={link.isExternal ? 'noopener noreferrer' : undefined}
                        className="group flex items-center gap-4 rounded-xl border border-line bg-panel p-4 transition-colors hover:border-brand/40"
                      >
                        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-surface text-subtle transition-colors group-hover:text-brand">
                          {link.icon === 'phone' ? (
                            <Phone className="size-4" aria-hidden="true" />
                          ) : (
                            <SocialIcon icon={link.icon} />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-xs text-subtle">{link.label}</span>
                          <span className="block truncate text-sm font-medium text-ink">{link.display}</span>
                        </span>
                      </a>
                    </li>
                ))}
                <li className="flex items-center gap-4 rounded-xl border border-line bg-panel/50 p-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-surface text-subtle">
                    <MapPin className="size-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xs text-subtle">Location</span>
                    <span className="block text-sm font-medium text-ink">{profile.location}</span>
                  </span>
                </li>
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="relative">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
