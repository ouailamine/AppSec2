import React, { useState } from "react";

const SelectMonth = ({ handleMonthChange, isDisabled ,currentMonth}) => {
  // Tableau des mois
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

  // Valeur sélectionnée (initialement le mois courant ou un mois vide)
  const [selectedMonth, setSelectedMonth] = useState("");

  const handleChange = (event) => {
    const selected = event.target.value;
    setSelectedMonth(selected);
    if (handleMonthChange) {
      handleMonthChange(selected); // Notifie le parent du changement de mois
    }
  };

  return (
    <select
      value={selectedMonth}
      onChange={handleChange}
      disabled={isDisabled}
      className="w-full sm:max-w-xs p-2 border border-gray-300 rounded-lg bg-white text-gray-800 cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
    >
      <option value="" disabled>
        Sélectionner un mois
      </option>
      {months.map((month) => (
        <option key={month.value} value={month.value}>
          {month.label}
        </option>
      ))}
    </select>
  );
};

export default SelectMonth;
