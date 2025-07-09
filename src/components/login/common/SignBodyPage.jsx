import React, { useState } from "react";
import SignInputTab from "./SignInputTab";
import InputWithLabel from "../../cmmn/InputWithLabel";

const SignBodyPage = ({
  userInfo,
  handleChangeValue,
  tabIdx,
  thisIdx,
}) => {
  const { age, height, weight} = userInfo;
  return (
    <div>
      <div className={"flex justify-center flex-col items-center gap-5"}>
        <InputWithLabel 
          label="나이" name="age" onChange={handleChangeValue} 
          value={age} isNumber={true} 
          waringText="나이를 확인해 주세요(5~100)" 
          isWaring={age < 5 || age > 100}/>
        <InputWithLabel label="키" name="height" onChange={handleChangeValue} value={height} isNumber={true}/>
        <InputWithLabel label="몸무게" name="weight" onChange={handleChangeValue} value={weight} isNumber={true}/>
        <div className="gender flex w-full gap-2 items-center justify-between">
          <div>성별</div>
          <div className="flex text-center justify-center py-2 w-[80%] items-center">
            <div className="w-1/2">
              <span>남</span>
              <input
                type="radio"
                onChange={handleChangeValue}
                defaultChecked={true}
                value="M"
                name="gender"
              />
            </div>
            <div className="w-1/2 items-center">
              <span>여</span>
              <input
                type="radio"
                onSelect={handleChangeValue}
                onChange={handleChangeValue}
                value="F"
                name="gender"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignBodyPage;
