import { Inertia } from "@inertiajs/inertia";
import React, { useState, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";

import { Button, Alert } from "react-bootstrap";

export default function SearchGuards({ guard, csrfToken }) {
  const { props } = usePage();
  const {
    auth = {},
    guards = [],
    regions = [],
    departements = [],
    diplomas = [],
    genres = [],
    adsType = [],
  } = props;

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

  useEffect(() => {
    if (selectedRegion) {
      setFilteredDepartements(
        departements.filter((dep) => dep.region_code === selectedRegion)
      );
      setSelectedDepartment("");
    } else {
      setFilteredDepartements([]);
    }
  }, [selectedRegion]);

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
  const filteredguards = guards.filter((guard) => {
    const value = searchValue.toLowerCase();

    let matchesSearchType = true;
    if (searchType && searchValue) {
      switch (searchType) {
        case "fullname":
          matchesSearchType = guard.fullname.toLowerCase().includes(value);
          break;
        case "firstname":
          matchesSearchType = guard.firstname.toLowerCase().includes(value);
          break;
        case "email":
          matchesSearchType = guard.email.toLowerCase().includes(value);
          break;
        case "phone":
          matchesSearchType = guard.phone
            .toString()
            .toLowerCase()
            .includes(value);
          break;
        case "city":
          matchesSearchType = guard.city.toLowerCase().includes(value);
          break;
        case "ssn":
          matchesSearchType = guard.ssn
            .toString()
            .toLowerCase()
            .includes(value);
          break;
        default:
          matchesSearchType = true;
      }
    }

    const matchesRegion = selectedRegion
      ? guard.region === selectedRegion
      : true;
    const matchesDepartment = selectedDepartment
      ? guard.departement === selectedDepartment
      : true;
    const matchesGenre = selectedGenre ? guard.genre === selectedGenre : true;
    const matchesAdsType = selectedAdsType
      ? guard.typeADS === selectedAdsType
      : true;
    const matchesDiploma = selectedDiploma
      ? JSON.parse(guard.diplomas).some(
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

  const handleCreateUser = (guard) => async (e) => {
    e.preventDefault();
    console.log("Guard", guard);

    try {
      await Inertia.post(route("CreateUser", { guard }));
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Vous allez supprimer cet agent?")) {
      Inertia.delete(`/guards/${id}`);
    }
  };

  return (
    <AdminAuthenticatedLayout guard={auth.guard}>
      <Head title="DashboardAdmin" />

      <div className="container mt-4">
        <div className="card">
          <div className="card-header">Recherche d'utilisateurs</div>
          <div className="card-body d-flex justify-content-center align-items-center flex-column">
            <div className="d-flex mb-3">
              <button
                className="btn btn-secondary me-2"
                onClick={() => handleModeChange("simple")}
              >
                Recherche Simple
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleModeChange("multiple")}
              >
                Recherche Multiple
              </button>
            </div>
            {searchMode === "simple" ? (
              <form onSubmit={handleSubmit} className="w-100">
                <div className="row mb-3">
                  <div className="col-md-6 offset-md-3">
                    <label htmlFor="searchType" className="form-label">
                      Type de recherche
                    </label>
                    <select
                      className="form-select"
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
                    <input
                      type="text"
                      className="form-control mt-2"
                      id="searchValue"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary">
                    Rechercher
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="w-100">
                <div className="row mb-3">
                  <div className="col-md-6 offset-md-3">
                    <label htmlFor="region" className="form-label">
                      Région
                    </label>
                    <select
                      className="form-select"
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

                    {selectedRegion && (
                      <>
                        <label htmlFor="department" className="form-label mt-2">
                          Département
                        </label>
                        <select
                          className="form-select"
                          id="department"
                          value={selectedDepartment}
                          onChange={(e) =>
                            setSelectedDepartment(e.target.value)
                          }
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
                      </>
                    )}

                    <label htmlFor="genre" className="form-label mt-2">
                      Genre
                    </label>
                    <select
                      className="form-select"
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

                    <label htmlFor="adsType" className="form-label mt-2">
                      Type d'ADS
                    </label>
                    <select
                      className="form-select"
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

                    <label htmlFor="diploma" className="form-label mt-2">
                      Diplôme
                    </label>
                    <select
                      className="form-select"
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
                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary">
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
                {filteredguards.map((guard) => (
                  <tr key={guard.id}>
                    <td>{guard.fullname}</td>
                    <td>{guard.firstname}</td>
                    <td>0{guard.phone}</td>
                    <td>{guard.email}</td>
                    <td>
                      <div className="d-flex justify-content-start">
                        <a
                          href={`/guards/${guard.id}`}
                          className="btn btn-success btn-sm me-1"
                        >
                          <i className="bi bi-eye"></i> Show
                        </a>

                        <a
                          href={`/guards/${guard.id}/edit`}
                          className="btn btn-warning btn-sm me-1"
                        >
                          <i className="bi bi-pencil-square"></i> Edit
                        </a>

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={handleDelete}
                        >
                          <i className="bi bi-trash"></i> Delete
                        </Button>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex justify-content-start">
                        <form onSubmit={handleCreateUser(guard)}>
                          <button
                            type="submit"
                            className="btn btn-primary btn-sm"
                          >
                            <i className="bi bi-plus-circle"></i> Créer un
                            Compte
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredguards.length === 0 && (
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
    </AdminAuthenticatedLayout>
  );
}
