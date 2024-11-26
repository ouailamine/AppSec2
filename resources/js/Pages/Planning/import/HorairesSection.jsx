import React from "react";

const HorairesSection = ({
  vacation_start,
  setVacationStart,
  vacation_end,
  setVacationEnd,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-center font-semibold text-2xl text-gray-900">
        Horaires
      </div>
      <div className="flex flex-col md:flex-row md:space-x-4 bg-white border border-gray-300 rounded-lg shadow-md p-4">
        <div className="flex-1">
          <label
            htmlFor="vacation_start"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Début:
          </label>
          <input
            type="time"
            id="vacation_start"
            value={vacation_start}
            onChange={(e) => setVacationStart(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md text-sm bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="vacation_end"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Fin:
          </label>
          <input
            type="time"
            id="vacation_end"
            value={vacation_end}
            onChange={(e) => setVacationEnd(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md text-sm bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default HorairesSection;
