import React, { useEffect, useRef, useState, useCallback } from "react";
import { useUpdateUserData } from "../../js/mypage/mypage";
import { useImageFileUpload } from "../../js/common/util";
import { toast } from "react-toastify";
import { FormInput } from "./common";
import IntroductionEditor from "./common/IntroductionEditor";
import defaultProfile from "../../images/profile.png";
import { useDispatch, useSelector } from "react-redux";
import { checkNicknameDuplicate } from "../../js/redux/slice/sliceMypage";
import GymSelector from "./common/GymSelector";
import { MessageSquare } from "lucide-react";
import RequestResponse from "./RequestResponse";

const ProfileEdit = ({ userData }) => {
  const [profileImg, setProfileImg] = useState(null);
  const [role, setRole] = useState(userData?.role || "");
  const [form, setForm] = useState({
    name: userData?.userName || "",
    nickname: userData?.nickName || "",
    phone: userData?.phoneNumber || "",
    height: userData?.height || "",
    weight: userData?.weight || "",
    age: userData?.age || "",
    fitHistory: userData?.fitHistory || "",
    fitGoal: userData?.fitGoal || "",
    introduction: userData?.introduction || "",
    gym: userData?.gym || "",
  });
  const [fileId, setFileId] = useState(userData?.fileId || "");
  const [introduction, setIntroduction] = useState(null);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameDuplicate, setNicknameDuplicate] = useState(false);
  const [nicknameValid, setNicknameValid] = useState(true);

  // 모달 상태 관리
  const [isRequestResponseModalOpen, setIsRequestResponseModalOpen] =
    useState(false);

  // 파일 업로드 관련 상태
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  // 디바운싱을 위한 타이머
  const nicknameCheckTimerRef = useRef(null);

  // 훅 초기화
  const updateUserData = useUpdateUserData();
  const dispatch = useDispatch();
  const { nicknameData, isDuplicate, loading } = useSelector(
    (state) => state.mypage
  );
  const fileUpload = useImageFileUpload();

  const introductionEditorRef = useRef();

  // 서비스 요청 응답 모달 열기
  const handleRequestResponse = () => {
    setIsRequestResponseModalOpen(true);
  };

  // 서비스 요청 응답 모달 닫기
  const handleCloseRequestResponseModal = () => {
    setIsRequestResponseModalOpen(false);
  };

  useEffect(() => {
    if (userData) {
      // introduction이 JSON 문자열인 경우 파싱
      let parsedIntroduction = "";
      if (userData.introduction) {
        try {
          const parsed = JSON.parse(userData.introduction);
          parsedIntroduction = parsed;
        } catch (error) {
          console.error("introduction 파싱 오류:", error);
          parsedIntroduction = "";
        }
      }

      setForm({
        name: userData.userName || "",
        nickname: userData.nickName || "",
        phone: userData.phoneNumber || "",
        height: userData.height || "",
        weight: userData.weight || "",
        age: userData.age || "",
        fitHistory: userData.fitHistory || "",
        fitGoal: userData.fitGoal || "",
        introduction: parsedIntroduction,
        gym: userData.gym || "",
      });

      // 기존 프로필 이미지가 있다면 표시
      if (userData.fileId) {
        setProfileImg(
          `${import.meta.env.VITE_BACKEND_DOMAIN}/common/file/${
            userData.fileId
          }`
        );
        setFileId(userData.fileId);
      } else {
        setProfileImg(null);
        setFileId("");
      }

      // 기존 닉네임이 있으면 중복검사 완료 상태로 설정
      if (userData.nickName) {
        setNicknameChecked(true);
        setNicknameDuplicate(false);
      }
    }
  }, [userData]);

  useEffect(() => {
    setRole(userData?.role || "");
  }, [userData]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (nicknameCheckTimerRef.current) {
        clearTimeout(nicknameCheckTimerRef.current);
      }
    };
  }, []);

  // 파일 선택 핸들러
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // 이미지 파일 검증
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("이미지 파일만 업로드 가능합니다.");
        return;
      }

      // 파일 크기 검증 (5MB 제한)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("파일 크기는 5MB 이하여야 합니다.");
        return;
      }

      setFile(selectedFile);

      // 미리보기 표시
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImg(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const uploadProfileImage = async () => {
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      const uploadResult = await fileUpload(uploadFormData);

      if (uploadResult.success) {
        const newFileId = uploadResult.fileIdArr[0];
        setFileId(newFileId);
        return newFileId;
      } else {
        setFileId("1");
        return "1";
      }
    } catch (error) {
      console.error("프로필 이미지 업로드 오류:", error);
      toast.error("이미지 업로드 중 오류가 발생했습니다.");
      return "1";
    }
  };

  // 기본 이미지로 변경
  const handleDeleteProfileImage = () => {
    setProfileImg(null);
    setFile(null);
    setFileId("1");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success("기본이미지로 변경되었습니다. 저장시 적용됩니다.");
  };

  // 자동 닉네임 중복검사 (디바운싱 적용)
  const autoCheckNickname = useCallback(
    async (nickname) => {
      if (!nickname.trim()) {
        setNicknameChecked(false);
        setNicknameDuplicate(false);
        return;
      }

      // 기존 닉네임과 동일한 경우 검사하지 않음
      if (nickname === userData?.nickName) {
        setNicknameChecked(true);
        setNicknameDuplicate(false);
        return;
      }

      setIsCheckingNickname(true);
      try {
        const result = await dispatch(checkNicknameDuplicate({ nickname }));

        if (result.payload.success) {
          setNicknameChecked(true);
          setNicknameDuplicate(result.payload.isDuplicate);
        } else {
          setNicknameChecked(false);
          setNicknameDuplicate(false);
        }
      } catch (error) {
        setNicknameChecked(false);
        setNicknameDuplicate(false);
      } finally {
        setIsCheckingNickname(false);
      }
    },
    [dispatch, userData?.nickName]
  );

  // 개인정보 입력값 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // 닉네임이 변경되면 자동 중복검사 실행 (디바운싱)
    if (name === "nickname") {
      // 닉네임 형식 검증
      // 닉네임이 옳바른 형식이면 중복검사 실행 (NicknameValid = true)
      const nicknameRegex = /^[a-zA-Z0-9가-힣_]+$/;
      if (!nicknameRegex.test(value)) {
        console.log("닉네임 형식 검증 실패");
        setNicknameValid(false);
        setNicknameChecked(false); // 형식이 틀리면 중복검사 상태 초기화
      } else {
        setNicknameValid(true);
        // 기존 타이머 클리어
        if (nicknameCheckTimerRef.current) {
          clearTimeout(nicknameCheckTimerRef.current);
        }

        // 500ms 후에 중복검사 실행
        nicknameCheckTimerRef.current = setTimeout(() => {
          autoCheckNickname(value);
        }, 500);
      }
    }
  };

  // 저장 버튼 클릭
  const handleSave = async (e) => {
    e.preventDefault();

    // 닉네임 중복검사 확인 (기존 닉네임과 다른 경우에만)
    if (form.nickname !== userData.nickName) {
      if (!nicknameChecked) {
        toast.error("닉네임 중복검사를 완료해주세요.");
        return;
      }

      if (nicknameDuplicate) {
        toast.error("중복된 닉네임입니다. 다른 닉네임을 사용해주세요.");
        return;
      }
    }

    let currentFileId = fileId;

    // 파일이 선택된 경우에만 업로드 실행
    if (file) {
      currentFileId = await uploadProfileImage();
    }

    // 일반 사용자의 경우 기존 로직 사용
    let userDataToUpdate;
    if (role === "TRAINER") {
      userDataToUpdate = {
        userId: userData.userId,
        userName: form.name,
        email: form.email,
        nickName: form.nickname,
        phoneNumber: form.phone,
        height: form.height,
        weight: form.weight,
        age: form.age,
        fitHistory: form.fitHistory,
        fitGoal: form.fitGoal,
        introduction: introductionEditorRef.current.getContent(),
        gym: form.gym,
        fileId: currentFileId,
      };
    } else {
      userDataToUpdate = {
        userId: userData.userId,
        userName: form.name,
        email: form.email,
        nickName: form.nickname,
        phoneNumber: form.phone,
        height: form.height,
        weight: form.weight,
        age: form.age,
        fitHistory: form.fitHistory,
        fitGoal: form.fitGoal,
        fileId: currentFileId,
      };
    }

    updateUserData({
      userId: userData.userId,
      userData: userDataToUpdate,
      callback: () => {
        toast.success("저장되었습니다.");
        window.location.reload();
      },
    });
  };

  // 운동 경력 옵션
  const fitHistoryOptions = [
    { value: "입문", label: "입문 (0 ~ 6개월)" },
    { value: "초급", label: "초급 (6개월 ~ 1년)" },
    { value: "중급", label: "중급 (1년 ~ 3년)" },
    { value: "고급", label: "고급 (3년 ~ 5년)" },
    { value: "전문가", label: "전문가 (5년 이상)" },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">프로필 편집</h2>

          {/* 프로필 사진 관리 */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-12 p-6 rounded-xl">
            <div className="relative flex items-center justify-center w-40 h-40">
              <img
                src={profileImg}
                alt=""
                onError={(e) => {
                  e.target.src = defaultProfile;
                }}
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">
                프로필 사진
              </h3>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="px-6 py-3 ok"
                  onClick={() => fileInputRef.current.click()}
                >
                  사진 변경
                </button>
                <button
                  type="button"
                  className="px-6 py-3 cancel"
                  onClick={handleDeleteProfileImage}
                >
                  기본이미지로 변경
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                {role != "TRAINER" && (
                  <div
                    className="text-white bg-green-500 rounded-full p-2 ml-2 shadow-md transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:shadow-sm active:translate-y-0.5"
                    onClick={handleRequestResponse}
                  >
                    <MessageSquare />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 개인정보 입력 폼 */}
          <form className="space-y-6">
            <div className="flex flex-col gap-6">
              <FormInput
                label="이름"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="이름을 입력하세요"
              />

              <FormInput
                label="닉네임"
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                placeholder="닉네임을 입력하세요"
                showDuplicateCheck={true}
                isCheckingDuplicate={isCheckingNickname}
                isDuplicateChecked={nicknameChecked}
                isDuplicate={nicknameDuplicate}
                nicknameValid={nicknameValid}
              />

              <FormInput
                label="전화번호"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="전화번호를 입력하세요 하이폰(-)제외"
              />

              <FormInput
                label="키(cm)"
                name="height"
                value={form.height}
                onChange={handleChange}
                placeholder="키를 입력하세요"
                as="number"
              />

              <FormInput
                label="몸무게(kg)"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                placeholder="몸무게를 입력하세요"
                as="number"
              />

              <FormInput
                label="나이"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="나이를 입력하세요"
                as="number"
              />

              {role === "TRAINER" ? (
                <>
                  <FormInput
                    label="운동 경력"
                    name="fitHistory"
                    value={form.fitHistory}
                    onChange={handleChange}
                    placeholder="운동 년수를 입력하세요"
                    as="number"
                  />

                  <FormInput
                    label="제공 서비스"
                    name="fitGoal"
                    value={form.fitGoal}
                    onChange={handleChange}
                    placeholder="제공 가능한 운동 서비스를 입력하세요"
                    as="textarea"
                  />

                  <GymSelector
                    label="운동 센터"
                    name="gym"
                    value={form.gym}
                    onChange={handleChange}
                    placeholder="운동 센터를 검색하세요"
                  />

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      소개글
                    </label>
                    <IntroductionEditor
                      ref={introductionEditorRef}
                      defaultPost={form.introduction}
                    />
                  </div>
                </>
              ) : (
                <>
                  <FormInput
                    label="운동 경력"
                    name="fitHistory"
                    value={form.fitHistory}
                    onChange={handleChange}
                    options={fitHistoryOptions}
                    as="select"
                  />

                  <FormInput
                    label="운동 목표"
                    name="fitGoal"
                    value={form.fitGoal}
                    onChange={handleChange}
                    placeholder="운동 목표를 작성해주세요"
                    as="textarea"
                  />
                </>
              )}
            </div>
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button type="button" className="ok" onClick={handleSave}>
                저장하기
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* 서비스 요청 응답 모달 */}
      <RequestResponse
        isOpen={isRequestResponseModalOpen}
        onClose={handleCloseRequestResponseModal}
      />
    </div>
  );
};

export default ProfileEdit;
