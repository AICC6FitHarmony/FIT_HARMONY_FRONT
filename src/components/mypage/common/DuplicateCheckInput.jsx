import React from "react";

const DuplicateCheckInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  isChecking,
  isChecked,
  isDuplicate,
  onCheck,
  disabled = false,
  originalValue,
}) => {
  const getBorderColor = () => {
    if (isChecked && !isDuplicate) return "border-green-500";
    if (isChecked && isDuplicate) return "border-red-500";
    return "border-gray-300";
  };

  const getStatusMessage = () => {
    if (isChecked && !isDuplicate) {
      return (
        <p className="text-sm text-green-500">사용 가능한 {label}입니다.</p>
      );
    }
    if (isChecked && isDuplicate) {
      return (
        <p className="text-sm text-red-500">이미 사용 중인 {label}입니다.</p>
      );
    }
    return null;
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white ${getBorderColor()}`}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={onCheck}
          disabled={isChecking || !value || value === originalValue || disabled}
          className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm whitespace-nowrap"
        >
          {isChecking ? "확인중..." : "중복확인"}
        </button>
      </div>
      {getStatusMessage()}
    </div>
  );
};

export default DuplicateCheckInput;
