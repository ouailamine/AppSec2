import React, { useState, useEffect } from "react";

const AgentAvailableModal = ({
  isOpen,
  onClose,
  siteUsers,
  eventsForSearchGuard,
  currentMonth,
  currentYear,
  onAddLocalUser,
  localSiteUsers,
}) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [missingEvents, setMissingEvents] = useState([]);

  const getDaysInMonth = (month, year) => {
    const date = new Date(year, month, 0);
    const daysInMonth = date.getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  const formatDate = (day) => {
    const month = String(currentMonth).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    return `${currentYear}-${month}-${formattedDay}`;
  };

  const handleDayChange = (event) => {
    const day = event.target.value;
    setSelectedDay(formatDate(day));
  };

  const checkMissingEvents = () => {
    if (!selectedDay) return;

    const combinedUsers = [...siteUsers.firstList, ...siteUsers.secondList];
    const ids = combinedUsers.map((user) => user.id);

    const missing = ids.filter(
      (userId) =>
        !eventsForSearchGuard.some((event) => {
          const eventDate =
            event.selected_days && event.selected_days.slice(0, 10);
          return event.user_id === userId && eventDate === selectedDay;
        })
    );

    setMissingEvents(missing);
  };

  useEffect(() => {
    checkMissingEvents();
  }, [selectedDay, eventsForSearchGuard, siteUsers]);

  if (!isOpen) return null;

  const handleAddUser = (user) => {
    onAddLocalUser(user);
    onClose();
  };

  const filteredMissingEvents = missingEvents.filter(
    (userId) => !localSiteUsers.some((localUser) => localUser.id === userId)
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-60 flex justify-center items-center z-50">
      <div className="relative bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <span className="text-2xl font-bold">&times;</span>
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Agents Disponibles
        </h2>

        <div className="mb-4">
          <label
            htmlFor="daySelect"
            className="block text-sm font-medium text-gray-600"
          >
            Choisir un jour
          </label>
          <select
            id="daySelect"
            value={selectedDay ? selectedDay.slice(8) : ""}
            onChange={handleDayChange}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="" disabled>
              Sélectionnez un jour
            </option>
            {daysInMonth.map((day) => (
              <option key={day} value={day.toString().padStart(2, "0")}>
                {day.toString().padStart(2, "0")}/{currentMonth}/{currentYear}
              </option>
            ))}
          </select>
        </div>

        {selectedDay && (
          <p className="text-gray-700 mb-4">
            Jour sélectionné :{" "}
            <span className="font-semibold">
              {new Date(selectedDay).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </p>
        )}

        {filteredMissingEvents.length > 0 ? (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Agents sans événement ce jour-là :
            </h3>
            <ul className="space-y-3">
              {filteredMissingEvents.map((userId) => {
                const user = [
                  ...siteUsers.firstList,
                  ...siteUsers.secondList,
                ].find((user) => user.id === userId);
                return user ? (
                  <li
                    key={userId}
                    className="flex items-center justify-between text-gray-700"
                  >
                    <span>
                      {user.fullname} {user.firstname}
                    </span>
                    <button
                      onClick={() => handleAddUser(user)}
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      Ajouter
                    </button>
                  </li>
                ) : (
                  <li key={userId} className="text-red-500">
                    Agent ID: {userId} non trouvé
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <p className="text-gray-600 mt-4">
            Aucun agent sans événement pour ce jour sélectionné.
          </p>
        )}
      </div>
    </div>
  );
};

export default AgentAvailableModal;
