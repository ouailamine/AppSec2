import React from "react";

const SelectSite = ({ sites = [], selectedSite, handleSiteChange, errors }) => {
  return (
    <div className="w-full sm:max-w-xs">
      <select
        id="selectedSite"
        value={selectedSite}
        onChange={(e) => handleSiteChange(e.target.value)}
        className="w-60 mt-1 text-gray-700 bg-white border border-gray-300 rounded-lg  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="">Sélectionner un site</option>
        {sites.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {errors?.selectedSite && (
        <div className="mt-1 text-red-500 text-xs font-bold">
          {errors.selectedSite}
        </div>
      )}
    </div>
  );
};

export default SelectSite;
