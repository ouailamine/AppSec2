import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Inertia } from "@inertiajs/inertia";

const ModalUser = ({ isOpen, onClose, onSave, sites, users, selected }) => {
  console.log(sites);
  console.log(users);
  console.log(selected);
  const [selectedSite, setSelectedSite] = useState(selected);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [siteUsers, setSiteUsers] = useState([]);

  useEffect(() => {
    // Réinitialiser les valeurs lorsque le modal est ouvert
    setSelectedSite(selected);
    setSelectedUsers([]);
    setSiteUsers([]);
  }, [isOpen]);

  useEffect(() => {
    if (selectedSite) {
      const site = sites.find((site) => site.id === selectedSite.value);
      if (site) {
        console.log("Site trouvé:", site);
        // Vérifiez si site.users est bien un tableau
        if (Array.isArray(site.users)) {
          setSiteUsers(site.users);
          setSelectedUsers(
            site.users.map((user) => ({
              value: user.id,
              label: user.fullname,
            }))
          );
        } else {
          console.warn("site.users n'est pas un tableau", site.users);
          setSiteUsers([]);
        }
      }
    }
  }, [selectedSite, sites]);

  const handleSiteChange = (selectedOption) => {
    console.log("Site selected:", selectedOption);
    setSelectedSite(selectedOption);
  };

  const handleUserChange = (selectedOptions) => {
    console.log("Users selected:", selectedOptions);
    setSelectedUsers(selectedOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSite) {
      const userIds = selectedUsers.map((user) => user.value);
      const response = "to planning";
      console.log("Envoi des données:", {
        siteId: selectedSite.value,
        users: userIds,
      });
      Inertia.put(
        `/sites/${selectedSite.value}/users`,
        { users: userIds, response: response },
        {
          onSuccess: () => {
            onSave({
              siteId: selectedSite.value,
              users: userIds,
            });
            onClose();
          },
          onError: (errors) => {
            console.error("Échec de la mise à jour des utilisateurs", errors);
          },
        }
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Gérer les Users</h2>
        <form onSubmit={handleSubmit}>
          {/* Site Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Site
            </label>
            <Select
              value={selectedSite}
              onChange={handleSiteChange}
              options={sites.map((site) => ({
                value: site.id,
                label: site.name,
              }))}
              placeholder="Sélectionnez un site"
              className="basic-single"
              classNamePrefix="select"
            />
          </div>

          {/* Users Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Ajouter des agents
            </label>
            <Select
              isMulti
              value={selectedUsers}
              onChange={handleUserChange}
              options={users.map((user) => ({
                value: user.id,
                label: user.fullname,
              }))}
              placeholder="Sélectionnez des users"
              className="basic-multi-select"
              classNamePrefix="select"
              isSearchable
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
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalUser;
