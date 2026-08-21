// Type declarations for global window analytics objects
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Universal Event Tracker for Google Analytics, Google Ads, and Meta Pixel
 */
export const trackEvent = (
  eventName: string,
  params?: Record<string, unknown>
) => {
  if (typeof window === 'undefined') return;

  // 1. Send to Google Analytics / GTM
  if (window.gtag) {
    window.gtag('event', eventName, params);
  } else if (window.dataLayer) {
    window.dataLayer.push({ event: eventName, ...params });
  }

  // 2. Send to Meta Pixel
  if (window.fbq) {
    window.fbq('trackCustom', eventName, params);
  }
};

/**
 * Standard Conversion Events for Performance Marketing
 */

// Track when a creator submits a brand collaboration application (Lead / Conversion)
export const trackApplicationSubmit = (brandName: string, budgetTier?: string) => {
  if (typeof window === 'undefined') return;

  // Google Ads / GA4 Conversion
  if (window.gtag) {
    window.gtag('event', 'generate_lead', {
      event_category: 'Application',
      event_label: brandName,
      value: budgetTier,
    });
  }

  // Meta Pixel Standard Lead Event
  if (window.fbq) {
    window.fbq('track', 'Lead', {
      content_name: brandName,
      content_category: 'Creator Application',
    });
  }
};

// Track when a new creator completes registration
export const trackCreatorSignup = (method: 'credentials' | 'google') => {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', 'sign_up', { method });
  }

  if (window.fbq) {
    window.fbq('track', 'CompleteRegistration', { status: method });
  }
};

// Track when a creator opens a brand brief modal/page
export const trackViewBrandBrief = (brandName: string, industry: string) => {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', 'view_item', {
      items: [{ item_name: brandName, item_category: industry }],
    });
  }

  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: brandName,
      content_category: industry,
    });
  }
};
