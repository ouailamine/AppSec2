import React, { useState } from "react";
import EditModal from "./EditModal";
import ChangePasswordModal from "./ChangePasswordModal";

const CustomerProfile = ({
  customer,
  onEditCustomer,
  onEditSite,
  onChangePassword,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [modalTitle, setModalTitle] = useState("");

  const handleOpenModal = (data, title) => {
    setModalData(data);
    setModalTitle(title);
    setIsModalOpen(true);
  };

  const handleSave = (updatedData) => {
    if (modalData.id) {
      onEditSite(modalData.id, updatedData);
    } else {
      onEditCustomer(updatedData);
    }
  };

  const handlePasswordSave = (oldPassword, newPassword, confirmPassword) => {
    if (newPassword === confirmPassword) {
      onChangePassword(oldPassword, newPassword);
      setIsPasswordModalOpen(false);
    } else {
      alert("Les mots de passe ne correspondent pas.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-r from-blue-50 to-white shadow-2xl rounded-lg">
      {/* Informations du Client */}
      <div className="bg-white rounded-xl shadow-lg p-2 mb-4 text-center space-y-2">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Informations du Client
          </h2>
          <div className="space-y-1">
            <p className="text-sm text-gray-700">
              <strong className="font-semibold">Nom :</strong> {customer.name}
            </p>
            <p className="text-sm text-gray-700">
              <strong className="font-semibold">Email :</strong>{" "}
              {customer.email}
            </p>
            <p className="text-sm text-gray-700">
              <strong className="font-semibold">Téléphone :</strong>{" "}
              {customer.phone}
            </p>
            <p className="text-sm text-gray-700">
              <strong className="font-semibold">Adresse :</strong>{" "}
              {customer.address}
            </p>
            <p className="text-sm text-gray-700">
              <strong className="font-semibold">Gestionnaire :</strong>{" "}
              {customer.manager_name}
            </p>
          </div>
          <div className="mt-2 flex justify-center gap-2">
            <button
              onClick={() =>
                handleOpenModal(
                  {
                    name: customer.name,
                    email: customer.email,
                    phone: customer.phone,
                    address: customer.address,
                  },
                  "Modifier les informations du client"
                )
              }
              className="px-2 py-1 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
            >
              Modifier les informations
            </button>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-2 py-1 bg-red-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all"
            >
              Changer le mot de passe
            </button>
          </div>
        </div>
      </div>

      {/* Sites Associés */}
      <div className="bg-white rounded-xl shadow-lg p-2 mb-4 text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-800">Sites Associés</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {customer.sites.map((site) => (
            <div
              key={site.id}
              className="bg-white p-2 rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 border-1 border-blue-300 hover:border-blue-700"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {site.name}
              </h3>
              <p className="text-sm text-gray-700">
                <strong className="font-semibold">Adresse :</strong>{" "}
                {site.address}
              </p>
              <p className="text-sm text-gray-700">
                <strong className="font-semibold">Email :</strong> {site.email}
              </p>
              <p className="text-sm text-gray-700">
                <strong className="font-semibold">Téléphone :</strong>{" "}
                {site.phone}
              </p>
              <button
                onClick={() =>
                  handleOpenModal(
                    {
                      id: site.id,
                      name: site.name,
                      email: site.email,
                      phone: site.phone,
                      address: site.address,
                    },
                    `Modifier les informations du site : ${site.name}`
                  )
                }
                className="mt-2 px-2 py-1 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
              >
                Modifier
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={modalData}
        title={modalTitle}
      />
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSave={handlePasswordSave}
      />
    </div>
  );
};

export default CustomerProfile;
