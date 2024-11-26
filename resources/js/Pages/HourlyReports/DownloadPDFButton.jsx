import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DownloadPDFButton = ({
  totalsByAgent,
  totalsByCatchAgent,
  posts,
  sites,
  selectedSite,
  selectedAgent,
  selectedType,
  periodType,
  users,
}) => {
  console.log(totalsByCatchAgent);
  console.log(totalsByAgent);
  const getSiteName = (siteId) => {
    const site = sites.find((s) => s.id === parseInt(siteId));
    return site ? site.name : "Inconnu";
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === parseInt(userId));
    return user ? user.fullname : "Inconnu";
  };

  const site = getSiteName(selectedSite);
  const guard = getUserName(selectedAgent);

  const generatePDF = () => {
    const doc = new jsPDF();
    const currentDate = new Date();
    const month = currentDate.toLocaleString("default", { month: "long" });
    const year = currentDate.getFullYear();
    // Dynamically generate the filename
    const filename =
      selectedType === "site"
        ? periodType === "annuel"
          ? `rapport_${site}_${year}.pdf`
          : `rapport_${site}_${month}_${year}.pdf`
        : periodType === "annuel"
        ? `rapport_${guard}_${year}.pdf`
        : `rapport_${guard}_${month}_${year}.pdf`;

    // Cover Page
    doc.setFontSize(26);
    if (periodType === "mensuel") {
      doc.text("Rapport Mensuel des Heures", 105, 60, { align: "center" });
      doc.setFontSize(16);
      if (selectedType === "site") {
        doc.text(`Site: ${site}`, 105, 80, { align: "center" });
      } else {
        doc.text(`Agent: ${guard}`, 105, 80, { align: "center" });
      }
      doc.text(`Mois: ${month} ${year}`, 105, 90, { align: "center" });
    } else {
      doc.text("Rapport Annuel des Heures", 105, 60, { align: "center" });
      doc.setFontSize(16);
      if (selectedType === "site") {
        doc.text(`Site: ${site}`, 105, 80, { align: "center" });
      } else {
        doc.text(`Agent: ${guard}`, 105, 80, { align: "center" });
      }
      doc.text(`Année: ${year}`, 105, 90, { align: "center" });
    }

    doc.setFontSize(14);
    doc.text(
      `Date de création: ${currentDate.toLocaleDateString()}`,
      105,
      100,
      {
        align: "center",
      }
    );

    // Add a new page for the report content
    doc.addPage();

    let startY = 20;

    // Combine all agent IDs from both totalsByAgent and totalsByCatchAgent
    const allAgentIds = new Set([
      ...Object.keys(totalsByAgent),
      ...Object.keys(totalsByCatchAgent),
    ]);

    // Loop through each unique agent ID
    allAgentIds.forEach((userId) => {
      const agentTotals = totalsByAgent[userId];
      const catchAgentTotals = totalsByCatchAgent[userId];

      // Display agent name as a section title
      const userName = agentTotals
        ? agentTotals.userName
        : catchAgentTotals.userName;
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(`Agent: ${userName}`, 14, startY);

      startY += 10; // Add some space after the agent title

      // Render "Heures Totales par Agent" table if data exists
      if (agentTotals && Object.keys(agentTotals.posts).length > 0) {
        const totalWorkHours = Object.values(agentTotals.posts).reduce(
          (sum, post) => sum + post.totalWorkHours,
          0
        );
        const totalNightHours = Object.values(agentTotals.posts).reduce(
          (sum, post) => sum + post.totalNightHours,
          0
        );
        const totalSundayHours = Object.values(agentTotals.posts).reduce(
          (sum, post) => sum + post.totalSundayHours,
          0
        );
        const totalHolidayHours = Object.values(agentTotals.posts).reduce(
          (sum, post) => sum + post.totalHolidayHours,
          0
        );

        doc.autoTable({
          head: [
            [
              "Poste",
              "Heures",
              "Maj de Nuit",
              "Maj de Dimanche",
              "Maj Férié",
              "Paniers",
            ],
          ],
          body: [
            ...Object.keys(agentTotals.posts).map((post) => {
              const postTotals = agentTotals.posts[post];
              return [
                posts.find((p) => p.abbreviation === post)?.name || "Inconnu",
                postTotals.totalWorkHours,
                postTotals.totalNightHours,
                postTotals.totalSundayHours,
                postTotals.totalHolidayHours,
                0,
              ];
            }),
            [
              "Total",
              totalWorkHours,
              totalNightHours,
              totalSundayHours,
              totalHolidayHours,
              0,
            ],
          ],
          startY: startY + 8,
          theme: "grid",
          styles: { cellPadding: 3, fontSize: 10 },
          headStyles: {
            fillColor: [0, 51, 102],
            textColor: [255, 255, 255],
            fontStyle: "bold",
          },
          footStyles: { fillColor: [220, 220, 220], fontStyle: "bold" },
        });

        startY = doc.autoTable.previous.finalY + 10;
      } else {
        // If totalsByAgent is empty or has no posts, you can choose to add a message if desired
        doc.setFontSize(12);
        if (periodType === "mensuel") {
          doc.text(
            `Aucune heure enregistrée pour cet agent pour ${month} ${year}.`,
            14,
            startY
          );
        } else {
          doc.text(
            `Aucune heure enregistrée pour cet agent pour l'année ${year}.`,
            14,
            startY
          );
        }
        startY += 10; // Adjust startY for the next section
      }

      // Render "Vacation à rattraper" table if data exists
      if (catchAgentTotals && Object.keys(catchAgentTotals.posts).length > 0) {
        const catchTotalWorkHours = Object.values(
          catchAgentTotals.posts
        ).reduce((sum, post) => sum + post.totalWorkHours, 0);
        const catchTotalNightHours = Object.values(
          catchAgentTotals.posts
        ).reduce((sum, post) => sum + post.totalNightHours, 0);
        const catchTotalSundayHours = Object.values(
          catchAgentTotals.posts
        ).reduce((sum, post) => sum + post.totalSundayHours, 0);
        const catchTotalHolidayHours = Object.values(
          catchAgentTotals.posts
        ).reduce((sum, post) => sum + post.totalHolidayHours, 0);

        // Title for the Vacation table in red
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 0, 0);
        doc.text("Vacation à rattraper", 14, startY);
        doc.setTextColor(0, 0, 0); // Reset text color to black for the table
        startY += 10;

        doc.autoTable({
          head: [
            [
              "Poste",
              "Date Vacation",
              "Site",
              "Heures",
              "Maj de Nuit",
              "Maj de Dimanche",
              "Maj Férié",
              "Paniers",
            ],
          ],
          body: [
            ...Object.keys(catchAgentTotals.posts).map((postKey) => {
              const postTotals = catchAgentTotals.posts[postKey];

              const vacationDate = postTotals.date_vacation || "Inconnue"; // Use "Inconnue" if date is missing
              const siteName = getSiteName(postTotals.site_id);
              return [
                posts.find((p) => p.abbreviation === postTotals.post)?.name ||
                  "Inconnu",
                vacationDate,
                siteName,
                postTotals.totalWorkHours,
                postTotals.totalNightHours,
                postTotals.totalSundayHours,
                postTotals.totalHolidayHours,
                0,
              ];
            }),
            [
              "Total",
              "",
              "",
              catchTotalWorkHours,
              catchTotalNightHours,
              catchTotalSundayHours,
              catchTotalHolidayHours,
              0,
            ],
          ],
          startY: startY,
          theme: "grid",
          styles: {
            cellPadding: 3,
            fontSize: 10,
            lineColor: [255, 0, 0],
            lineWidth: 0.2,
          },
          headStyles: {
            fillColor: [255, 0, 0],
            textColor: [255, 255, 255],
            fontStyle: "bold",
          },
          footStyles: { fillColor: [255, 230, 230], fontStyle: "bold" },
        });

        startY = doc.autoTable.previous.finalY + 10;
      } else {
        // If totalsByCatchAgent is empty or has no posts, you can choose to add a message if desired
        if (!catchAgentTotals) {
          doc.setFontSize(12);
          doc.text("Aucune vacation à rattraper pour cet agent.", 14, startY);
          startY += 10; // Adjust startY for the next section
        }
      }

      // Draw a line to separate sections
      doc.setDrawColor(0, 0, 0); // Set color to black for the line
      doc.setLineWidth(0.5); // Set line width
      doc.line(14, startY, 200, startY); // Draw line across the page
      startY += 10; // Add space after the line
    });

    // Page Numbering
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, 195, 285, { align: "right" });
    }

    // Save the PDF
    doc.save(filename);
  };

  return (
    <button
      onClick={generatePDF}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition duration-200"
    >
      Télécharger PDF
    </button>
  );
};

export default DownloadPDFButton;
