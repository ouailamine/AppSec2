import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Select from "react-select";

const AddUserModal = ({
  isOpen,
  onClose,
  onAddUser,
  users,
  selectedSite,
  siteUsers
}) => {
  //console.log(siteUsers);
  //console.log(users);
  //console.log(selectedSite);

  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    if (selectedSite && selectedSite.users) {
      // Pré-sélectionner les utilisateurs associés au site
      const preselectedUsers = selectedSite.users.map((user) => ({
        value: user.value,
        label: user.label,
      }));
      setSelectedUsers(preselectedUsers);
    }
  }, [selectedSite]);

  if (!isOpen) return null;

  // supprimer les users du site de la liste users
  const userOptions = users.filter(
    (user) => !selectedUsers.some((selected) => selected.value === user.id)
  ).map((user) => ({
    value: user.value ? user.value : user.id,
    label: user.fullname ? user.fullname : user.label,
  }));



  const handleChange = (selectedOptions) => {
    setSelectedUsers(selectedOptions || []);
  };

  const handleCancel = () => {
    setSelectedUsers(siteUsers);
    onClose();
  };

  const handleAddUsers = () => {
    // Préparer la liste des utilisateurs sélectionnés
    const updatedUsers = selectedUsers.map((user) => ({
      value: user.value,
      label: user.label,
    }));

    // Appeler la fonction pour mettre à jour les utilisateurs du site
    onAddUser(updatedUsers);

    // Fermer la modale
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity duration-300">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          Ajouter des utilisateurs à {selectedSite?.label || "Site"}
        </h2>
        <Select
          isMulti
          options={userOptions}
          value={selectedUsers}
          onChange={handleChange}
          className="mb-4"
          placeholder="Sélectionner des utilisateurs..."
          classNamePrefix="select"
        />
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
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedSite: PropTypes.shape({
    value: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.number.isRequired,
        label: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default AddUserModal;
