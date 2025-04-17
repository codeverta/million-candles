import { Html, Head, Main, NextScript } from "next/document";
import { GA_TRACKING_ID } from "lib/gtag";
import { useRouter } from "next/router";

const DOMAIN = "https://www.souvenirlilin.id";

export default function Document() {
  const router = useRouter();
  const canonicalUrl = `${DOMAIN}${router.asPath.split("?")[0]}`;
  return (
    <Html lang="en">
      <Head>
        <link rel="canonical" href={canonicalUrl} />
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2242816010232507"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `{
            "@context": "https://schema.org",
            "@type": "Organization",
            "url": "https://www.souvenirlilin.id",
            "logo": "https://www.souvenirlilin.id/logolilin.png"
          }`,
          }}
          type="application/ld+json"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
        <meta name="google-adsense-account" content="ca-pub-2242816010232507" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
