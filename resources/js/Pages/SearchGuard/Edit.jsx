import React, { useState, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

const Edit = () => {
  const { props } = usePage();
  const {
    guard,
    genres,
    nationalities,
    typeAds,
    diplomas,
    departements,
    regions,
    cities,
    diplomasGuard,
  } = props;

  const initialFormData = {
    fullname: guard.fullname,
    firstname: guard.firstname,
    genre: guard.genre,
    date_of_birth: guard.date_of_birth,
    nationality: guard.nationality,
    address: guard.address,
    city: guard.city,
    departement: guard.departement,
    region: guard.region,
    typeADS: guard.typeADS,
    email: guard.email,
    phone: guard.phone,
    social_security_number: guard.social_security_number,
    professional_card_number: guard.professional_card_number,
    diplomas: diplomasGuard,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [infoFormData, setInfoFormData] = useState({
    address: initialFormData.address,
    city: initialFormData.city,
    departement: initialFormData.departement,
    region: initialFormData.region,
  });

  const [newDiplomaId, setNewDiplomaId] = useState("");
  const [newDiplomaEndDate, setNewDiplomaEndDate] = useState("");
  const [editedDiplomaIndex, setEditedDiplomaIndex] = useState(null);
  const [showDiplomaModal, setShowDiplomaModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const [filteredDepartements, setFilteredDepartements] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  // Filter departments based on selected region
  useEffect(() => {
    const departments = departements.filter(
      (dept) => dept.region_code === infoFormData.region
    );
    setFilteredDepartements(departments);
    setInfoFormData((prev) => ({
      ...prev,
      departement: "", // Reset department when region changes
      city: "", // Reset city when department changes
    }));
    setFilteredCities([]);
  }, [infoFormData.region]);

  // Filter cities based on selected department
  useEffect(() => {
    const citiesFiltered = cities.filter(
      (city) => city.departement_code === infoFormData.departement
    );
    setFilteredCities(citiesFiltered);
    setInfoFormData((prev) => ({
      ...prev,
      city: "", // Reset city when department changes
    }));
  }, [infoFormData.departement]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Inertia.put(`/guards/${guard.id}`, formData, {
      onSuccess: () => console.log("Utilisateur mis à jour avec succès"),
      onError: (errors) =>
        console.error(
          "Erreur lors de la mise à jour de l'utilisateur :",
          errors
        ),
    });
  };

  const handleCancel = () => setFormData(initialFormData);

  const handleDiplomaChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDiplomas = [...formData.diplomas];
    updatedDiplomas[index] = { ...updatedDiplomas[index], [name]: value };
    setFormData((prevFormData) => ({
      ...prevFormData,
      diplomas: updatedDiplomas,
    }));
  };

  const handleAddDiploma = () => {
    const selectedDiploma = diplomas.find(
      (d) => d.id === parseInt(newDiplomaId)
    );
    if (selectedDiploma) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        diplomas: [
          ...prevFormData.diplomas,
          { name: selectedDiploma.name, end_date: newDiplomaEndDate },
        ],
      }));
      setNewDiplomaId("");
      setNewDiplomaEndDate("");
    }
  };

  const handleRemoveDiploma = (index) => {
    const updatedDiplomas = formData.diplomas.filter((_, i) => i !== index);
    setFormData((prevFormData) => ({
      ...prevFormData,
      diplomas: updatedDiplomas,
    }));
  };

  const handleEditDiploma = (index) => {
    setEditedDiplomaIndex(index);
    setNewDiplomaId(formData.diplomas[index].name);
    setNewDiplomaEndDate(formData.diplomas[index].end_date);
    setShowDiplomaModal(true);
  };

  const handleDiplomaModalSubmit = () => {
    const updatedDiplomas = [...formData.diplomas];
    if (editedDiplomaIndex !== null) {
      updatedDiplomas[editedDiplomaIndex] = {
        name: newDiplomaId,
        end_date: newDiplomaEndDate,
      };
    } else {
      const selectedDiploma = diplomas.find(
        (d) => d.id === parseInt(newDiplomaId)
      );
      if (selectedDiploma) {
        updatedDiplomas.push({
          name: selectedDiploma.name,
          end_date: newDiplomaEndDate,
        });
      }
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      diplomas: updatedDiplomas,
    }));
    setNewDiplomaId("");
    setNewDiplomaEndDate("");
    setEditedDiplomaIndex(null);
    setShowDiplomaModal(false);
  };

  const handleShowInfoModal = () => setShowInfoModal(true);
  const handleCloseInfoModal = () => setShowInfoModal(false);

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setInfoFormData((prevInfoFormData) => ({
      ...prevInfoFormData,
      [name]: value,
    }));
  };

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    setFormData((prevFormData) => ({
      ...prevFormData,
      address: infoFormData.address,
      city: infoFormData.city,
      departement: infoFormData.departement,
      region: infoFormData.region,
    }));
    handleCloseInfoModal();
  };

  const handleShowDiplomaModal = () => setShowDiplomaModal(true);
  const handleCloseDiplomaModal = () => {
    setNewDiplomaId("");
    setNewDiplomaEndDate("");
    setEditedDiplomaIndex(null);
    setShowDiplomaModal(false);
  };

  const existingDiplomaIds = new Set(
    formData.diplomas.map((diploma) => diploma.name)
  );
  const availableDiplomas = diplomas.filter(
    (diploma) => !existingDiplomaIds.has(diploma.name)
  );

  const getRegionName = (code) => {
    const region = regions.find((r) => r.region_code === code);
    return region ? region.name : "";
  };

  const getDepartmentName = (code) => {
    const department = departements.find((d) => d.departement_code === code);
    return department ? department.name : "";
  };

  return (
    <AdminAuthenticatedLayout>
      <Head title="Éditer Gardien" />
      <div className="container mt-4">
        <h1>Éditer Gardien</h1>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-4">
              {/* Informations personnelles */}
              <div className="mb-3">
                <label htmlFor="fullname" className="form-label">
                  Nom complet:
                </label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  className="form-control"
                  value={formData.fullname}
                  onChange={handleChange}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label htmlFor="firstname" className="form-label">
                  Prénom:
                </label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  className="form-control"
                  value={formData.firstname}
                  onChange={handleChange}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label htmlFor="genre" className="form-label">
                  Genre:
                </label>
                <select
                  id="genre"
                  name="genre"
                  className="form-select"
                  value={formData.genre}
                  onChange={handleChange}
                  disabled
                >
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="date_of_birth" className="form-label">
                  Date de naissance:
                </label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  className="form-control"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  Numéro sécurité social
                </label>
                <input
                  type="text"
                  id="social_security_number"
                  name="psocial_security_number"
                  className="form-control"
                  value={formData.social_security_number}
                  disabled
                />
              </div>
            </div>

            <div className="col-md-4">
              {/* Contact */}
              <div className="mb-3">
                <label htmlFor="nationality" className="form-label">
                  Nationalité:
                </label>
                <select
                  id="nationality"
                  name="nationality"
                  className="form-select"
                  value={formData.nationality}
                  onChange={handleChange}
                >
                  {nationalities.map((nationality) => (
                    <option key={nationality.id} value={nationality.name}>
                      {nationality.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  Téléphone:
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              {/* Affichage de l'adresse */}
              <div className="card">
                <div className="card-header">Adresse</div>
                <div className="card-body p-3">
                  <p>
                    <strong>N rue : </strong>
                    {formData.address}
                    <br />
                    <strong>Ville : </strong>
                    {formData.city}
                    <br />
                    <strong>Département : </strong>
                    {getDepartmentName(formData.departement)}
                    <br />
                    <strong>Région : </strong>
                    {getRegionName(formData.region)}
                  </p>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleShowInfoModal}
                  >
                    Modifier Adresse
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  Carte Professionnelle
                </label>
                <input
                  type="text"
                  id="professional_card_number"
                  name="professional_card_number"
                  className="form-control"
                  value={formData.professional_card_number}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="typeADS" className="form-label">
                  Type d'ADS:
                </label>
                <select
                  id="typeADS"
                  name="typeADS"
                  className="form-select"
                  value={formData.typeADS}
                  onChange={handleChange}
                >
                  {typeAds.map((type) => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="card mt-4">
                <div className="card-header">Diplômes</div>
                <div className="card-body">
                  {formData.diplomas.length > 0 ? (
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Diplôme</th>
                          <th scope="col">Date de Fin</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.diplomas.map((diploma, index) => (
                          <tr key={index}>
                            <td>{diploma.name}</td>
                            <td>{diploma.end_date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>Aucun diplôme ajouté.</p>
                  )}

                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setShowDiplomaModal(true)}
                  >
                    Gestion des diplomes
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            Annuler
          </button>
        </form>

        {/* Modal d'adresse */}
        <Modal show={showInfoModal} onHide={handleCloseInfoModal}>
          <Modal.Header closeButton>
            <Modal.Title>Modifier Adresse</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleInfoSubmit}>
              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  Adresse:
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="form-control"
                  value={infoFormData.address}
                  onChange={handleInfoChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="region" className="form-label">
                  Région:
                </label>
                <select
                  id="region"
                  name="region"
                  className="form-select"
                  value={infoFormData.region}
                  onChange={handleInfoChange}
                >
                  <option value="">Sélectionner une région</option>
                  {regions.map((region) => (
                    <option key={region.region_code} value={region.region_code}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="departement" className="form-label">
                  Département:
                </label>
                <select
                  id="departement"
                  name="departement"
                  className="form-select"
                  value={infoFormData.departement}
                  onChange={handleInfoChange}
                >
                  <option value="">Sélectionner un département</option>
                  {filteredDepartements.map((dept) => (
                    <option
                      key={dept.departement_code}
                      value={dept.departement_code}
                    >
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="city" className="form-label">
                  Ville:
                </label>
                <select
                  id="city"
                  name="city"
                  className="form-select"
                  value={infoFormData.city}
                  onChange={handleInfoChange}
                >
                  <option value="">Sélectionner une ville</option>
                  {filteredCities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <Button type="submit" variant="primary">
                Enregistrer
              </Button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseInfoModal}
              >
                Annuler
              </button>
            </form>
          </Modal.Body>
        </Modal>

        {/* Modal Diplômes */}
        <Modal
          show={showDiplomaModal}
          onHide={handleCloseDiplomaModal}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Gestion des Diplômes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Table of Existing Diplomas */}
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Diplôme</th>
                  <th scope="col">Date de Fin</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.diplomas.map((diploma, index) => (
                  <tr key={index}>
                    <td>{diploma.name}</td>
                    <td>
                      <input
                        type="date"
                        name="end_date"
                        value={diploma.end_date}
                        onChange={(e) => handleDiplomaChange(index, e)}
                        className="form-control"
                      />
                    </td>
                    <td>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => handleRemoveDiploma(index)}
                      >
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Add/Edit Diploma Form */}
            <div className="mb-3">
              <label htmlFor="newDiplomaId" className="form-label">
                Diplôme:
              </label>
              <select
                id="newDiplomaId"
                className="form-select"
                value={newDiplomaId}
                onChange={(e) => setNewDiplomaId(e.target.value)}
              >
                <option value="">Sélectionner un diplôme</option>
                {availableDiplomas.map((diploma) => (
                  <option key={diploma.id} value={diploma.id}>
                    {diploma.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="newDiplomaEndDate" className="form-label">
                Date de fin:
              </label>
              <input
                type="date"
                id="newDiplomaEndDate"
                className="form-control"
                value={newDiplomaEndDate}
                onChange={(e) => setNewDiplomaEndDate(e.target.value)}
              />
            </div>
            <Button type="button" variant="primary" onClick={handleAddDiploma}>
              Ajouter
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDiplomaModal}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminAuthenticatedLayout>
  );
};

export default Edit;
