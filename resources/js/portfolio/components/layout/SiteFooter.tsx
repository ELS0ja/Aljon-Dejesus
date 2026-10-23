import React from 'react';
import { ArrowUp } from 'lucide-react';
import { SocialIcon } from '../common/SocialIcon';
import { profile, socialLinks } from '../../data/profile';
import { scrollToSection } from '../../utils/cv';
import type { NavItem } from '../../types/portfolio';

interface SiteFooterProps {
  items: NavItem[];
}

export function SiteFooter({ items }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line/60 bg-surface/60">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-semibold text-ink">{profile.name}</p>
            <p className="mt-1 text-sm text-subtle">{profile.title}</p>
            <ul className="mt-5 flex gap-2" aria-label="Social profiles">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.icon === 'mail' ? undefined : '_blank'}
                    rel={link.icon === 'mail' ? undefined : 'noopener noreferrer'}
                    aria-label={link.label}
                    className="grid size-10 place-items-center rounded-lg border border-line text-subtle transition-colors hover:border-brand/40 hover:text-ink"
                  >
                    <SocialIcon icon={link.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-2 sm:grid-cols-4">
              {items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.id);
                    }}
                    className="inline-flex min-h-8 items-center text-sm text-subtle transition-colors hover:text-ink"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-line/60 pt-6">
          <p className="text-xs text-subtle">
            © {year} {profile.name}. All rights reserved.
          </p>
          <button
            type="button"
            onClick={() => scrollToSection('home')}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line px-3 text-xs font-medium text-subtle transition-colors hover:border-brand/40 hover:text-ink"
          >
            <ArrowUp className="size-3.5" aria-hidden="true" />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
