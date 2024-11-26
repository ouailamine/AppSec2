import React from "react";

const ShowRoleModal = ({ showModal, onClose, role, permissions }) => {
  if (!showModal || !role) return null;

  console.log(permissions);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-4">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
          Détails du Rôle
        </h3>

        <div className="mb-4">
          <strong className="block text-gray-700">Nom:</strong>
          <p className="ml-2 text-gray-900 text-lg">{role.name}</p>
        </div>

        <div className="mb-6">
          <strong className="block text-gray-700">Permissions:</strong>
          <ul className="ml-4 list-disc text-gray-800">
            {role.permissions && role.permissions.length > 0 ? (
              role.permissions.map((permission) => (
                <li key={permission.id} className="text-sm">
                  {permission.name}
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500">
                Aucune permission attribuée
              </li>
            )}
          </ul>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 mr-2"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowRoleModal;
