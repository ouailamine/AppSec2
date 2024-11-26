import React from "react";

const months = [
  { value: "1", label: "Janvier" },
  { value: "2", label: "Février" },
  { value: "3", label: "Mars" },
  { value: "4", label: "Avril" },
  { value: "5", label: "Mai" },
  { value: "6", label: "Juin" },
  { value: "7", label: "Juillet" },
  { value: "8", label: "Août" },
  { value: "9", label: "Septembre" },
  { value: "10", label: "Octobre" },
  { value: "11", label: "Novembre" },
  { value: "12", label: "Décembre" }
];

const PlanningHeader = ({ selectedSite, currentMonth, currentYear,sites }) => {
  const getMonthName = (month) => {
    const monthObj = months.find((m) => m.value == month);
    return monthObj ? monthObj.label : '';  // Retourne le label ou une chaîne vide si le mois n'est pas trouvé
  };

 
  const site = sites.find((m) => m.id === selectedSite) || null;

  // Récupérer le nom du mois basé sur currentMonth
  const nameMonth = getMonthName(currentMonth);


  return (
    <div className="text-center mt-12 mb-16 px-4 sm:px-2 lg:px-8">
      <h1 className="text-4xl font-semibold text-gray-900 mb-2">
        Site: <span className="text-blue-600">{site ? site.name : 'Site non trouvé'}</span>
      </h1>
      <h2 className="text-2xl font-medium text-gray-700">
        {nameMonth} <span className="text-blue-600">{currentYear}</span>
      </h2>
      <div className="border-t border-gray-200 mt-4 pt-2 max-w-md mx-auto">
        <div className="text-gray-600 text-sm italic">
          <span className="font-semibold">Adresse:</span> {site ? site.address : 'N/A'}
          <span className="mx-2">|</span>
          <span className="font-semibold">Téléphone:</span> {site ? site.phone : 'N/A'}
          <span className="mx-2">|</span>
          <span className="font-semibold">Email:</span> {site ? site.email : 'N/A'}
        </div>
      </div>
    </div>
  );
};

export default PlanningHeader;
