import React from "react";
import { Button } from "react-bootstrap";
import { Eye } from "react-bootstrap-icons";

const ModalSiteInfo = ({ isOpen, onClose, site }) => {
  if (!isOpen || !site) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Détails du Site</h2>
        <div className="mb-4">
          <strong>Nom:</strong> {site.name}
        </div>
        <div className="mb-4">
          <strong>Adresse:</strong> {site.address}
        </div>
        <div className="mb-4">
          <strong>Email:</strong> {site.email}
        </div>
        <div className="mb-4">
          <strong>Téléphone:</strong> {site.phone}
        </div>
        <div className="mb-4">
          <strong>Nom du Responsable:</strong> {site.manager_name}
        </div>
        <div className="mb-4">
          <strong>Agents Associés:</strong>
          <ul>
            {site.users.length > 0 ? (
              site.users.map((user) => (
                <li key={user.id}>
                  {user.fullname} {user.firstname}
                </li>
              ))
            ) : (
              <li>Aucun user associé</li>
            )}
          </ul>
        </div>
        <div className="flex justify-end space-x-4">
          <Button variant="secondary" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalSiteInfo;
