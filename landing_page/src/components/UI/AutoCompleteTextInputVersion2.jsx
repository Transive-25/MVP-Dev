import React, { forwardRef } from "react";
import { Autocomplete } from "@react-google-maps/api";

const AutoCompleteTextInputVersion2 = forwardRef(
  ({ 
    icon, 
    value, 
    onChange, 
    placeholder, 
    isLoaded, 
    onPlaceChanged, 
    bgColor = "bg-gray-900", 
    iconBg = "bg-green-500", 
    textColor = "text-white",
    errorMessage
  }, ref) => {
    return (
      <div className="w-full">
            <div className={`${bgColor} rounded-lg p-3 flex items-center ${errorMessage ? "border-2 border-red-400" : ""}`}>
        <div className={`${iconBg} rounded-full p-1.5 mr-3`}>
          {icon}
        </div>
        <div className="flex-1">
          {isLoaded ? (
            <Autocomplete
              onLoad={(autocomplete) => {
                if (ref) ref.current = autocomplete;
              }}
              onPlaceChanged={onPlaceChanged}
            >
              <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full bg-transparent ${textColor} outline-none`}
              />
            </Autocomplete>
          ) : (
            <input
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              className={`w-full bg-transparent ${textColor} outline-none`}
            />
          )}
        </div>
      </div>
                {errorMessage && <p className="text-red-400">{errorMessage}</p>}
      </div>
    );
  }
);

export default AutoCompleteTextInputVersion2;
