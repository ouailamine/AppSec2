import React, { useState } from "react";
import AddCostModal from "./AddCostModal"; // Import du modal
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import SelectMonth from "../Planning/import/SelectMonth";
import SelectYear from "../Planning/import/SelectYear";
import SelectSite from "../Planning/import/SelectSite";
import SelectCustomer from "../Planning/import/SelectCustomer";

const months = [
  { value: 1, label: "Janvier" },
  { value: 2, label: "Février" },
  { value: 3, label: "Mars" },
  { value: 4, label: "Avril" },
  { value: 5, label: "Mai" },
  { value: 6, label: "Juin" },
  { value: 7, label: "Juillet" },
  { value: 8, label: "Août" },
  { value: 9, label: "Septembre" },
  { value: 10, label: "Octobre" },
  { value: 11, label: "Novembre" },
  { value: 12, label: "Décembre" },
];

const Invoices = ({ plannings, sites, allTypePosts, allPosts, customers }) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filtredPlannings = () => {
    const planning = plannings.find(
      (p) =>
        p.month === selectedMonth &&
        Number(p.year) === selectedYear &&
        p.site_id === selectedSite.id
    );
    const events = planning ? planning.events : [];
    console.log(plannings, events);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Facture
      </h1>

      {/* Filtres */}
      <div className="filters flex flex-wrap gap-4 justify-center mb-6">
        <div className="w-full sm:w-auto">
          <SelectMonth
            value={selectedMonth}
            handleMonthChange={setSelectedMonth}
          />
        </div>
        <div className="w-full sm:w-auto">
          <SelectYear
            value={selectedYear}
            handleYearChange={setSelectedYear}
          />
        </div>
        <div className="w-full sm:w-auto">
          <SelectCustomer
            customers={customers}
            handleCustomerChange={setSelectedCustomer}
          />
        </div>
        <div className="w-full sm:w-auto">
          <SelectSite
            sites={sites}
            value={selectedSite}
            handleSiteChange={setSelectedSite}
          />
        </div>
      </div>

      {/* Bouton d'affichage */}
      <div className="text-center mb-6">
        <button
          onClick={filtredPlannings}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Afficher
        </button>
      </div>

      {/* Résultat */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <p className="text-lg font-medium text-gray-700">
          Voici le détail des heures du site{" "}
          <span className="font-semibold text-gray-800">
            {sites.find((m) => m.id == selectedSite)?.name || "Aucun site"}
          </span>{" "}
          pour le mois de{" "}
          <span className="font-semibold text-gray-800">
            {months.find((m) => m.value == selectedMonth)?.label || "N/A"}{selectedYear}
          </span>{" "}
        </p>
      </div>

      {/* Boutons d'exportation (désactivés pour l'instant) */}
      {/* 
      <div className="pdf-export text-center mt-6">
        <button
          onClick={exportToPDF}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-200"
        >
          Export to PDF
        </button>
        <PDFDownloadLink
          document={<InvoicePDF invoices={filteredInvoices} />}
          fileName="invoices.pdf"
          className="ml-4"
        >
          {({ loading }) =>
            loading ? "Loading document..." : "Download PDF"
          }
        </PDFDownloadLink>
      </div>
      */}
    </div>
  );
};

export default Invoices;
