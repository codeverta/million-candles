import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { currency } from "lib/currency";
import { getProductImageUrls, toAbsoluteUrl } from "utils/productImages";

const SITE_URL = "https://www.souvenirlilin.id";

const ProductJsonLd = ({ product, baseUrl = SITE_URL }: any) => {
  const router = useRouter();

  if (!product?.data?.[0]) return null;

  const productData = product.data[0];
  const attributes = productData.attributes;
  const siteUrl = baseUrl || SITE_URL;
  const productUrl = toAbsoluteUrl(router.asPath, siteUrl);
  const images = getProductImageUrls(product, productUrl);
  const reviews = (attributes.product_reviews || []).filter(
    (review) => review.is_approved === true || review.is_approved === 1
  );
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
      reviews.length
    : null;
  const priceCurrency =
    (currency as Record<string, string>)[router.locale || "id"] || "IDR";

  const jsonLd: any = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: attributes.name,
    description: attributes.description,
    sku: attributes.code,
    image: images,
    brand: {
      "@type": "Brand",
      name: "UD Million Candles",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency,
      price: attributes.priceInCurrency ?? attributes.price,
      itemCondition: "https://schema.org/NewCondition",
      availability:
        Number(attributes.stock) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        merchantReturnLink: toAbsoluteUrl("/return-policy", siteUrl),
      },
      shippingDetails: [
        {
          "@type": "OfferShippingDetails",
          shippingRate: {
            "@type": "MonetaryAmount",
            value: 0,
            currency: priceCurrency,
          },
          shippingDestination: {
            "@type": "DefinedRegion",
            addressCountry: "ID",
          },
        },
      ],
    },
  };

  if (averageRating !== null) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(averageRating.toFixed(1)),
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    };
    jsonLd.review = reviews.map((review) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: Number(review.rating),
        bestRating: 5,
        worstRating: 1,
      },
      author: {
        "@type": "Person",
        name: review.author_name || review.user?.name || "Pelanggan",
      },
      datePublished: review.created_at,
      reviewBody: review.review,
    }));
  }

  const safeJsonLd = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd }}
      />
    </Head>
  );
};

export default ProductJsonLd;
