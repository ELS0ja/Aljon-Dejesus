import React from 'react';
import type { ProjectAccent, ThumbnailLayout } from '../../types/portfolio';

const accentHex: Record<ProjectAccent, string> = {
  blue: '#60A5FA',
  violet: '#A78BFA',
  emerald: '#34D399',
};

interface ProjectThumbnailProps {
  layout: ThumbnailLayout;
  accent: ProjectAccent;
  title: string;
  className?: string;
}

export function ProjectThumbnail({ layout, accent, title, className = '' }: ProjectThumbnailProps) {
  const color = accentHex[accent];
  return (
    <div
      role="img"
      aria-label={`Illustrative preview for ${title}`}
      className={`relative overflow-hidden bg-surface ${className}`}
      style={{ backgroundImage: `radial-gradient(circle at 80% 0%, ${color}26, transparent 60%)` }}
    >
      <div className="absolute inset-x-6 top-6 bottom-0 overflow-hidden rounded-t-lg border border-b-0 border-line bg-base/90 shadow-2xl shadow-black/40">
        <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
          <span className="ml-3 h-2 w-24 rounded-full bg-line/70" />
        </div>
        <div className="p-3">{renderLayout(layout, color)}</div>
      </div>
    </div>
  );
}

function renderLayout(layout: ThumbnailLayout, color: string) {
  switch (layout) {
    case 'dashboard':
      return (
        <div className="flex gap-3">
          <div className="w-12 space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-2 rounded-full" style={{ background: i === 0 ? color : '#273449' }} />
            ))}
          </div>
          <div className="flex-1 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-8 rounded-md border border-line bg-panel" />
              ))}
            </div>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2 rounded border border-line/60 px-2 py-1.5">
                <span className="size-2 rounded-full" style={{ background: color }} />
                <span className="h-1.5 flex-1 rounded-full bg-line" />
                <span className="h-1.5 w-8 rounded-full bg-line/60" />
              </div>
            ))}
          </div>
        </div>
      );
    case 'tasks':
      return (
        <div className="grid grid-cols-3 gap-2">
          {[3, 2, 2].map((count, col) => (
            <div key={col} className="space-y-2 rounded-md bg-panel/60 p-2">
              <div className="h-1.5 w-10 rounded-full" style={{ background: col === 0 ? color : '#273449' }} />
              {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="space-y-1 rounded border border-line bg-panel p-1.5">
                  <div className="h-1.5 rounded-full bg-line" />
                  <div className="h-1.5 w-2/3 rounded-full bg-line/60" />
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    case 'showcase':
      return (
        <div className="space-y-2">
          <div className="h-2 w-1/2 rounded-full" style={{ background: color }} />
          <div className="h-1.5 w-3/4 rounded-full bg-line" />
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-[4/3] rounded-md border border-line bg-panel" />
            ))}
          </div>
        </div>
      );
    case 'api':
      return (
        <div className="space-y-1.5 font-mono text-[9px] leading-tight">
          {['GET', 'POST', 'PUT', 'DELETE'].map((method, i) => (
            <div key={method} className="flex items-center gap-2 rounded border border-line/60 px-2 py-1">
              <span className="w-9 font-semibold" style={{ color: i === 3 ? '#F87171' : color }}>
                {method}
              </span>
              <span className="text-subtle">/api/products{i > 0 ? '/{id}' : ''}</span>
              <span className="ml-auto text-success">{i === 1 ? 201 : 200}</span>
            </div>
          ))}
        </div>
      );
    case 'landing':
      return (
        <div className="space-y-2 text-center">
          <div className="mx-auto mt-2 h-2.5 w-2/3 rounded-full bg-ink/80" />
          <div className="mx-auto h-1.5 w-1/2 rounded-full bg-line" />
          <div className="mx-auto mt-2 h-4 w-16 rounded-md" style={{ background: color }} />
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-10 rounded-md border border-line bg-panel" />
            ))}
          </div>
        </div>
      );
  }
}
