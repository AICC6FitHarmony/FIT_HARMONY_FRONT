import React from "react";

const FormInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  as = "input",
  options = [],
}) => {
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
      default:
        return (
          <input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            className={inputClasses}
            placeholder={placeholder}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      {renderInput()}
    </div>
  );
};

export default FormInput;
