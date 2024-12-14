import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const months = [
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

const ExportPdf = ({
  events,
  selectedSite,
  sites,
  currentMonth,
  currentYear,
  holidays,
}) => {
  const [logoBase64, setLogoBase64] = useState(null);

  // Fetch the site info and logo once
  const infoSite = sites.find((site) => site.id == selectedSite);

  // Function to load the logo image and convert it to Base64
  const loadImageAsBase64 = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => setLogoBase64(reader.result);
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Failed to fetch image:", error);
    }
  };

  // UseEffect to load the logo only once on component mount
  useEffect(() => {
    loadImageAsBase64("/assets/img/logo-atalix.png");
  }, []);

  const monthName = months.find((month) => month.value == currentMonth).label;

  // Function to generate the PDF
  const generatePDF = async () => {
    const doc = new jsPDF("landscape");

    // Check for valid month and year
    if (
      !currentMonth ||
      currentMonth < 1 ||
      currentMonth > 12 ||
      !currentYear ||
      currentYear < 1
    ) {
      console.error("Invalid date values.");
      return;
    }

    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    if (isNaN(daysInMonth) || daysInMonth <= 0) {
      console.error("Invalid number of days in the month.");
      return;
    }

    // Add logo if available
    const imageWidth = 20;
    const imageHeight = 20;
    const pageWidth = doc.internal.pageSize.width;
    const centerX = (pageWidth - imageWidth) / 2;

    const titleImage = `Atalix Sécurité`;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold"); // Tailwind-inspired bold font
    doc.text(titleImage, pageWidth / 2, 27, { align: "center" });

    // Adding a dot (bullet point) next to the text "Atalix Sécurité"
    const dot = "\u2022"; // Unicode for bullet point (•)
    const dotXPosition = pageWidth / 2 + doc.getTextWidth(titleImage) / 2 + 1; // 5px space after the text

    // Set the color to golden (RGB: 255, 215, 0)
    doc.setTextColor(255, 215, 0);

    // Draw the golden dot
    doc.text(dot, dotXPosition, 28);

    if (logoBase64) {
      doc.addImage(logoBase64, "PNG", centerX, 4, imageWidth, imageHeight);
    } else {
      doc.setFontSize(12);
      doc.text("Logo non disponible", pageWidth / 2, 20, { align: "center" });
    }
    doc.setTextColor(0, 0, 0);
    // Title and Site Info
    const titleText = `Planning du Site ${infoSite.name} ${monthName} ${currentYear}`;
    doc.setFontSize(12);
    doc.text(titleText, pageWidth / 2, 35, { align: "center" });

    const siteInfoText = `Site: ${infoSite?.name || "Unknown"} | Address: ${
      infoSite?.address || "Unknown"
    } | Manager: ${infoSite?.manager_name || "Unknown"} | Email: ${
      infoSite?.email || "Unknown"
    } | Phone: ${infoSite?.phone || "Unknown"}`;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(siteInfoText, pageWidth / 2, 40, { align: "center" });

    // Disclaimer
    const disclaimerText =
      "Planning provisoire à titre indicatif sous réserve de modifications conformément à la convention collective";
    doc.setFontSize(9);
    doc.setTextColor(255, 0, 0);
    doc.text(disclaimerText, pageWidth / 2, 45, { align: "center" });

    // Table Headers and Data
    const daysOfWeek = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"];
    const dayHeaders = Array.from({ length: daysInMonth }, (_, day) => {
      const date = new Date(currentYear, currentMonth - 1, day + 1);
      return `${daysOfWeek[date.getDay()]}\n ${day + 1}`;
    });

    const tableColumn = ["Agent", ...dayHeaders];
    const usersData = {};

    // Organize events by user
    events.forEach((event) => {
      const { userName, selected_days, vacation_start, vacation_end, post } =
        event;
      if (!usersData[userName])
        usersData[userName] = new Array(daysInMonth).fill("");

      const selectedDate = new Date(selected_days);
      const dayIndex = selectedDate.getDate() - 1;

      usersData[userName][dayIndex] = `${post || ""}\n${vacation_start
        .split(":")
        .slice(0, 2)
        .join(":")}\n${vacation_end.split(":").slice(0, 2).join(":")}`;
    });

    // Convert to table rows
    const tableRows = Object.entries(usersData).map(([userName, daysData]) => [
      userName,
      ...daysData,
    ]);

    // Footer
    const companyName = "Nom de la Société";
    const footerDetails = `
      Securité: XXXXXXXX | Adresse: 123 Rue Exemple, 75000 Paris | Téléphone: 01 23 45 67 89 | SIRET: 123 456 789 00010
    `;

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      margin: { top: 10, left: 3, right: 3, bottom: 40 },
      styles: {
        fontSize: 6,
        cellWidth: "equal",
        halign: "center",
        lineWidth: 0.4,
        lineColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        fontSize: 8,
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        fontStyle: "bold",
        fillColor: [255, 255, 255],
      },
      didParseCell: (data) => {
        const { row, column, cell } = data;
        const dayOfMonth = column.dataKey + 1;
        const currentDate = new Date(currentYear, currentMonth - 1, dayOfMonth);

        const isWeekend =
          currentDate.getDay() === 0 || currentDate.getDay() === 6;
        const formattedDate = currentDate.toISOString().split("T")[0];
        const isHoliday = holidays.includes(formattedDate);

        if (isWeekend) cell.styles.fillColor = [173, 216, 230]; // Light blue for weekends
        if (isHoliday) cell.styles.fillColor = [255, 182, 193]; // Light pink for holidays
      },
      didDrawPage: (data) => {
        const { doc } = data;
        const pageHeight = doc.internal.pageSize.height;
        const footerY = pageHeight - 20;
        const pageWidth = doc.internal.pageSize.width;
        const centerX = pageWidth / 2;

        // Footer text
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(companyName, centerX, footerY - 1, { align: "center" });
        doc.setFontSize(6);
        doc.text(footerDetails, centerX, footerY, {
          align: "center",
          maxWidth: pageWidth - 20,
        });
        doc.setLineWidth(0.2);
        doc.line(10, footerY - 6, pageWidth - 10, footerY - 6); // Footer separator
      },
    });

    // Save the PDF file
    doc.save(`events_${currentMonth}_${currentYear}.pdf`);
  };

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <button
        onClick={generatePDF}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Export to PDF
      </button>
    </div>
  );
};

export default ExportPdf;
