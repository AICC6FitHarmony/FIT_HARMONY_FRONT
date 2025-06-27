// TrainerReadMore.jsx 개선본
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTrainers } from '../../js/redux/slice/sliceTrainer';

const TrainerReadMore = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const trainersState = useSelector((state) => state.trainer.trainers);
  const status = useSelector((state) => state.trainer.status);
  const error = useSelector((state) => state.trainer.error);

  const [trainerDetail, setTrainerDetail] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTrainers());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (trainersState?.products) {
      const filtered = trainersState.products.filter(
        (product) => String(product.userId) === id
      );
      setProducts(filtered);
    }
  }, [trainersState, id]);

  if (status === 'loading')
    return <p className="text-center mt-10">로딩 중...</p>;
  if (status === 'failed')
    return <p className="text-center mt-10 text-red-500">에러: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">트레이너 상세 페이지</h2>

      {trainerDetail ? (
        <div className="border border-gray-300 rounded-lg p-6 shadow-md hover:shadow-lg transition">
          <h3 className="text-2xl font-semibold mb-2">
            {trainerDetail.name || trainerDetail.userName}
          </h3>
          <p className="text-gray-700 mb-2">
            {trainerDetail.description || '소개가 없습니다.'}
          </p>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              가격: {trainerDetail.price?.toLocaleString() || '정보 없음'}원
            </p>
            <p>세션 수: {trainerDetail.sessionCnt || '정보 없음'}회</p>
            <p>종류: {trainerDetail.type === '1' ? 'PT' : '기타'}</p>
            <p>위치: {trainerDetail.gymAddress || '주소 없음'}</p>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          등록된 트레이너 정보를 찾을 수 없습니다.
        </p>
      )}
    </div>
  );
};

export default TrainerReadMore;
