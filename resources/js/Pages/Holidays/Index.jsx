import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head } from "@inertiajs/react";
import HolidayForm from "./HolidayForm";

// Fonction utilitaire pour grouper les jours fériés par année et mois
const groupByYearAndMonth = (holidays) => {
  return holidays.reduce((result, holiday) => {
    const date = new Date(holiday.date);
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });

    if (!result[year]) {
      result[year] = {};
    }

    if (!result[year][month]) {
      result[year][month] = [];
    }

    result[year][month].push(holiday);
    return result;
  }, {});
};

// Composant pour les boutons Modifier et Supprimer
const ActionButtons = ({ holiday, onEdit, onDelete }) => (
  <div className="flex space-x-2">
    <button
      onClick={() => onEdit(holiday)}
      className="bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-4 py-2 text-sm transition-colors"
    >
      Modifier
    </button>
    <button
      onClick={() => onDelete(holiday.id)}
      className="bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg px-4 py-2 text-sm transition-colors"
    >
      Supprimer
    </button>
  </div>
);

// Composant pour afficher les jours fériés d'un mois
const MonthSection = ({ month, holidays, onEdit, onDelete }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
    <h3 className="text-2xl font-semibold text-gray-800 mb-4">{month}</h3>
    <ul className="space-y-3">
      {holidays.map((holiday) => (
        <li
          key={holiday.id}
          className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm transition-transform transform hover:scale-105"
        >
          <span className="text-gray-700">
            {holiday.name} - {holiday.date}
          </span>
          <ActionButtons
            holiday={holiday}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  </div>
);

// Composant pour afficher une année avec ses mois
const YearSection = ({ year, months, onEdit, onDelete, isExpanded, onToggle }) => (
  <div className="mb-8">
    <button
      onClick={() => onToggle(year)}
      className="w-full text-left py-4 px-6 bg-gray-300 text-gray-900 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 hover:bg-gray-400"
    >
      {year}
    </button>
    {isExpanded && (
      <div className="mt-4 space-y-4">
        {Object.keys(months).map((month) => (
          <MonthSection
            key={month}
            month={month}
            holidays={months[month]}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    )}
  </div>
);

const HolidaysIndex = ({ holidays }) => {
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedYear, setExpandedYear] = useState(null);

  const groupedHolidays = groupByYearAndMonth(holidays);

  const handleShowAdd = () => {
    setSelectedHoliday(null);
    setShowModal(true);
  };

  const handleShowEdit = (holiday) => {
    setSelectedHoliday(holiday);
    setShowModal(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
  };

  const handleSave = () => {
    Inertia.reload();
  };

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce jour férié ?")) {
      Inertia.delete(`/holidays/${id}`)
        .then(() => {
          // Optionnel : gérer le succès ici
        })
        .catch(() => {
          // Optionnel : gérer l'erreur ici
        });
    }
  };

  const toggleYear = (year) => {
    setExpandedYear(expandedYear === year ? null : year);
  };

  return (
    <AdminAuthenticatedLayout>
      <Head title="Jours fériés" />
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={handleShowAdd}
          className="mb-6 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-6 py-3 shadow-md transition-transform transform hover:scale-105"
        >
          Ajouter un jour férié
        </button>
        {Object.keys(groupedHolidays).length > 0 ? (
          Object.keys(groupedHolidays).map((year) => (
            <YearSection
              key={year}
              year={year}
              months={groupedHolidays[year]}
              onEdit={handleShowEdit}
              onDelete={handleDelete}
              isExpanded={expandedYear === year}
              onToggle={toggleYear}
            />
          ))
        ) : (
          <p className="text-gray-600">Aucun jour férié disponible</p>
        )}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <HolidayForm
                holiday={selectedHoliday}
                onHide={handleHideModal}
                onSave={handleSave}
              />
            </div>
          </div>
        )}
      </div>
    </AdminAuthenticatedLayout>
  );
};

export default HolidaysIndex;
