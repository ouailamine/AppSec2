import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
  PlusCircleIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import CreateEditRoleModal from "./CreateEditRoleModal"; // Import the CreateEditRoleModal component
import ShowRoleModal from "./ShowRoleModal"; // Import the ShowRoleModal component

const Index = ({ roles, permissions, flash = {}, rolePermissions }) => {
  // Convert the roles object to an array
  const rolesArray = Object.values(roles);

  const [showCreateEditModal, setShowCreateEditModal] = useState(false);
  const [showShowModal, setShowShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // Handle role deletion
  const handleDelete = (roleId) => {
    if (window.confirm("Voulez-vous supprimer ce rôle ?")) {
      Inertia.delete(route("roles.destroy", roleId));
    }
  };

  // Show modal for adding or editing a role
  const handleShowCreateEditModal = (role = null) => {
    setSelectedRole(role);
    setShowCreateEditModal(true);
  };

  // Show modal for showing role details
  const handleShowRoleModal = (role) => {
    setSelectedRole(role);
    setShowShowModal(true);
  };

  // Close modals
  const handleCloseModal = () => {
    setShowCreateEditModal(false);
    setShowShowModal(false);
    setSelectedRole(null);
  };

  return (
    <AdminAuthenticatedLayout>
      <Head title="Tableau de bord Admin" />
      <div className="container mx-auto mt-4 p-4">
        {/* Flash messages */}
        {flash.success && (
          <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
            {flash.success}
          </div>
        )}
        {flash.error && (
          <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
            {flash.error}
          </div>
        )}

        <button
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
          onClick={() => handleShowCreateEditModal(null)}
        >
          <PlusCircleIcon className="w-6 h-6 mr-2" />
          Ajouter un Rôle
        </button>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Rôle No.</th>
                <th className="py-3 px-4 text-left">Nom</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rolesArray.length > 0 ? (
                rolesArray.map((role, index) => (
                  <tr key={role.id} className="border-b">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{role.name}</td>{" "}
                    {/* Affiche le nom du rôle */}
                    <td className="py-3 px-4 flex space-x-2">
                      <button
                        className="text-yellow-500 hover:text-yellow-600"
                        onClick={() => handleShowRoleModal(role)}
                      >
                        <EyeIcon className="w-6 h-6" />
                      </button>

                      <button
                        className="text-blue-500 hover:text-blue-600"
                        onClick={() => handleShowCreateEditModal(role)}
                      >
                        <PencilSquareIcon className="w-6 h-6" />
                      </button>

                      {role.name !== roles.authRoleName && (
                        <button
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(role.id)}
                        >
                          <TrashIcon className="w-6 h-6" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-red-500">
                    <strong>Aucun Rôle Trouvé !</strong>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Components */}
        <CreateEditRoleModal
          showModal={showCreateEditModal}
          onClose={handleCloseModal}
          permissions={permissions}
          role={selectedRole}
        />
        {selectedRole && (
          <ShowRoleModal
            showModal={showShowModal}
            onClose={handleCloseModal}
            role={selectedRole}
            permissions={permissions}
          />
        )}
      </div>
    </AdminAuthenticatedLayout>
  );
};

export default Index;
