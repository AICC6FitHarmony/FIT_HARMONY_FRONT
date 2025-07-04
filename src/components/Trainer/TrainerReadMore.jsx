import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchTrainerDetail } from '../../js/redux/slice/sliceTrainer';
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
    }
  }, [userId, dispatch]);

  const detail = useSelector((state) => state.trainer.trainers.detail);
  const status = useSelector((state) => state.trainer.status);
  const error = useSelector((state) => state.trainer.error);

  // 디버깅용 useEffect
  useEffect(() => {
    console.log('Detail data:', detail);
    console.log('Status:', status);
    console.log('Error:', error);
  }, [detail, status, error]);

  const handleConsultationRequest = () => {
    alert('상담 요청이 접수되었습니다! 곧 연락드리겠습니다.');
  };

  const handleServiceClick = (serviceName) => {
    alert(`${serviceName} 상세 정보를 확인하시겠습니까?`);
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
                  프로필 이미지
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
            {/* 제공 서비스 */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                제공 서비스
              </h2>
              <div className="space-y-4">
                <div
                  onClick={() => handleServiceClick('기초 PT 클래스')}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        기초 PT 클래스
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        운동 초보자를 위한 기본 자세부터 운동 루틴까지
                      </p>
                      <div className="text-lg font-semibold text-green-600">
                        80,000원
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div
                  onClick={() => handleServiceClick('웨이트 트레이닝')}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        웨이트 트레이닝
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        근력 증진과 체형 개선을 위한 웨이트 트레이닝
                      </p>
                      <div className="text-lg font-semibold text-green-600">
                        100,000원
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div
                  onClick={() => handleServiceClick('프리미엄 코스')}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        프리미엄 코스
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        4주 연속 종합 피트니스 코스 (유산소, 근력, 체형 교정)
                      </p>
                      <div className="text-lg font-semibold text-green-600">
                        300,000원
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

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

            {/* 리뷰 */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                리뷰 ({detail?.reviewCount || '0'}개)
              </h2>
              <div className="space-y-4">
                {detail?.reviews?.length > 0 ? (
                  detail.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">
                          {review.userName || '익명'}
                        </span>
                        <div className="flex items-center gap-1">
                          {[...Array(review.rating || 5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-400 fill-current"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.content}</p>
                    </div>
                  ))
                ) : (
                  // 기본 리뷰 데이터
                  <>
                    <div className="border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">박***</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-400 fill-current"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">
                        처음 운동을 시작하는데 정말 친절하게 잘 가르쳐주셨어요!
                        덕분에 이제 혼자서도 운동할 수 있게 되었습니다.
                      </p>
                    </div>

                    <div className="border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">김***</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-400 fill-current"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">
                        웨이트 트레이닝 정말 만족스러웠어요. 자세 교정과
                        운동법을 정확히 알려주셔서 효과를 바로 느꼈습니다!
                      </p>
                    </div>

                    <div className="pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">이***</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-400 fill-current"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">
                        프리미엄 코스 완주했습니다! 4주 동안 정말 많이 배웠고,
                        이제 건강한 운동 습관을 가지게 되었어요.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-8">
            {/* 연락처 */}
            <div className="bg-white rounded-lg p-6 shadow-sm"></div>

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
