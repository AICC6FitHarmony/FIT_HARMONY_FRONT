import React, { useState } from "react";

const withdrawReasons = [
  "서비스 불만족",
  "사용 빈도 낮음",
  "개인정보 우려",
  "다른 서비스 이용",
  "기타",
];

const Withdraw = () => {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const handleReasonChange = (e) => {
    setReason(e.target.value);
    if (e.target.value !== "기타") setCustomReason("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agree) {
      alert("데이터 처리 방침에 동의해야 탈퇴가 가능합니다.");
      return;
    }
    // 실제 탈퇴 처리 로직(API 연동 예정)
    alert("탈퇴 요청이 접수되었습니다.");
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
      {/* 계정 정보 백업 안내 */}
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-2">계정 정보 백업 안내</h3>
        <p className="text-sm text-gray-600 mb-2">
          탈퇴 시 계정 정보 및 데이터가 모두 삭제됩니다. 필요한 정보는 미리
          백업해 주세요.
        </p>
        <button
          type="button"
          className="px-3 py-1 bg-gray-300 text-gray-800 rounded text-sm"
          onClick={() => alert("백업 기능은 추후 제공 예정입니다.")}
        >
          데이터 백업 안내
        </button>
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
      {/* 탈퇴 확인 및 인증 */}
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-2">탈퇴 확인</h3>
        <p className="text-sm text-gray-600 mb-2">
          본인 확인을 위해 비밀번호를 입력해 주세요.
        </p>
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded px-2 py-1"
          required
        />
      </div>
      {/* 재가입 정책 안내 */}
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-2">재가입 정책 안내</h3>
        <p className="text-sm text-gray-600">
          탈퇴 후 일정 기간(예: 30일) 내에는 동일 이메일로 재가입이 제한될 수
          있습니다.
        </p>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-red-500 text-white rounded font-bold mt-4"
        >
          회원 탈퇴
        </button>
      </div>
    </form>
  );
};

export default Withdraw;
