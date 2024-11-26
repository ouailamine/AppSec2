import React, { useState } from "react";
import Select from "react-select";

const SearchBar = ({ users, sites, onSearch }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [periodType, setPeriodType] = useState("mensuel");
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Défaut au mois actuel
  const [year, setYear] = useState(new Date().getFullYear()); // Défaut à l'année actuelle

  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const handleSearch = () => {
    const dataToSend = {
      selectedType,
      selectedSite: selectedSite ? selectedSite.value : null,
      selectedAgent: selectedAgent ? selectedAgent.value : null,
      periodType,
      month, // Cela peut être null si periodType est "annuel"
      year,
    };
    console.log("Données à envoyer:", dataToSend); // Pour déboguer
    onSearch(dataToSend); // Appeler la fonction de recherche
  };

  const siteOptions = sites.map((site) => ({
    value: site.id,
    label: site.name,
  }));

  const agentOptions = users.map((user) => ({
    value: user.id,
    label: `${user.firstname} ${user.fullname}`,
  }));

  // Cette fonction est appelée lors du changement de la période
  const handlePeriodChange = (option) => {
    setPeriodType(option.value);
    if (option.value === "annuel") {
      setMonth(null); // Réinitialiser le mois à null si "annuel" est sélectionné
    } else {
      setMonth(new Date().getMonth() + 1); // Remettre le mois actuel si "mensuel" est sélectionné
    }
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <div className="flex justify-center mb-4 space-x-10">
        <button
          className={`flex flex-col items-center text-blue-500 hover:text-blue-600 transition duration-200 ${
            selectedType === "site" ? "font-bold" : ""
          }`}
          onClick={() => {
            setSelectedType("site");
            setSelectedSite(null);
            setSelectedAgent(null);
          }}
        >
          <img src="assets/img/site.png" alt="Site" className="w-8 h-8 mb-1" />
          Site
        </button>
        <button
          className={`flex flex-col items-center text-green-500 hover:text-green-600 transition duration-200 ${
            selectedType === "agent" ? "font-bold" : ""
          }`}
          onClick={() => {
            setSelectedType("agent");
            setSelectedSite(null);
            setSelectedAgent(null);
          }}
        >
          <img
            src="assets/img/employes.png"
            alt="Agent"
            className="w-8 h-8 mb-1"
          />
          Agent
        </button>
      </div>

      {selectedType && (
        <div className="flex items-center justify-center space-x-4 mb-4">
          {selectedType === "site" && (
            <Select
              value={selectedSite}
              onChange={(option) => {
                setSelectedSite(option);
                setSelectedAgent(null);
              }}
              options={siteOptions}
              placeholder="Sélectionner un site"
              className="w-64"
              classNamePrefix="select"
            />
          )}

          {selectedType === "agent" && (
            <Select
              value={selectedAgent}
              onChange={(option) => {
                setSelectedAgent(option);
                setSelectedSite(null);
              }}
              options={agentOptions}
              placeholder="Sélectionner un agent"
              className="w-64"
              classNamePrefix="select"
            />
          )}

          <Select
            value={{ value: periodType, label: periodType }}
            onChange={handlePeriodChange} // Changer la fonction de gestion de période
            options={[
              { value: "mensuel", label: "Mensuel" },
              { value: "annuel", label: "Annuel" },
            ]}
            className="w-48"
            classNamePrefix="select"
          />

          <Select
            value={month ? { value: month, label: months[month - 1] } : null}
            onChange={(option) => setMonth(option.value)}
            options={months.map((monthName, index) => ({
              value: index + 1,
              label: monthName,
            }))}
            isDisabled={periodType === "annuel"} // Désactiver si la période est annuelle
            className="w-48"
            classNamePrefix="select"
          />

          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Année"
            min="2000"
            max={new Date().getFullYear() + 10}
            className="border border-gray-300 rounded-md p-2 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />

          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg"
          >
            Rechercher
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
