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
  console.log(events)
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

    doc.setFontSize(10);

    // Définir la position initiale pour le texte

    const centerY = 40;

    // Texte et styles pour chaque partie
    const parts = [
      { text: "Address: ", isBold: true },
      { text: infoSite?.address || "Unknown", isBold: false },
      { text: " | Manager: ", isBold: true },
      { text: infoSite?.manager_name || "Unknown", isBold: false },
      { text: " | Email: ", isBold: true },
      { text: infoSite?.email || "Unknown", isBold: false },
      { text: " | Phone: ", isBold: true },
      { text: infoSite?.phone || "Unknown", isBold: false },
    ];

    // Construire le texte segment par segment
    let fullTextWidth = 0;
    const widths = parts.map((part) => {
      doc.setFont("helvetica", part.isBold ? "bold" : "normal");
      return doc.getTextWidth(part.text);
    });

    // Calculer la largeur totale du texte
    fullTextWidth = widths.reduce((sum, w) => sum + w, 0);

    // Dessiner chaque segment à sa position correcte
    let currentX = centerX - fullTextWidth / 2; // Commence à gauche pour centrer
    parts.forEach((part, index) => {
      doc.setFont("helvetica", part.isBold ? "bold" : "normal");
      doc.text(part.text, currentX, centerY);
      currentX += widths[index]; // Avance la position pour le segment suivant
    });

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
    const companyName = "Atalix Sécurité .";
    const footerDetails = `
      Securité: XXXXXXXX | Adresse: 123 Rue Exemple, 75000 Paris | Téléphone: 01 23 45 67 89 | SIRET: 123 456 789 00010
    `;

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      margin: { top: 10, left: 3, right: 3, bottom: 40 },
      styles: {
        fontSize: 5,
        cellWidth: "equal",
        halign: "center",
        lineWidth: 0.4,
        lineColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        fontSize: 6,
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        fontStyle: "bold",
        fillColor: [255, 255, 255],
      },
      didParseCell: (data) => {
        const { row, column, cell } = data;

        // Identifier la première colonne (noms des agents)
        if (column.index === 0) {
          cell.styles.fillColor = [255, 255, 255]; // Arrière-plan blanc pour la première colonne
          cell.styles.textColor = [0, 0, 0];
          cell.styles.fontSize = 7;
        }

        // Gestion des week-ends et jours fériés
        const dayOfMonth = column.dataKey + 1;
        const currentDate = new Date(currentYear, currentMonth - 1, dayOfMonth);

        const isWeekend =
          currentDate.getDay() === 0 || currentDate.getDay() === 6;
        const formattedDate = currentDate.toISOString().split("T")[0];
        const isHoliday = holidays.includes(formattedDate);

        if (isWeekend && column.index !== 0) {
          cell.styles.fillColor = [191, 219, 254]; // Bleu-200 (week-ends)
        }
        if (isHoliday && column.index !== 0) {
          cell.styles.fillColor = [254, 202, 202]; // Rouge-200 (jours fériés)
        }
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

    const uniquePosts = Array.from(
      new Set(events.map((event) => `${event.post}-${event.postName}`))
    );
    // Move the legend to the bottom of the page, after the table
    const legendYPosition = doc.lastAutoTable.finalY + 10;
    const legendTitle = "Légende des postes :"; // Title for the legend
    const fontSize = 10; // Font size for legend text
    const textColor = [0, 0, 0]; // RGB color for text
  
    doc.setFontSize(fontSize);
    doc.setTextColor(...textColor);
    doc.text(legendTitle, 10, legendYPosition); // Title for the legend
  
    let legendYPositionNext = legendYPosition + 5; // Initial position for the first post in the legend
  
    // Loop through unique posts and their names
    uniquePosts.forEach((postKey) => {
      const [post, postName] = postKey.split('-'); // Split back the post and postName
  
      // Set font to bold for the post name
      doc.setFont("helvetica", "bold");
  
      // Display post in bold and postName in regular font
      doc.text(post + ":", 25, legendYPositionNext);
  
      // Set font back to regular for postName
      doc.setFont("helvetica", "normal");
      doc.text(postName, 35, legendYPositionNext);
  
      legendYPositionNext += 5; // Increment Y position for the next post
    });

    // Save the PDF file
    doc.save(`Planning de ${infoSite.name} ${monthName} / ${currentYear}.pdf`);
  };

  return (
    <button
      onClick={generatePDF}
      className="px-2 py-1 bg-blue-700 text-white rounded hover:bg-blue-600 flex items-center"
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
      Exporter le planning Générale
    </button>
  );
};

export default ExportPdf;
