import React from 'react';

const CustomerProfile = ({ customer, onEditCustomer, onEditSite }) => {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-r from-blue-50 to-white shadow-xl rounded-lg">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">Profil du Client</h1>
      
      {/* Informations du Client */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Informations du Client</h2>
        <div className="space-y-3">
          <p className="text-gray-700"><strong>Nom :</strong> {customer.name}</p>
          <p className="text-gray-700"><strong>Email :</strong> {customer.email}</p>
          <p className="text-gray-700"><strong>Téléphone :</strong> {customer.phone}</p>
          <p className="text-gray-700"><strong>Adresse :</strong> {customer.address}</p>
          <p className="text-gray-700"><strong>Gestionnaire :</strong> {customer.manager_name}</p>
        </div>
        <button
          onClick={onEditCustomer}
          className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-300"
        >
          Modifier les informations du client
        </button>
      </div>

      {/* Sites Associés */}
      <div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Sites Associés</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {customer.sites.map((site) => (
            <div
              key={site.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-t-4 border-blue-600"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{site.name}</h3>
              <p className="text-gray-700"><strong>Adresse :</strong> {site.address}</p>
              <p className="text-gray-700"><strong>Email :</strong> {site.email}</p>
              <p className="text-gray-700"><strong>Téléphone :</strong> {site.phone}</p>
              <p className="text-gray-700"><strong>Date de création :</strong> {new Date(site.created_at).toLocaleDateString()}</p>
              <p className="text-gray-700"><strong>Date de mise à jour :</strong> {new Date(site.updated_at).toLocaleDateString()}</p>
              <button
                onClick={() => onEditSite(site.id)}
                className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg transition duration-300 w-full"
              >
                Afficher & Modifier
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
