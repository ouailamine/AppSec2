import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import ModalEditAddCustomer from "./ModalEditAddCustomer";
import ModalCustomerInfo from "./ModalCustomerInfo";
import ModalAddSitesToCustomer from "./ModalAddSitesToCustomer";

import { Inertia } from "@inertiajs/inertia";
import {
  PlusIcon,
  InformationCircleIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const Index = ({ customers = [], flash = {}, sites = [] }) => {
  const [search, setSearch] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [modals, setModals] = useState({
    Customer: false,
    site: false,
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

  const filteredCustomers = customers.filter((customer) =>
    [customer.name, customer.manager_name, customer.email, customer.phone]
      .filter(Boolean) // Avoid undefined/null values in fields
      .some((field) => field.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = (customerId) => {
    if (window.confirm("Voulez-vous supprimer ce client ?")) {
      Inertia.delete(`/customers/${customerId}`, { preserveState: true });
    }
  };

  const toggleModal = (type, data = null) => {
    setModalData((prev) => ({
      ...prev,
      type,
      initialData: type === "Customer" && data ? data : prev.initialData,
      infoData: type === "info" && data ? data : prev.infoData,
    }));
    setModals((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSaveCustomer = (formData) => {
    if (modalData.type === "add") {
      Inertia.post("/customers", formData);
    } else if (modalData.type === "edit") {
      Inertia.put(`/customers/${formData.id}`, formData);
    }
    toggleModal("Customer");
  };

  return (
    <AdminAuthenticatedLayout>
      <Head title="Clients" />
      <div className="container mx-auto p-6 space-y-6">
        {showAlert && (flash.success || flash.error) && (
          <div
            className={`p-4 mb-4 text-white ${flash.success ? "bg-green-600" : "bg-red-600"} rounded`}
            role="alert"
          >
            {flash.success || flash.error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-800">Clients</h1>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <button
              className="bg-green-600 text-white hover:bg-green-700 px-6 py-2 rounded-lg flex items-center space-x-2"
              onClick={() => toggleModal("Customer", { type: "add" })}
              aria-label="Add Customer"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Ajouter un Client</span>
            </button>
            <button
              className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-lg flex items-center space-x-2"
              onClick={() => toggleModal("site")}
              aria-label="Manage Sites"
            >
              <InformationCircleIcon className="h-5 w-5" />
              <span>Gérer les sites associés</span>
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
            />
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Nom</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Téléphone</th>
                <th className="px-6 py-3 text-center text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{customer.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{customer.phone}</td>
                    <td className="px-6 py-4 text-sm text-center">
                      <div className="flex justify-center space-x-3">
                        <button
                          className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2"
                          onClick={() => toggleModal("info", customer)}
                          aria-label="Show Info"
                        >
                          <InformationCircleIcon className="h-5 w-5" />
                          <span>Afficher</span>
                        </button>
                        <button
                          className="bg-gray-600 text-white hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2"
                          onClick={() =>
                            toggleModal("Customer", { type: "edit", data: customer })
                          }
                          aria-label="Edit Customer"
                        >
                          <PencilIcon className="h-5 w-5" />
                          <span>Éditer</span>
                        </button>
                        <button
                          className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg flex items-center space-x-2"
                          onClick={() => handleDelete(customer.id)}
                          aria-label="Delete Customer"
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
                  <td colSpan="4" className="px-6 py-4 text-center text-red-500">
                    Aucun client trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modals.Customer && (
        <ModalEditAddCustomer
          isOpen={modals.Customer}
          onClose={() => toggleModal("Customer")}
          onSave={handleSaveCustomer}
          initialData={modalData.initialData}
        />
      )}
      {modals.site && (
        <ModalAddSitesToCustomer
          isOpen={modals.site}
          sites={sites}
          customers={customers}
          onClose={() => toggleModal("site")}
        />
      )}
      {modals.info && (
        <ModalCustomerInfo
          isOpen={modals.info}
          onClose={() => toggleModal("info")}
          customer={modalData.infoData}
        />
      )}
    </AdminAuthenticatedLayout>
  );
};

export default Index;
