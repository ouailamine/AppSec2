import React, { useState, useEffect } from "react";
import { getUserName } from "./CreatFunction";

const CalendarComponent = ({
  holidays,
  onDaysSelected,
  month,
  year,
  UsersDaysEvents,
  selectedUsers,
  users,
}) => {
  console.log("holidays", holidays);
  console.log("UsersDaysEvents", UsersDaysEvents);
  console.log("selectedUsers", selectedUsers);

  const [selectedDays, setSelectedDays] = useState([]);
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [isTableOpen, setIsTableOpen] = useState(false);

  useEffect(() => {
    const getDaysInMonth = (year, month) => {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      return Array.from(
        { length: daysInMonth },
        (_, index) => new Date(year, month, index + 1)
      );
    };
    setDaysInMonth(getDaysInMonth(year, month - 1));
  }, [month, year]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDayChange = (date) => {
    const dateStr = formatDate(date);
    setSelectedDays((prevSelected) => {
      const updatedSelectedDays = prevSelected.includes(dateStr)
        ? prevSelected.filter((day) => day !== dateStr)
        : [...prevSelected, dateStr];

      onDaysSelected(updatedSelectedDays);
      return updatedSelectedDays;
    });
  };

  const deselectAllDays = () => {
    setSelectedDays([]);
    onDaysSelected([]);
  };

  const isHoliday = (date) => {
    const formattedDate = formatDate(date);
    return holidays.includes(formattedDate);
  };

  const isWeekend = (date) => date.getDay() === 6 || date.getDay() === 0;

  const hasEvent = (userId, date) => {
    const formattedDate = formatDate(date);
    return UsersDaysEvents.some(
      (event) =>
        event.user_id === userId && event.selected_days === formattedDate
    );
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
            <div className="h-3 w-3 bg-blue-300 border border-red-500 rounded-md"></div>
            <span className="text-xs">Weekends (Samedi & Dimanche)</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 bg-red-300 border border-green-500 rounded-md"></div>
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
        <div className="flex flex-wrap justify-center">
          {daysInMonth.map((date) => (
            <div
              key={date.getTime()}
              className="flex flex-col items-center w-7"
            >
              <label
                htmlFor={`day-${date.getTime()}`}
                className={`text-xs text-black ${
                  isWeekend(date) ? "text-text-black" : ""
                } ${isHoliday(date) ? "text-text-black" : ""}`}
              >
                {String(date.getDate()).padStart(2, "0")}
              </label>
              <input
                type="checkbox"
                id={`day-${date.getTime()}`}
                checked={selectedDays.includes(formatDate(date))}
                onChange={() => handleDayChange(date)}
                className={`h-4 w-4 text-blue-700 border-gray-300 rounded ${
                  isWeekend(date) ? "bg-blue-300" : ""
                } ${isHoliday(date) ? "bg-red-200" : ""}`}
              />
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="mt-3 w-full bg-blue-800 text-white flex justify-between text-xs items-center px-2 py-1 rounded-md"
        onClick={() => setIsTableOpen(!isTableOpen)}
        aria-expanded={isTableOpen}
      >
        <span>
          {isTableOpen ? "Masquer les vacation" : "Afficher les vacation"}
        </span>
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${
            isTableOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 9l6 6 6-6"
          />
        </svg>
      </button>

      {/* Table Layout */}
      {isTableOpen && (
        <div className="calendar-container mt-2">
          {selectedUsers.length === 0 ? (
            <div className="text-center text-gray-500 mt-2">
              Sélectionnez un agent pour afficher le tableau.
            </div>
          ) : (
            <table className="table-auto border-collapse border border-gray-400 w-full">
              <thead>
                <tr>
                  <th className="border text-xs border-gray-300 p-1">Agent</th>
                  {daysInMonth.map((date) => {
                    const isWeekend = [0, 6].includes(date.getDay()); // Vérifie si c'est un week-end

                    // Format 'YYYY-MM-DD' sans fuseau horaire
                    const formattedDate = `${date.getFullYear()}-${String(
                      date.getMonth() + 1
                    ).padStart(2, "0")}-${String(date.getDate()).padStart(
                      2,
                      "0"
                    )}`;

                    // Vérifie si c'est un jour férié
                    const isHoliday = holidays.includes(formattedDate);

                    return (
                      <th
                        key={formattedDate}
                        className={`border text-xs border-gray-300 p-1 text-center ${
                          isWeekend
                            ? "bg-blue-300"
                            : isHoliday
                            ? "bg-red-200"
                            : ""
                        }`}
                      >
                        {date.getDate()}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {selectedUsers.map((userId) => {
                  const userEvents = UsersDaysEvents.filter(
                    (event) => event.user_id === userId
                  );

                  const userName =
                    userEvents.length > 0
                      ? userEvents[0].userName
                      : getUserName(users, userId);

                  const hasAnyEvent = daysInMonth.some((date) =>
                    hasEvent(userId, date)
                  );

                  return (
                    <tr key={userId}>
                      <td className="border border-gray-300 text-xs font-bold p-1">
                        {userName}
                      </td>
                      {hasAnyEvent ? (
                        daysInMonth.map((date) => {
                          const isWeekend = [0, 6].includes(date.getDay());
                          const formattedDate = `${date.getFullYear()}-${String(
                            date.getMonth() + 1
                          ).padStart(2, "0")}-${String(date.getDate()).padStart(
                            2,
                            "0"
                          )}`;

                          const isHoliday = holidays.includes(formattedDate);

                          return (
                            <td
                              key={formattedDate}
                              className={`border text-xs border-gray-300 p-1 text-center ${
                                hasEvent(userId, date)
                                  ? "text-green-700 font-bold"
                                  : isWeekend
                                  ? "bg-blue-300"
                                  : isHoliday
                                  ? "bg-red-200"
                                  : ""
                              }`}
                            >
                              {hasEvent(userId, date) ? "✓" : ""}
                            </td>
                          );
                        })
                      ) : (
                        <td
                          colSpan={daysInMonth.length}
                          className="border border-gray-300 text-xs text-center text-gray-500 italic p-2"
                        >
                          Aucun vacation pour cet agent.
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

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
                    className="text-[11px] text-white border bg-blue-400 rounded-md p-1"
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
