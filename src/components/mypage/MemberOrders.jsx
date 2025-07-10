import React, { useState, useEffect } from "react";
import { useRequest } from '../../js/config/requests';
import { toast } from "react-toastify";

const MemberOrders = ({ userId }) => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const request = useRequest()
  useEffect(() => {
    const requestProductList = async () => {
      const options = {method : 'GET'};
      const result = await request(`/buy/myproducts`, options);
      const { success, message, data } = result;
  
      if(success){
          console.log(data)
      }else{
        if(message == "noAuth"){
            toast.error("로그인 후 이용 가능한 서비스 입니다.", {
                position: "bottom-center"
            });
        }else{
            toast.error("에러가 발생했습니다.\n잠시후 다시 이용해주세요.", {
                position: "bottom-center"
            });
        }
      }
    }
    requestProductList();
  }, []);








  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-10">
        <h2 className="text-2xl font-bold mb-4 text-center">회원 주문 관리</h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-500">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="max-w-4xl mx-auto space-y-10">
        <h2 className="text-2xl font-bold mb-4 text-center">회원 주문 관리</h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-500">
            주문 데이터를 불러올 수 없습니다.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <h2 className="text-2xl font-bold mb-4 text-center">회원 주문 관리</h2>

      {/* 주문 통계 */}
      <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-4 text-lg">주문 통계</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600">총 주문</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">승인된 주문</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">0</div>
            <div className="text-sm text-gray-600">대기 중</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">0</div>
            <div className="text-sm text-gray-600">거절된 주문</div>
          </div>
        </div>
      </section>

      {/* 회원 목록 */}
      <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-4 text-lg">회원 목록</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">회원 ID</th>
                <th className="px-4 py-2 text-left">이름</th>
                <th className="px-4 py-2 text-left">이메일</th>
                <th className="px-4 py-2 text-left">가입일</th>
                <th className="px-4 py-2 text-left">상태</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">회원 데이터가 없습니다.</td>
                <td className="px-4 py-2">-</td>
                <td className="px-4 py-2">-</td>
                <td className="px-4 py-2">-</td>
                <td className="px-4 py-2">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 주문 내역 */}
      <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-4 text-lg">주문 내역</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">주문 번호</th>
                <th className="px-4 py-2 text-left">회원명</th>
                <th className="px-4 py-2 text-left">상품명</th>
                <th className="px-4 py-2 text-left">주문일</th>
                <th className="px-4 py-2 text-left">상태</th>
                <th className="px-4 py-2 text-left">액션</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                  아직 주문 내역이 없습니다.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default MemberOrders;
