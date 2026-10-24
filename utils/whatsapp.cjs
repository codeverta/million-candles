const BUSINESS_WHATSAPP_NUMBER = "6281578956156";

function normalizeWhatsAppNumber(phoneNumber) {
  const normalized = String(phoneNumber ?? "").replace(/\D/g, "");

  if (!normalized) {
    throw new Error("A WhatsApp phone number is required.");
  }

  return normalized;
}

function buildWhatsAppLink(phoneNumber, message) {
  const number = normalizeWhatsAppNumber(
    phoneNumber || BUSINESS_WHATSAPP_NUMBER
  );

  return `https://wa.me/${number}?text=${encodeURIComponent(
    String(message || "")
  )}`;
}

function buildBusinessWhatsAppLink(message) {
  return buildWhatsAppLink(BUSINESS_WHATSAPP_NUMBER, message);
}

function buildSegmentedInquiryMessage(
  segment,
  locale = "id",
  productName = ""
) {
  const segmentCopy = {
    id: {
      shop: "Saya mewakili toko perlengkapan ibadah",
      church: "Saya mewakili gereja",
    },
    en: {
      shop: "I represent a religious-supply shop",
      church: "I represent a church",
    },
  };
  const language = locale === "en" ? "en" : "id";
  const introduction = segmentCopy[language][segment];

  if (!introduction) {
    throw new Error("A supported buyer segment is required.");
  }

  const product = String(productName || "").trim();

  if (language === "en") {
    return `${introduction}. ${
      product ? `I am interested in ${product}. ` : ""
    }Could you share information about suitable candle products and ordering?`;
  }

  return `${introduction}. ${
    product ? `Saya tertarik dengan ${product}. ` : ""
  }Mohon informasi produk lilin dan cara pemesanannya.`;
}

function buildContactInquiryWhatsAppMessage(inquiry, locale = "id") {
  const isEnglish = locale === "en";
  const segment =
    inquiry.segment === "shop"
      ? isEnglish
        ? "Religious-supply shop"
        : "Toko perlengkapan ibadah"
      : inquiry.segment === "church"
      ? isEnglish
        ? "Church"
        : "Gereja"
      : null;

  if (!segment) {
    throw new Error("A supported buyer segment is required.");
  }

  const lines = [
    isEnglish ? "Website product inquiry" : "Inquiry produk dari website",
    `${isEnglish ? "Buyer type" : "Tipe pembeli"}: ${segment}`,
    `${isEnglish ? "Name" : "Nama"}: ${String(inquiry.name || "").trim()}`,
    `Email: ${String(inquiry.email || "").trim()}`,
  ];

  if (String(inquiry.phone || "").trim()) {
    lines.push(
      `${isEnglish ? "Phone" : "Telepon"}: ${String(inquiry.phone).trim()}`
    );
  }

  lines.push(
    `${
      isEnglish ? "Subject / product interest" : "Topik / produk yang diminati"
    }: ${String(inquiry.subject || "").trim()}`,
    `${isEnglish ? "Message" : "Pesan"}: ${String(
      inquiry.message || ""
    ).trim()}`
  );

  return lines.join("\n");
}

function buildWhatsAppClickParams(segment, placement, pagePath) {
  return {
    event_category: "inquiry",
    buyer_segment: segment,
    cta_placement: placement,
    page_path: String(pagePath || "").split("?")[0],
  };
}

module.exports = {
  BUSINESS_WHATSAPP_NUMBER,
  buildBusinessWhatsAppLink,
  buildContactInquiryWhatsAppMessage,
  buildSegmentedInquiryMessage,
  buildWhatsAppClickParams,
  buildWhatsAppLink,
  normalizeWhatsAppNumber,
};
