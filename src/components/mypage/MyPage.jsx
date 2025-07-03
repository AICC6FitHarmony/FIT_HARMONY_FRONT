import React, { useState, useEffect } from "react";
import ProfileEdit from "./ProfileEdit";
import Withdraw from "./Withdraw";
import MyActivity from "./MyActivity";
import { useAuthRedirect } from "../../js/login/AuthContext";
import { useGetUserData } from "../../js/mypage/mypage";
import { ToastContainer } from "react-toastify";

const MyPage = () => {
  const [selectedMenu, setSelectedMenu] = useState("profile");
  const { user, loading } = useAuthRedirect();
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState(null);

  // 유저 데이터 가져오기 훅
  const getUserData = useGetUserData();

  useEffect(() => {
    if (!user) return;

    setUserId(user?.user?.userId);
  }, [user]);

  useEffect(() => {
    if (userId) {
      getUserData({
        userId,
        callback: (data) => {
          if (data?.message === "success") {
            setUserData(data.userResult[0]);
          }
        },
      });
    }
  }, [userId]);

  // NavBar 메뉴
  const navItems = [
    { key: "profile", label: "프로필 편집" },
    { key: "withdraw", label: "회원 탈퇴" },
    { key: "activity", label: "내 활동" },
  ];

  return (
    <div className="max-w-5xl mx-auto flex rounded-xl shadow-md min-h-[600px]">
      {/* 왼쪽 NavBar */}
      <nav className="w-64 flex flex-col py-14 px-4 bg-[#f3efe6] rounded-l-xl shadow-sm justify-start items-center">
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`w-full h-16 mb-4 rounded-2xl text-lg font-semibold transition-all duration-200 shadow-sm border-none space-x-1 tracking-wide
              ${
                selectedMenu === item.key
                  ? "bg-gradient-to-r from-green-300 to-green-200 text-green-900 shadow-lg scale-105"
                  : "bg-white text-green-700 hover:bg-green-100 hover:text-green-900"
              }
            `}
            onClick={() => setSelectedMenu(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      {/* 오른쪽 내용 */}
      <div className="flex-1 p-10">
        {selectedMenu === "profile" && <ProfileEdit userData={userData} />}
        {selectedMenu === "withdraw" && <Withdraw userId={userId} />}
        {selectedMenu === "activity" && <MyActivity userId={userId} />}
      </div>
      <ToastContainer />
    </div>
  );
};

export default MyPage;
