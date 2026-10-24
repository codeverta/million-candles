const assert = require("node:assert/strict");
const http = require("node:http");
const test = require("node:test");
const {
  CONTACT_INQUIRY_EVENTS,
  buildContactInquiryTrackingParams,
  deliverContactInquiry,
} = require("../utils/contact-inquiry.cjs");

const inquiry = {
  name: "Buyer Name",
  email: "buyer@example.com",
  phone: "+62 812-3456-7890",
  segment: "shop",
  subject: "Shop supply inquiry",
  message: "Please share product information.",
  website: "",
};

async function withHttpServer(handler, callback) {
  const server = http.createServer(handler);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();

  try {
    await callback(`http://127.0.0.1:${port}/api/v1`);
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
}

test("contact tracking separates attempt and mailer-accepted events without PII", () => {
  assert.equal(
    CONTACT_INQUIRY_EVENTS.submitAttempt,
    "contact_form_submit_attempt"
  );
  assert.equal(
    CONTACT_INQUIRY_EVENTS.mailerAccepted,
    "contact_form_mailer_accepted"
  );
  assert.deepEqual(
    buildContactInquiryTrackingParams(
      "church",
      "/contact?email=private@example.com"
    ),
    {
      event_category: "inquiry",
      buyer_segment: "church",
      page_path: "/contact",
    }
  );
  assert.throws(() => buildContactInquiryTrackingParams("other", "/contact"));
});

test("a successful contact request tracks attempt before acceptance", async () => {
  const events = [];
  let request;
  await withHttpServer(
    async (requestMessage, responseMessage) => {
      let body = "";
      requestMessage.setEncoding("utf8");
      requestMessage.on("data", (chunk) => (body += chunk));
      requestMessage.on("end", () => {
        request = {
          method: requestMessage.method,
          path: requestMessage.url,
          contentType: requestMessage.headers["content-type"],
          body: JSON.parse(body),
        };
        responseMessage.writeHead(202, { "Content-Type": "application/json" });
        responseMessage.end(JSON.stringify({ message: "accepted" }));
      });
    },
    async (apiBaseUrl) => {
      const response = await deliverContactInquiry({
        apiBaseUrl,
        inquiry,
        onAttempt: (segment) => events.push(["attempt", segment]),
        onAccepted: (segment) => events.push(["accepted", segment]),
      });

      assert.equal(response.status, 202);
    }
  );

  assert.deepEqual(request, {
    method: "POST",
    path: "/api/v1/contact-inquiries",
    contentType: "application/json",
    body: inquiry,
  });
  assert.deepEqual(events, [
    ["attempt", "shop"],
    ["accepted", "shop"],
  ]);
});

test("failed requests record an attempt but never a mailer acceptance", async () => {
  const events = [];

  await withHttpServer(
    (_requestMessage, responseMessage) => {
      responseMessage.writeHead(503, { "Content-Type": "application/json" });
      responseMessage.end(JSON.stringify({ message: "unavailable" }));
    },
    async (apiBaseUrl) => {
      await assert.rejects(
        deliverContactInquiry({
          apiBaseUrl,
          inquiry,
          onAttempt: (segment) => events.push(["attempt", segment]),
          onAccepted: (segment) => events.push(["accepted", segment]),
        }),
        /request failed/
      );
    }
  );

  assert.deepEqual(events, [["attempt", "shop"]]);
});

test("transport failures record an attempt and never a mailer acceptance", async () => {
  const events = [];

  await assert.rejects(
    deliverContactInquiry({
      apiBaseUrl: "https://api.example.com/api/v1",
      inquiry,
      fetchImpl: async () => {
        throw new Error("network offline");
      },
      onAttempt: (segment) => events.push(["attempt", segment]),
      onAccepted: (segment) => events.push(["accepted", segment]),
    }),
    /network offline/
  );

  assert.deepEqual(events, [["attempt", "shop"]]);
});
