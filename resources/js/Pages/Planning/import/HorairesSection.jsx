import React from "react";

const HorairesSection = ({
  vacation_start,
  setVacationStart,
  vacation_end,
  setVacationEnd,
  errors,
  isDefaultHours,
}) => {
  console.log(isDefaultHours);
  return (
    <div className="flex-1 border p-2">
      {/* Title Label */}
      <label className="block text-sm font-bold text-black text-center bg-gray-300">
        Horaires
      </label>

      <div className="flex gap-1">
        {/* Vacation Start Time */}
        <div className="flex-1">
          <label className="block text-xs font-bold text-black">Début:</label>
          <input
            type="time"
            id="vacation_start"
            value={vacation_start}
            onChange={(e) => setVacationStart(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
          />
          {errors?.vacation_start && (
            <div className="text-red-500 text-xs font-bold font-bold">
              {errors.vacation_start}
            </div>
          )}
        </div>

        {/* Vacation End Time */}
        <div className="flex-1">
          <label className="block text-xs font-bold text-black">Fin:</label>
          <input
            type="time"
            id="vacation_end"
            value={vacation_end}
            onChange={(e) => setVacationEnd(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
          />
          {errors?.vacation_end && (
            <div className="text-red-500 text-sm font-bold">
              {errors.vacation_end}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HorairesSection;
