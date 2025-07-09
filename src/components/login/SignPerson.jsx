"use client";
import React, { useEffect, useRef, useState } from "react";
import SignInputTab from "./common/SignInputTab";
import { ToastContainer, toast } from "react-toastify";
import SignNav from "./common/SignNav";
import SignProfilePage from "./common/SignProfilePage";
import SignBodyPage from "./common/SignBodyPage";
import { googleRegister } from "../../js/login/loginUtils";
import SignSelectText from "./common/SignSelectText";
import SignButton from "./common/SignButton";
import { ArrowLeftFromLineIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SignPerson = () => {
  const [tabIdx, setTabIdx] = useState(0);
  const [userInfo, setUserInfo] = useState({
    profile_image: undefined,
    nick_name: undefined,
    age: undefined,
    height: undefined,
    weight: undefined,
    gender: "M",
    history: undefined,
    goal: undefined,
    role: "MEMBER",
    nickExist: true
  });
  const navigate = useNavigate();

  const idxMax = 3;

  const handleSign = async () => {
    // const formData = { nickname:"TestNick" };
    const formData = new FormData();
    const keys = Object.keys(userInfo);
    keys.forEach((key) => {
      formData.append(key, userInfo[key]);
    });
    console.log(formData);
    await googleRegister(formData);
  };

  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    const newInfo = {
      ...userInfo,
    };
    newInfo[name] = value;
    setUserInfo(newInfo);
  };

  const handleInputNumber = (e) => {
    let { name, value } = e.target;
    value = value.replace(/[^0-9]/g, "");
    const newInfo = {
      ...userInfo,
    };
    newInfo[name] = value;
    setUserInfo(newInfo);
  };

  // console.log(userInfo)

  const valueCheck = async (rejectCheck, err, errAction) => {
    if (rejectCheck) {
      if (errAction) errAction();
      await toast.error(err, {
        position: "bottom-center",
      });
      return true;
    }
    return false;
  };
  const MoveIndex = (idx) => () => setTabIdx(idx);
  const handleSubmit = async () => {
    // console.log(userInfo)
    if (
      await valueCheck(
        !userInfo.nick_name,
        "프로필 이름을 입력해 주세요",
        MoveIndex(0)
      )
    )
      return;
    if (
      await valueCheck(
        userInfo.nickExist,
        "닉네임 중복을 확인해 주세요",
        MoveIndex(0)
      )
    )
      return;
    if (
      await valueCheck(
        userInfo.nick_name.length > 10,
        "프로필 이름이 너무 깁니다.",
        MoveIndex(0)
      )
    )
      return;
    if (await valueCheck(!userInfo.age, "나이를 입력해 주세요", MoveIndex(1)))
      return;
    if (await valueCheck(!userInfo.height, "키를 입력해 주세요", MoveIndex(1)))
      return;
    if (
      await valueCheck(!userInfo.weight, "몸무게를 입력해 주세요", MoveIndex(1))
    )
      return;
    handleSign();
  };
  return (
    <div className="sign-box bg-white relative w-1/3 shadow-md shadow-green-800/10">
      <div className="flex items-center gap-2 p-1 cursor-pointer w-fit pr-4" onClick={()=>navigate("/login/signup")}>
        <ArrowLeftFromLineIcon/>
      </div>
      <div className="font-bold text-sm pb-1 pt-1 pl-5">
        일반 회원 가입
      </div>
      <form action="">
        <SignInputTab idx={tabIdx} thisIdx={0} title="프로필 설정">
          <SignProfilePage
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            handleChangeValue={handleChangeValue}
          />
        </SignInputTab>
        <SignInputTab idx={tabIdx} thisIdx={1} title="신체 정보">
          <SignBodyPage
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            handleChangeValue={handleChangeValue}
            handleInputNumber={handleInputNumber}
          />
        </SignInputTab>
        <SignInputTab idx={tabIdx} thisIdx={2} title="운동 수준">
          <SignSelectText
            infoHeader="history"
            texts={[
              "입문 (0 ~ 6개월)",
              "초급 (6개월 ~ 1년)",
              "중급 (1년 ~ 3년)",
              "고급 (3년 ~ 5년)",
              "전문가 (5년 이상)",
            ]}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            handleChangeValue={handleChangeValue}
            handleInputNumber={handleInputNumber}
          />
        </SignInputTab>
        <SignInputTab idx={tabIdx} thisIdx={3} title="운동 목표">
          <SignSelectText
            infoHeader="goal"
            texts={["체중 감소", "체중 유지", "체중 증가", "근육 증가"]}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            handleChangeValue={handleChangeValue}
            handleInputNumber={handleInputNumber}
          />
        </SignInputTab>

        <div
          className={`flex justify-center ${tabIdx === idxMax ? "" : "hidden"}`}
        >
        <SignButton handleSubmit={handleSubmit} />
        </div>
      </form>
      <div className="relative py-6">
        <SignNav tabIdx={tabIdx} setTabIdx={setTabIdx} idxMax={idxMax} />
      </div>
      {/* <button onClick={handleSign}>Sign</button> */}
      <ToastContainer />
    </div>
  );
};

export default SignPerson;
