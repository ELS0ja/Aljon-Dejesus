import React from 'react';
import { Compass, Lightbulb, Target, Check } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Reveal } from '../common/Reveal';
import { AboutSlideshow } from '../AboutSlideshow';
import { aboutBio, aboutHighlights, aboutPhotos, projectTypes } from '../../data/about';

const highlightIcons = { compass: Compass, lightbulb: Lightbulb, target: Target };

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="border-t border-line/50 bg-surface/40 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading id="about-title" eyebrow="About me" title="Turning ideas into dependable web software" />

        <div className="mt-12 grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-14">
          <Reveal>
            <AboutSlideshow photos={aboutPhotos} />
          </Reveal>

          <div>
            <Reveal>
              <p className="text-lg leading-relaxed text-ink/90">{aboutBio}</p>
            </Reveal>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {aboutHighlights.map((item, i) => {
                const Icon = highlightIcons[item.icon];
                return (
                  <Reveal key={item.id} delay={i * 0.06}>
                    <article className="h-full rounded-xl border border-line bg-panel p-5 transition-colors hover:border-brand/40">
                      <Icon className="size-5 text-brand" aria-hidden="true" />
                      <h3 className="mt-4 font-semibold text-ink">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-subtle">{item.text}</p>
                    </article>
                  </Reveal>
                );
              })}
            </div>

            <Reveal className="mt-10">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-subtle">What I like to build</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {projectTypes.map((type) => (
                  <li key={type} className="flex items-center gap-3 text-ink/90">
                    <span className="grid size-6 place-items-center rounded-md bg-brand/10">
                      <Check className="size-3.5 text-brand" aria-hidden="true" />
                    </span>
                    {type}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
