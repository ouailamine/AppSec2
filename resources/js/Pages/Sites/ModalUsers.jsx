import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Inertia } from "@inertiajs/inertia";

const ModalUser = ({ isOpen, onClose, onSave, sites, users }) => {
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedPrimaryUsers, setSelectedPrimaryUsers] = useState([]);
  const [selectedSecondaryUsers, setSelectedSecondaryUsers] = useState([]);
  const [siteUsers, setSiteUsers] = useState({ primary: [], secondary: [] });

  useEffect(() => {
    // Réinitialiser les valeurs lorsque le modal est ouvert
    setSelectedSite(null);
    setSelectedPrimaryUsers([]);
    setSelectedSecondaryUsers([]);
    setSiteUsers({ primary: [], secondary: [] });
  }, [isOpen]);

  useEffect(() => {
    if (selectedSite) {
      const site = sites.find((site) => site.id === selectedSite.value);
      if (site) {
        console.log(site.users);
        if (Array.isArray(site.users)) {
          // Trier les utilisateurs en fonction de pivot.isFirstList
          const { primary, secondary } = site.users.reduce(
            (acc, user) => {
              if (user.pivot?.isFirstList) {
                acc.primary.push(user); // Utilisateur dans la première liste
              } else {
                acc.secondary.push(user); // Utilisateur dans la seconde liste
              }
              return acc;
            },
            { primary: [], secondary: [] }
          );

          setSiteUsers({ primary, secondary });
          setSelectedPrimaryUsers(
            primary.map((user) => ({ value: user.id, label: user.fullname }))
          );
          setSelectedSecondaryUsers(
            secondary.map((user) => ({ value: user.id, label: user.fullname }))
          );
        } else {
          console.warn("site.users n'est pas un tableau", site.users);
          setSiteUsers({ primary: [], secondary: [] });
        }
      }
    }
  }, [selectedSite, sites]);

  const handleSiteChange = (selectedOption) => {
    setSelectedSite(selectedOption);
  };

  const handlePrimaryUserChange = (selectedOptions) => {
    setSelectedPrimaryUsers(selectedOptions);
  };

  const handleSecondaryUserChange = (selectedOptions) => {
    setSelectedSecondaryUsers(selectedOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSite) {
      const primaryUserIds = selectedPrimaryUsers.map((user) => user.value);
      const secondaryUserIds = selectedSecondaryUsers.map((user) => user.value);
      Inertia.put(
        `/sites/${selectedSite.value}/users`,
        { primaryUsers: primaryUserIds, secondaryUsers: secondaryUserIds },
        {
          onSuccess: () => {
            onSave({
              siteId: selectedSite.value,
              primaryUsers: primaryUserIds,
              secondaryUsers: secondaryUserIds,
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

  // Filtrer les options pour exclure les utilisateurs déjà sélectionnés dans l'autre liste
  const primaryOptions = users
    .filter(
      (user) =>
        !selectedSecondaryUsers.some((secondary) => secondary.value === user.id) &&
        !siteUsers.primary.some((primary) => primary.id === user.id)
    )
    .map((user) => ({ value: user.id, label: user.fullname }));

  const secondaryOptions = users
    .filter(
      (user) =>
        !selectedPrimaryUsers.some((primary) => primary.value === user.id) &&
        !siteUsers.secondary.some((secondary) => secondary.id === user.id)
    )
    .map((user) => ({ value: user.id, label: user.fullname }));

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

          {/* Primary Users Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Ajouter des agents principaux
            </label>
            <Select
              isMulti
              value={selectedPrimaryUsers}
              onChange={handlePrimaryUserChange}
              options={primaryOptions}
              placeholder="Sélectionnez des agents principaux"
              className="basic-multi-select"
              classNamePrefix="select"
              isSearchable
            />
          </div>

          {/* Secondary Users Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Ajouter des agents secondaires
            </label>
            <Select
              isMulti
              value={selectedSecondaryUsers}
              onChange={handleSecondaryUserChange}
              options={secondaryOptions}
              placeholder="Sélectionnez des agents secondaires"
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
