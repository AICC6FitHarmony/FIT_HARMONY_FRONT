import React, { useState } from "react";
import SignInputTab from "./components/SignInputTab";
import SignProfilePage from "./components/SignProfilePage";
import SignBodyPage from "./components/SignBodyPage";
import SignSelectText from "./components/SignSelectText";
import SignButton from "./components/SignButton";
import { toast, ToastContainer } from "react-toastify";
import SignNav from "./components/SignNav";
import SignGym from "./components/SignGym";

const SignTrainer = () => {
  const idxMax = 4;
  const [tabIdx, setTabIdx] = useState(0);
  const [file, setFile] = useState();
  const [userInfo, setUserInfo] = useState({
    profile_image: undefined,
    nick_name: undefined,
    age: undefined,
    height: undefined,
    weight: undefined,
    experience: undefined,
    gender: "M",
    history: undefined,
    goal: undefined,
    role: "TRAINER",
  });

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
    if (
      await valueCheck(
        !userInfo.experience,
        "경력을 입력해 주세요",
        MoveIndex(1)
      )
    )
      return;
    handleSign();
  };
  return (
    <div className="sign-box shadow-xl relative w-1/3">
      <form action="">
        <div className="pb-20">
          <SignInputTab idx={tabIdx} thisIdx={0}>
            <SignProfilePage
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              handleChangeValue={handleChangeValue}
            />
          </SignInputTab>
          <SignBodyPage
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            handleChangeValue={handleChangeValue}
            handleInputNumber={handleInputNumber}
            tabIdx={tabIdx}
            thisIdx={1}
          />
          <SignInputTab idx={tabIdx} thisIdx={2}>
            <SignSelectText
              infoHeader="history"
              title="운동 수준"
              texts={["입문", "초급", "중급", "고급", "전문가"]}
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              handleChangeValue={handleChangeValue}
              handleInputNumber={handleInputNumber}
            />
          </SignInputTab>
          <SignInputTab idx={tabIdx} thisIdx={3}>
            <SignSelectText
              infoHeader="types"
              title="어떤 운동을 제공 할 수 있나요?"
              texts={[
                "헬스 PT",
                "필라테스",
                "요가",
                "바디발란스",
                "복싱",
                "수영",
              ]}
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              handleChangeValue={handleChangeValue}
              handleInputNumber={handleInputNumber}
            />
          </SignInputTab>
          <SignInputTab idx={tabIdx} thisIdx={4}>
            <SignGym
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              handleChangeValue={handleChangeValue}
              handleInputNumber={handleInputNumber}
            />
          </SignInputTab>

          <div
            className={`flex justify-center ${
              tabIdx === idxMax ? "" : "hidden"
            }`}
          >
            <SignButton handleSubmit={handleSubmit} />
          </div>
        </div>
        <SignNav tabIdx={tabIdx} setTabIdx={setTabIdx} idxMax={idxMax} />
      </form>
      {/* <button onClick={handleSign}>Sign</button> */}
      <ToastContainer />
    </div>
  );
};

export default SignTrainer;
