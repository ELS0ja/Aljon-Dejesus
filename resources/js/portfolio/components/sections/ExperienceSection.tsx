import React from 'react';
import { Briefcase, Calendar } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Reveal } from '../common/Reveal';
import { PlaceholderNote } from '../common/PlaceholderNote';
import { experience, hasFormalExperience } from '../../data/experience';

export function ExperienceSection() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="experience-title"
          eyebrow={hasFormalExperience ? 'Experience' : 'Practical experience'}
          title={hasFormalExperience ? 'Where I have worked' : 'Learning by building'}
          description="Academic projects, personal development work, and collaboration that shaped how I write software."
        />
        <PlaceholderNote className="mt-6">Replace these entries with your real activities in data/experience.ts</PlaceholderNote>

        <ol className="relative mt-12 space-y-8 border-l border-line pl-8 sm:ml-2">
          {experience.map((entry, i) => (
            <li key={entry.id} className="relative">
              <span className="absolute -left-[41px] top-1.5 grid size-5 place-items-center rounded-full border border-line bg-base">
                <span className="size-2 rounded-full bg-brand" />
              </span>
              <Reveal delay={i * 0.05}>
                <article className="rounded-2xl border border-line bg-panel p-6 transition-colors hover:border-brand/40 sm:p-7">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-ink">{entry.title}</h3>
                      <p className="mt-1 flex items-center gap-2 text-sm text-subtle">
                        <Briefcase className="size-4" aria-hidden="true" />
                        {entry.organization}
                        <span className="text-line">•</span>
                        <span className="text-brand-2">{entry.type}</span>
                      </p>
                    </div>
                    <p className="flex shrink-0 items-center gap-1.5 font-mono text-xs text-subtle">
                      <Calendar className="size-3.5" aria-hidden="true" />
                      {entry.start} — {entry.end}
                    </p>
                  </div>
                  <ul className="mt-5 space-y-2">
                    {entry.responsibilities.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink/85">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand/70" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies used">
                    {entry.technologies.map((tech) => (
                      <li key={tech} className="rounded-md border border-line bg-surface px-2 py-0.5 font-mono text-[11px] text-ink/80">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
