import React, { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isWeekend,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { fr } from "date-fns/locale"; // Import French locale

const convertHolidays = (holidays) => {
  return holidays.map((holiday) => new Date(holiday.date));
};

const sortDates = (dates) => {
  return dates
    .map((dateStr) => new Date(dateStr))
    .sort((a, b) => a - b)
    .map((date) => format(date, "dd/MM/yyyy"));
};

const Calendrier = ({ holidays, onDaysSelected, monthYear, resetCalendar }) => {



  const holidaysDates = convertHolidays(holidays);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState([]);



  useEffect(() => {
    if (monthYear) {
      const { month, year } = monthYear;
      const newDate = new Date(year, month);
      setCurrentDate(newDate);
    }
  }, [monthYear]);

  useEffect(() => {
    if (resetCalendar) {
      setSelectedDays([]);
    }
  }, [resetCalendar]);

  const startOfMonthDate = startOfMonth(currentDate);
  const endOfMonthDate = endOfMonth(currentDate);
  const startOfView = startOfWeek(startOfMonthDate, {
    locale: fr,
    weekStartsOn: 1,
  });
  const endOfView = endOfWeek(endOfMonthDate, { locale: fr, weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: startOfView, end: endOfView });

  const toggleSelection = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    setSelectedDays((prev) =>
      prev.includes(dateStr)
        ? prev.filter((d) => d !== dateStr)
        : [...prev, dateStr]
    );
  };

  const deselectAll = () => {
    setSelectedDays([]);
  };

  const isHoliday = (date) => {
    return holidaysDates.some((holiday) => isSameDay(date, holiday));
  };

  useEffect(() => {
    if (onDaysSelected) {
      onDaysSelected(selectedDays);
    }
  }, [selectedDays, onDaysSelected]);

  // Filtrer les jours sélectionnés pour inclure uniquement ceux du mois courant
  const sortedSelectedDays = sortDates(
    selectedDays.filter((day) => {
      const dayDate = new Date(day);
      return isSameMonth(dayDate, currentDate);
    })
  );

  return (
    <div className="flex flex-col h-full">
      {/* Calendar Section */}
      <div className="flex-grow p-1 bg-white shadow-sm rounded-lg mb-1 lg:mb-0 lg:mr-1">
        {/* Legend */}
        <div className="mt-2 p-1 bg-gray-100 border-t border-gray-300">
          <h2 className="text-xs font-semibold text-gray-800 mb-1">Légende</h2>
          <div className="flex flex-wrap text-xs">
            <div className="flex items-center mr-2 mb-1">
              <span className="inline-block w-2 h-2 bg-blue-700 mr-1"></span>
              <span>Jour sélectionné</span>
            </div>
            <div className="flex items-center mr-2 mb-1">
              <span className="inline-block w-2 h-2 bg-red-600 mr-1"></span>
              <span>Jour férié</span>
            </div>
            <div className="flex items-center mr-2 mb-1">
              <span className="inline-block w-2 h-2 bg-yellow-100 mr-1"></span>
              <span>Week-end</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto flex space-x-2 bg-white border border-gray-300 rounded-md shadow-md p-2">
          <div className="flex">
            {days.map((day, dayIndex) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const isSelected = selectedDays.includes(dateStr);
              const isWeekendDay = isWeekend(day);
              const isCurrentMonthDay = isSameMonth(day, currentDate);
              const isHolidayDay = isHoliday(day);
              return (
                <div
                  key={dayIndex}
                  onClick={() => isCurrentMonthDay && toggleSelection(day)}
                  className={`w-7 h-8 flex items-center justify-center text-xs cursor-pointer transition ${
                    !isCurrentMonthDay
                      ? "text-gray-400 cursor-default"
                      : isSelected
                      ? isHolidayDay
                        ? "bg-red-600 text-white font-semibold"
                        : isWeekendDay
                        ? "bg-blue-400 text-white font-semibold"
                        : "bg-blue-800 text-white font-semibold"
                      : isHolidayDay
                      ? "bg-red-500 text-gray"
                      : isWeekendDay
                      ? "bg-yellow-100 text-gray"
                      : "text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {format(day, "d")}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Days Section */}
      <div className="p-1 bg-gray-100 border-t border-gray-300 flex-shrink-0">
        <h2 className="text-xs font-semibold text-gray-800 mb-1">
          Jours Sélectionnés
        </h2>
        <div className="flex flex-wrap gap-1 overflow-y-auto mb-1">
          {sortedSelectedDays.length > 0 ? (
            sortedSelectedDays.map((date) => {
              const [day, month, year] = date.split("/");
              const dateObj = new Date(`${month}/${day}/${year}`);
              const isHolidayDay = isHoliday(dateObj);
              const isWeekendDay = isWeekend(dateObj);
              return (
                <div
                  key={date}
                  className={`p-1 text-xs flex items-center rounded ${
                    isHolidayDay
                      ? "bg-red-600 text-white"
                      : isWeekendDay
                      ? "bg-blue-500 text-white"
                      : "bg-blue-700 text-white"
                  }`}
                >
                  {format(dateObj, "dd MMM", { locale: fr })}
                </div>
              );
            })
          ) : (
            <div className="text-gray-800 text-xs">Aucun jour sélectionné</div>
          )}
        </div>
        <button
          onClick={deselectAll}
          className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200 mt-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          aria-label="Désélectionner tous les éléments"
        >
          <span className="mr-2">❌</span> Désélectionner tout
        </button>
      </div>
    </div>
  );
};


export default Calendrier;
