import React, { useState, useEffect } from "react";

const AddEvent = ({
  onClose,
  typePosts,
  posts,
  currentMonth,
  currentYear,
  holidays,
  add,
}) => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTypePost, setSelectedTypePost] = useState("");
  const [selectedPost, setSelectedPost] = useState("");
  const [vacationStart, setVacationStart] = useState("");
  const [vacationEnd, setVacationEnd] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [pauseStart, setPauseStart] = useState("");
  const [pauseEnd, setPauseEnd] = useState("");
  const [pausePayment, setPausePayment] = useState("oui");
  const [errors, setErrors] = useState({});
  const[guardNumber,setGuardNumber] =useState(1)

  const validateForm = () => {
    const newErrors = {};
    if (!selectedTypePost) newErrors.selectedTypePost = " c'est requis";
    if (!selectedPost) newErrors.selectedPost = " c'est requis";
    if (selectedDays.length === 0) newErrors.selectedDays = " c'est requis";
    if (!vacationStart) newErrors.vacationStart = " c'est requis";
    if (!vacationEnd) newErrors.vacationEnd = " c'est requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month - 1, 1);
    const daysInMonth = [];

    while (date.getMonth() === month - 1) {
      daysInMonth.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return daysInMonth;
  };

  useEffect(() => {
    if (selectedTypePost) {
      // Filter posts based on the selected type
      const filtered = posts.filter(
        (post) => post.type_post_id == selectedTypePost
      );

      setFilteredPosts(filtered);
    } else {
      setFilteredPosts([]); // If no type is selected, reset posts
    }
  }, [selectedTypePost, posts]);
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDayChange = (date) => {
    const formattedDate = formatDate(date);
    const dayExists = selectedDays.includes(formattedDate);

    if (dayExists) {
      setSelectedDays((prevSelectedDays) =>
        prevSelectedDays.filter((d) => d !== formattedDate)
      );
    } else {
      setSelectedDays((prevSelectedDays) => [
        ...prevSelectedDays,
        formattedDate,
      ]);
    }
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const isHoliday = (date) => {
    return holidays.some((holiday) => {
      const holidayDate = new Date(holiday.date);
      return (
        holidayDate.getDate() === date.getDate() &&
        holidayDate.getMonth() === date.getMonth()
      );
    });
  };

  const deselectAllDays = () => {
    setSelectedDays([]);
  };

  const handleTypePostChange = (e) => {
    setSelectedTypePost(e.target.value);
    setSelectedPost(""); // Reset selected post when type changes
  };

  const handlepausePaymentChange = (e) => {
    setPausePayment(e.target.value);
  };
  const handlePostChange = (e) => {
    setSelectedPost(e.target.value);
  };

  const handleAddEvent = () => {
    if (validateForm()) {
      const newEvent = {
        selectedUsersDays: selectedDays,
        post: selectedPost,
        typePost: selectedTypePost,
        vacation_start: vacationStart,
        vacation_end: vacationEnd,
        pause_start: pauseStart,
        pause_end: pauseEnd,
        pause_payment: pausePayment,
        guardNumber :guardNumber
      };

      add(newEvent);
      /*console.log("Selected Days:", selectedDays);
      console.log("Selected Post:", selectedPost);
      console.log("Selected Type Post:", selectedTypePost);
      console.log("Vacation Start:", vacationStart);
      console.log("Vacation End:", vacationEnd);
      console.log("Pause Start:", pauseStart);
      console.log("Pause End:", pauseEnd);
      console.log("Pause Payment:", pausePayment);*/
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center w-100 z-50 bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Ajouter un événement</h2>
        <div className="mb-2 p-2 border">
          {/* Legend Section */}
          <div className="mt-2 p-2">
            <div className="flex gap-4">
              <div className="flex items-center">
                <span className="text-sm font-bold text-gray-700">
                  Légende :
                </span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-red-100 border border-red-500 rounded-md"></div>
                <span className="text-sm">Weekends (Samedi & Dimanche)</span>
              </div>

              <div className="flex items-center">
                <div className="h-3 w-3 bg-green-300 border border-green-500 rounded-md"></div>
                <span className="text-sm">Jours fériés</span>
              </div>
            </div>
          </div>
          <hr className="m-2" />

          {/* Days Selection */}
          <label className="block text-sm font-bold text-center text-gray-700 mb-1 bg-gray-300">
            Sélectionner des jours
          </label>
          <div className="flex flex-col gap-2">
            {/* Première ligne : Jours du 1 au 15 */}
            <div className="flex flex-wrap justify-center gap-1">
              {getDaysInMonth(currentYear, currentMonth)
                .slice(0, 15) // Les 15 premiers jours
                .map((date) => (
                  <div
                    key={date.getTime()}
                    className="flex flex-col items-center w-10"
                  >
                    <label
                      htmlFor={`day-${date.getTime()}`}
                      className={`text-sm text-gray-700 mb-1 ${
                        isWeekend(date) ? "text-red-500" : ""
                      } ${isHoliday(date) ? "text-green-500" : ""}`}
                    >
                      {String(date.getDate()).padStart(2, "0")}
                    </label>
                    <input
                      type="checkbox"
                      id={`day-${date.getTime()}`}
                      checked={selectedDays.includes(formatDate(date))}
                      onChange={() => handleDayChange(date)}
                      className={`h-4 w-4 text-blue-600 border-gray-300 rounded ${
                        isWeekend(date) ? "bg-red-100" : ""
                      } ${isHoliday(date) ? "bg-green-200" : ""}`}
                    />
                  </div>
                ))}
            </div>

            {/* Deuxième ligne : Jours du 16 à la Fin : du mois */}
            <div className="flex flex-wrap justify-center gap-1">
              {getDaysInMonth(currentYear, currentMonth)
                .slice(15) // Du 16 à la Fin : du mois
                .map((date) => (
                  <div
                    key={date.getTime()}
                    className="flex flex-col items-center w-10"
                  >
                    <label
                      htmlFor={`day-${date.getTime()}`}
                      className={`text-sm text-gray-700 mb-1 ${
                        isWeekend(date) ? "text-red-500" : ""
                      } ${isHoliday(date) ? "text-green-500" : ""}`}
                    >
                      {String(date.getDate()).padStart(2, "0")}
                    </label>
                    <input
                      type="checkbox"
                      id={`day-${date.getTime()}`}
                      checked={selectedDays.includes(formatDate(date))}
                      onChange={() => handleDayChange(date)}
                      className={`h-4 w-4 text-blue-600 border-gray-300 rounded ${
                        isWeekend(date) ? "bg-red-100" : ""
                      } ${isHoliday(date) ? "bg-green-200" : ""}`}
                    />
                  </div>
                ))}
            </div>
          </div>
          {errors.selectedDays && (
            <div className="text-red-500 text-sm font-bold">
              {errors.selectedDays}
            </div>
          )}

          <hr className="m-2" />

          {/* Display selected days */}
          <div className="mb-2">
            <h3 className="text-sm font-bold text-gray-700">
              Jours sélectionnés
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedDays.length === 0 ? (
                <div className="text-sm text-gray-600">
                  Aucun jour sélectionné
                </div>
              ) : (
                // Sorting the selectedDays array before mapping
                selectedDays
                  .sort((a, b) => new Date(a) - new Date(b)) // Sorting in ascending order
                  .map((date, index) => {
                    const formattedDate = new Date(date).toLocaleDateString(
                      "fr-FR",
                      {
                        day: "2-digit",
                        month: "2-digit",
                      }
                    );
                    return (
                      <div
                        key={index}
                        className="text-xs text-white  border bg-blue-500 rounded-md p-1"
                      >
                        {formattedDate}
                      </div>
                    );
                  })
              )}
            </div>
          </div>

          {/* Deselect All Button */}
          <div className="mb-2">
            <button
              onClick={deselectAllDays}
              className="px-2 py-1 bg-red-500 text-[10px] text-white rounded-md hover:bg-red-600"
            >
              Désélectionner tout
            </button>
          </div>

          <hr className="m-2" />

          {/* Vacation and Pause on the Same Row (Two Columns) */}
          <div className="mb-2 flex gap-4">
            {/* Post Section */}
            <div className="flex-1 border p-2">
              <label className="block text-sm font-bold text-balck text-center bg-gray-300">
                Poste
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  {/* Type of Post Select */}
                  <label className="block text-sm  text-gray-700">
                    Type de Post:
                  </label>
                  <select
                    className="mt-1 block w-30 border-gray-300 rounded-md shadow-sm text-sm"
                    onChange={handleTypePostChange}
                    value={selectedTypePost}
                  >
                    <option value="">Sélectionner un type de post</option>
                    {typePosts.map((typePost) => (
                      <option key={typePost.id} value={typePost.id}>
                        {typePost.name}
                      </option>
                    ))}
                  </select>
                  {errors.selectedTypePost && (
                    <div className="text-red-500 text-sm font-bold">
                      {errors.selectedTypePost}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  {/* Post Select */}
                  <label className="block text-sm text-gray-700 text-center">
                    Post:
                  </label>
                  <select
                    className="mt-1 block w-30 border-gray-300 rounded-md shadow-sm text-sm"
                    onChange={handlePostChange}
                    value={selectedPost}
                    disabled={!selectedTypePost} // Disable if no type is selected
                  >
                    <option value="">Sélectionner un post</option>
                    {filteredPosts.map((post) => (
                      <option key={post.id} value={post.abbreviation}>
                        {post.name}
                      </option>
                    ))}
                  </select>
                  {errors.selectedPost && (
                    <div className="text-red-500 text-sm font-bold">
                      {errors.selectedPost}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  {/* Post Select */}
                  <label className="block text-sm text-gray-700 text-center">
                    Nombre:
                  </label>
                  
                  <input 
                  type="number"
                  id="guardNumber"
                  value={guardNumber}
                  onChange={(e) => setGuardNumber(e.target.value)}
                  className="mt-1 block w-20 border-gray-300 rounded-md shadow-sm text-sm"/>


                </div>
              </div>
            </div>

            {/* Vacation Section */}
            <div className="flex-1 border p-2">
              <label className="block text-sm font-bold text-balck text-center bg-gray-300 ">
                Vacation
              </label>
              <div className="flex gap-2">
                <div className="flex-0">
                  <label
                    htmlFor="vacation-start"
                    className="block text-sm  text-gray-700"
                  >
                    Début :
                  </label>
                  <input
                    type="time"
                    id="vacation-start"
                    value={vacationStart}
                    onChange={(e) => setVacationStart(e.target.value)}
                    className="mt-1 block w-24 border-gray-300 rounded-md shadow-sm text-sm"
                  />
                  {errors.vacationStart && (
                    <div className="text-red-500 text-sm font-bold">
                      {errors.vacationStart}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="vacation-end"
                    className="block text-sm  text-gray-700"
                  >
                    Fin :
                  </label>
                  <input
                    type="time"
                    id="vacation-end"
                    value={vacationEnd}
                    onChange={(e) => setVacationEnd(e.target.value)}
                    className="mt-1 block w-24 border-gray-300 rounded-md shadow-sm text-sm"
                  />
                  {errors.vacationEnd && (
                    <div className="text-red-500 text-sm font-bold">
                      {errors.vacationEnd}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pause Section */}
            <div className="flex-1 border p-2">
              <label className="block text-sm font-bold text-balck text-center bg-gray-300">
                Pause
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label
                    htmlFor="pause-start"
                    className="block text-sm  text-gray-700"
                  >
                    Début :
                  </label>
                  <input
                    type="time"
                    id="pause-start"
                    value={pauseStart}
                    onChange={(e) => setPauseStart(e.target.value)}
                    className="mt-1 block w-24 border-gray-300 rounded-md shadow-sm text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="pause-end"
                    className="block text-sm  text-gray-700"
                  >
                    Fin :
                  </label>
                  <input
                    type="time"
                    id="pause-end"
                    value={pauseEnd}
                    onChange={(e) => setPauseEnd(e.target.value)}
                    className="mt-1 block w-24 border-gray-300 rounded-md shadow-sm text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm  text-gray-700">
                    Pause payée:
                  </label>
                  <select
                    className="mt-1 block w-24 border-gray-300 rounded-md shadow-sm text-sm"
                    onChange={handlepausePaymentChange}
                    value={selectedTypePost}
                  >
                    <option value="">Sélectionner </option>

                    <option value={"oui"}>oui</option>
                    <option value={"non"}>non</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-3 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 active:bg-red-700 transition duration-300 ease-in-out"
        >
          Fermer
        </button>{" "}
        <button
          onClick={() => handleAddEvent()}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 active:bg-blue-700 transition duration-300 ease-in-out"
        >
          Ajouter
        </button>
      </div>
    </div>
  );
};

export default AddEvent;
