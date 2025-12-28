// pages/product/[slug].js (atau nama file Anda)

import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "components/layout/Landing";
import Breadcrumb from "components/mui/Breadcrumb";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Import AdSense component
import AdSense from "components/AdSense"; // Sesuaikan path ini

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
  if (router.isFallback || !product || !product?.data?.[0]?.attributes) {
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
          {/* AdSense Unit 1: Di atas Breadcrumb / Bagian Atas Halaman */}
          <div className="py-4 px-4 max-w-7xl mx-auto">
            <AdSense type="display" style={{ maxWidth: "728px" }} />
          </div>

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
              {/* AdSense Unit 2: Di tengah-tengah informasi produk */}
              <div className="my-8">
                <AdSense type="in-article" />
              </div>
            </div>

            <div className="md:w-1/4 md:sticky md:top-32 md:self-start">
              <ProductActions product={product} />
              {/* AdSense Unit 3: Di bawah Product Actions (Sidebar) */}
              <div className="my-4 hidden md:block">
                <AdSense
                  type="display"
                  style={{ width: "300px", height: "250px" }}
                />
              </div>
            </div>
          </div>

          <ProductReview product={product} />

          <section className="mt-16">
            <RelatedProducts isLoading={isLoading} />
          </section>

          {/* AdSense Unit 4: Di bawah Product Review */}
          <div className="px-4 py-8 max-w-7xl mx-auto">
            <AdSense type="feed" style={{ maxWidth: "970px" }} />
          </div>
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
      console.log("Product not found or empty response.");
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
