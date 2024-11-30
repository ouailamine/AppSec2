import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Select from "react-select";

const AddUserModal = ({
  isOpen,
  onClose,
  onAddUser,
  users,
  selectedSite,
  siteUsers,
  sites,
  localSiteUsers,
}) => {


  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showVacancyInput, setShowVacancyInput] = useState(false);
  const [vacancyInput, setVacancyInput] = useState("");



  useEffect(() => {
    setSelectedUsers((siteUsers || []).map((user) => user.id));
  }, [siteUsers]);

  const siteName = sites.find((site) => site.id == selectedSite)?.name || "";

  if (!isOpen) return null;

  const handleAddUsers = () => {
    const filteredUsers = users.filter((user) =>
      selectedUsers.includes(user.id)
    );

    onAddUser(filteredUsers);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleInitialize = () => {
    const siteUsersIds = siteUsers.map((user) => user.id);
    setSelectedUsers(siteUsersIds);
  };

  const toggleVacancyInput = (e) => {


    setShowVacancyInput((prev) => !prev);
  };

  let currentId = 1000; // ID de départ

  const handleAddUnassignedUser = (unassigned) => {
    const unassignedUser = { id: currentId++, fullname: unassigned }; // Incrémente l'ID après utilisation

  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity duration-300">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          Ajouter de(s) agent(s) au site {siteName}
        </h2>

        <Select
          isMulti
          options={users.map((user) => ({
            value: user.id,
            label: `${user.fullname} ${user.firstname}`,
          }))}
          value={selectedUsers
            .map((userId) => {
              const user = users.find((user) => user.id == userId);
              return user ? { value: userId, label: user.fullname } : null;
            })
            .filter(Boolean)} // Évite les entrées nulles
          onChange={(selectedOptions) =>
            setSelectedUsers(selectedOptions.map((option) => option.value))
          }
          className="mb-4"
        />

        <div className="flex justify-between items-center mb-4">
          <label
            htmlFor="toggle-vacancy"
            className="flex items-center cursor-pointer"
          >
            <span className="mr-2">Vacation non attribuée</span>
            <div className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                id="toggle-vacancy"
                checked={showVacancyInput}
                onChange={toggleVacancyInput}
                className="peer sr-only"
              />
              <div className="block bg-gray-300 w-full h-full rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>
              <div
                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform ${
                  showVacancyInput ? "translate-x-6" : ""
                }`}
              ></div>
            </div>
          </label>
        </div>

        {showVacancyInput && (
          <div>
            <input
              type="text"
              value={vacancyInput}
              placeholder="Example: Vac non attribuée 1,2..."
              className="border border-gray-300 p-2 w-full mb-2 rounded-md"
              aria-label="Vacancy input"
            />
            <button
              onClick={() => handleAddUnassignedUser(vacancyInput)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={handleAddUsers}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Ajouter
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Annuler
          </button>
          <button
            onClick={handleInitialize}
            className="bg-gray-200 px-3 py-1 text-sm text-gray-700 rounded-md hover:bg-gray-300"
          >
            Initialiser
          </button>
        </div>
      </div>
    </div>
  );
};

AddUserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddUser: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      fullname: PropTypes.string.isRequired,
      firstname: PropTypes.string,
    })
  ).isRequired,
  selectedSite: PropTypes.number.isRequired,
  siteUsers: PropTypes.arrayOf(PropTypes.number).isRequired,
  sites: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default AddUserModal;
