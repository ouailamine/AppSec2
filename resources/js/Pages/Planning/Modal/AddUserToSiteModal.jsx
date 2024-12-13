import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Select from "react-select";

const AddUserModal = ({
  onAddUser,
  isOpen,
  onClose,
  users,
  selectedSite,
  siteUsers,
  sites,
  localSiteUsers,
}) => {
  console.log(localSiteUsers);
  const [firstList, setFirstList] = useState([]);
  const [secondList, setSecondList] = useState([]);
  const [selectedFromSecondList, setSelectedFromSecondList] = useState([]);
  const [selectedFromAllUsers, setSelectedFromAllUsers] = useState([]);

  // Initialiser les listes à partir des props `siteUsers`
  useEffect(() => {
    if (siteUsers?.firstList && siteUsers?.secondList) {
      setFirstList(localSiteUsers);

      // Filtrer les utilisateurs qui ne sont pas dans localSiteUsers
      const filteredSecondList = siteUsers.secondList.filter(
        (user) => !localSiteUsers.some((localUser) => localUser.id === user.id)
      );

      setSecondList(filteredSecondList);
    }
  }, [siteUsers, localSiteUsers]);

  // Récupérer le nom du site sélectionné
  const siteName = sites.find((site) => site.id === selectedSite)?.name || "";

  // Filtrer les utilisateurs pour exclure ceux de `firstList` et `secondList`
  const availableUsers = users.filter(
    (user) =>
      !firstList.some((u) => u.id === user.id) &&
      !secondList.some((u) => u.id === user.id)
  );

  // Gestion de l'ajout des utilisateurs de la seconde liste vers la première
  const handleAddToFirstList = () => {
    if (selectedFromSecondList.length === 0) {
      alert("Aucun utilisateur sélectionné dans la liste secondaire.");
      return;
    }

    const selectedUsers = secondList.filter((user) =>
      selectedFromSecondList.includes(user.id)
    );

    setFirstList([...firstList, ...selectedUsers]);
    setSecondList(
      secondList.filter((user) => !selectedFromSecondList.includes(user.id))
    );
    setSelectedFromSecondList([]);
  };

  // Gestion de l'ajout des utilisateurs de la liste complète vers la première
  const handleAddFromAllUsers = () => {
    if (selectedFromAllUsers.length === 0) {
      alert("Aucun utilisateur sélectionné dans la liste complète.");
      return;
    }

    const selectedUsers = availableUsers.filter((user) =>
      selectedFromAllUsers.includes(user.id)
    );

    setFirstList([...firstList, ...selectedUsers]);
    setSelectedFromAllUsers([]);
  };

  if (!isOpen) return null;

  const handleAddLocalUsers = () => {
    console.log(firstList);
    onAddUser(firstList);
    onClose();
  };

  const handleInitUsers = () => {
    setFirstList(siteUsers.firstList);
    setSecondList(siteUsers.secondList);
  };

  // Définir le style personnalisé pour react-select
  const customStyles = {
    menu: (provided) => ({
      ...provided,
      zIndex: 50, // Assurez-vous que la liste reste au-dessus de la modal
      maxHeight: "200px", // Limiter la hauteur de la liste
      overflowY: "auto", // Activer le défilement si nécessaire
      backgroundColor: "#fff", // Fond blanc pour correspondre à Tailwind
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Ombre légère pour correspondre à Tailwind
      borderRadius: "0.375rem", // Border-radius Tailwind `rounded-md`
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 50, // Utiliser un z-index supérieur à celui de la modal (par défaut Tailwind utilise 50 pour modals)
    }),
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity duration-300">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto mb-4">
        {/* Titre */}
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
          Ajouter de(s) agent(s) au site{" "}
          <span className="text-blue-600">{siteName}</span>
        </h2>

        {/* Liste principale */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-4 text-gray-700">
            Liste principale
          </h3>
          <div className="grid grid-cols-4 border border-gray-300 p-2 rounded-md bg-green-50 shadow-sm">
            {firstList &&
              firstList.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between"
                >
                  <span className="text-gray-900 text-xs font-bold">
                    {`${index + 1}. ${user.fullname} ${user.firstname}`}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Liste secondaire */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2 text-gray-700">
            Liste secondaire
          </h3>
          <div className="flex items-center gap-4">
            <Select
              isMulti
              options={secondList
                .filter(
                  (user) =>
                    !firstList.some((firstUser) => firstUser.id === user.id)
                )
                .map((user) => ({
                  value: user.id,
                  label: `${user.fullname} (${user.firstname})`,
                }))}
              onChange={(selectedOptions) =>
                setSelectedFromSecondList(
                  selectedOptions.map((option) => option.value)
                )
              }
              className="flex-grow shadow-sm"
              placeholder="Sélectionnez des utilisateurs à ajouter"
            />

            <button
              onClick={handleAddToFirstList}
              disabled={selectedFromSecondList.length === 0}
              className={`px-4 py-2 text-sm rounded-md transition ${
                selectedFromSecondList.length === 0
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Ajouter
            </button>
          </div>
        </div>

        {/* Tous les utilisateurs */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2 text-gray-700">
            Tous les utilisateurs
          </h3>
          <div className="flex items-center gap-4">
            <Select
              isMulti
              options={availableUsers.map((user) => ({
                value: user.id,
                label: `${user.fullname} (${user.firstname})`,
              }))}
              onChange={(selectedOptions) =>
                setSelectedFromAllUsers(
                  selectedOptions.map((option) => option.value)
                )
              }
              styles={customStyles}
              menuPortalTarget={document.body} // Place le menu directement dans le body
              className="flex-grow shadow-sm"
              placeholder="Sélectionnez des utilisateurs de la liste complète"
            />

            <button
              onClick={handleAddFromAllUsers}
              disabled={selectedFromAllUsers.length === 0}
              className={`px-4 py-2 text-sm rounded-md transition ${
                selectedFromAllUsers.length === 0
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Ajouter
            </button>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleAddLocalUsers}
            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            Ajouter
          </button>
          <button
            onClick={handleInitUsers}
            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            Initialisé
          </button>
        </div>
      </div>
    </div>
  );
};

AddUserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      fullname: PropTypes.string.isRequired,
      firstname: PropTypes.string,
    })
  ).isRequired,
  selectedSite: PropTypes.number.isRequired,
  siteUsers: PropTypes.shape({
    firstList: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        fullname: PropTypes.string.isRequired,
        firstname: PropTypes.string,
      })
    ),
    secondList: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        fullname: PropTypes.string.isRequired,
        firstname: PropTypes.string,
      })
    ),
  }).isRequired,
  sites: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default AddUserModal;
