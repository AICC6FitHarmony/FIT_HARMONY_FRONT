import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTrainerReview,
  fetchTrainerDetail,
} from '../../js/redux/slice/sliceTrainer';
import { FaStar, FaArrowLeft } from 'react-icons/fa6';

const TrainerReview = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();

  const detail = useSelector((state) => state.trainer.trainers.detail);
  const review = useSelector((state) => state.trainer.trainers.review);
  const status = useSelector((state) => state.trainer.status);

  useEffect(() => {
    if (userId) {
      dispatch(fetchTrainerDetail(userId));
      dispatch(fetchTrainerReview(userId));
    }
  }, [userId, dispatch]);

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
              <FaArrowLeft />
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

        {/* 리뷰 목록 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            전체 리뷰 ({review?.length || 0}개)
          </h2>

          <div className="space-y-6">
            {review?.length > 0 ? (
              review.map((r, index) => (
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
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`w-4 h-4 ${
                                  i < (r.rating || 0)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
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
        </div>
      </div>
    </div>
  );
};

export default TrainerReview;
