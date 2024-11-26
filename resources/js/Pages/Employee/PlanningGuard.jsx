import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { format, isValid, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Fonction pour obtenir les détails du site par site_id
const getSiteDetails = (siteId, sites) => {
  const site = sites.find((site) => site.id === siteId);
  return site || { name: "", address: "" };
};

// Fonction pour formater le temps en "H:M"
const formatTime = (time) => {
  if (!time || typeof time !== "string") return "";

  const [hours, minutes] = time.split(":");
  if (isNaN(hours) || isNaN(minutes)) return "";

  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));

  if (isNaN(date.getTime())) return "";

  return format(date, "HH:mm");
};

// Fonction pour obtenir l'abréviation du jour de la semaine en français
const getDayAbbreviation = (date) => {
  const dayName = format(date, "EEEE", { locale: fr });
  return dayName.slice(0, 2).toUpperCase();
};

export default function Dashboard({ plannings, auth, sites, posts }) {
  console.log(auth.user.fullname);
  const userFullName = auth.user ? auth.user.fullname : "Agent";
  const userFirstName = auth.user ? auth.user.firstname : "Agent";
  const userRegisterNumber = auth.user ? auth.user.registerNumber : "ABC0000";
  const currentMonth = new Date().getMonth() + 1; // Mois actuel (1-12)
  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

 

  const currentDate = new Date();
  const monthYear = format(currentDate, "MMMM yyyy", { locale: fr });

  // Obtenez les événements pour le mois sélectionné
  const filteredPlannings = plannings.filter(
    (planning) => planning.month === selectedMonth
  );
  const events = filteredPlannings.flatMap((planning) => planning.events);

  const sortedEvents = events.sort((a, b) => {
    const dateA = parseISO(a.selected_days);
    const dateB = parseISO(b.selected_days);
    return dateA - dateB;
  });

  const totalHours = sortedEvents.reduce((sum, event) => {
    const hours = parseFloat(event.work_duration) || 0;
    return sum + hours;
  }, 0);

  const totalNeightHours = sortedEvents.reduce((sum, event) => {
    const hours = parseFloat(event.night_hours) || 0;
    return sum + hours;
  }, 0);
  const totalSundayHours = sortedEvents.reduce((sum, event) => {
    const hours = parseFloat(event.sunday_hours) || 0;
    return sum + hours;
  }, 0);
  const totalHolidayHours = sortedEvents.reduce((sum, event) => {
    const hours = parseFloat(event.holiday_hours) || 0;
    return sum + hours;
  }, 0);

  const totalPaniers = sortedEvents.reduce((count, event) => {
    const workDurationHours = parseFloat(event.work_duration) || 0;
    return count + (workDurationHours > 6 ? 1 : 0);
  }, 0);

  // Liste des mois visible
  const months = [
    {
      name: format(new Date(new Date().setMonth(prevMonth - 1)), "MMMM", {
        locale: fr,
      }),
      value: prevMonth,
    },
    {
      name: format(new Date(new Date().setMonth(currentMonth - 1)), "MMMM", {
        locale: fr,
      }),
      value: currentMonth,
    },
    {
      name: format(new Date(new Date().setMonth(nextMonth - 1)), "MMMM", {
        locale: fr,
      }),
      value: nextMonth,
    },
  ];

  const handleExportPDF = () => {
    const doc = new jsPDF();

    try {
      const selectedYear = currentDate.getFullYear();
      const monthYear = `${selectedMonth}/${selectedYear}`; // Use the selected month

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
        `Planning de l'agent ${userFullName} ${monthYear}`,
        doc.internal.pageSize.getWidth() / 2,
        44,
        { align: "center" }
      );

      doc.setFontSize(8);
      doc.setTextColor(255, 0, 0); // Set text color to red for the warning text
      doc.text(
        "Planning provisoire à titre indicatif sous réserve de modifications conformément à la convention collective",
        doc.internal.pageSize.getWidth() / 2,
        54,
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

      // Use the selected month to generate dates
      const monthDates = generateMonthDates(selectedYear, selectedMonth);

      // Create a mapping from abbreviation to name
      const abbreviationToName = posts.reduce((acc, post) => {
        acc[post.abbreviation] = post.name;
        return acc;
      }, {});

      const tableData = monthDates.map((date) => {
        const formattedDate = `${getWeekdayAbbreviation(date)} ${format(
          date,
          "dd MMMM yyyy",
          { locale: fr }
        )}`;
        const event = sortedEvents.find(
          (e) =>
            parseISO(e.selected_days).toDateString() === date.toDateString()
        );

        const pauseText =
          event?.pause_payment && (event.pause_start || event.pause_end)
            ? `${formatTime(event.pause_start)} - ${formatTime(
                event.pause_end
              )}`
            : "";

        const pauseSymbol =
          event?.pause_payment === "Payable"
            ? { text: "P", color: [0, 0, 255] }
            : { text: "P", color: [255, 0, 0] };

        return {
          data: [
            formattedDate,
            abbreviationToName[event?.post] || "", // Use name instead of abbreviation
            event
              ? `${formatTime(event.vacation_start)} - ${formatTime(
                  event.vacation_end
                )}`
              : "",
            event?.pause_payment ? (pauseText ? " " + pauseText : "") : "", // Display "P" only if pause_payment exists and either start or end time is present
            event?.work_duration || "",
            event
              ? `${getSiteDetails(plannings[0].site_id, sites).name}, ${
                  getSiteDetails(plannings[0].site_id, sites).address
                }`
              : "",
          ],
          isWeekend: [0, 6].includes(date.getDay()),
          pauseSymbol: event?.pause_payment ? pauseSymbol : null, // Only include if pause_payment exists
        };
      });

      autoTable(doc, {
        startY: 60,
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
        body: tableData.map((row) => row.data),
        theme: "grid",
        styles: {
          fontSize: 8, // Reduce font size
          halign: "center",
          valign: "middle",
          overflow: "linebreak",
          cellPadding: 1.5, // Decrease cell padding
          textColor: [0, 0, 0], // Set default text color to black
        },
        headStyles: {
          fillColor: [173, 216, 230],
          textColor: [0, 0, 0],
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
        didDrawCell: (data) => {
          const rowIndex = data.row.index;
          if (tableData[rowIndex] && tableData[rowIndex].isWeekend) {
            doc.setFillColor(173, 216, 230); // Light blue color for weekends
            doc.rect(
              data.cell.x,
              data.cell.y,
              data.cell.width,
              data.cell.height,
              "F"
            );
            doc.setTextColor(0, 0, 0); // Ensure text color is black
            doc.text(
              data.cell.text,
              data.cell.x + data.cell.width / 2,
              data.cell.y + data.cell.height / 2,
              { align: "center", baseline: "middle" }
            );
          }

          // Custom drawing for "Heure de Pause" column
          if (data.column.index === 3) {
            // 3 is the index of "Heure de Pause" column
            const rowData = tableData[rowIndex];
            if (rowData.pauseSymbol) {
              doc.setTextColor(...rowData.pauseSymbol.color); // Set color for the symbol
              doc.text(
                rowData.pauseSymbol.text,
                data.cell.x + 2,
                data.cell.y + data.cell.height / 2,
                { align: "left", baseline: "middle" }
              );
              doc.setTextColor(0, 0, 0); // Reset color for the rest of the text
            }
          }
        },
      });

      // Draw legend below the table
      let finalY = doc.lastAutoTable.finalY || 60; // Get the position where the table ends

      // Draw "Pause Payée" legend
      doc.setTextColor(0, 0, 255); // Blue color for "Pause Payée"
      doc.text("P - Pause Payée", 14, finalY + 16);

      // Draw "Pause Non Payée" legend
      doc.setTextColor(255, 0, 0); // Red color for "Pause Non Payée"
      doc.text("P - Pause Non Payée", 14, finalY + 20);

      doc.setTextColor(0, 0, 0); // Reset text color to black

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0); // Set text color to black for page numbers and dates
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.getWidth() - 20,
          doc.internal.pageSize.getHeight() - 10,
          { align: "right" }
        );
      }

      doc.save(`Planning_${monthYear}.pdf`);
    } catch (error) {
      console.error("An error occurred while generating the PDF:", error);
    }
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Planning" />
      <div className="py-02 px-5 sm:px-2 lg:px-8 bg-gray-100 min-h-screen">
      <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Bonjour, {userFullName} {userFirstName}
          </h1>

          Matricule :{userRegisterNumber}
          <h2 className="text-lg font-semibold text-gray-700">
            Atalix Sécurité
          </h2>
        </div>

        <div className="mb-8 p-2 bg-white shadow-md rounded-lg">
          <div className="mb-4 flex items-center space-x-4">
            <label
              htmlFor="month-select"
              className="text-gray-700 font-medium text-sm"
            >
              Sélectionner un mois :
            </label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="pl-2 pr-8 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
              aria-label="Sélectionner un mois"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.name}
                </option>
              ))}
            </select>
          </div>
          <div className="border-t border-gray-300 mb-4"></div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="p-3 text-center text-gray-600 border-r border-gray-300">
                    Total heures:{" "}
                    <span className="font-semibold text-gray-800">
                      {totalHours.toFixed(2)}
                    </span>
                  </th>
                  <th className="p-3 text-center text-gray-600 border-r border-gray-300">
                    Paniers:{" "}
                    <span className="font-semibold text-gray-800">
                      {totalPaniers}
                    </span>
                  </th>
                  <th className="p-3 text-center text-gray-600 border-r border-gray-300">
                    Heures de nuit:{" "}
                    <span className="font-semibold text-gray-800">
                      {totalNeightHours}
                    </span>
                  </th>
                  <th className="p-3 text-center text-gray-600 border-r border-gray-300">
                    Heures de dimanche:{" "}
                    <span className="font-semibold text-gray-800">
                      {totalSundayHours}
                    </span>
                  </th>
                  <th className="p-3 text-center text-gray-600">
                    Heures fériées:{" "}
                    <span className="font-semibold text-gray-800">
                      {totalHolidayHours}
                    </span>
                  </th>
                </tr>
              </thead>
            </table>
          </div>

          <div className="m-6 flex flex-wrap gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-blue-100 border border-gray-300 rounded-full"></div>
              <span className="text-gray-800 font-semibold">Week-end</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-red-100 border border-gray-300 rounded-full"></div>
              <span className="text-gray-800 font-semibold">Jour férié</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 flex items-center justify-center text-blue-500 font-semibold rounded-full">
                P
              </div>
              <span className="text-gray-800 font-semibold">Pause Payable</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 flex items-center justify-center text-red-500 font-semibold rounded-full">
                P
              </div>
              <span className="text-gray-800 font-semibold">
                Pause Non-payable
              </span>
            </div>
          </div>

          <div className="border-t border-gray-300 mt-4"></div>
        </div>

        <div className="mb-4">
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Exporter en PDF
          </button>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Date
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Poste
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Horaire
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Pause
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Total heures
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Site
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Paniers
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {sortedEvents.length > 0 ? (
                sortedEvents.map((event, index) => {
                  const eventDate = parseISO(event.selected_days);
                  const isDateValid = isValid(eventDate);
                  const siteDetails = getSiteDetails(
                    plannings[0].site_id,
                    sites
                  );
                  const isWeekend =
                    isDateValid && [0, 6].includes(eventDate.getDay());

                  // Déterminer si la durée de travail est supérieure à 6 heures
                  const workDurationHours =
                    parseFloat(event.work_duration) || 0;
                  const panier = workDurationHours >= 6 ? "1" : "/";

                  return (
                    <tr
                      key={index}
                      className={`hover:bg-gray-100 transition duration-150 ease-in-out ${
                        isWeekend ? "bg-blue-100" : ""
                      }`}
                    >
                      <td className="px-2 py-0 text-sm font-medium text-gray-900">
                        {isDateValid
                          ? `${getDayAbbreviation(eventDate)} ${format(
                              eventDate,
                              "dd MMMM yyyy",
                              { locale: fr }
                            )}`
                          : "Date invalide"}
                      </td>
                      <td className="px-2 py-0 text-sm text-gray-700">
                        {event.post || ""}
                      </td>
                      <td className="px-2 py-0 text-sm text-gray-700">
                        {formatTime(event.vacation_start)} -{" "}
                        {formatTime(event.vacation_end)}
                      </td>
                      <td className="px-2 py-0 text-sm text-gray-700">
                        {event.pause_payment === "Non-payable" ? (
                          <span className="text-red-600 font-semibold">P</span>
                        ) : (
                          <span className="text-blue-600 font-semibold">P</span>
                        )}
                        <br />
                        <span className="text-gray-500 text-xs">
                          {formatTime(event.pause_start)} -{" "}
                          {formatTime(event.pause_end)}
                        </span>
                      </td>
                      <td className="px-2 py-0 text-sm text-gray-700">
                        {event.work_duration}
                      </td>
                      <td className="px-2 py-0 text-sm text-gray-700">
                        {siteDetails.name}, {siteDetails.address}
                      </td>
                      <td className="px-2 py-0 text-sm text-gray-700">
                        {panier}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-2 py-0 text-center text-sm text-gray-500"
                  >
                    Aucune vacation à venir
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
