import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";

import Select from "react-select";

const Create = ({
  roles,
  genres,
  nationalities,
  typeAds,
  diplomas,
  departements,
  regions,
  cities,
}) => {
  const [formData, setFormData] = useState({
    fullname: "",
    firstname: "",
    genre: "",
    nationality: "",
    dateofbirth: "",
    address: "",
    city: "",
    region: "",
    departement: "",
    email: "",
    phone: "",
    social_security_number: "",
    professional_card_number: "",
    typeAds: "",
    diplomas: [],
    role: "",
  });

  const [filteredDepartements, setFilteredDepartements] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
    // Filter departements based on selected region
    if (formData.region) {
      setFilteredDepartements(
        departements.filter((dep) => dep.region_code === formData.region)
      );
    } else {
      setFilteredDepartements([]);
      setFilteredCities([]);
    }
  }, [formData.region, departements]);

  useEffect(() => {
    // Filter cities based on selected departement
    if (formData.departement) {
      setFilteredCities(
        cities.filter((city) => city.departement_code === formData.departement)
      );
    } else {
      setFilteredCities([]);
    }
  }, [formData.departement, cities]);

  const handleChange = (e) => {
    const { name, value, multiple } = e.target;
    if (multiple) {
      const options = Array.from(e.target.options);
      const selectedValues = options
        .filter((option) => option.selected)
        .map((option) => option.value);
      setFormData({
        ...formData,
        [name]: selectedValues,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCityChange = (selectedOption) => {
    setFormData({
      ...formData,
      city: selectedOption ? selectedOption.value : "",
    });
  };

  const handleNationalityChange = (selectedOption) => {
    // Vérifiez si une option a été sélectionnée
    if (selectedOption) {
      setFormData({
        ...formData,
        nationality: selectedOption.value, // Mettez à jour avec l'id
      });
    } else {
      setFormData({
        ...formData,
        nationality: "", // Réinitialisez la nationalité si l'utilisateur efface la sélection
      });
    }
  };
  const handleDiplomaChange = (index, field, value) => {
    const newDiplomas = [...formData.diplomas];
    newDiplomas[index] = {
      ...newDiplomas[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      diplomas: newDiplomas,
    });
  };

  const addDiploma = () => {
    setFormData({
      ...formData,
      diplomas: [...formData.diplomas, { name: "", start_date: "" }],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Inertia.post("/users", formData);
  };

  return (
    <div className="container mt-5 mx-auto px-2">
      <div className="card mx-auto m-3 p-3">
        <div className="card-header">
          <h1>Créer un Employé</h1>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Left Column */}
              <div className="col-12 col-md-3 mb-3">
                <div className="form-group  mt-3">
                  <label htmlFor="fullname" className="form-label">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    className="form-control"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="Nom Complet"
                  />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="firstname" className="form-label">
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    className="form-control"
                    value={formData.firstname}
                    onChange={handleChange}
                    placeholder="Prénom"
                  />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="genre" className="form-label">
                    Genre
                  </label>
                  <select
                    id="genre"
                    name="genre"
                    className="form-select"
                    value={formData.genre}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionnez le Genre</option>
                    {genres.map((genre) => (
                      <option key={genre.id} value={genre.name}>
                        {genre.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="dateofbirth" className="form-label">
                    Date de Naissance
                  </label>
                  <input
                    type="date"
                    id="dateofbirth"
                    name="dateofbirth"
                    className="form-control"
                    value={formData.dateofbirth}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-12 mt-3">
                  <label htmlFor="nationality" className="form-label">
                    Nationalité
                  </label>
                  <Select
                    id="nationality"
                    name="nationality"
                    options={nationalities.map((nat) => ({
                      value: nat.name, // Utiliser l'id pour le value
                      label: nat.name,
                    }))}
                    onChange={handleNationalityChange}
                    value={
                      nationalities.find(
                        (nat) => nat.id === formData.nationality
                      )
                        ? {
                            value: formData.nationality,
                            label: nationalities.find(
                              (nat) => nat.id === formData.nationality
                            ).name,
                          }
                        : null
                    }
                    placeholder="Sélectionnez une Nationalité"
                    isClearable
                  />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="role" className="form-label">
                    Rôle
                  </label>
                  <select
                    id="role"
                    name="role"
                    className="form-select"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionnez le Rôle</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.name}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Middle Column */}
              <div className="col-12 col-md-4 mb-3">
                <div className="form-group mt-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="phone" className="form-label">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Téléphone"
                  />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="address" className="form-label">
                    Adresse
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="form-control"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Adresse"
                  />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="region" className="form-label">
                    Région
                  </label>
                  <select
                    id="region"
                    name="region"
                    className="form-select"
                    value={formData.region}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionnez la Région</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.region_code}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="departement" className="form-label">
                    Département
                  </label>
                  <select
                    id="departement"
                    name="departement"
                    className="form-select"
                    value={formData.departement}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionnez le Département</option>
                    {filteredDepartements.map((departement) => (
                      <option
                        key={departement.id}
                        value={departement.departement_code}
                      >
                        {departement.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="city" className="form-label">
                    Ville
                  </label>
                  <Select
                    id="city"
                    name="city"
                    options={filteredCities.map((city) => ({
                      value: city.name,
                      label: city.name,
                    }))}
                    onChange={handleCityChange}
                    value={
                      filteredCities.find((city) => city.id === formData.city)
                        ? {
                            value: formData.city,
                            label: filteredCities.find(
                              (city) => city.id === formData.city
                            ).name,
                          }
                        : null
                    }
                    placeholder="Sélectionnez une Ville"
                    isClearable
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="col-12 col-md-4 mb-3">
                <div className="form-group mt-3">
                  <label
                    htmlFor="social_security_number"
                    className="form-label"
                  >
                    Numéro de Sécurité Sociale
                  </label>
                  <input
                    type="text"
                    id="social_security_number"
                    name="social_security_number"
                    className="form-control"
                    value={formData.social_security_number}
                    onChange={handleChange}
                    placeholder="Numéro de Sécurité Sociale"
                  />
                </div>
                <div className="form-group mt-3">
                  <label
                    htmlFor="professional_card_number"
                    className="form-label"
                  >
                    Numéro de Carte Professionnelle
                  </label>
                  <input
                    type="text"
                    id="professional_card_number"
                    name="professional_card_number"
                    className="form-control"
                    value={formData.professional_card_number}
                    onChange={handleChange}
                    placeholder="Numéro de Carte Professionnelle"
                  />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="typeAds" className="form-label">
                    Type de Agent
                  </label>
                  <select
                    id="typeAds"
                    name="typeAds"
                    className="form-select"
                    value={formData.typeAds}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionnez un Type</option>
                    {typeAds.map((typeAd) => (
                      <option key={typeAd.id} value={typeAd.name}>
                        {typeAd.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group mt-3">
                  <label className="form-label">Diplômes </label>
                  {formData.diplomas.map((diploma, index) => (
                    <div key={index} className="row mb-3">
                      <div className="col-md-5">
                        <select
                          className="form-select"
                          value={diploma.name || ""}
                          onChange={(e) =>
                            handleDiplomaChange(index, "name", e.target.value)
                          }
                        >
                          <option value="">Sélectionnez un Diplôme</option>
                          {diplomas.map((diploma) => (
                            <option key={diploma.id} value={diploma.name}>
                              {diploma.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="date"
                          className="form-control"
                          placeholder="Date de Début"
                          value={diploma.start_date}
                          onChange={(e) =>
                            handleDiplomaChange(
                              index,
                              "start_date",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="col-md-1">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => {
                            const newDiplomas = [...formData.diplomas];
                            newDiplomas.splice(index, 1);
                            setFormData({
                              ...formData,
                              diplomas: newDiplomas,
                            });
                          }}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={addDiploma}
                  >
                    Ajouter un Diplôme
                  </button>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Créer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Create;
