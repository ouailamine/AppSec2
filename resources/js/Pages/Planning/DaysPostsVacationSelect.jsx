import React, { useState, useMemo, useEffect } from "react";
import PosteSection from "./import/PosteSection";
import HorairesSection from "./import/HorairesSection";
import PauseSection from "./import/PauseSection";
import UserSelect from "./import/UserSelect";
import Calendar from "./Calendar";
import PostTypeModal from "./Modal/AddPostModal";

const DaysPostsVacationSelect = ({
  selectedSite,
  sites = [],
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
  const [showAddPostModal, setShowAddPostModal] = useState(false);

  const [resetCalendar, setResetCalendar] = useState(false);

  console.log(localSiteUsers);

  const handleAddUsers = (newLocalUsersIds) => {
    console.log(newLocalUsersIds);
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

  const handleCreateEvents = () => {
    const newEvent = {
      user_id: selectedUsers,
      vacationStart: vacation_start,
      vacationEnd: vacation_end,
      pauseStart: pause_start,
      pauseEnd: pause_end,
      pausePayment: pause_payment,
      selectedPost,
      selectedTypePost,
      selectedDays,
    };
    console.log(newEvent);

    //    createEventsForUsers();
  };

  console.log(selectedUsers);

  return (
    <div>
      <div className="bg-white border border-gray-900 rounded-md shadow-md p-2 space-y-2">
        <div className="flex items-center justify-center">
          <div className="flex space-x-2">
            <button
              onClick={() => setShowAddPostModal(true)}
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors text-xs font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              aria-label="Ajouter un post"
            >
              <span className="mr-2">✍️</span> Ajouter un Post (provisoire)
            </button>
          </div>
        </div>

        <UserSelect
          siteUsers={localSiteUsers}
          onUsersSelected={setSelectedusers}
          //handleUserChange={handleUserChange}
          //setShowAddUserModal={setShowAddUserModal}
        />

        <div className="bg-white border border-gray-300 rounded-md shadow-md p-1 space-y-2">
          <Calendar
            onDaysSelected={setSelectedDays}
            holidays={holidays}
            month={month}
            year={year}
            resetCalendar={resetCalendar}
            siteUsers={siteUsers}
          />
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
            aria-label="Annuler l'ajout de vacations"
          >
            Annuler
          </button>
          <button
            onClick={handleCreateEvents}
            className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors text-sm font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            aria-label="Ajouter des vacations"
          >
            <span className="inline-flex items-center">
              <span className="mr-2">➕</span> Ajouter vacation(s)
            </span>
          </button>
        </div>
      </div>

      <PostTypeModal
        open={showAddPostModal}
        onClose={() => setShowAddPostModal(false)}
        //onAddPost={handleAddPost}
        typePosts={typePosts}
      />
    </div>
  );
};

export default DaysPostsVacationSelect;
