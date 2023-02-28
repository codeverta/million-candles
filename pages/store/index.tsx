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

const productCategoriesParam = {
  "page[size]": 5,
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

  console.log({ getProducts });
  return (
    <div className="py-4">
      <Swiper
        slidesPerView="auto"
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
      <article className="p-4">
        <h1 className="text-2xl font-bold text-gray-900">Produk Terlaris</h1>
      </article>
    </div>
  );
}

Home.getLayout = function (page: React.ReactNode) {
  return <StoreLayout>{page}</StoreLayout>;
};

export default Home;
