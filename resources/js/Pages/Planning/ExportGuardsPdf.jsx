import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

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

const ExportGuardPdf = ({
  events = [],
  posts = [],
  sites = [],
  currentMonth,
  currentYear,
  selectedSite,
}) => {
    const [isTableOpen, setIsTableOpen] = useState(false);
  
  const [selectedMonth, setSelectedMonth] = useState(
    currentMonth || new Date().getMonth() + 1
  );
  const [currentDate] = useState(new Date());

  const uniqueUsers = Array.from(
    new Set(events.map((event) => event.userName))
  );

  const handleExportPDF = (userFullName) => {
    const doc = new jsPDF();

    const monthName = months.find(
      (month) => month.value == selectedMonth
    ).label;

    try {
      const selectedYear = currentDate.getFullYear();
      const monthYear = `${monthName} ${selectedYear}`; // Use the selected month

      const logoUrl = "/assets/img/logo-atalix.png";
      doc.addImage(logoUrl, "PNG", 14, 14, 20, 20);

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0); // Set text color to black
      doc.text("Atalix Sécurité", 36, 18);

      doc.setFontSize(10);
      doc.setFont("helvetica");
      doc.text("123 Rue de l'Exemple", 36, 24);
      doc.text("75000 Paris, France", 36, 28);
      doc.text("Téléphone: +33 1 23 45 67 89", 36, 32);

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(userFullName, doc.internal.pageSize.getWidth() - 14, 18, {
        align: "right",
      });

      doc.setFontSize(10);
      doc.setFont("helvetica");
      doc.text(
        "456 Avenue de l'Exemple",
        doc.internal.pageSize.getWidth() - 14,
        24,
        { align: "right" }
      );
      doc.text(
        "34000, Montpellier",
        doc.internal.pageSize.getWidth() - 14,
        28,
        { align: "right" }
      );
      doc.text(
        "Téléphone: +33 6 12 34 56 78",
        doc.internal.pageSize.getWidth() - 14,
        32,
        { align: "right" }
      );

      doc.setLineWidth(0.5);
      doc.line(14, 36, 196, 36);
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Planning de l'agent ${userFullName} \n ${monthYear}`,
        doc.internal.pageSize.getWidth() / 2,
        44,
        { align: "center" }
      );

      doc.setFontSize(8);
      doc.setTextColor(255, 0, 0); // Set text color to red for the warning text
      doc.text(
        "Planning provisoire à titre indicatif sous réserve de modifications conformément à la convention collective",
        doc.internal.pageSize.getWidth() / 2,
        56,
        { align: "center" }
      );

      doc.setTextColor(0, 0, 0); // Set text color back to black

      const generateMonthDates = (year, month) => {
        const dates = [];
        const date = new Date(year, month - 1, 1); // month is 0-indexed
        while (date.getMonth() === month - 1) {
          dates.push(new Date(date));
          date.setDate(date.getDate() + 1);
        }
        return dates;
      };

      const getWeekdayAbbreviation = (date) => {
        const weekdays = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"];
        return weekdays[date.getDay()];
      };

      const monthDates = generateMonthDates(selectedYear, selectedMonth);



      const abbreviationToName = posts.reduce((acc, post) => {
     
        acc[post.abbreviation] = post.name; // Associe l'abréviation au nom
        return acc;
      }, {});

     

      const userEvents = events.filter((e) => e.userName === userFullName);
      const tableData = monthDates.map((date) => {
        const formattedDate = `${getWeekdayAbbreviation(date)} ${format(
          date,
          "dd MMMM yyyy",
          { locale: fr }
        )}`;
        const event = userEvents.find(
          (e) =>
            parseISO(e.selected_days).toDateString() === date.toDateString()
        );

        const pauseText =
          event?.pause_payment && (event.pause_start || event.pause_end)
            ? `${event.pause_start} - ${event.pause_end}`
            : "non défini";

        const siteDetails = sites.find((site) => site.id == selectedSite) || {};

        return [
          formattedDate,
          abbreviationToName[event?.post] || "",
          event ? `${event.vacation_start} - ${event.vacation_end}` : "",
          event ? ` ${pauseText}` : "", // Displaying pauseText next to pause_payment
          event?.work_duration / 60 || "",
          event ? `${siteDetails.name}, ${siteDetails.address}` : "",
        ];
      });

      autoTable(doc, {
        startY: 58,
        head: [
          [
            "Date",
            "Type de poste",
            "Horaire",
            "Heure de Pause",
            "Heures",
            "Site",
          ],
        ],
        body: tableData,
        theme: "grid",
        styles: {
          fontSize: 8,
          cellPadding: 1.5,
        },
        headStyles: {
          fillColor: [173, 216, 230],
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
      });

      doc.save(`Planning_${userFullName}_${monthYear}.pdf`);
    } catch (error) {
      console.error("An error occurred while generating the PDF:", error);
    }
  };

  return (
    <div className="flex flex-col" title="Exporter planning par agent">
    <button
        type="button"
       className="px-2 w-full py-1 bg-blue-700 text-white rounded hover:bg-blue-600 flex items-center"
        onClick={() => setIsTableOpen(!isTableOpen)}
        aria-expanded={isTableOpen}
      >
        <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5 mr-2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 16v-8m0 8l4-4m-4 4l-4-4m12 2v6H4v-6"
        />
      </svg>
      Exporter planning par agent
      </button>

  
      {isTableOpen && (
    <div className="flex flex-wrap gap-4 mt-3">
      {uniqueUsers.length ? (
        uniqueUsers.map((userName, index) => (
          <button
            key={index}
            className="bg-blue-700 text-white text-xs font-bold px-2 py-1 rounded-md hover:bg-blue-600 transition-colors duration-200"
            onClick={() => handleExportPDF(userName)}
          >
            {userName}
          </button>
        ))
      ) : (
        <p className="text-gray-600">Aucun utilisateur trouvé dans les événements.</p>
      )}
    </div>)}
  </div>
  



  );
};

export default ExportGuardPdf;
