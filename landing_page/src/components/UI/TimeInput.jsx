import React, { useRef } from "react";
import { FaClock } from "react-icons/fa";

const TimeInput = ({ label, value, onChange, placeholder, icon, iconBg = "bg-blue-500", errorMessage }) => {
  const inputRef = useRef(null);

  const handleContainerClick = () => {
    inputRef.current?.showPicker?.(); // for modern browsers
    inputRef.current?.focus?.();
  };

  return (
    <div className="w-full">
        <div
      className={`bg-gray-900 rounded-lg p-3 flex items-center cursor-pointer w-full ${errorMessage ? 'border-2 border-red-400' : ''}`}
      onClick={handleContainerClick}
    >
      <div className={`${iconBg} rounded-full p-2 mr-3`}>
        {icon || <FaClock className="text-white" />}
      </div>
      <div className="flex-1">
        {label && <label className="block text-sm text-gray-400 mb-1">{label}</label>}
        <input
          ref={inputRef}
          type="time"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-white outline-none appearance-none"
        />
      </div>
    </div>
          {errorMessage && <p className="text-red-400">{errorMessage}</p>}
    </div>
  );
};

export default TimeInput;
