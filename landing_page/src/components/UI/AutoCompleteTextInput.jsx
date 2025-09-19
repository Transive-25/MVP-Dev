import React, { forwardRef } from "react";
import { Autocomplete } from "@react-google-maps/api";

const AutoCompleteInput = forwardRef(
  ({ 
    label, 
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
  <div
    className={`dark:bg-gray-900 border-2 dark:border-gray-700 border-gray-300 rounded-lg p-3 flex items-center 
      ${errorMessage ? "border-red-400" : "focus-within:border-gray-600"}`}
  >
    <div className={`text-lg mr-3`}>
      {icon}
    </div>
    <div className="flex-1">
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
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
            className="w-full bg-transparent dark:text-white placeholder:text-gray-500 text-black outline-none"
          />
        </Autocomplete>
      ) : (
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent outline-none"
        />
      )}
    </div>
  </div>
  {errorMessage && <p className="text-red-400 ml-1">{errorMessage}</p>}
</div>

    );
  }
);

export default AutoCompleteInput;
