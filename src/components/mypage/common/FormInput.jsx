import React, { useEffect, useState } from "react";
import spinner from "../../../images/spinner.svg";
import "../../../css/Mypage.css";

const FormInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  as = "input",
  options = [],
  showDuplicateCheck = false,
  isCheckingDuplicate = false,
  isDuplicateChecked = false,
  isDuplicate = false,
  nicknameValid = true,
}) => {
  useEffect(() => {
    setNicknameValid2(nicknameValid);
  }, [nicknameValid]);
  const [nicknameValid2, setNicknameValid2] = useState(true);
  const inputClasses =
    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white";

  const renderInput = () => {
    switch (as) {
      case "textarea":
        return (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            className={inputClasses}
            placeholder={placeholder}
          />
        );
      case "select":
        return (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className={inputClasses}
          >
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "number":
        return (
          <input
            name={name}
            type={as}
            value={value}
            step="any"
            onChange={onChange}
            className={inputClasses}
            placeholder={placeholder}
            min={0}
          />
        );
      default:
        return (
          <div className="relative">
            <input
              name={name}
              type={type}
              value={value}
              onChange={onChange}
              className={inputClasses}
              placeholder={placeholder}
            />
            {isCheckingDuplicate && (
              <img src={spinner} alt="spinner" className="spinner" />
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      {renderInput()}
      {(showDuplicateCheck || !nicknameValid2) && (
        <div className="flex items-center gap-2">
          {!nicknameValid2 && (
            <div className="text-sm font-medium text-red-500">
              올바른 닉네임 형식이 아닙니다. 영문, 숫자, 한글, 언더바(_)만 사용
              가능합니다.
            </div>
          )}
          {isDuplicateChecked && !isCheckingDuplicate && nicknameValid2 && (
            <div
              className={`text-sm font-medium ${
                isDuplicate ? "text-red-500" : "text-green-500"
              }`}
            >
              {isDuplicate
                ? "이미 사용 중인 닉네임입니다."
                : "사용 가능한 닉네임입니다."}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FormInput;
