import React from "react";

import {months} from "../../importVariable"


const PlanningHeader = ({ selectedSite, currentMonth, currentYear, sites }) => {
  console.log(selectedSite);

  const getMonthName = (month) => {
    const monthObj = months.find((m) => m.value == month);
    return monthObj ? monthObj.label : ""; // Retourne le label ou une chaîne vide si le mois n'est pas trouvé
  };

  // Récupérer le nom du mois basé sur currentMonth
  const nameMonth = getMonthName(currentMonth);

  const site = sites.find((m) => m.id == selectedSite) || null;

  return (
    <div className="text-center mt-1 mb-1 px-2 sm:px-2 lg:px-8">
      <hr className="mb-2" />
      <h1 className="text-4xl font-semibold text-gray-900 mb-2">
        Site:{" "}
        <span className="text-blue-600">
          {site ? site.name : "Site non trouvé"}
        </span>
      </h1>
      <h2 className="text-2xl font-medium text-gray-700">
        {nameMonth} <span className="text-blue-600">{currentYear}</span>
      </h2>
      <div className="mt-2 pt-1">
        <hr className="m-2 "/>
        <div className="text-gray-600 text-sm">
          <span className="font-semibold">Adresse:</span>{" "}
          {site ? site.address : "N/A"}
          <span className="mx-2">||</span>
          <span className="font-semibold">Téléphone:</span>{" "}
          {site ? site.phone : "N/A"}
          <span className="mx-2">||</span>
          <span className="font-semibold">Email:</span>{" "}
          {site ? site.email : "N/A"}
        </div>
        
      </div>
      <hr className="mt-2" />
    </div>
  );
};

export default PlanningHeader;
