// components/ProductJsonLd.js
import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const ProductJsonLd = ({ product, baseUrl }) => {
  const router = useRouter();

  // Only render if we have a product
  if (!product || !product.data || !product.data[0]) {
    return null;
  }

  const productData = product.data[0];
  const attributes = productData.attributes;

  // Get images from documents if available
  const documents =
    productData?.relationships?.documents?.data?.length > 0
      ? product.included?.filter(
          (item) =>
            item.type === "documents" &&
            productData.relationships.documents.data.some(
              (doc) => doc.id === item.id
            )
        )
      : [];

  const images =
    documents.length > 0
      ? documents.map((doc) => `${baseUrl}${doc.attributes.filename}`)
      : [`${baseUrl}/assets/image-1@2x.jpg`];

  // Build the structured data
  const jsonLd = {
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
      url: `${baseUrl}${router.asPath}`,
      priceCurrency: "IDR",
      price: attributes.price,
      itemCondition: "https://schema.org/NewCondition",
      availability:
        attributes.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
};

export default ProductJsonLd;
