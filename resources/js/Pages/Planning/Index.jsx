import React, { useState } from "react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import NavBar from "./import/NavBar";

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

const PlanningList = ({ plannings, sites }) => {
  const [search, setSearch] = useState({ site: "", year: "", month: "" });
  const [openSites, setOpenSites] = useState({}); // Nouveau état pour gérer l'ouverture de chaque site

  const getMonthName = (monthValue) => {
    const monthObject = months.find((month) => month.value == monthValue);
    return monthObject ? monthObject.label : "Unknown";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  const handleSearchChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const filterPlanningsBySearch = () => {
    return plannings.filter((planning) => {
      const matchesSite = search.site === "" || planning.site.id == search.site;
      const matchesYear = search.year === "" || planning.year == search.year;
      const matchesMonth =
        search.month === "" || planning.month == search.month;
      return matchesSite && matchesYear && matchesMonth;
    });
  };

  const filteredPlannings = filterPlanningsBySearch();

  const handleShowPlanning = (year, siteId, month) => {
    const planningIds =
      filteredPlannings
        .filter(
          (planning) =>
            planning.year === year &&
            planning.site?.id === siteId &&
            planning.month === month
        )
        .map((planning) => planning.id) || [];

    if (planningIds.length > 0) {
      Inertia.visit(route("plannings.show", planningIds), {
        method: "get",
        data: { planningIds },
        onSuccess: (page) => {},
        onError: (error) => {
          console.error("Error:", error);
        },
      });
    }
  };

  const handleToggleSite = (siteId) => {
    setOpenSites((prevState) => ({
      ...prevState,
      [siteId]: !prevState[siteId],
    }));
  };

  const handleValidate = (planningId) => {
    console.log(`Valider le planning ${planningId}`);
    if (window.confirm("Voulez-vous valider ce planning ?")) {
      Inertia.post(route("plannings.validate"), { planningId });
    }
  };

  const handleDelete = (planningIds) => {
    if (window.confirm("Voulez-vous supprimer ce planning ?")) {
      Inertia.delete(route("plannings.destroy", planningIds));
    }
  };

  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() + i
  );

  const sortedPlannings = (plannings) => {
    return [...plannings].sort((a, b) => a.month - b.month);
  };

  return (
    <AdminAuthenticatedLayout>
      <Head title="Liste des Plannings" />

      <div className="m-4 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Liste des Plannings
        </h1>

        <div className="flex justify-center mb-4">
          <a
            href={route("plannings.create")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transform transition duration-200 hover:scale-105"
          >
            Créer un planning
          </a>
        </div>

        <form className="mb-6 bg-white p-2 rounded-lg shadow-lg">
          <h2 className="text-sm text-black font-bold text-center mb-3 bg-gray-300">
            Recherche d'un Planning
          </h2>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3 justify-center items-center">
            <div className="relative mt-1">
              <select
                name="site"
                value={search.site}
                onChange={handleSearchChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Tous les sites</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative mt-1">
              <select
                name="month"
                value={search.month}
                onChange={handleSearchChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Tous les mois</option>
                {months.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative mt-1">
              <select
                name="year"
                value={search.year}
                onChange={handleSearchChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Toutes les années</option>

                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>

        {filteredPlannings.length === 0 ? (
          <p className="text-sm text-black">
            Aucun planning disponible pour les critères sélectionnés.
          </p>
        ) : (
          sites
            .filter(
              (site) =>
                (site &&
                  filteredPlannings.some(
                    (planning) => planning.site?.id === site.id
                  )) ||
                search.site === ""
            )
            .map((site) => {
              const sitePlannings = sortedPlannings(
                filteredPlannings.filter(
                  (planning) => planning.site?.id === site.id
                )
              );

              return (
                <div
                  key={site.id}
                  className="border border-gray-200 rounded-lg shadow-lg bg-white p-1 mb-6"
                >
                  <button
                    type="button"
                    className="w-full  text-black text-xl  flex justify-between items-center px-2 py-1 rounded-md"
                    onClick={() => handleToggleSite(site.id)}
                    aria-expanded={openSites[site.id]}
                  >
                    <p className="text-black font-blod">{site.name}</p>
                    <svg
                      className={`w-8 h-8 transition-transform duration-300 ${
                        openSites[site.id] ? "rotate-180" : ""
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

                  {openSites[site.id] && (
                    <div className="mt-2 space-y-2">
                      {sitePlannings.length === 0 ? (
                        <p className="text-sm text-gray-600">
                          Aucun planning disponible pour ce site.
                        </p>
                      ) : (
                        sitePlannings.map((planning) => (
                          <div
                            key={planning.id}
                            className="rounded-lg bg-gray-100 p-2 mb-1"
                          >
                            <div className="border rounded-lg p-2 flex justify-between items-center bg-white shadow-sm">
                              <div className="flex items-center space-x-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                  {getMonthName(planning.month)} {planning.year}
                                </h3>
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    planning.isValidate
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {planning.isValidate
                                    ? "Validé: Oui"
                                    : "Validé: Non"}
                                </span>
                                <span className="text-xs font-bold">
                                  Crée le {formatDate(planning.created_at)}
                                </span>
                              </div>

                              <div className="flex space-x-3">
                                <button
                                  onClick={() =>
                                    handleShowPlanning(
                                      planning.year,
                                      site.id,
                                      planning.month
                                    )
                                  }
                                  className="px-4 py-2 text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  Voir
                                </button>

                                {!planning.isValidate && (
                                  <button
                                    onClick={() => handleValidate(planning.id)}
                                    className="px-4 py-2 text-sm font-medium rounded-md text-green-600 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                  >
                                    Valider
                                  </button>
                                )}

                                <button
                                  onClick={() => handleDelete(planning.id)}
                                  className="px-4 py-2 text-sm font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  Supprimer
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })
        )}
      </div>
    </AdminAuthenticatedLayout>
  );
};

export default PlanningList;
