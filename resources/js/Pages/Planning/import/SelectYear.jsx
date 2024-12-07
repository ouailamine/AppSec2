import React from "react";

const SelectYear = ({ currentYear, handleYearChange }) => {
  // Generate an array of years dynamically (e.g., last 20 years)
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() + i
  );

  return (
    <div className="w-full sm:max-w-xs">
      <select
        id="year"
        value={currentYear || ""}
        onChange={(e) => handleYearChange(Number(e.target.value))}
        className="w-52 mt-1 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="" disabled>
          Sélectionner une année
        </option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectYear;
