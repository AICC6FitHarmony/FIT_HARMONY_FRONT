import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "../../css/intro.css";
import { useAuth } from "../../js/login/AuthContext";

const items = Array.from({ length: 20 }, (_, i) => i + 1); // [1, 2, ..., 20]
const PAGE_SIZE = 6;

const DietCarousel = () => {
  const [page, setPage] = useState(0);

  // 현재 페이지에 보여줄 데이터
  const startIdx = page * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const visibleItems = items.slice(startIdx, endIdx);

  // 페이지 이동 핸들러
  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };
  const handleNext = () => {
    if (endIdx < items.length) setPage(page + 1);
  };

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={handlePrev}
        disabled={page === 0}
        className="w-8 h-8 flex items-center justify-center text-2xl mr-2"
      >
        <IoIosArrowBack />
      </button>
      <div
        className="grid grid-cols-6 gap-4 flex-1 mx-4"
        // style={{ transform: `translateX(-${page * 10}%)` }}
      >
        {visibleItems.map((item) => (
          <div key={item} className="text-center">
            <div className="bg-gray-200 h-24 w-24 mx-auto rounded-md flex items-center justify-center text-2xl font-bold">
              {item}
            </div>
            <p className="text-sm mt-1">설명</p>
          </div>
        ))}
      </div>
      <button
        onClick={handleNext}
        disabled={endIdx >= items.length}
        className="w-8 h-8 flex items-center justify-center text-2xl ml-2"
      >
        <IoIosArrowForward />
      </button>
    </div>
  );
};

const trainers = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: "홍길동",
  desc: "헬스 PT ATV 출연\n소개글",
  img: "https://randomuser.me/api/portraits/men/1.jpg", // 예시 이미지
}));

const TrainerCarousel = () => {
  const [page, setPage] = useState(0);

  const startIdx = page * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const visibleTrainers = trainers.slice(startIdx, endIdx);

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };
  const handleNext = () => {
    if (endIdx < trainers.length) setPage(page + 1);
  };

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={handlePrev}
        disabled={page === 0}
        className="w-8 h-8 flex items-center justify-center text-2xl mr-2"
      >
        <IoIosArrowBack />
      </button>
      <div className="grid grid-cols-6 gap-2 flex-1 mx-2">
        {visibleTrainers.map((trainer) => (
          <div key={trainer.id} className="text-center">
            <img
              src={trainer.img}
              alt={trainer.name}
              className="w-20 h-24 object-cover mx-auto rounded"
            />
            <div className="text-xs mt-1 whitespace-pre-line">
              {trainer.desc}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleNext}
        disabled={endIdx >= trainers.length}
        className="w-8 h-8 flex items-center justify-center text-2xl ml-2"
      >
        <IoIosArrowForward />
      </button>
    </div>
  );
};

const reviews = [
  {
    id: 1,
    stars: 4.5,
    content: "후기내용1",
    author: "작성자1",
    date: "2025.",
  },
  {
    id: 2,
    stars: 3,
    content: "후기내용2",
    author: "작성자2",
    date: "2025.",
  },
  {
    id: 3,
    stars: 0,
    content: "후기내용3",
    author: "작성자3",
    date: "2025.",
  },
  {
    id: 4,
    stars: 5,
    content: "후기내용4",
    author: "작성자4",
    date: "2025.",
  },
  {
    id: 5,
    stars: 2.5,
    content: "후기내용5",
    author: "작성자5",
    date: "2025.",
  },
  {
    id: 6,
    stars: 1,
    content: "후기내용6",
    author: "작성자6",
    date: "2025.",
  },
  {
    id: 7,
    stars: 3.5,
    content: "후기내용7",
    author: "작성자7",
    date: "2025.",
  },
  {
    id: 8,
    stars: 0.5,
    content: "후기내용8",
    author: "작성자8",
    date: "2025.",
  },
  {
    id: 9,
    stars: 3.5,
    content: "후기내용9",
    author: "작성자9",
    date: "2025.",
  },
  {
    id: 10,
    stars: 0.5,
    content: "후기내용10",
    author: "작성자10",
    date: "2025.",
  },
  {
    id: 11,
    stars: 3.5,
    content: "후기내용11",
    author: "작성자11",
    date: "2025.",
  },
  {
    id: 12,
    stars: 0.5,
    content: "후기내용12",
    author: "작성자12",
    date: "2025.",
  },
  {
    id: 13,
    stars: 3.5,
    content: "후기내용13",
    author: "작성자13",
    date: "2025.",
  },
  {
    id: 14,
    stars: 0.5,
    content: "후기내용14",
    author: "작성자14",
    date: "2025.",
  },
];

const REVIEW_PAGE_SIZE = 4;

function renderStars(rating) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="text-yellow-400 inline" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 inline" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-400 inline" />);
    }
  }
  return stars;
}

const ReviewCarousel = () => {
  const [page, setPage] = useState(0);
  const startIdx = page * REVIEW_PAGE_SIZE;
  const endIdx = startIdx + REVIEW_PAGE_SIZE;
  const visibleReviews = reviews.slice(startIdx, endIdx);

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };
  const handleNext = () => {
    if (endIdx < reviews.length) setPage(page + 1);
  };

  return (
    <div className="flex items-center justify-between mt-4">
      <button
        onClick={handlePrev}
        disabled={page === 0}
        className="w-8 h-8 flex items-center justify-center text-2xl mr-2"
      >
        <IoIosArrowBack />
      </button>
      <div className="grid grid-cols-4 gap-4 flex-1 mx-2">
        {visibleReviews.map((review) => (
          <div
            key={review.id}
            className="border rounded-xl p-4 text-center bg-white shadow"
          >
            <div className="flex justify-center mb-2">
              {renderStars(review.stars)}
            </div>
            <div className="text-xs whitespace-pre-line mb-2">
              {review.content}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {review.author}
              <br />
              {`발췌 ${review.date}`}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleNext}
        disabled={endIdx >= reviews.length}
        className="w-8 h-8 flex items-center justify-center text-2xl ml-2"
      >
        <IoIosArrowForward />
      </button>
    </div>
  );
};

const Intro = () => {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-white text-black p-6 font-sans px-10">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-2">Fit Harmony</h1>
        {user?.isLoggedIn ? (
          <div className="text-sm">{user.user.nickName}님 환영 합니다</div>
        ) : (
          <button className="border mt-2 px-4 py-2 rounded-md text-sm">
            {/* `${import.meta.env.VITE_BACKEND_DOMAIN}/auth/google` */}
            <a href="/login" className="flex items-center">
              <FcGoogle className="mr-2" /> Login with Google
            </a>
          </button>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4">인기 식단</h2>
        <DietCarousel />
      </div>

      <div className="mt-10">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold mb-2">커뮤니티</h2>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center">
                <div className="w-4 h-4 border rounded mr-2" />
                <span>게시글 제목</span>
              </div>
            ))}
            <button className="text-sm text-[#8e8e8e]">
              <a href="/community">더보기</a>
            </button>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold mb-2">공지사항</h2>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className="w-4 h-4 border rounded mr-2" />
                <span>게시글 제목</span>
              </div>
            ))}
            <button className="text-sm text-[#8e8e8e]">
              <a href="/community">더보기</a>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4">강사 PR (사진 or 영상)</h2>
        <TrainerCarousel />
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4">실시간 후기</h2>
        <ReviewCarousel />
      </div>
    </div>
  );
};

export default Intro;
