import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import ModalSite from "./ModalSite";
import ModalUser from "./ModalUsers";
import ModalSiteInfo from "./ModalSiteInfo";
import { Inertia } from "@inertiajs/inertia";
import {
  PlusIcon,
  UserGroupIcon,
  InformationCircleIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const Index = ({ sites, users, flash = {},customers }) => {
  console.log(customers)

  console.log(sites)
  const [search, setSearch] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [modals, setModals] = useState({
    site: false,
    user: false,
    info: false,
  });
  const [modalData, setModalData] = useState({
    type: "", // 'add' or 'edit'
    initialData: null,
    infoData: null,
  });

  useEffect(() => {
    if (flash.success || flash.error) {
      setShowAlert(true);
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  const filteredSites = sites.filter((site) =>
    [site.name, site.manager_name, site.email, site.phone].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleDelete = (siteId) => {
    if (window.confirm("Voulez-vous supprimer ce site ?")) {
      Inertia.delete(`/sites/${siteId}`, { preserveState: true });
    }
  };

  const toggleModal = (type, data = null) => {
    console.log(`Opening ${type} modal with data:`, data);
    setModalData((prev) => ({
      ...prev,
      type,
      initialData: type === "site" ? data : prev.initialData,
      infoData: type === "info" ? data : prev.infoData,
    }));
    setModals((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSaveSite = (formData) => {
    if (modalData.type === "add") {
      Inertia.post("/sites", formData);
    } else if (modalData.type === "edit") {
      Inertia.put(`/sites/${formData.id}`, formData);
    }
    toggleModal("site");
  };

  const handleSaveUsers = (data) => {
    console.log("Selected Site ID: ", data.siteId);
    console.log("Selected Users: ", data.users);
    toggleModal("user");
  };

  return (
    <AdminAuthenticatedLayout>
      <Head title="Sites" />
      <div className="container mx-auto p-4">
        {showAlert && (flash.success || flash.error) && (
          <div
            className={`p-4 mb-4 text-white ${
              flash.success ? "bg-green-500" : "bg-red-500"
            } rounded`}
            role="alert"
          >
            {flash.success || flash.error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between mb-4">
          <h1 className="text-2xl font-bold">Sites</h1>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded flex items-center space-x-2"
              onClick={() => toggleModal("site", { type: "add" })}
            >
              <PlusIcon className="h-5 w-5" />
              <span>Ajouter un site</span>
            </button>
            <button
              className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded flex items-center space-x-2"
              onClick={() => toggleModal("user")}
            >
              <UserGroupIcon className="h-5 w-5" />
              <span>Gérer les agents Associés</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center mb-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded pr-10"
            />
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 divide-y divide-gray-200">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Nom</th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSites.length > 0 ? (
                filteredSites.map((site) => (
                  <tr key={site.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {site.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {site.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {site.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          className="bg-blue-500 text-white hover:bg-blue-600 px-2 py-1 rounded flex items-center space-x-1"
                          onClick={() => toggleModal("info", site)}
                        >
                          <InformationCircleIcon className="h-5 w-5" />
                          <span>Afficher</span>
                        </button>
                        <button
                          className="bg-gray-500 text-white hover:bg-gray-600 px-2 py-1 rounded flex items-center space-x-1"
                          onClick={() =>
                            toggleModal("site", { type: "edit", data: site })
                          }
                        >
                          <PencilIcon className="h-5 w-5" />
                          <span>Éditer</span>
                        </button>
                        <button
                          className="bg-red-500 text-white hover:bg-red-600 px-2 py-1 rounded flex items-center space-x-1"
                          onClick={() => handleDelete(site.id)}
                        >
                          <TrashIcon className="h-5 w-5" />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-red-500"
                  >
                    Aucun site trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modals.site && (
        <ModalSite
          isOpen={modals.site}
          onClose={() => toggleModal("site")}
          onSave={handleSaveSite}
          initialData={modalData.initialData}
          customers={customers}
        />
      )}

      {modals.user && (
        <ModalUser
          isOpen={modals.user}
          onClose={() => toggleModal("user")}
          onSave={handleSaveUsers}
          sites={sites}
          users={users}
        />
      )}

      {modals.info && (
        <ModalSiteInfo
          isOpen={modals.info}
          onClose={() => toggleModal("info")}
          site={modalData.infoData}
        />
      )}
    </AdminAuthenticatedLayout>
  );
};

export default Index;
