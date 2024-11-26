import React, { useState, useMemo, useEffect } from "react";
import Select from "react-select";
import { format } from "date-fns";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import Calendar from "./Calendar";
import Calendarr from "./Calendar2";
import Post from "./Post";
import Table from "./Table";
import Alert from "./Alert";
import { fr } from "date-fns/locale";
import PostTypeModal from "./AddTypePostModal2";
import HolidayModal from "./AddHolidayModal2";
import AddUserModal from "./AddUserToSiteModal2";
import { Inertia } from "@inertiajs/inertia";
import { Head } from "@inertiajs/react";
import { startOfWeek, endOfWeek } from "date-fns";
import NavBar from "./import/NavBar";
import SelectSite from "./import/SelectSite";
import SelectMonth from "./import/SelectMonth";
import SelectYear from "./import/SelectYear";
import PosteSection from "./import/PosteSection";
import HorairesSection from "./import/HorairesSection";
import PauseSection from "./import/PauseSection";
import UserSelect from "./import/UserSelect";
import {
  calculateDurationInMinutes,
  calculateNightHours,
  createVacationEvents,
  getSundays,
  isTimeInRange,
  timeToMinutes,
} from "./CreatFunction"; // Importer les utilitaires
const CreatePlanning = ({
  typePosts = [],
  posts = [],
  sites = [],
  users = [],
  holidays = [],
  plannings = [],
}) => {
  console.log(users);
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedSite, setSelectedSite] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [vacation_start, setVacationStart] = useState("");
  const [vacation_end, setVacationEnd] = useState("");
  const [pause_start, setPauseStart] = useState("");
  const [pause_end, setPauseEnd] = useState("");
  const [pause_payment, setPausePayment] = useState("oui");
  const [selectedPost, setSelectedPost] = useState("");
  const [selectedTypePost, setSelectedTypePost] = useState("");
  const [selected_days, setSelectedDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [events, setEvents] = useState([]);
  const [resetCalendar, setResetCalendar] = useState(false);
  const [postTypeModalVisible, setPostTypeModalVisible] = useState(false);
  const [holidayModalVisible, setHolidayModalVisible] = useState(false);
  const [showAddUserModalVisible, setShowAddUserModalVisible] = useState(false);
  const [localPosts, setLocalPosts] = useState(posts);
  const [listPosts, setListPosts] = useState();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [siteUsers, setSiteUsers] = useState([]);

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

  useEffect(() => {
    if (selectedSite) {
      setSiteUsers(selectedSite.users || []);
    }
  }, [selectedSite]);

  // Add users for site
  const handleAddSiteUsers = (updatedUsers) => {
    setSiteUsers(updatedUsers);
  };

  // Add post type
  const handleAddPost = (post) => {
    console.log(post);
    setLocalPosts((prev) => [...prev, { id: Date.now(), ...post }]);
    console.log(localPosts);
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
    setPausePayment("oui");
    setSelectedPost("");
    setSelectedTypePost("");
    setSelectedDays([]);
    setResetCalendar(true);
    setTimeout(() => setResetCalendar(false), 0);
  };

  const siteOptions = useMemo(
    () =>
      sites.map((site) => ({
        value: site.id,
        label: site.name,
        users: site.users.map((user) => ({
          value: user.id,
          label: user.fullname || user.name,
        })),
      })),
    [sites]
  );

  const monthOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        value: index,
        label: format(new Date(2024, index), "MMMM", { locale: fr }),
      })),
    []
  );

  const yearOptions = useMemo(
    () =>
      Array.from({ length: 60 }, (_, index) => ({
        value: new Date().getFullYear() - 0 + index,
        label: new Date().getFullYear() - 0 + index,
      })),
    []
  );

  const handleSiteChange = (selectedOption) => {
    setSelectedSite(selectedOption);
    setSiteUsers(selectedOption ? selectedOption.users : []);
  };

  useEffect(() => {
    if (selectedSite !== undefined) {
    }
  }, [selectedSite]);

  const handleUserChange = (selectedOptions) =>
    setSelectedUsers(selectedOptions || []);

  const handlePostChange = (e) => setSelectedPost(e.target.value);
  const handleTypePostChange = (event) => {
    setSelectedTypePost(event.target.value);
  };

  const handlePauseChange = (type) => (e) => {
    const value = e.target.value;

    // Fonction pour convertir l'heure en minutes depuis minuit
    const timeToMinutes = (time) => {
      const [hour, minute] = time.split(":").map(Number);
      return hour * 60 + minute;
    };

    // Fonction pour vérifier si une heure est dans l'intervalle en tenant compte des jours
    const isTimeInRange = (time, start, end) => {
      const timeInMinutes = timeToMinutes(time);
      const startInMinutes = timeToMinutes(start);
      const endInMinutes = timeToMinutes(end);

      // Si la période de fin est avant la période de début, cela signifie que l'intervalle traverse minuit
      if (endInMinutes < startInMinutes) {
        return timeInMinutes >= startInMinutes || timeInMinutes <= endInMinutes;
      }

      return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
    };

    if (type === "start") {
      if (
        vacation_start &&
        vacation_end &&
        !isTimeInRange(value, vacation_start, vacation_end)
      ) {
        setAlertMessage(
          "L'heure de la pause doit être incluse dans la vacation"
        );
        setAlertType("error");
        return;
      }
      setPauseStart(value);
    } else {
      if (
        pause_start &&
        vacation_end &&
        !isTimeInRange(value, pause_start, vacation_end)
      ) {
        setAlertMessage(
          "L'heure de la pause doit être incluse dans la vacation"
        );
        setAlertType("error");
        return;
      }
      setPauseEnd(value);
    }
  };

  const handleMonthChange = (selectedOption) =>
    setCurrentMonth(selectedOption.value);

  const handleYearChange = (selectedOption) =>
    setCurrentYear(selectedOption.value);

  const validateSelections = () => {
    if (!selectedSite) {
      setAlertMessage("Veuillez sélectionner un site.");
      setAlertType("error");
      return false;
    }
    if (currentMonth === undefined) {
      setAlertMessage("Veuillez sélectionner un mois.");
      setAlertType("error");
      return false;
    }
    return true;
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
    if (selected_days.length === 0) {
      setAlertMessage("Veuillez sélectionner au moins un jour.");
      setAlertType("error");
      return false;
    }

    return true;
  };

  const handleCreateClick = () => {
    // Vérifier les sélections avant de continuer
    if (validateSelections()) {
      try {
        // Vérifier si un planning existe déjà pour le mois, l'année et le site sélectionnés
        const planningExists = plannings.some(
          (planning) =>
            planning.month === currentMonth + 1 &&
            parseInt(planning.year, 10) === currentYear &&
            planning.site_id === selectedSite.value
        );

        if (planningExists) {
          // Trouver le planning existant pour obtenir son ID
          const existingPlanning = plannings.find(
            (planning) =>
              planning.month === currentMonth + 1 &&
              parseInt(planning.year, 10) === currentYear &&
              planning.site_id === selectedSite.value
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
                onSuccess: () => {
                  // Vous pouvez décider de réactiver le bouton ou non selon la logique
                },
                onError: (error) => {
                  console.error("Erreur:", error);
                  // Réactiver le bouton en cas d'erreur, si nécessaire
                },
              });
            } else {
              // Afficher le formulaire pour créer un nouveau planning
              setIsFormVisible(false);
              setAlertMessage("");
            }
          }
        } else {
          // Aucun planning existant, afficher le formulaire
          setIsFormVisible(true);
          setAlertMessage("");
          setIsDisabled(true);

          const daysOfMonth = getAllDaysInMonth(currentMonth + 1, currentYear);

          console.log(daysOfMonth);

          // Créer des événements vides pour chaque jour du mois pour les utilisateurs sélectionnés
          const newEvents = siteUsers.flatMap((user) =>
            daysOfMonth.map((date) => {
              // Incrémenter le dernier ID (si vous avez un mécanisme pour gérer les ID)

              let lastId =
                events.length > 0
                  ? Math.max(...events.map((event) => event.id))
                  : 0;
              return {
                id: ++lastId,
                user_id: user.value, // ID utilisateur
                post: selectedPost,
                typePost: selectedTypePost,
                vacation_start: "", // Valeurs vides pour les événements vides
                vacation_end: "",
                pause_payment: "Non-payable", // Valeurs vides ou par défaut
                pause_start: "",
                pause_end: "",
                selected_days: date, // Date spécifique pour cet événement
                work_duration: "0:00", // Durée de travail par défaut
                night_hours: "0:00", // Heures de nuit par défaut
                holiday_hours: "0:00", // Heures fériées par défaut
                sunday_hours: "0:00", // Heures du dimanche par défaut
                isNull: true,
              };
            })
          );

          console.log(newEvents); // Vérifier les événements avant la mise à jour

          setEvents((prevEvents) => [...prevEvents, ...newEvents]);
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour des événements:", error);
        setAlertMessage(
          "Une erreur est survenue lors de la création du planning."
        );
        setAlertType("error");
        // Réactiver le bouton en cas d'erreur
      }
    }
  };

  const getWeekKey = (date) => {
    const start = startOfWeek(new Date(date), { weekStartsOn: 1 }); // Début de la semaine (lundi)
    const end = endOfWeek(new Date(date), { weekStartsOn: 1 }); // Fin de la semaine
    return `${format(start, "yyyy-MM-dd")} - ${format(end, "yyyy-MM-dd")}`;
  };

  const calculateWeeklyHours = () => {
    const weeklyHoursByAgent = {};
    events.forEach((event) => {
      const { user_id, work_duration, selected_days } = event;

      // Initialiser l'utilisateur si ce n'est pas déjà fait
      if (!weeklyHoursByAgent[user_id]) {
        weeklyHoursByAgent[user_id] = {};
      }

      // Extraire les heures et les minutes de la durée de travail
      const [hours, minutes] = work_duration.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes;

      // Obtenir la clé de la semaine pour cet événement
      const weekKey = getWeekKey(selected_days);

      // Initialiser la semaine si ce n'est pas encore fait
      if (!weeklyHoursByAgent[user_id][weekKey]) {
        weeklyHoursByAgent[user_id][weekKey] = 0;
      }

      // Ajouter la durée de travail en minutes à la semaine correspondante
      weeklyHoursByAgent[user_id][weekKey] += totalMinutes;
    });

    // Convertir les minutes en format HH:MM et retourner les heures hebdomadaires
    return Object.keys(weeklyHoursByAgent).map((user_id) => {
      const weeks = weeklyHoursByAgent[user_id];
      const weeksFormatted = Object.keys(weeks).map((weekKey) => {
        const totalMinutes = weeks[weekKey];
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return {
          week: weekKey,
          totalHours: `${hours}:${minutes.toString().padStart(2, "0")}`,
        };
      });

      return {
        user_id,
        weeklyHours: weeksFormatted,
      };
    });
  };

  // Fonction principale pour créer des événements pour les utilisateurs
  const createEventsForUsers = () => {
    // Valider les champs nécessaires avant de créer des événements
    if (!validateSelectionCreateEvent()) {
      return;
    }

    // Calculer la durée de la pause si elle n'est pas payable
    const breakDuration =
      pause_payment === "non"
        ? calculateDurationInMinutes(pause_start, pause_end)
        : 0;

    // Dernier ID utilisé (si nécessaire, récupérer l'ID le plus élevé existant)
    let lastId = 0;

    // Créer un ensemble des dates de jours fériés pour des recherches rapides
    const holidayDates = new Set(holidays.map((holiday) => holiday.date));

    // Obtenir les dimanches du mois en format YYYY-MM-DD
    const sundays = getSundays(currentMonth + 1, currentYear).map(
      (date) => date.toISOString().split("T")[0]
    );

    // Créer de nouveaux événements pour chaque utilisateur et chaque jour sélectionné
    const newEvents = selectedUsers.flatMap((user) =>
      selected_days.flatMap((date) => {
        // Créer les événements pour gérer le cas où la vacation traverse minuit
        const vacationEvents = createVacationEvents(
          vacation_start,
          vacation_end,
          date
        );

        return vacationEvents.map((vacationEvent) => {
          // Incrémenter le dernier ID
          const currentId = ++lastId;

          // Calculer la durée de travail ajustée pour chaque événement
          const adjustedWorkDuration =
            vacationEvent.work_duration - breakDuration;
          const hours = Math.floor(adjustedWorkDuration / 60);
          const minutes = adjustedWorkDuration % 60;
          const workDurationFormatted = `${hours}:${minutes
            .toString()
            .padStart(2, "0")}`;

          // Déterminer si la date est un jour férié ou un dimanche
          const isHoliday = holidayDates.has(vacationEvent.date);
          const isSunday = sundays.includes(vacationEvent.date);

          // Retourner un objet événement pour chaque combinaison utilisateur/date
          return {
            id: currentId,
            user_id: user.value, // ID utilisateur
            post: selectedPost,
            typePost: selectedTypePost,
            vacation_start: vacationEvent.start,
            vacation_end: vacationEvent.end,
            pause_payment: pause_payment === "oui" ? "Payable" : "Non-payable",
            pause_start,
            pause_end,
            selected_days: vacationEvent.date, // Date spécifique pour cet événement
            work_duration: workDurationFormatted, // Durée de travail ajustée
            night_hours: vacationEvent.night_hours, // Heures de nuit calculées pour ce segment
            holiday_hours: isHoliday ? workDurationFormatted : "0:00", // Heures fériées
            sunday_hours: isSunday ? workDurationFormatted : "0:00", // Heures du dimanche
          };
        });
      })
    );

    // Mettre à jour les événements existants en ajoutant les nouveaux
    setEvents((prevEvents) => [...prevEvents, ...newEvents]);

    // Réinitialiser le formulaire après la création des événements
    resetForm();

    // Afficher un message de succès
    setAlertMessage("Événements créés avec succès !");
    setAlertType("success");
  };

  // Fonction utilitaire pour vérifier les doublons
  const isDuplicateEvent = (newEvent) => {
    return events.some(
      (event) =>
        event.user_id === newEvent.user_id &&
        event.selected_days === newEvent.selected_days &&
        event.vacation_start === newEvent.vacation_start &&
        event.vacation_end === newEvent.vacation_end
    );
  };

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

  console.log("events", events);

  const handleEditEvent = (updatedEvent) => {
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

        // Retournez l'événement mis à jour avec la nouvelle durée et isNull = false
        return {
          ...updatedEvent,
          work_duration: workDurationFormatted,
          isNull: false, // Assurez-vous que isNull est défini sur false
        };
      }
      return event;
    });

    setEvents(updatedEvents);
  };

  const handleDeleteEvent = (eventToDelete) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventToDelete.id
          ? {
              ...event,
              isNull: true,
              post: "",
              typePost: "",
              vacation_start: "",
              vacation_end: "",
              pause_payment: "",
              pause_start: "",
              pause_end: "",
              selected_days: event.selected_days, // Garder selected_days inchangé
              work_duration: "0:00",
              night_hours: "0:00",
              holiday_hours: "0:00",
              sunday_hours: "0:00",
            }
          : event
      )
    );
  };

  const handleSavePlanning = () => {
    Inertia.post(route("plannings.store"), {
      site: selectedSite?.value,
      month: currentMonth + 1, // Convert to 1-based month
      year: currentYear,
      events: events,
    });
  };

  return (
    <AdminAuthenticatedLayout>
      <Head title="Cretion planning" />
      <NavBar />

      <div className="container mx-auto p-4 space-y-4">
        {/* Alert Message */}
        {alertMessage && alertType && (
          <Alert
            message={alertMessage}
            type={alertType}
            onClose={() => setAlertMessage("")}
          />
        )}

        {/* Select Section */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-4 sm:items-center sm:justify-between">
          <SelectSite
            siteOptions={siteOptions}
            handleSiteChange={handleSiteChange}
            isDisabled={isDisabled}
          />
          <SelectMonth
            monthOptions={monthOptions}
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
          <button
            onClick={handleCreateClick}
            className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-semibold"
          >
            Créer
          </button>
        </div>

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
                  {/* User Select and Agent Management */}
                  <UserSelect
                    siteUsers={siteUsers}
                    selectedUsers={selectedUsers}
                    handleUserChange={handleUserChange}
                    setShowAddUserModalVisible={setShowAddUserModalVisible}
                  />

                  <div className="bg-white border border-gray-300 rounded-md shadow-md p-1 space-y-2">
                    <button
                      onClick={() => setHolidayModalVisible(true)}
                      className="py-1 px-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-xs"
                    >
                      Ajouter un jour férié
                    </button>
                    <Calendarr
                      onDaysSelected={setSelectedDays}
                      holidays={holidays}
                      monthYear={{ month: currentMonth, year: currentYear }}
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
                </div>
              </>
            )}

            <div className="mt-4">
              <Table
                month={currentMonth + 1}
                year={currentYear}
                holidays={holidays}
                events={events}
                selectedSite={selectedSite}
                selected_days={selected_days}
                localPosts={localPosts}
                typePosts={typePosts}
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEvent}
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
                    : "hover:bg-green-700"
                } transition text`}
              >
                Sauvegarder
              </button>
            </div>
          </>
        )}

        {/* Modals */}
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

export default CreatePlanning;
