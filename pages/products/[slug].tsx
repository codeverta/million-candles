// pages/product/[slug].js (atau nama file Anda)

import React from "react";
import Head from "next/head";
import { useRouter } from "next/router"; // Import useRouter
import Layout from "components/layout/Landing";
import Breadcrumb from "components/mui/Breadcrumb";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Import custom components
import ProductImageGallery from "components/product/ProductImageGallery";
import ProductInformation from "components/product/ProductInformation";
import RelatedProducts from "components/product/RelatedProducts";
import SEOComponents from "components/product/SEOComponents";

// Import custom hook
import useProduct from "hooks/useProduct";
import ProductActions from "components/product/ProductActions";
import ProductReview from "components/product/ProductReview";
import api from "utils/api";
import { currency } from "lib/currency";

/**
 * ProductDetail page component
 */
function ProductDetail({ product, initialLocale }) {
  const router = useRouter();

  // Use the custom hook to get product data and functionality
  const {
    isLoading,
    imagesLoaded,
    documents,
    isDocumentExist,
    currentPrice,
    currentStock,
    selectedVariant,
    qty,
    handleVariantChange,
    incrementQuantity,
    decrementQuantity,
    prepareOrderMessage,
  } = useProduct(product, initialLocale);

  // Penjaga untuk mencegah error saat data belum siap pada navigasi client-side
  if (router.isFallback || !product) {
    return <div>Loading Page...</div>; // Atau tampilkan skeleton halaman penuh
  }

  // Dapatkan identifier unik dari URL atau data produk
  const productIdentifier = router.query.slug || product.data[0].id;

  // Get base URL for absolute URLs in JSON-LD
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  return (
    <>
      <SEOComponents product={product} baseUrl={baseUrl} />

      <section className="text-gray-700 dark:text-gray-300 bg-white min-h-screen dark:bg-gray-900">
        <div className="container mx-auto">
          <Breadcrumb currentLabel={product.data[0].attributes.name} />

          <div className="flex px-4 gap-6 flex-col md:flex-row">
            <div className="md:w-1/4 md:sticky md:top-32 md:self-start">
              <ProductImageGallery
                key={productIdentifier}
                productIdentifier={productIdentifier}
                isLoading={isLoading}
                isImagesLoaded={imagesLoaded}
                documents={documents}
                isDocumentExist={isDocumentExist}
                productName={product.data[0].attributes.name}
              />
            </div>

            <div className="md:w-2/4">
              <ProductInformation
                isLoading={isLoading}
                product={product}
                currentPrice={currentPrice}
                currentStock={currentStock}
                handleVariantChange={handleVariantChange}
                qty={qty}
                incrementQuantity={incrementQuantity}
                decrementQuantity={decrementQuantity}
                prepareOrderMessage={prepareOrderMessage}
              />
            </div>

            <div className="md:w-1/4 md:sticky md:top-32 md:self-start">
              <ProductActions product={product} />
            </div>
          </div>
          <ProductReview product={product} />
          <section className="mt-16">
            <RelatedProducts isLoading={isLoading} />
          </section>
        </div>
      </section>
    </>
  );
}

ProductDetail.getLayout = function (page) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps({ locale, params }) {
  const { slug } = params;

  try {
    const productData = await api.get("products", {
      "filter[slug]": slug,
      locale: locale,
      currency: currency[locale] || "id",
      include: "documents",
    });

    if (!productData?.data || productData.data?.data?.length === 0) {
      return { notFound: true };
    }

    return {
      props: {
        product: productData.data,
        initialLocale: locale,
        ...(await serverSideTranslations(locale, ["common", "order"])),
      },
    };
  } catch (error) {
    console.error("Error fetching product on server:", error);
    return { notFound: true };
  }
}
export default ProductDetail;
