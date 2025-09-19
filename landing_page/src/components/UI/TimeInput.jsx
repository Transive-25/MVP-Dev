import React, { useRef } from "react";
import { FaClock } from "react-icons/fa";

const TimeInput = ({ label, value, onChange, placeholder, icon, iconBg = "bg-blue-500", errorMessage }) => {
  const inputRef = useRef(null);

  const handleContainerClick = () => {
    inputRef.current?.showPicker?.(); // for modern browsers
    inputRef.current?.focus?.();
  };

  // format current time as HH:mm
  const now = new Date();
  const currentTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24-hour format; set to true if you prefer 12h
  });

  return (
    <div className="w-full">
      <div
        className={`dark:bg-gray-900 border-2 dark:border-gray-700 border-gray-300 hover:cursor-pointer rounded-lg p-3 flex items-center cursor-pointer w-full ${
          errorMessage ? "border-2 border-red-400" : ""
        }`}
        onClick={handleContainerClick}
      >
  
          {icon || <FaClock className="text-gray-500 text-2xl mr-3" />}
       
        <div className="flex-1">
          {label && <label className="block text-sm text-gray-400 mb-1">{label}</label>}
          <input
            ref={inputRef}
            type="time"
            value={value || currentTime}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-transparent dark:text-white outline-none appearance-none"
          />
        </div>
      </div>
      {errorMessage && <p className="text-red-400">{errorMessage}</p>}
    </div>
  );
};

export default TimeInput;
