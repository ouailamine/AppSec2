import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Head, usePage } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import CreateEditGuardModal from "./CreateEditGuardModal";
import ShowGuardModal from "./ShowGuardModal";
import SectionSearch from "./SectionSearch2";

const Home = ({
  users,
  guards,
  departements,
  regions,
  diplomas,
  genres,
  roles,
  auth,
  nationalities,
  typeAds,
  cities,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [usersOrGuards, setusersOrGuards] = useState(users);
  const [showModal, setShowModal] = useState(false);
  const [createEditModal, setCreateEditModal] = useState(false);
  const [isAgentSearchOpen, setIsAgentSearchOpen] = useState(false);
  const [isResultSearch, setIsResultSearch] = useState(false);
  const [campanyGuard, setCampanyGuard] = useState("Atalix");

  console.log(usersOrGuards);

  const handleSearch = (data) => {

    setIsResultSearch(true)
    console.log(data);
    if (data.searchType === "simple") {
      const filteredUsers = usersOrGuards.filter((user) => {
        // Check if the search value matches the selected attribute
        const searchValue = data.searchValue.toLowerCase();
        switch (data.searchAttribute) {
          case "fullname":
            return user.fullname.toLowerCase().includes(searchValue);
          case "phone":
            return user.phone.toString().includes(searchValue);
          case "email":
            return user.email.toLowerCase().includes(searchValue);
          case "professional_card_number":
            return user.professional_card_number.includes(searchValue);
          case "social_security_number":
            return user.social_security_number.toString().includes(searchValue);
          default:
            return false;
        }
      });

      console.log(filteredUsers);
      setusersOrGuards(filteredUsers);
    } else if (data.searchType === "Multiple") {
      const filteredUsers = usersOrGuards.filter((user) => {
        // Check the selected department
        if (
          data.selectedDepartment &&
          data.selectedDepartment !== "" &&
          user.departement !== data.selectedDepartment
        ) {
          return false;
        }

        // Check the selected region
        if (
          data.selectedRegion &&
          data.selectedRegion !== "" &&
          user.region !== data.selectedRegion
        ) {
          return false;
        }

        // Check the selected gender
        if (
          data.selectedGender &&
          data.selectedGender !== "" &&
          user.genre !== data.selectedGender
        ) {
          return false;
        }

        // Check the selected agent type
        if (
          data.selectedAgentType &&
          data.selectedAgentType !== "" &&
          user.typeADS !== data.selectedAgentType
        ) {
          return false;
        }

        if (data.selectedDiplomas && data.selectedDiplomas.length > 0) {
          let userDiplomas = [];
          try {
            // S'assurer que user.diplomas est un JSON valide avant de le parser
            userDiplomas = user.diplomas ? JSON.parse(user.diplomas) : [];
          } catch (e) {
            console.error(
              "Erreur lors du parsing des diplômes pour l'utilisateur :",
              user.id,
              e
            );
            userDiplomas = [];
          }

          // Vérifier si l'utilisateur a tous les diplômes sélectionnés
          const hasAllSelectedDiplomas = data.selectedDiplomas.every(
            (selectedDiploma) => {
              return userDiplomas.some(
                (diploma) => diploma.name === selectedDiploma
              );
            }
          );

          if (!hasAllSelectedDiplomas) {
            return false;
          }
        }

        return true; // Return the user if all conditions match
      });

      console.log(filteredUsers);
      setusersOrGuards(filteredUsers);
    }
    console.log(data);
  };

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
    setusersOrGuards(users);
    console.log(usersOrGuards);
  };

  const handleOtherGuard = () => {
    setusersOrGuards(guards);
    setCampanyGuard("Non Atalix")
    console.log(usersOrGuards);
  };

  const handleInitUsers = () => {
    setusersOrGuards(users);
    setIsResultSearch(false);
    setCampanyGuard("Atalix")
  };
  return (
    <AdminAuthenticatedLayout user={auth.user}>
      <Head title="DashboardAdmin" />
      <div className="container mt-4 h-full">
        <div className="flex flex-col items-center space-y-6 mb-4">
          {/* Bouton Ajouter un nouveau agent */}
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

          {/* Section avec les autres boutons */}
          <div className="flex space-x-4">
            <div className="flex space-x-4">
              <button
                onClick={handleAtalixGuard}
                className="
      flex items-center bg-blue-500 text-white px-4 py-2 
      rounded-md shadow-md text-xs font-medium 
      hover:bg-blue-600 hover:shadow-lg 
      focus:outline-none focus:ring-2 focus:ring-blue-300 
      active:bg-blue-700 
      transition-all duration-200 ease-in-out
    "
              >
                <img
                  src="assets/img/logo-atalix.png"
                  className="w-6 h-6 mr-2 bg-white rounded-full"
                  alt="Atalix Logo"
                />
                <span>Atalix Agents</span>
              </button>
              <button
                onClick={handleOtherGuard}
                className="
      flex items-center bg-blue-500 text-white px-4 py-2 
      rounded-md shadow-md text-xs font-medium 
      hover:bg-blue-600 hover:shadow-lg 
      focus:outline-none focus:ring-2 focus:ring-blue-300 
      active:bg-blue-700 
      transition-all duration-200 ease-in-out
    "
              >
                <img
                  src="assets/img/avatar.png"
                  className="w-6 h-6 mr-2 bg-white rounded-full"
                  alt="Other Logo"
                />
                <span>Autres agents</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6">
          <div className="border border-gray-300 rounded-xl shadow-lg overflow-hidden">
            <button
              type="button"
              className="w-full bg-blue-700 text-white flex justify-between items-center px-4 py-2 font-semibold text-lg   focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              onClick={() => setIsAgentSearchOpen(!isAgentSearchOpen)}
            >
              <span>Recherche d'agents</span>

              <svg
                className={`w-8 h-8 transition-transform duration-300 ${
                  isAgentSearchOpen ? "transform rotate-180" : ""
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
            </button>

            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isAgentSearchOpen ? "max-full" : "max-h-0"
              }`}
            >
              <SectionSearch
                regions={regions}
                departements={departements}
                diplomas={diplomas}
                genres={genres}
                typeAds={typeAds}
                onSearch={handleSearch}
                onInitUser={handleInitUsers}
              />
            </div>
          </div>
        </div>

        <div className="card mt-6 bg-white shadow-lg rounded-lg mb-10">
          <div className="card-header bg-gray-100 px-6 py-3 border-b border-gray-200 text-lg font-semibold">
            {!isResultSearch
              ? `Liste des agents ${campanyGuard}`
              : `Résultats de la recherche des agents ${campanyGuard}`}
          </div>
          <div className="card-body px-6 py-4">
            <table className="table-auto w-full text-left text-xs">
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
                {usersOrGuards.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-2 py-2">{user.fullname}</td>
                    <td className="px-2 py-2">{user.firstname}</td>
                    <td className="px-2 py-2">0{user.phone}</td>
                    <td className="px-2 py-2">{user.email}</td>
                    <td className="px-2 py-2">
                      <div className="flex space-x-2">
                        {/* Show Button */}
                        <button
                          className="bg-green-500 text-white px-2 py-1 rounded-md text-xs flex items-center hover:bg-green-600"
                          onClick={() => handleShow(user)}
                        >
                          <i className="bi bi-eye mr-1"></i> Voir
                        </button>
                        {/* Edit Button */}
                        <button
                          className="bg-yellow-500 text-white px-2 py-1 rounded-md text-xs flex items-center hover:bg-yellow-600"
                          onClick={() => handleEdit(user)}
                        >
                          <i className="bi bi-pencil-square mr-1"></i> Modifier
                        </button>
                        {/* Delete Button */}
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded-md text-xs flex items-center hover:bg-red-600"
                          onClick={() => handleDelete(user.id)}
                        >
                          <i className="bi bi-trash mr-1"></i> Supprimer
                        </button>
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs flex items-center hover:bg-blue-600"
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
                {usersOrGuards.length === 0 && (
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
