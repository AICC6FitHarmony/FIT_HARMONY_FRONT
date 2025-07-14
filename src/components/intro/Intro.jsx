import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import "../../css/intro.css";
import { useAuth } from "../../js/login/AuthContext";
import { useGetIntroData } from "../../js/intro/intro";
import IntroDiet from "./IntroDiet";
import IntroCommunity from "./IntroCommunity";
import IntroTrainer from "./IntroTrainer";
import { Link } from "react-router-dom";

const Intro = () => {
  const { user, loading } = useAuth();
  const [introData, setIntroData] = useState([]);
  const getIntroData = useGetIntroData();

  useEffect(() => {
    getIntroData({
      callback: (result) => {
        setIntroData(result);
      },
    });
  }, []);

  return (
    <div className="min-h-screen bg-white text-black p-6 font-sans px-10">
      <div className="text-center">
        {/* FitHarmony 소개 문구 */}
        <div
          className="mt-8 mb-12 relative"
          style={{
            backgroundImage: "url('/src/images/intro_gym.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "20px",
            padding: "48px 24px",
            color: "white",
            boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              background: "rgba(0,0,0,0.5)",
              borderRadius: "20px",
              padding: "24px",
            }}
          >
            <h1 className="text-4xl font-bold mb-4">
              FitHarmony – 나만의 피트니스 다이어리
            </h1>
            <p className="text-xl mb-2">운동, 식단, 인바디 데이터를 한 곳에.</p>
            <p className="text-lg">당신의 건강한 루틴을 함께 설계합니다.</p>
          </div>
        </div>

        {user?.isLoggedIn ? (
          <div className="text-sm text-green-500 ">
            <span className="mr-2 font-semibold">{user.user.nickName}</span>
            <span>님 환영 합니다</span>
          </div>
        ) : (
          <button className="mt-2 px-4 py-2 rounded-md text-sm">
            <Link
              to="/login"
              className="border text-green-700 text-sm hover:bg-green-100 px-3 py-1 rounded-full transition flex items-center"
            >
              <FcGoogle className="mr-2" /> Login with Google
            </Link>
          </button>
        )}
      </div>

      <IntroDiet getDietData={introData?.data?.diet} />
      <IntroCommunity
        getHotData={introData?.data?.communityHot}
        getLatestData={introData?.data?.communityLatest}
      />
      <IntroTrainer getTrainerData={introData?.data?.trainer} />
    </div>
  );
};

export default Intro;
