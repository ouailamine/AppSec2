import React, { useState } from "react";

const SelectSite = ({ siteOptions, handleSiteChange, isDisabled }) => {
  const [selectedSite, setSelectedSite] = useState("");

  const onChange = (event) => {
    const value = event.target.value;
    setSelectedSite(value); // Met à jour l'état local
    if (handleSiteChange) {
      handleSiteChange(value); // Notifie le parent si une fonction est passée
    }
  };

  return (
    <select
      value={selectedSite} // L'état contrôle la valeur
      onChange={onChange}
      disabled={isDisabled}
      className="w-full sm:max-w-xs p-2 border border-gray-300 rounded-lg bg-white text-gray-800 cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
    >
      <option value="" disabled>
        Sélectionner un site
      </option>
      {siteOptions.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
};

export default SelectSite;
