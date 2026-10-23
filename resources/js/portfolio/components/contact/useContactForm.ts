import { useRef, useState, type FormEvent } from 'react';
import { portfolio } from '../../bootstrap';
import {
  type ContactErrors,
  type ContactField,
  type ContactValues,
  validateContact,
  validateField,
} from '../../utils/contactValidation';

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const FIELD_ORDER: ContactField[] = ['name', 'email', 'subject', 'message'];

const emptyValues: ContactValues = { name: '', email: '', subject: '', message: '', website: '' };

export function useContactForm() {
  const [values, setValues] = useState<ContactValues>(emptyValues);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [feedback, setFeedback] = useState('');
  const submittingRef = useRef(false);
  const submissionId = useRef<string | null>(null);

  const handleChange = (field: keyof ContactValues, value: string) => {
    submissionId.current = null;
    setValues((prev) => ({ ...prev, [field]: value }));
    if (field !== 'website' && touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
    if (status === 'success' || status === 'error') setStatus('idle');
  };

  const handleBlur = (field: ContactField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, values[field]) }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submittingRef.current) return;

    if (values.website) {
      setStatus('error');
      setFeedback('Your submission could not be processed.');
      return;
    }

    const nextErrors = validateContact(values);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, subject: true, message: true });
    const firstInvalid = FIELD_ORDER.find((f) => nextErrors[f]);
    if (firstInvalid) {
      setStatus('error');
      setFeedback('Please fix the highlighted fields and try again.');
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }

    submittingRef.current = true;
    setStatus('submitting');
    setFeedback('');

    try {
      submissionId.current ??= crypto.randomUUID?.() ?? '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
        (Number(c) ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> Number(c) / 4).toString(16),
      );
      const record = {
        submission_id: submissionId.current,
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
        website: values.website,
      };
      const response = await fetch(portfolio.contactUrl, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '',
        },
        body: JSON.stringify(record),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 422 && result.errors) {
          const serverErrors: ContactErrors = {};
          FIELD_ORDER.forEach((field) => {
            if (result.errors[field]) serverErrors[field] = result.errors[field][0];
          });
          setErrors(serverErrors);
          const first = FIELD_ORDER.find((field) => serverErrors[field]);
          if (first) document.getElementById(`contact-${first}`)?.focus();
        }
        setStatus('error');
        setFeedback(response.status === 419
          ? 'Your session has expired. Please reload the page and try again.'
          : result.message || 'Something went wrong saving your message. Please try again or email me directly.');
        return;
      }

      setStatus('success');
      setFeedback(result.message);
      submissionId.current = null;
      setValues(emptyValues);
      setTouched({});
      setErrors({});
    } catch {
      setStatus('error');
      setFeedback('Something went wrong saving your message. Please try again or email me directly.');
    } finally {
      submittingRef.current = false;
    }
  };

  return { values, errors, touched, status, feedback, handleChange, handleBlur, handleSubmit };
}
