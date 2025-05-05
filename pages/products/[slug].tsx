import React from "react";
import Head from "next/head";
import Layout from "components/layout/Landing";
import Breadcrumb from "components/mui/Breadcrumb";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Star } from "lucide-react";

// Import custom components
import ProductImageGallery from "components/product/ProductImageGallery";
import ProductInformation from "components/product/ProductInformation";
import RelatedProducts from "components/product/RelatedProducts";
import SEOComponents from "components/product/SEOComponents";

// Import custom hook
import useProduct from "hooks/useProduct";
import ProductActions from "components/product/ProductActions";

const ProductReview = ({ product }) => {
  if (!product) return null;
  const productAttributes = product.data[0].attributes;
  const productReviews = productAttributes.product_reviews || [];
  const averageRating =
    productReviews.length > 0
      ? (
          productReviews.reduce((sum, review) => sum + review.rating, 0) /
          productReviews.length
        ).toFixed(1)
      : "No ratings";

  return (
    <>
      {productReviews.length > 0 && (
        <div className="mt-6 border-t pt-4 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Customer Reviews
          </h3>
          <div className="space-y-4">
            {productReviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {review.user?.name || "Anonymous"}
                    </p>
                    <div className="flex text-yellow-500 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < review.rating ? "currentColor" : "none"}
                          stroke={
                            i < review.rating ? "currentColor" : "currentColor"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  {review.review}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
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

      <section className="text-gray-700 dark:text-gray-300 body-font overflow-hidden bg-white min-h-screen dark:bg-gray-900">
        <div className="container mx-auto p-4">
          {/* Breadcrumb */}
          {!isLoading && product ? (
            <Breadcrumb currentLabel={product.data[0].attributes.name} />
          ) : (
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4 opacity-60"></div>
          )}

          <div className="flex gap-6 flex-col md:flex-row">
            {/* Product Images Section - Left Column (Sticky) - Smaller */}
            <div className="md:w-1/4 md:sticky md:top-20 md:self-start">
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
            <div className="md:w-1/4 md:sticky md:self-start">
              <ProductActions />
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
