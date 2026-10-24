const CONTACT_INQUIRY_EVENTS = Object.freeze({
  submitAttempt: "contact_form_submit_attempt",
  mailerAccepted: "contact_form_mailer_accepted",
});

function buildContactInquiryTrackingParams(segment, pagePath) {
  if (segment !== "shop" && segment !== "church") {
    throw new Error("A supported buyer segment is required.");
  }

  return {
    event_category: "inquiry",
    buyer_segment: segment,
    page_path: String(pagePath || "").split("?")[0],
  };
}

async function deliverContactInquiry({
  apiBaseUrl,
  inquiry,
  fetchImpl = globalThis.fetch,
  onAttempt,
  onAccepted,
}) {
  if (inquiry.segment !== "shop" && inquiry.segment !== "church") {
    throw new Error("A supported buyer segment is required.");
  }

  onAttempt?.(inquiry.segment);

  const response = await fetchImpl(
    `${String(apiBaseUrl).replace(/\/+$/, "")}/contact-inquiries`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inquiry),
    }
  );

  if (!response.ok) {
    throw new Error("Contact inquiry request failed.");
  }

  onAccepted?.(inquiry.segment);
  return response;
}

module.exports = {
  CONTACT_INQUIRY_EVENTS,
  buildContactInquiryTrackingParams,
  deliverContactInquiry,
};
