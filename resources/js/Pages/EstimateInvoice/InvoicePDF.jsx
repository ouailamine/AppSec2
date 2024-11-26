import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  PDFDownloadLink,
  Image,
} from "@react-pdf/renderer";

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    backgroundColor: "#f8f8f8", // Fond subtil pour la page
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  logoContainer: {
    width: "50%",
    textAlign: "left",
    fontSize: 12,
  },
  clientInfoContainer: {
    width: "50%",

    fontSize: 10,
  },

  SocieteInfoContainer: {
    width: "50%",
    textAlign: "left",
    fontSize: 10,
    flexDirection: 'row',  // Les éléments seront alignés horizontalement
 
  },

  
  logo: {
    width: 60,  // Définir une largeur fixe pour l'image (ajustez selon la taille du logo)
    height: 60, // Définir une hauteur fixe pour l'image
    marginRight: 5, // Ajoute un espace entre le logo et les informations
  },
  


  invoiceTitle: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  invoiceDetails: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 30,
    color: "#555",
  },
  section: {
    marginBottom: 30,
  },
  headerSection: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  table: {
    display: "table",
    width: "100%",
    marginBottom: 20,
    borderCollapse: "collapse",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #ddd",
    padding: 10,
  },
  tableCell: {
    width: "33%",
    textAlign: "center",
    padding: 5,
    fontSize: 12,
    borderRight: "1px solid #ddd",
    borderBottom: "1px solid #ddd",
  },
  tableHeader: {
    fontWeight: "bold",
    backgroundColor: "#f2f2f2",
    color: "#333",
  },
  total: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "right",
    marginTop: 20,
    paddingRight: 20,
    color: "#333",
  },
  additionalCost: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  boldText: {
    fontWeight: "bold",
  },
});

// Composant pour générer la facture PDF
const InvoicePDF = ({ invoiceDetails }) => {
  if (!invoiceDetails) {
    return <Text>Erreur: Les détails de la facture sont manquants.</Text>;
  }

  const {
    siteDetails = invoiceDetails.siteDetails,
    monthName = invoiceDetails.monthName,
    year = invoiceDetails.year,
    sumsByType = invoiceDetails.sumsByType,
    additionalCosts = invoiceDetails.additionalCosts,
  } = invoiceDetails;

  // Calculate total work duration and total amount of additional costs
  const totalWorkDuration = Object.values(sumsByType).reduce(
    (sum, type) => sum + (type.total.work_duration || 0),
    0
  );

  const totalAdditionalCosts = additionalCosts.reduce(
    (sum, cost) => sum + (cost.amount || 0),
    0
  );

  return (
    <Document>
      <Page style={styles.page}>
        {/* En-tête avec logo et informations de l'entreprise et du client sur la même ligne */}
        <View style={styles.header}>

        <View style={styles.SocieteInfoContainer}>
  <Image src="/assets/img/logo-atalix.png" style={styles.logo} />
  <View style={styles.clientInfoContainer}>
    <Text style={styles.clientInfo}>Atalix Sécurite</Text>
    <Text style={styles.clientInfo}>Adresse de l'entreprise</Text>
    <Text style={styles.clientInfo}>Téléphone: +33 1 23 45 67 89</Text>
    <Text style={styles.clientInfo}>Email: contact@entreprise.com</Text>
  </View>
</View>


          <View style={styles.clientInfoContainer}>
            <Text style={styles.clientInfo}>
              <Text style={styles.boldText}>Client:</Text>{" "}
              {siteDetails.name || "N/A"}
            </Text>
            <Text style={styles.clientInfo}>
              <Text style={styles.boldText}>Adresse:</Text>{" "}
              {siteDetails.address || "N/A"}
            </Text>
            <Text style={styles.clientInfo}>
              <Text style={styles.boldText}>Téléphone:</Text>{" "}
              {siteDetails.phone || "N/A"}
            </Text>
            <Text style={styles.clientInfo}>
              <Text style={styles.boldText}>Email:</Text>{" "}
              {siteDetails.email || "N/A"}
            </Text>
          </View>
        </View>

        {/* Titre de la facture */}
        <Text style={styles.invoiceTitle}>Facture</Text>
        <Text style={styles.invoiceDetails}>
          Site: {siteDetails.name || "N/A"}
        </Text>
        <Text style={styles.invoiceDetails}>
          Mois: {monthName} {year}
        </Text>

        {/* Sums by Type */}
        {Object.keys(sumsByType).length > 0 ? (
          Object.keys(sumsByType).map((typeId) => {
            const typePost = sumsByType[typeId];
            return (
              <View key={typeId} style={styles.section}>
                <Text style={styles.headerSection}>
                  Type de poste: {typeId}
                </Text>
                <View style={styles.table}>
                  <View style={[styles.tableRow, styles.tableHeader]}>
                    <Text style={styles.tableCell}>Poste</Text>
                    <Text style={styles.tableCell}>Durée (heures)</Text>
                    <Text style={styles.tableCell}>Dimanche (heures)</Text>
                  </View>
                  {Object.keys(typePost.posts || {}).map((postId) => {
                    const post = typePost.posts[postId];
                    return (
                      <View key={postId} style={styles.tableRow}>
                        <Text style={styles.tableCell}>{postId}</Text>
                        <Text style={styles.tableCell}>
                          {(post.work_duration / 60).toFixed(2)}
                        </Text>
                        <Text style={styles.tableCell}>
                          {post.sunday_hours}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.section}>
            Aucune donnée pour les types de postes.
          </Text>
        )}

        {/* Coûts Additionnels */}
        {additionalCosts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.boldText}>Coûts Additionnels:</Text>
            {additionalCosts.map((cost, index) => (
              <Text key={index} style={styles.additionalCost}>
                {cost.description}: {cost.amount} €
              </Text>
            ))}
          </View>
        )}

        {/* Durée totale de travail */}
        <View style={styles.section}>
          <Text style={styles.boldText}>Durée totale de travail:</Text>
          <Text>{(totalWorkDuration / 60).toFixed(2)} heures</Text>
        </View>

        {/* Total */}
        <Text style={styles.total}>
          Total: {totalAdditionalCosts + (totalWorkDuration / 60) * 50} €{" "}
          {/* Assuming 50€/hour */}
        </Text>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
