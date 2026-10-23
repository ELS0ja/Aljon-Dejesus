import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Menu, X } from 'lucide-react';
import { Button } from '../Button';
import { profile } from '../../data/profile';
import { useActiveSection } from '../../hooks/useActiveSection';
import { downloadCv, scrollToSection } from '../../utils/cv';
import type { NavItem } from '../../types/portfolio';

interface SiteHeaderProps {
  items: NavItem[];
}

export function SiteHeader({ items }: SiteHeaderProps) {
  const active = useActiveSection(items.map((item) => item.id));
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open ? 'border-line/70 bg-base/80 backdrop-blur-xl' : 'border-transparent bg-transparent'
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-md focus:bg-brand focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#0B0F19]"
      >
        Skip to content
      </a>
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a
          href="#home"
          onClick={(e) => handleNav(e, 'home')}
          className="group flex items-center gap-2.5 rounded-md"
          aria-label={`${profile.name} — back to top`}
        >
          <span className="grid size-9 place-items-center rounded-lg border border-line bg-panel font-mono text-sm font-semibold text-ink transition-colors group-hover:border-brand/60">
            {profile.initials}
          </span>
          <span className="hidden text-sm font-semibold tracking-tight text-ink sm:block">{profile.name}</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {items.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleNav(e, item.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-ink' : 'text-subtle hover:text-ink'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 -bottom-px h-px bg-brand"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={downloadCv} className="hidden sm:inline-flex">
            <Download className="size-4" aria-hidden="true" />
            Download CV
          </Button>
          <button
            ref={toggleRef}
            type="button"
            className="grid size-11 place-items-center rounded-lg text-ink transition-colors hover:bg-panel lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-line/70 lg:hidden"
          >
            <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 sm:px-8">
              {items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleNav(e, item.id)}
                    aria-current={active === item.id ? 'true' : undefined}
                    className={`flex min-h-11 items-center rounded-lg px-3 text-base font-medium transition-colors ${
                      active === item.id ? 'bg-panel text-ink' : 'text-subtle hover:bg-panel/60 hover:text-ink'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="pt-2 sm:hidden">
                <Button className="w-full" onClick={() => { setOpen(false); downloadCv(); }}>
                  <Download className="size-4" aria-hidden="true" />
                  Download CV
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
