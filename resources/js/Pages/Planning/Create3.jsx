import React, { useState, useMemo, useEffect } from "react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import Table from "./Table3";
import Alert from "./Alert";

import { Inertia } from "@inertiajs/inertia";
import { Head } from "@inertiajs/react";
import NavBar from "./import/NavBar";
import SelectSite from "./import/SelectSite";
import SelectMonth from "./import/SelectMonth";
import SelectYear from "./import/SelectYear";
import PlanningHeader from "./import/PlanningHeader";
import DaysPostsVacationSelect from "./DaysPostsVacationSelect";
import AddUserToSiteModal from "./Modal/AddUserToSiteModal";

import {
  createVacationEvents,
  getSundays,
  checkVacationsAndWeeklyHours,
  validateSelections,
  compareEvents,
} from "./CreatFunction2"; // Importer les utilitaires

const CreatePlanning = ({
  typePosts = [],
  posts = [],
  sites = [],
  users = [],
  holidays = [],
  plannings = [],
  selectedPlanning = [],
  isShow,
}) => {
  console.log(holidays);
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedSite, setSelectedSite] = useState("");
  const [currentMonth, setCurrentMonth] = useState();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [events, setEvents] = useState(selectedPlanning?.[0]?.events || []);
  const [eventsNextMonth, setEventsNextMonth] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [siteUsers, setSiteUsers] = useState([]);
  const [localSiteUsers, setLocalSiteUsers] = useState([]);

  //const [isCollapsed, setIsCollapsed] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(selectedSite);

  // Fonction pour ouvrir le modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Fonction pour fermer le modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (selectedSite) {
      const updateSiteUsers =
        sites.find((site) => site.id == selectedSite).users || [];
      setSiteUsers(updateSiteUsers);
      setLocalSiteUsers(updateSiteUsers);
    }
  }, [selectedSite, users]);

  console.log(siteUsers);
  console.log(localSiteUsers);

  useEffect(() => {
    if (selectedPlanning && selectedPlanning[0]) {
      setEvents(selectedPlanning[0].events || []);
      setCurrentMonth(selectedPlanning[0].month);
      setSelectedSite(selectedPlanning[0].site_id);
      setIsFormVisible(true);
    }
  }, [selectedPlanning]);

  const yearOptions = useMemo(
    () =>
      Array.from({ length: 60 }, (_, index) => ({
        value: new Date().getFullYear() - 0 + index,
        label: new Date().getFullYear() - 0 + index,
      })),
    []
  );

  useEffect(() => {
    if (selectedSite !== undefined) {
    }
  }, [selectedSite]);

  const resetForm = () => {
    setSelectedUsers([]);
    setVacationStart("");
    setVacationEnd("");
    setPauseStart("");
    setPauseEnd("");
    setPausePayment("noBreak");
    setSelectedPost("");
    setSelectedTypePost("");
    setLunchAllowance(0);
    setSelectedDays([]);
    setResetCalendar(true);
    setTimeout(() => setResetCalendar(false), 0);
  };

  const handleSiteChange = (selectedOption) => {
    setSelectedSite(selectedOption);
    //setSiteUsers(selectedOption ? selectedOption.users : []);
  };
  const handleUserChange = (selectedOptions) => {
    // Log the selected options
    setSelectedUsers(selectedOptions || []); // Set the state to the selected options, or an empty array if none
  };

  const handleMonthChange = (selectedMonth) => {
    setCurrentMonth(selectedMonth);
  };

  const handleYearChange = (selectedOption) =>
    setCurrentYear(selectedOption.value);

  const validateSelectionCreateEvent = () => {
    const validations = [
      {
        condition: selectedUsers.length === 0,
        msg: "Veuillez sélectionner au moins un utilisateur.",
      },
      { condition: !selectedPost, msg: "Veuillez sélectionner un poste." },
      {
        condition: !vacation_start || !vacation_end,
        msg: "Veuillez fournir les horaires de début et de fin des vacation(s).",
      },
      {
        condition: pause_payment === "non" && (!pause_start || !pause_end),
        msg: "Veuillez fournir les horaires de début et de fin de la pause",
      },
      {
        condition: selected_days.length === 0,
        msg: "Veuillez sélectionner au moins un jour.",
      },
    ];

    for (const { condition, msg } of validations) {
      if (condition) {
        setAlertMessage([msg]);
        return false;
      }
    }

    return true;
  };

  const handleCreateClick = () => {
    const verifValidateSelections = validateSelections(
      selectedSite,
      currentMonth
    );

    // Vérifier les sélections avant de continuer
    if (verifValidateSelections.isValid) {
      try {
        // Vérifier si un planning existe déjà pour le mois, l'année et le site sélectionnés
        const planningExists = plannings.find(
          (planning) =>
            planning.month == currentMonth &&
            parseInt(planning.year, 10) == currentYear &&
            planning.site_id == selectedSite
        );

        if (planningExists) {
          const userChoice = window.confirm(
            "Un planning a déjà été créé pour le site, le mois et l'année sélectionnés. Voulez-vous le voir maintenant ?"
          );

          if (userChoice) {
            // Rediriger vers la route du planning existant si l'utilisateur choisit de le voir
            const planningIds = [planningExists.id];
            console.log(planningExists.id);
            Inertia.visit(route("plannings.show", planningIds), {
              method: "get",
              data: { planningIds },
            });
          } else {
            // Afficher le formulaire pour créer un nouveau planning
            setIsFormVisible(false);
          }
        } else {
          // Aucun planning existant, afficher le formulaire
          setIsFormVisible(true);
          setIsButtonVisible(false);
          setIsDisabled(true);
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour des événements:", error);
        setAlertMessage(
          "Une erreur est survenue lors de la création du planning."
        );
      }
    }
    setAlertMessage([verifValidateSelections.message]);
  };

  // Fonction principale pour créer des événements pour les utilisateurs
  const createEventsForUsers = () => {
    // Valider les champs nécessaires avant de créer des événements
    if (!validateSelectionCreateEvent()) {
      return;
    }

    // Dernier ID utilisé
    const maxExistingId =
      events.length > 0 ? Math.max(...events.map((event) => event.id)) : 0;
    let lastId = maxExistingId === 0 ? 1 : maxExistingId + 1;

    // Variables pour stocker les événements traités pour ce mois et le mois suivant
    let vacationEventsProcessed = [];
    let vacationEventsNextMonthProcessed = [];

    // Créer de nouveaux événements pour chaque utilisateur et chaque jour sélectionné
    selectedUsers.forEach((user) => {
      selected_days.forEach((date) => {
        const vacationAllEvents = createVacationEvents(
          vacation_start,
          vacation_end,
          date,
          pause_start,
          pause_end,
          pause_payment,
          currentMonth,
          currentYear,
          holidays
        );

        const vacationEvents = vacationAllEvents.events;
        const vacationEventsNextMonth = vacationAllEvents.eventsNextMonth;

        // Process vacationEvents
        vacationEvents.forEach((vacationEvent) => {
          const currentId = ++lastId;

          vacationEventsProcessed.push({
            id: currentId,
            user_id: user, // User ID for this event
            post: selectedPost,
            typePost: selectedTypePost,
            vacation_start: vacationEvent.vacation_start,
            vacation_end: vacationEvent.vacation_end,
            lunchAllowance: vacationEvent.lunchAllowance || 0, // Meal allowance
            pause_payment: vacationEvent.pause_payment,
            pause_start: vacationEvent.pause_start || "",
            pause_end: vacationEvent.pause_end || "",
            selected_days: vacationEvent.selectedDays, // Specific date for this event
            work_duration: vacationEvent.work_duration, // Adjusted work duration
            night_hours: vacationEvent.night_hours, // Calculated night hours
            holiday_hours: vacationEvent.holiday_hours, // Holiday hours
            sunday_hours: vacationEvent.sunday_hours, // Sunday hours
            isSubEvent: vacationEvent.isSubEvent,
            relatedEvent: vacationEvent.relatedEvent,
          });
        });

        // Process vacationEventsNextMonth
        vacationEventsNextMonth.forEach((vacationEvent) => {
          const currentId = ++lastId;

          vacationEventsNextMonthProcessed.push({
            id: currentId,
            user_id: user, // User ID for this event
            post: selectedPost,
            typePost: selectedTypePost,
            vacation_start: vacationEvent.vacation_start,
            vacation_end: vacationEvent.vacation_end,
            lunchAllowance: vacationEvent.lunchAllowance || 0, // Meal allowance
            pause_payment: vacationEvent.pause_payment,
            pause_start: vacationEvent.pause_start || "",
            pause_end: vacationEvent.pause_end || "",
            selected_days: vacationEvent.selectedDays, // Specific date for this event
            work_duration: vacationEvent.work_duration, // Adjusted work duration
            night_hours: vacationEvent.night_hours, // Calculated night hours
            holiday_hours: vacationEvent.holiday_hours, // Holiday hours
            sunday_hours: vacationEvent.sunday_hours, // Sunday hours
            isSubEvent: vacationEvent.isSubEvent,
            relatedEvent: vacationEvent.relatedEvent,
          });
        });
      });
    });

    // Vérifier les heures hebdomadaires et autres validations
    const checkWeeklyHoursVerif = checkVacationsAndWeeklyHours(
      events,
      vacationEventsProcessed.concat(vacationEventsNextMonthProcessed),
      currentMonth,
      currentYear,
      users
    );

    if (checkWeeklyHoursVerif.isError === true) {
      setAlertMessage(checkWeeklyHoursVerif.alerts);
      setErrorMessage(checkWeeklyHoursVerif.errors);
    } else {
      // Mettre à jour les événements existants en ajoutant les nouveaux événements traités
      setEvents((prevEvents) => [...prevEvents, ...vacationEventsProcessed]);
      setEventsNextMonth((prevEvents) => [
        ...prevEvents,
        ...vacationEventsNextMonthProcessed,
      ]);

      // Réinitialiser le formulaire après la création des événements
      resetForm();

      // Afficher un message de succès
      let msg = "Vacation(s) créé(s) avec succès !";
      setSuccessMessage([msg]);
    }
  };

  // Fonction principale pour créer des événements pour les utilisateurs PAR SOURIS
  const createEventsFromAddEvent = (addEvent) => {
    console.log;
    // Dernier ID utilisé
    const maxExistingId =
      events.length > 0 ? Math.max(...events.map((event) => event.id)) : 0;
    let lastId = maxExistingId === 0 ? 1 : maxExistingId + 1;

    // Créer un ensemble des dates de jours fériés pour des recherches rapides
    const holidayDates = new Set(holidays.map((holiday) => holiday.date));

    let vacationEventsProcessed = [];
    let vacationEventsNextMonthProcessed = [];

    const newEvents = (addEvent.selectedUsersDays || [])
      .flatMap(({ user_id, selected_days }) => {
        return (
          Array.isArray(selected_days) ? selected_days : [selected_days]
        ).flatMap((date) => {
          const vacationAllEvents = createVacationEvents(
            addEvent.vacation_start,
            addEvent.vacation_end,
            date,
            addEvent.pause_start,
            addEvent.pause_end,
            addEvent.pause_payment,
            currentMonth,
            currentYear,
            holidayDates
          );

          const vacationEvents = vacationAllEvents.events;
          const vacationEventsNextMonth = vacationAllEvents.eventsNextMonth;
          console.log(vacationEvents);

          // Process vacationEvents
          vacationEvents.forEach((vacationEvent) => {
            const currentId = ++lastId;

            vacationEventsProcessed.push({
              id: currentId,
              user_id: user_id, // User ID for this event
              post: selectedPost,
              typePost: selectedTypePost,
              vacation_start: vacationEvent.vacation_start,
              vacation_end: vacationEvent.vacation_end,
              lunchAllowance: vacationEvent.lunchAllowance || 0, // Meal allowance
              pause_payment: vacationEvent.pause_payment,
              pause_start: vacationEvent.pause_start || "",
              pause_end: vacationEvent.pause_end || "",
              selected_days: vacationEvent.selectedDays, // Specific date for this event
              work_duration: vacationEvent.work_duration, // Adjusted work duration
              night_hours: vacationEvent.night_hours, // Calculated night hours
              holiday_hours: vacationEvent.holiday_hours, // Holiday hours
              sunday_hours: vacationEvent.sunday_hours, // Sunday hours
              isSubEvent: vacationEvent.isSubEvent,
              relatedEvent: vacationEvent.relatedEvent,
            });
          });

          // Process vacationEventsNextMonth
          vacationEventsNextMonth.forEach((vacationEvent) => {
            const currentId = ++lastId;

            vacationEventsNextMonthProcessed.push({
              id: currentId,
              user_id: user_id, // User ID for this event
              post: selectedPost,
              typePost: selectedTypePost,
              vacation_start: vacationEvent.vacation_start,
              vacation_end: vacationEvent.vacation_end,
              lunchAllowance: vacationEvent.lunchAllowance || 0, // Meal allowance
              pause_payment: vacationEvent.pause_payment,
              pause_start: vacationEvent.pause_start || "",
              pause_end: vacationEvent.pause_end || "",
              selected_days: vacationEvent.selectedDays, // Specific date for this event
              work_duration: vacationEvent.work_duration, // Adjusted work duration
              night_hours: vacationEvent.night_hours, // Calculated night hours
              holiday_hours: vacationEvent.holiday_hours, // Holiday hours
              sunday_hours: vacationEvent.sunday_hours, // Sunday hours
              isSubEvent: vacationEvent.isSubEvent,
              relatedEvent: vacationEvent.relatedEvent,
            });
          });
        });
      })
      .flat();

    /* const checkWeeklyHoursVerif = checkVacationsAndWeeklyHours(
        events,
        newEvents,
        currentMonth,
        currentYear,
        selectedUsers
      );
  
      if (checkWeeklyHoursVerif.isError === true) {
        setAlertMessage(checkWeeklyHoursVerif.alerts);
        setErrorMessage(checkWeeklyHoursVerif.errors);
      } else {
        // Mettre à jour les événements existants en ajoutant les nouveaux événements traités
        setEvents((prevEvents) => [...prevEvents, ...vacationEventsProcessed]);
        setEventsNextMonth((prevEvents) => [
          ...prevEvents,
          ...vacationEventsNextMonthProcessed,
        ]);*/

    setEvents((prevEvents) => [...prevEvents, ...vacationEventsProcessed]);
    setEventsNextMonth((prevEvents) => [
      ...prevEvents,
      ...vacationEventsNextMonthProcessed,
    ]);
    // Réinitialiser le formulaire après la création des événements
    resetForm();

    // Afficher un message de succès
    let msg = "Vacation(s) créé(s) avec succès !";
    setSuccessMessage([msg]);
  };

  //modification vacation
  const handleEditEvent = (updatedEvent) => {
    // Créer un ensemble des dates de jours fériés pour des recherches rapides
    const holidayDates = new Set(holidays.map((holiday) => holiday.date));

    // Obtenir les dimanches du mois en format YYYY-MM-DD
    const sundays = getSundays(currentMonth, currentYear).map(
      (date) => date.toISOString().split("T")[0]
    );

    // Filter existing events with the same IDs as the updated event
    const filteredEvents = events.filter((event) =>
      updatedEvent.id.includes(event.id)
    );

    const filtredId = filteredEvents.map((event) => event.id);
    const selectedDays = filteredEvents.map((event) => event.selected_days);
    const user = filteredEvents.map((event) => event.user_id);

    // Create events to handle cases where the event spans midnight
    const vacationEvents = createVacationEvents(
      updatedEvent.vacation_start,
      updatedEvent.vacation_end,
      selectedDays,
      updatedEvent.pause_start,
      updatedEvent.pause_end,
      updatedEvent.pause_payment
    );
    // Initialize updated events based on existing events
    let updatedEvents = [...events];

    // If the vacation events length matches filtered events, update each event's details
    if (vacationEvents.length === filteredEvents.length) {
      updatedEvents = updatedEvents.map((event) => {
        if (filtredId.includes(event.id)) {
          const workDurations = vacationEvents.map(
            (vacationEvent) => vacationEvent.work_duration
          );
          const workDuration = workDurations[0];

          return {
            ...event,
            pause_start: updatedEvent.pause_start,
            pause_end: updatedEvent.pause_end,
            pause_payment: updatedEvent.pause_payment,
            post: updatedEvent.post,
            typePost: updatedEvent.typePost,
            vacation_start: updatedEvent.vacation_start,
            vacation_end: updatedEvent.vacation_end,
            work_duration: workDuration,
          };
        }
        return event;
      });
      setEvents(updatedEvents);
    } else if (vacationEvents.length > filteredEvents.length) {
      const filteredEventsIds = filteredEvents.map((event) => event.id);
      const post = filteredEvents.map((event) => event.post);
      const typePost = filteredEvents.map((event) => event.typePost);

      // Extract user_ids from filteredEvents (it can be an array with one or more user IDs)
      const user_ids = [
        ...new Set(filteredEvents.map((event) => event.user_id)),
      ]; // Use Set to ensure unique user_ids

      // Filtrer les événements à supprimer (deleteEvents)
      const afterdeleteEvents = events.filter(
        (event) => !filteredEventsIds.includes(event.id)
      );

      // Group vacation events by relatedEvent
      const vacationEventsByRelatedEvent = vacationEvents.reduce(
        (acc, vacationEvent) => {
          const relatedEvent = vacationEvent.relatedEvent;
          if (!acc[relatedEvent]) {
            acc[relatedEvent] = [];
          }
          acc[relatedEvent].push(vacationEvent);
          return acc;
        },
        {}
      );

      // Initialize the list of new vacation events
      let newVacationEvents = [];

      // Process each group of vacation events by relatedEvent
      Object.keys(vacationEventsByRelatedEvent).forEach((relatedEvent) => {
        const vacationEventsGroup = vacationEventsByRelatedEvent[relatedEvent];

        // Calculate the max existing ID once for all new events
        const maxExistingId =
          events.length > 0 ? Math.max(...events.map((event) => event.id)) : 0;
        let lastId = maxExistingId === 0 ? 1 : maxExistingId + 1;

        // Iterate over each vacation event in the group
        vacationEventsGroup.forEach((vacationEvent) => {
          // Ensure selectedDays is an array (in case it's a single string)
          const selectedDaysArray = Array.isArray(vacationEvent.selectedDays)
            ? vacationEvent.selectedDays
            : [vacationEvent.selectedDays];

          // Generate the new vacation events for each selected day and user_id
          selectedDaysArray.forEach((selectedDay) => {
            user_ids.forEach((currentUserId) => {
              // Determine if the selected day is a holiday or Sunday
              const isHoliday = holidayDates.has(selectedDay);
              const isSunday = sundays.includes(selectedDay);

              // Create a new event for each selected day and user
              newVacationEvents.push({
                id: lastId++, // Increment the ID for each new event
                user_id: currentUserId, // Assign the correct user_id
                post: post[0], // Use the post from filteredEvents
                typePost: typePost[0], // Use the typePost from filteredEvents
                vacation_start: vacationEvent.vacation_start,
                vacation_end: vacationEvent.vacation_end,
                lunchAllowance: vacationEvent.lunchAllowance,
                pause_payment: vacationEvent.pause_payment,
                pause_start: vacationEvent.pause_start,
                pause_end: vacationEvent.pause_end,
                selected_days: selectedDay, // Assign the specific selectedDay
                work_duration: vacationEvent.work_duration,
                night_hours: vacationEvent.night_hours,
                holiday_hours: isHoliday ? vacationEvent.work_duration : "0:00",
                sunday_hours: isSunday ? vacationEvent.work_duration : "0:00",
                isSubEvent: vacationEvent.isSubEvent,
                relatedEvent: relatedEvent, // Correctly set the relatedEvent
              });
            });
          });
        });
      });

      // Combine delete events and new vacation events to get the updated events
      const updatedEvents = [
        ...afterdeleteEvents, // Add the events that need to be deleted
        ...newVacationEvents, // Add the new vacation events
      ];

      setEvents(updatedEvents);
    }
  };

  //supprimer les vacation
  const handleDeleteEvent = (eventToDelete) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventToDelete.id)
    );
  };

  //sauvgarde du planning
  const handleSavePlanning = () => {
    Inertia.post(route("plannings.store"), {
      site: selectedSite,
      month: currentMonth, // Convert to 1-based month
      year: currentYear,
      events: events,
      eventsNextMonth: eventsNextMonth,
    });
  };

  return (
    <AdminAuthenticatedLayout>
      <Head title="Cretion planning" />
      <NavBar />
      <div className="container mx-auto p-4 space-y-4">
        {/* Alert Message */}
        {(alertMessage || successMessage || errorMessage) && (
          <Alert
            messageAlert={alertMessage}
            messageError={errorMessage}
            messageSuccess={successMessage}
            onClose={() => {
              setAlertMessage("");
              setErrorMessage("");
              setSuccessMessage("");
            }}
          />
        )}

        {isShow || !isButtonVisible ? (
          // Conteneur principal pour aligner les éléments en colonne
          <PlanningHeader
            selectedSite={selectedSite}
            currentMonth={currentMonth}
            currentYear={currentYear}
            sites={sites}
          />
        ) : (
          // Section Select
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-4 sm:items-center sm:justify-between">
            <SelectSite
              siteOptions={sites}
              handleSiteChange={handleSiteChange}
              isDisabled={isDisabled}
            />
            <SelectMonth
              currentMonth={currentMonth}
              handleMonthChange={handleMonthChange}
              isDisabled={isDisabled}
            />
            <SelectYear
              yearOptions={yearOptions}
              currentYear={currentYear}
              handleYearChange={handleYearChange}
              isDisabled={isDisabled}
            />
            {isButtonVisible && (
              <button
                onClick={handleCreateClick}
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-semibold"
              >
                Créer
              </button>
            )}
          </div>
        )}

        {isFormVisible && (
          <>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors text-xs font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              aria-label="Ajouter des agents"
            >
              <span className="mr-2">👥</span> Gestion des agents
            </button>
            <button
              onClick={openModal}
              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Ajouter une /des vacation(s)
            </button>

            {isModalOpen && (
              <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-1 w-[1000px] relative">
                  <DaysPostsVacationSelect
                    onClose={closeModal}
                    selectedSite={selectedSite}
                    sites={sites}
                    posts={posts}
                    typePosts={typePosts}
                    holidays={holidays}
                    month={currentMonth}
                    year={currentYear}
                    users={users}
                    siteUsers={localSiteUsers}
                    onAddNewUser={setSiteUsers}
                  />

                  <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                  >
                    ❌
                  </button>
                </div>
              </div>
            )}
            <div className="mt-4">
              <Table
                month={Number(currentMonth)}
                year={currentYear}
                holidays={holidays}
                events={events}
                selectedSite={selectedSite}
                //selected_days={selectedDays}
                typePosts={typePosts}
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEvent}
                onCreateEvent={createEventsFromAddEvent}
                AllUsers={users}
                siteUsers={localSiteUsers}
              />
            </div>

            <AddUserToSiteModal
              isOpen={showAddUserModal}
              onClose={() => setShowAddUserModal(false)}
              onAddUser={setLocalSiteUsers}
              selectedSite={selectedSite}
              users={users}
              siteUsers={siteUsers}
              sites={sites}
              localSiteUsers={localSiteUsers}
            />
            <div className="flex justify-center">
              {events.length !== 0 && (
                <button
                  onClick={handleSavePlanning}
                  className={`ml-6 py-2 px-3 bg-blue-600 text-white rounded-md ${
                    events.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  } text-sm font-semibold`}
                  aria-label="Sauvegarder le planning"
                  disabled={events.length === 0} // Disable the button when no events
                >
                  Sauvegarder
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </AdminAuthenticatedLayout>
  );
};

export default CreatePlanning;
