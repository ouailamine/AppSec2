import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";

const ModalSite = ({ isOpen, onClose, initialData, customers }) => {
  console.log(customers);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    address: "",
    manager_name: "",
    email: "",
    phone: "",
    customer_id: "", // Add this for the customer selection
  });

  useEffect(() => {
    if (initialData && initialData.data) {
      console.log("Initializing formData with:", initialData.data);
      setFormData({
        id: initialData.data.id || null,
        name: initialData.data.name || "",
        address: initialData.data.address || "",
        manager_name: initialData.data.manager_name || "",
        email: initialData.data.email || "",
        phone: initialData.data.phone || "",
        customer_id: initialData.data.customer_id || "", // Set customer_id if it exists in initialData
      });
    } else {
      // Gestion de cas pour le type 'add'
      setFormData({
        id: null,
        name: "",
        address: "",
        manager_name: "",
        email: "",
        phone: "",
        customer_id: "", // Initialize customer_id as empty
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);

    if (formData.id) {
      // Mise à jour
      Inertia.put(`/sites/${formData.id}`, formData, {
        onSuccess: () => {
          onClose(); // Fermer le modal après une réussite
        },
        onError: (errors) => {
          console.error("Error saving data:", errors);
        },
      });
    } else {
      // Création
      Inertia.post("/sites", formData, {
        onSuccess: () => {
          onClose(); // Fermer le modal après une réussite
        },
        onError: (errors) => {
          console.error("Error saving data:", errors);
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          {formData.id ? "Modifier un site" : "Ajouter un site"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Client Select Dropdown */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="customer_id"
            >
              Client
            </label>
            <select
              id="customer_id"
              name="customer_id"
              value={formData.customer_id || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="">Sélectionner un client</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          {/* Nom */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="name"
            >
              Nom
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Adresse */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="address"
            >
              Adresse
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Nom du Manager */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="manager_name"
            >
              Nom du Manager
            </label>
            <input
              id="manager_name"
              name="manager_name"
              type="text"
              value={formData.manager_name || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* Téléphone */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="phone"
            >
              Téléphone
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {formData.id ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalSite;
