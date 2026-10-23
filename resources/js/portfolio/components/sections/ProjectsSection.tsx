import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, SearchX } from 'lucide-react';
import { Input } from '../Input';
import { Button } from '../Button';
import { SectionHeading } from '../common/SectionHeading';
import { Reveal } from '../common/Reveal';
import { PlaceholderNote } from '../common/PlaceholderNote';
import { ProjectCard } from '../projects/ProjectCard';
import { ProjectDetailsDialog } from '../projects/ProjectDetailsDialog';
import { projectFilters } from '../../data/projects';
import { portfolio } from '../../bootstrap';
import type { Project } from '../../types/portfolio';

type Filter = (typeof projectFilters)[number];
const projects = portfolio.projects;

export function ProjectsSection() {
  const [filter, setFilter] = useState<Filter>('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Project | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesFilter = filter === 'All' || p.category === filter;
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.technologies.some((t) => t.toLowerCase().includes(q));
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  const countFor = (f: Filter) => (f === 'All' ? projects.length : projects.filter((p) => p.category === f).length);

  const reset = () => {
    setFilter('All');
    setQuery('');
  };

  return (
    <section id="projects" aria-labelledby="projects-title" className="border-t border-line/50 bg-surface/40 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="projects-title"
            eyebrow="Featured projects"
            title="Work that shows how I build"
            description="Each project covers the problem, the approach, and the stack — from schema to interface."
          />
          <PlaceholderNote className="lg:mb-1">These are example entries — replace them with your real work</PlaceholderNote>
        </div>

        <Reveal className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
            {projectFilters.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f)}
                  className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors ${
                    active
                      ? 'border-brand/50 bg-brand/10 text-ink'
                      : 'border-line bg-panel text-subtle hover:border-brand/30 hover:text-ink'
                  }`}
                >
                  {f}
                  <span className={`font-mono text-xs ${active ? 'text-brand' : 'text-subtle/70'}`}>{countFor(f)}</span>
                </button>
              );
            })}
          </div>
          <div className="relative w-full md:w-72">
            <label htmlFor="project-search" className="sr-only">
              Search projects
            </label>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" aria-hidden="true" />
            <Input
              id="project-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or tech…"
              className="h-10 border-line bg-panel pl-9"
            />
          </div>
        </Reveal>

        <p className="sr-only" aria-live="polite">
          {visible.length} {visible.length === 1 ? 'project' : 'projects'} shown
        </p>

        {visible.length > 0 ? (
          <motion.ul layout className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((project) => (
                <motion.li
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                >
                  <ProjectCard project={project} onViewDetails={setSelected} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-line bg-panel/50 px-6 py-16 text-center">
            <span className="grid size-12 place-items-center rounded-xl bg-surface">
              <SearchX className="size-6 text-subtle" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-semibold text-ink">No projects match your search</h3>
            <p className="mt-1 max-w-sm text-sm text-subtle">
              Try a different keyword or category, or clear the filters to see everything.
            </p>
            <Button variant="outline" size="sm" className="mt-5" onClick={reset}>
              Clear filters
            </Button>
          </div>
        )}
      </div>

      <ProjectDetailsDialog project={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </section>
  );
}
