import React from 'react';
import { ArrowUpRight, Eye } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { ProjectThumbnail } from './ProjectThumbnail';
import type { Project } from '../../types/portfolio';

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
}

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-2xl hover:shadow-brand/5">
      <div className="relative">
        <ProjectThumbnail
          layout={project.thumbnail}
          accent={project.accent}
          title={project.title}
          className="aspect-[16/10] transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="absolute left-4 top-4 flex gap-2">
          <Badge variant="secondary" className="border border-line bg-base/80 backdrop-blur">
            {project.category}
          </Badge>
          {project.isPlaceholder && (
            <Badge variant="outline" className="border-dashed border-brand-2/50 bg-base/80 text-brand-2 backdrop-blur">
              Example
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold text-ink">{project.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-subtle">{project.problem}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.technologies.map((tech) => (
            <li key={tech} className="rounded-md border border-line bg-surface px-2 py-0.5 font-mono text-[11px] text-ink/80">
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          <Button size="sm" onClick={() => onViewDetails(project)}>
            <Eye className="size-4" aria-hidden="true" />
            View Details
          </Button>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} source code on GitHub (opens in new tab)`}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line px-3 text-sm font-medium text-ink/90 transition-colors hover:border-brand/40 hover:bg-surface"
          >
            <FaGithub className="size-4" aria-hidden="true" />
            Code
          </a>
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} live demo (opens in new tab)`}
              className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-sm font-medium text-brand transition-colors hover:text-ink"
            >
              Live demo
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          ) : (
            <span className="px-2 text-xs text-subtle">Demo coming soon</span>
          )}
        </div>
      </div>
    </article>
  );
}
