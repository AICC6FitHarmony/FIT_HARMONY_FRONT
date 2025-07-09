import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTrainerDetail,
  fetchAllTrainerReviews,
} from '../../js/redux/slice/sliceTrainer';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

const TrainerReview = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();

  const detail = useSelector((state) => state.trainer.trainers.detail);
  // Redux slice에서 review 필드에 저장되므로 review 사용
  const allReviews = useSelector((state) => state.trainer.trainers.review);
  const status = useSelector((state) => state.trainer.status);

  // 리뷰 작성 상태
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    content: '',
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  // 페이징 계산
  const totalReviews = allReviews?.length || 0;
  const totalPages = Math.ceil(totalReviews / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentReviews = allReviews?.slice(startIndex, endIndex) || [];

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // 페이지 변경 시 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (userId) {
      dispatch(fetchTrainerDetail(userId));
      // fetchTrainerReview 제거, fetchAllTrainerReviews만 사용
      dispatch(fetchAllTrainerReviews(userId));
    }
  }, [userId, dispatch]);

  // 별점 클릭 핸들러
  const handleRatingClick = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  // 리뷰 내용 변경 핸들러
  const handleContentChange = (e) => {
    setNewReview((prev) => ({ ...prev, content: e.target.value }));
  };

  // 리뷰 제출 핸들러 수정
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (newReview.rating === 0) {
      alert('별점을 선택해주세요.');
      return;
    }

    if (newReview.content.trim() === '') {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    try {
      const reviewData = {
        trainerId: userId,
        rating: newReview.rating,
        content: newReview.content.trim(),
      };

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/trainer/review`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(reviewData),
        }
      );

      const result = await response.json();

      if (result.success) {
        alert(result.msg || '리뷰가 성공적으로 등록되었습니다!');

        // 폼 초기화
        setNewReview({ rating: 0, content: '' });
        setShowWriteForm(false);
        setHoveredRating(0);

        // fetchAllTrainerReviews만 호출
        dispatch(fetchAllTrainerReviews(userId));

        // 새 리뷰 추가 후 첫 페이지로 이동
        setCurrentPage(1);
      } else {
        throw new Error(result.msg || '리뷰 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('리뷰 등록 실패:', error);
      alert(`리뷰 등록에 실패했습니다: ${error.message}`);
    }
  };

  // 별점 렌더링 함수
  const renderStars = (rating, isInteractive = false, size = 'w-4 h-4') => {
    return [...Array(5)].map((_, i) => {
      const starValue = i + 1;
      const isActive = isInteractive
        ? (hoveredRating || newReview.rating) >= starValue
        : rating >= starValue;

      return (
        <FaStar
          key={i}
          className={`${size} cursor-pointer transition-colors ${
            isActive ? 'text-yellow-400' : 'text-gray-300'
          }`}
          onClick={
            isInteractive ? () => handleRatingClick(starValue) : undefined
          }
          onMouseEnter={
            isInteractive ? () => setHoveredRating(starValue) : undefined
          }
          onMouseLeave={isInteractive ? () => setHoveredRating(0) : undefined}
        />
      );
    });
  };

  // 페이지네이션 렌더링 함수
  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        {/* 이전 페이지 버튼 */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FaChevronLeft className="w-3 h-3" />
          이전
        </button>

        {/* 첫 페이지 */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
            >
              1
            </button>
            {startPage > 2 && <span className="px-1 text-gray-400">...</span>}
          </>
        )}

        {/* 페이지 번호들 */}
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
              currentPage === pageNumber
                ? 'bg-green-500 text-white'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            {pageNumber}
          </button>
        ))}

        {/* 마지막 페이지 */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-1 text-gray-400">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* 다음 페이지 버튼 */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          다음
          <FaChevronRight className="w-3 h-3" />
        </button>
      </div>
    );
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-lime-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>리뷰를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-lime-50 to-green-100 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to={`/trainer/${userId}`}
              className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors"
            >
              <span>돌아가기</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">
                {detail?.userName?.[0] || 'T'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {detail?.userName || '트레이너'} 강사님의 리뷰
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <FaStar className="text-yellow-400" />
                <span className="font-medium">{detail?.rating || 0}</span>
                <span className="text-gray-500">
                  ({detail?.reviewCount || 0}개의 리뷰)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 리뷰 작성 버튼 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                이 강사님은 어떠셨나요?
              </h2>
              <p className="text-sm text-gray-600">
                다른 회원들을 위해 솔직한 리뷰를 남겨주세요.
              </p>
            </div>
            <button
              onClick={() => setShowWriteForm(!showWriteForm)}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              <span>리뷰 작성하기</span>
            </button>
          </div>
        </div>

        {/* 리뷰 작성 폼 */}
        {showWriteForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              리뷰 작성
            </h3>
            <form onSubmit={handleSubmitReview}>
              {/* 별점 선택 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  별점을 선택해주세요
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {renderStars(newReview.rating, true, 'w-8 h-8')}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    {newReview.rating > 0
                      ? `${newReview.rating}점`
                      : '별점을 선택하세요'}
                  </span>
                </div>
              </div>

              {/* 리뷰 내용 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  리뷰 내용
                </label>
                <textarea
                  value={newReview.content}
                  onChange={handleContentChange}
                  placeholder="강사님과의 경험을 자세히 알려주세요. 다른 회원들에게 도움이 되는 솔직한 후기를 남겨주시면 감사하겠습니다."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows="4"
                  maxLength="500"
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {newReview.content.length}/500
                </div>
              </div>

              {/* 제출 버튼 */}
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  리뷰 등록
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowWriteForm(false);
                    setNewReview({ rating: 0, content: '' });
                    setHoveredRating(0);
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 리뷰 목록 - review 대신 allReviews 사용 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            전체 리뷰 ({totalReviews}개)
          </h2>
          <div className="space-y-6">
            {currentReviews?.length > 0 ? (
              currentReviews.map((r, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-6 border-l-4 border-green-500 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {(r.userName || '익명')[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">
                          {r.userName || '익명'}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            {renderStars(r.rating || 0)}
                          </div>
                          <span className="text-sm font-medium text-gray-600">
                            {r.rating}점
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                        {r.formattedDate}
                      </span>
                    </div>
                  </div>

                  <div className="pl-15">
                    <p className="text-gray-700 leading-relaxed text-base">
                      {r.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaStar className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium mb-2">
                  등록된 리뷰가 없습니다
                </p>
                <p className="text-gray-400 text-sm">
                  첫 번째 리뷰를 남겨보세요!
                </p>
              </div>
            )}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && renderPagination()}
        </div>
      </div>
    </div>
  );
};

export default TrainerReview;
