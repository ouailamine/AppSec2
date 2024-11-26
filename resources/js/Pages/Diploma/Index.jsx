import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PlusCircleIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline'; // Import Heroicons

const DiplomasIndex = ({ diplomas, flash = {} }) => {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDiploma, setCurrentDiploma] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    validity_months: "",
  });

  useEffect(() => {
    console.log("Flash Messages:", flash);
  }, [flash]);

  const handleDelete = (diplomaId) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce diplôme ?")) {
      Inertia.delete(route("diplomas.destroy", diplomaId));
    }
  };

  const handleShowModal = (diploma = null) => {
    if (diploma) {
      setEditMode(true);
      setCurrentDiploma(diploma);
      setFormData({
        name: diploma.name,
        validity_months: diploma.validity_months,
      });
    } else {
      setEditMode(false);
      setCurrentDiploma(null);
      setFormData({
        name: "",
        validity_months: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      Inertia.put(route("diplomas.update", currentDiploma.id), formData);
    } else {
      Inertia.post(route("diplomas.store"), formData);
    }
    handleCloseModal();
  };

  return (
    <AdminAuthenticatedLayout>
      <Head title="Gestion des Diplômes" />
      <div className="container mx-auto p-4">
        <div className="flex justify-center">
          <div className="w-full max-w-4xl bg-white shadow-md rounded-lg">
            <div className="p-4">
              {/* Affichage des messages flash */}
              {flash && (
                <>
                  {flash.success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-3">
                      {flash.success}
                    </div>
                  )}
                  {flash.error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-3">
                      {flash.error}
                    </div>
                  )}
                </>
              )}

              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 mb-3"
                onClick={() => handleShowModal()}
              >
                <PlusCircleIcon className="inline-block h-5 w-5 mr-2" />
                Ajouter
              </button>

              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-4 py-2">Numéro de Diplôme</th>
                    <th className="px-4 py-2">Nom</th>
                    <th className="px-4 py-2">Validité (mois)</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {diplomas.length > 0 ? (
                    diplomas.map((diploma, index) => (
                      <tr key={diploma.id} className="border-b border-gray-200">
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{diploma.name}</td>
                        <td className="px-4 py-2">{diploma.validity_months}</td>
                        <td className="px-4 py-2 flex space-x-2">
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            onClick={() => handleShowModal(diploma)}
                          >
                            <PencilSquareIcon className="inline-block h-5 w-5 mr-1" />
                            Modifier
                          </button>
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            onClick={() => handleDelete(diploma.id)}
                          >
                            <TrashIcon className="inline-block h-5 w-5 mr-1" />
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-red-500 py-4">
                        <strong>Aucun diplôme trouvé !</strong>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Composant Modal */}
              {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
                    <button
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                      onClick={handleCloseModal}
                    >
                      &times;
                    </button>
                    <h2 className="text-xl font-semibold mb-4">
                      {editMode ? "Modifier le Diplôme" : "Ajouter un Nouveau Diplôme"}
                    </h2>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="name">
                          Nom du Diplôme
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          placeholder="Entrez le nom du diplôme"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="validity_months">
                          Validité (mois)
                        </label>
                        <input
                          type="number"
                          id="validity_months"
                          name="validity_months"
                          placeholder="Entrez la durée de validité en mois"
                          value={formData.validity_months}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        {editMode ? "Mettre à Jour" : "Enregistrer"}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminAuthenticatedLayout>
  );
};

export default DiplomasIndex;
