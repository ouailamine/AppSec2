import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Inertia } from "@inertiajs/inertia";

const ModalSite = ({ isOpen, onClose, sites, customers }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedSites, setSelectedSites] = useState([]);
  const [customerSites, setCustomerSites] = useState([]);

  if (!isOpen) return null;

  // Options for react-select
  const siteOptions = sites.map((site) => ({ value: site.id, label: site.name }));
  const customerOptions = customers.map((customer) => ({
    value: customer.id,
    label: customer.name,
  }));

  // Fetch sites associated with the selected customer
  useEffect(() => {
    if (selectedCustomer) {
      const customerId = selectedCustomer.value;
      const sitesForCustomer = sites.filter((site) => site.customer_id === customerId);
      setCustomerSites(sitesForCustomer);

      // Set the selected sites based on the customer's existing associations
      const selectedSites = sitesForCustomer.map((site) => ({
        value: site.id,
        label: site.name,
      }));
      console.log("Selected Sites (from customer):", selectedSites);  // Log for debugging
      setSelectedSites(selectedSites);
    } else {
      setCustomerSites([]);
      setSelectedSites([]);
    }
  }, [selectedCustomer, sites]);

  console.log(customerSites)
  // Handle adding sites to the customer
  const handleAddSites = () => {
    const customerId = selectedCustomer.value ;
    const siteIds = selectedSites.map((site) => site.value);

    console.log("Customer ID:", customerId);
    console.log("Selected Site IDs:", siteIds);
    // Send the data to the server
    Inertia.put(
      `/client/${customerId}/sites`,
      { customerSites: siteIds },
      {
        onSuccess: () => {
          onClose(); // Close modal on success
        },
        onError: (errors) => {
          console.error("Failed to update sites:", errors);
        },
      }
    );
  };

  const handleSiteChange = (selectedOptions) => {
    // Log to verify what the selected sites are
    console.log("Updated selectedSites:", selectedOptions);
    setSelectedSites(selectedOptions || []);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-1/2">
        <h2 className="text-lg font-bold mb-4">Gérer les sites</h2>

        {/* Select for customer */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sélectionnez un client :</label>
          <Select
            options={customerOptions}
            placeholder="Choisir un client"
            value={selectedCustomer}
            onChange={setSelectedCustomer} // Update state on customer selection
          />
        </div>

        {/* Multi-select for sites */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sélectionnez les sites :</label>
          <Select
            options={siteOptions}
            isMulti
            placeholder="Choisir des sites"
            value={selectedSites}
            onChange={handleSiteChange} // Update state on site selection
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={handleAddSites}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Ajouter
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSite;
