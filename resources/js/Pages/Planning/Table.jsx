import React, { useEffect, useState } from "react";
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
  mergeAllEvents,
} from "./CreatFunction";

import ChangeUserEvents from "./Modal/ChangeUserEvent";

const TableComponent = ({
  month,
  year,
  holidays,
  events,
  onEditEvent,
  onDeleteEvent,
  onCreateEvent,
  onChangeEvents,
  //localPosts,
  AllUsers,
  typePosts,
  siteUsers,
  posts,
  mergeEvents,
}) => {
  console.log(events);
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
  const [tableEvents, setTableEvents] = useState(events);
  const [isMerged, setIsMerged] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserIdForChange, setSelectedUserIdForChange] = useState(null);

  const [hoveredEventId, setHoveredEventId] = useState(null);
  // Définir un état pour la taille de la police
  const [fontSize, setFontSize] = useState(12);

  // Fonction pour modifier la taille de la police
  const increaseFontSize = () => {
    setFontSize((prevFontSize) => prevFontSize + 1);
  };

  const decreaseFontSize = () => {
    setFontSize((prevFontSize) => Math.max(prevFontSize - 2, 8)); // Limiter la taille à 8px minimum
  };

  const openModal = (userName, user_id) => {
    console.log(userName, user_id);
    setSelectedUserIdForChange(user_id);
    console.log(selectedUserIdForChange);
    setIsModalOpen(true);
  };

  // Fonction pour fermer le modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUserIdForChange(null);
  };

  useEffect(() => {
    if (events) {
      setTableEvents(events);
    }
  }, [events]);

  const zeroIndexedMonth = month - 1;

  const filteredHolidays = filterHolidaysForMonth(
    holidays,
    zeroIndexedMonth,
    year
  );

  const getPostName = (postAb) => {
    const postName = posts.find((post) => post.abbreviation == postAb);
    return postName ? postName.name : "Site Inconnu";
  };

  const createTable = (tableEvents, month, year, holidays) => {
    const daysInMonth = getDaysInMonth(month, year);
    const userEventsMap = {};
    const daysOfWeek = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"];
    const userTotalDuration = {};
    const dayTotalDuration = Array.from({ length: daysInMonth }, () => 0);
    let totalMonthlyDuration = 0;

    const handleMouseEnter = (eventId) => {
      setHoveredEventId(eventId); // Set the hovered event's ID
    };

    const handleMouseLeave = () => {
      setHoveredEventId(null); // Clear the hovered event ID immediately
    };

    // Initialisation des données utilisateur

    events.forEach((event) => {
      const user_id = event.user_id;
      userEventsMap[user_id] = Array.from({ length: daysInMonth }, () => []);
      userTotalDuration[user_id] = 0;
    });

    tableEvents.forEach((event) => {
      const {
        user_id,
        userName,
        selected_days,
        vacation_start,
        vacation_end,
        pause_payment,
        pause_start,
        pause_end,
        post,

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
          <>
            <div
              className="text-black font-bold text-center leading-[1.2]"
              style={{ fontSize: `${fontSize}px` }}
            >
              <div>{post}</div>
              <div>{formatTime(vacation_start)}</div>
              <div className={colorClass}>P</div>
              <div>{formatTime(vacation_end)}</div>
            </div>
          </>
        );

        // Inside your event rendering logic
        if (userEventsMap[user_id] && userEventsMap[user_id][2]) {
          userEventsMap[user_id][day - 1].push(
            <div key={event.id}>
              <div
                className="relative flex flex-col mb-0 shadow-sm bg-white"
                onClick={() => handleEditEvent(event)}
                onMouseEnter={() => handleMouseEnter(event.id)} // Déclenche le hover
                onMouseLeave={handleMouseLeave} // Réinitialise le hover
                data-tooltip-target="tooltip-default"
              >
                {cellContent}

                {/* Tooltip */}
                <div
                  id="tooltip-default"
                  role="tooltip"
                  className={`absolute z-50 px-2 py-1 text-white bg-gray-800 rounded-lg shadow-lg transition-all duration-300 ${
                    hoveredEventId === event.id
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  }`}
                  style={{
                    width: "220px", // Largeur fixe du tooltip
                    bottom: "70%", // Position au-dessus de l'élément
                    left: "50%", // Centré horizontalement
                    transform: "translateX(-50%)", // Ajuste le centrage horizontal
                    marginBottom: "8px", // Espace entre l'élément et le tooltip
                  }}
                  aria-hidden={hoveredEventId !== event.id}
                >
                  <div className="text-[10px] text-center leading-tight">
                    {userName}<br /> {new Date(selected_days).toLocaleDateString("fr-CA").split('-').reverse().join('-')}
                    <p>{getPostName(post)}</p>
                    <p>
                      <strong>Début:</strong> {formatTime(vacation_start)}{" "}
                      <strong>Fin:</strong> {formatTime(vacation_end)}
                    </p>
                    <p>
                      <strong>Pause payé:</strong>{" "}
                      {pause_payment === "noBreak"
                        ? "Pas de pause"
                        : pause_payment}
                    </p>
                    {pause_payment !== "noBreak" && (
                      <>
                        <p>
                          <strong>Début:</strong> {formatTime(pause_start)} -{" "}
                          <strong>Fin:</strong> {formatTime(pause_end)}
                        </p>
                        <p></p>
                      </>
                    )}
                    <p className="text-red-400 font-bold  cursor-pointer">
                      Cliquer pour modifier ou supprimer
                    </p>
                  </div>

                  {/* Flèche */}
                  <div
                    className="absolute"
                    style={{
                      top: "100%", // Place la flèche en bas du tooltip
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "0",
                      height: "0",
                      borderStyle: "solid",
                      borderWidth: "5px",
                      borderColor: "gray transparent transparent transparent",
                    }}
                  />
                </div>

                {/* Groupe de boutons Modifier/Supprimer */}
                <div className="flex justify-center space-x-1 mt-0">
                  {!isMultiSelect && (
                    <>
                      {/*}<button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditEvent(event);
                        }}
                        title="Éditer"
                        aria-label="Edit Event"
                        className="text-blue-500 hover:text-blue-700 focus:outline-none transition duration-150 ease-in-out"
                      >
                        <PencilIcon className="w-3 h-3" />
                      </button>{*/}

{/*
}<button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            confirm(
                              "Êtes-vous sûr de vouloir supprimer cet événement ?"
                            )
                          ) {
                            handleDeleteEvent(event);
                          }
                        }}
                        title="Supprimer"
                        aria-label="Delete Event"
                        className="text-red-500 hover:text-red-700 focus:outline-none transition duration-150 ease-in-out"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </button>{*/}
                    </>
                  )}
                </div>

                {/* Case à cocher pour sélection multiple */}
                <div
                  className="flex items-center justify-center mt-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isMultiSelect && (
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(event.id)}
                      onChange={(e) => {
                        toggleSelectEvent(event.id);
                      }}
                      className="form-checkbox mb-1 h-4 w-4 rounded focus:ring-2 focus:ring-red-300 transition-all duration-150 ease-in-out border-2 border-red-600"
                    />
                  )}
                </div>

                {/* Séparateur */}
                <hr className="border-gray-600" />
              </div>

              {/* Checkbox externe */}
              <div className="flex flex-col items-center justify-center mb-0 shadow-sm border border-green-600 rounded-md">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    handleCheckboxChange(e, user_id, selected_days)
                  }
                  className="form-checkbox h-4 w-4 rounded border-green-600 m-1"
                />
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

    // Correcting the holiday set
    const holidaysSet = new Set(
      holidays.map((holiday) => new Date(holiday).getDate())
    );

    const table = [];
    const headers = [
      <div
        key="header-agents"
        className="text-center text-sm text-black font-bold"
      >
        Agents
      </div>,
    ];

    // Boucle pour les jours du mois
    for (let i = 0; i < daysInMonth; i++) {
      const date = new Date(year, month, i + 1);
      const dayOfMonth = i + 1;
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      const isHoliday = holidaysSet.has(dayOfMonth);

      const headerClass = isHoliday
        ? "bg-red-200 text-black"
        : isWeekend
        ? "bg-blue-200"
        : "bg-gray-100";

      headers.push(
        <div
          key={`header-${i}`}
          className={`text-center text-xs  px-1 rounded-md ${headerClass}`}
        >
          <div className="font-medium text-gray-700">
            {daysOfWeek[date.getDay()]}
          </div>
          <div className="font-bold">{dayOfMonth}</div>
        </div>
      );
    }

    // Ajout de la colonne "Total"
    headers.push(
      <div
        key="header-total"
        className="text-center text-xs font-bold text-black px-1 rounded-md"
      >
        Total
      </div>
    );

    table.push(headers);

    // Gardez une trace des utilisateurs ajoutés pour éviter les doublons
    const addedUsers = new Set();

    events.forEach((event) => {
      const user_id = event.user_id;
      const userName = event.userName;

      //console.log("user_id:", user_id, "userName:", userName); // Log to check the values

      if (addedUsers.has(user_id)) {
        return;
      }

      addedUsers.add(user_id);

      const days = userEventsMap[user_id];

      table.push([
        <button
          className="text-blue-700 hover:underline text-sm font-bold"
          onClick={() => openModal(userName, user_id)}
        >
          {userName}
        </button>,
        ...days.map((eventsForDay, index) => {
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
                  <div className="flex flex-col items-center justify-center shadow-xs border border-green-600 rounded-md">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        handleCheckboxChange(e, user_id, selected_days)
                      }
                      className="form-checkbox h-4 w-4 rounded border-green-700 m-1"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        }),
        <p className="text-black text- text-bold">
          {" "}
          {minutesToHoursMinutes(userTotalDuration[user_id] || 0)}
        </p>,
      ]);
    });

    const dayTotalsRow = [
      <h2 className="text-sm py- text-bold text-black">Total par jour</h2>,
      ...dayTotalDuration.map((duration) => minutesToHoursMinutes(duration)),
    ];

    dayTotalsRow.push(minutesToHoursMinutes(totalMonthlyDuration));

    table.push(dayTotalsRow);

    return { table, holidaysSet };
  };

  const { table, holidaysSet } = createTable(
    tableEvents,
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
            checkbox.user_id !== user_id ||
            checkbox.selected_days !== selected_days
        );
      }

      return updatedCheckboxes; // Return the new state
    });
  };

  // Handle supprimer  une vacation par souris
  const handleDeleteEvent = (event) => {
    console.log(event)
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
        const event = tableEvents.find((e) => e.id === eventId);
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
    const eventsToCompare = tableEvents.filter((event) =>
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

  const handleSepareteEvents = () => {
    setTableEvents(events);
  };

  const handleMergeEvents = () => {
    setTableEvents(mergeEvents);
  };

  const handleToggleEvents = () => {
    if (isMerged) {
      handleSepareteEvents(); // Fonction pour défusionner
    } else {
      handleMergeEvents(); // Fonction pour fusionner
    }
    setIsMerged(!isMerged); // Inverse l'état
  };

  const handleChangeUser = (userToReplace, userReplacement, events) => {
    console.log("Utilisateur à remplacer:", userToReplace);
    console.log("Nouvel utilisateur:", userReplacement);

    onChangeEvents(userToReplace, userReplacement);
  };

  return (
    <div className="bg-white border border-gray-600 rounded-md shadow-sm p-1 space-y-1">
      <div className="overflow-x-auto">
        <div className="flex justify-center items-center space-x-2 p-3 bg-gray-50 rounded-md shadow-sm">
          <button
            onClick={handleToggleEvents}
            className={`merge-button text-white text-xs px-2 py-1 rounded-md shadow transition duration-200 ${
              isMerged
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isMerged ? "Défusionner les vacations" : "Fusionner les vacations"}
          </button>

          <div className="flex items-center space-x-1 border ">
            {/* Bouton Ajouter */}
            <button
              onClick={increaseFontSize}
              className="py-2 px-3 text-black border rounded-md hover:bg-green-700  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors text-xs font-semibold"
              aria-label="Ajouter un agent anonyme"
            >
              +
            </button>

            {/* Texte Description */}
            <p className="text-xs font-bold text-black ">caractére</p>

            {/* Bouton Supprimer */}
            <button
              onClick={decreaseFontSize}
              className="py-2 px-3 text-black border rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors text-xs font-semibold"
              aria-label="Supprimer un agent anonyme"
            >
              -
            </button>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-600 border-collapse border border-gray-600">
          <thead className="bg-gray-150">
            <tr>
              {table[0] &&
                table[0].map((header, index) => (
                  <th
                    key={index}
                    className="border-r border-gray-600 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide"
                  >
                    {header || "-"} {/* Ensure header is not undefined */}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-600">
            {table.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-blue-200">
                {row.map((cell, cellIndex) => {
                  const day = cellIndex; // Correct the day number to match the table day (1-indexed)
                  const isWeekend =
                    day > 0 &&
                    day <= table[0].length - 2 &&
                    (new Date(year, zeroIndexedMonth, day).getDay() === 0 ||
                      new Date(year, zeroIndexedMonth, day).getDay() === 6);
                        const isHoliday = holidaysSet.has(day);
                        
                  return (
                    <td
                      key={`cell-${rowIndex}-${cellIndex}`}
                      className={`border-r border-gray-600 text-center text-xs font-medium ${
                        isWeekend ? "bg-blue-200" : ""
                      } ${
                        isHoliday ? "bg-red-200 text-gray" : "text-gray-900"
                      }`}
                    >
                      {cell || "-"} {/* Ensure cell is not undefined */}
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
          <div className="w-4 h-4 bg-blue-200 border border-gray-600 rounded-full"></div>
          <span className="text-gray-800">Week-end</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-red-200 border border-gray-600 rounded-full"></div>
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
        {events.length > 0 && (
          <button
            onClick={handleShowMultiSelect}
            className="bg-gray-600 text-white px-1 text-xs font-medium rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out transform hover:scale-105"
            aria-label="Activer la sélection multiple"
          >
            <span className="mr-0 text-lg" role="img" aria-label="Clipboard">
              📋
            </span>
            Multi Select
          </button>
        )}

        {isMultiSelect && (
          <>
            <button
              onClick={handleDeleteSelectedEvents}
              className="bg-red-500 text-white px-1 py-1 text-xs font-bold rounded-md shadow-sm hover:bg-red-700 transition-colors duration-150"
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
          className="bg-green-700 text-white px-2 py-1 text-xs font-medium rounded-md shadow-sm hover:bg-green-700 transition-colors duration-150"
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
        //localPosts={localPosts}
        posts={posts}
        typePosts={typePosts}
        createMode={createMode}
        isMultiEditMode={isMultiEditMode}
        modalData={modalData}
        eventsToEditId={eventsToEditId}
        selectedCheckboxes={selectedCheckboxes}
        onDelete={handleDeleteEvent}
      />
      {isModalOpen && selectedUserIdForChange && (
        <ChangeUserEvents
          selectedUserIdForChange={selectedUserIdForChange}
          closeModal={closeModal}
          AllUsers={AllUsers}
          onChangeUser={handleChangeUser}
        />
      )}
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
  tableEvents: PropTypes.arrayOf(
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
  //localPosts: PropTypes.array.isRequired, // Ajoutez cette ligne si localPosts est requis
  typePosts: PropTypes.array.isRequired, // Ajoutez cette ligne si typePosts est requis
};

export default TableComponent;
