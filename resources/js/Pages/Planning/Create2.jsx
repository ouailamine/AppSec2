import React, { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import Calendar from "./Calendar";
import Calendarr from "./Calendar2";
import Table from "./Table3";
import Alert from "./Alert";
import { fr } from "date-fns/locale";
import PostTypeModal from "./AddTypePostModal2";
import HolidayModal from "./AddHolidayModal2";
import AddUserModal from "./AddUserToSiteModal2";
import { Inertia } from "@inertiajs/inertia";
import { Head } from "@inertiajs/react";
import NavBar from "./import/NavBar";
import SelectSite from "./import/SelectSite";
import SelectMonth from "./import/SelectMonth";
import SelectYear from "./import/SelectYear";
import PosteSection from "./import/PosteSection";
import HorairesSection from "./import/HorairesSection";
import PauseSection from "./import/PauseSection";
import PlanningHeader from "./import/PlanningHeader";
import UserSelect from "./import/UserSelect";
import {
  createVacationEvents,
  getSundays,
  checkVacationsAndWeeklyHours,
  validateSelections,
} from "./CreatFunction2"; // Importer les utilitaires
const CreatePlanning = ({
  typePosts = [],
  posts = [],
  sites = [],
  users = [],
  holidays = [],
  plannings = [],
  selectedPlanning=[],
  isShow,
}) => {

  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [vacation_start, setVacationStart] = useState("");
  const [vacation_end, setVacationEnd] = useState("");
  const [lunchAllowance, setLunchAllowance] = useState("");
  const [pause_start, setPauseStart] = useState("");
  const [pause_end, setPauseEnd] = useState("");
  const [pause_payment, setPausePayment] = useState("noBreak");
  const [selectedPost, setSelectedPost] = useState("");
  const [selectedTypePost, setSelectedTypePost] = useState("");
  const [selected_days, setSelectedDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [events, setEvents] = useState(selectedPlanning?.[0]?.events || []);
  const [resetCalendar, setResetCalendar] = useState(false);
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [showAddHolidayModal, setShowAddHolidayModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [localPosts, setLocalPosts] = useState(posts);
  const [listPosts, setListPosts] = useState();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [siteUsers, setSiteUsers] = useState([]);
 

  useEffect(() => {
    if (selectedPlanning && selectedPlanning[0]) {
      setEvents(selectedPlanning[0].events || []);
      setCurrentMonth(selectedPlanning[0].month);
      setSelectedSite(selectedPlanning[0].site_id);
      setIsFormVisible(true);
    }
  }, [selectedPlanning]);
  

 console.log(selectedPlanning)





  const yearOptions = useMemo(
    () =>
      Array.from({ length: 60 }, (_, index) => ({
        value: new Date().getFullYear() - 0 + index,
        label: new Date().getFullYear() - 0 + index,
      })),
    []
  );

  console.log('selectedUsers',selectedUsers)
  console.log('siteUsers',siteUsers)
  console.log('selected_days',selected_days)

  console.log(selectedSite);


  useEffect(() => {
    if (selectedTypePost) {
      const filteredPosts = localPosts.filter(
        (post) => post.type_post_id == parseInt(selectedTypePost)
      );
      // Met à jour localPosts avec les postes filtrés
      setListPosts(filteredPosts);
    } else {
      // Réinitialise localPosts lorsque aucun type n'est sélectionné
      setListPosts(localPosts);
    }
  }, [selectedTypePost, posts]); // Ajoute 'posts' à la liste des dépendances si nécessaire

 console.log('selectedSite',selectedSite)
  
 useEffect(() => {
    if (selectedSite) {
    
      setSiteUsers(sites.find((site) => site.id == selectedSite).users || []);
    }
  }, [selectedSite,users]);

  

  useEffect(() => {
    if (selectedSite !== undefined) {
    }
  }, [selectedSite]);



  // Add users for site
  const handleAddSiteUsers = (updatedUsers) => {
    setSiteUsers(updatedUsers);
  };

  // Add post type
  const handleAddPost = (post) => {
    console.log(post);
    // console.log(post);
    //setLocalPosts((prev) => [...prev, { id: Date.now(), ...post }]);
    //console.log(localPosts);
  };

  // Add holiday
  const handleAddHoliday = (holiday) => {
    holidays.push(holiday); // Local addition, ideally you'd also update your server
  };

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
    setSiteUsers(selectedOption ? selectedOption.users : []);
  };
  const handleUserChange = (selectedOptions) => {
    console.log('selectedOptions',selectedOptions); 
    
    // Log the selected options
    setSelectedUsers(selectedOptions|| []); // Set the state to the selected options, or an empty array if none
};
  
  
  
  const handlePostChange = (e) => setSelectedPost(e.target.value);
  const handleTypePostChange = (event) => {
    setSelectedTypePost(event.target.value);
  };

  const handlePauseChange = (type) => (e) => {
    const value = e.target.value;
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
        const planningExists = plannings.some(
          (planning) =>
            planning.month === currentMonth  &&
            parseInt(planning.year, 10) === currentYear &&
            planning.site_id === selectedSite.value
        );

        if (planningExists) {
          // Trouver le planning existant pour obtenir son ID
          const existingPlanning = plannings.find(
            (planning) =>
              planning.month === currentMonth  &&
              parseInt(planning.year, 10) === currentYear &&
              planning.site_id === selectedSite.id
          );

          if (existingPlanning) {
            // Afficher une boîte de dialogue de confirmation
            const userChoice = window.confirm(
              "Un planning a déjà été créé pour le site, le mois et l'année sélectionnés. Voulez-vous le voir maintenant ?"
            );

            if (userChoice) {
              // Rediriger vers la route du planning existant si l'utilisateur choisit de le voir
              const planningIds = [existingPlanning.id];
              Inertia.visit(route("plannings.show", planningIds), {
                method: "get",
                data: { planningIds },
              });
            } else {
              // Afficher le formulaire pour créer un nouveau planning
              setIsFormVisible(false);
            }
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

    // Créer un ensemble des dates de jours fériés pour des recherches rapides
    const holidayDates = new Set(holidays.map((holiday) => holiday.date));

    // Obtenir les dimanches du mois en format YYYY-MM-DD
    const sundays = getSundays(currentMonth, currentYear).map(
      (date) => date.toISOString().split("T")[0]
    );

    // Créer de nouveaux événements pour chaque utilisateur et chaque jour sélectionné
    // Créer les événements pour gérer le cas où la vacation traverse minuit
    const newEvents = selectedUsers.flatMap((user) => {
      return selected_days.flatMap((date) => {
        const vacationEvents = createVacationEvents(
          vacation_start,
          vacation_end,
          date,
          pause_start,
          pause_end,
          pause_payment
        );
    
        console.log(vacationEvents);
    
        return vacationEvents.map((vacationEvent) => {
          // Incrémenter le dernier ID
          const currentId = ++lastId;
    
          // Calculer si la date est un jour férié ou un dimanche
          const isHoliday = holidayDates.has(date);
          const isSunday = sundays.includes(date);
    
          // Retourner un objet événement pour chaque combinaison utilisateur/date
          return {
            id: currentId,
            user_id: user, // ID utilisateur pour cet événement
            post: selectedPost,
            typePost: selectedTypePost,
            vacation_start: vacationEvent.vacation_start,
            vacation_end: vacationEvent.vacation_end,
            lunchAllowance: vacationEvent.lunchAllowance || 0, // Allocation repas
            pause_payment: vacationEvent.pause_payment,
            pause_start: vacationEvent.pause_start || "",
            pause_end: vacationEvent.pause_end || "",
            selected_days: date, // Date spécifique pour cet événement
            work_duration: vacationEvent.work_duration, // Durée de travail ajustée
            night_hours: vacationEvent.night_hours, // Heures de nuit calculées
            holiday_hours: isHoliday ? vacationEvent.work_duration : 0, // Heures fériées
            sunday_hours: isSunday ? vacationEvent.work_duration : 0, // Heures du dimanche
            isSubEvent: vacationEvent.isSubEvent,
            relatedEvent: vacationEvent.relatedEvent,
          };
        });
      });
    }).flat();
    
    

      console.log('events',events)
    const checkWeeklyHoursVerif = checkVacationsAndWeeklyHours(
      events,
      newEvents,
      currentMonth,
      currentYear,
      users
    );

    console.log(checkWeeklyHoursVerif);

    if (checkWeeklyHoursVerif.isError === true) {
      setAlertMessage(checkWeeklyHoursVerif.alerts);
      setErrorMessage(checkWeeklyHoursVerif.errors);
    } else {
      // Mettre à jour les événements existants en ajoutant les nouveaux
      setEvents((prevEvents) => [...prevEvents, ...newEvents]);

      // Réinitialiser le formulaire après la création des événements
      resetForm();

      // Afficher un message de succès
      let msg = "Vacation(s) créé(s) avec succès !";
      setSuccessMessage([msg]);
    }
  };







  // Fonction principale pour créer des événements pour les utilisateurs PAR SOURIS
  const createEventsFromAddEvent = (addEvent) => {
    const vacationStart = addEvent.vacation_start;
    const vacationEnd = addEvent.vacation_end;
    const pauseStart = addEvent.pause_start;
    const pauseEnd = addEvent.pause_end;
    const pausePayment = addEvent.pause_payment;
    const selectedDays = addEvent.selected_day;
    const user = addEvent.user_id;
    // Dernier ID utilisé
    const maxExistingId =
      events.length > 0 ? Math.max(...events.map((event) => event.id)) : 0;
    let lastId = maxExistingId === 0 ? 1 : maxExistingId + 1;

    // Créer un ensemble des dates de jours fériés pour des recherches rapides
    const holidayDates = new Set(holidays.map((holiday) => holiday.date));

    // Obtenir les dimanches du mois en format YYYY-MM-DD
    const sundays = getSundays(currentMonth , currentYear).map(
      (date) => date.toISOString().split("T")[0]
    );

    // Créer de nouveaux événements pour l'utilisateur et chaque jour sélectionné
    const newEvents = selectedUsers
  .flatMap((user) =>
    selected_days.flatMap((date) => {
      const vacationEvents = createVacationEvents(
        vacation_start,
        vacation_end,
        date,
        pause_start,
        pause_end,
        pause_payment
      );

      console.log(vacationEvents);

      return vacationEvents.map((vacationEvent) => {
        // Incrémenter le dernier ID
        const currentId = ++lastId;

        // Calculer la durée de travail ajustée pour chaque événement

        // Déterminer si la date est un jour férié ou un dimanche
        const isHoliday = holidayDates.has(vacationEvent.selectedDays);
        const isSunday = sundays.includes(vacationEvent.selectedDays);

        // Retourner un objet événement pour chaque combinaison utilisateur/date
        return {
          id: currentId,
          user_id: user, // ID utilisateur spécifique
          post: selectedPost,
          typePost: selectedTypePost,
          vacation_start: vacationEvent.vacation_start,
          vacation_end: vacationEvent.vacation_end,
          lunchAllowance: vacationEvent.lunchAllowance
            ? vacationEvent.lunchAllowance
            : 0, // Utilisation de la nouvelle variable lunchAllowance
          pause_payment: vacationEvent.pause_payment,
          pause_start: vacationEvent.pause_start
            ? vacationEvent.pause_start
            : "",
          pause_end: vacationEvent.pause_end ? vacationEvent.pause_end : "",
          selected_days: vacationEvent.selectedDays, // Date spécifique pour cet événement
          work_duration: vacationEvent.work_duration, // Durée de travail ajustée
          night_hours: vacationEvent.night_hours, // Heures de nuit calculées pour ce segment
          holiday_hours: isHoliday ? vacationEvent.work_duration : 0, // Heures fériées
          sunday_hours: isSunday ? vacationEvent.work_duration : 0, // Heures du dimanche
          isSubEvent: vacationEvent.isSubEvent,
          relatedEvent: vacationEvent.relatedEvent,
        };
      });
    })
  )
  .flat();

    // Mettre à jour les événements existants en ajoutant les nouveaux
    setEvents((prevEvents) => [...prevEvents, ...newEvents]);

    // Réinitialiser le formulaire après la création des événements
    resetForm();

    // Afficher un message de succès
    let msg = "Événements créés avec succès !";
    setSuccessMessage([msg]);
  };

  //modification vacation
  const handleEditEvent = (updatedEvent) => {
    // Créer un ensemble des dates de jours fériés pour des recherches rapides
    const holidayDates = new Set(holidays.map((holiday) => holiday.date));

    // Obtenir les dimanches du mois en format YYYY-MM-DD
    const sundays = getSundays(currentMonth , currentYear).map(
      (date) => date.toISOString().split("T")[0]
    );

    // Filter existing events with the same IDs as the updated event
    const filteredEvents = events.filter((event) =>
      updatedEvent.id.includes(event.id)
    );

    console.log(filteredEvents);
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
    console.log("Vacation Events:", vacationEvents);

    // Initialize updated events based on existing events
    let updatedEvents = [...events];

    // If the vacation events length matches filtered events, update each event's details
    if (vacationEvents.length === filteredEvents.length) {
      console.log("entre 1 sortie 1");
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
      console.log("entre 1 sortie 2");

      const filteredEventsIds = filteredEvents.map((event) => event.id);
      console.log("filteredEventsIds", filteredEventsIds);

      const post = filteredEvents.map((event) => event.post);
      const typePost = filteredEvents.map((event) => event.typePost);

      // Extract user_ids from filteredEvents (it can be an array with one or more user IDs)
      const user_ids = [
        ...new Set(filteredEvents.map((event) => event.user_id)),
      ]; // Use Set to ensure unique user_ids
      console.log(user_ids, "user_ids");
      console.log("post", post);
      console.log("typePost", typePost);

      // Filtrer les événements à supprimer (deleteEvents)
      const afterdeleteEvents = events.filter(
        (event) => !filteredEventsIds.includes(event.id)
      );

      console.log("afterdeleteEvents ", afterdeleteEvents);

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

      // Log the newly created vacation events
      console.log("Newly created vacation events:", newVacationEvents);

      // Combine delete events and new vacation events to get the updated events
      const updatedEvents = [
        ...afterdeleteEvents, // Add the events that need to be deleted
        ...newVacationEvents, // Add the new vacation events
      ];

      // Log the updated events
      console.log("Updated events:", updatedEvents);

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
      month: currentMonth , // Convert to 1-based month
      year: currentYear,
      events: events,
    });
  };

  console.log(events);
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


{
  isShow ? (
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
  )
}


        {isFormVisible && (
          <>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out text-sm"
            >
              {isCollapsed ? "Ajouter des vacations" : "Masquer"}
            </button>

            {!isCollapsed && (
              <>
                <div className="bg-white border border-gray-300 rounded-md shadow-md p-4 space-y-4 mt-4">
                  <div className="flex items-center justify-center">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowAddUserModal(true)}
                        className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors text-xs font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                        aria-label="Ajouter des agents"
                      >
                        <span className="mr-2">👥</span> Ajouter des agents
                      </button>
                      {/*}
                      <button
                        onClick={() => setShowAddHolidayModal(true)}
                        className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors text-xs font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                        aria-label="Ajouter un jour férié"
                      >
                        <span className="mr-2">📆</span> Ajouter un jour férié
                      </button>{*/}
                      <button
                        onClick={() => setShowAddPostModal(true)}
                        className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors text-xs font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                        aria-label="Ajouter un post"
                      >
                        <span className="mr-2">✍️</span> Ajouter un Post
                      </button>
                    </div>
                  </div>

                  {/* User Select and Agent Management */}
                  <UserSelect
                    siteUsers={siteUsers}
                    selectedUsers={selectedUsers}
                    handleUserChange={handleUserChange}
                    setShowAddUserModal={setShowAddUserModal}
                  />

                  <div className="bg-white border border-gray-300 rounded-md shadow-md p-1 space-y-2">
                    <Calendarr
                      onDaysSelected={setSelectedDays}
                      holidays={holidays}
                      monthYear={{ month: currentMonth-1, year: currentYear }}
                      resetCalendar={resetCalendar}
                      siteUsers={siteUsers}
                    />
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex-1" style={{ flexBasis: "40%" }}>
                      <PosteSection
                        typePosts={typePosts}
                        selectedTypePost={selectedTypePost}
                        handleTypePostChange={handleTypePostChange}
                        listPosts={listPosts}
                        selectedPost={selectedPost}
                        handlePostChange={handlePostChange}
                      />
                    </div>
                    <div className="flex-1" style={{ flexBasis: "20%" }}>
                      <HorairesSection
                        vacation_start={vacation_start}
                        setVacationStart={setVacationStart}
                        vacation_end={vacation_end}
                        setVacationEnd={setVacationEnd}
                      />
                    </div>
                    <div className="flex-1" style={{ flexBasis: "40%" }}>
                      <PauseSection
                        pause_payment={pause_payment}
                        setPausePayment={setPausePayment}
                        pause_start={pause_start}
                        handlePauseChange={handlePauseChange}
                        pause_end={pause_end}
                      />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={createEventsForUsers}
                      className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors mt-4 text-sm font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                      aria-label="Ajouter des vacations"
                      // Désactiver si l'état de chargement est actif
                    >
                      <>
                        <span className="mr-2">➕</span> Ajouter vacation(s)
                      </>
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="mt-4">
              <Table
                month={currentMonth}
                year={currentYear}
                holidays={holidays}
                events={events}
                selectedSite={selectedSite}
                selected_days={selected_days}
                localPosts={localPosts}
                typePosts={typePosts}
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEvent}
                onCreateEvent={createEventsFromAddEvent}
                AllUsers={users}
                siteUsers={siteUsers}
              />
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleSavePlanning}
                className={`ml-6 py-2 px-3 bg-blue-600 text-white rounded-md ${
                  events.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                } text-sm font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed`}
                aria-label="Sauvegarder le planning"
                // Désactiver le bouton pendant la sauvegarde
              >
                Sauvegarder
              </button>
            </div>
          </>
        )}

        {/* Modals */}
        <AddUserModal
          isOpen={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
          onAddUser={handleAddSiteUsers}
          selectedSite={selectedSite}
          users={users}
          siteUsers={siteUsers}
        />
        <PostTypeModal
          open={showAddPostModal}
          onClose={() => setShowAddPostModal(false)}
          onAddPost={handleAddPost}
          typePosts={typePosts}
        />
        <HolidayModal
          open={showAddHolidayModal}
          onClose={() => setShowAddHolidayModal(false)}
          onAddHoliday={handleAddHoliday}
        />
      </div>
    </AdminAuthenticatedLayout>
  );
};

export default CreatePlanning;
