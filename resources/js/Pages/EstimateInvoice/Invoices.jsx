import React, { useState, useMemo } from "react";
import AddCostModal from "./AddCostModal"; // Import du modal
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Invoices = ({ plannings, selectedSite, allTypePosts, allPosts }) => {
  console.log(selectedSite);
  console.log(plannings);

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
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [additionalCosts, setAdditionalCosts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  // Helper function to convert minutes to hour:minute format
  const convertMinutesToHours = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // Fonction pour calculer les sommes par type
  function calculateSumsByType(events) {
    const result = {};

    events.forEach((event) => {
      const typePost = event.typePost;
      const post = event.post;

      if (!result[typePost]) {
        result[typePost] = {
          total: {
            work_duration: 0,
            sunday_hours: 0,
            night_hours: 0,
            holiday_hours: 0,
            lunchAllowance: 0,
          },
          posts: {},
        };
      }

      if (!result[typePost].posts[post]) {
        result[typePost].posts[post] = {
          sunday_hours: 0,
          night_hours: 0,
          holiday_hours: 0,
          lunchAllowance: 0,
          work_duration: 0,
        };
      }

      result[typePost].posts[post].work_duration +=
        parseFloat(event.work_duration) || 0;
      result[typePost].posts[post].sunday_hours +=
        parseFloat(event.sunday_hours) || 0;
      result[typePost].posts[post].night_hours +=
        parseFloat(event.night_hours) || 0;
      result[typePost].posts[post].holiday_hours +=
        parseFloat(event.holiday_hours) || 0;
      result[typePost].posts[post].lunchAllowance +=
        parseFloat(event.lunchAllowance) || 0;

      result[typePost].total.work_duration +=
        parseFloat(event.work_duration) || 0;
      result[typePost].total.sunday_hours +=
        parseFloat(event.sunday_hours) || 0;
      result[typePost].total.night_hours += parseFloat(event.night_hours) || 0;
      result[typePost].total.holiday_hours +=
        parseFloat(event.holiday_hours) || 0;
      result[typePost].total.lunchAllowance +=
        parseFloat(event.lunchAllowance) || 0;
    });

    return result;
  }

  const planning = plannings.find(
    (p) =>
      p.month === selectedMonth &&
      Number(p.year) === selectedYear &&
      p.site_id === selectedSite.id
  );
  const events = planning ? planning.events : [];

  // Utilisation de useMemo pour mémoïser les résultats
  const sumsByType = useMemo(() => calculateSumsByType(events), [events]);
  const monthName = months.find((m) => m.value === selectedMonth)?.label;
  // Fonction pour ajouter un coût additionnel
  const handleAddCost = (newCost) => {
    setAdditionalCosts([
      ...additionalCosts,
      { description: newCost.description, amount: newCost.amount },
    ]);
  };


  const handleExportPDF = () => {
    let number = 0; // Example: Can be replaced with a dynamic invoice number
    const numberFacture = number + 1;
    const formattedDate = new Date().toLocaleDateString("en-GB");
    const doc = new jsPDF();

    try {
      const companyInfo = {
        name: "Atalix Sécurité",
        address: "123 Rue de l'Exemple",
        city: "75000 Paris, France",
        phone: "+33 1 23 45 67 89",
        email: "atalixsecurite@gmaol.com",
      };
      // Company logo
      const logoUrl = "/assets/img/logo-atalix.png";
      doc.addImage(logoUrl, "PNG", 14, 14, 20, 20);

      // Company information
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Atalix Sécurité", 36, 18);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(companyInfo.address, 36, 22);
      doc.text(companyInfo.city, 36, 26);
      doc.text(companyInfo.phone, 36, 30);
      doc.text(companyInfo.email, 36, 34);

      // Information about the selected site
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(selectedSite.name, doc.internal.pageSize.getWidth() - 14, 18, {
        align: "right",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(
        selectedSite.address,
        doc.internal.pageSize.getWidth() - 14,
        22,
        { align: "right" }
      );
      doc.text(selectedSite.email, doc.internal.pageSize.getWidth() - 14, 26, {
        align: "right",
      });
      doc.text(selectedSite.phone, doc.internal.pageSize.getWidth() - 14, 30, {
        align: "right",
      });

      // Separator line
      doc.setLineWidth(0.1);
      doc.line(14, 36, 196, 36);

      // Invoice details
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Facture n° : ${numberFacture} `,
        doc.internal.pageSize.getWidth() / 2,
        44,
        { align: "center" }
      );

      doc.setFontSize(9);
      doc.text(
        `Etablie le : ${formattedDate}`,
        doc.internal.pageSize.getWidth() / 2,
        48,
        { align: "center" }
      );

      // ** Generate tables for each typePost **
      let startY = 60; // Starting position for the first table
      let totalHTGeneral = 0; // Variable to store total HT of all tables

      for (let typePostKey in sumsByType) {
        const typePost = sumsByType[typePostKey];
        const posts = typePost.posts;

        // Find the name of the typePost using typePostKey
        const typePostName =
          allTypePosts.find((type) => type.id == typePostKey)?.name ||
          "Type inconnu";

        // Generate the post table for each typePost
        const totalHTTable = generatePostTable(
          doc,
          typePost,
          startY,
          allPosts,
          allTypePosts
        );
        totalHTGeneral += totalHTTable;

        // Update startY for the next table
        startY = doc.lastAutoTable.finalY + 10; // Update position for next table
      }

      // ** Calculate VAT and Total TTC **
      const tvaRate = 0.2; // 20% VAT
      const totalTTC = totalHTGeneral * (1 + tvaRate); // Calculate the TTC amount

      // Summary section
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Récapitulatif", 14, startY);
      startY += 6;

      let updatedTotalTTC = totalTTC;

      // Initialize recapData array
      const recapData = [
        { label: "Total HT :", value: `${totalHTGeneral} €` },
        {
          label: "TVA (20%) :",
          value: `${(totalHTGeneral * tvaRate).toFixed(2)} €`,
        },
      ];

      // If additional costs exist, add them to recapData
      if (additionalCosts.length > 0) {
        // Calculate the sum of all additional costs
        const additionalCostTotal = additionalCosts.reduce(
          (total, cost) => total + cost.amount,
          0
        );

        // Add additional costs to the recap data
        recapData.push({
          label: "Frais complémentaire :",
          value: `${additionalCostTotal.toFixed(2)} €`,
        });

        // Update the total TTC to include the additional costs
        updatedTotalTTC += additionalCostTotal;
      }

      // Finally, add the updated Total TTC value
      recapData.push({
        label: "Total TTC :",
        value: `${updatedTotalTTC.toFixed(2)} €`,
      });

      // Add recapData as a table using autoTable
      doc.autoTable({
        startY: startY,
        head: [["Label", "Value"]],
        body: recapData.map(item => [item.label, item.value]),
        theme: 'grid',
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
        styles: { fontSize: 10 },
        columnStyles: { 0: { cellWidth: 'auto' }, 1: { cellWidth: 'auto', halign: 'right' } }
      });

      // Update startY for next section
      startY = doc.lastAutoTable.finalY + 10;

      // Payment modalities section
      const paymentInfoY = startY;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Modalités de paiement", 14, paymentInfoY);

      const paymentDetails = [
        { label: "Mode de paiement :", value: "Virement bancaire" },
        {
          label: "Coordonnées bancaires :",
          value: "IBAN: FR76 1234 5678 9101 1121 3141\nBIC: ABCDFF",
        },
        {
          label: "Délai de paiement :",
          value: "30 jours après réception de la facture",
        },
      ];

      paymentDetails.forEach((detail, index) => {
        const yPos = paymentInfoY + 6 + index * 12;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(detail.label, 14, yPos);
        doc.text(detail.value, 60, yPos, { maxWidth: 140, align: "left" });
      });

      // Add stamp and signature
      const tamponUrl = "/assets/img/tampon.png";
      const signatureUrl = "/assets/img/signature.png";

      // Dimensions and positioning
      const tamponWidth = 40;
      const tamponHeight = 40;
      const signatureWidth = 50;
      const signatureHeight = 20;

      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;

      // Position stamp
      const tamponX = pageWidth - tamponWidth - 14;
      const tamponY = pageHeight - tamponHeight - 40;

      // Position signature just below the stamp
      const signatureX = tamponX;
      const signatureY = tamponY + tamponHeight;

      // Load and add images
      doc.addImage(
        tamponUrl,
        "PNG",
        tamponX,
        tamponY,
        tamponWidth,
        tamponHeight
      );
      doc.addImage(
        signatureUrl,
        "PNG",
        signatureX,
        signatureY,
        signatureWidth,
        signatureHeight
      );

      // Save the PDF
      doc.save(`facture_${selectedSite.name}_${monthName}_${selectedYear}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };


  // Function to generate the post table
  const generatePostTable = (doc, typePost, startY, allPosts, allTypePosts) => {
    const typePostName =
      allTypePosts.find((type) => type.id == typePost.key)?.name ||
      "Type inconnu";
    const posts = typePost.posts;
    const tableData = [];
    let totalHTTable = 0;

    doc.setFontSize(12).setFont("helvetica", "bold");
    doc.text(`Type de Poste: ${typePostName}`, 14, startY + 8);
    let yOffset = startY + 16;

    for (let postKey in posts) {
      const post = posts[postKey];
      const postName =
        allPosts.find((p) => p.abbreviation === postKey)?.name ||
        "Poste inconnu";
      const postDetails = calculatePostDetails(
        post,
        postName,
        postKey,
        allPosts
      );
      tableData.push(...postDetails);
      totalHTTable += postDetails.reduce(
        (sum, row) => sum + parseFloat(row[5].replace(" €", "")),
        0
      );
    }

    tableData.push(["Total HT", "", "", "", "", `${(totalHTTable).toFixed(2)} €`]);
    doc.autoTable({
      startY: yOffset,
      head: [
        [
          "Poste",
          "Quantité",
          "Qua.Majorée",
          "Prix(h)",
          "Majoration",
          "Total HT",
        ],
      ],
      body: tableData,
      margin: { top: 10, left: 14, right: 14 },
      columnStyles: {
        0: { cellWidth: 45 },
        1: { cellWidth: 20 },
        2: { cellWidth: 30 },
        3: { cellWidth: 25 },
        4: { cellWidth: 40 },
        5: { cellWidth: 22 },
      },
    });

    return totalHTTable;
  };

  // Function to calculate post details
  const calculatePostDetails = (post, postName, postKey, allPosts) => {
    const pricePerHour =
      allPosts.find((p) => p.abbreviation === postKey)?.price || 0;
    const workDurationInNormal =
      post.work_duration -
      (post.night_hours + post.sunday_hours + post.holiday_hours);
    const pricePerHourNight = (pricePerHour * 1.1).toFixed(2);
    const pricePerHourSunday = (pricePerHour * 1.1).toFixed(2);
    const pricePerHourHoliday = (pricePerHour * 2).toFixed(2);
    const nightSurcharge = (
      (post.night_hours / 60) *
      pricePerHourNight
    ).toFixed(2);
    const sundaySurcharge = (
      (post.sunday_hours / 60) *
      pricePerHourSunday
    ).toFixed(2);
    const holidaySurcharge = (
      (post.holiday_hours / 60) *
      pricePerHourHoliday
    ).toFixed(2);

    const totalSurcharge = nightSurcharge + sundaySurcharge + holidaySurcharge;
    const totalHT = (post.work_duration / 60) * pricePerHour + totalSurcharge;

    return [
      [
        postName,
        convertMinutesToHours(workDurationInNormal),
        "-",
        `${pricePerHour} €`,
        "0%",
        `${(workDurationInNormal / 60) * pricePerHour} €`,
      ],
      ...(post.night_hours > 0
        ? [
            [
              postName,
              "-",
              convertMinutesToHours(post.night_hours),
              `${pricePerHour} €`,
              "(Nuit)10%",
              `${nightSurcharge} €`,
            ],
          ]
        : []),
      ...(post.sunday_hours > 0
        ? [
            [
              postName,
              "-",
              convertMinutesToHours(post.sunday_hours),
              `${pricePerHour} €`,
              "(Dimanche) 10%",
              `${sundaySurcharge} €`,
            ],
          ]
        : []),
      ...(post.holiday_hours > 0
        ? [
            [
              postName,
              "-",
              convertMinutesToHours(post.holiday_hours),
              `${pricePerHour} €`,
              "(Férié) 100%",
              `${holidaySurcharge} €`,
            ],
          ]
        : []),
    ];
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">
        Sélectionnez le mois et l'année
      </h1>

      <div className="flex space-x-6 mb-6 relative">
        <div className="w-1/2">
          <label
            htmlFor="month"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Mois
          </label>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <div className="w-1/2">
          <label
            htmlFor="year"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Année
          </label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-lg font-medium">
          Vous avez sélectionné :{" "}
          {months.find((m) => m.value === selectedMonth)?.label} {selectedYear}
        </p>
      </div>

      <div className="mt-6">
        {Object.keys(sumsByType).length === 0 ? (
          <p className="text-gray-500 text-center">
            Aucun événement trouvé pour la période sélectionnée.
          </p>
        ) : (
          <>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
              Exporter en PDF
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-2 mb-2 px-4 py-2 bg-blue-600 text-white rounded-lg focus:outline-none"
            >
              Coûts additionnels
            </button>
            <div className="mb-4"></div>

            <ul className="space-y-4">
              {Object.keys(sumsByType).map((typePostId, index) => {
                const typePost = allTypePosts.find(
                  (type) => type.id === parseInt(typePostId)
                );
                if (!typePost) return null; // Assurer que le typePost existe

                return (
                  <li
                    key={index}
                    className="bg-white p-3 rounded-lg shadow-sm border border-gray-200"
                  >
                    <h3 className="text-lg font-semibold text-blue-600">
                      {typePost ? typePost.name : "Type de poste inconnu"}
                    </h3>

                    <div className="mt-2 space-y-2">
                      {Object.keys(sumsByType[typePostId].posts).map(
                        (postId, postIndex) => {
                          const post = sumsByType[typePostId].posts[postId];
                          const postDetails = allPosts.find(
                            (p) => p.abbreviation === postId
                          );

                          return (
                            <div key={postIndex}>
                              <p className="text-sm text-gray-700">
                                <strong>Poste:</strong>{" "}
                                {postDetails
                                  ? postDetails.name
                                  : "Poste inconnu"}{" "}
                                <span className="ml-2">
                                  <strong>Durée:</strong>{" "}
                                  {convertMinutesToHours(post.work_duration)} |
                                  <strong>Dimanche:</strong>{" "}
                                  {convertMinutesToHours(post.sunday_hours)}|
                                  <strong>Nuit:</strong> {post.night_hours}|
                                  <strong>Férixé:</strong>{" "}
                                  {convertMinutesToHours(post.holiday_hours)}
                                </span>
                              </p>
                            </div>
                          );
                        }
                      )}
                    </div>

                    <div className="mt-2 text-sm text-gray-700 border-t pt-2">
                      <p>
                        <strong>Durée totale:</strong>{" "}
                        {convertMinutesToHours(
                          sumsByType[typePostId].total.work_duration
                        )}{" "}
                        |<strong> Dimanches:</strong>{" "}
                        {convertMinutesToHours(
                          sumsByType[typePostId].total.sunday_hours
                        )}{" "}
                        |<strong> Nuit:</strong>{" "}
                        {convertMinutesToHours(
                          sumsByType[typePostId].total.night_hours
                        )}{" "}
                        |<strong> Férié:</strong>{" "}
                        {convertMinutesToHours(
                          sumsByType[typePostId].total.holiday_hours
                        )}
                         |
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      {/* Affichage des coûts additionnels */}
      {additionalCosts.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-blue-600">
            Coûts additionnels :
          </h3>
          <ul className="space-y-2">
            {additionalCosts.map((cost, index) => (
              <li
                key={index}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between bg-gray-50 p-2 rounded-md shadow-sm border border-gray-200"
              >
                <span className="text-sm">{cost.description}</span>
                <span className="text-sm font-semibold">{cost.amount} €</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Affichage de la facture */}
      {/*}
      <div>
        <PDFDownloadLink
          document={<InvoicePDF invoiceDetails={invoiceDetails} />}
          fileName={`facture-${selectedMonth}-${selectedYear}.pdf`}
        >
          {({ loading }) =>
            loading ? (
              <button className="px-4 py-2 bg-gray-500 text-white rounded-md">
                Chargement...
              </button>
            ) : (
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
                Télécharger la facture
              </button>
            )
          }
        </PDFDownloadLink>
      </div>{*/}

      {/* Modal pour ajouter des coûts additionnels */}
      {modalOpen && (
        <AddCostModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onAddCost={handleAddCost}
        />
      )}
    </div>
  );
};

export default Invoices;
