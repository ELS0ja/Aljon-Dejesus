import React from 'react';
import { CircleAlert, CircleCheck, LoaderCircle, Lock, Send } from 'lucide-react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Label } from '../Label';
import { Textarea } from '../Textarea';
import { useContactForm } from './useContactForm';
import { contactLimits, type ContactField } from '../../utils/contactValidation';

export function ContactForm() {
  const { values, errors, touched, status, feedback, handleChange, handleBlur, handleSubmit } = useContactForm();
  const submitting = status === 'submitting';

  const fieldProps = (field: ContactField) => {
    const error = touched[field] ? errors[field] : undefined;
    return {
      id: `contact-${field}`,
      name: field,
      value: values[field],
      disabled: submitting,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleChange(field, e.target.value),
      onBlur: () => handleBlur(field),
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? `contact-${field}-error` : undefined,
      className: `border-line bg-surface ${error ? 'border-danger focus-visible:ring-danger/40' : ''}`,
    };
  };

  const errorText = (field: ContactField) =>
    touched[field] && errors[field] ? (
      <p id={`contact-${field}-error`} className="mt-1.5 flex items-center gap-1.5 text-xs text-danger">
        <CircleAlert className="size-3.5" aria-hidden="true" />
        {errors[field]}
      </p>
    ) : null;

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-labelledby="contact-form-title"
      className="rounded-2xl border border-line bg-panel p-6 sm:p-8"
    >
      <h3 id="contact-form-title" className="text-lg font-semibold text-ink">
        Send a message
      </h3>
      <p className="mt-1 text-sm text-subtle">All fields are required.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-name" className="mb-2 text-ink/90">Full name</Label>
          <Input {...fieldProps('name')} autoComplete="name" maxLength={contactLimits.name.max} placeholder="Jane Doe" />
          {errorText('name')}
        </div>
        <div>
          <Label htmlFor="contact-email" className="mb-2 text-ink/90">Email address</Label>
          <Input
            {...fieldProps('email')}
            type="email"
            autoComplete="email"
            maxLength={contactLimits.email.max}
            placeholder="jane@company.com"
          />
          {errorText('email')}
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="contact-subject" className="mb-2 text-ink/90">Subject</Label>
          <Input {...fieldProps('subject')} maxLength={contactLimits.subject.max} placeholder="Internship opportunity" />
          {errorText('subject')}
        </div>
        <div className="sm:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <Label htmlFor="contact-message" className="text-ink/90">Message</Label>
            <span className="font-mono text-xs text-subtle" aria-hidden="true">
              {values.message.length}/{contactLimits.message.max}
            </span>
          </div>
          <Textarea
            {...fieldProps('message')}
            rows={6}
            maxLength={contactLimits.message.max}
            placeholder="Tell me a little about the role or project…"
            className={`${fieldProps('message').className} min-h-36 resize-y`}
          />
          {errorText('message')}
        </div>

        {/* Honeypot field for bots — hidden from people and assistive tech */}
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(e) => handleChange('website', e.target.value)}
          />
        </div>
      </div>

      <div aria-live="polite" role="status">
        {feedback && status === 'success' && (
          <p className="mt-6 flex items-start gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
            <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {feedback}
          </p>
        )}
        {feedback && status === 'error' && (
          <p className="mt-6 flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {feedback}
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-xs leading-relaxed text-subtle sm:max-w-xs">
          <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          Your details are only used to reply to your message. They are never shared or used for marketing.
        </p>
        <Button type="submit" size="lg" disabled={submitting} className="sm:min-w-40">
          {submitting ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              <Send className="size-4" aria-hidden="true" />
              Send message
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
