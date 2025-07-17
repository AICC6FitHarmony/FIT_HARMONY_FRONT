import React, { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Img from "../common/Img";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const DietCarousel = ({ data }) => {
  return (
      <div className="relative w-full mx-auto px-8"> {/* 좌우 빈공간 확보 */}
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
            nextEl: "#swiper-button-next-diet",
            prevEl: "#swiper-button-prev-diet",
          }}
          pagination={{
            clickable: true,
            el: ".swiper-pagination-diet",
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
          className="diet-swiper overflow-visible"
        >
          {data && data.map((item, idx) => (
            <SwiperSlide key={idx}>
              <div className="text-center">
                <div className="border w-full h-60 sm:h-50 mx-auto rounded-md flex items-center justify-center overflow-hidden">
                  <Img src={`/common/file/${item.fileId}`} className="object-cover" />
                </div>
                <p className="text-sm mt-2">{item.dietMainMenuName}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 좌우 화살표 버튼 - padding 영역에 위치 */}
        <div id="swiper-button-prev-diet" className="absolute top-0 left-0 z-10 w-8 h-60 sm:h-50 rounded-tl-2xl rounded-bl-2xl bg-green-100 sm:bg-white sm:hover:bg-green-100  shadow-md flex items-center justify-center cursor-pointer">
          <IoIosArrowBack />
        </div>
        <div id="swiper-button-next-diet" className="absolute right-0 top-0 z-10 w-8 h-60 sm:h-50 rounded-tr-2xl rounded-br-2xl bg-green-100 sm:bg-white sm:hover:bg-green-100 shadow-md flex items-center justify-center cursor-pointer">
          <IoIosArrowForward />
        </div>

        <div className="swiper-pagination-diet mt-4 text-center"></div>
      </div>
  );
};

const IntroDiet = ({ getDietData }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(getDietData);
  }, [getDietData]);
  return (
    <div className="mt-10">
      <h2 className=" text-lg font-semibold border-b-2 pb-1 mb-4 ">인기 식단</h2>
      <DietCarousel data={data} />
    </div>
  );
};

export default IntroDiet;
