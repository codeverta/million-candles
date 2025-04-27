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

function generateWhatsAppLink(phoneNumber, message) {
  // Encode the message to make it URL-safe
  const encodedMessage = encodeURIComponent(message);

  // Construct the WhatsApp URL
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return whatsappURL;
}

// Skeleton component for product image
const ProductImageSkeleton = () => (
  <div className="bg-gray-200 dark:bg-gray-700 w-full h-80 rounded opacity-60"></div>
);

// Skeleton component for thumbnails
const ThumbnailSkeleton = () => (
  <div className="mt-4 grid grid-cols-3 gap-2">
    {[1, 2, 3].map((item) => (
      <div
        key={item}
        className="bg-gray-200 dark:bg-gray-700 w-full h-20 rounded opacity-60"
      ></div>
    ))}
  </div>
);

// Skeleton component for product details
const ProductDetailsSkeleton = () => (
  <div className="w-full md:pl-10 lg:py-6 mt-6 lg:mt-0">
    <div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4 opacity-60"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6 opacity-60"></div>

      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3 opacity-60"></div>
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3 opacity-60"></div>

      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6 opacity-60"></div>

      <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded w-full mb-6 opacity-60"></div>

      <div className="flex items-center">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-32 mr-4 opacity-60"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-24 opacity-60"></div>
      </div>

      <div className="mt-8">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4 opacity-60"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2 opacity-60"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2 opacity-60"></div>
      </div>
    </div>
  </div>
);

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
      : product?.data[0].attributes.price);

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

          <div className="flex flex-col md:flex-row">
            {/* Product Images Section */}
            <div className="md:w-1/3">
              {isLoading || !imagesLoaded ? (
                <div className="w-full">
                  <ProductImageSkeleton />
                  <ThumbnailSkeleton />
                </div>
              ) : (
                <>
                  <Swiper
                    spaceBetween={10}
                    navigation={true}
                    pagination={{ clickable: true }}
                    thumbs={{ swiper: thumbsSwiper }}
                    className="w-full"
                    modules={[Pagination, Thumbs]}
                  >
                    {isDocumentExist ? (
                      documents.map((document: any) => (
                        <SwiperSlide key={document.id}>
                          <div className="relative h-80 w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-gray-200 dark:bg-gray-700 w-full h-full opacity-60"></div>
                            </div>
                            <img
                              alt={product.data[0].attributes.name}
                              src={document.attributes.filename}
                              className="h-auto w-auto max-w-full max-h-full m-auto z-10 relative"
                              style={{ objectFit: "contain" }}
                              onLoad={(e) => {
                                // Remove the skeleton when the image loads
                                e.target.previousSibling.style.display = "none";
                              }}
                            />
                          </div>
                        </SwiperSlide>
                      ))
                    ) : (
                      <SwiperSlide>
                        <div className="relative h-80 w-full">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-gray-200 dark:bg-gray-700 w-full h-full opacity-60"></div>
                          </div>
                          <img
                            alt="Product"
                            src="/assets/image-1@2x.jpg"
                            className="h-full w-full object-contain z-10 relative"
                            onLoad={(e) => {
                              e.target.previousSibling.style.display = "none";
                            }}
                          />
                        </div>
                      </SwiperSlide>
                    )}
                  </Swiper>
                  {isDocumentExist && (
                    <Swiper
                      modules={[Thumbs]}
                      watchSlidesProgress
                      onSwiper={setThumbsSwiper}
                      spaceBetween={10}
                      slidesPerView={3}
                      freeMode={true}
                      className="mt-4"
                    >
                      {documents.map((document) => (
                        <SwiperSlide key={document.id}>
                          <div className="relative h-20">
                            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 opacity-60"></div>
                            <img
                              alt="Thumbnail"
                              src={document.attributes.filename}
                              className="h-full w-full object-cover z-10 relative"
                              onLoad={(e) => {
                                e.target.previousSibling.style.display = "none";
                              }}
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </>
              )}
            </div>

            {/* Product Details Section */}
            {isLoading ? (
              <ProductDetailsSkeleton />
            ) : (
              <div className="lg:w-1/2 w-full md:pl-10 lg:py-6 mt-6 lg:mt-0">
                <h1 className="text-gray-900 dark:text-gray-50 text-3xl title-font font-medium mb-1">
                  {product.data[0].attributes.name} (
                  {product.data[0].attributes.code})
                </h1>
                <p className="text-green-600 font-bold text-xl mb-4">
                  {toCurrency(currentPrice)}
                </p>
                <div className="mb-4">
                  <ProductVariants
                    product={product.data[0]}
                    onVariantChange={handleVariantChange}
                  />
                </div>
                <div className="mb-4">
                  <span className="font-semibold">Min. Pemesanan: </span>1 Buah
                </div>
                <div className="mb-4">
                  <span className="font-semibold">Stock: </span>
                  {currentStock}
                </div>
                <div className="mb-4" style={{ whiteSpace: "pre-line" }}>
                  {/* deskripsi */}
                  {product.data[0].attributes.description}
                </div>
                <div className="mt-4 flex items-center">
                  <div className="relative flex items-center max-w-[8rem]">
                    <button
                      type="button"
                      disabled={qty <= 1}
                      id="decrement-button"
                      onClick={() => (qty > 1 ? setQty(qty - 1) : null)}
                      data-input-counter-decrement="quantity-input"
                      className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-l-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none flex items-center"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      id="quantity-input"
                      value={qty}
                      data-input-counter
                      aria-describedby="helper-text-explanation"
                      className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="1"
                      min={1}
                      required
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={() => setQty(qty + 1)}
                      id="increment-button"
                      data-input-counter-increment="quantity-input"
                      className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-r-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none flex items-center"
                    >
                      +
                    </button>
                  </div>

                  <a
                    target="_blank"
                    href={generateWhatsAppLink(
                      "+6281578956156",
                      prepareOrderMessage()
                    )}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded ml-2 transition duration-300"
                    rel="noopener noreferrer"
                  >
                    Pesan
                  </a>
                </div>
                {/* Seller Information and Shipping */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">
                    UD Million Candles
                  </h2>
                  <div className="text-gray-700 dark:text-gray-300">Online</div>
                  <div className="text-gray-700 dark:text-gray-300">
                    Kab. Sleman
                  </div>
                </div>
              </div>
            )}
          </div>

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

export default ProductDetail;
