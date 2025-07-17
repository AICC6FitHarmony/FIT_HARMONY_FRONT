import React, { useState, useEffect } from "react";
import {
  useGetMembers,
  useUpdateMemberStatus,
  useGetMemberDetail,
} from "../../js/mypage/mypage";
import { toast } from "react-toastify";
import StandardModal from "../cmmn/StandardModal";

const ManageMember = () => {
  const [members, setMembers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusModalData, setStatusModalData] = useState({});

  // 검색 및 필터 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // API 훅들
  const getMembers = useGetMembers();
  const updateMemberStatus = useUpdateMemberStatus();
  const getMemberDetail = useGetMemberDetail();

  // 회원 목록 조회
  const fetchMembers = async () => {
    setLoading(true);
    try {
      await getMembers({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: statusFilter,
        role: roleFilter,
        callback: (data) => {
          if (data?.message === "success") {
            setMembers(data.data.members);
            setPagination(data.data.pagination);
          } else {
            toast.error("회원 목록을 불러오는데 실패했습니다.");
          }
        },
      });
    } catch (error) {
      toast.error("회원 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 회원 상태 변경
  const handleStatusChange = async (userId, status, reason = "") => {
    try {
      await updateMemberStatus({
        userId,
        status,
        reason,
        callback: (data) => {
          if (data?.message === "success") {
            toast.success("회원 상태가 변경되었습니다.");
            fetchMembers();
            setShowStatusModal(false);
          } else {
            toast.error("회원 상태 변경에 실패했습니다.");
          }
        },
      });
    } catch (error) {
      toast.error("회원 상태 변경에 실패했습니다.");
    }
  };

  // 회원 상세 정보 조회
  const handleViewDetail = async (userId) => {
    try {
      await getMemberDetail({
        userId,
        callback: (data) => {
          if (data?.message === "success") {
            setSelectedMember(data.data);
            setShowDetailModal(true);
          } else {
            toast.error("회원 정보를 불러오는데 실패했습니다.");
          }
        },
      });
    } catch (error) {
      toast.error("회원 정보를 불러오는데 실패했습니다.");
    }
  };

  // 검색 및 필터 적용
  const handleSearch = () => {
    setCurrentPage(1);
    fetchMembers();
  };

  // 페이지 변경
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 상태 변경 모달 열기
  const openStatusModal = (member) => {
    setStatusModalData({
      userId: member.userId,
      currentStatus: member.status,
      userName: member.userName,
    });
    setShowStatusModal(true);
  };

  useEffect(() => {
    fetchMembers();
  }, [currentPage]);

  // 상태별 색상
  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600 bg-green-100";
      case "INACTIVE":
        return "text-yellow-600 bg-yellow-100";
      case "DELETED":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // 역할별 색상
  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "text-purple-600 bg-purple-100";
      case "TRAINER":
        return "text-blue-600 bg-blue-100";
      case "MEMBER":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // 전화번호 포맷팅 함수
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "-";

    // 숫자만 추출
    const cleaned = phoneNumber.replace(/\D/g, "");

    // 11자리인 경우 (01012345678)
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(
        7
      )}`;
    }

    // 10자리인 경우 (0101234567)
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(
        6
      )}`;
    }

    // 그 외의 경우 원본 반환
    return phoneNumber;
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">회원 관리</h2>
        <div className="text-sm text-gray-500">
          총 {pagination.total || 0}명의 회원
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              검색
            </label>
            <input
              type="text"
              placeholder="이름, 닉네임, 이메일"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상태
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">전체</option>
              <option value="ACTIVE">활성</option>
              <option value="INACTIVE">비활성</option>
              <option value="DELETED">삭제</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              역할
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">전체</option>
              <option value="ADMIN">관리자</option>
              <option value="TRAINER">트레이너</option>
              <option value="MEMBER">회원</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              검색
            </button>
          </div>
        </div>
      </div>

      {/* 회원 목록 */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이름
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이메일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  연락처
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태/역할
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가입일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    회원이 없습니다.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.userId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {member.userName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.nickName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {member.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatPhoneNumber(member.phoneNumber)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.age ? `${member.age}세` : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            member.status
                          )}`}
                        >
                          {member.status === "ACTIVE"
                            ? "활성"
                            : member.status === "INACTIVE"
                            ? "비활성"
                            : "삭제"}
                        </span>
                        <br />
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                            member.role
                          )}`}
                        >
                          {member.role === "ADMIN"
                            ? "관리자"
                            : member.role === "TRAINER"
                            ? "트레이너"
                            : "회원"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(member.createdTime).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="space-y-2">
                        <button
                          onClick={() => handleViewDetail(member.userId)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          상세보기
                        </button>
                        <button
                          onClick={() => openStatusModal(member)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          상태변경
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 페이지네이션 */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === page
                      ? "bg-green-600 text-white"
                      : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </nav>
        </div>
      )}

      {/* 회원 상세 정보 모달 */}
      {showDetailModal && selectedMember && (
        <StandardModal
          title="회원 상세 정보"
          size={{ width: "60vw", height: "50vw" }}
          closeEvent={() => setShowDetailModal(false)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">기본 정보</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">이름:</span>{" "}
                  {selectedMember.userName}
                </div>
                <div>
                  <span className="font-medium">닉네임:</span>{" "}
                  {selectedMember.nickName}
                </div>
                <div>
                  <span className="font-medium">이메일:</span>{" "}
                  {selectedMember.email}
                </div>
                <div>
                  <span className="font-medium">전화번호:</span>{" "}
                  {formatPhoneNumber(selectedMember.phoneNumber)}
                </div>
                <div>
                  <span className="font-medium">나이:</span>{" "}
                  {selectedMember.age || "-"}세
                </div>
                <div>
                  <span className="font-medium">성별:</span>{" "}
                  {selectedMember.gender || "-"}
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">신체 정보</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">키:</span>{" "}
                  {selectedMember.height || "-"}cm
                </div>
                <div>
                  <span className="font-medium">몸무게:</span>{" "}
                  {selectedMember.weight || "-"}kg
                </div>
                <div>
                  <span className="font-medium">피트니스 경력:</span>{" "}
                  {selectedMember.fitHistory || "-"}
                </div>
                <div>
                  <span className="font-medium">목표:</span>{" "}
                  {selectedMember.fitGoal || "-"}
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">계정 정보</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">상태:</span>{" "}
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedMember.status
                    )}`}
                  >
                    {selectedMember.status === "ACTIVE"
                      ? "활성"
                      : selectedMember.status === "INACTIVE"
                      ? "비활성"
                      : "삭제"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">역할:</span>{" "}
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                      selectedMember.role
                    )}`}
                  >
                    {selectedMember.role === "ADMIN"
                      ? "관리자"
                      : selectedMember.role === "TRAINER"
                      ? "트레이너"
                      : "회원"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">가입일:</span>{" "}
                  {new Date(selectedMember.createdTime).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">헬스장:</span>{" "}
                  {selectedMember.gym || "-"}
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">활동 정보</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">구매 횟수:</span>{" "}
                  {selectedMember.purchaseCount || 0}회
                </div>
                <div>
                  <span className="font-medium">인바디 측정 횟수:</span>{" "}
                  {selectedMember.inbodyCount || 0}회
                </div>
              </div>
            </div>
          </div>
          {selectedMember.introduction && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">자기소개</h4>
              <p className="text-sm text-gray-600">
                {selectedMember.introduction}
              </p>
            </div>
          )}
        </StandardModal>
      )}

      {/* 상태 변경 모달 */}
      {showStatusModal && (
        <StandardModal
          title="회원 상태 변경"
          size={{ width: "40vw", height: "30vw" }}
          closeEvent={() => setShowStatusModal(false)}
        >
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <strong>{statusModalData.userName}</strong> 회원의 상태를
              변경합니다.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                새로운 상태
              </label>
              <select
                id="newStatus"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="ACTIVE">활성</option>
                <option value="INACTIVE">비활성</option>
                <option value="DELETED">삭제</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사유 (삭제 시 필수)
              </label>
              <textarea
                id="reason"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="상태 변경 사유를 입력하세요"
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowStatusModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              취소
            </button>
            <button
              onClick={() => {
                const newStatus = document.getElementById("newStatus").value;
                const reason = document.getElementById("reason").value;
                if (newStatus === "DELETED" && !reason.trim()) {
                  toast.error("삭제 시에는 사유를 입력해주세요.");
                  return;
                }
                handleStatusChange(statusModalData.userId, newStatus, reason);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              상태 변경
            </button>
          </div>
        </StandardModal>
      )}
    </div>
  );
};

export default ManageMember;
