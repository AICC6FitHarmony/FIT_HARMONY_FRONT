import React, { useState } from "react";
import SignInputTab from "./common/SignInputTab";
import SignProfilePage from "./common/SignProfilePage";
import SignBodyPage from "./common/SignBodyPage";
import SignSelectText from "./common/SignSelectText";
import SignButton from "./common/SignButton";
import { toast, ToastContainer } from "react-toastify";
import SignNav from "./common/SignNav";
import SignGym from "./common/SignGym";
import InputWithLabel from "../cmmn/InputWithLabel";
import { googleRegister } from "../../js/login/loginUtils";
import ListMultiSelector from "../cmmn/ListMultiSelector";
import { ArrowLeftFromLineIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SignTrainer = () => {
  const idxMax = 4;
  const [tabIdx, setTabIdx] = useState(0);
  const [file, setFile] = useState();
  const navigate = useNavigate();
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
    gymId: undefined,
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

  const ChangeValue = ({name,value})=>{
    const newInfo = {
      ...userInfo,
    };
    newInfo[name] = value;
    setUserInfo(newInfo);
  }

  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    ChangeValue({name,value});
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
        !userInfo.history,
        "경력을 입력해 주세요",
        MoveIndex(1)
      )
    )
      return;
    handleSign();
  };

  const handleGoalMultiSelect = ({selects, list})=>{
    const text =list.filter((item, idx)=> selects[idx]).join(";");
    ChangeValue({name:"goal", value:text});
  }

  return (
    <div className="sign-box bg-white relative w-1/3 shadow-md shadow-green-800/10">
      <div className="flex items-center gap-2 p-1 cursor-pointer" onClick={()=>navigate("/login/signup")}>
        <ArrowLeftFromLineIcon/>
      </div>
      <div className="font-bold text-sm pb-1 pt-1 pl-5">
        강사 회원 가입
      </div>
      <form action="">
        <div className="pb-20">
          
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
          <SignInputTab idx={tabIdx} thisIdx={2} title="운동 경력">
            <InputWithLabel name="history" onChange={handleChangeValue} 
            value={userInfo.history} 
            isNumber={true} 
            waringText={"0~100 범위의 값을 입력해주세요"} 
            isWaring={userInfo.history < 0 || userInfo.history >100}/>
          </SignInputTab>
          <SignInputTab idx={tabIdx} thisIdx={3} title="제공 서비스">
            <ListMultiSelector
              list={
                [
                  "헬스 PT",
                  "필라테스",
                  "요가",
                  "바디발란스",
                  "복싱",
                  "수영",
                ]
              }
              onSelect={handleGoalMultiSelect}
              Template={
                ({item, selected})=>(
                  <div className="temp select-none py-2 px-1 text-xl text-center relative">
                    {item}
                    {
                      selected&&(<div className="absolute w-full h-[1px] bottom-0 left-0 bg-green-700"/>)
                    }
                  </div>
                )
              }
              />            
          </SignInputTab>
          <SignInputTab idx={tabIdx} thisIdx={4} title="체육관 선택">
            <SignGym
              onChange={handleChangeValue}
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
