import React from "react";
import ProductJsonLd from "components/ProductJsonLd";
import { BreadcrumbJsonLd, NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { getCanonicalUrl, SITE_URL } from "lib/seo";
import { getProductImageUrls } from "utils/productImages";

/**
 * Component for handling SEO-related tags
 */
const SEOComponents = ({ product, baseUrl }) => {
  const router = useRouter();
  if (!product?.data?.[0]) return null;

  const attributes = product.data[0].attributes;
  const title = `${attributes.name} | UD Million Candles`;
  const description = attributes.description || title;
  const canonicalUrl = getCanonicalUrl(
    router.asPath,
    router.locale,
    router.defaultLocale,
    router.locales
  );
  const images = getProductImageUrls(product, canonicalUrl);
  const mainImage = images[0];
  const homeUrl = getCanonicalUrl(
    "/",
    router.locale,
    router.defaultLocale,
    router.locales
  );
  const productsUrl = getCanonicalUrl(
    "/products",
    router.locale,
    router.defaultLocale,
    router.locales
  );

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title,
          description,
          url: canonicalUrl,
          type: "product",
          siteName: "UD Million Candles",
          images: mainImage ? [{ url: mainImage, alt: attributes.name }] : [],
        }}
        twitter={{
          handle: "@souvenirlilin.id",
          site: "@souvenirlilin.id",
          cardType: "summary_large_image",
        }}
        additionalMetaTags={
          mainImage
            ? [
                { name: "twitter:image", content: mainImage },
                { name: "twitter:image:alt", content: attributes.name },
              ]
            : []
        }
      />
      <ProductJsonLd product={product} baseUrl={baseUrl || SITE_URL} />
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: "Home",
            item: homeUrl,
          },
          {
            position: 2,
            name: "Products",
            item: productsUrl,
          },
          {
            position: 3,
            name: attributes.name,
            item: canonicalUrl,
          },
        ]}
      />
    </>
  );
};

export default SEOComponents;
