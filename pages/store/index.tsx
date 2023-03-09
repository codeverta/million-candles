import StoreLayout from "components/layout/StoreLayout";
import React from "react";
import { useGetFetchQuery } from "utils/hooks";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import { Chip, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import api from "utils/api";
import LoadingBackdrop from "components/mui/LoadingBackdrop";
import ProductCard from "components/molecules/ProductCard";

const productCategoriesParam = {
  "page[size]": 9,
};

const productsParam = {
  "page[size]": 10,
  include: "documents",
};

function Home() {
  const getProductCategories = useQuery({
    queryKey: ["product-categories"],
    queryFn: () => {
      return api.get("product-categories", productCategoriesParam);
    },
  });
  const getProducts = useQuery({
    queryKey: ["products"],
    queryFn: () => {
      return api.get("products", productsParam);
    },
  });

  if (
    getProductCategories.isLoading ||
    getProductCategories.isError ||
    getProducts.isLoading ||
    getProducts.isError
  ) {
    return <LoadingBackdrop />;
  }

  const handleClick = () => {};

  return (
    <div className="py-4">
      <Swiper
        slidesPerView="auto"
        className="!px-2"
        pagination={{
          clickable: true,
        }}
      >
        {getProductCategories.data.data.data.map((productCategory: any) => (
          <SwiperSlide className="!w-fit mx-1/2 p-1" key={productCategory.id}>
            <Chip
              onClick={handleClick}
              color="primary"
              label={productCategory.attributes.name}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <article className="p-3">
        <Typography variant="h6">Rekomendasi Produk</Typography>
        <Swiper
          slidesPerView="auto"
          className="my-4"
          pagination={{
            clickable: true,
          }}
        >
          {getProducts.data.data.data.map((product: any) => {
            return (
              <SwiperSlide
                className="!w-fit mx-1/2 max-w-xs p-1"
                key={product.id}
              >
                <ProductCard product={product} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </article>
      <article className="p-3">
        <Typography variant="h6">Produk Terlaris</Typography>
        <Swiper
          slidesPerView="auto"
          className="my-4"
          pagination={{
            clickable: true,
          }}
        >
          {getProducts.data.data.data.map((product: any) => {
            return (
              <SwiperSlide
                className="!w-fit mx-1/2 max-w-xs p-1"
                key={product.id}
              >
                <ProductCard product={product} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </article>
    </div>
  );
}

Home.getLayout = function (page: React.ReactNode) {
  return <StoreLayout>{page}</StoreLayout>;
};

export default Home;
