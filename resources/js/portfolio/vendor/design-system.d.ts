import type { ComponentType, ForwardRefExoticComponent, RefAttributes, HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

type ElementComponent<E, P> = ForwardRefExoticComponent<P & RefAttributes<E>>;
export const Button: ElementComponent<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'; size?: 'default' | 'sm' | 'lg' | 'icon'; asChild?: boolean }>;
export const Badge: ElementComponent<HTMLSpanElement, HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'secondary' | 'outline' | 'destructive' }>;
export const Input: ElementComponent<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>;
export const Label: ElementComponent<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>;
export const Textarea: ElementComponent<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>;
export const Dialog: ComponentType<{ open?: boolean; onOpenChange?: (open: boolean) => void; children?: ReactNode }>;
export const DialogContent: ElementComponent<HTMLDivElement, HTMLAttributes<HTMLDivElement>>;
export const DialogHeader: ComponentType<HTMLAttributes<HTMLDivElement>>;
export const DialogFooter: ComponentType<HTMLAttributes<HTMLDivElement>>;
export const DialogTitle: ElementComponent<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>;
export const DialogDescription: ElementComponent<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>;
export const DialogTrigger: ElementComponent<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>;
