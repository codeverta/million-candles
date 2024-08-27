import React from "react";
import Layout from "components/layout/Landing";
import { useQuery } from "@tanstack/react-query";
import api from "utils/api";
import { getRelationships, toCurrency } from "utils";
import { Content } from "components";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// @ts-ignore
// @ts-nocheck
import { Pagination, Thumbs } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import Breadcrumb from "components/mui/Breadcrumb";
import ProductVariants from "components/mui/ProductVariant";
import { Button } from "@mui/material";
//@ts-ignore

function generateWhatsAppLink(phoneNumber, message) {
  // Encode the message to make it URL-safe
  const encodedMessage = encodeURIComponent(message);

  // Construct the WhatsApp URL
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return whatsappURL;
}

function ProductDetail({ product }: { product: DataResponse<ProductData> }) {
  const [thumbsSwiper, setThumbsSwiper] = React.useState<any>(null);
  const [qty, setQty] = React.useState<number>(1);
  const documents =
    product.data.relationships?.documents.data.length > 0
      ? getRelationships(product, product.data, "documents")
      : [];
  const isDocumentExist = !!documents[0]?.attributes.filename;
  return (
    <section className="text-gray-700 dark:text-gray-300 body-font overflow-hidden bg-white min-h-screen dark:bg-gray-900">
      <div className="container mx-auto p-4">
        <Breadcrumb currentLabel={product.data.attributes.name} />
        <div className="flex flex-col md:flex-row">
          {/* Swiper for product images */}
          <div className="md:w-1/3">
            <Swiper
              spaceBetween={10}
              navigation={true}
              pagination={{ clickable: true }}
              thumbs={{ swiper: thumbsSwiper }}
              className="w-full"
              modules={[Pagination, Thumbs]}
            >
              {isDocumentExist ? (
                documents.map((document: DocumentData) => (
                  <SwiperSlide key={document.id}>
                    <img
                      alt="ecommerce"
                      src={
                        process.env.NEXT_PUBLIC_BASE +
                        "/storage/" +
                        document.attributes.filename
                      }
                      className="h-full m-auto"
                    />{" "}
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <img
                    alt="ecommerce"
                    src="/assets/image-1@2x.jpg"
                    className="h-full"
                  />{" "}
                </SwiperSlide>
              )}
            </Swiper>
            <Swiper
              modules={[Thumbs]}
              watchSlidesProgress
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={3}
              freeMode={true}
              className="mt-4"
            >
              {isDocumentExist
                ? documents.map((document: DocumentData) => (
                    <SwiperSlide key={document.id}>
                      <img
                        alt="ecommerce"
                        src={
                          process.env.NEXT_PUBLIC_BASE +
                          "/storage/" +
                          document.attributes.filename
                        }
                      />{" "}
                    </SwiperSlide>
                  ))
                : null}
            </Swiper>
          </div>
          <div className="lg:w-1/2 w-full md:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h1 className="text-gray-900 dark:text-gray-50 text-3xl title-font font-medium mb-1">
              {product.data.attributes.name}
            </h1>
            <p className="text-green-600 font-bold text-xl mb-4">
              {toCurrency(product.data.attributes.price)}
            </p>
            <div className="mb-4">
              <ProductVariants />
            </div>
            <div className="mb-4">
              <span className="font-semibold">Kondisi: </span>Baru
            </div>
            <div className="mb-4">
              <span className="font-semibold">Min. Pemesanan: </span>1 Buah
            </div>
            <div className="mb-4">
              <span className="font-semibold">Stock: </span>
              {product.data.attributes.stock}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Etalase: </span>Semua Etalase
            </div>
            <div className="mb-4" style={{ whiteSpace: "pre-line" }}>
              {/* deskripsi */}
              {product.data.attributes.description}
            </div>
            <div className="mt-4 flex items-center">
              <div className="relative flex items-center max-w-[8rem]">
                <button
                  type="button"
                  disabled={qty == 0}
                  id="decrement-button"
                  onClick={() => (qty > 0 ? setQty(qty - 1) : null)}
                  data-input-counter-decrement="quantity-input"
                  className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-l-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none flex items-center"
                >
                  -
                </button>
                <input
                  value={qty}
                  type="text"
                  id="quantity-input"
                  data-input-counter
                  aria-describedby="helper-text-explanation"
                  className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="0"
                  min={0}
                  required
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

              {/* <button className="bg-green-500 text-white px-4 py-2 rounded ml-2">
                + Keranjang
              </button> */}
              <a
                target="_blank"
                href={generateWhatsAppLink(
                  "+6281578956156",
                  `Halo saya ingin memesan \n${product.data.attributes.name}(${product.data.attributes.code}) ${qty}`
                )}
                className="bg-green-600 text-white px-4 py-2 rounded ml-2"
              >
                Pesan
              </a>
            </div>
            {/* Seller Information and Shipping */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">UD Million Candles</h2>
              <div className="text-gray-700">Online kemarin</div>
              <div className="text-gray-700">Kab. Sleman</div>
              <div className="mt-4">
                <button className="bg-gray-200 px-4 py-2 rounded">Chat</button>
              </div>
            </div>
          </div>
        </div>
        <section className="mt-16">
          <Content title="Produk Lainnya" />
        </section>
      </div>
    </section>
  );
}

ProductDetail.getLayout = function (page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};

//
export async function getStaticPaths() {
  const products = await api.get("products");
  const productsParams = products.data.data.map((it: any) => {
    return {
      params: {
        slug: it.attributes.slug,
        // id: it.id,
      },
    };
  });

  return {
    paths: productsParams,
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const product = await api.get("products", {
    "filter[slug]": params.slug,
  });
  const productData = await api.get("products/" + product.data.data[0].id, {
    include: "documents",
  });
  return {
    props: {
      product: productData.data,
    },
  };
}

export default ProductDetail;
