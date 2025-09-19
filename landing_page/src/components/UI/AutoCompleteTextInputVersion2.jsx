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
    iconBg = "bg-green-500", 
    errorMessage
  }, ref) => {
    return (
      <div className="w-full">
            <div className={`dark:bg-gray-900 border-2 dark:border-gray-700 border-gray-300  rounded-lg p-3 flex items-center ${errorMessage ? "border-2 border-red-400" : ""}`}>
        <div className={`mr-3`}>
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
                className={`w-full bg-transparent dark:text-white outline-none`}
              />
            </Autocomplete>
          ) : (
            <input
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              className={`w-full bg-transparent outline-none`}
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
