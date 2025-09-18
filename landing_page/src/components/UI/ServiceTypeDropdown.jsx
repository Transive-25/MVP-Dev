import React, { useState } from "react";
import { FaChevronDown, FaCar, FaBox, FaWarehouse, FaHome, FaCogs } from "react-icons/fa";

const options = [
  { label: "Vehicle", value: "vehicle", icon: <FaCar /> },
  { label: "Equipment", value: "equipment", icon: <FaCogs /> },
  { label: "Warehousing", value: "warehousing", icon: <FaWarehouse /> },
  { label: "Household", value: "household", icon: <FaHome /> },
  { label: "Package", value: "package", icon: <FaBox /> },
];

const ServiceTypeDropdown = ({ label = "Select Service", onChange }) => {
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
        className="bg-gray-900 rounded-lg p-3.5 flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="flex items-center gap-2 text-white">
          {selected ? (
            <>
              <span className="text-lg">{selected.icon}</span>
              <span>{selected.label}</span>
            </>
          ) : (
            <span className="text-gray-400">Choose service type...</span>
          )}
        </div>
        <FaChevronDown
          className={`text-white ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute mt-2 w-full bg-gray-800 rounded-lg shadow-lg z-10">
          {options.map((option) => (
            <div
              key={option.value}
              className="flex items-center gap-2 p-3 text-white hover:bg-gray-700 cursor-pointer rounded-lg"
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
