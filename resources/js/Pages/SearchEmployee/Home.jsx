import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Head, usePage } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import CreateEditGuardModal from "./CreateEditGuardModal";
import ShowGuardModal from "./ShowGuardModal";

const Home = ({
  users,
  guards,
  departements,
  regions,
  diplomas,
  genres,
  adsType,
  roles,
  auth,
  nationalities,
  typeAds,
  cities,
}) => {
  // États pour les champs de recherche
  const [searchType, setSearchType] = useState("fullname");
  const [searchValue, setSearchValue] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [filteredDepartements, setFilteredDepartements] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedAdsType, setSelectedAdsType] = useState("");
  const [selectedDiploma, setSelectedDiploma] = useState("");
  const [searchMode, setSearchMode] = useState("simple"); // État pour basculer entre recherche simple et multiple
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [usersOrGuard, setUsersOrGuard] = useState(users);

  const [showModal, setShowModal] = useState(false);
  const [createEditModal, setCreateEditModal] = useState(false);

  const [isSimpleOpen, setIsSimpleOpen] = useState(false);
  const [isMultipleOpen, setIsMultipleOpen] = useState(false);
  const [isAgentSearchOpen, setIsAgentSearchOpen] = useState(false);
  // Fonction pour gérer la soumission du formulaire de recherche
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // Fonction pour basculer entre les modes de recherche
  const handleModeChange = (mode) => {
    setSearchMode(mode);
    if (mode === "simple") {
      // Réinitialiser les champs spécifiques à la recherche multiple
      setSelectedRegion("");
      setSelectedDepartment("");
      setSelectedGenre("");
      setSelectedAdsType("");
      setSelectedDiploma("");
    } else {
      // Réinitialiser les champs spécifiques à la recherche simple
      setSearchType("fullname");
      setSearchValue("");
    }
  };

  // Filtrer les utilisateurs en fonction du type de recherche sélectionné
  const filteredUsers = (usersOrGuard || []).filter((user) => {
    // Vérification des données utilisateur
    if (!user) {
      console.error("Utilisateur invalide ou null :", user);
      return false;
    }

    // Valeur de recherche en minuscule
    const value = searchValue?.toLowerCase() || "";

    // Vérification du critère de type de recherche
    const matchesSearchType = (() => {
      if (!searchType || !searchValue) return true;

      switch (searchType) {
        case "fullname":
          return user.fullname?.toLowerCase().includes(value);
        case "firstname":
          return user.firstname?.toLowerCase().includes(value);
        case "email":
          return user.email?.toLowerCase().includes(value);
        case "phone":
          return user.phone?.toString().toLowerCase().includes(value);
        case "city":
          return user.city?.toLowerCase().includes(value);
        case "ssn":
          return user.ssn?.toString().toLowerCase().includes(value);
        default:
          return true;
      }
    })();

    // Vérification de la région
    const matchesRegion = selectedRegion
      ? user.region === selectedRegion
      : true;

    // Vérification du département
    const matchesDepartment = selectedDepartment
      ? user.departement === selectedDepartment
      : true;

    // Vérification du genre
    const matchesGenre = selectedGenre ? user.genre === selectedGenre : true;

    // Vérification du type d'annonces
    const matchesAdsType = selectedAdsType
      ? user.typeADS === selectedAdsType
      : true;

    // Vérification des diplômes
    const matchesDiploma = (() => {
      if (!selectedDiploma) return true;

      try {
        // Validation et parsing des diplômes
        const diplomas = JSON.parse(user.diplomas || "[]");
        return diplomas.some((diploma) => diploma.name === selectedDiploma);
      } catch (error) {
        console.error("Erreur lors du parsing des diplômes :", error);
        return false;
      }
    })();

    // Retourne vrai si toutes les conditions sont remplies
    return (
      matchesSearchType &&
      matchesRegion &&
      matchesDepartment &&
      matchesGenre &&
      matchesAdsType &&
      matchesDiploma
    );
  });

  const handleShow = (user) => {
    setSelectedUser(user);
    setShowModal(true);
    console.log(user);
  };

  const handleCreate = () => {
    setIsEditMode(false);
    setCreateEditModal(true);
  };

  const handleEdit = (user) => {
    setIsEditMode(true);
    setSelectedUser(user);
    setCreateEditModal(true);
  };

  const handleDelete = (userIds) => {
    if (window.confirm("Voulez-vous supprimer cette Agent?")) {
      Inertia.delete(route("users.destroy", userIds));
    }
  };
  const handleCloseModal = () => {
    setCreateEditModal(false);
    setShowModal(false);
  };

  const handleAtalixGuard = () => {
    setUsersOrGuard(users);
    console.log(usersOrGuard);
  };

  const handleOtherGuard = () => {
    setUsersOrGuard(guards);
    console.log(usersOrGuard);
  };
  return (
    <AdminAuthenticatedLayout user={auth.user}>
      <Head title="DashboardAdmin" />
      <div className="container mt-4">
        <div className="flex justify-center items-center mb-4">
          <button
            onClick={handleCreate}
            className="
      bg-green-500 text-white px-6 py-3 
      rounded-lg shadow-lg text-base font-semibold 
      hover:bg-green-600 hover:shadow-xl 
      focus:outline-none focus:ring-4 focus:ring-green-300 
      active:bg-green-700 
      transition-all duration-300 ease-in-out
    "
          >
            Ajouter un nouveau agent
          </button>
        </div>

        {/* Header Section */}
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
          <button
            type="button"
            className="w-full bg-gray-100 flex justify-between items-center px-4 py-3 font-semibold text-gray-800 hover:bg-gray-200"
            onClick={() => setIsAgentSearchOpen(!isAgentSearchOpen)}
          >
            Recherche d'agents
            <span
              className={`w-5 h-5 border-t-2 border-r-2 border-black transform transition-transform duration-300 ${
                isAgentSearchOpen ? "-rotate-45" : "-rotate-90"
              }`}
            ></span>
          </button>

          {isAgentSearchOpen && (
            <div className="p-4 bg-white">
              {/* Recherche Simple */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  className="w-full bg-blue-100 flex justify-between items-center px-4 py-3 font-semibold text-gray-800 hover:bg-blue-200"
                  onClick={() => setIsSimpleOpen(!isSimpleOpen)}
                >
                  Recherche Simple
                  <i
                    className={`bi ${
                      isSimpleOpen ? "bi-chevron-up" : "bi-chevron-down"
                    } transition-transform`}
                  ></i>
                </button>
                {isSimpleOpen && (
                  <div className="p-4 bg-gray-50">
                    <form
                      onSubmit={handleSubmit}
                      className="w-full max-w-lg space-y-4"
                    >
                      <div>
                        <label
                          htmlFor="searchType"
                          className="block text-sm font-medium mb-1"
                        >
                          Type de recherche
                        </label>
                        <select
                          id="searchType"
                          className="form-select w-full border rounded-md px-3 py-2"
                          value={searchType}
                          onChange={(e) => setSearchType(e.target.value)}
                        >
                          <option value="fullname">Nom</option>
                          <option value="firstname">Prénom</option>
                          <option value="email">Email</option>
                          <option value="phone">Téléphone</option>
                          <option value="city">Ville</option>
                          <option value="ssn">Numéro sécurité sociale</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="searchValue"
                          className="block text-sm font-medium mb-1"
                        >
                          Valeur
                        </label>
                        <input
                          id="searchValue"
                          type="text"
                          className="form-input w-full border rounded-md px-3 py-2"
                          value={searchValue}
                          placeholder="Entrez la valeur"
                          onChange={(e) => setSearchValue(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-center">
                        <button
                          type="submit"
                          className="bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600"
                        >
                          Rechercher
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* Recherche Multiple */}
              <div className="border border-gray-200 rounded-lg overflow-hidden mt-4">
                <button
                  type="button"
                  className="w-full bg-blue-100 flex justify-between items-center px-4 py-3 font-semibold text-gray-800 hover:bg-blue-200"
                  onClick={() => setIsMultipleOpen(!isMultipleOpen)}
                >
                  Recherche Multiple
                  <i
                    className={`bi ${
                      isMultipleOpen ? "bi-chevron-up" : "bi-chevron-down"
                    } transition-transform`}
                  ></i>
                </button>
                {isMultipleOpen && (
                  <div className="p-4 bg-gray-50">
                    <form
                      onSubmit={handleSubmit}
                      className="w-full max-w-lg space-y-4"
                    >
                      <div>
                        <label
                          htmlFor="region"
                          className="block text-sm font-medium mb-1"
                        >
                          Région
                        </label>
                        <select
                          id="region"
                          className="form-select w-full border rounded-md px-3 py-2"
                          value={selectedRegion}
                          onChange={(e) => setSelectedRegion(e.target.value)}
                        >
                          <option value="">Toutes</option>
                          {regions.map((region) => (
                            <option key={region.id} value={region.region_code}>
                              {region.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Ajoutez d'autres champs ici */}
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="card mt-6 bg-white shadow-lg rounded-lg">
          <div className="card-header bg-gray-100 px-6 py-3 border-b border-gray-200 text-lg font-semibold">
            Résultats de la recherche
          </div>
          <div className="card-body px-6 py-4">
            <table className="table-auto w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th
                    scope="col"
                    className="px-2 py-2 text-gray-600 font-medium"
                  >
                    Nom
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-gray-600 font-medium"
                  >
                    Prénom
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-gray-600 font-medium"
                  >
                    Téléphone
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-gray-600 font-medium"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-gray-600 font-medium"
                  >
                    Actions
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-2 text-gray-600 font-medium"
                  ></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-2 py-2">{user.fullname}</td>
                    <td className="px-2 py-2">{user.firstname}</td>
                    <td className="px-2 py-2">0{user.phone}</td>
                    <td className="px-2 py-2">{user.email}</td>
                    <td className="px-2 py-2">
                      <div className="flex space-x-2">
                        {/* Show Button */}
                        <button
                          className="bg-green-500 text-white px-2 py-1 rounded-md text-sm flex items-center hover:bg-green-600"
                          onClick={() => handleShow(user)}
                        >
                          <i className="bi bi-eye mr-1"></i> Voir
                        </button>
                        {/* Edit Button */}
                        <button
                          className="bg-yellow-500 text-white px-2 py-1 rounded-md text-sm flex items-center hover:bg-yellow-600"
                          onClick={() => handleEdit(user)}
                        >
                          <i className="bi bi-pencil-square mr-1"></i> Modifier
                        </button>
                        {/* Delete Button */}
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded-md text-sm flex items-center hover:bg-red-600"
                          onClick={() => handleDelete(user.id)}
                        >
                          <i className="bi bi-trash mr-1"></i> Supprimer
                        </button>
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm flex items-center hover:bg-blue-600"
                        onClick={() => {
                          if (user.registerNumber) {
                            // Si registerNumber existe, rediriger vers la création de carte Pro
                            Inertia.get(
                              route("procards.create", { user_id: user.id })
                            );
                          } else {
                            // Sinon, rediriger vers la création de compte

                            Inertia.post(route("CreateUser", { user }));
                          }
                        }}
                      >
                        <i className="bi bi-plus-circle mr-1"></i>{" "}
                        {user.registerNumber
                          ? "Créer une Carte Pro"
                          : "Créer un Compte"}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      Aucun résultat trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {createEditModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center ">
          <div className="bg-white rounded-lg shadow-lg  sm:w-[600px] md:w-[1000px] w-full max-h-[90vh] overflow-y-auto relative">
            <CreateEditGuardModal
              isEditMode={isEditMode}
              user={selectedUser}
              roles={roles}
              genres={genres}
              nationalities={nationalities}
              typeAds={typeAds}
              diplomas={diplomas}
              departements={departements}
              regions={regions}
              cities={cities}
              onClose={handleCloseModal}
            />
            {/*}
            <button
              onClick={setCreateEditModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl sm:text-3xl"
            >
              ❌
            </button>{*/}
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:w-[600px] md:w-[1000px] w-full max-h-[90vh] overflow-y-auto relative">
            <ShowGuardModal
              user={selectedUser}
              onClose={handleCloseModal}
              departements={departements}
              regions={regions}
            />
          </div>
        </div>
      )}
    </AdminAuthenticatedLayout>
  );
};

export default Home;
