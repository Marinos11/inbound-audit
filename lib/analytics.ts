type EventName = 'audit_started' | 'audit_completed' | 'qualified_true' | 'qualified_false';

interface EventData {
  score?: number;
  qualified?: boolean;
  [key: string]: unknown;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function trackEvent(name: EventName, data?: EventData): void {
  if (typeof window === 'undefined') return;

  // Push to dataLayer – compatible with GTM and Meta Pixel
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...data });

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', name, data);
  }
}
