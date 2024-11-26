import React, { useState } from "react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head } from "@inertiajs/react";
import "../../../css/styles.css";
import {
  PDFViewer,
  PDFDownloadLink,
  Document,
  Page,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

// Définir les styles pour le PDF
const styles = StyleSheet.create({
  body: {
    paddingTop: 15,
    paddingBottom: 65,
    paddingHorizontal: 40,
  },
  title: {
    backgroundColor: "#336bff",
    color: "white",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 50,
    fontWeight: "bold",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  text: {
    fontSize: 10,
    margin: 5,
    textAlign: "justify",
    fontFamily: "Times-Roman",
    lineHeight: 1.5,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 9,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "black",
  },
});

const Index = ({ users, auth }) => {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [formData, setFormData] = useState({
    fullname: "",
    firstname: "",
    date_of_birth: "",
    genre: "",
    nationality: "",
    address: "",
    city: "",
    departement: "",
    region: "",
    phone: "",
    social_security_number: "",
    professional_card_number: "",
    diplomas: "",
    typeAds: "",
    email: "",
    password: "",
    note: "",
    registerNumber: "",
    dateDebut: "",
    dateFin: "",
    hoursNumber: 0,
    coefficient: "",
    echelon: "",
    site: "",
    brut: 0,
    pdfName: "contrat",
  });

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      brut: name === "hoursNumber" ? value * 11.84 : prevData.brut,
      pdfName: name === "fullname" ? `contrat ${value}` : prevData.pdfName,
    }));
  };

  // Gestion de la sélection d'utilisateur
  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUserId(userId);

    const selectedUser = users.find((user) => user.id === parseInt(userId, 10));
    if (selectedUser) {
      setFormData({
        fullname: selectedUser.fullname || "",
        firstname: selectedUser.firstname || "",
        date_of_birth: selectedUser.date_of_birth || "",
        genre: selectedUser.genre || "",
        nationality: selectedUser.nationality || "",
        address: selectedUser.address || "",
        city: selectedUser.city || "",
        departement: selectedUser.departement || "",
        region: selectedUser.region || "",
        phone: selectedUser.phone || "",
        social_security_number: selectedUser.social_security_number || "",
        professional_card_number: selectedUser.professional_card_number || "",
        diplomas: selectedUser.diplomas || "",
        typeAds: selectedUser.typeAds || "",
        email: selectedUser.email || "",
        password: selectedUser.password || "",
        note: selectedUser.note || "",
        registerNumber: selectedUser.registerNumber || "",
        dateDebut: "",
        dateFin: "",
        hoursNumber: 0,
        coefficient: "",
        echelon: "",
        site: "",
        brut: 0,
        pdfName: `contrat ${selectedUser.fullname || ""}`,
      });
    } else {
      setFormData({
        fullname: "",
        firstname: "",
        date_of_birth: "",
        genre: "",
        nationality: "",
        address: "",
        city: "",
        departement: "",
        region: "",
        phone: "",
        social_security_number: "",
        professional_card_number: "",
        diplomas: "",
        typeAds: "",
        email: "",
        password: "",
        note: "",
        registerNumber: "",
        dateDebut: "",
        dateFin: "",
        hoursNumber: 0,
        coefficient: "",
        echelon: "",
        site: "",
        brut: 0,
        pdfName: "contrat",
      });
    }
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("ID Utilisateur sélectionné:", selectedUserId);
    console.log("Données du formulaire:", formData);
  };

  // Définir le document PDF
  const MyDocument = () => (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.title}>Contrat de travail</Text>
        <Text>ID Utilisateur sélectionné: {selectedUserId}</Text>
        <Text>Nom de famille: {formData.fullname}</Text>
        <Text>Prénom: {formData.firstname}</Text>
        <Text>Date de naissance: {formData.date_of_birth}</Text>
        <Text>Genre: {formData.genre}</Text>
        <Text>Nationalité: {formData.nationality}</Text>
        <Text>Adresse: {formData.address}</Text>
        <Text>Ville: {formData.city}</Text>
        <Text>Département: {formData.departement}</Text>
        <Text>Région: {formData.region}</Text>
        <Text>Téléphone: {formData.phone}</Text>
        <Text>
          Numéro de sécurité sociale: {formData.social_security_number}
        </Text>
        <Text>
          Numéro de carte professionnelle: {formData.professional_card_number}
        </Text>
        <Text>Diplômes: {formData.diplomas}</Text>
        <Text>Type d'annonces: {formData.typeAds}</Text>
        <Text>Email: {formData.email}</Text>
        <Text>Note: {formData.note}</Text>
        <Text>Numéro d'enregistrement: {formData.registerNumber}</Text>
        <Text>Date de début: {formData.dateDebut}</Text>
        <Text>Date de fin: {formData.dateFin}</Text>
        <Text>Nombre d'heures: {formData.hoursNumber}</Text>
        <Text>Coefficient: {formData.coefficient}</Text>
        <Text>Échelon: {formData.echelon}</Text>
        <Text>Site: {formData.site}</Text>
        <Text>Brut: {formData.brut}</Text>
      </Page>
    </Document>
  );

  return (
    <AdminAuthenticatedLayout user={auth.user}>
      <Head title="Dashboard Admin" />
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6">
            <h1 className="mb-4">Générer un Contrat</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="userDropdown" className="form-label">
                  Sélectionner un utilisateur
                </label>
                <select
                  id="userDropdown"
                  value={selectedUserId}
                  onChange={handleUserChange}
                  className="form-select"
                >
                  <option value="">-- Sélectionner un utilisateur --</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.fullname} {user.firstname}
                    </option>
                  ))}
                </select>
              </div>

              {/* Autres champs du formulaire */}
              <div className="mb-3">
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Nom de famille"
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Prénom"
                />
              </div>
              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="dateDebut" className="form-label">
                    Date de début:
                  </label>
                  <input
                    type="date"
                    name="dateDebut"
                    id="dateDebut"
                    className="form-control"
                    value={formData.dateDebut}
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <label htmlFor="dateFin" className="form-label">
                    Date de fin:
                  </label>
                  <input
                    type="date"
                    name="dateFin"
                    id="dateFin"
                    className="form-control"
                    value={formData.dateFin}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="hoursNumber" className="form-label">
                  Nombre d'heures:
                </label>
                <input
                  type="number"
                  name="hoursNumber"
                  id="hoursNumber"
                  className="form-control"
                  value={formData.hoursNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="coefficient" className="form-label">
                  Coefficient:
                </label>
                <select
                  name="coefficient"
                  id="coefficient"
                  className="form-select"
                  value={formData.coefficient}
                  onChange={handleChange}
                >
                  <option value="">Sélectionnez</option>
                  <option value="130">130</option>
                  <option value="140">140</option>
                  <option value="150">150</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="echelon" className="form-label">
                  Échelon:
                </label>
                <select
                  name="echelon"
                  id="echelon"
                  className="form-select"
                  value={formData.echelon}
                  onChange={handleChange}
                >
                  <option value="">Sélectionnez</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="site" className="form-label">
                  Site:
                </label>
                <select
                  name="site"
                  id="site"
                  className="form-select"
                  value={formData.site}
                  onChange={handleChange}
                >
                  <option value="">Sélectionnez</option>
                  <option value="apple">Apple</option>
                  <option value="univ paul va">Univ Paul Val</option>
                  <option value="groupama">Groupama</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary">
                Générer le PDF
              </button>
            </form>
          </div>

          <div className="col-md-6">
            <h2 className="mb-4">Prévisualiser le PDF</h2>
            <div className="d-flex justify-content-center">
              <PDFViewer width="100%" height="600px">
                <MyDocument />
              </PDFViewer>
            </div>
            <div className="d-flex justify-content-center mt-3">
              <PDFDownloadLink
                document={<MyDocument />}
                fileName={`${formData.pdfName}.pdf`}
              >
                {({ loading }) =>
                  loading ? "Chargement du document..." : "Télécharger le PDF"
                }
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      </div>
    </AdminAuthenticatedLayout>
  );
};

export default Index;
