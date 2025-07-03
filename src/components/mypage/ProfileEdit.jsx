import React, { useEffect, useRef, useState } from "react";
import {
  useCheckEmailDuplicate,
  useCheckNicknameDuplicate,
  useUpdateUserData,
} from "../../js/mypage/mypage";
import { useImageFileUpload, useUpdateGroupId } from "../../js/common/util";
import { toast } from "react-toastify";
import { DuplicateCheckInput, FormInput } from "./common";

const ProfileEdit = ({ userData }) => {
  const [profileImg, setProfileImg] = useState(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailDuplicate, setEmailDuplicate] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameDuplicate, setNicknameDuplicate] = useState(false);
  const [role, setRole] = useState(userData?.role || "");
  const [form, setForm] = useState({
    name: userData?.userName || "",
    email: userData?.email || "",
    nickname: userData?.nickName || "",
    phone: userData?.phoneNumber || "",
    height: userData?.height || "",
    weight: userData?.weight || "",
    age: userData?.age || "",
    fitHistory: userData?.fitHistory || "",
    fitGoal: userData?.fitGoal || "",
    introduction: userData?.introduction || "",
    GYM: userData?.GYM || "",
  });
  const [fileId, setFileId] = useState(userData?.fileId || "");

  // 파일 업로드 관련 상태
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  // 훅 초기화
  const updateUserData = useUpdateUserData();
  const checkEmailDuplicate = useCheckEmailDuplicate();
  const checkNicknameDuplicate = useCheckNicknameDuplicate();
  const fileUpload = useImageFileUpload();

  useEffect(() => {
    if (userData) {
      setForm({
        name: userData.userName || "",
        email: userData.email || "",
        nickname: userData.nickName || "",
        phone: userData.phoneNumber || "",
        height: userData.height || "",
        weight: userData.weight || "",
        age: userData.age || "",
        fitHistory: userData.fitHistory || "",
        fitGoal: userData.fitGoal || "",
        introduction: userData.introduction || "",
        GYM: userData.GYM || "",
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
    }
  }, [userData]);

  useEffect(() => {
    // setRole(userData?.role || "");
    setRole("MEMBER");
  }, [userData]);

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
        console.log("uploadResult.fileIdArr[0]", uploadResult.fileIdArr[0]);
        console.log("newFileId", newFileId);
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
    console.log("setFileID");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success("기본이미지로 변경되었습니다. 저장시 적용됩니다.");
  };

  // 개인정보 입력값 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // 이메일이 변경되면 체크 상태 초기화
    // if (name === "email") {
    //   setEmailChecked(false);
    //   setEmailDuplicate(false);
    // }

    // if (name === "nickname") {
    //   setNicknameChecked(false);
    //   setNicknameDuplicate(false);
    //   handleNicknameCheck();
    // }
  };

  // 닉네임 중복체크
  const handleNicknameCheck = async () => {
    // 닉네임 형식 검증
    const nicknameRegex = /^[a-zA-Z0-9가-힣_]+$/;
    if (!nicknameRegex.test(form.nickname)) {
      toast.error("닉네임은 한글, 영문, 숫자, 언더바(_)만 사용할 수 있습니다.");
      return;
    }

    setIsCheckingNickname(true);
    try {
      const result = await checkNicknameDuplicate(form.nickname);

      if (result.success) {
        setNicknameChecked(true);
        setNicknameDuplicate(result.isDuplicate);

        if (result.isDuplicate) {
          toast.error(result.message);
        } else {
          toast.success(result.message);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("중복체크 중 오류가 발생했습니다.");
    } finally {
      setIsCheckingNickname(false);
    }
  };

  // 이메일 중복체크
  const handleEmailCheck = async () => {
    if (!form.email) {
      toast.error("이메일을 입력해주세요.");
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    setIsCheckingEmail(true);
    try {
      const result = await checkEmailDuplicate(form.email);

      if (result.success) {
        setEmailChecked(true);
        setEmailDuplicate(result.isDuplicate);

        if (result.isDuplicate) {
          toast.error(result.message);
        } else {
          toast.success(result.message);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("중복체크 중 오류가 발생했습니다.");
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // 저장 버튼 클릭
  const handleSave = async (e) => {
    e.preventDefault();

    let currentFileId = fileId;

    // 파일이 선택된 경우에만 업로드 실행
    if (file) {
      currentFileId = await uploadProfileImage();
    }

    // 이메일 중복체크 검증
    // if (form.email !== userData?.email && !emailChecked) {
    //   toast.error("이메일 중복확인을 해주세요.");
    //   return;
    // }

    // if (form.email !== userData?.email && emailDuplicate) {
    //   toast.error("이미 사용 중인 이메일입니다.");
    //   return;
    // }

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
        introduction: form.introduction,
        GYM: form.GYM,
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
    console.log("userDataToUpdate", userDataToUpdate);
    updateUserData({
      userId: userData.userId,
      userData: userDataToUpdate,
      callback: () => {
        toast.success("저장되었습니다.");
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
              </div>
            </div>
          </div>

          {/* 개인정보 입력 폼 */}
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex flex-col gap-6">
              <FormInput
                label="이름"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="이름을 입력하세요"
              />

              <DuplicateCheckInput
                label="이메일"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="이메일을 입력하세요"
                isChecking={isCheckingEmail}
                isChecked={emailChecked}
                isDuplicate={emailDuplicate}
                onCheck={handleEmailCheck}
                originalValue={userData?.email}
              />

              <FormInput
                label="닉네임"
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                placeholder="닉네임을 입력하세요"
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

                  <FormInput
                    label="운동 센터"
                    name="GYM"
                    value={form.GYM}
                    onChange={handleChange}
                    placeholder="추후 주소API 사용 예정"
                    as="number"
                  />

                  <FormInput
                    label="소개글"
                    name="introduction"
                    value={form.introduction}
                    onChange={handleChange}
                    placeholder="소개글을 작성해주세요"
                    as="textarea"
                  />
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
              <button className="ok" onClick={handleSave}>
                저장하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
