import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Head, usePage } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import CreateEditGuardModal from "./CreateEditGuardModal";
import ShowGuardModal from "./ShowGuardModal";

const Home = ({
  users,
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

  const [showModal, setShowModal] = useState(false);
  const [createEditModal, setCreateEditModal] = useState(false);

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
  const filteredUsers = users.filter((user) => {
    const value = searchValue.toLowerCase();

    let matchesSearchType = true;
    if (searchType && searchValue) {
      switch (searchType) {
        case "fullname":
          matchesSearchType = user.fullname.toLowerCase().includes(value);
          break;
        case "firstname":
          matchesSearchType = user.firstname.toLowerCase().includes(value);
          break;
        case "email":
          matchesSearchType = user.email.toLowerCase().includes(value);
          break;
        case "phone":
          matchesSearchType = user.phone
            .toString()
            .toLowerCase()
            .includes(value);
          break;
        case "city":
          matchesSearchType = user.city.toLowerCase().includes(value);
          break;
        case "ssn":
          matchesSearchType = user.ssn.toString().toLowerCase().includes(value);
          break;
        default:
          matchesSearchType = true;
      }
    }

    const matchesRegion = selectedRegion
      ? user.region === selectedRegion
      : true;
    const matchesDepartment = selectedDepartment
      ? user.departement === selectedDepartment
      : true;
    const matchesGenre = selectedGenre ? user.genre === selectedGenre : true;
    const matchesAdsType = selectedAdsType
      ? user.typeADS === selectedAdsType
      : true;
    const matchesDiploma = selectedDiploma
      ? JSON.parse(user.diplomas).some(
          (diploma) => diploma.name === selectedDiploma
        )
      : true;

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
  return (
    <AdminAuthenticatedLayout user={auth.user}>
      <Head title="DashboardAdmin" />
      <div className="container mt-4">
        <div className="card border shadow-lg rounded-lg">
          <div className="card-header bg-gray-100 text-lg font-semibold p-2">
            Recherche d'utilisateurs
          </div>
          <div className="d-flex justify-content-end mb-3">
            <button onClick={handleCreate} className="btn btn-success">
              Ajouter un nouveau agent
            </button>
          </div>
          <div className="card-body flex flex-col items-center justify-center p-6">
            <div className="flex mb-4 space-x-2">
              <button
                className={`btn ${
                  searchMode === "simple"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                } px-4 py-2 rounded`}
                onClick={() => handleModeChange("simple")}
              >
                Recherche Simplxe
              </button>
              <button
                className={`btn ${
                  searchMode === "multiple"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                } px-4 py-2 rounded`}
                onClick={() => handleModeChange("multiple")}
              >
                Recherche Multiple
              </button>
            </div>
            {searchMode === "simple" ? (
              <form onSubmit={handleSubmit} className="w-full max-w-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex-1">
                    <label
                      htmlFor="searchType"
                      className="block text-sm font-medium mb-1"
                    >
                      Type de recherche
                    </label>
                    <select
                      className="form-select w-full border rounded-md px-3 py-2"
                      id="searchType"
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
                  <div className="flex-1">
                    <label
                      htmlFor="searchValue"
                      className="block text-sm font-medium mb-1"
                    >
                      Valeur
                    </label>
                    <input
                      type="text"
                      className="form-input w-full border rounded-md px-3 py-2"
                      id="searchValue"
                      value={searchValue}
                      placeholder="Entrez la valeur"
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </div>
                  {/*}<div className="flex-1">
                     <button
                       type="submit"
                       className="bg-blue-500 text-white w-full px-3 py-2 rounded-md shadow hover:bg-blue-600"
                     >
                       Rechercher
                     </button>
                   </div>{*/}
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="w-full max-w-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex-1">
                    <label
                      htmlFor="region"
                      className="block text-sm font-medium mb-1"
                    >
                      Région
                    </label>
                    <select
                      className="form-select w-full border rounded-md px-3 py-2"
                      id="region"
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
                  {selectedRegion && (
                    <div className="flex-1">
                      <label
                        htmlFor="department"
                        className="block text-sm font-medium mb-1"
                      >
                        Département
                      </label>
                      <select
                        className="form-select w-full border rounded-md px-3 py-2"
                        id="department"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                      >
                        <option value="">Tous</option>
                        {filteredDepartements.map((department) => (
                          <option
                            key={department.id}
                            value={department.departement_code}
                          >
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex-1">
                    <label
                      htmlFor="genre"
                      className="block text-sm font-medium mb-1"
                    >
                      Genre
                    </label>
                    <select
                      className="form-select w-full border rounded-md px-3 py-2"
                      id="genre"
                      value={selectedGenre}
                      onChange={(e) => setSelectedGenre(e.target.value)}
                    >
                      <option value="">Tous</option>
                      {genres.map((genre) => (
                        <option key={genre.id} value={genre.name}>
                          {genre.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="adsType"
                      className="block text-sm font-medium mb-1"
                    >
                      Type d'ADS
                    </label>
                    <select
                      className="form-select w-full border rounded-md px-3 py-2"
                      id="adsType"
                      value={selectedAdsType}
                      onChange={(e) => setSelectedAdsType(e.target.value)}
                    >
                      <option value="">Tous</option>
                      {adsType.map((type) => (
                        <option key={type.id} value={type.name}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex-1">
                    <label
                      htmlFor="diploma"
                      className="block text-sm font-medium mb-1"
                    >
                      Diplôme
                    </label>
                    <select
                      className="form-select w-full border rounded-md px-3 py-2"
                      id="diploma"
                      value={selectedDiploma}
                      onChange={(e) => setSelectedDiploma(e.target.value)}
                    >
                      <option value="">Tous</option>
                      {diplomas.map((diploma) => (
                        <option key={diploma.id} value={diploma.name}>
                          {diploma.name}
                        </option>
                      ))}
                    </select>
                  </div>
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
            )}
          </div>
        </div>

        <div className="card mt-3">
          <div className="card-header">Résultats de la recherche</div>
          <div className="card-body">
            <table className="table mx-3 p-3">
              <thead>
                <tr>
                  <th scope="col">Nom</th>
                  <th scope="col">Prénom</th>
                  <th scope="col">Téléphone</th>
                  <th scope="col">Email</th>
                  <th scope="col">Actions</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.fullname}</td>
                    <td>{user.firstname}</td>
                    <td>0{user.phone}</td>
                    <td>{user.email}</td>
                    <td>
                      <div className="d-flex justify-content-start">
                        {/* Show Button - Opens the ShowGuardModal */}
                        <a
                          href="#"
                          className="btn btn-success btn-sm me-1"
                          onClick={() => handleShow(user)} // Trigger ShowGuardModal
                        >
                          <i className="bi bi-eye"></i> Show
                        </a>

                        {/* Edit Button - Opens the CreateEditGuardModal */}
                        <a
                          href="#"
                          className="btn btn-warning btn-sm me-1"
                          onClick={() => handleEdit(user)} // Trigger CreateEditGuardModal
                        >
                          <i className="bi bi-pencil-square"></i> Edit
                        </a>

                        {/* Delete Button - Calls handleDelete */}
                        <button
                          type="button"
                          className="btn btn-danger btn-sm me-1"
                          onClick={() => handleDelete(user.id)} // Trigger delete action
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </div>
                    </td>

                    <td>
                      <div className="d-flex justify-content-start">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            Inertia.get(
                              route("procards.create", { user_id: user.id })
                            )
                          }
                        >
                          <i className="bi bi-plus-circle"></i> Créer une Carte
                          Pro
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center">
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
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:w-[600px] md:w-[1000px] w-full max-h-[90vh] overflow-y-auto relative">
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
