import React, { useState } from "react";
import PosteSection from "./import/PosteSection";
import HorairesSection from "./import/HorairesSection";
import PauseSection from "./import/PauseSection";
import UserSelect from "./import/UserSelect";
import Calendar from "./Calendar";

const DaysPostsVacationSelect = ({
  posts = [],
  typePosts = [],
  holidays = [],
  month,
  year,
  users,
  siteUsers,
  createEventsForUsers,
  onClose,
  onAddNewUser,
}) => {
  console.log(typePosts, posts);
  const [vacation_start, setVacationStart] = useState("");
  const [vacation_end, setVacationEnd] = useState("");
  const [pause_start, setPauseStart] = useState("");
  const [pause_end, setPauseEnd] = useState("");
  const [pause_payment, setPausePayment] = useState("noBreak");
  const [selectedPost, setSelectedPost] = useState("");
  const [selectedTypePost, setSelectedTypePost] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedUsers, setSelectedusers] = useState([]);
  const [localSiteUsers, setLocalSiteUsers] = useState(siteUsers);

  const [resetCalendar, setResetCalendar] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});

  const handleAddUsers = (newLocalUsersIds) => {
    const updateLocaleSiteUsers = users.filter((user) =>
      newLocalUsersIds.includes(user.id)
    );
    setLocalSiteUsers(updateLocaleSiteUsers);
    onAddNewUser(updateLocaleSiteUsers);
  };

  const handlePostChange = (e) => setSelectedPost(e.target.value);
  const handleTypePostChange = (event) => {
    setSelectedTypePost(event.target.value);
  };

  const validateForm = () => {
    const errors = {};
    if (selectedUsers.length === 0) {
      errors.users = "Veuillez sélectionner au moins un utilisateur.";
    }
    if (selectedDays.length === 0) {
      errors.days = "Veuillez sélectionner au moins un jour.";
    }
    if (!selectedPost) {
      errors.post = "Veuillez sélectionner un poste.";
    }
    if (!selectedTypePost) {
      errors.typePost = "Veuillez sélectionner un type de poste.";
    }
    if (!vacation_start || !vacation_end) {
      errors.vacation = "Veuillez définir les horaires de vacation.";
    }

    setErrorMessages(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateEvents = () => {
    if (!validateForm()) {
      return;
    }

    const selectedUsersDays = selectedUsers.flatMap((user_id) =>
      selectedDays.map((selectedDay) => ({
        user_id: user_id,
        selected_days: selectedDay,
      }))
    );

    const newEvent = {
      selectedUsersDays, // tableau construit
      vacation_start: vacation_start,
      vacation_end: vacation_end,
      pause_start: pause_start,
      pause_end: pause_end,
      pause_payment: pause_payment,
      post: selectedPost,
      typePost: selectedTypePost,
    };

    console.log(newEvent);

    createEventsForUsers(newEvent);
    onClose();
  };

  return (
    <div>
      <div className="bg-white border border-gray-900 rounded-md shadow-md p-2 space-y-2">
        <UserSelect
          siteUsers={localSiteUsers}
          onUsersSelected={setSelectedusers}
        />
        {errorMessages.users && (
          <p className="text-red-600 font-bold text-sm">
            {errorMessages.users}
          </p>
        )}

        <div className="bg-white border border-gray-300 rounded-md shadow-md p-1 space-y-2">
          <Calendar
            onDaysSelected={setSelectedDays}
            holidays={holidays}
            month={month}
            year={year}
            resetCalendar={resetCalendar}
            siteUsers={siteUsers}
          />
          {errorMessages.days && (
            <p className="text-red-600 font-bold text-sm">
              {errorMessages.days}
            </p>
          )}
        </div>

        <div className="flex space-x-4">
          <div className="flex-1" style={{ flexBasis: "40%" }}>
            <PosteSection
              typePosts={typePosts}
              posts={posts}
              selectedTypePost={selectedTypePost}
              handleTypePostChange={handleTypePostChange}
              listPosts={posts}
              selectedPost={selectedPost}
              handlePostChange={handlePostChange}
            />
            {errorMessages.post && (
              <p className="text-red-600 font-bold text-sm">
                {errorMessages.post}
              </p>
            )}
            {errorMessages.typePost && (
              <p className="text-red-600 font-bold text-sm">
                {errorMessages.typePost}
              </p>
            )}
          </div>

          <div className="flex-1" style={{ flexBasis: "20%" }}>
            <HorairesSection
              vacation_start={vacation_start}
              setVacationStart={setVacationStart}
              vacation_end={vacation_end}
              setVacationEnd={setVacationEnd}
            />
            {errorMessages.vacation && (
              <p className="text-red-600 font-bold text-sm">
                {errorMessages.vacation}
              </p>
            )}
          </div>

          <div className="flex-1" style={{ flexBasis: "40%" }}>
            <PauseSection
              pause_payment={pause_payment}
              setPausePayment={setPausePayment}
              setPauseStart={setPauseStart}
              setPauseEnd={setPauseEnd}
              pause_start={pause_start}
              pause_end={pause_end}
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors text-sm font-semibold"
          >
            Annuler
          </button>
          <button
            onClick={handleCreateEvents}
            className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors text-sm font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <span className="inline-flex items-center">Ajouter</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DaysPostsVacationSelect;
