import React, { useEffect, useState } from "react";
import Head from "next/head";
import Layout from "components/layout/Landing";
import api from "utils/api";
import { getRelationships, toCurrency } from "utils";
import { Content } from "components";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Thumbs } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import Breadcrumb from "components/mui/Breadcrumb";
import ProductVariants from "components/mui/ProductVariant";
import { useRouter } from "next/router";
import ProductJsonLd from "components/ProductJsonLd"; // Import the JSON-LD component
import { BreadcrumbJsonLd } from "next-seo";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ProductDetailSkeleton from "components/molecules/landing/ProductDetailSkeleton";
import { currency } from "lib/currency";
import { generateWhatsAppLink } from "lib/functions";
import { Star } from "lucide-react";

// Skeleton component for product image
const ProductImageSkeleton = () => (
  <div className="bg-gray-200 dark:bg-gray-700 w-full h-80 rounded opacity-60"></div>
);

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
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const router = useRouter();

  // Get base URL for absolute URLs in JSON-LD
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  useEffect(() => {
    if (router.query?.slug) {
      const fetchProduct = async () => {
        setIsLoading(true);
        try {
          const slug = router.query.slug;
          const product = await api.get("products", {
            "filter[slug]": slug,
            locale: router.locale,
            currency: currency[router.locale] || "id",
            include: "documents",
          });

          setProduct(product.data);
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProduct();
    }
  }, [router.query]);

  // Handle image loading
  useEffect(() => {
    if (!isLoading && product) {
      const documents =
        product.data[0]?.relationships?.documents.data.length > 0
          ? getRelationships(product, product.data[0], "documents")
          : [];

      if (documents.length === 0) {
        // No images to load, set as loaded
        setImagesLoaded(true);
        return;
      }

      // We'll set imagesLoaded to true after a reasonable timeout
      // A more sophisticated approach would be to track each image load
      const timer = setTimeout(() => {
        setImagesLoaded(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, product]);

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  // Prepare data objects for when product is loaded
  const documents =
    !isLoading && product?.data[0]?.relationships?.documents.data.length > 0
      ? getRelationships(product, product.data[0], "documents")
      : [];
  const isDocumentExist =
    !isLoading && documents.length > 0 && !!documents[0]?.attributes.filename;

  // Get current price - either from selected variant or base product price
  const currentPrice =
    !isLoading &&
    (selectedVariant
      ? selectedVariant.price
      : product?.data[0].attributes.formattedPrice);

  // Get current stock - either from selected variant or base product stock
  const currentStock =
    !isLoading &&
    (selectedVariant
      ? selectedVariant.stock
      : product?.data[0].attributes.stock);

  // Prepare message for WhatsApp order
  const prepareOrderMessage = () => {
    if (isLoading || !product) return "";

    let message = `Halo saya ingin memesan \n${product.data[0].attributes.name} (${product.data[0].attributes.code}) ${qty}`;

    if (selectedVariant) {
      message += `\nVariant: ${selectedVariant.sku}`;
    }

    return message;
  };

  return (
    <>
      {/* Add JSON-LD structured data if product is loaded */}
      {!isLoading && product && (
        <>
          <ProductJsonLd product={product} baseUrl={baseUrl} />
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
                name: product.data[0].attributes.name,
                item: `https://souvenirlilin.id/products/${product.data[0].attributes.slug}`,
              },
            ]}
          />
        </>
      )}

      <section className="text-gray-700 dark:text-gray-300 body-font overflow-hidden bg-white min-h-screen dark:bg-gray-900">
        <div className="container mx-auto p-4">
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
            {isLoading ? (
              <div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6 opacity-60"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="bg-gray-200 dark:bg-gray-700 rounded h-64 opacity-60"
                    ></div>
                  ))}
                </div>
              </div>
            ) : (
              <Content
                queryParams={{
                  "page[size]": 4,
                }}
                title="other_products"
              />
            )}
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
