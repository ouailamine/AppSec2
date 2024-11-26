import React, { useState, useEffect } from "react";
import AddAgentModal from './AddEvent'; // Assurez-vous que ce fichier existe et est bien importé

const Estimate = ({ typePosts, posts }) => {
  const [isSectionOpen, setIsSectionOpen] = useState({
    "Coûts additionnels": true, // "Coûts additionnels" est toujours ouvert par défaut
  });
  const [formData, setFormData] = useState({
    travelCosts: '',
    materialCosts: '',
    insuranceCosts: '',
    totalGeneral: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [events, setEvents] = useState({});

  // Fonction pour gérer l'ouverture/fermeture des sections
  const toggleSection = (type) => {
    setIsSectionOpen((prevState) => ({
      ...prevState,
      [type]: !prevState[type],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);  // Soumettre les données du formulaire
  };

  // Ouvrir le modal
  const openModal = (section) => {
    console.log("Modal ouvert pour la section :", section); // Pour déboguer
    setCurrentSection(section);
    setIsModalOpen(true);
  };

  // Ajouter un événement à la section
  const addEventToSection = (date, agentData) => {
    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };
      if (!updatedEvents[currentSection]) {
        updatedEvents[currentSection] = []; // Initialiser un tableau vide pour cette section
      }
      updatedEvents[currentSection].push({ date, ...agentData });
      return updatedEvents;
    });
    setIsModalOpen(false); // Fermer le modal après ajout
  };

  // Calculer le total général
  useEffect(() => {
    const total = (
      parseFloat(formData.travelCosts) || 0
    ) + (
      parseFloat(formData.materialCosts) || 0
    ) + (
      parseFloat(formData.insuranceCosts) || 0
    );
    setFormData((prevData) => ({
      ...prevData,
      totalGeneral: total,
    }));
  }, [formData.travelCosts, formData.materialCosts, formData.insuranceCosts]);

  return (
    <div className="min-h-screen flex bg-gray-100 p-6">
      <div className="flex-1 bg-white shadow-md rounded-lg p-6 mr-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Créer un Devis</h1>
        <h2 className="text-xl font-bold mb-4">Détails du Devis</h2>

        <form onSubmit={handleSubmit} className="mt-6">
          {/* Section "Coûts additionnels" - toujours ouverte */}
          <Section
            title="Coûts additionnels"
            isOpen={isSectionOpen["Coûts additionnels"]}
            toggle={() => toggleSection("Coûts additionnels")}
          >
            <div className="p-4 border border-gray-300 rounded-md mt-2">
              <Input
                id="travelCosts"
                label="Coûts de déplacement"
                type="number"
                value={formData.travelCosts}
                onChange={handleInputChange}
              />
              <Input
                id="materialCosts"
                label="Coûts matériels"
                type="number"
                value={formData.materialCosts}
                onChange={handleInputChange}
              />
              <Input
                id="insuranceCosts"
                label="Coûts d'assurance"
                type="number"
                value={formData.insuranceCosts}
                onChange={handleInputChange}
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

          {/* Autres sections */}
          {typePosts.map((typePost) => {
            if (typePost.name !== "Coûts additionnels") {
              return (
                <Section
                  key={typePost.id}
                  title={typePost.name}
                  isOpen={isSectionOpen[typePost.name]}
                  toggle={() => toggleSection(typePost.name)}
                  openModal={() => openModal(typePost.name)}  
                  events={events[typePost.name] || []}  
                />
              );
            }
            return null;
          })}

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

      {/* Modal AddAgent */}
      {isModalOpen && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 z-50 flex justify-center items-center">
    <AddAgentModal
      onClose={() => setIsModalOpen(false)}
      onSubmit={addEventToSection}
    />
  </div>
)}

    </div>
  );
};

const Section = ({ title, isOpen, toggle, openModal, events }) => (
  <div className="mb-6">
    <button
      type="button"
      onClick={toggle}
      className="w-full text-left px-4 py-2 bg-gray-200 rounded-md font-semibold flex justify-between items-center"
    >
      {title}
      <span className={`ml-2 ${isOpen ? "transform rotate-180" : ""}`} aria-hidden="true">
        &#9660;
      </span>
    </button>
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-screen" : "max-h-0"}`}>
      {/* Vérifier si des événements existent et les afficher */}
      {Array.isArray(events) && events.length > 0 && (
        <div className="mt-4">
          <table className="min-w-full">
            <thead>
              <tr>
                <th>Date</th>
                <th>Agent</th>
                <th>Nombre</th>
                <th>Heures</th>
                <th>Majoration</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={index}>
                  <td>{event.date}</td>
                  <td>{event.agent}</td>
                  <td>{event.number}</td>
                  <td>{event.hours}</td>
                  <td>{event.surcharge}</td>
                  <td>{event.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Bouton d'ajout d'événement pour les autres sections */}
      {openModal && (
        <button
          onClick={openModal}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Ajouter un événement
        </button>
      )}
    </div>
  </div>
);

const Input = ({ id, label, type, value, onChange, readOnly }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className="block w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
);

export default Estimate;
