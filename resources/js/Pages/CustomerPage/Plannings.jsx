import React, { useState, useEffect } from "react";
import ExportPlanningsPdf from "../Planning/ExportPdfPlanning";
import { Head } from "@inertiajs/react";

const PlanningPage = ({ plannings, sites = [], holidays }) => {
  const [openPlanningIds, setOpenPlanningIds] = useState([]); // IDs des plannings ouverts
  const [selectedMonth, setSelectedMonth] = useState(""); // Mois sélectionné (vide = tout)

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
    { value: "12", label: "Décembre" },
  ];

  useEffect(() => {
    // Get the current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() is zero-based, so add 1
    const currentYear = currentDate.getFullYear();

    // Set the default selected month to the current month and year
    setSelectedMonth(`${currentMonth}-${currentYear}`);
  }, []);

  const togglePlanning = (planningId) => {
    setOpenPlanningIds(
      (prev) =>
        prev.includes(planningId)
          ? prev.filter((id) => id !== planningId) // Fermer le planning
          : [...prev, planningId] // Ouvrir le planning
    );
  };

  // Filtrer les plannings par mois sélectionné
  const filteredPlannings = selectedMonth
    ? plannings.filter(
        (planning) =>
          planning.month === parseInt(selectedMonth.split("-")[0], 10) &&
          planning.year === selectedMonth.split("-")[1]
      )
    : plannings;

  return (
    <div className="planning-page">
      <Head title="Liste des Plannings" />
      {/* Menu de sélection du mois */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-center">
          Filtrer par mois :
        </label>
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            ...new Set(
              plannings.map((planning) => `${planning.month}-${planning.year}`)
            ),
          ] // Combinaison mois-année
            .sort(
              (a, b) =>
                new Date(a.split("-")[1], a.split("-")[0] - 1) -
                new Date(b.split("-")[1], b.split("-")[0] - 1)
            )
            .map((monthYear) => {
              const [month, year] = monthYear.split("-");
              const monthName = months.find((m) => m.value === month)?.label;

              return (
                <button
                  key={monthYear}
                  onClick={() => setSelectedMonth(monthYear)}
                  className={`px-3 py-2 text-sm rounded-md ${
                    selectedMonth === monthYear
                      ? "bg-blue-800 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {monthName} {year}
                </button>
              );
            })}
        </div>
      </div>

      {filteredPlannings.length === 0 ? (
        <div className="text-center text-gray-500 mt-2">
          Aucun planning disponible pour ce mois.
        </div>
      ) : (
        filteredPlannings.map((planning) => {
          const isOpen = openPlanningIds.includes(planning.id);
          const site = sites.find((site) => site.id == planning.site_id);
          const siteName = site ? site.name : "Site non trouvé"; // Fallback value if site not found

          return (
            <div className="flex justify-between items-center mt-2 p-2 bg-white rounded-xl shadow-sm border border-gray-200">
              <span className="text-lg font-semibold text-gray-800">{`Site: ${siteName}`}</span>

              <ExportPlanningsPdf
                selectedSite={planning.site_id}
                currentMonth={planning.month}
                currentYear={planning.year}
                holidays={holidays}
                events={planning.events}
                sites={sites}
              />
            </div>

            /*}
            <div key={planning.id} className="planning-detail mb-4">
             
              <button
                type="button"
                className="mt-3 w-full bg-blue-800 text-white flex justify-between text-xs items-center px-2 py-1 rounded-md"
                onClick={() => togglePlanning(planning.id)}
                aria-expanded={isOpen}
              >
                <span className="text-[18px] font-bold">Site: {siteName}</span>
                <svg
                  className={`w-8 h-8 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 9l6 6 6-6"
                  />
                </svg>
              </button>

            
              {isOpen && (
                <div className="flex justify-center items-center p-4 bg-gray-100 rounded-lg shadow-lg">
                  <ExportPlanningsPdf
                    selectedSite={planning.site_id}
                    currentMonth={planning.month}
                    currentYear={planning.year}
                    holidays={holidays}
                    events={planning.events}
                    sites={sites}
                  />
                </div>
              )}
            </div>{*/
          );
        })
      )}
    </div>
  );
};

export default PlanningPage;
