import React from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { Reveal } from '../common/Reveal';
import { SkillIcon } from '../common/SkillIcon';
import { skillCategories } from '../../data/skills';

export function SkillsSection() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="skills-title"
          eyebrow="Technical skills"
          title="A practical full-stack toolkit"
          description="The technologies I use to take a feature from database table to finished interface."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {skillCategories.map((category, i) => (
            <Reveal key={category.id} delay={i * 0.06}>
              <article className="group h-full rounded-2xl border border-line bg-panel p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/5 sm:p-7">
                <div className="flex items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-surface">
                    <SkillIcon icon={category.icon} className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-ink">{category.title}</h3>
                    <p className="mt-1 text-sm text-subtle">{category.description}</p>
                  </div>
                </div>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <li
                      key={skill.name}
                      className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface/70 px-3 py-2 text-sm text-ink/90 transition-colors hover:border-brand/40 hover:bg-surface"
                    >
                      <SkillIcon icon={skill.icon} />
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
