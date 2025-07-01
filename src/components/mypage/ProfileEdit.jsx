import React, { useEffect, useRef, useState } from "react";

const defaultProfileImg = "/defaultProfileImg.png";

const ProfileEdit = ({ user }) => {
  const [profileImg, setProfileImg] = useState(defaultProfileImg);
  const [form, setForm] = useState({
    name: user?.user?.userName,
    email: user?.user?.email,
    nickname: user?.user?.nickName,
    phone: "",
    height: "",
    weight: "",
    age: "",
    fitHistory: "",
    fitGoal: "",
    introduction: "",
    GYM: "",
  });
  const [role, setRole] = useState(user?.user?.role || "");

  // useEffect(() => {
  //   if (user?.user?.role) {
  //     setRole(user?.user?.role);
  //   }
  // }, [user]);

  useEffect(() => {
    setRole("TRAINER");
  }, []);
  console.log(user?.user);
  const fileInput = useRef();

  // 프로필 사진 변경
  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setProfileImg(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // 프로필 사진 삭제
  const handleImgDelete = () => setProfileImg("");

  // 개인정보 입력값 변경
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 저장 버튼 클릭
  const handleSave = (e) => {
    e.preventDefault();
    // 저장 로직 (API 연동 예정)
    alert("저장되었습니다.");
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">프로필 편집</h2>

          {/* 프로필 사진 관리 */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-12 p-6 rounded-xl">
            <div className="relative flex items-center justify-center w-40 h-40">
              <img
                src={profileImg || defaultProfileImg}
                alt="프로필"
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
                  onClick={() => fileInput.current.click()}
                >
                  사진 변경
                </button>
                <button
                  type="button"
                  className="px-6 py-3 cancel"
                  onClick={handleImgDelete}
                >
                  삭제
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInput}
                  className="hidden"
                  onChange={handleImgChange}
                />
              </div>
            </div>
          </div>

          {/* 개인정보 입력 폼 */}
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex flex-col gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  이름
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="이름을 입력하세요"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  이메일
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="이메일을 입력하세요"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  닉네임
                </label>
                <input
                  name="nickname"
                  value={form.nickname}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="닉네임을 입력하세요"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  전화번호
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="전화번호를 입력하세요 하이폰(-)제외"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  키(cm)
                </label>
                <input
                  name="height"
                  value={form.height}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="키를 입력하세요"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  몸무게(kg)
                </label>
                <input
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="몸무게를 입력하세요"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  나이
                </label>
                <input
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="나이를 입력하세요"
                />
              </div>
              {role === "TRAINER" ? (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      운동 경력
                    </label>

                    <input
                      name="fitHistory"
                      value={form.fitHistory}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="운동 경력을 입력하세요"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      제공 서비스
                    </label>
                    <textarea
                      name="fitGoal"
                      value={form.fitGoal}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="제공 가능한 운동 서비스를 입력하세요"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      운동 센터
                    </label>
                    <textarea
                      name="GYM"
                      value={form.GYM}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="추후 주소API 사용 예정"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      소개글
                    </label>
                    <textarea
                      name="introduction"
                      value={form.introduction}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="소개글을 작성해주세요"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      운동 경력
                    </label>

                    <select
                      name="fitHistory"
                      value={form.fitHistory}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                    >
                      <option value="입문">입문 (0 ~ 6개월)</option>
                      <option value="초급">초급 (6개월 ~ 1년)</option>
                      <option value="중급">중급 (1년 ~ 3년)</option>
                      <option value="고급">고급 (3년 ~ 5년)</option>
                      <option value="전문가">전문가 (5년 이상)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      운동 목표
                    </label>
                    <textarea
                      name="fitGoal"
                      value={form.fitGoal}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="운동 목표를 작성해주세요"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button type="submit" className="ok">
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
