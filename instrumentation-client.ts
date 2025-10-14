// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Add optional integrations for additional features
  integrations: [Sentry.replayIntegration()],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 0.05,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.05,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  tracesSampler: (samplingContext) => {
    // The transaction name is often the URL path
    const transactionName = samplingContext.transactionContext.name;

    // Ignore health check endpoints completely
    if (transactionName.includes("/api/health")) {
      return 0; // Drop this transaction
    }

    // Sample important transactions at a higher rate
    if (transactionName.includes("/api/checkout")) {
      return 0.5; // 50%
    }

    // Default sampling rate for everything else
    return 0.1; // 10%
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
