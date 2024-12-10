import React, { useState, useEffect } from "react";
import Select from "react-select";

const SectionSearch = ({
  regions,
  departements,
  typeAds,
  genres,
  diplomas,
  onSearch,
  onInitUser
}) => {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedAgentType, setSelectedAgentType] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedDiplomas, setSelectedDiplomas] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [socialSecurity, setSocialSecurity] = useState("");
  const [professionalCard, setProfessionalCard] = useState("");
  const [filteredDepartements, setFilteredDepartements] = useState([]);

  // Mettre à jour les départements lorsque la région change
  const handleRegionChange = (e) => {
    const selectedRegionId = e.target.value;
    setSelectedRegion(selectedRegionId);

    // Filtrer les départements en fonction de la région sélectionnée
    const filtered = departements.filter(
      (dept) => dept.region_code === selectedRegionId
    );
    setFilteredDepartements(filtered);
  };

  const handleDiplomasChange = (selectedOptions) => {
    setSelectedDiplomas(selectedOptions);
  };

 

  const handleSearch = () => {
    const searchData = {
      name,
      email,
      phone,
      socialSecurity,
      professionalCard,
      selectedRegion,
      selectedDepartment,
      selectedAgentType,
      selectedGender,
      selectedDiplomas: selectedDiplomas.map((diploma) => diploma.value),
    };

    console.log("Search data:", searchData);
    onSearch(searchData)
    setName('');
    setEmail('');
    setPhone('');
    setSocialSecurity('');
    setProfessionalCard('');
    setSelectedRegion('');
    setSelectedDepartment('');
    setSelectedAgentType('');
    setSelectedGender('');
    setSelectedDiplomas([]);
    setFilteredDepartements([]);
  };

  // Format diplomas for react-select
  const diplomaOptions = diplomas.map((diploma) => ({
    value: diploma.id,
    label: diploma.name,
  }));


  const handleSearchInit =()=>{
    setName('');
    setEmail('');
    setPhone('');
    setSocialSecurity('');
    setProfessionalCard('');
    setSelectedRegion('');
    setSelectedDepartment('');
    setSelectedAgentType('');
    setSelectedGender('');
    setSelectedDiplomas([]);
    setFilteredDepartements([]);
    onInitUser()

  }

  return (
    <div className="px-4 py-4 bg-gray-50">
      <div className="flex flex-wrap gap-2 mb-2">
        <div className="relative w-auto min-w-[150px] max-w-xs">
          <label
            htmlFor="name"
            className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
          >
            Nom
          </label>
          <input
            type="text"
            id="name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="John"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="relative w-auto min-w-[250px] max-w-xs">
          <label
            htmlFor="email"
            className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="exemple@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="relative w-auto min-w-[250px] max-w-xs">
          <label
            htmlFor="phone"
            className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
          >
            Téléphone
          </label>
          <input
            type="tel"
            id="phone"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="06 12 34 56 78"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="relative w-auto min-w-[250px] max-w-xs">
          <label
            htmlFor="social-security"
            className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
          >
            Numéro de Sécurité Sociale
          </label>
          <input
            type="text"
            id="social-security"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="123-45-6789"
            value={socialSecurity}
            onChange={(e) => setSocialSecurity(e.target.value)}
            required
          />
        </div>

        <div className="relative w-auto min-w-[250px] max-w-xs">
          <label
            htmlFor="professional-card"
            className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
          >
            Numéro de Carte Professionnelle
          </label>
          <input
            type="text"
            id="professional-card"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="XXXX-YYYY-ZZZZ"
            value={professionalCard}
            onChange={(e) => setProfessionalCard(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-2 mt-3">
        {/* Région */}
        <div className="relative w-auto min-w-[200px] max-w-xs">
          <label
            htmlFor="region"
            className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
          >
            Région
          </label>
          <select
            id="region"
            className="block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={handleRegionChange}
            value={selectedRegion}
          >
            <option value="">Sélectionnez une région</option>
            {regions.map((region) => (
              <option key={region.id} value={region.region_code}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        {/* Département */}
        <div className="relative w-auto min-w-[200px] max-w-xs">
          <label
            htmlFor="department"
            className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
          >
            Département
          </label>
          <select
            id="department"
            className="block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            disabled={!selectedRegion}
          >
            <option value="">Sélectionnez un département</option>
            {filteredDepartements.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type d'Agent */}
        <div className="relative w-auto min-w-[200px] max-w-xs">
          <label
            htmlFor="agent-type"
            className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
          >
            Type d'Agent
          </label>
          <select
            id="agent-type"
            className="block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => setSelectedAgentType(e.target.value)}
            value={selectedAgentType}
          >
            <option value="">Sélectionnez un type d'agent</option>
            {typeAds.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Genre */}
        <div className="relative w-auto min-w-[200px] max-w-xs">
          <label
            htmlFor="gender"
            className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
          >
            Genre
          </label>
          <select
            id="gender"
            className="block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => setSelectedGender(e.target.value)}
            value={selectedGender}
          >
            <option value="">Sélectionnez un genre</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        {/* Diplomas (Multi-Select) */}
        <div className="relative w-auto min-w-[200px] max-w-xs">
          <label
            htmlFor="diplomas"
            className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
          >
            Diplômes
          </label>
          <Select
            id="diplomas"
            isMulti
            options={diplomaOptions}
            value={selectedDiplomas}
            onChange={handleDiplomasChange}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={{
              control: (provided) => ({
                ...provided,
                minWidth: "200px",
                maxWidth: "100%", // Assurez-vous qu'il ne dépasse pas du parent
              }),
              menu: (provided) => ({
                ...provided,
                width: "100%", // Assurez-vous que le menu prend toute la largeur disponible
                maxWidth: "100%", // Empêche la largeur de dépasser
                overflow: "hidden", // Prévient tout débordement
              }),
              menuPortal: (provided) => ({
                ...provided,
                zIndex: 9999, // Assurez-vous que le menu est au-dessus des autres éléments
              }),
            }}
            menuPortalTarget={document.body} // Rendre le menu en dehors du conteneur parent
          />
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white font-medium text-xs rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Rechercher
        </button>
        <button
          onClick={handleSearchInit}
          className="px-4 py-2 bg-blue-500 text-white font-medium text-xs rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Initialiser
        </button>
      </div>
    </div>
  );
};

export default SectionSearch;
