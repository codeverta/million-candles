import React from "react";
import Head from "next/head";
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

/**
 * ProductDetail page component
 */
function ProductDetail() {
  // Use the custom hook to get product data and functionality
  const {
    product,
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
  } = useProduct();

  // Get base URL for absolute URLs in JSON-LD
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  return (
    <>
      {/* SEO Components */}
      {!isLoading && product && (
        <SEOComponents product={product} baseUrl={baseUrl} />
      )}

      <section className="text-gray-700 dark:text-gray-300 bg-white min-h-screen dark:bg-gray-900">
        <div className="container mx-auto p-4">
          {/* Breadcrumb */}
          {!isLoading && product ? (
            <Breadcrumb currentLabel={product.data[0].attributes.name} />
          ) : (
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4 opacity-60"></div>
          )}

          <div className="flex gap-6 flex-col md:flex-row">
            {/* Product Images Section - Left Column (Sticky) - Smaller */}
            <div className="md:w-1/4 md:sticky md:top-32 md:self-start">
              <ProductImageGallery
                isLoading={isLoading}
                isImagesLoaded={imagesLoaded}
                documents={documents}
                isDocumentExist={isDocumentExist}
                productName={
                  !isLoading && product
                    ? product.data[0].attributes.name
                    : "Product"
                }
              />
            </div>

            {/* Product Details Section - Middle Column - Larger */}
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

            {/* Product Actions - Right Column (Sticky) - Smaller */}
            <div className="md:w-1/4 md:sticky md:top-32 md:self-start">
              <ProductActions product={product} />
            </div>
          </div>
          <ProductReview product={product} />
          {/* Related Products Section */}
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

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "order"])),
    },
  };
}

export default ProductDetail;
