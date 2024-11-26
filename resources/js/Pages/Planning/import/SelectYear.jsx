import React from "react";
import Select from "react-select";

const SelectYear = ({
  yearOptions,
  currentYear,
  handleYearChange,
  isDisabled,
}) => {
  return (
    <Select
      options={yearOptions}
      value={yearOptions.find((option) => option.value === currentYear)}
      onChange={handleYearChange}
      placeholder="Sélectionner l'année"
      className="w-full sm:max-w-xs"
      classNamePrefix="react-select"
      isDisabled={isDisabled}
      styles={{
        control: (provided, state) => ({
          ...provided,
          borderColor: state.isFocused ? "#3b82f6" : "#d1d5db", // Tailwind's border-blue-500 and border-gray-300
          boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none", // Tailwind's ring-blue-500
          borderRadius: "0.5rem", // Tailwind's rounded-lg
          padding: "0.25rem", // Tailwind's p-1
          cursor: isDisabled ? "not-allowed" : "pointer",
          backgroundColor: isDisabled ? "#f3f4f6" : "white", // Tailwind's bg-gray-100 and bg-white
        }),
        menu: (provided) => ({
          ...provided,
          borderRadius: "0.5rem", // Tailwind's rounded-lg
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }),
        placeholder: (provided) => ({
          ...provided,
          color: "#9ca3af", // Tailwind's text-gray-400
        }),
        singleValue: (provided) => ({
          ...provided,
          color: "#1f2937", // Tailwind's text-gray-800
        }),
        indicatorSeparator: () => ({
          display: "none",
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          color: isDisabled ? "#9ca3af" : "#1f2937", // Tailwind's text-gray-400 and text-gray-800
        }),
      }}
    />
  );
};

export default SelectYear;
