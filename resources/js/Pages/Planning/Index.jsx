import React, { useState, useMemo } from "react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";

const monthNames = [
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

const PlanningList = ({ plannings, sites, auth }) => {
  const [open, setOpen] = useState(null);
  const [search, setSearch] = useState({ site: "", year: "", month: "" });

  const toggleOpen = (id) => {
    setOpen(open === id ? null : id);
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

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Recherche:", search);
  };

  const filteredPlannings = filterPlanningsBySearch();

  const handleShowPlanning = (year, siteId, month) => {
    const planningIds =
      filteredPlannings
        .filter(
          (planning) =>
            planning.year === year &&
            planning.site.id === siteId &&
            planning.month === month
        )
        .map((planning) => planning.id) || [];

    Inertia.visit(route("plannings.show", planningIds), {
      method: "get",
      data: { planningIds },
      onSuccess: (page) => {},
      onError: (error) => {
        console.error("Error:", error);
      },
    });
  };

  const handleValidate = (planningId) => {
    console.log(`Valider le planning ${planningId}`);
    if (window.confirm("Voulez-vous valider ce planning ?")) {
      // Envoyer l'ID du planning en tant que paramètre
      Inertia.post(route("plannings.validate"), { planningId });
    }
  };

  const handleDelete = (planningIds) => {
    if (window.confirm("Voulez-vous supprimer ce planning ?")) {
      Inertia.delete(route("plannings.destroy", planningIds));
    }
  };

  // Determine current, previous, and next month
  const getMonthRange = () => {
    const today = new Date();
    const currentMonthIndex = today.getMonth(); // 0-based index (Jan = 0)
    const currentYear = today.getFullYear();

    const months = new Set();
    months.add(currentMonthIndex + 1);

    const previousMonth = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
    const nextMonth = currentMonthIndex === 11 ? 0 : currentMonthIndex + 1;

    months.add(previousMonth + 1);
    months.add(nextMonth + 1);

    return Array.from(months)
      .sort((a, b) => a - b)
      .map((month) => ({
        value: month,
        label: monthNames[month - 1],
      }));
  };

  const monthOptions = useMemo(() => {
    const availableMonths = getMonthRange();
    const allMonthOptions = monthNames.map((month, index) => ({
      value: index + 1,
      label: month,
    }));
    return availableMonths.length > 0 ? availableMonths : allMonthOptions;
  }, [plannings]);

  return (
    <AdminAuthenticatedLayout>
      <Head title="Liste des Plannings" />
      <nav className="bg-gray-600 p-2 items-center">
        {/* Navigation Links */}
        <div className="flex space-x-6">
          <a
            href={route("plannings.create")}
            className="block px-4 py-2 text-white hover:bg-blue-600 rounded-lg transition-colors duration-200 font-bold"
          >
            Crée un planning
          </a>
        </div>
      </nav>

      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Liste des Plannings
        </h1>

        {/* Button to Create a New Planning */}
        <div className="mb-6">
          <a
            href={route("plannings.create")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Créer un planning
          </a>
        </div>

        {/* Formulaire de recherche */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="site"
                className="block text-sm font-medium text-gray-700"
              >
                Site
              </label>
              <select
                name="site"
                value={search.site}
                onChange={handleSearchChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Tous les sites</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700"
              >
                Année
              </label>
              <select
                name="year"
                value={search.year}
                onChange={handleSearchChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Toutes les années</option>
                {Array.from(
                  new Set(plannings.map((planning) => planning.year))
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="month"
                className="block text-sm font-medium text-gray-700"
              >
                Mois
              </label>
              <select
                name="month"
                value={search.month}
                onChange={handleSearchChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Tous les mois</option>
                {monthOptions.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>

        {/* Liste des plannings filtrés */}
        {filteredPlannings.length === 0 ? (
          <p className="text-lg text-gray-600">
            Aucun planning disponible pour les critères sélectionnés.
          </p>
        ) : (
          sites
            .filter(
              (site) =>
                filteredPlannings.some(
                  (planning) => planning.site.id === site.id
                ) || search.site === ""
            )
            .map((site) => {
              const sitePlannings = filteredPlannings.filter(
                (planning) => planning.site.id === site.id
              );

              return (
                <div
                  key={site.id}
                  className="border border-gray-200 rounded-lg shadow-lg bg-white p-3 mb-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-700">
                      {site.name}
                    </h2>
                    <button
                      onClick={() => toggleOpen(site.id)}
                      className="text-gray-500 hover:text-gray-700 focus:outline-none transition-transform transform"
                    >
                      {open === site.id ? "Réduire" : "Afficher"}
                    </button>
                  </div>
                  {open === site.id && (
                    <div className="mt-4 space-y-4">
                      {sitePlannings.length === 0 ? (
                        <p className="text-lg text-gray-600">
                          Aucun planning disponible pour ce site.
                        </p>
                      ) : (
                        sitePlannings.map((planning) => (
                          <div
                            key={planning.id}
                            className="border border-gray-300 rounded-lg bg-gray-100 p-4 mb-3"
                          >
                            <h3 className="text-xl font-medium text-gray-800 mb-2">
                              {monthNames[planning.month - 1]} {planning.year}
                            </h3>

                            {/* Tout aligné en une seule ligne */}
                            <div className="flex justify-between items-center">
                              <div className="flex space-x-6">
                                <p className="text-sm text-gray-600">
                                  <strong>Date de Création:</strong>{" "}
                                  {new Date(
                                    planning.created_at
                                  ).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <strong>Validé:</strong>
                                  <span
                                    className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      planning.isValidate
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {planning.isValidate ? "Oui" : "Non"}
                                  </span>
                                </p>
                              </div>

                              {/* Actions à droite */}
                              <div className="flex space-x-3">
                                <button
                                  onClick={() =>
                                    handleShowPlanning(
                                      planning.year,
                                      site.id,
                                      planning.month
                                    )
                                  }
                                  className="px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  Voir
                                </button>
                                {!planning.isValidate && (
                                  <button
                                    onClick={() => handleValidate(planning.id)}
                                    className="px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-600 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                  >
                                    Valider
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDelete(planning.id)}
                                  className="px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
