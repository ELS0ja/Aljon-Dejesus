import React from 'react';
import { ArrowUpRight, CircleCheck } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../Dialog';
import { Badge } from '../Badge';
import { ProjectThumbnail } from './ProjectThumbnail';
import { PlaceholderNote } from '../common/PlaceholderNote';
import type { Project } from '../../types/portfolio';

interface ProjectDetailsDialogProps {
  project: Project | null;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDetailsDialog({ project, onOpenChange }: ProjectDetailsDialogProps) {
  return (
    <Dialog open={project !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto border-line bg-panel p-0 sm:max-w-2xl">
        {project && (
          <>
            <ProjectThumbnail
              layout={project.thumbnail}
              accent={project.accent}
              title={project.title}
              className="aspect-[16/7] border-b border-line"
            />
            <div className="space-y-6 p-6 sm:p-8">
              <DialogHeader className="text-left">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{project.category}</Badge>
                  {project.isPlaceholder && (
                    <Badge variant="outline" className="border-dashed border-brand-2/50 text-brand-2">
                      Example project — not yet completed
                    </Badge>
                  )}
                </div>
                <DialogTitle className="mt-3 text-2xl font-bold text-ink">{project.title}</DialogTitle>
                <DialogDescription className="text-base leading-relaxed text-subtle">
                  {project.description}
                </DialogDescription>
              </DialogHeader>

              <DetailBlock title="The problem">
                <p className="text-sm leading-relaxed text-ink/90">{project.problem}</p>
              </DetailBlock>

              <DetailBlock title="Key features">
                <ul className="grid gap-2 sm:grid-cols-2">
                  {project.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-ink/90">
                      <CircleCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </DetailBlock>

              <DetailBlock title="My contribution">
                <p className="text-sm leading-relaxed text-ink/90">{project.contribution}</p>
              </DetailBlock>

              <DetailBlock title="Technologies">
                <ul className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <li key={tech} className="rounded-md border border-line bg-surface px-2 py-1 font-mono text-xs text-ink/80">
                      {tech}
                    </li>
                  ))}
                </ul>
              </DetailBlock>

              {project.isPlaceholder && (
                <PlaceholderNote>Edit or remove this example in data/projects.ts</PlaceholderNote>
              )}

              <div className="flex flex-wrap gap-3 border-t border-line pt-6">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <FaGithub className="size-4" aria-hidden="true" />
                  View repository
                </a>
                {project.demoUrl ? (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-line px-4 text-sm font-medium text-ink transition-colors hover:bg-surface"
                  >
                    Live demo
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                ) : (
                  <span className="inline-flex h-10 items-center text-sm text-subtle">Live demo not available yet</span>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DetailBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="mb-2 font-mono text-xs uppercase tracking-wider text-brand">{title}</h4>
      {children}
    </section>
  );
}
