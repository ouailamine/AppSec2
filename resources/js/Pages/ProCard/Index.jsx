import React, { useState } from "react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Link } from "@inertiajs/react";

const formatDate = (dateString) => {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};

const DashboardAdmin = ({ user, filteredUsers,filteredUsersCount }) => {
  console.log(filteredUsersCount)
  const [openUser, setOpenUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleClick = (user) => {
    if (openUser && openUser.fullname === user.fullname) {
      setOpenUser(null);
    } else {
      setOpenUser(user);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredAndSearchedUsers = filteredUsers.filter((user) =>
    user.fullname.toLowerCase().includes(searchQuery)
  );

  return (
    <AdminAuthenticatedLayout user={user}>
      <Head>
        <title>Tableau de bord Administrateur</title>
      </Head>
      <div className="container mx-auto mt-6 p-2">
        {/* Bouton de création */}
        <div className="mb-6 flex justify-center">
          <Link
            href={route("procards.create")} // Utilisez la fonction route pour générer l'URL
            className="inline-flex items-center px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md text-lg font-semibold"
          >
            Créer une carte professionnelle
          </Link>
        </div>

        {/* Barre de recherche */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Rechercher un utilisateur par nom"
            className="px-4 py-2 border border-gray-300 rounded-lg w-1/2"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Liste des agents de sécurité dont la carte professionnelle expire dans
          6 mois
        </h2>

        <div className="space-y-4 px-12">
          {filteredAndSearchedUsers && filteredAndSearchedUsers.length > 0 ? (
            filteredAndSearchedUsers.map((user, index) => (
              <div key={index} className="border rounded-lg shadow-md">
                <button
                  className="block w-full text-left px-4 py-2 text-lg font-semibold text-blue-600 hover:bg-blue-100 focus:outline-none"
                  onClick={() => handleClick(user)}
                >
                  {user.fullname} {user.firstname}
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openUser && openUser.fullname === user.fullname
                      ? "max-h-screen p-4"
                      : "max-h-0"
                  }`}
                >
                  <div className="border border-gray-100 rounded-lg shadow-sm">
                    <div className="p-4">
                      {user.diplomas && user.diplomas.length > 0 ? (
                        <table className="min-w-full w-1/2 mx-auto bg-white divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Diplôme
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Date de fin
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {user.diplomas.map((diploma, index) => (
                              <tr
                                key={index}
                                className={
                                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                }
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {diploma.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(diploma.end_date)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-gray-500">
                          Aucun diplôme disponible.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Aucun utilisateur trouvé.</p>
          )}
        </div>
      </div>
    </AdminAuthenticatedLayout>
  );
};

export default DashboardAdmin;
