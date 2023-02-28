import StoreLayout from "components/layout/StoreLayout";
import React from "react";
import { useGetFetchQuery } from "utils/hooks";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import { Chip } from "@mui/material";

function Home() {
  return (
    <div className="mt-4">
      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        className="mySwiper"
      >
        <SwiperSlide>
          <Chip color="primary" label="kategori 1" />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <Chip color="primary" label="kategori 1" />2
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <Chip color="primary" label="kategori 1" />3
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <Chip color="primary" label="kategori 1" />4
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <Chip color="primary" label="kategori 1" />5
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <Chip color="primary" label="kategori 1" />6
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <Chip color="primary" label="kategori 1" />7
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <Chip color="primary" label="kategori 1" />8
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <Chip color="primary" label="kategori 1" />9
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

Home.getLayout = function (page: React.ReactNode) {
  return <StoreLayout>{page}</StoreLayout>;
};

export default Home;
