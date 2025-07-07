import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import "../../css/intro.css";
import { useAuth } from "../../js/login/AuthContext";
import { useGetIntroData } from "../../js/intro/intro";
import IntroDiet from "./IntroDiet";
import IntroCommunity from "./IntroCommunity";
import IntroTrainer from "./IntroTrainer";

const Intro = () => {
  const { user, loading } = useAuth();
  const [introData, setIntroData] = useState([]);
  const getIntroData = useGetIntroData();

  useEffect(() => {
    getIntroData({
      callback: (result) => {
        setIntroData(result);
    }
    });
  },[]);


  return (
    <div className="min-h-screen bg-white text-black p-6 font-sans px-10">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-2">{introData?.data?.diet[0].file_id} {introData?.data?.communityHot[0].post_id}  </h1>
        {user?.isLoggedIn ? (
          <div className="text-sm">{user.user.nickName}님 환영 합니다</div>
        ) : (
          <button className="border mt-2 px-4 py-2 rounded-md text-sm">
            {/* `${import.meta.env.VITE_BACKEND_DOMAIN}/auth/google` */}
            <a href="/login" className="flex items-center">
              <FcGoogle className="mr-2" /> Login with Google
            </a>
          </button>
        )}
      </div>
      
      <IntroDiet getDietData={introData?.data?.diet} />
      <IntroCommunity getHotData={introData?.data?.communityHot} getLatestData={introData?.data?.communityLatest} />
      <IntroTrainer getTrainerData={introData?.data?.trainer} />
    </div>
  );
};

export default Intro;
