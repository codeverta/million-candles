import React from "react";
import ProductJsonLd from "components/ProductJsonLd";
import { BreadcrumbJsonLd, NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { getProductImageUrls, toAbsoluteUrl } from "utils/productImages";

/**
 * Component for handling SEO-related tags
 */
const SEOComponents = ({ product, baseUrl }) => {
  const router = useRouter();
  if (!product?.data?.[0]) return null;

  const attributes = product.data[0].attributes;
  const title = `${attributes.name} | UD Million Candles`;
  const description = attributes.description || title;
  const siteUrl = baseUrl || "https://www.souvenirlilin.id";
  const canonicalUrl = toAbsoluteUrl(router.asPath, siteUrl);
  const images = getProductImageUrls(product, canonicalUrl);
  const mainImage = images[0];

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={canonicalUrl}
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
      <ProductJsonLd
        product={product}
        baseUrl={baseUrl || "https://www.souvenirlilin.id"}
      />
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: "Home",
            item: "https://souvenirlilin.id/",
          },
          {
            position: 2,
            name: "Products",
            item: "https://souvenirlilin.id/products",
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
