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
    if (selectedOption) {
      setFormData({
        ...formData,
        nationality: selectedOption.value,
      });
    } else {
      setFormData({
        ...formData,
        nationality: "",
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-6">Créer un Employé</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="Nom Complet"
                />
              </div>
              <div>
                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">Prénom</label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder="Prénom"
                />
              </div>
              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700">Genre</label>
                <select
                  id="genre"
                  name="genre"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.genre}
                  onChange={handleChange}
                >
                  <option value="">Sélectionnez le Genre</option>
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.name}>{genre.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="dateofbirth" className="block text-sm font-medium text-gray-700">Date de Naissance</label>
                <input
                  type="date"
                  id="dateofbirth"
                  name="dateofbirth"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.dateofbirth}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">Nationalité</label>
                <Select
                  id="nationality"
                  name="nationality"
                  options={nationalities.map((nat) => ({
                    value: nat.id,
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
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rôle</label>
                <select
                  id="role"
                  name="role"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="">Sélectionnez le Rôle</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Middle Column */}
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Téléphone"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adresse</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Adresse"
                />
              </div>
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700">Région</label>
                <select
                  id="region"
                  name="region"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              <div>
                <label htmlFor="departement" className="block text-sm font-medium text-gray-700">Département</label>
                <select
                  id="departement"
                  name="departement"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.departement}
                  onChange={handleChange}
                >
                  <option value="">Sélectionnez le Département</option>
                  {filteredDepartements.map((departement) => (
                    <option key={departement.id} value={departement.departement_code}>
                      {departement.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ville</label>
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
            <div className="space-y-4">
              <div>
                <label htmlFor="social_security_number" className="block text-sm font-medium text-gray-700">Numéro de Sécurité Sociale</label>
                <input
                  type="text"
                  id="social_security_number"
                  name="social_security_number"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.social_security_number}
                  onChange={handleChange}
                  placeholder="Numéro de Sécurité Sociale"
                />
              </div>
              <div>
                <label htmlFor="professional_card_number" className="block text-sm font-medium text-gray-700">Numéro de Carte Professionnelle</label>
                <input
                  type="text"
                  id="professional_card_number"
                  name="professional_card_number"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.professional_card_number}
                  onChange={handleChange}
                  placeholder="Numéro de Carte Professionnelle"
                />
              </div>
              <div>
                <label htmlFor="typeAds" className="block text-sm font-medium text-gray-700">Type de Agent</label>
                <select
                  id="typeAds"
                  name="typeAds"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              <div>
                <label className="block text-sm font-medium text-gray-700">Diplômes</label>
                {formData.diplomas.map((diploma, index) => (
                  <div key={index} className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                      <select
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                    <div className="flex-1">
                      <input
                        type="date"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Date de Début"
                        value={diploma.start_date}
                        onChange={(e) =>
                          handleDiplomaChange(index, "start_date", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <button
                        type="button"
                        className="bg-red-500 text-white px-3 py-1 rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
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
                  className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  onClick={addDiploma}
                >
                  Ajouter un Diplôme
                </button>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Créer
          </button>
        </form>
      </div>
    </div>
  );
};

export default Create;
