import React, { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const DietCarousel = ({ data }) => {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={16}
      slidesPerView={6}
      navigation={{
        nextEl: ".swiper-button-next-diet",
        prevEl: ".swiper-button-prev-diet",
      }}
      pagination={{
        clickable: true,
        el: ".swiper-pagination-diet",
      }}
      breakpoints={{
        320: {
          slidesPerView: 2,
          spaceBetween: 8,
        },
        480: {
          slidesPerView: 3,
          spaceBetween: 12,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 16,
        },
        1024: {
          slidesPerView: 6,
          spaceBetween: 16,
        },
      }}
      className="diet-swiper"
    >
      {data && data.map((item, idx) => (
        <SwiperSlide key={idx}>
          <div className="text-center">
            <div className="border-1 h-24 w-24 mx-auto rounded-md flex items-center justify-center text-2xl font-bold">
              <span>파일 권한 제거해야함</span>
              {/* <img src={`${import.meta.env.VITE_BACKEND_DOMAIN}/common/file/${item.fileId}`} alt="" /> */}
            </div>
            <p className="text-sm mt-1">{item.dietMainMenuName}</p>
          </div>
        </SwiperSlide>
      ))}
      <div className="swiper-button-prev-diet absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer">
        <IoIosArrowBack />
      </div>
      <div className="swiper-button-next-diet absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer">
        <IoIosArrowForward />
      </div>
      <div className="swiper-pagination-diet mt-4"></div>
    </Swiper>
  );
};

const IntroDiet = ({ getDietData }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(getDietData);
  }, [getDietData]);
  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold mb-4">인기 식단</h2>
      <DietCarousel data={data} />
    </div>
  );
};

export default IntroDiet;