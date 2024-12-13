import React, { useState } from "react";
import Select from "react-select";

const ChangeUserEvent = ({ selectedUser, closeModal, AllUsers }) => {
  // Set the selected user to be the initially selected one, or empty if not provided
  const [selectedUserId, setSelectedUserId] = useState(
    selectedUser?.id
      ? { value: selectedUser.id, label: selectedUser.fullname }
      : null
  );

  // Handle change of the selected user
  const handleUserChange = (selectedOption) => {
    setSelectedUserId(selectedOption);
  };

  return (
    <div>
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-4 rounded-lg shadow-lg w-96">
          <div className="mt-4">
            <div className="mb-4">
              {/* Display the selected user or a default message */}
              <h2>{selectedUser}</h2>
            </div>
            <div className="mb-4">
              <label
                htmlFor="user-select"
                className="block text-sm font-medium text-gray-700"
              >
                Sélectionner un utilisateur
              </label>
              <Select
                id="user-select"
                value={selectedUserId}
                onChange={handleUserChange}
                options={AllUsers.map((user) => ({
                  value: user.id,
                  label: user.fullname,
                }))}
                placeholder="Rechercher un utilisateur"
                isClearable={true} // Allows clearing the selection
              />
            </div>
          </div>
          <button
            onClick={closeModal}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeUserEvent;
