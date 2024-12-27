import React, { useState, useEffect } from "react";

import PosteSection from "./import/PosteSection";
import HorairesSection from "./import/HorairesSection";
import PauseSection from "./import/PauseSection";
import {createAutoEventsForUsers} from './CreatEventAutoFunction'

const CreateAutoEvents = ({
    siteUsers,
    posts,
    typePosts,
    currentMonth,
    currentYear,
    onSubmit,
    open,
    onClose,
    onAddAutoEvent
  }) => {

    const [selectedTypePost, setSelectedTypePost] = useState("");
    const [selectedPost, setSelectedPost] = useState("");
    const [vacationStart, setVacationStart] = useState("");
    const [vacationEnd, setVacationEnd] = useState("");
    const [pauseStart, setPauseStart] = useState("");
    const [pauseEnd, setPauseEnd] = useState("");
    const [pausePayment, setPausePayment] = useState("yes"); // Default to "yes"
    const [monthlyHours, setmonthlyHours] = useState(160);
    const [maxWeeklyHours, setMaxWeeklyHours] = useState(40);
    const [agentsPerDay, setAgentsPerDay] = useState(1);
  
    // Function to filter posts based on selected typePost
    const filteredPosts = posts.filter(
      (post) => post.type_post_id == selectedTypePost
    );
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      const autoEvents = createAutoEventsForUsers({
        users: siteUsers,
        month: currentMonth,
        year: currentYear,
        typePost: selectedTypePost,
        post: selectedPost,
        vacationStart,
        vacationEnd,
        pauseStart,
        pauseEnd,
        monthlyHours,
        maxWeeklyHours,
        agentsPerDay
      });
      console.log(autoEvents)
      
      //onAddAutoEvent(autoEvents)
    };
  
    if (!open) return null;
  
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={onClose}
        ></div>
  
        {/* Modal Content */}
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full max-h-screen overflow-auto">
            <h2 className="text-xl font-semibold mb-4">
              Créer des événements automatiques
            </h2>
  
            <form onSubmit={handleSubmit}>
              {/* Type de poste and Poste in the same line */}
              <div className="mb-4 flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Type de poste :
                  </label>
                  <select
                    value={selectedTypePost}
                    onChange={(e) => setSelectedTypePost(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Sélectionner un type</option>
                    {typePosts.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
  
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Poste :
                  </label>
                  <select
                    value={selectedPost}
                    onChange={(e) => setSelectedPost(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    disabled={!selectedTypePost} // Disable if no typePost is selected
                  >
                    <option value="">Sélectionner un poste</option>
                    {filteredPosts.length > 0 ? (
                      filteredPosts.map((post) => (
                        <option key={post.id} value={post.id}>
                          {post.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>Aucun poste disponible</option>
                    )}
                  </select>
                </div>
              </div>
  
              {/* Vacation Start and End in the same line */}
              <div className="mb-4 flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Début des vacances :
                  </label>
                  <input
                    type="time"
                    value={vacationStart}
                    onChange={(e) => setVacationStart(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
  
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Fin des vacances :
                  </label>
                  <input
                    type="time"
                    value={vacationEnd}
                    onChange={(e) => setVacationEnd(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
  
              {/* Pause Payment */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Paiement de la pause :
                </label>
                <select
                  value={pausePayment}
                  onChange={(e) => setPausePayment(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="yes">Oui</option>
                  <option value="no">Non</option>
                  <option value="none">Pas de pause</option> {/* New option */}
                </select>
              </div>
  
              {/* Render Pause Time fields only if 'Oui' or 'Non' is selected for Pause Payment */}
              {(pausePayment === "yes" || pausePayment === "no") && (
                <div>
                  {/* Pause Start and End in the same line */}
                  <div className="mb-4 flex space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">
                        Heure de début de la pause :
                      </label>
                      <input
                        type="time"
                        value={pauseStart}
                        onChange={(e) => setPauseStart(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
  
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">
                        Heure de fin de la pause :
                      </label>
                      <input
                        type="time"
                        value={pauseEnd}
                        onChange={(e) => setPauseEnd(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              )}
  
              {/* Max Monthly and Weekly Hours */}
              <div className="mb-4 flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Hrs max par mois :
                  </label>
                  <input
                    type="number"
                    value={monthlyHours}
                    onChange={(e) => setmonthlyHours(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
  
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Hrs max par semaine :
                  </label>
                  <input
                    type="number"
                    value={maxWeeklyHours}
                    onChange={(e) => setMaxWeeklyHours(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Agents par jour :
                </label>
                <input
                  type="number"
                  value={agentsPerDay}
                  onChange={(e) => setAgentsPerDay(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="1"
                />
              </div>
              </div>
  
             
  
              {/* Buttons */}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md"
                >
                  Créer les événements
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  };
  
  export default CreateAutoEvents;
  
