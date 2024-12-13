import React, { useState, useMemo, useEffect } from "react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import Table from "./Table";
import Alert from "./Alert";
import { Inertia } from "@inertiajs/inertia";
import { Head } from "@inertiajs/react";
import NavBar from "./import/NavBar";
import PlanningHeader from "./import/PlanningHeader";
import DaysPostsVacationSelect from "./DaysPostsVacationSelect";
import SiteMonthYeaySelect from "./SiteMonthYeaySelect";
import AddUserToSiteModal from "./Modal/AddUserToSiteModal";
import SearchAvaibleGuardModal from "./Modal/SearchAvaibleGuardModal";
import PostTypeModal from "./Modal/AddPostModal";
import { checkVacationsAndWeeklyHours } from "./CheckEventsFunction";
import {
  createVacationEvents,
  getUserName,
  getPostName,
} from "./CreatFunction"; // Importer les utilitaires
import SelectSite from "./import/SelectSite";

const CreatePlanning = ({
  typePosts = [],
  posts = [],
  sites = [],
  users = [],
  holidays = [],
  plannings = [],
  selectedPlanning = [],
  isShow,
  eventsForSearchGuard,
}) => {
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
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [searchAvailableGuard, setSearchAvailableGuard] = useState(false);
  const [siteUsers, setSiteUsers] = useState([]);
  const [localSiteUsers, setLocalSiteUsers] = useState([]);
  const [localPosts, setLocalPosts] = useState(posts);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fonction pour ouvrir le modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Fonction pour fermer le modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModalSearch = () => {
    setSearchAvailableGuard(true); // Ouvre le modal
  };

  const closeModalSearch = () => {
    setSearchAvailableGuard(false); // Ferme le modal
  };

  useEffect(() => {
    if (selectedSite) {
      const allUsers =
        sites.find((site) => site.id == selectedSite)?.users || [];

      const usersFirstList = allUsers.filter((user) => user.pivot?.isFirstList);
      const usersSecondList = allUsers.filter(
        (user) => !user.pivot?.isFirstList
      );

      setSiteUsers({ firstList: usersFirstList, secondList: usersSecondList }); // Combine les deux listes dans un objet
      setLocalSiteUsers(usersFirstList); // Met uniquement la première liste
    }
  }, [selectedSite, sites]);

  console.log(localSiteUsers);

  useEffect(() => {
    if (selectedPlanning && selectedPlanning[0]) {
      setEvents(selectedPlanning[0].events || []);
      setCurrentMonth(selectedPlanning[0].month);
      setSelectedSite(selectedPlanning[0].site_id);
      setIsFormVisible(true);
    }
  }, [selectedPlanning]);

  const handleCreateClick = (data) => {
    setCurrentMonth(data.month);
    setCurrentYear(data.year);
    setSelectedSite(data.siteId);

    try {
      // Vérifier si un planning existe déjà pour le mois, l'année et le site sélectionnés
      const planningExists = plannings.find(
        (planning) =>
          planning.month == Number(data.month) &&
          parseInt(planning.year, 10) == Number(data.year) &&
          planning.site_id == Number(data.siteId)
      );

      console.log(planningExists);

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
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des événements:", error);
      setAlertMessage(
        "Une erreur est survenue lors de la création du planning."
      );
    }
  };

  // Fonction principale pour créer des événements pour les utilisateurs
  const createEventsForUsers = (addEvent) => {
    console.log(addEvent);

    // Dernier ID utilisé
    const maxExistingId =
      events.length > 0 ? Math.max(...events.map((event) => event.id)) : 0;
    let lastId = maxExistingId === 0 ? 1 : maxExistingId + 1;

    // Variables pour stocker les événements traités pour ce mois et le mois suivant
    let vacationEventsProcessed = [];
    let vacationEventsNextMonthProcessed = [];

    // Créer de nouveaux événements pour chaque utilisateur et chaque jour sélectionné
    const newEvents = (addEvent.selectedUsersDays || []).flatMap(
      ({ user_id, selected_days }) => {
        // Si selected_days est une chaîne, la convertir en tableau
        const daysArray = Array.isArray(selected_days)
          ? selected_days
          : [selected_days];

        return daysArray.flatMap((date) => {
          console.log(date); // Cela devrait maintenant afficher correctement la date
          const vacationAllEvents = createVacationEvents(
            addEvent.vacation_start,
            addEvent.vacation_end,
            date,
            addEvent.pause_start,
            addEvent.pause_end,
            addEvent.pause_payment,
            currentMonth,
            currentYear,
            holidays
          );

          const vacationEvents = vacationAllEvents.events;
          const vacationEventsNextMonth = vacationAllEvents.eventsNextMonth;

          console.log(vacationAllEvents);

          // Traiter les vacationEvents
          vacationEvents.forEach((vacationEvent) => {
            const currentId = ++lastId;

            vacationEventsProcessed.push({
              id: currentId,
              user_id: user_id,
              userName: getUserName(users, user_id),
              post: addEvent.post,
              postName: getPostName(posts, addEvent.post),
              typePost: addEvent.typePost,
              vacation_start: vacationEvent.vacation_start,
              vacation_end: vacationEvent.vacation_end,
              lunchAllowance: vacationEvent.lunchAllowance || 0,
              pause_payment: vacationEvent.pause_payment,
              pause_start: vacationEvent.pause_start || "",
              pause_end: vacationEvent.pause_end || "",
              selected_days: vacationEvent.selectedDays,
              work_duration: vacationEvent.work_duration,
              night_hours: vacationEvent.night_hours,
              holiday_hours: vacationEvent.holiday_hours,
              sunday_hours: vacationEvent.sunday_hours,
              isSubEvent: vacationEvent.isSubEvent,
              relatedEvent: vacationEvent.relatedEvent,
            });
          });

          console.log(vacationEventsProcessed);

          // Traiter les vacationEventsNextMonth
          vacationEventsNextMonth.forEach((vacationEvent) => {
            const currentId = ++lastId;

            vacationEventsNextMonthProcessed.push({
              id: currentId,
              user_id: user_id, // S'assurer que user_id est cohérent
              userName: getUserName(users, user_id),
              post: addEvent.post,
              postName: getPostName(posts, addEvent.post),
              typePost: addEvent.typePost,
              vacation_start: vacationEvent.vacation_start,
              vacation_end: vacationEvent.vacation_end,
              lunchAllowance: vacationEvent.lunchAllowance || 0,
              pause_payment: vacationEvent.pause_payment,
              pause_start: vacationEvent.pause_start || "",
              pause_end: vacationEvent.pause_end || "",
              selected_days: vacationEvent.selectedDays,
              work_duration: vacationEvent.work_duration,
              night_hours: vacationEvent.night_hours,
              holiday_hours: vacationEvent.holiday_hours,
              sunday_hours: vacationEvent.sunday_hours,
              isSubEvent: vacationEvent.isSubEvent,
              relatedEvent: vacationEvent.relatedEvent,
            });
          });
        });
      }
    );

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

      // Afficher un message de succès
      let msg = "Vacation(s) créé(s) avec succès !";
      setSuccessMessage([msg]);
    }
  };

  //modification vacation
  const handleEditEvent = (updatedEvent) => {
    console.log("Holiday dates:", holidays);

    const filteredEvents = events.filter((event) =>
      updatedEvent.id.includes(event.id)
    );
    console.log("Filtered events:", filteredEvents);

    const filtredId = filteredEvents.map((event) => event.id);
    const selectedDays = filteredEvents.map((event) => event.selected_days);
    const user = filteredEvents.map((event) => event.user_id);
    console.log(
      "Filtered IDs:",
      filtredId,
      "Selected Days:",
      selectedDays,
      "Users:",
      user
    );

    // Generate vacation events
    let vacationAllEvents;

    vacationAllEvents = createVacationEvents(
      updatedEvent.vacation_start,
      updatedEvent.vacation_end,
      selectedDays,
      updatedEvent.pause_start,
      updatedEvent.pause_end,
      updatedEvent.pause_payment,
      currentMonth,
      currentYear,
      holidays
    );

    console.log("vacationAllEvents:", vacationAllEvents);
    const vacationEvents = vacationAllEvents.events;
    const vacationEventsNextMonth = vacationAllEvents.eventsNextMonth;

    console.log("Vacation events generated:", vacationEvents);

    // Initialize updated events based on existing events
    let updatedEvents = [...events];

    if (vacationEvents.length == filteredEvents.length) {
      console.log("Normal case: updating existing events...");
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

      const user_ids = [
        ...new Set(filteredEvents.map((event) => event.user_id)),
      ];
      const afterdeleteEvents = events.filter(
        (event) => !filteredEventsIds.includes(event.id)
      );

      const vacationEventsByRelatedEvent = vacationEvents.reduce(
        (acc, vacationEvent) => {
          const relatedEvent = vacationEvent.relatedEvent;
          if (!acc[relatedEvent]) acc[relatedEvent] = [];
          acc[relatedEvent].push(vacationEvent);
          return acc;
        },
        {}
      );

      let newVacationEvents = [];
      Object.keys(vacationEventsByRelatedEvent).forEach((relatedEvent) => {
        const vacationEventsGroup = vacationEventsByRelatedEvent[relatedEvent];
        const maxExistingId =
          events.length > 0 ? Math.max(...events.map((event) => event.id)) : 0;
        let lastId = maxExistingId === 0 ? 1 : maxExistingId + 1;

        vacationEventsGroup.forEach((vacationEvent) => {
          const selectedDaysArray = Array.isArray(vacationEvent.selectedDays)
            ? vacationEvent.selectedDays
            : [vacationEvent.selectedDays];

          selectedDaysArray.forEach((selectedDay) => {
            user_ids.forEach((currentUserId) => {
              newVacationEvents.push({
                id: lastId++,
                user_id: currentUserId,
                post: post[0],
                typePost: typePost[0],
                vacation_start: vacationEvent.vacation_start,
                vacation_end: vacationEvent.vacation_end,
                lunchAllowance: vacationEvent.lunchAllowance,
                pause_payment: vacationEvent.pause_payment,
                pause_start: vacationEvent.pause_start,
                pause_end: vacationEvent.pause_end,
                selected_days: selectedDay,
                work_duration: vacationEvent.work_duration,
                night_hours: vacationEvent.night_hours,
                holiday_hours: vacationEvent.holiday_hours,
                sunday_hours: vacationEvent.sunday_hours,
                isSubEvent: vacationEvent.isSubEvent,
                relatedEvent: relatedEvent,
              });
            });
          });
        });
      });

      const updatedEvents = [...afterdeleteEvents, ...newVacationEvents];
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
    console.log(events);
    Inertia.post(route("plannings.store"), {
      site: selectedSite,
      month: currentMonth, // Convert to 1-based month
      year: currentYear,
      events: events,
      eventsNextMonth: eventsNextMonth,
    });
  };

  const addNewPost = (data) => {
    console.log(data);
    const newPost = {
      id: 1000,
      abbreviation: data.abbreviation,
      default_duration_hours: Number(data.default_duration_hours * 60),
      default_duration_minutes: Number(data.default_duration_minutes),
      name: data.name,
      price: "",
      type_post_id: data.type_post_id,
    };

    console.log(newPost);
    setLocalPosts([...localPosts, newPost]);
  };

  const handleAddLocalUser = (user) => {
    console.log(user);
    const newLocalUser = localSiteUsers.push(user);
    console.log(localSiteUsers);
  };

  const handleValidatePlanning = () => {};
  console.log("events", events);
  const [userCount, setUserCount] = useState(1);
  const handleAnonymousUser = () => {
    // Create a new event based on the template with an incremented userName
    const newEvent = {
      userName: `Agent anonyme ${userCount}`, // Increment the user count
      user_id: userCount, // Set a unique user_id
    };

    const newUser = {
      ...localSiteUsers,
      fullname: `Agent anonyme ${userCount}`, // Dynamically set the fullname
    };
    console.log(localSiteUsers);
    // Add the new event to the events list and update the userCount
    setEvents([...events, newEvent]);
    setUserCount(userCount + 1); // Increment for the next user
    setLocalSiteUsers([...localSiteUsers, newUser]);
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
          <PlanningHeader
            selectedSite={selectedSite}
            currentMonth={currentMonth}
            currentYear={currentYear}
            sites={sites}
          />
        ) : (
          // Section Select
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-4 sm:items-center sm:justify-between">
            <SiteMonthYeaySelect sites={sites} onAdd={handleCreateClick} />
          </div>
        )}

        {isFormVisible && (
          <>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={openModal}
                className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors text-xs font-semibold flex items-center"
              >
                <span className="mr-2 white-icon">➕</span> Ajouter une / des
                vacation(s)
              </button>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setShowAddPostModal(true)}
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors text-xs font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <span className="mr-2">✍️</span> Gestion des Posts
              </button>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors text-xs font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                aria-label="Ajouter des agents"
              >
                <span className="mr-2">👥</span> Gestion des agents
              </button>

              <button
                onClick={() => {
                  console.log("Button clicked, modal opening...");
                  setSearchAvailableGuard(true);
                }}
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors text-xs font-semibold"
              >
                <span className="mr-2">🔍</span> Agent disponible
              </button>

              <button
                onClick={handleAnonymousUser}
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors text-xs font-semibold"
              >
                <span className="mr-2"></span> Agent Anonyme
              </button>
            </div>

            {isModalOpen && (
              <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-1 w-[1000px] relative">
                  <DaysPostsVacationSelect
                    onClose={closeModal}
                    selectedSite={selectedSite}
                    sites={sites}
                    posts={localPosts}
                    typePosts={typePosts}
                    holidays={holidays}
                    month={currentMonth}
                    year={currentYear}
                    users={users}
                    siteUsers={localSiteUsers}
                    onAddNewUser={setSiteUsers}
                    createEventsForUsers={createEventsForUsers}
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
                typePosts={typePosts}
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEvent}
                onCreateEvent={createEventsForUsers}
                AllUsers={users}
                siteUsers={localSiteUsers}
                posts={localPosts}
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

            <PostTypeModal
              open={showAddPostModal}
              onClose={() => setShowAddPostModal(false)}
              typePosts={typePosts}
              onAddPost={addNewPost}
            />

            <SearchAvaibleGuardModal
              isOpen={searchAvailableGuard} // Prop pour contrôler l'ouverture du modal
              onClose={closeModalSearch}
              siteUsers={siteUsers}
              localSiteUsers={localSiteUsers}
              selectedSite={SelectSite}
              eventsForSearchGuard={eventsForSearchGuard}
              currentMonth={currentMonth}
              currentYear={currentYear}
              onAddLocalUser={handleAddLocalUser}
            />
            <div className="flex justify-center">
              {events.length !== 0 && (
                <>
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
                  <button
                    onClick={handleValidatePlanning}
                    className={`ml-6 py-2 px-3 bg-blue-600 text-white rounded-md ${
                      events.length === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    } text-sm font-semibold`}
                    aria-label="Sauvegarder le planning"
                    disabled={events.length === 0} // Disable the button when no events
                  >
                    Valider
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </AdminAuthenticatedLayout>
  );
};

export default CreatePlanning;
