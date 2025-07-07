import React, { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const TrainerCarousel = ({ data }) => {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={8}
      slidesPerView={6}
      navigation={{
        nextEl: ".swiper-button-next-trainer",
        prevEl: ".swiper-button-prev-trainer",
      }}
      pagination={{
        clickable: true,
        el: ".swiper-pagination-trainer",
      }}
      breakpoints={{
        320: {
          slidesPerView: 2,
          spaceBetween: 8,
        },
        480: {
          slidesPerView: 3,
          spaceBetween: 8,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 8,
        },
        1024: {
          slidesPerView: 6,
          spaceBetween: 8,
        },
      }}
      className="trainer-swiper"
    >
      {data &&
        data.map((item, idx) => (
          <SwiperSlide key={idx}>
            <div className="text-center">
              <div className="border-1 h-24 w-24 mx-auto rounded-md flex items-center justify-center text-2xl font-bold">
                <img
                  src={`${import.meta.env.VITE_BACKEND_DOMAIN}/common/file/${
                    item.fileId
                  }`}
                  alt=""
                />
              </div>
              <div className="text-xs mt-1 whitespace-pre-line">
                {item.nickName}
                {item.fitGoal}
              </div>
            </div>
          </SwiperSlide>
        ))}
      <div className="swiper-button-prev-trainer absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer">
        <IoIosArrowBack />
      </div>
      <div className="swiper-button-next-trainer absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer">
        <IoIosArrowForward />
      </div>
      <div className="swiper-pagination-trainer mt-4"></div>
    </Swiper>
  );
};

const IntroTrainer = ({ getTrainerData }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(getTrainerData);
  }, [getTrainerData]);

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold mb-4">인기 강사</h2>
      <TrainerCarousel data={data} />
    </div>
  );
};

export default IntroTrainer;
