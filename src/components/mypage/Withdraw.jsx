import React, { useState } from "react";
import "./Withdraw.css";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useUpdateUserActive } from "../../js/mypage/mypage";
import { userLogout } from "../../js/login/loginUtils";

const withdrawReasons = [
  "서비스 불만족",
  "사용 빈도 낮음",
  "개인정보 우려",
  "다른 서비스 이용",
  "기타",
];

const Withdraw = ({ userId }) => {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [agree, setAgree] = useState(false);
  const [agree2, setAgree2] = useState(false);

  //훅 초기화
  const updateUserActive = useUpdateUserActive();

  const handleReasonChange = (e) => {
    setAgree2(true);
    setReason(e.target.value);
    const parentLabel = e.target.closest("label");
    if (parentLabel) {
      parentLabel.classList.add("blink-animation");
      setTimeout(() => {
        parentLabel.classList.remove("blink-animation");
      }, 500);
    }
    if (e.target.value !== "기타") setCustomReason("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agree2) {
      toast.error("탈퇴 사유를 선택해야 탈퇴가 가능합니다.");
    } else if (!agree) {
      toast.error("데이터 처리 방침에 동의해야 탈퇴가 가능합니다.");
    } else {
      Swal.fire({
        title: "탈퇴하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "취소",
      }).then((result) => {
        if (result.isConfirmed) {
          let reasonData = "";
          if (reason == "기타") {
            reasonData = customReason;
          } else {
            reasonData = reason;
          }

          const bodyData = {
            userId: userId,
            type: "DELETED",
            reason: reasonData,
          };
          updateUserActive({
            userId: userId,
            bodyData,
            callback: () => {
              Swal.fire({
                title: "탈퇴가 완료되었습니다.",
                icon: "success",
              });
              userLogout();
            },
          });
        }
      });
    }
  };

  const handleDisable = () => {
    Swal.fire({
      title: "계정 비활성화를 하시겠습니까?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        const bodyData = {
          userId: userId,
          type: "INACTIVE",
          reason: reason,
        };
        updateUserActive({
          userId: userId,
          bodyData,
          callback: () => {
            Swal.fire({
              title: "계정 비활성화가 완료되었습니다.",
              icon: "success",
            });
            userLogout();
          },
        });
      }
    });
  };

  return (
    <form className="max-w-xl mx-auto space-y-8" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4 text-center">회원 탈퇴</h2>
      {/* 탈퇴 사유 조사 */}
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-2">탈퇴 사유를 선택해 주세요</h3>
        <div className="flex flex-col gap-2">
          {withdrawReasons.map((r) => (
            <label key={r} className="flex items-center gap-2">
              <input
                type="radio"
                name="reason"
                value={r}
                checked={reason === r}
                onChange={handleReasonChange}
                className="accent-blue-500"
              />
              {r}
            </label>
          ))}
          {reason === "기타" && (
            <input
              type="text"
              placeholder="기타 사유를 입력해 주세요"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="border rounded px-2 py-1 mt-1"
            />
          )}
        </div>
      </div>

      {/* 데이터 처리 방침 안내 */}
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-2">데이터 처리 방침</h3>
        <p className="text-sm text-gray-600">
          탈퇴 시 모든 개인정보 및 활동 데이터가 복구 불가하게 삭제됩니다.
          <br />
          관련 법령에 따라 일부 정보는 일정 기간 보관될 수 있습니다.
        </p>
        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="accent-blue-500"
          />
          데이터 처리 방침에 동의합니다.
        </label>
      </div>
      {/* 계정 비활성화 안내 */}
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-2">계정 비활성화 안내</h3>
        <p className="text-sm text-gray-600 mb-2">
          계정을 비활성화하면 서비스 이용이 일시 중단됩니다. 다시 로그인하시면
          언제든지 계정을 복구할 수 있습니다.
        </p>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" className="disable" onClick={handleDisable}>
          비활성화
        </button>
        <button type="submit" className="cancel">
          회원 탈퇴
        </button>
      </div>
    </form>
  );
};

export default Withdraw;
