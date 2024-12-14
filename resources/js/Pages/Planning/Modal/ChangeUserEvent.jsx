import React, { useState, useEffect } from "react";
import Select from "react-select";

const ChangeUserEvent = ({
  selectedUserIdForChange, // Fixed typo
  closeModal,
  AllUsers,
  onChangeUser,
}) => {

  console.log(selectedUserIdForChange)
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToReplace, setUserToReplace] = useState({ id_user: "", userName: "" });

  const getUserDetails = (userId) => {
    const user = AllUsers.find((user) => user.id == userId) || {};
    return `${user.fullname || "Agent"} ${user.firstname || "Anonyme"}`.trim();
  };

  useEffect(() => {
    setUserToReplace({
      id_user:selectedUserIdForChange,
      userName: getUserDetails(selectedUserIdForChange),
    });
  }, [selectedUserIdForChange, AllUsers]);

  const handleUserChange = (selectedOption) => {
    setSelectedUser(selectedOption);
  };

  const changeUser = () => {
    if (selectedUser) {
      const userReplacement = {
        id_user:selectedUser.value,
        userName: getUserDetails(selectedUser.value),
      };
      onChangeUser(userToReplace, userReplacement);
      closeModal()
    } else {
      alert("Aucun utilisateur sélectionné.");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Changer l'utilisateur
        </h2>

        <div className="mb-4">
          <p className="text-gray-600 text-sm">Utilisateur actuel:</p>
          <p className="text-gray-800 font-medium">{userToReplace.userName}</p>
        </div>

        <div className="mb-6">
          <label
            htmlFor="user-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Sélectionner un utilisateur
          </label>
          <Select
            id="user-select"
            value={selectedUser}
            onChange={handleUserChange}
            options={AllUsers.map((user) => ({
              value: user.id,
              label: user.fullname,
            }))}
            placeholder="Rechercher un utilisateur"
            isClearable={true}
            className="text-sm"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
          >
            Fermer
          </button>
          <button
            onClick={changeUser}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Changer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeUserEvent;
