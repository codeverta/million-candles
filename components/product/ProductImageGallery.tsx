// components/product/ProductImageGallery.js

import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Thumbs } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import {
  ProductImageSkeleton,
  ThumbnailSkeleton,
} from "components/molecules/landing/ProductDetailSkeleton";

/**
 * Product image gallery component with manual cleanup logic
 */
const ProductImageGallery = ({
  isLoading,
  isImagesLoaded,
  documents,
  isDocumentExist,
  productName,
  productIdentifier, // Menerima identifier unik untuk memicu effect
}: any) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const mainSwiperRef = useRef(null);

  // useEffect untuk membersihkan (destroy) instance Swiper saat komponen unmount
  useEffect(() => {
    // Fungsi cleanup ini akan berjalan saat komponen akan dihancurkan
    return () => {
      if (mainSwiperRef.current) {
        mainSwiperRef.current.destroy(true, true);
      }
    };
  }, [productIdentifier]); // Effect ini bergantung pada identifier produk

  if (isLoading || !isImagesLoaded) {
    return (
      <div className="w-full">
        <ProductImageSkeleton />
        <ThumbnailSkeleton />
      </div>
    );
  }

  return (
    <>
      <Swiper
        // Key tetap penting untuk memicu siklus unmount/mount dari React
        key={productIdentifier}
        spaceBetween={10}
        navigation={true}
        pagination={{ clickable: true }}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        className="w-full"
        modules={[Pagination, Thumbs]}
        // Menyimpan instance swiper ke dalam ref saat dibuat
        onSwiper={(swiper) => {
          mainSwiperRef.current = swiper;
        }}
      >
        {isDocumentExist ? (
          documents.map((document) => (
            <SwiperSlide key={document.id}>
              <div className="relative rounded-lg border h-80 w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-gray-200 dark:bg-gray-700 w-full h-full opacity-60"></div>
                </div>
                <img
                  alt={productName}
                  src={document.attributes.filename}
                  className="h-auto w-auto max-w-full max-h-full m-auto z-10 relative"
                  style={{ objectFit: "contain" }}
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
              />
            </div>
          </SwiperSlide>
        )}
      </Swiper>

      {isDocumentExist && (
        <Swiper
          key={`thumbs-${productIdentifier}`}
          modules={[Thumbs]}
          watchSlidesProgress
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={3}
          freeMode={true}
          className="mt-4"
        >
          {documents.map((document) => (
            <SwiperSlide className="border rounded-md" key={document.id}>
              <div className="h-20">
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 opacity-60"></div>
                <img
                  alt="Thumbnail"
                  src={document.attributes.filename}
                  className="h-full w-full object-cover z-10 relative"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
};

export default ProductImageGallery;
