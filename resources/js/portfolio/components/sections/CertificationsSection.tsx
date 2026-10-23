import React from 'react';
import { ArrowUpRight, Award } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Reveal } from '../common/Reveal';
import { certifications } from '../../data/education';

export function CertificationsSection() {
  if (certifications.length === 0) return null;

  return (
    <section id="certifications" aria-labelledby="certifications-title" className="py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading id="certifications-title" eyebrow="Certifications" title="Certifications & achievements" />
        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {certifications.map((cert, i) => (
            <li key={cert.id}>
              <Reveal delay={i * 0.05}>
                <article className="h-full rounded-2xl border border-line bg-panel p-6">
                  <Award className="size-5 text-brand-2" aria-hidden="true" />
                  <h3 className="mt-4 font-semibold text-ink">{cert.title}</h3>
                  <p className="mt-1 text-sm text-subtle">
                    {cert.issuer} · {cert.issued}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink/85">{cert.description}</p>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand hover:text-ink"
                    >
                      View credential
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                  )}
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
