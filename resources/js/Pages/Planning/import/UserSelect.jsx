import React, { useState } from "react";

const UserSelect = ({ siteUsers, selectedUsers, handleUserChange }) => {
  // Handling state for selected users in case it's not being managed externally
  const [selected, setSelected] = useState(selectedUsers);

  // Update state when the selection changes
  const handleSelectionChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => parseInt(option.value, 10));
    console.log('selectedOptions', selectedOptions);
    setSelected(selectedOptions);
    handleUserChange(selectedOptions); // Notify parent component
  };
  

  return (
    <div className="flex space-x-4 mb-4">
      <div className="flex-grow">
        <select
          multiple
          value={selected}
          onChange={handleSelectionChange}
          className="w-full p-2 border rounded-md border-gray-300"
          placeholder="Choisissez un ou plusieurs agents"
        >
          {siteUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.fullname}{user.firstname}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default UserSelect;
