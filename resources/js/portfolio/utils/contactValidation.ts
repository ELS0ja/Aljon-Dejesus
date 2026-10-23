export interface ContactValues {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string; // honeypot — must stay empty
}

export type ContactField = Exclude<keyof ContactValues, 'website'>;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const contactLimits = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  subject: { min: 3, max: 150 },
  message: { min: 20, max: 5000 },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateField(field: ContactField, raw: string): string | undefined {
  const value = raw.trim();
  switch (field) {
    case 'name':
      if (!value) return 'Please enter your full name.';
      if (value.length < contactLimits.name.min) return 'Name must be at least 2 characters.';
      if (value.length > contactLimits.name.max) return 'Name must be 100 characters or fewer.';
      return undefined;
    case 'email':
      if (!value) return 'Please enter your email address.';
      if (value.length > contactLimits.email.max) return 'Email address is too long.';
      if (!EMAIL_PATTERN.test(value)) return 'Please enter a valid email address.';
      return undefined;
    case 'subject':
      if (!value) return 'Please add a subject.';
      if (value.length < contactLimits.subject.min) return 'Subject must be at least 3 characters.';
      if (value.length > contactLimits.subject.max) return 'Subject must be 150 characters or fewer.';
      return undefined;
    case 'message':
      if (!value) return 'Please write a message.';
      if (value.length < contactLimits.message.min) return 'Message must be at least 20 characters.';
      if (value.length > contactLimits.message.max) return 'Message must be 5,000 characters or fewer.';
      return undefined;
  }
}

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  (['name', 'email', 'subject', 'message'] as ContactField[]).forEach((field) => {
    const error = validateField(field, values[field]);
    if (error) errors[field] = error;
  });
  return errors;
}
