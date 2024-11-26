import React, { useState } from "react";
import PropTypes from "prop-types";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import EditEventModal from "./EditEventModal";
import {
  getDaysInMonth,
  filterHolidaysForMonth,
  workDurationToMinutes,
  minutesToHoursMinutes,
} from "./CreatFunction";

const TableComponent = ({
  month,
  year,
  holidays,
  events,
  onEditEvent,
  onDeleteEvent,
  localPosts,
  AllUsers,
  typePosts,
  siteUsers,
}) => {
  console.log(siteUsers);
  console.log(month);

  const getUserFullName = (userId) => {
    const user = siteUsers.find((user) => user.value == userId);
    return user ? user.label : "agent inconnu";
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);

  const zeroIndexedMonth = month - 1;
  const filteredHolidays = filterHolidaysForMonth(
    holidays,
    zeroIndexedMonth,
    year
  );

  const createTable = (events, month, year, holidays) => {
    const daysInMonth = getDaysInMonth(month, year);
    const userEventsMap = {};
    const daysOfWeek = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"];
    const userTotalDuration = {};
    const dayTotalDuration = Array.from({ length: daysInMonth }, () => 0);
    let totalMonthlyDuration = 0;

    // Initialisation des données utilisateur
    if (siteUsers && Array.isArray(siteUsers)) {
      // Fonction utilitaire pour obtenir tous les jours du mois
      const getAllDaysInMonth = (month, year) => {
        const days = [];
        const date = new Date(year, month - 1, 1);
        while (date.getMonth() === month - 1) {
          const year = date.getFullYear();
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const day = date.getDate().toString().padStart(2, "0");
          days.push(`${year}-${month}-${day}`);
          date.setDate(date.getDate() + 1);
        }
        return days;
      };

      // Exemple d'utilisation pour un mois et une année donnés
      const daysOfMonth = getAllDaysInMonth(month, year);

      // Initialiser userEventsMap
      siteUsers.forEach((user) => {
        const user_id = user.value;
        userEventsMap[user_id] = Array.from(
          { length: daysOfMonth.length },
          () => []
        );
      });

      // Créer des événements vides pour chaque jour du mois pour les utilisateurs sélectionnés
      const newEvents = siteUsers.flatMap((user) =>
        daysOfMonth.map((date) => {
          let lastId =
            events.length > 0
              ? Math.max(...events.map((event) => event.id))
              : 0;
          return {
            id: ++lastId,
            user_id: user.value,
            post: "",
            typePost: "",
            vacation_start: "",
            vacation_end: "",
            pause_payment: "Non-payable",
            pause_start: "",
            pause_end: "",
            selected_days: date,
            work_duration: "0:00",
            night_hours: "0:00",
            holiday_hours: "0:00",
            sunday_hours: "0:00",
            isNull: true,
          };
        })
      );

      console.log(newEvents); // Vérifier les événements avant la mise à jour
    }

    events.forEach((event) => {
      const {
        user_id,
        selected_days,
        vacation_start,
        vacation_end,
        pause_payment,
        post,
        pause_start,
        pause_end,
        work_duration,
      } = event;

      const eventDate = new Date(selected_days);
      const eventMonth = eventDate.getMonth();
      const eventYear = eventDate.getFullYear();
      const day = eventDate.getDate();

      if (
        eventMonth === month &&
        eventYear === year &&
        day >= 1 &&
        day <= daysInMonth
      ) {
        const colorClass =
          pause_payment === "Payable" ? "text-blue-500" : "text-red-500";

        const formatTime = (timeString) => {
          if (!timeString) return "";
          const [hours, minutes] = timeString.split(":");
          return `${hours}:${minutes}`;
        };

        const cellContent = (
          <div className="flex flex-col text-xs text-center">
            <div>{post}</div>
            <div>{formatTime(vacation_start)}</div>
            <div className={colorClass}>P</div>
            <div>{formatTime(vacation_end)}</div>
          </div>
        );

        if (userEventsMap[user_id]) {
          if (userEventsMap[user_id][day - 1]) {
            userEventsMap[user_id][day - 1].push(
              <div
                className="flex flex-col py-0 px-1 mb-0 shadow-sm border rounded-md bg-white"
                key={event.id}
                onClick={() => handleEditEvent(event)}
              >
                {event.isNull ? (
                  <div
                    className="flex flex-col items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditEvent(event);
                      }}
                      title="Éditer"
                      className="text-blue-500 hover:text-blue-700 focus:ring-2 focus:ring-blue-300 rounded-full p-2 transition-all duration-150 ease-in-out"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    {cellContent}
                    <div className="flex justify-center space-x-1 mt-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditEvent(event);
                        }}
                        title="Éditer"
                        className="text-blue-500 hover:text-blue-700 focus:outline-none transition duration-150 ease-in-out"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEvent(event);
                        }}
                        title="Supprimer"
                        className="text-red-500 hover:text-red-700 focus:outline-none transition duration-150 ease-in-out"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <div
                      className="flex items-center justify-center mt-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(event.id)}
                        onChange={(e) => {
                          toggleSelectEvent(event.id);
                        }}
                        className="form-checkbox mb-1 text-blue-600 h-5 w-5 rounded focus:ring-2 focus:ring-blue-300 transition-all duration-150 ease-in-out"
                      />
                    </div>
                    <hr className="my-2 border-gray-300" />
                  </>
                )}
              </div>
            );
          }
        }

        const durationInMinutes = workDurationToMinutes(work_duration);
        userTotalDuration[user_id] =
          (userTotalDuration[user_id] || 0) + durationInMinutes;
        dayTotalDuration[day - 1] += durationInMinutes;
        totalMonthlyDuration += durationInMinutes;
      }
    });

    const holidaysSet = new Set(
      holidays.map((holiday) => new Date(holiday.date).getDate())
    );

    const table = [];
    const headers = ["Agents"];
    for (let i = 0; i < daysInMonth; i++) {
      const date = new Date(year, month, i + 1);
      const dayOfMonth = i + 1;
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isHoliday = holidaysSet.has(dayOfMonth);

      let headerClass = "";
      if (isHoliday) {
        headerClass = "bg-red-200 text-black";
      } else if (isWeekend) {
        headerClass = "bg-yellow-100";
      } else {
        headerClass = "bg-gray-50";
      }

      headers.push(
        <div
          key={`header-${i}`}
          className={`text-center text-xs ${headerClass}`}
        >
          <div>{daysOfWeek[date.getDay()]}</div>
          <div>{dayOfMonth}</div>
        </div>
      );
    }

    headers.push(
      <div className="text-center text-xs font-bold" key="total">
        Total
      </div>
    );
    table.push(headers);

    siteUsers.forEach((user) => {
      const user_id = user.value;
      const days = userEventsMap[user_id];
      table.push([
        getUserFullName(user_id, AllUsers),
        ...days.map((eventsForDay, index) => (
          <div key={`events-${index}`} className="flex flex-col">
            {eventsForDay.length ? eventsForDay : "--"}
          </div>
        )),
        minutesToHoursMinutes(userTotalDuration[user_id] || 0),
      ]);
    });

    const dayTotalsRow = [
      "Total par jour",
      ...dayTotalDuration.map((duration) => minutesToHoursMinutes(duration)),
    ];
    dayTotalsRow.push(minutesToHoursMinutes(totalMonthlyDuration));
    table.push(dayTotalsRow);

    return { table, holidaysSet };
  };

  const { table, holidaysSet } = createTable(
    events,
    zeroIndexedMonth,
    year,
    filteredHolidays
  );

  const handleEditEvent = (event) => {
    console.log("Editing event: ", event); // Ajoutez ceci pour le débogage
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleSaveEvent = (updatedEvent) => {
    onEditEvent(updatedEvent);
    setShowModal(false);
  };

  const handleDeleteEvent = (event) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      onDeleteEvent(event);
    }
  };

  const toggleSelectEvent = (eventId) => {
    setSelectedEvents((prevSelected) => {
      if (prevSelected.includes(eventId)) {
        return prevSelected.filter((id) => id !== eventId);
      } else {
        return [...prevSelected, eventId];
      }
    });
  };

  const handleDeleteSelectedEvents = () => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer les événements sélectionnés ?"
      )
    ) {
      selectedEvents.forEach((eventId) => {
        const event = events.find((e) => e.id === eventId);
        if (event) {
          onDeleteEvent(event);
        }
      });
      setSelectedEvents([]);
    }
  };

  const handleAddSelectedEvents = () => {
    if (selectedEvents.length === 0) {
      alert("Aucun événement sélectionné");
      return;
    }

    const eventsToEdit = events.filter((event) =>
      selectedEvents.includes(event.id)
    );
    setSelectedEvent(eventsToEdit);
    setShowModal(true);
  };

  return (
    <div className="mt-2 bg-white border border-gray-300 rounded-md shadow-sm p-2 space-y-3">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border-collapse border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              {table[0].map((header, index) => (
                <th
                  key={index}
                  className="px-1 py-1 border-r border-gray-300 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex} className={`hover:bg-blue-200`}>
                {row.map((cell, cellIndex) => {
                  const day = cellIndex; // Correspond à la date du jour (cellIndex - 1)
                  const isWeekend =
                    day > 0 &&
                    day <= table[0].length - 2 &&
                    (new Date(year, zeroIndexedMonth, day).getDay() === 0 ||
                      new Date(year, zeroIndexedMonth, day).getDay() === 6);
                  const isHoliday = day > 0 && holidaysSet.has(day);

                  return (
                    <td
                      key={`cell-${rowIndex}-${cellIndex}`}
                      className={`px-2 py-1 border-r border-gray-300 text-center text-xs font-medium ${
                        isWeekend ? "bg-yellow-100" : ""
                      } ${
                        isHoliday ? "bg-red-200 text-gray" : "text-gray-900"
                      }`}
                    >
                      {cell || "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="m-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-yellow-200 border border-gray-300 rounded-full"></div>
          <span className="text-gray-800">Week-end</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-red-200 border border-gray-300 rounded-full"></div>
          <span className="text-gray-800">Jour férié</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 flex items-center justify-center text-blue-600 font-semibold bg-blue-200 rounded-full">
            P
          </div>
          <span className="text-gray-800">Pause Payable</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 flex items-center justify-center text-red-600 font-semibold bg-red-200 rounded-full">
            P
          </div>
          <span className="text-gray-800">Pause Non-payable</span>
        </div>
      </div>

      <div className="mb-4 flex justify-center md:justify-start gap-4">
        <button
          onClick={handleAddSelectedEvents}
          className="bg-blue-600 text-white px-3 py-1 text-xs font-medium rounded-md shadow-sm hover:bg-blue-700 transition-colors duration-150"
        >
          Ajouter le(s) événement(s) sélectionné(s)
        </button>
        <button
          onClick={handleDeleteSelectedEvents}
          className="bg-red-600 text-white px-3 py-1 text-xs font-medium rounded-md shadow-sm hover:bg-red-700 transition-colors duration-150"
        >
          Supprimer le(s) événement(s) sélectionné(s)
        </button>
      </div>

      <EditEventModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        event={selectedEvent}
        onSave={handleSaveEvent}
        localPosts={localPosts}
        typePosts={typePosts}
      />
    </div>
  );
};

// Définir les PropTypes pour le composant
TableComponent.propTypes = {
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  holidays: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      user_id: PropTypes.string.isRequired,
      selected_days: PropTypes.string.isRequired,
      vacation_start: PropTypes.string,
      vacation_end: PropTypes.string,
      pause_payment: PropTypes.string,
      post: PropTypes.string,
      pause_start: PropTypes.string,
      pause_end: PropTypes.string,
      work_duration: PropTypes.string,
    })
  ).isRequired,
  onEditEvent: PropTypes.func.isRequired,
  onDeleteEvent: PropTypes.func.isRequired,
  siteUsers: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  localPosts: PropTypes.array.isRequired, // Ajoutez cette ligne si localPosts est requis
  typePosts: PropTypes.array.isRequired, // Ajoutez cette ligne si typePosts est requis
};

export default TableComponent;
