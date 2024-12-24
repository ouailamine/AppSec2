import React, { useState } from "react";

const NavBar = ({ isShowPage, onSavePlanning }) => {
  console.log(isShowPage);

  const [showConfirmChanges, setShowConfirmChanges] = useState(false);
  const [showSaveChanges, setShowSaveChanges] = useState(false);
  const [currentRoute, setCurrentRoute] = useState("");

  const handleNavigation = (e, route) => {
    // Lorsque l'utilisateur clique, on définit l'itinéraire actuel et on montre la première alerte
    setCurrentRoute(route);
    setShowConfirmChanges(true);
  };

  const handleConfirmChanges = (response) => {
    if (response) {
      // Si l'utilisateur a effectué des changements, demander si on veut les sauvegarder
      setShowConfirmChanges(false);
      setShowSaveChanges(true);
    } else {
      // Si aucun changement, continuer la navigation
      window.location.href = route(currentRoute); // Rediriger immédiatement
    }
  };

  const handleSaveChanges = (response) => {
    if (response) {
      console.log("444");
      onSavePlanning();
    } else {
      window.location.href = route(currentRoute);
      setShowSaveChanges(false);
    }
  };

  return (
    <>
      <nav className="bg-gray-600 p-1 shadow-lg">
        <div className="container mx-auto flex justify-center space-x-6">
          {/* Lien vers "Recherche un planning" avec confirmation */}
          <a
            href="#"
            onClick={(e) => handleNavigation(e, "plannings.index")}
            className="text-white text-md font-medium py-2 px-6 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-300 ease-in-out"
          >
            Recherche un planning
          </a>

          {/* Lien conditionnel vers "Crée un planning" avec confirmation */}
          {isShowPage && (
            <a
              href="#"
              onClick={(e) => handleNavigation(e, "plannings.create")}
              className="text-white text-md font-medium py-2 px-6 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-300 ease-in-out"
            >
              Crée un planning
            </a>
          )}
        </div>
      </nav>

      {/* Première modale : Demander si des changements ont été effectués */}
      {showConfirmChanges && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-2 rounded-lg shadow-lg ">
            <p className="text-lg mb-4">Avez-vous effectué des changements ?</p>
            <div className="flex justify-between">
              <button
                onClick={() => handleConfirmChanges(true)}
                className="px-2 py-1 bg-green-500 text-white rounded-lg"
              >
                Oui
              </button>
              <button
                onClick={() => handleConfirmChanges(false)}
                className="px-2 py-1 bg-red-500 text-white rounded-lg"
              >
                Non
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deuxième modale : Demander si l'utilisateur veut sauvegarder les changements */}
      {showSaveChanges && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <p className="text-lg mb-4">
              Voulez-vous sauvegarder les changements ?
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => handleSaveChanges(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Oui
              </button>
              <button
                onClick={() => handleSaveChanges(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Non
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
