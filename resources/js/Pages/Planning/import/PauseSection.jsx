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
  pause_end,
  setPauseStart
  ,setPauseEnd
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-center font-semibold text-2xl text-gray-900">
        Pause
      </div>
      <div className="flex flex-col md:flex-row md:space-x-4 bg-white border border-gray-300 rounded-lg shadow-md p-4">
        {/* Sélection de la pause */}
        <div className="flex-1">
          <label
            htmlFor="pause_payment"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Payable:
          </label>
          <select
            id="pause_payment"
            value={pause_payment}
            onChange={(e) => setPausePayment(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md text-sm bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {BREAK_OPTIONS.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Champs "Début" et "Fin" affichés dynamiquement */}
        {pause_payment !== "noBreak" && (
          <>
            <div className="flex-1">
              <label
                htmlFor="pause_start"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Début:
              </label>
              <input
                type="time"
                id="pause_start"
                value={pause_start}
                onChange={(e) => setPauseStart(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-md text-sm bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="pause_end"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Fin:
              </label>
              <input
                type="time"
                id="pause_end"
                value={pause_end}
                onChange={(e) => setPauseEnd(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-md text-sm bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PauseSection;