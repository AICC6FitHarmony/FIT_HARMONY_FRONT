import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const trainers = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  name: "홍길동",
  desc: "헬스 PT ATV 출연\n소개글",
  img: "https://randomuser.me/api/portraits/men/1.jpg", // 예시 이미지
}));

const TrainerCarousel = () => {
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
      {trainers.map((trainer) => (
        <SwiperSlide key={trainer.id}>
          <div className="text-center">
            <img
              src={trainer.img}
              alt={trainer.name}
              className="w-20 h-24 object-cover mx-auto rounded"
            />
            <div className="text-xs mt-1 whitespace-pre-line">
              {trainer.desc}
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

const IntroTrainer = () => {
  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold mb-4">강사 PR (사진 or 영상)</h2>
      <TrainerCarousel />
    </div>
  );
};

export default IntroTrainer;
