import React from "react";
import { usePage } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";

const UserInfo = () => {
  const { user, roles, diplomasUser, departements, regions, auth } = usePage().props;

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
    <AdminAuthenticatedLayout user={auth.user}>
      <div className="container mx-auto mt-4 px-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Information de l'agent</h2>
            <a href={route("users.index")} className="text-indigo-600 hover:text-indigo-900">
              &larr; Retour
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-md shadow-sm">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <th className="text-left p-2 font-medium">Nom manager</th>
                    <td className="p-2">Nom manager</td>
                  </tr>
                  <tr>
                    <th className="text-left p-2 font-medium">Rôles</th>
                    <td className="p-2">
                      {roles && roles.length > 0 ? (
                        roles.map((role, index) => (
                          <span key={index} className="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm mr-2">
                            {role}
                          </span>
                        ))
                      ) : (
                        <span>Aucun rôle</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th className="text-left p-2 font-medium">Nom</th>
                    <td className="p-2">{user.fullname}</td>
                  </tr>
                  <tr>
                    <th className="text-left p-2 font-medium">Prénom</th>
                    <td className="p-2">{user.firstname}</td>
                  </tr>
                  <tr>
                    <th className="text-left p-2 font-medium">Date de naissance</th>
                    <td className="p-2">{formatDate(user.date_of_birth)}</td>
                  </tr>
                  <tr>
                    <th className="text-left p-2 font-medium">Genre</th>
                    <td className="p-2">{user.genre}</td>
                  </tr>
                  <tr>
                    <th className="text-left p-2 font-medium">Email</th>
                    <td className="p-2">{user.email}</td>
                  </tr>
                  <tr>
                    <th className="text-left p-2 font-medium">Adresse</th>
                    <td className="p-2">{user.address}, {user.city}</td>
                  </tr>
                  <tr>
                    <th className="text-left p-2 font-medium">Département et Région</th>
                    <td className="p-2">
                      {getDepartmentName(user.departement)}, {getRegionName(user.region)}
                    </td>
                  </tr>
                  <tr>
                    <th className="text-left p-2 font-medium">Téléphone</th>
                    <td className="p-2">0{user.phone}</td>
                  </tr>
                  <tr>
                    <th className="text-left p-2 font-medium">Numéro sécurité sociale</th>
                    <td className="p-2">{user.social_security_number}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-gray-50 p-4 rounded-md shadow-sm">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <th className="text-left p-2 font-medium">Numéro carte professionnelle</th>
                    <td className="p-2">{user.professional_card_number}</td>
                  </tr>
                  <tr>
                    <th className="text-left p-2 font-medium">Type ADS</th>
                    <td className="p-2">{user.typeADS}</td>
                  </tr>
                  <tr>
                    <th className="text-left p-2 font-medium">Note</th>
                    <td className="p-2">{user.note}</td>
                  </tr>
                  <tr>
                    <th className="text-left p-2 font-medium">Matricule</th>
                    <td className="p-2">{user.registerNumber}</td>
                  </tr>
                  <tr>
                    <th className="text-left p-2 font-medium" colSpan="2">Diplômes</th>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <div className="bg-white p-4 rounded-md shadow-sm">
                        {diplomasUser.length > 0 ? (
                          <table className="w-full border-collapse">
                            <thead>
                              <tr>
                                <th className="text-left p-2 font-medium">Diplôme</th>
                                <th className="text-left p-2 font-medium">Date de Fin</th>
                              </tr>
                            </thead>
                            <tbody>
                              {diplomasUser.map((diploma, index) => (
                                <tr key={index}>
                                  <td className="p-2">{diploma.name}</td>
                                  <td className="p-2">{formatDate(diploma.end_date)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p>Aucun diplôme ajouté.</p>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminAuthenticatedLayout>
  );
};

export default UserInfo;
