import React from 'react';
import { BookOpen, Calendar, GraduationCap } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Reveal } from '../common/Reveal';
import { education } from '../../data/education';

export function EducationSection() {
  return (
    <section id="education" aria-labelledby="education-title" className="border-t border-line/50 bg-surface/40 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading id="education-title" eyebrow="Education" title="Academic foundation" />

        <div className="mt-12 space-y-6">
          {education.map((entry) => (
            <Reveal key={entry.id}>
              <article className="grid gap-8 rounded-2xl border border-line bg-panel p-6 sm:p-8 lg:grid-cols-[1fr_1.2fr]">
                <div>
                  <span className="grid size-12 place-items-center rounded-xl border border-line bg-surface">
                    <GraduationCap className="size-6 text-brand" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-ink">{entry.institution}</h3>
                  <p className="mt-1 text-ink/90">{entry.degree}</p>
                  {entry.field && <p className="text-sm text-subtle">{entry.field}</p>}
                  <p className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-xs text-subtle">
                    <Calendar className="size-3.5" aria-hidden="true" />
                    {entry.start} — {entry.end}
                  </p>
                  {entry.honors.length > 0 && (
                    <ul className="mt-4 space-y-1 text-sm text-ink/85">
                      {entry.honors.map((honor) => (
                        <li key={honor}>{honor}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-brand">
                    <BookOpen className="size-3.5" aria-hidden="true" />
                    Relevant coursework
                  </h4>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {entry.coursework.map((course) => (
                      <li key={course} className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm text-ink/90">
                        {course}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
