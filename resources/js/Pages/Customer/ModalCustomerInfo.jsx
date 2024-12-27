import React from "react";
import { Button } from "react-bootstrap";

const ModalCustomerInfo = ({ isOpen, onClose, customer }) => {

  console.log(customer)
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Détails du client</h2>
        <div className="mb-4">
          <strong>Nom:</strong> {customer.name || "Non spécifié"}
        </div>
        <div className="mb-4">
          <strong>Adresse:</strong> {customer.address || "Non spécifiée"}
        </div>
        <div className="mb-4">
          <strong>Email:</strong> {customer.email || "Non spécifié"}
        </div>
        <div className="mb-4">
          <strong>Téléphone:</strong> {customer.phone || "Non spécifié"}
        </div>
        <div className="mb-4">
          <strong>Nom du Responsable:</strong> {customer.manager_name || "Non spécifié"}
        </div>
        <div className="mb-4">
          <strong>Sites Associés:</strong>
          <ul>
            {Array.isArray(customer.sites) && customer.sites.length > 0 ? (
              customer.sites.map((site) => (
                <li key={site.id}>
                  {site.name}
                </li>
              ))
            ) : (
              <li>Aucun site associé</li>
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

export default ModalCustomerInfo;
