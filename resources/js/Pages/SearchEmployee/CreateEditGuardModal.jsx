import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import Select from "react-select";

const AddGuardModal = ({
  roles,
  nationalities,
  typeAds,
  diplomas,
  departements,
  regions,
  cities,
  genres,
  onClose,
  isEditMode,
  user,
}) => {
  console.log(roles);
  console.log(user);
  const [filteredDepartements, setFilteredDepartements] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [formData, setFormData] = useState({
    fullname: "",
    firstname: "",
    genre: "",
    nationality: "",
    date_of_birth: "",
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

  useEffect(() => {
    if (isEditMode && user) {
      setFormData({
        fullname: user.fullname || "",
        firstname: user.firstname || "",
        genre: user.genre || "",
        nationality: user.nationality || "",
        dateofbirth: user.dateofbirth || "",
        address: user.address || "",
        city: user.city || "",
        region: user.region || "",
        departement: user.departement || "",
        email: user.email || "",
        phone: user.phone || "",
        social_security_number: user.social_security_number || "",
        professional_card_number: user.professional_card_number || "",
        typeAds: user.typeAds || "",
        diplomas: user.diplomas || [],
        role: user.role || "",
        date_of_birth: user.date_of_birth || "",
        nationality: user.nationality || "",
        city: user.city,
      });
    }
  }, [isEditMode, user]);

  useEffect(() => {
    if (user && user.diplomas) {
      const parsedDiplomas = Array.isArray(user.diplomas)
        ? user.diplomas
        : JSON.parse(user.diplomas);
      setFormData((prevState) => ({
        ...prevState,
        diplomas: parsedDiplomas,
      }));
    }
  }, [user]);

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

  const handleDiplomaChange = (index, diplomaField, value) => {
    const newDiplomas = [...formData.diplomas];
    newDiplomas[index] = {
      ...newDiplomas[index],
      [diplomaField]: value,
    };
    setFormData({
      ...formData,
      diplomas: newDiplomas,
    });
  };

  const addDiploma = () => {
    setFormData({
      ...formData,
      diplomas: [...formData.diplomas, { name: "", end_date: "" }],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = isEditMode ? `/users/${user.id}` : "/users";
    const method = isEditMode ? "put" : "post";

    Inertia[method](url, formData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-6">
          {isEditMode ? "Modifier un Employé" : "Créer un Employé"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="fullname"
                  className="block text-xs font-medium text-gray-700"
                >
                  Nom
                </label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="Nom Complet"
                />
              </div>
              <div>
                <label
                  htmlFor="firstname"
                  className="block text-xs font-medium text-gray-700"
                >
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs"
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder="Prénom"
                />
              </div>
              <div>
                <label
                  htmlFor="genre"
                  className="block text-xs font-medium text-gray-700"
                >
                  Genre
                </label>
                <select
                  id="genre"
                  name="genre"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs"
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
              <div>
                <label
                  htmlFor="dateofbirth"
                  className="block text-xs font-medium text-gray-700"
                >
                  Date de Naissance
                </label>
                <input
                  type="date"
                  id="dateofbirth"
                  name="dateofbirth"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                />
              </div>
              <label
                  htmlFor="dateofbirth"
                  className="block text-xs font-medium text-gray-700"
                >
                  Nationalité
                </label>
              <Select
                id="nationality"
                name="nationality"
                aria-label="Select nationality"
                options={nationalities.map((nat) => ({
                  value: nat.name,
                  label: nat.name,
                }))}
                onChange={handleNationalityChange}
                value={
                  nationalities.find((nat) => nat.name === formData.nationality)
                    ? {
                        value: formData.nationality,
                        label: formData.nationality,
                      }
                    : null
                }
                isClearable
                classNames={{
                  control: () => "text-xs border-gray-300 rounded-md shadow-sm",
                  menu: () =>
                    "text-xs bg-white border border-gray-200 rounded-md",
                  singleValue: () => "text-xs text-gray-900",
                  option: () => "text-xs hover:bg-gray-100 cursor-pointer",
                }}
              />

              <div>
                <label
                  htmlFor="role"
                  className="block text-xs font-medium text-gray-700"
                >
                  Rôle
                </label>
                <select
                  id="role"
                  name="role"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="">Sélectionnez le Rôle</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Middle Column */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-medium text-gray-700"
                >
                  Téléphone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Téléphone"
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-xs font-medium text-gray-700"
                >
                  Adresse
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Adresse"
                />
              </div>
              <div>
                <label
                  htmlFor="region"
                  className="block text-xs font-medium text-gray-700"
                >
                  Région
                </label>
                <select
                  id="region"
                  name="region"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs"
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
                <label
                  htmlFor="departement"
                  className="block text-xs font-medium text-gray-700"
                >
                  Département
                </label>
                <select
                  id="departement"
                  name="departement"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs"
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
              <div>
                <label
                  htmlFor="city"
                  className="block text-xs font-medium text-gray-700"
                >
                  Ville
                </label>
                <Select
                  id="city"
                  name="city"
                  options={filteredCities.map((city) => ({
                    value: city.name, // Use name instead of id
                    label: city.name,
                  }))}
                  onChange={handleCityChange}
                  value={
                    filteredCities.find((city) => city.name === formData.city)
                      ? {
                          value: formData.city,
                          label: formData.city,
                        }
                      : null
                  }
                  placeholder="Sélectionnez une Ville"
                  isClearable
                  classNames={{
                    control: () =>
                      "text-xs border-gray-300 rounded-md shadow-sm",
                    menu: () =>
                      "text-xs bg-white border border-gray-200 rounded-md",
                    singleValue: () => "text-xs text-gray-900",
                    option: () => "text-xs hover:bg-gray-100 cursor-pointer",
                    placeholder: () => "text-xs text-gray-500",
                  }}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="social_security_number"
                  className="block text-xs font-medium text-gray-700"
                >
                  Numéro de Sécurité Sociale
                </label>
                <input
                  type="text"
                  id="social_security_number"
                  name="social_security_number"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs"
                  value={formData.social_security_number}
                  onChange={handleChange}
                  placeholder="Numéro de Sécurité Sociale"
                />
              </div>
              <div>
                <label
                  htmlFor="professional_card_number"
                  className="block text-xs font-medium text-gray-700"
                >
                  Numéro de Carte Professionnelle
                </label>
                <input
                  type="text"
                  id="professional_card_number"
                  name="professional_card_number"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs"
                  value={formData.professional_card_number}
                  onChange={handleChange}
                  placeholder="Numéro de Carte Professionnelle"
                />
              </div>
              <div>
                <label
                  htmlFor="typeAds"
                  className="block text-xs font-medium text-gray-700"
                >
                  Type de Agent
                </label>
                <select
                  id="typeAds"
                  name="typeAds"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs"
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
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Diplômes
                  </label>
                  {formData.diplomas.map((diploma, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap items-center gap-1 mb-2"
                    >
                      <div className="flex-1 min-w-[100px]">
                        <select
                          className="block w-full border-gray-300 rounded-md shadow-xs focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs"
                          value={diploma.name}
                          onChange={(e) =>
                            handleDiplomaChange(index, "name", e.target.value)
                          }
                        >
                          <option value="">Sélectionnez un Diplôme</option>
                          {diplomas.map((diplomaOption) => (
                            <option
                              key={diplomaOption.id}
                              value={diplomaOption.name}
                            >
                              {diplomaOption.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1 min-w-[120px]">
                        <input
                          type="date"
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs"
                          placeholder="Date de Fin"
                          value={diploma.end_date}
                          onChange={(e) =>
                            handleDiplomaChange(
                              index,
                              "end_date",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="flex-shrink-0">
                        <button
                          type="button"
                          className="bg-red-500 text-white text-xs px-2 py-1 rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-1 focus:ring-red-500"
                          onClick={() => {
                            const newDiplomas = [...formData.diplomas];
                            newDiplomas.splice(index, 1);
                            setFormData({
                              ...formData,
                              diplomas: newDiplomas,
                            });
                          }}
                        >
                          X
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addDiploma}
                    className="text-indigo-600 text-xs mt-2 block w-full sm:w-auto"
                  >
                    Ajouter un Diplôme
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 border rounded-md"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md"
            >
              {isEditMode ? "Mettre à jour" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGuardModal;
