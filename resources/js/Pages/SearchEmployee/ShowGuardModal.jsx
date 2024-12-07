import React from "react";

const ShowUserModal = ({ user, onClose, departements, regions }) => {
  const diplomas = user.diplomas ? JSON.parse(user.diplomas) : [];
  // Fonction pour récupérer le nom du département par son code
  function getDepartementName(departementCode) {
    const departement = departements.find(
      (d) => d.departement_code === departementCode
    );
    return departement ? departement.name : "Département inconnu";
  }

  // Fonction pour récupérer le nom de la région par son code
  function getRegionName(regionCode) {
    const region = regions.find((r) => r.region_code === regionCode);
    return region ? region.name : "Région inconnue";
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-6">Détails de l'Employé</h1>
        <form className="space-y-6">
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-xs bg-gray-100"
                  value={user.fullname}
                  readOnly
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-xs bg-gray-100"
                  value={user.firstname}
                  readOnly
                />
              </div>
              <div>
                <label
                  htmlFor="genre"
                  className="block text-xs font-medium text-gray-700"
                >
                  Genre
                </label>
                <input
                  type="text"
                  id="genre"
                  name="genre"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-xs bg-gray-100"
                  value={user.genre}
                  readOnly
                />
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-xs bg-gray-100"
                  value={user.date_of_birth}
                  readOnly
                />
              </div>
              <div>
                <label
                  htmlFor="nationality"
                  className="block text-xs font-medium text-gray-700"
                >
                  Nationalité
                </label>
                <input
                  type="text"
                  id="nationality"
                  name="nationality"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-xs bg-gray-100"
                  value={user.nationality}
                  readOnly
                />
              </div>
              <div>
                <label
                  htmlFor="Note"
                  className="block text-xs font-medium text-gray-700"
                >
                  Note
                </label>
                <input
                  type="text"
                  id="note"
                  name="note"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-xs bg-gray-100"
                  value={user.note}
                  readOnly
                />
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-xs bg-gray-100"
                  value={user.email}
                  readOnly
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-xs bg-gray-100"
                  value={user.phone}
                  readOnly
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-xs bg-gray-100"
                  value={user.address}
                  readOnly
                />
              </div>
              <div>
                <label
                  htmlFor="region"
                  className="block text-xs font-medium text-gray-700"
                >
                  Région
                </label>
                <input
                  type="text"
                  id="region"
                  name="region"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-xs bg-gray-100"
                  value={getRegionName(user.region)}
                  readOnly
                />
              </div>
              <div>
                <label
                  htmlFor="departement"
                  className="block text-xs font-medium text-gray-700"
                >
                  Département
                </label>
                <input
                  type="text"
                  id="departement"
                  name="departement"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-xs bg-gray-100"
                  value={getDepartementName(user.departement)}
                  readOnly
                />
              </div>
              <div>
                <label
                  htmlFor="city"
                  className="block text-xs font-medium text-gray-700"
                >
                  Ville
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-xs bg-gray-100"
                  value={user.city}
                  readOnly
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-xs bg-gray-100"
                  value={user.social_security_number}
                  readOnly
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-xs bg-gray-100"
                  value={user.professional_card_number}
                  readOnly
                />
              </div>
              <div>
                <label
                  htmlFor="typeAds"
                  className="block text-xs font-medium text-gray-700"
                >
                  Type d'Agent
                </label>
                <input
                  type="text"
                  id="typeAds"
                  name="typeAds"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-xs bg-gray-100"
                  value={user.typeADS}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Diplômes
                </label>
                <table className="min-w-full border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-2 py-1 border text-xs border-gray-300 text-left">
                        Nom
                      </th>
                      <th className="px-2 py-1 border text-xs border-gray-300 text-left">
                        Date de Fin
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {diplomas.length > 0 ? (
                      diplomas.map((diploma, index) => (
                        <tr key={index}>
                          <td className="px-2 py-1 border text-xs border-gray-300">
                            {diploma.name}
                          </td>
                          <td className="px-2 py-1 border text-xs border-gray-300">
                            {diploma.end_date}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="2"
                          className="px-4 py-2 border border-gray-300 text-center text-gray-500"
                        >
                          Aucun diplôme trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={onClose}
            >
              Fermer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShowUserModal;
