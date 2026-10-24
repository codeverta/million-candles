const test = require("node:test");
const assert = require("node:assert/strict");
const {
  BUSINESS_WHATSAPP_NUMBER,
  buildBusinessWhatsAppLink,
  buildContactInquiryWhatsAppMessage,
  buildSegmentedInquiryMessage,
  buildWhatsAppClickParams,
  buildWhatsAppLink,
  normalizeWhatsAppNumber,
} = require("../utils/whatsapp.cjs");

test("normalizes the confirmed Indonesian WhatsApp number to digits only", () => {
  assert.equal(normalizeWhatsAppNumber("+62 815-7895-6156"), "6281578956156");
  assert.equal(BUSINESS_WHATSAPP_NUMBER, "6281578956156");
});

test("builds a wa.me URL with a normalized number and encoded message", () => {
  assert.equal(
    buildWhatsAppLink("+62 815-7895-6156", "Halo, toko lilin & gereja"),
    "https://wa.me/6281578956156?text=Halo%2C%20toko%20lilin%20%26%20gereja"
  );
});

test("uses the confirmed business number for shared WhatsApp CTAs", () => {
  assert.equal(
    buildBusinessWhatsAppLink("Halo"),
    "https://wa.me/6281578956156?text=Halo"
  );
});

test("creates distinct Indonesian and English copy for shop and church buyers", () => {
  const shopMessage = buildSegmentedInquiryMessage(
    "shop",
    "id",
    "lilin batang"
  );
  const churchMessage = buildSegmentedInquiryMessage("church", "id");
  const englishMessage = buildSegmentedInquiryMessage(
    "church",
    "en",
    "pillar candles"
  );

  assert.match(shopMessage, /toko perlengkapan ibadah/);
  assert.match(shopMessage, /lilin batang/);
  assert.match(churchMessage, /gereja/);
  assert.match(englishMessage, /I represent a church/);
  assert.match(englishMessage, /pillar candles/);
});

test("formats submitted contact details for an explicit WhatsApp handoff", () => {
  const message = buildContactInquiryWhatsAppMessage(
    {
      segment: "church",
      name: "Buyer Name",
      email: "buyer@example.com",
      phone: "+62 812-3456-7890",
      subject: "Altar candles",
      message: "Please share product information.",
    },
    "en"
  );

  assert.match(message, /Buyer type: Church/);
  assert.match(message, /Name: Buyer Name/);
  assert.match(message, /Email: buyer@example\.com/);
  assert.match(message, /Subject \/ product interest: Altar candles/);
  assert.throws(() => buildContactInquiryWhatsAppMessage({ segment: "other" }));
});

test("rejects unsupported or missing buyer segments", () => {
  assert.throws(() => buildSegmentedInquiryMessage("unknown"), /buyer segment/);
});

test("WhatsApp click analytics contains only non-personal context", () => {
  assert.deepEqual(
    buildWhatsAppClickParams(
      "church",
      "contact",
      "/contact?email=private@example.com"
    ),
    {
      event_category: "inquiry",
      buyer_segment: "church",
      cta_placement: "contact",
      page_path: "/contact",
    }
  );
});
