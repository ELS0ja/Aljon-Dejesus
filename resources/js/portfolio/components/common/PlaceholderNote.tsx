import React from 'react';
import { PencilLine } from 'lucide-react';
import { useShowPlaceholderNotes } from '../../contexts/PlaceholderNotesContext';

interface PlaceholderNoteProps {
  children: React.ReactNode;
  className?: string;
}

export function PlaceholderNote({ children, className = '' }: PlaceholderNoteProps) {
  const show = useShowPlaceholderNotes();
  if (!show) return null;
  return (
    <p
      className={`inline-flex items-start gap-2 rounded-lg border border-dashed border-brand-2/40 bg-brand-2/5 px-3 py-2 text-xs leading-relaxed text-brand-2 ${className}`}
    >
      <PencilLine className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
