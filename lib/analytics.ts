declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackWhatsAppClick(eventLabel: string) {
  if (typeof window === "undefined") {
    return;
  }

  const gtag = window.gtag;

  if (!gtag) {
    return;
  }

  gtag("event", "whatsapp_click", {
    event_category: "engagement",
    event_label: eventLabel,
    value: 1,
  });
}
