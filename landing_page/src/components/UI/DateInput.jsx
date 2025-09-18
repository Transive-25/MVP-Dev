import React, { useRef } from "react";
import { FaCalendarAlt } from "react-icons/fa";

const DateInput = ({ label, value, onChange, placeholder, icon, iconBg = "bg-blue-500", errorMessage}) => {
  const inputRef = useRef(null);

  const handleContainerClick = () => {
    inputRef.current?.showPicker?.(); // Chrome & modern browsers
    inputRef.current?.focus?.();
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
   <div className="w-full">
     <div
 className={`bg-gray-900 rounded-lg p-3 flex items-center cursor-pointer w-full ${errorMessage ? 'border-2 border-red-400' : ''}`}
      onClick={handleContainerClick}
    >
      <div className={`${iconBg} rounded-full p-2 mr-3`}>
        {icon || <FaCalendarAlt className="text-white" />}
      </div>
      <div className="flex-1">
        {label && <label className="block text-sm text-gray-400 mb-1">{label}</label>}
        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={onChange}
          min={today} // Disable past dates
          placeholder={placeholder}
          className="w-full bg-transparent text-white outline-none appearance-none"
        />
      </div>
    </div>
              {errorMessage && <p className="text-red-400">{errorMessage}</p>}
   </div>
  );
};

export default DateInput;
