// src/components/MyDocument.js

import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Créez des styles pour le PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 30,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  companyInfo: {
    flex: 1,
    textAlign: "left",
  },
  clientInfo: {
    flex: 1,
    textAlign: "right",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    borderBottom: "1px solid #000",
    paddingBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    marginBottom: 20,
  },
  tableHeader: {
    display: "table-header-group",
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  tableRow: {
    display: "table-row",
  },
  tableCell: {
    display: "table-cell",
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    padding: 5,
    fontSize: 12,
  },
  tableTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 20,
    fontSize: 12,
    textAlign: "center",
  },
});

const MyDocument = ({ client, company, formData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Devis</Text>
          <Text>
            <strong>Entreprise: Atalix Sécurité</strong>
          </Text>
          <Text>
            <strong>Adresse: 325 rue serge lifar ,34080 Montpellier</strong>
          </Text>
          <Text>
            <strong>Téléphone:0767088696</strong>
          </Text>
          <Text>
            <strong>Email:atalixsecurité@gmail.com</strong>
          </Text>
        </View>
        <View style={styles.clientInfo}>
          <Text>
            <strong>Client:</strong> {client.name}
          </Text>
          <Text>
            <strong>Adresse:</strong> {client.address}
          </Text>
          <Text>
            <strong>Téléphone:</strong> {client.phone}
          </Text>
          <Text>
            <strong>Email:</strong> {client.email}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.tableTitle}>Détails du Devis</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Description</Text>
              <Text style={styles.tableCell}>Quantité</Text>
              <Text style={styles.tableCell}>Tarif Unitaire</Text>
              <Text style={styles.tableCell}>Total</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Sécurité (Agents)</Text>
            <Text style={styles.tableCell}>{formData.numSecurityAgents}</Text>
            <Text style={styles.tableCell}>{formData.securityRate} EUR</Text>
            <Text style={styles.tableCell}>{formData.totalSecurity} EUR</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Coûts de déplacement</Text>
            <Text style={styles.tableCell}>-</Text>
            <Text style={styles.tableCell}>-</Text>
            <Text style={styles.tableCell}>{formData.travelCosts} EUR</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Coûts matériels</Text>
            <Text style={styles.tableCell}>-</Text>
            <Text style={styles.tableCell}>-</Text>
            <Text style={styles.tableCell}>{formData.materialCosts} EUR</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Coûts d'assurance</Text>
            <Text style={styles.tableCell}>-</Text>
            <Text style={styles.tableCell}>-</Text>
            <Text style={styles.tableCell}>{formData.insuranceCosts} EUR</Text>
          </View>
          <View style={[styles.tableRow, { fontWeight: "bold" }]}>
            <Text style={styles.tableCell}>Total Général</Text>
            <Text style={styles.tableCell}>-</Text>
            <Text style={styles.tableCell}>-</Text>
            <Text style={styles.tableCell}>{formData.totalGeneral} EUR</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>
          Merci pour votre confiance. Pour toute question, veuillez nous
          contacter.
        </Text>
      </View>
    </Page>
  </Document>
);

export default MyDocument;
