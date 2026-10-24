export const GA_TRACKING_ID = "G-3T26EKXGFR";

const { buildWhatsAppClickParams } = require("../utils/whatsapp.cjs");
const {
  CONTACT_INQUIRY_EVENTS,
  buildContactInquiryTrackingParams,
} = require("../utils/contact-inquiry.cjs");

export const pageView = (url: string) => {
  // @ts-ignore
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value: string;
}) => {
  // @ts-ignore
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export const trackWhatsAppClick = (
  segment: "shop" | "church" | "unclassified",
  placement: string
) => {
  if (
    typeof window === "undefined" ||
    typeof (window as any).gtag !== "function"
  ) {
    return;
  }

  (window as any).gtag(
    "event",
    "whatsapp_click",
    buildWhatsAppClickParams(segment, placement, window.location.pathname)
  );
};

const trackContactFormEvent = (
  eventName: string,
  segment: "shop" | "church"
) => {
  if (
    typeof window === "undefined" ||
    typeof (window as any).gtag !== "function"
  ) {
    return;
  }

  (window as any).gtag("event", eventName, {
    ...buildContactInquiryTrackingParams(segment, window.location.pathname),
  });
};

export const trackContactFormSubmitAttempt = (segment: "shop" | "church") =>
  trackContactFormEvent(CONTACT_INQUIRY_EVENTS.submitAttempt, segment);

export const trackContactFormMailerAccepted = (segment: "shop" | "church") =>
  trackContactFormEvent(CONTACT_INQUIRY_EVENTS.mailerAccepted, segment);
