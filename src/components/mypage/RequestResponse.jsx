import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

const RequestResponse = ({ isOpen, onClose }) => {
  const [appliedServices, setAppliedServices] = useState([]);
  const [loading, setLoading] = useState(false);

  // 사용자가 신청한 서비스들의 상태를 가져오는 함수
  const fetchAppliedServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_DOMAIN}/trainer/purchased-products`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (data.success && data.appliedServices) {
        setAppliedServices(data.appliedServices);
      } else {
        setAppliedServices([]);
        if (data.message) {
          console.log('서버 메시지:', data.message);
        }
      }
    } catch (error) {
      console.error('구매한 상품 조회 오류:', error);
      toast.error('구매한 상품을 불러오는 중 오류가 발생했습니다.');
      setAppliedServices([]);
    } finally {
      setLoading(false);
    }
  };

  // 모달이 열릴 때 데이터 가져오기
  useEffect(() => {
    if (isOpen) {
      fetchAppliedServices();
    }
  }, [isOpen]);

  // 상태별 스타일 정의
  const getStatusStyle = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'APPROVED':
        return '승인됨';
      case 'REJECTED':
        return '거절됨';
      case 'PENDING':
      default:
        return '승인대기';
    }
  };

  // 모달이 열려있지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000078] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* 모달 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            신청한 서비스 현황
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* 모달 내용 */}
        <div className="overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <span className="ml-2 text-gray-600">로딩 중...</span>
            </div>
          ) : appliedServices.length > 0 ? (
            <div className="space-y-4">
              {appliedServices.map((service, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {service.productName || '서비스'}
                      </h4>
                      {service.description && (
                        <p className="text-xs text-gray-500 mb-2">
                          {service.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {service.totalPrice && (
                          <p className="text-xs text-blue-600 font-medium">
                            가격: {service.totalPrice.toLocaleString()}원
                          </p>
                        )}
                      </div>
                      {service.rejectionReason && (
                        <p className="text-xs text-red-600 mt-1 p-2 bg-red-50 rounded">
                          거절 사유: {service.rejectionReason}
                        </p>
                      )}
                    </div>
                    <div className="ml-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(
                          service.status
                        )}`}
                      >
                        {getStatusText(service.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-lg font-medium">
                아직 신청한 서비스가 없습니다
              </p>
              <p className="text-gray-400 text-sm mt-2">
                트레이너의 서비스를 신청해보세요!
              </p>
            </div>
          )}
        </div>

        {/* 모달 푸터 */}
        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestResponse;
