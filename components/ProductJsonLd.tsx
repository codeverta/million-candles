// components/ProductJsonLd.js
import React from "react";
import Head from "next/head";

const ProductJsonLd = ({ product, baseUrl }: any) => {
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
          (item: any) =>
            item.type === "documents" &&
            productData.relationships.documents.data.some(
              (doc: any) => doc.id === item.id
            )
        )
      : [];

  const images =
    documents.length > 0
      ? documents.map((doc: any) => `${baseUrl}${doc.attributes.filename}`)
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
      url: `${baseUrl}${window.location.pathname}`,
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
