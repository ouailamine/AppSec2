import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";

import { Head } from "@inertiajs/react";
import {
  PlusCircleIcon,
  TrashIcon,
  PencilSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline"; // Heroicons imports

const PermissionsIndex = ({ permissions, flash = {} }) => {
  console.log(permissions);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPermission, setCurrentPermission] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    console.log("Flash Messages:", flash);
  }, [flash]);

  const handleDelete = (permissionId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette permission ?")) {
      Inertia.delete(route("permissions.destroy", permissionId));
    }
  };

  const handleShowModal = (permission = null) => {
    if (permission) {
      setEditMode(true);
      setCurrentPermission(permission);
      setFormData({
        name: permission.name,
      });
    } else {
      setEditMode(false);
      setCurrentPermission(null);
      setFormData({
        name: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      Inertia.put(route("permissions.update", currentPermission.id), formData);
    } else {
      Inertia.post(route("permissions.store"), formData);
    }
    handleCloseModal();
  };

  return (
    <div>
      <Head title="Gestion des Permissions" />
      <div className="container mx-auto mt-2">
        {/* Flash messages */}
        {flash && (
          <>
            {flash.success && (
              <div className="mb-4 p-3 text-green-800 bg-green-100 border border-green-300 rounded">
                {flash.success}
              </div>
            )}
            {flash.error && (
              <div className="mb-4 p-3 text-red-800 bg-red-100 border border-red-300 rounded">
                {flash.error}
              </div>
            )}
          </>
        )}

        <button
          className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded hover:bg-green-600 mb-4"
          onClick={() => handleShowModal()}
        >
          <PlusCircleIcon className="w-5 h-5" /> Ajouter une permission
        </button>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md  overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-2 border border-gray-300">Nom</th>
                <th className="p-2 border border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {permissions.length > 0 ? (
                permissions.map((permission) => (
                  <tr key={permission.id} className="hover:bg-gray-100">
                    <td className="p-2 border border-gray-300">
                      {permission.name}
                    </td>
                    <td className="p-2 border border-gray-300">
                      <div className="flex space-x-2">
                        <button
                          className="flex items-center gap-2 px-3 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
                          onClick={() => handleShowModal(permission)}
                        >
                          <PencilSquareIcon className="w-5 h-5" /> Modifier
                        </button>
                        <button
                          className="flex items-center gap-2 px-3 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                          onClick={() => handleDelete(permission.id)}
                        >
                          <TrashIcon className="w-5 h-5" /> Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="p-3 text-center text-red-600 border border-gray-300"
                  >
                    <strong>Aucune permission trouvée !</strong>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Component */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleCloseModal}
          >
            <div
              className="w-full max-w-md bg-white rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h5 className="text-lg font-semibold">
                  {editMode
                    ? "Modifier la Permission"
                    : "Ajouter une Nouvelle Permission"}
                </h5>
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-800"
                  onClick={handleCloseModal}
                >
                  &#x2715;
                </button>
              </div>
              <div className="px-6 py-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="formPermissionName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nom de la Permission
                    </label>
                    <input
                      type="text"
                      id="formPermissionName"
                      name="name"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Entrez le nom de la permission"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    {editMode ? "Mettre à Jour" : "Enregistrer"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionsIndex;
