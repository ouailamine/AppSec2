import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";

const CreateEditRoleModal = ({ showModal, onClose, permissions, role }) => {
  // Initialize formData with empty or role-specific values
  const [formData, setFormData] = useState({
    name: "",
    permissions: [],
  });

  useEffect(() => {
    if (role) {
      // If role is provided, set form data for editing
      setFormData({
        name: role.name || "",
        permissions:
          role.permissions.map((permission) => permission.name) || [],
      });
    }
  }, [role]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle select change for permissions
  const handleSelectChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prevData) => ({
      ...prevData,
      permissions: selectedOptions,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const routeName = role ? "roles.update" : "roles.store";
    const data = role ? { ...formData, _method: "PUT" } : formData;
    Inertia.post(route(routeName, role ? role.id : ""), data);
    onClose(); // Close modal after submission
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {role ? "Modifier un Rôle" : "Ajouter un Nouveau Rôle"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nom du Rôle
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Entrer le nom du rôle"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="permissions"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Permissions
            </label>
            <select
              id="permissions"
              name="permissions"
              multiple
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.permissions}
              onChange={handleSelectChange}
              style={{ height: "150px" }}
            >
              {permissions.map((permission) => (
                <option key={permission.id} value={permission.name}>
                  {permission.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {role ? "Sauvegarder les Modifications" : "Sauvegarder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditRoleModal;
