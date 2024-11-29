import React, { useState } from "react";

const CalendarComponent = ({ holidays, onDaysSelected, month, year }) => {
  const [selectedDays, setSelectedDays] = useState([]);

  // Function to format date as YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Normalize API dates to local timezone
  const normalizeToLocal = (dateStr) => {
    const date = new Date(dateStr);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  // Normalized holidays array
  const holidaysNormalized = holidays.map((holiday) => ({
    ...holiday,
    normalizedDate: normalizeToLocal(holiday.date),
  }));

  // Check if the date is a holiday
  const isHoliday = (date) => {
    const formattedDate = formatDate(date);
    return holidaysNormalized.some(
      (holiday) => formatDate(holiday.normalizedDate) === formattedDate
    );
  };

  // Check if the date is a weekend
  const isWeekend = (date) => date.getDay() === 6 || date.getDay() === 0;

  // Get all days in the current month
  const getDaysInMonth = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from(
      { length: daysInMonth },
      (_, index) => new Date(year, month, index + 1)
    );
  };

  // Handle day selection change
  const handleDayChange = (date) => {
    const dateStr = formatDate(date);
    setSelectedDays((prevSelected) => {
      const updatedSelectedDays = prevSelected.includes(dateStr)
        ? prevSelected.filter((day) => day !== dateStr)
        : [...prevSelected, dateStr];

      // Notify the parent component of the new selection
      onDaysSelected(updatedSelectedDays);
      return updatedSelectedDays;
    });
  };

  // Deselect all days
  const deselectAllDays = () => {
    setSelectedDays([]);
    // Notify the parent component of the deselection
    onDaysSelected([]);
  };

  return (
    <div className="calendar-container">
      {/* Legend Section */}
      <div className="mt-2 p-2">
        <div className="flex gap-4">
          <div className="flex items-center">
            <span className="text-xs font-bold text-gray-700">Légende :</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-red-300 border border-red-500 rounded-md"></div>
            <span className="text-xs">Weekends (Samedi & Dimanche)</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-green-300 border border-green-500 rounded-md"></div>
            <span className="text-xs">Jours fériés</span>
          </div>
        </div>
      </div>
      <hr className="m-2" />

      {/* Days Selection */}
      <label className="block text-sm font-bold text-center text-black mb-1 bg-gray-300">
        Sélectionner des jours
      </label>
      <div className="flex flex-col gap-2">
        {/* Render days dynamically */}
        <div className="flex flex-wrap justify-center">
          {getDaysInMonth(year, month - 1).map((date) => (
            <div
              key={date.getTime()}
              className="flex flex-col items-center w-7"
            >
              <label
                htmlFor={`day-${date.getTime()}`}
                className={`text-xs text-gray-700 ${
                  isWeekend(date) ? "text-red-500" : ""
                } ${isHoliday(date) ? "text-green-500" : ""}`}
              >
                {String(date.getDate()).padStart(2, "0")}
              </label>
              <input
                type="checkbox"
                id={`day-${date.getTime()}`}
                checked={selectedDays.includes(formatDate(date))}
                onChange={() => handleDayChange(date)}
                className={`h-4 w-4 text-blue-600 border-gray-300 rounded ${
                  isWeekend(date) ? "bg-red-300" : ""
                } ${isHoliday(date) ? "bg-green-200" : ""}`}
              />
            </div>
          ))}
        </div>
      </div>
      <hr className="m-2" />

      {/* Display selected days */}
      <div className="mb-2">
        <h3 className="text-xs font-bold text-gray-700">Jours sélectionnés</h3>
        <div className="flex flex-wrap gap-2">
          {selectedDays.length === 0 ? (
            <div className="text-xs text-gray-600">Aucun jour sélectionné</div>
          ) : (
            selectedDays
              .sort((a, b) => new Date(a) - new Date(b))
              .map((date, index) => {
                const formattedDate = new Date(date).toLocaleDateString(
                  "fr-FR",
                  {
                    day: "2-digit",
                    month: "2-digit",
                  }
                );
                return (
                  <div
                    key={index}
                    className="text-[11px] text-white border bg-blue-500 rounded-md p-1"
                  >
                    {formattedDate}
                  </div>
                );
              })
          )}
        </div>
      </div>
      <hr className="m-2" />
      {/* Deselect All Button */}
      <div className="mb-2">
        <button
          onClick={deselectAllDays}
          className="px-2 py-1 bg-red-600 text-[11px] text-white rounded-md hover:bg-red-600"
        >
          Désélectionner tout
        </button>
      </div>
    </div>
  );
};

export default CalendarComponent;
