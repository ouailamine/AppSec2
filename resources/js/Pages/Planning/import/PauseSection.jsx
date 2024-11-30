import React from "react";

const BREAK_OPTIONS = [
  { value: "noBreak", label: "Pas de pause" },
  { value: "yes", label: "Payable" },
  { value: "no", label: "Non-payable" },
];

const PauseSection = ({
  pause_payment,
  setPausePayment,
  pause_start,
  setPauseStart,
  pause_end,
  setPauseEnd,
  errors,
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row md:space-x-4 bg-white border border-gray-300 rounded-lg shadow-md p-2">
        {/* Payable Selection */}
        <div className="flex-1 border">
          <label className="block text-sm font-bold text-black text-center bg-gray-300">
            Pause
          </label>

          <div className="flex gap-2">
            <div className="flex-2">
              <label className="block text-xs font-bold text-black">
                Payable:
              </label>
              <select
                id="pause_payment"
                value={pause_payment}
                onChange={(e) => setPausePayment(e.target.value)}
                className="m-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
              >
                {BREAK_OPTIONS.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors?.pause_payment && (
                <div className="text-red-500 text-sm font-bold">
                  {errors.pause_payment}
                </div>
              )}
            </div>
          
        

        {/* Start and End Time Inputs (conditionally displayed) */}
        {pause_payment !== "noBreak" && (
          <>
            <div className="flex-1">
              <label className="block text-xs font-bold text-black">Début:</label>
              <input
                type="time"
                id="pause_start"
                value={pause_start}
                onChange={(e) => setPauseStart(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
              />
              {errors?.pause_start && (
                <div className="text-red-500 text-sm font-bold">
                  {errors.pause_start}
                </div>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-xs font-bold text-black">Fin:</label>
              <input
                type="time"
                id="pause_end"
                value={pause_end}
                onChange={(e) => setPauseEnd(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
              />
              {errors?.pause_end && (
                <div className="text-red-500 text-sm font-bold">
                  {errors.pause_end}
                </div>
              )}
            </div>
          </>
        )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default PauseSection;
