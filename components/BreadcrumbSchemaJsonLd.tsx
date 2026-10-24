// components/BreadcrumbSchemaJsonLd.jsx
import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getCanonicalUrl } from "lib/seo";

const BreadcrumbSchemaJsonLd = ({ slug, postTitle }) => {
  const router = useRouter();
  const articleUrl = getCanonicalUrl(
    router.asPath,
    router.locale,
    router.defaultLocale,
    router.locales
  );
  const homeUrl = getCanonicalUrl(
    "/",
    router.locale,
    router.defaultLocale,
    router.locales
  );
  const postsUrl = getCanonicalUrl(
    "/posts",
    router.locale,
    router.defaultLocale,
    router.locales
  );
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: postsUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: postTitle,
        item: articleUrl,
      },
    ],
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
    </Head>
  );
};

export default BreadcrumbSchemaJsonLd;
