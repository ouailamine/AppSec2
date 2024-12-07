import React, { useState } from "react";
import PropTypes from "prop-types";

import SelectSite from "./import/SelectSite";
import SelectMonth from "./import/SelectMonth";
import SelectYear from "./import/SelectYear";

function SiteMonthYearSelect({ sites, onAdd }) {
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [errors, setErrors] = useState({ site: "", month: "", year: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSiteChange = (site) => {
    setSelectedSite(site);
    setErrors((prev) => ({ ...prev, site: "" }));
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setErrors((prev) => ({ ...prev, month: "" }));
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setErrors((prev) => ({ ...prev, year: "" }));
  };

  const rules = {
    site: (value) => (!!value ? "" : "Veuillez sélectionner un site."),
    month: (value) => (!!value ? "" : "Veuillez sélectionner un mois."),
    year: (value) => (!!value ? "" : "Veuillez sélectionner une année."),
  };

  const validateForm = () => {
    const newErrors = {
      site: rules.site(selectedSite),
      month: rules.month(selectedMonth),
      year: rules.year(selectedYear),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleCreatePlanning = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        await onAdd({
          siteId: selectedSite,
          month: selectedMonth,
          year: selectedYear,
        });
      } catch (error) {
        console.error("Error creating planning:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReset = () => {
    setSelectedSite("");
    setSelectedMonth("");
    setSelectedYear("");
    setErrors({ site: "", month: "", year: "" });
  };

  return (
    <div className="mx-auto p-4 bg-gray-300 shadow-md rounded-lg space-y-4">
      <div className="flex flex-wrap gap-16 items-start">
        {/* Select Site */}
        <div className="flex-1">
          <SelectSite
            sites={sites}
            selectedSite={selectedSite}
            handleSiteChange={handleSiteChange}
            className={errors.site ? "error-border" : ""}
          />
          {errors.site && (
            <p className="mt-1 font-bold text-red-500 text-sm">{errors.site}</p>
          )}
        </div>

        {/* Select Month */}
        <div className="flex-1">
          <SelectMonth
            currentMonth={selectedMonth}
            handleMonthChange={handleMonthChange}
            className={errors.month ? "error-border" : ""}
          />
          {errors.month && (
            <p className="mt-1 font-bold text-red-500 text-sm">
              {errors.month}
            </p>
          )}
        </div>

        {/* Select Year */}
        <div className="flex-1">
          <SelectYear
            currentYear={selectedYear}
            handleYearChange={handleYearChange}
            className={errors.year ? "error-border" : ""}
          />
          {errors.year && (
            <p className="mt-1 font-bold text-red-500 text-sm">{errors.year}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center">
        <div className="flex-1 flex gap-2 justify-center">
          <button
            onClick={handleCreatePlanning}
            disabled={isLoading}
            aria-label="Create Planning"
            className={`py-2 px-3 ${
              isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white rounded-md transition-colors duration-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            {isLoading ? "Chargement..." : "Créer"}
          </button>

          <button
            onClick={handleReset}
            className="py-2 px-3 bg-gray-700 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
}

SiteMonthYearSelect.propTypes = {
  sites: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default SiteMonthYearSelect;
