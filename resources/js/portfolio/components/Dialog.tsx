import React, { useEffect, useId, useRef } from 'react';
import { Dialog as OriginalDialog } from '../vendor/design-system';

export { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../vendor/design-system';

export function Dialog({ open, onOpenChange, children }: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}) {
  const id = useId();
  const onChange = useRef(onOpenChange);
  onChange.current = onOpenChange;

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const content = document.querySelector<HTMLElement>('[data-slot="dialog-content"]');
    if (!content) return;
    content.setAttribute('role', 'dialog');
    content.setAttribute('aria-modal', 'true');
    content.tabIndex = -1;
    const title = content.querySelector<HTMLElement>('[data-slot="dialog-title"]');
    const description = content.querySelector<HTMLElement>('[data-slot="dialog-description"]');
    if (title) {
      title.id = `${id}-title`;
      content.setAttribute('aria-labelledby', title.id);
    }
    if (description) {
      description.id = `${id}-description`;
      content.setAttribute('aria-describedby', description.id);
    }
    content.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onChange.current?.(false);
      }
      if (event.key !== 'Tab') return;
      const focusable = [...content.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex="0"]')]
        .filter(element => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first) {
        event.preventDefault();
        content.focus({ preventScroll: true });
      } else if (event.shiftKey && (document.activeElement === first || document.activeElement === content)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !content.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    const onFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && !content.contains(event.target)) content.focus({ preventScroll: true });
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('focusin', onFocus);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('focusin', onFocus);
      previous?.focus({ preventScroll: true });
    };
  }, [open, id]);

  return <OriginalDialog open={open} onOpenChange={onOpenChange}>{children}</OriginalDialog>;
}
