import React, { useState } from "react";
 import { FaChevronDown } from "react-icons/fa";

const ServiceTypeDropdown = ({ options, onChange, placeHolder = "Choose service type..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    if (onChange) onChange(option.value);
  };

  return (
    <div className="relative w-full">
      {/* Dropdown Button */}
      <div
        className="dark:bg-gray-900 border-2 dark:border-gray-700 border-gray-300  rounded-lg p-3.5 flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="flex items-center gap-2 text-white">
          {selected ? (
            <>
              <span className="text-lg text-gray-600 dark:text-white">{selected.icon}</span>
              <span className="text-black dark:text-white">{selected.label}</span>
            </>
          ) : (
            <span className="text-gray-400">{placeHolder}</span>
          )}
        </div>
        <FaChevronDown
          className={`dark:text-white ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute mt-2 w-full bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden">
          {options.map((option) => (
            <div
              key={option.value}
              className="flex items-center gap-2 p-3 border-b-2 border-gray-500 text-white hover:bg-gray-700 cursor-pointer"
              onClick={() => handleSelect(option)}
            >
              <span className="text-lg">{option.icon}</span>
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceTypeDropdown;
