import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import TypeAdModal from "./AddEditTypeAdsModal"; // Import the TypeAdModal component

const TypeAdsIndex = ({ typeAds, flash = {} }) => {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTypeAd, setCurrentTypeAd] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    console.log("Flash Messages:", flash);
    console.log("Type Ads:", typeAds);
  }, [flash, typeAds]);

  const handleDelete = (typeAdId) => {
    if (window.confirm("Voulez-vous supprimer ce type de publicité ?")) {
      Inertia.delete(route("typeAds.destroy", typeAdId));
    }
  };

  const handleShowModal = (typeAd = null) => {
    if (typeAd) {
      setEditMode(true);
      setCurrentTypeAd(typeAd);
      setFormData({ name: typeAd.name });
    } else {
      setEditMode(false);
      setCurrentTypeAd(null);
      setFormData({ name: "" });
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
      Inertia.put(route("typeAds.update", currentTypeAd.id), formData);
    } else {
      Inertia.post(route("typeAds.store"), formData);
    }
    handleCloseModal();
  };

  return (
    <AdminAuthenticatedLayout>
      <Head title="Gestion des Types de Publicités" />
      <div className="container mx-auto mt-4 p-4">
        {/* Flash messages */}
        {flash.success && (
          <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
            {flash.success}
          </div>
        )}
        {flash.error && (
          <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
            {flash.error}
          </div>
        )}

        <button
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
          onClick={() => handleShowModal(null)}
        >
          <PlusCircleIcon className="w-6 h-6 mr-2" />
          Ajouter un Type d'agent
        </button>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Type No.</th>
                <th className="py-3 px-4 text-left">Nom</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {typeAds.length > 0 ? (
                typeAds.map((typeAd, index) => (
                  <tr key={typeAd.id} className="border-b">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{typeAd.name}</td>
                    <td className="py-3 px-4 flex space-x-2">
                      <button
                        className="text-blue-500 hover:text-blue-600"
                        onClick={() => handleShowModal(typeAd)}
                      >
                        <PencilSquareIcon className="w-6 h-6" />
                      </button>
                      {typeAd.name !== "DefaultTypeAd" && (
                        <button
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(typeAd.id)}
                        >
                          <TrashIcon className="w-6 h-6" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-red-500">
                    <strong>Aucun Type de Publicité Trouvé !</strong>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Component */}
        <TypeAdModal
          showModal={showModal}
          handleCloseModal={handleCloseModal}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          formData={formData}
          editMode={editMode}
        />
      </div>
    </AdminAuthenticatedLayout>
  );
};

export default TypeAdsIndex;
