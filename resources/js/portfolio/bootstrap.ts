import type { Project } from './types/portfolio';

declare global {
  interface Window {
    __PORTFOLIO__: {
      projects: Project[];
      contactUrl: string;
      cvUrl: string;
    };
  }
}

export const portfolio = window.__PORTFOLIO__;
