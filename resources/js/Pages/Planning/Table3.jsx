import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import CreateEditEventModal from "./CreateEditEventModal";
import {
  getDaysInMonth,
  filterHolidaysForMonth,
  minutesToHoursMinutes,
} from "./CreatFunction";

const TableComponent = ({
  month,
  year,
  holidays,
  events,
  onEditEvent,
  onDeleteEvent,
  onCreateEvent,
  localPosts,
  AllUsers,
  typePosts,
  siteUsers,
}) => {
  console.log("events", events);
  const getUserFullName = (userId) => {
    const user = siteUsers.find((user) => user.id === userId);
    return user ? user.fullname : "agent inconnu";
  };

  const [createEditEventModal, setCreateEditEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [createMode, setCreateMode] = useState(false);
  const [isMultiEditMode, setIsMultiEditMode] = useState(false);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [eventsToEditId, setEventsToEditId] = useState([]);
  const [modalData, setModalData] = useState({
    user_id: null,
    selected_days: [],
  });

  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

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
      siteUsers.forEach((user) => {
        const user_id = user.id;
        userEventsMap[user_id] = Array.from({ length: daysInMonth }, () => []);
        userTotalDuration[user_id] = 0;
      });
    }

    events.forEach((event) => {
      const {
        user_id,
        selected_days,
        vacation_start,
        vacation_end,
        pause_payment,
        post,
        lunchAllowance,
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
          pause_payment === "yes" || pause_payment === "noBreak"
            ? "text-blue-500"
            : "text-red-500";

        const formatTime = (timeString) => {
          if (!timeString) return "";
          const [hours, minutes] = timeString.split(":");
          return `${hours}:${minutes}`;
        };

        const cellContent = (
          <div className="flex flex-col text-xs text-center ">
            <div>{post}</div>
            <div>{formatTime(vacation_start)}</div>
            <div className={colorClass}>P</div>
            <div>{formatTime(vacation_end)}</div>
          </div>
        );

        if (userEventsMap[user_id] && userEventsMap[user_id][2]) {
          userEventsMap[user_id][day - 1].push(
            <div>
              <div
                className="flex flex-col py-0 px-1 mb-0 shadow-sm border rounded-md bg-white"
                key={event.id}
                onClick={() => handleEditEvent(event)}
              >
                <>
                  {cellContent}

                  {/* Edit/Delete Button Group */}
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
                    <CogIcon />

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

                  {/* Select Checkbox */}
                  <div
                    className="flex items-center justify-center mt-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isMultiSelect && (
                      <>
                        <input
                          type="checkbox"
                          checked={selectedEvents.includes(event.id)}
                          onChange={(e) => {
                            toggleSelectEvent(event.id);
                          }}
                          className="form-checkbox mb-1 text-yellow-600 h-3 w-3 rounded focus:ring-2 focus:ring-yellow-300 transition-all duration-150 ease-in-out border-2 border-red-600"
                        />
                      </>
                    )}
                  </div>

                  {/* Separator */}
                  <hr className="border-gray-600" />
                </>
              </div>
              <div className="flex flex-col items-center justify-center py-0 px-1 mb-0 shadow-sm border rounded-md ">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    handleCheckboxChange(e, user_id, selected_days)
                  } // Always pass `user_id` and `selected_days`
                  className="form-checkbox  h-4 w-4 rounded  border-gray-600 m-1"
                />
                {/* Optional text for context */}
              </div>
            </div>
          );
        }

        const durationInMinutes = work_duration;
        userTotalDuration[user_id] += durationInMinutes;
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
        headerClass = "bg-green-200 text-black";
      } else if (isWeekend) {
        headerClass = "bg-red-200";
      } else {
        headerClass = "bg-gray-150";
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
      const user_id = user.id;
      const days = userEventsMap[user_id];
      table.push([
        getUserFullName(user_id, AllUsers),
        ...days.map((eventsForDay, index) => {
          // Create full date string in "yyyy/mm/dd" format for the current cell
          const selected_days = `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(index + 1).padStart(2, "0")}`;

          return (
            <div key={`events-${index}`} className="flex flex-col items-center">
              {eventsForDay.length ? (
                eventsForDay
              ) : (
                <div>
                  <div className="flex flex-col items-center justify-center  shadow-xs border rounded-md">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleCheckboxChange(e, user_id, selected_days)
                      } // Always pass `user_id` and `selected_days`
                      className="form-checkbox  h-4 w-4 rounded  border-gray-600 m-1"
                    />
                    {/* Optional text for context */}
                  </div>
                </div>
              )}
            </div>
          );
        }),
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

  // Function pour la selection des events
  const toggleSelectEvent = (eventId) => {
    setSelectedEvents((prevSelected) => {
      if (prevSelected.includes(eventId)) {
        return prevSelected.filter((id) => id !== eventId);
      } else {
        return [...prevSelected, eventId];
      }
    });
  };

  // Function pour la selection user/date des checkbox
  const handleCheckboxChange = (e, user_id, selected_days) => {
    const isChecked = e.target.checked;
    setSelectedCheckboxes((prevState) => {
      let updatedCheckboxes;

      if (isChecked) {
        // Add the {user_id, selected_days} to the state
        updatedCheckboxes = [...prevState, { user_id, selected_days }];
      } else {
        // Remove the {user_id, selected_days} from the state
        updatedCheckboxes = prevState.filter(
          (checkbox) =>
            !(
              checkbox.user_id === user_id &&
              checkbox.selected_days === selected_days
            )
        );
      }

      return updatedCheckboxes; // Return the new state
    });
  };

  console.log(selectedCheckboxes);

  // Handle supprimer  une vacation par souris
  const handleDeleteEvent = (event) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      onDeleteEvent(event);
    }
  };
  const handleDeleteSelectedEvents = () => {
    if (selectedEvents.length === 0) {
      alert("Aucun événement sélectionné");
      return;
    }

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

  // Handle modifier plusieurs vacation par souris
  const handleEditSelectedEvents = () => {
    setCreateMode(false);
    // Vérifier si aucun événement n'est sélectionné
    if (selectedEvents.length === 0) {
      alert("Aucun événement sélectionné");
      return;
    } else if (selectedEvents.length === 1) {
      alert("Il faut au moins 2 vacations selectionnés");
      return;
    }

    // Liste des champs à comparer entre les événements sélectionnés
    const fieldsToCompare = [
      "lunchAllowance",
      "pause_end",
      "pause_payment",
      "pause_start",
      "post",
      "typePost",
      "vacation_end",
      "vacation_start",
      "work_duration",
    ];

    // Filtrer les événements sélectionnés par leurs IDs
    const eventsToCompare = events.filter((event) =>
      selectedEvents.includes(event.id)
    );

    // Vérifier si tous les champs spécifiés correspondent dans les événements sélectionnés
    const allFieldsMatch = eventsToCompare.every((event) => {
      return fieldsToCompare.every((field) => {
        // Comparer chaque champ avec le premier événement sélectionné
        return event[field] === eventsToCompare[0][field];
      });
    });

    // Si tous les champs sont identiques, on ouvre le modal en mode édition
    if (allFieldsMatch) {
      setSelectedEvent(eventsToCompare[0]);
      setIsMultiEditMode(true);
      setCreateEditEventModal(true);
    } else {
      // Afficher les différences entre les événements sélectionnés
      const differences = eventsToCompare
        .map((event, index) => {
          const diff = {};
          fieldsToCompare.forEach((field) => {
            if (event[field] !== eventsToCompare[0][field]) {
              diff[field] = {
                [`Event ${index + 1}`]: event[field],
                [`Event 1`]: eventsToCompare[0][field],
              };
            }
          });
          return { index: index + 1, diff }; // Inclure l'index de l'événement
        })
        .filter(({ diff }) => Object.keys(diff).length > 0); // Filtrer les événements sans différences

      // Si des différences sont trouvées, les formater pour l'alerte
      if (differences.length > 0) {
        let differencesMessage =
          "Les Vacations sélectionnés ont des différences dans les champs suivants :\n";
        differences.forEach(({ index, diff }) => {
          for (let field in diff) {
            differencesMessage += `\n🔹 **Champ : ${field}**\n`;
            differencesMessage += `   - Event 1 : ${diff[field]["Event 1"]}\n`;
            differencesMessage += `   - Event ${index} : ${
              diff[field]["Event " + index]
            }\n`;
          }
        });
        alert(differencesMessage);
      } else {
        alert("✅ Les vacations sélectionnés n'ont pas de différences.");
      }
    }
  };
  // Handle modifier une vacation par souris
  const handleEditEvent = (event) => {
    setCreateMode(false);
    setIsMultiEditMode(false);
    setSelectedEvent(event);
    setCreateEditEventModal(true);
  };

  const handleSaveEvent = (updatedEvent) => {
    if (isMultiEditMode) {
      updatedEvent.id = selectedEvents;
      onEditEvent(updatedEvent);
      setCreateEditEventModal(false);
    }

    onEditEvent(updatedEvent);
    setCreateEditEventModal(false);
  };

  // cree un ou plusieurs vacation par souris
  const handleCreateSelectedEvents = () => {
    if (!selectedCheckboxes || selectedCheckboxes.length === 0) {
      alert("Aucun agent/Jour sélectionné");
      return;
    }
    setCreateMode(true);
    setCreateEditEventModal(true);
  };
  const handleAddEvent = (newEvent) => {
    onCreateEvent(newEvent);
    setCreateEditEventModal(false);
    setSelectedCheckboxes([]);
  };

  // déselectionner tout les checkbox
  const handleDeselectedEvent = () => {
    setSelectedCheckboxes([]);
    setSelectedEvents([]);
  };

  const handleShowMultiSelect = () => {
    setIsMultiSelect((prevState) => !prevState);
  };

  return (
    <div className="bg-white border border-gray-600 rounded-md shadow-sm p-1 space-y-1">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-600 border-collapse border border-gray-600">
          <thead className="bg-gray-150">
            <tr>
              {table[0].map((header, index) => (
                <th
                  key={index}
                  className="px-0 py-1 border-r border-gray-600 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-600">
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
                      className={`px-1 py-1  border-r border-gray-600 text-center text-xs font-medium ${
                        isWeekend ? "bg-red-200" : ""
                      } ${
                        isHoliday ? "bg-green-200 text-gray" : "text-gray-900"
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
          <div className="w-4 h-4 bg-red-200 border border-gray-600 rounded-full"></div>
          <span className="text-gray-800">Week-end</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-green-200 border border-gray-600 rounded-full"></div>
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
          onClick={handleShowMultiSelect}
          className="bg-gray-600 text-white px-1 py-1 text-xs font-medium rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out transform hover:scale-105"
          aria-label="Activer la sélection multiple"
        >
          <span className="mr-3 text-lg">📋</span>
          Multi Select
        </button>

        {isMultiSelect && (
          <>
            <button
              onClick={handleDeleteSelectedEvents}
              className="bg-red-600 text-white px-2 py-1 text-xs font-medium rounded-md shadow-sm hover:bg-red-700 transition-colors duration-150"
              aria-label="Supprimer les événements sélectionnés"
            >
              <span className="mr-2">🗑️</span> Supprimer
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditSelectedEvents(event);
              }}
              className="bg-yellow-600 text-white px-2 py-1 text-xs font-medium rounded-md shadow-sm hover:bg-yellow-700 transition-colors duration-150"
              aria-label="Modifier les événements sélectionnés"
            >
              <span className="mr-2">✏️</span> Modifier
            </button>
          </>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCreateSelectedEvents(event);
          }}
          className="bg-green-600 text-white px-2 py-1 text-xs font-medium rounded-md shadow-sm hover:bg-green-700 transition-colors duration-150"
          aria-label="Créer un nouvel événement"
        >
          <span className="mr-2">➕</span> Créer
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeselectedEvent();
          }}
          className="bg-blue-600 text-white px-2 py-1 text-xs font-medium rounded-md shadow-sm hover:bg-blue-700 transition-colors duration-150"
          aria-label="Désélectionner les événements"
        >
          <span className="mr-2">❌</span> Désélectionner
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEditEvent(event);
          }}
          title="Éditer"
          className="text-blue-500 hover:text-blue-700 focus:outline-none transition duration-150 ease-in-out"
        ></button>
      </div>

      <CreateEditEventModal
        isOpen={createEditEventModal}
        onClose={() => setCreateEditEventModal(false)}
        event={selectedEvent}
        onSave={handleSaveEvent}
        onAdd={handleAddEvent}
        localPosts={localPosts}
        typePosts={typePosts}
        createMode={createMode}
        isMultiEditMode={isMultiEditMode}
        modalData={modalData}
        eventsToEditId={eventsToEditId}
        selectedCheckboxes={selectedCheckboxes}
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
      id: PropTypes.number.isRequired,
      fullname: PropTypes.string.isRequired,
    })
  ).isRequired,
  localPosts: PropTypes.array.isRequired, // Ajoutez cette ligne si localPosts est requis
  typePosts: PropTypes.array.isRequired, // Ajoutez cette ligne si typePosts est requis
};

export default TableComponent;
