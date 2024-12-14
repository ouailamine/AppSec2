import React, { useState, useEffect } from "react";
import Select from "react-select";

const SectionSearch = ({
  regions,
  departements,
  typeAds,
  genres,
  diplomas,
  onSearch,
  onInitUser,
}) => {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedAgentType, setSelectedAgentType] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedDiplomas, setSelectedDiplomas] = useState([]);
  const [filteredDepartements, setFilteredDepartements] = useState([]);

  const [isSimpleOpen, setIsSimpleOpen] = useState(false);
  const [isMultiOpen, setIsMultiOpen] = useState(false); // Contrôle de l'accordion
  const [searchAttribute, setSearchAttribute] = useState("");
  const [searchValue, setSearchValue] = useState("");

  // Format diplomas for react-select
  const diplomaOptions = diplomas.map((diploma) => ({
    value: diploma.name
    ,
    label: diploma.name,
  }));

  // Function to toggle "Recherche Simple" accordion
  const toggleSimpleAccordion = () => {
    setIsSimpleOpen(!isSimpleOpen);
    setSelectedRegion("");
    setSelectedDepartment("");
    setSelectedAgentType("");
    setSelectedGender("");
    setSelectedDiplomas([]);
    setFilteredDepartements([]);

    if (!isSimpleOpen) {
      setIsMultiOpen(false);
    }
  };

  // Function to toggle "Recherche Multiple" accordion
  const toggleMultiAccordion = () => {
    setIsMultiOpen(!isMultiOpen);
    setSearchAttribute("");
    setSearchValue("");
    if (!isMultiOpen) {
      setIsSimpleOpen(false);
    }
  };

  // Mettre à jour les départements lorsque la région change
  const handleRegionChange = (e) => {
    const selectedRegionCode = e.target.value;
    setSelectedRegion(selectedRegionCode);

    // Filtrer les départements en fonction de la région sélectionnée
    const filtered = departements.filter(
      (dept) => dept.region_code === selectedRegionCode
    );

    console.log(filtered)
    setFilteredDepartements(filtered);
  };

  const handleDepartementChange =(e)=>{
    const selectedDepartementCode = e.target.value;
    setSelectedDepartment(selectedDepartementCode);

  }
  const handleDiplomasChange = (selectedOptions) => {
    setSelectedDiplomas(selectedOptions);
  };

  const handleSimpleSearch = () => {
    const searchSimpleData = {
      searchType: "simple",
      searchAttribute,
      searchValue,
    };
    onSearch(searchSimpleData),
    console.log("Search data:", searchSimpleData);

  };

  const handleMultiSearch = () => {
    const searchMultiData = {
      searchType: "Multiple",
      selectedRegion,
      selectedDepartment,
      selectedAgentType,
      selectedGender,
      selectedDiplomas: selectedDiplomas.map((diploma) => diploma.value),
    };
    onSearch(searchMultiData),
    console.log("Search data:", searchMultiData);
  };

  const handleInitSearch = () => {
    setSearchAttribute("");
    setSearchValue("");
    setSelectedRegion("");
    setSelectedDepartment("");
    setSelectedAgentType("");
    setSelectedGender("");
    setSelectedDiplomas([]);
    setFilteredDepartements([]);
    onInitUser();
  };

  return (
    <div className="px-2 py-4 bg-gray-50 mb-4 h-full">
      <div className="flex flex-wrap gap-2 mb-2 mt-2 w-full">
        {/* Titre de l'accordion */}
        <div
          className="cursor-pointer flex justify-between items-center p-2 w-full bg-blue-500 text-white text-sm font-medium rounded-lg"
          onClick={toggleSimpleAccordion}
        >
          <span className="text-sm font-bold">Rechercher Simple</span>
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${
              isSimpleOpen ? "transform rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
          >
            <path
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 9l6 6 6-6"
            />
          </svg>
        </div>

        {/* Contenu de l'accordion */}
        {isSimpleOpen && (
          <div className="p-2 bg-red-50 border border-red-800 w-full rounded-b-lg">
            <div className="flex gap-2 mb-2">
              <div className="relative w-1/2 min-w-[250px] max-w-xs">
                <label
                  htmlFor="search-attribute"
                  className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
                >
                  Choisir un critère
                </label>
                <select
                  id="search-attribute"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={searchAttribute}
                  onChange={(e) => setSearchAttribute(e.target.value)}
                >
                  <option value="">Séléctionner un critère</option>
                  <option value="fullname">Nom</option>
                  <option value="email">Email</option>
                  <option value="phone">Téléphone</option>
                  <option value="social_security_number">
                    Numéro de Sécurité Sociale
                  </option>
                  <option value="professional_card_number">
                    Numéro de Carte Professionnelle
                  </option>
                </select>
              </div>

              <div className="relative w-1/2 min-w-[250px] max-w-xs">
                <label
                  htmlFor="search-value"
                  className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
                >
                  Valeur de recherche
                </label>
                <input
                  type="text"
                  id="search-value"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Saisissez la valeur"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              <div className="flex justify-center mt-3 gap-2">
                <button
                  onClick={handleSimpleSearch}
                  className="px-4 py-2 bg-blue-500 text-white font-medium text-xs rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Rechercher
                </button>
                <button
                  onClick={handleInitSearch}
                  className="px-4 py-2 bg-blue-500 text-white font-medium text-xs rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Initialiser
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-2 mt-2 w-full">
        <div
          className="cursor-pointer flex justify-between items-center p-2 w-full bg-blue-500 text-white text-sm font-medium rounded-lg"
          onClick={toggleMultiAccordion}
        >
          <span>Rechercher Multiple</span>
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${
              isMultiOpen ? "transform rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
          >
            <path
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 9l6 6 6-6"
            />
          </svg>
        </div>

        {/* Région */}
        {isMultiOpen && (
          <>
            <div className="p-4 bg-gray-50 border border-gray-300 rounded-b-lg">
              <div className="flex flex-wrap gap-2 mb-2">
                <div className="relative w-auto min-w-[300px] max-w-[500px]">
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

                <div className="relative w-auto min-w-[300px] max-w-[500px]">
                  <label
                    htmlFor="department"
                    className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
                  >
                    Département
                  </label>
                  <select
                    id="department"
                    onChange={handleDepartementChange}
                    className="block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    disabled={!selectedRegion}
                  >
                    <option value="">Sélectionnez un département</option>
                    {filteredDepartements.map((dept) => (
                      <option key={dept.id} value={dept.departement_code}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative w-auto min-w-[300px] max-w-[500px]">
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
                      <option key={type.id} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative w-auto min-w-[300px] max-w-[500px]">
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

                <div className="relative w-auto min-w-[300px] max-w-[500px]">
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
                        minWidth: "300px", // Increased width
                        maxWidth: "100%",
                      }),
                      menu: (provided) => ({
                        ...provided,
                        width: "100%",
                        maxWidth: "100%",
                        overflow: "hidden",
                      }),
                      menuPortal: (provided) => ({
                        ...provided,
                        zIndex: 9999,
                      }),
                    }}
                    menuPortalTarget={document.body}
                  />
                </div>
              </div>
              <div className="flex justify-center mt-3 gap-2">
                <button
                  onClick={handleMultiSearch}
                  className="px-4 py-2 bg-blue-500 text-white font-medium text-xs rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Rechercher
                </button>
                <button
                  onClick={handleInitSearch}
                  className="px-4 py-2 bg-blue-500 text-white font-medium text-xs rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Initialiser
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SectionSearch;
