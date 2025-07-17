import React, { useState, useEffect } from "react";
import ProfileEdit from "./ProfileEdit";
import Withdraw from "./Withdraw";
import MyActivity from "./MyActivity";
import { useAuthRedirect } from "../../js/login/AuthContext";
import { useGetUserData } from "../../js/mypage/mypage";
import { ToastContainer } from "react-toastify";
import ManageMember from "./ManageMember";

const MyPage = () => {
  const [selectedMenu, setSelectedMenu] = useState("profile");
  const { user, loading } = useAuthRedirect();
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState("");
  // 유저 데이터 가져오기 훅
  const getUserData = useGetUserData();

  useEffect(() => {
    if (!user) return;
    setUserId(user?.user?.userId);
  }, [user]);

  useEffect(() => {
    if (user) {
      setRole(user?.user?.role);
      setRole("ADMIN");
    }
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
  if (role === "ADMIN") {
    navItems.push({ key: "manageMember", label: "회원관리" });
  }

  return (
    <div className="min-h-screen bg-orange-50 py-4 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 모바일 네비게이션 */}
        <nav className="lg:hidden mb-6">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm border-none whitespace-nowrap
                    ${
                      selectedMenu === item.key
                        ? "bg-gradient-to-r from-green-300 to-green-200 text-green-900 shadow-lg scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-900"
                    }
                  `}
                  onClick={() => setSelectedMenu(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* 데스크톱 레이아웃 */}
        <div className="hidden lg:flex rounded-xl shadow-md min-h-[600px] bg-white">
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
            {role === "ADMIN" && selectedMenu === "manageMember" && (
              <ManageMember />
            )}
          </div>
        </div>

        {/* 모바일 내용 */}
        <div className="lg:hidden">
          <div className="bg-white rounded-xl shadow-md p-4">
            {selectedMenu === "profile" && <ProfileEdit userData={userData} />}
            {selectedMenu === "withdraw" && <Withdraw userId={userId} />}
            {selectedMenu === "activity" && <MyActivity userId={userId} />}
            {role === "ADMIN" && selectedMenu === "manageMember" && (
              <ManageMember />
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default MyPage;
