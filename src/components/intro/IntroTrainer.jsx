import React, { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Img from "../common/Img";

const TrainerCarousel = ({ data }) => {
  return (
    <div className="relative w-full mx-auto px-8">
      {" "}
      {/* 좌우 빈공간 확보 */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        loop={true}
        spaceBetween={16}
        slidesPerView={4}
        autoplay={{
          delay: 5000, // 3초마다 다음 슬라이드
          disableOnInteraction: false, // 사용자 터치 이후에도 계속 자동 진행
        }}
        navigation={{
          nextEl: "#swiper-button-next-trainer",
          prevEl: "#swiper-button-prev-trainer",
        }}
        pagination={{
          clickable: true,
          el: ".swiper-pagination-trainer",
        }}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 0,
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
            slidesPerView: 4,
            spaceBetween: 16,
          },
        }}
        className="trainer-swiper overflow-visible"
      >
        {data &&
          data.map((item, idx) => (
            <SwiperSlide key={idx}>
              <div className="text-center">
                <div className="border w-full h-60 sm:h-50 mx-auto rounded-md flex items-center justify-center overflow-hidden">
                  <Img
                    src={`/common/file/${item.fileId}`}
                    className="object-contain"
                  />
                </div>
                <div className="text-xl font-bold mt-1 whitespace-pre-line">
                  {item.nickName}
                </div>
                <div className="text-sm text-gray-500 mt-1 whitespace-pre-line">
                  {item.fitGoal?.replace(/;/g, ",")}
                </div>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
      {/* 좌우 화살표 버튼 - padding 영역에 위치 */}
      <div
        id="swiper-button-prev-trainer"
        className="absolute top-0 left-0 z-10 w-8 h-60 sm:h-50 rounded-tl-2xl rounded-bl-2xl bg-green-100 sm:bg-white sm:hover:bg-green-100  shadow-md flex items-center justify-center cursor-pointer"
      >
        <IoIosArrowBack />
      </div>
      <div
        id="swiper-button-next-trainer"
        className="absolute right-0 top-0 z-10 w-8 h-60 sm:h-50 rounded-tr-2xl rounded-br-2xl bg-green-100 sm:bg-white sm:hover:bg-green-100 shadow-md flex items-center justify-center cursor-pointer"
      >
        <IoIosArrowForward />
      </div>
      <div className="swiper-pagination-trainer mt-4 text-center"></div>
    </div>
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
