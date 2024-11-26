import React from "react";
import { usePage } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";

const GuardInfo = () => {
  const { guard, diplomasGuard, auth, departements, regions } = usePage().props;

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };
  const getRegionName = (code) => {
    const region = regions.find((r) => r.region_code === code);
    return region ? region.name : "";
  };

  const getDepartmentName = (code) => {
    const department = departements.find((d) => d.departement_code === code);
    return department ? department.name : "";
  };
  return (
    <AdminAuthenticatedLayout guard={auth.guard}>
      <div className="container mt-4">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Information de l'agent</h5>
            <a href={route("guard.index")} className="btn btn-primary btn-sm">
              &larr; Retour
            </a>
          </div>
          <div className="card-body">
            <div className="row mb-4">
              <div className="col-md-6">
                <table className="table table-striped">
                  <tbody>
                    <tr>
                      <th scope="row">Nom manager</th>
                      <td>Nom manager</td>
                    </tr>
                    <tr>
                      <th scope="row">Nom</th>
                      <td>{guard.fullname}</td>
                    </tr>
                    <tr>
                      <th scope="row">Prénom</th>
                      <td>{guard.firstname}</td>
                    </tr>
                    <tr>
                      <th scope="row">Date de naissance</th>
                      <td>{formatDate(guard.date_of_birth)}</td>
                    </tr>
                    <tr>
                      <th scope="row">Genre</th>
                      <td>{guard.genre}</td>
                    </tr>
                    <tr>
                      <th scope="row">Email</th>
                      <td>{guard.email}</td>
                    </tr>
                    <tr>
                      <th scope="row">Nationalité</th>
                      <td>{guard.nationality}</td>
                    </tr>
                    <tr>
                      <th scope="row">Adresse</th>
                      <td>
                        {guard.address}, {guard.city}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Département et Région</th>
                      <td>
                        {getDepartmentName(guard.departement)},{" "}
                        {getRegionName(guard.region)}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Téléphone</th>
                      <td>{guard.phone}</td>
                    </tr>
                    <tr>
                      <th scope="row">Numéro sécurité sociale</th>
                      <td>{guard.social_security_number}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-md-6">
                <table className="table table-striped">
                  <tbody>
                    <tr>
                      <th scope="row">Numéro carte professionnelle</th>
                      <td>{guard.professional_card_number}</td>
                    </tr>
                    <tr>
                      <th scope="row">Type ADS</th>
                      <td>{guard.typeADS}</td>
                    </tr>
                    <tr>
                      <th colSpan="2" className="text-center">
                        Diplômes
                      </th>
                    </tr>
                    {diplomasGuard && diplomasGuard.length > 0 ? (
                      diplomasGuard.map((diploma, index) => (
                        <tr key={index}>
                          <td>{diploma.name}</td>
                          <td>{formatDate(diploma.end_date)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="text-center">
                          Pas de diplôme
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminAuthenticatedLayout>
  );
};

export default GuardInfo;
