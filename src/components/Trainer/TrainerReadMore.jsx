import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import {
  fetchTrainerDetail,
  fetchTrainerProduct,
  fetchTrainerReview,
} from '../../js/redux/slice/sliceTrainer';
import {
  Heart,
  Share2,
  Phone,
  Mail,
  MapPin,
  Star,
  ChevronRight,
} from 'lucide-react';

const TrainerReadMore = () => {
  const { userId } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    if (userId) {
      dispatch(fetchTrainerDetail(userId));
      dispatch(fetchTrainerProduct(userId));
      dispatch(fetchTrainerReview(userId));
    }
  }, [userId, dispatch]);

  const detail = useSelector((state) => state.trainer.trainers.detail);
  const status = useSelector((state) => state.trainer.status);
  const error = useSelector((state) => state.trainer.error);
  const product = useSelector((state) => state.trainer.trainers.product);
  const review = useSelector((state) => state.trainer.trainers.review);

  // // 디버깅용 useEffect

  // useEffect(() => {
  //   console.log('Error:', review);
  // }, [review]);

  const handleConsultationRequest = () => {
    alert('상담 요청이 접수되었습니다! 곧 연락드리겠습니다.');
  };

  const handleServiceClick = (name) => {
    alert(`${name} 상세 정보를 확인하시겠습니까?`);
  };

  const handleContactClick = (type) => {
    switch (type) {
      case 'phone':
        alert('전화 연결 중...');
        break;
      case 'email':
        alert('이메일 작성 중...');
        break;
      case 'location':
        alert('위치 정보를 확인합니다.');
        break;
      default:
        break;
    }
  };

  // 로딩 상태 처리
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-lime-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>트레이너 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-lime-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">데이터를 불러오는데 실패했습니다.</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // detail이 없거나 빈 객체인 경우 처리
  if (!detail || Object.keys(detail).length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-lime-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">트레이너 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  // product이 없거나 빈 객체인 경우 처리
  if (!product || Object.keys(product).length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-lime-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">상품 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-lime-50 to-green-100">
      {/* 헤더 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-8">
            {/* 프로필 이미지 */}
            <div className="relative">
              <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  <h1>{detail?.fileId}</h1>
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-sm">✨</span>
              </div>
            </div>

            {/* 기본 정보 */}
            <div className="flex-1">
              <div className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-3">
                TRAINER
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {detail?.userName || detail?.name || '트레이너'}
              </h1>
              <p className="text-gray-600 mb-4">
                건강한 변화의 시작, 함께 만들어가요
              </p>

              {/* 통계 */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">
                      {detail?.rating || '없음'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">평점</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">
                    {detail?.fitHistory || '없음'}
                  </div>
                  <div className="text-sm text-gray-500">경력</div>
                </div>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleConsultationRequest}
              className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              상담 요청하기
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 자기소개 */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                자기소개
              </h2>
              <div className="prose text-gray-700 leading-relaxed">
                <p className="mb-4">
                  안녕하세요! 건강한 삶을 추구하는{' '}
                  <strong>
                    {detail?.userName || detail?.name || '트레이너'}
                  </strong>{' '}
                  트레이너입니다.
                </p>
                <p className="mb-4">{detail?.introduction || '비어있음'}</p>
              </div>
            </div>
            {/* 제공 서비스 */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                제공 서비스
              </h2>

              <div className="space-y-4">
                {product && product.length > 0 ? (
                  product.map((p, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleServiceClick(p.name)}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">
                            {p.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {p.description || '설명 없음'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {p.sessionCnt}회 · {p.type}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-orange-600">
                            {p.price != null
                              ? `${p.price.toLocaleString()}원`
                              : '정보없음'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    등록된 상품이 없습니다.
                  </p>
                )}
              </div>
            </div>
            {/* 리뷰 */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  리뷰
                </h2>
                <div className="bg-blue-50 px-4 py-2 rounded-full">
                  <span className="text-blue-700 font-semibold text-sm">
                    {detail?.reviewCount || '0'}개의 리뷰
                  </span>
                </div>
              </div>
              <div className="space-y-6">
                {review?.length > 0 ? (
                  review.map((r, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {(r.userName || '익명')[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {r.userName || '익명'}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < (r.rating || 0)
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
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

                      <div className="pl-13">
                        <p className="text-gray-700 leading-relaxed">
                          {r.content}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
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
              <Link
                to={`/trainer/review/${userId}`}
                className="text-center my-4 hover:text-green-500 cursor-pointer block"
              >
                리뷰 전체보기
              </Link>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-8">
            {/* 위치 정보 */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                위치 정보
              </h3>
              <div className="text-center">
                <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <p className="font-medium text-gray-900">
                  {detail?.gym || detail?.gymAddress || '정보없음'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {detail?.gym?.address ||
                    detail?.address ||
                    '지하철역 도보 5분 거리'}
                </p>
                <button
                  onClick={() => handleContactClick('location')}
                  className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  위치 확인
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerReadMore;
