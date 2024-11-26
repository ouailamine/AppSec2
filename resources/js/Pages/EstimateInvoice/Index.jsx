import React, { useState, useEffect } from "react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Modal from "./Model"; // Assurez-vous que le chemin est correct
import { PDFViewer } from "@react-pdf/renderer";
import MyDocument from "./Devis"; // Assurez-vous que le chemin est correct

const Index = () => {
  // Exemple de données pour les clients
  const [clients, setClients] = useState([
    {
      name: "Client A",
      address: "123 Rue A",
      phone: "0102030405",
      email: "clienta@example.com",
    },
    {
      name: "Client B",
      address: "456 Rue B",
      phone: "0607080910",
      email: "clientb@example.com",
    },
    {
      name: "Client C",
      address: "789 Rue C",
      phone: "0203040506",
      email: "clientc@example.com",
    },
  ]);

  // États pour les sélections et le formulaire
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedDocument, setSelectedDocument] = useState("Devis"); // Détails du Devis visible par défaut
  const [formData, setFormData] = useState({
    securityType: "",
    numSecurityAgents: 0,
    securityDuration: "",
    securityRate: 0,
    totalSecurity: 0,
    fireType: "",
    numFireAgents: 0,
    fireDuration: "",
    fireRate: 0,
    totalFire: 0,
    travelCosts: 0,
    materialCosts: 0,
    insuranceCosts: 0,
    totalGeneral: 0,
  });
  const [isSectionOpen, setIsSectionOpen] = useState({
    security: false, // Affiche la section sécurité par défaut
    fire: false, // Affiche la section incendie par défaut
    additionalCosts: false, // Affiche les coûts additionnels par défaut
  });

  // Modals
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);

  // Mettre à jour les totaux du formulaire
  useEffect(() => {
    const totalSecurity = formData.numSecurityAgents * formData.securityRate;
    const totalFire = formData.numFireAgents * formData.fireRate;
    setFormData((prevData) => ({
      ...prevData,
      totalSecurity,
      totalFire,
      totalGeneral:
        totalSecurity +
        totalFire +
        formData.travelCosts +
        formData.materialCosts +
        formData.insuranceCosts,
    }));
  }, [
    formData.numSecurityAgents,
    formData.securityRate,
    formData.numFireAgents,
    formData.fireRate,
    formData.travelCosts,
    formData.materialCosts,
    formData.insuranceCosts,
  ]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsPdfOpen(true);
  };

  const toggleSection = (section) => {
    setIsSectionOpen((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const handleAddClient = (newClient) => {
    setClients([...clients, newClient]);
    setIsAddClientModalOpen(false);
  };

  const handleEditClient = (updatedClient) => {
    setClients(
      clients.map((client) =>
        client.email === updatedClient.email ? updatedClient : client
      )
    );
    setIsEditClientModalOpen(false);
    setClientToEdit(null);
  };

  const openAddClientModal = () => setIsAddClientModalOpen(true);
  const closeAddClientModal = () => setIsAddClientModalOpen(false);

  const openEditClientModal = (client) => {
    if (!selectedClient) {
      alert("Veuillez sélectionner un client avant de modifier.");
      return;
    }
    setClientToEdit(client);
    setIsEditClientModalOpen(true);
  };

  const closeEditClientModal = () => {
    setIsEditClientModalOpen(false);
    setClientToEdit(null);
  };

  const renderSelect = (id, name, value, onChange, options) => (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {name}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="">Choisissez</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  const renderClientInfo = (client) => (
    <div className="mb-4 p-4 border border-gray-300 rounded-md">
      <h3 className="text-lg font-semibold">{client.name}</h3>
      <p>
        <strong>Adresse:</strong> {client.address}
      </p>
      <p>
        <strong>Téléphone:</strong> {client.phone}
      </p>
      <p>
        <strong>Email:</strong> {client.email}
      </p>
    </div>
  );

  return (
    <AdminAuthenticatedLayout>
      <Head title="Dashboard Admin" />
      <div className="min-h-screen flex bg-gray-100 p-6">
        <div className="flex-1 bg-white shadow-md rounded-lg p-6 mr-4">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Créer un {selectedDocument} pour{" "}
            {selectedClient
              ? clients.find((client) => client.name === selectedClient)?.name
              : "sélectionnez un client"}
          </h1>

          <div className="mb-6">
            {renderSelect(
              "client",
              "Sélectionner un client",
              selectedClient,
              (e) => {
                setSelectedClient(e.target.value);
              },
              clients.map((client) => client.name)
            )}
            <div className="flex space-x-2 mt-2">
              <button
                type="button"
                onClick={openAddClientModal}
                className="px-2 py-1 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-sm"
              >
                Ajouter un Nouveau Client
              </button>
              <button
                type="button"
                onClick={() => openEditClientModal({ name: selectedClient })}
                className="px-2 py-1 bg-yellow-600 text-white font-semibold rounded-md shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 text-sm"
              >
                Modifier le Client
              </button>
            </div>
          </div>

          {/* La section Détails du Devis est maintenant toujours visible */}
          <form onSubmit={handleSubmit} className="mt-6">
            {/* Affichage des informations du client */}
            {selectedClient && (
              <div className="mb-6">
                {renderClientInfo(
                  clients.find((client) => client.name === selectedClient)
                )}
              </div>
            )}

            {renderSelect(
              "document",
              "Sélectionner un devis ou une facture",
              selectedDocument,
              (e) => {
                setSelectedDocument(e.target.value);
              },
              ["Devis", "Facture"]
            )}

            <h2 className="text-xl font-bold mb-4">Détails du Devis</h2>

            {/* Sécurité */}
            {selectedDocument === "Devis" && (
              <Section
                title="Sécurité"
                isOpen={isSectionOpen.security}
                toggle={() => toggleSection("security")}
              >
                <div className="p-4 border border-gray-300 rounded-md mt-2">
                  {renderSelect(
                    "securityType",
                    "Type de service",
                    formData.securityType,
                    handleFormChange,
                    [
                      "Surveillance générale",
                      "Contrôle des accès",
                      "Patrouilles",
                    ]
                  )}
                  <Input
                    id="numSecurityAgents"
                    label="Nombre d'agents de sécurité"
                    type="number"
                    value={formData.numSecurityAgents}
                    onChange={handleFormChange}
                  />
                  <Input
                    id="securityDuration"
                    label="Durée de la sécurité"
                    type="text"
                    value={formData.securityDuration}
                    onChange={handleFormChange}
                  />
                  <Input
                    id="securityRate"
                    label="Tarif par agent de sécurité"
                    type="number"
                    value={formData.securityRate}
                    onChange={handleFormChange}
                  />
                  <Input
                    id="totalSecurity"
                    label="Total Sécurité"
                    type="number"
                    value={formData.totalSecurity}
                    readOnly
                  />
                </div>
              </Section>
            )}

            {/* Incendie */}
            {selectedDocument === "Devis" && (
              <Section
                title="Incendie"
                isOpen={isSectionOpen.fire}
                toggle={() => toggleSection("fire")}
              >
                <div className="p-4 border border-gray-300 rounded-md mt-2">
                  {renderSelect(
                    "fireType",
                    "Type de service",
                    formData.fireType,
                    handleFormChange,
                    ["Extinction d'incendie", "Prévention", "Inspection"]
                  )}
                  <Input
                    id="numFireAgents"
                    label="Nombre d'agents d'incendie"
                    type="number"
                    value={formData.numFireAgents}
                    onChange={handleFormChange}
                  />
                  <Input
                    id="fireDuration"
                    label="Durée de l'incendie"
                    type="text"
                    value={formData.fireDuration}
                    onChange={handleFormChange}
                  />
                  <Input
                    id="fireRate"
                    label="Tarif par agent d'incendie"
                    type="number"
                    value={formData.fireRate}
                    onChange={handleFormChange}
                  />
                  <Input
                    id="totalFire"
                    label="Total Incendie"
                    type="number"
                    value={formData.totalFire}
                    readOnly
                  />
                </div>
              </Section>
            )}

            {/* Coûts additionnels */}
            <Section
              title="Coûts additionnels"
              isOpen={isSectionOpen.additionalCosts}
              toggle={() => toggleSection("additionalCosts")}
            >
              <div className="p-4 border border-gray-300 rounded-md mt-2">
                <Input
                  id="travelCosts"
                  label="Coûts de déplacement"
                  type="number"
                  value={formData.travelCosts}
                  onChange={handleFormChange}
                />
                <Input
                  id="materialCosts"
                  label="Coûts matériels"
                  type="number"
                  value={formData.materialCosts}
                  onChange={handleFormChange}
                />
                <Input
                  id="insuranceCosts"
                  label="Coûts d'assurance"
                  type="number"
                  value={formData.insuranceCosts}
                  onChange={handleFormChange}
                />
                <Input
                  id="totalGeneral"
                  label="Total Général"
                  type="number"
                  value={formData.totalGeneral}
                  readOnly
                />
              </div>
            </Section>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Soumettre
              </button>
            </div>
          </form>
        </div>

        {/* Colonne droite pour afficher le PDF */}
        <div className="flex-1 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-center">Aperçu PDF</h2>
          <div className="h-screen w-full">
            {selectedDocument && selectedClient && formData && (
              <PDFViewer width="100%" height="100%">
                <MyDocument
                  client={clients.find(
                    (client) => client.name === selectedClient
                  )}
                  formData={formData}
                  documentType={selectedDocument}
                />
              </PDFViewer>
            )}
          </div>
        </div>
      </div>

      {isAddClientModalOpen && (
        <Modal
          onClose={closeAddClientModal}
          onSave={handleAddClient}
          initialData={{ name: "", address: "", phone: "", email: "" }}
        />
      )}

      {isEditClientModalOpen && clientToEdit && (
        <Modal
          onClose={closeEditClientModal}
          onSave={handleEditClient}
          initialData={clientToEdit}
        />
      )}
    </AdminAuthenticatedLayout>
  );
};

// Composant pour les sections collapsibles
const Section = ({ title, isOpen, toggle, children }) => (
  <div className="mb-6">
    <button
      type="button"
      onClick={toggle}
      className="w-full text-left px-4 py-2 bg-gray-200 rounded-md font-semibold flex justify-between items-center"
    >
      {title}
      <span
        className={`ml-2 ${isOpen ? "transform rotate-180" : ""}`}
        aria-hidden="true"
      >
        &#9660;
      </span>
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ${
        isOpen ? "max-h-screen" : "max-h-0"
      }`}
    >
      {children}
    </div>
  </div>
);

// Composant pour les champs d'entrée
const Input = ({ id, label, type, value, onChange, readOnly }) => (
  <div className="mb-4">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      {label}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
);

export default Index;
