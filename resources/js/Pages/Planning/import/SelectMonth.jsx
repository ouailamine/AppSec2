import React, { useState } from "react";
import { months } from "../CreatFunction";

const SelectMonth = ({ handleMonthChange, currentMonth }) => {
  return (
    <div className="w-full sm:max-w-xs">
      <select
        id="month"
        value={currentMonth}
        onChange={(e) => handleMonthChange(e.target.value)}
        className="w-52 mt-1 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="" disabled>
          Sélectionner un mois
        </option>
        {months.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectMonth;
