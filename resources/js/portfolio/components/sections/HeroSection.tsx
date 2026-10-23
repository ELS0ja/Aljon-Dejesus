import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Download, Mail, MapPin } from 'lucide-react';
import { Button } from '../Button';
import { SocialIcon } from '../common/SocialIcon';
import { profile, socialLinks } from '../../data/profile';
import { downloadCv, scrollToSection } from '../../utils/cv';

export function HeroSection() {
  const reduce = useReducedMotion();
  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="home" aria-labelledby="hero-title" className="relative isolate overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid animate-grid absolute inset-0" />
        <div className="animate-glow absolute -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-brand/20 blur-[120px]" />
        <div className="animate-glow absolute top-40 right-[-10%] h-[360px] w-[420px] rounded-full bg-brand-2/15 blur-[120px] [animation-delay:-4s]" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <motion.p
            {...fade(0)}
            className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            {profile.availability}
          </motion.p>

          <motion.h1
            {...fade(0.08)}
            id="hero-title"
            className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl"
          >
            {profile.headlineLead} <span className="text-gradient">{profile.headlineAccent}</span>
          </motion.h1>

          <motion.p {...fade(0.16)} className="mt-6 font-mono text-sm text-subtle">
            <span className="text-ink">{profile.name}</span> <span className="text-line">/</span>{' '}
            <span className="text-brand">{profile.title}</span>
          </motion.p>

          <motion.p {...fade(0.22)} className="mt-4 max-w-xl text-base leading-relaxed text-subtle sm:text-lg">
            {profile.intro}
          </motion.p>

          <motion.div {...fade(0.3)} className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={() => scrollToSection('contact')}>
              Contact Me
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Button size="lg" variant="outline" onClick={downloadCv}>
              <Download className="size-4" aria-hidden="true" />
              Download My CV
            </Button>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-subtle transition-colors hover:text-ink"
            >
              <Mail className="size-4" aria-hidden="true" />
              {profile.email}
            </a>
          </motion.div>

          <motion.div {...fade(0.38)} className="mt-8 flex flex-wrap items-center gap-4">
            <ul className="flex items-center gap-2" aria-label="Social profiles">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.icon === 'mail' ? undefined : '_blank'}
                    rel={link.icon === 'mail' ? undefined : 'noopener noreferrer'}
                    aria-label={link.label}
                    className="grid size-10 place-items-center rounded-lg border border-line bg-panel/60 text-subtle transition-all hover:-translate-y-0.5 hover:border-brand/50 hover:text-ink"
                  >
                    <SocialIcon icon={link.icon} />
                  </a>
                </li>
              ))}
            </ul>
            <span className="inline-flex items-center gap-1.5 text-sm text-subtle">
              <MapPin className="size-4" aria-hidden="true" />
              {profile.location}
            </span>
          </motion.div>

        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="hero-portrait"
        >
          <div className="hero-portrait__frame">
            <div className="hero-portrait__crop">
              {profile.portraitUrl ? (
                <img
                  src={profile.portraitUrl}
                  alt={`${profile.name} — ${profile.title}`}
                  className="hero-portrait__image"
                  style={{
                    transform: `rotate(${profile.portraitRotation}deg)`,
                    objectPosition: profile.portraitPosition,
                  }}
                  width={720}
                  height={720}
                  decoding="async"
                  fetchPriority="high"
                />
              ) : (
                <span className="hero-portrait__initials" aria-hidden="true">{profile.initials}</span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
