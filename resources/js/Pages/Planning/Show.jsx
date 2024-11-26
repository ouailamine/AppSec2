import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import Select from "react-select";
import React, { useState, useMemo, useEffect } from "react";
import Calendar from "./Calendar2";
import Table from "./Table";
import PostTypeModal from "./AddTypePostModal2";
import HolidayModal from "./AddHolidayModal2";
import AddUserModal from "./AddUserToSiteModal2";
import Alert from "./Alert";
import { Head } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";
import NavBar from "./import/ShowNavBar";
import PosteSection from "./import/PosteSection";
import HorairesSection from "./import/HorairesSection";
import PauseSection from "./import/PauseSection";
import UserSelect from "./import/UserSelect";
import PlanningHeader from "./import/PlanningHeader";

import { Inertia } from "@inertiajs/inertia";
import {
  calculateDurationInMinutes,
  calculateNightHours,
  createVacationEvents,
  getSundays,
  isTimeInRange,
  timeToMinutes,
} from "./CreatFunction";

// Fonction pour obtenir le nom du mois à partir du numéro du mois
const obtenirNomDuMois = (numeroMois) => {
  const mois = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  return mois[numeroMois - 1] || "Inconnu";
};

// Composant fonctionnel ShowPage
const ShowPage = ({
  typePosts = [],
  posts = [],
  sites = [],
  users = [],
  holidays = [],
  planning,
}) => {
  

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [vacation_start, setVacationStart] = useState("");
  const [vacation_end, setVacationEnd] = useState("");
  const [pause_start, setPauseStart] = useState("");
  const [pause_end, setPauseEnd] = useState("");
  const [pause_payment, setPausePayment] = useState("oui");
  const [selectedTypePost, setSelectedTypePost] = useState("");
  const [selectedPost, setSelectedPost] = useState("");
  const [currentMonth, setCurrentMonth] = useState(planning[0].month);
  const [currentYear, setCurrentYear] = useState(planning[0].year);
  const [alertMessage, setAlertMessage] = useState("");
  const [events, setEvents] = useState(planning[0].events);
  const [resetCalendar, setResetCalendar] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [selected_days, setSelectedDays] = useState([]);
  const [postTypeModalVisible, setPostTypeModalVisible] = useState(false);
  const [holidayModalVisible, setHolidayModalVisible] = useState(false);
  const [showAddUserModalVisible, setShowAddUserModalVisible] = useState(false);
  const [localPosts, setLocalPosts] = useState(posts);
  const [listPosts, setListPosts] = useState();
  const [siteUsers, setSiteUsers] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);


  console.log(events);
  const array = Array(events).fill(0);
  console.log(array);


  const resetForm = () => {
    setSelectedUsers([]);
    setVacationStart("");
    setVacationEnd("");
    setPauseStart("");
    setPauseEnd("");
    setPausePayment("non");
    setSelectedPost("");
    setSelectedDays([]);
    setResetCalendar(true);
    setTimeout(() => setResetCalendar(false), 0);
  };

  // Trouver le site avec le siteId correspondant
  const selectedSite = sites.find((site) => site.id == planning[0].site_id);
  console.log(selectedSite);

  useEffect(() => {
    if (selectedSite) {
      setSiteUsers(selectedSite.users || []);
    }
  }, [siteUsers]);

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


 
  // Add users for site
  const handleAddSiteUsers = (updatedUsers) => {
    setSiteUsers(updatedUsers);
    console.log("siteUsers", siteUsers);
    console.log("updatedUsers", updatedUsers);
  };

  // Add post type
  const handleAddPost = (post) => {
    setLocalPosts((prev) => [...prev, { id: Date.now(), ...post }]);
    console.log("Added Post Type:", post); // Debugging line
  };

  // Add holiday
  const handleAddHoliday = (holiday) => {
    holidays.push(holiday); // Local addition, ideally you'd also update your server
  };

  // Transformer les utilisateurs du site au format requis par react-select
  const optionsUtilisateurs = siteUsers.map((user) => ({
    value: user.id,
    label: `${user.fullname} ${user.firstname}`,
  }));

  // Obtenir le nom complet du mois
  const nomDuMois = obtenirNomDuMois(currentMonth);
  const handleTypePostChange = (e) => setSelectedTypePost(e.target.value);
  const handlePostChange = (e) => setSelectedPost(e.target.value);
  const handlePauseChange = (type) => (e) => {
    const value = e.target.value;
  };

  const handleEditEvent = (updatedEvent) => {
    console.log("updatedEvent", updatedEvent);

    const updatedEvents = events.map((event) => {
      if (event.id === updatedEvent.id) {
        // Recalculez la durée de travail
        const work_duration = calculateDurationInMinutes(
          updatedEvent.vacation_start,
          updatedEvent.vacation_end
        );
        const breakDuration =
          updatedEvent.pause_payment === "Non-payable"
            ? calculateDurationInMinutes(
                updatedEvent.pause_start,
                updatedEvent.pause_end
              )
            : 0;
        const adjustedWorkDuration = work_duration - breakDuration;

        // Formatage de la durée
        const hours = Math.floor(adjustedWorkDuration / 60);
        const minutes = adjustedWorkDuration % 60;
        const workDurationFormatted = `${hours}:${minutes}`;

        // Retournez l'événement mis à jour avec la nouvelle durée
        return {
          ...updatedEvent,
          work_duration: workDurationFormatted,
        };
      }
      return event;
    });

    setEvents(updatedEvents);
  };

  const handleDeleteEvent = (eventToDelete) => {
    console.log(eventToDelete);
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventToDelete.id)
    );
  };

  const handleUpdatePlanning = () => {
    const planningIds = planning[0].id;

    console.log(planningIds);
    console.log(selectedSite);
    Inertia.put(route("plannings.update", planningIds), {
      site: selectedSite?.id,
      month: currentMonth, // Convert to 1-based month
      year: currentYear,
      events: events,
    });
  };

  const validateSelectionCreateEvent = () => {
    // Check if at least one user is selected
    if (selectedUsers.length === 0) {
      setAlertMessage("Veuillez sélectionner au moins un utilisateur.");
      setAlertType("error");
      return false;
    }

    // Check if vacation start and end times are provided
    if (!vacation_start || !vacation_end) {
      setAlertMessage(
        "Veuillez fournir les horaires de début et de fin des vacances."
      );
      setAlertType("error");
      return false;
    }

    // Check if a type of post is selected
    if (!selectedPost) {
      setAlertMessage("Veuillez sélectionner un poste.");
      setAlertType("error");
      return false;
    }

    // If the pause is non-payable, check if both pause start and end times are provided
    if (pause_payment === "non" && (!pause_start || !pause_end)) {
      setAlertMessage(
        "Veuillez fournir les horaires de début et de fin de la pause pour les pauses non-payables."
      );
      setAlertType("error");
      return false;
    }

    // Check if at least one day is selected
    if (selected_days.length == 0) {
      console.log(selected_days);
      setAlertMessage("Veuillez sélectionner au moins un jour.");
      setAlertType("error");
      return false;
    }

    return true;
  };

  const createEventsForUsers = () => {
    if (!validateSelectionCreateEvent()) {
      return;
    }

    const work_duration = calculateDurationInMinutes(
      vacation_start,
      vacation_end
    );
    const breakDuration =
      pause_payment === "non"
        ? calculateDurationInMinutes(pause_start, pause_end)
        : 0;
    const adjustedWorkDuration = work_duration - breakDuration;

    const hours = Math.floor(adjustedWorkDuration / 60);
    const minutes = adjustedWorkDuration % 60;
    const workDurationFormatted = `${hours}:${minutes}`;

    const night_hours = calculateNightHours(vacation_start, vacation_end);

    let lastId = 0;

    const newEvents = selectedUsers.flatMap((user) =>
      selected_days.map((date) => {
        // Utiliser le dernier ID et l'incrémenter
        const currentId = ++lastId;

        return {
          id: currentId,
          user_id: user.value,
          post: selectedPost,
          vacation_start,
          vacation_end,
          pause_payment: pause_payment === "oui" ? "Payable" : "Non-payable",
          pause_start,
          pause_end,
          selected_days: date, // Inclure la date dans l'événement
          work_duration: workDurationFormatted,
          night_hours,
        };
      })
    );

    setEvents((prevEvents) => [...prevEvents, ...newEvents]);
    resetForm();
    setAlertMessage("Événements créés avec succès !");
    setAlertType("success");
  };

  const handleUserChange = (selectedOptions) =>
    setSelectedUsers(selectedOptions || []);

  return (
    <AdminAuthenticatedLayout>
      <NavBar />

      <div className="container mx-auto p-0 space-y-2">
        {alertMessage && alertType && (
          <Alert
            message={alertMessage}
            type={alertType}
            onClose={() => setAlertMessage("")}
          />
        )}

        {/* Conteneur principal pour aligner les éléments en colonne */}
        <PlanningHeader
          selectedSite={selectedSite}
          nomDuMois={nomDuMois}
          currentYear={currentYear}
        />

        <div className="bg-white border border-gray-300 rounded-md shadow-md p-4 space-y-4 mt-4">
          {/* Bouton pour basculer la visibilité */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out text-sm"
          >
            {isCollapsed ? "Ajouter des vacations" : "Masquer"}
          </button>

          {/* Contenu collapsible */}
          {!isCollapsed && (
            <>
              <UserSelect
                siteUsers={optionsUtilisateurs}
                selectedUsers={selectedUsers}
                handleUserChange={handleUserChange}
                setShowAddUserModalVisible={setShowAddUserModalVisible}
              />

              <div className="bg-white border border-gray-300 rounded-md shadow-md p-4">
                <button
                  onClick={() => setHolidayModalVisible(true)}
                  className="py-2 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
                >
                  Ajouter un jour féddrié
                </button>
                <Calendar
                  onDaysSelected={setSelectedDays}
                  holidays={holidays}
                  monthYear={{ month: currentMonth - 1, year: currentYear }}
                  resetCalendar={resetCalendar}
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
                  className="py-1 px-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition mt-4 text-sm"
                >
                  Ajouter vacation(s)
                </button>
              </div>
            </>
          )}
          <div className="mt-4">
            <Table
              month={currentMonth}
              year={Number(currentYear)}
              holidays={holidays}
              events={events}
              users={users}
              selectedSite={selectedSite}
              selectedDays={selected_days}
              localPosts={localPosts}
              typePosts={typePosts}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
              AllUsers={users}
              siteUsers={siteUsers}
            />
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={handleUpdatePlanning}
            className="ml-6 py-2 px-3 bg-blue-600 text-white rounded-md hover:bg-green-700 transition text-sm"
          >
            Sauvegarder
          </button>
        </div>
        <AddUserModal
          isOpen={showAddUserModalVisible}
          onClose={() => setShowAddUserModalVisible(false)}
          onAddUser={handleAddSiteUsers}
          selectedSite={selectedSite}
          AllUsers={users}
        />

        <PostTypeModal
          open={postTypeModalVisible}
          onClose={() => setPostTypeModalVisible(false)}
          onAdd={handleAddPost}
          typePosts={typePosts}
        />

        <HolidayModal
          open={holidayModalVisible}
          onClose={() => setHolidayModalVisible(false)}
          onAdd={handleAddHoliday}
        />
      </div>
    </AdminAuthenticatedLayout>
  );
};

export default ShowPage;
