import { profile } from '../data/profile';
import { portfolio } from '../bootstrap';

export async function downloadCv(): Promise<void> {
  if (profile.cvUrl) {
    const link = document.createElement('a');
    link.href = profile.cvUrl;
    link.download = '';
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
    return;
  }

  try {
    const response = await fetch(portfolio.cvUrl, { headers: { Accept: 'application/json' } });
    if (!response.ok) {
      const result = await response.json();
      window.alert(result.message || 'The CV is not configured yet. Please contact me directly for a copy.');
      return;
    }
    const url = URL.createObjectURL(await response.blob());
    const link = document.createElement('a');
    link.href = url;
    link.download = 'CV.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch {
    window.alert('The CV could not be downloaded. Please try again or contact me directly.');
  }
}

export function scrollToSection(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  history.replaceState(null, '', `#${id}`);
}
