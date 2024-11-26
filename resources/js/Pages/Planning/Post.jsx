import React, { useState, useEffect } from "react";

const CreatePost = ({ typePosts = [], posts = [], onPostDataChange }) => {
  // State Management
  const [selectedTypePost, setSelectedTypePost] = useState("");
  const [selectedPost, setSelectedPost] = useState("");
  const [vacationStart, setVacationStart] = useState("");
  const [vacationEnd, setVacationEnd] = useState("");
  const [pausePayment, setPausePayment] = useState("non");
  const [pauseStart, setPauseStart] = useState("");
  const [pauseEnd, setPauseEnd] = useState("");

  // Function to update parent component with current state
  useEffect(() => {
    onPostDataChange({
      selectedTypePost,
      selectedPost,
      vacationStart,
      vacationEnd,
      pausePayment,
      pauseStart,
      pauseEnd,
    });
  }, [
    selectedTypePost,
    selectedPost,
    vacationStart,
    vacationEnd,
    pausePayment,
    pauseStart,
    pauseEnd,
  ]);

  return (
    <div className="space-y-4">
      {/* Type de poste Section */}
      <div className="bg-white border border-gray-300 rounded-md shadow-sm p-3 min-h-[200px]">
        <h2 className="text-lg font-semibold mb-2">Poste</h2>
        <div>
          <label
            htmlFor="typePost"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Type de poste:
          </label>
          <select
            id="typePost"
            value={selectedTypePost}
            onChange={(e) => setSelectedTypePost(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Sélectionner un type</option>
            {typePosts.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>

          <label
            htmlFor="post"
            className="block text-sm font-medium text-gray-700 mb-1 mt-3"
          >
            Le poste:
          </label>
          <select
            id="post"
            value={selectedPost}
            onChange={(e) => setSelectedPost(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">Sélectionner un poste</option>
            {posts.map((post) => (
              <option key={post.id} value={post.abbreviation}>
                {post.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Horaires Section */}
      <div className="bg-white border border-gray-300 rounded-md shadow-sm p-3 min-h-[200px]">
        <h2 className="text-lg font-semibold mb-2">Horaires</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <div className="flex-1">
            <label
              htmlFor="vacation_start"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Début :
            </label>
            <input
              type="time"
              id="vacation_start"
              value={vacationStart}
              onChange={(e) => setVacationStart(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="vacation_end"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fin :
            </label>
            <input
              type="time"
              id="vacation_end"
              value={vacationEnd}
              onChange={(e) => setVacationEnd(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </div>

      {/* Pause Section */}
      <div className="bg-white border border-gray-300 rounded-md shadow-sm p-4 min-h-[200px]">
        <h2 className="text-lg font-semibold mb-2">Pause</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <div className="flex-1">
            <label
              htmlFor="pause_payment"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pause Payable :
            </label>
            <select
              id="pause_payment"
              value={pausePayment}
              onChange={(e) => setPausePayment(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="non">Non-payable</option>
              <option value="oui">Payable</option>
            </select>
          </div>
          <div className="flex-1">
            <label
              htmlFor="pause_start"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Heure de début :
            </label>
            <input
              type="time"
              id="pause_start"
              value={pauseStart}
              onChange={(e) => setPauseStart(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="pause_end"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fin :
            </label>
            <input
              type="time"
              id="pause_end"
              value={pauseEnd}
              onChange={(e) => setPauseEnd(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
