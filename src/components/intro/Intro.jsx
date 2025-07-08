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
        {user?.isLoggedIn ? (
          <div className="text-sm">{user.user.nickName}님 환영 합니다</div>
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
