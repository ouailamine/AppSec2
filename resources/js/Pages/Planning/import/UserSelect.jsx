import React, { useState } from "react";

const UserSelect = ({ siteUsers, selectedUsers = [], onUsersSelected }) => {
  // Handling state for selected users
  const [selected, setSelected] = useState(selectedUsers);

  // Update selected users when a checkbox is clicked
  const handleCheckboxChange = (userId) => {
    const updatedSelected = selected.includes(userId)
      ? selected.filter((id) => id !== userId)
      : [...selected, userId];
    setSelected(updatedSelected);

    console.log(updatedSelected);
    onUsersSelected(updatedSelected); // Notify parent component of the updated selection
  };

  return (
    <div className="space-y-2 border p-2">
      <label
        htmlFor="user-select"
        className="text-sm font-semibold text-black block text-sm font-bold text-center mb-1 bg-gray-300"
      >
        Choisissez un ou plusieurs agents
      </label>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {/* Render the user options in a grid with checkboxes */}
        {siteUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center space-x-3 hover:bg-indigo-50 rounded-lg transition duration-200"
          >
            <input
              type="checkbox"
              value={user.id}
              checked={selected.includes(user.id)}
              onChange={() => handleCheckboxChange(user.id)}
              id={`user-${user.id}`}
              className="h-4 w-4 text-indigo-600 border-black rounded-md focus:ring-2 focus:ring-indigo-500 transition duration-200"
            />
            <label
              htmlFor={`user-${user.id}`}
              className="text-[13px] text-black font-bold cursor-pointer"
            >
              {user.fullname}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSelect;
