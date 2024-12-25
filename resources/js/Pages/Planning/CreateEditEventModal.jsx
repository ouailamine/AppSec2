import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Exemple de données pour les options de pause
const BREAK_OPTIONS = [
  { value: "noBreak", label: "Pas de pause" },
  { value: "yes", label: "Payable" },
  { value: "no", label: "Non-payable" },
];

const Modal = ({
  isOpen,
  onClose,
  event,
  onSave,
  onAdd,
  localPosts,
  typePosts,
  onDelete,
  createMode,
  isMultiEditMode,
  modalData,
  eventsToEdit,
  selectedCheckboxes,
  posts,
}) => {
  const [formData, setFormData] = useState({
    id: null,
    pause_end: "",
    pause_payment: "noBreak",
    pause_start: "",
    post: "",
    typePost: "",
    vacation_end: "",
    vacation_start: "",
  });

  // Mettre à jour le formulaire lorsque l'événement change
  useEffect(() => {
    if (isMultiEditMode || !createMode) {
      setFormData({
        ...event,
      });
    } else {
      setFormData({
        id: null,
        pause_end: "",
        pause_payment: "noBreak",
        pause_start: "",
        post: "",
        typePost: "",
        vacation_end: "",
        vacation_start: "",
      });
    }
  }, [event, createMode, modalData, isMultiEditMode, eventsToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation des champs obligatoires
    if (validateForm()) {
      // Si on est en mode édition multiple
      if (isMultiEditMode) {
        const updatedFormData = {
          pause_end: formData.pause_end,
          pause_payment: formData.pause_payment,
          pause_start: formData.pause_start,
          post: formData.post,
          typePost: formData.typePost,
          vacation_end: formData.vacation_end,
          vacation_start: formData.vacation_start,
        };
        onSave(updatedFormData);
      } else if (!createMode) {
        const updatedFormData = {
          id: [event.id],
          pause_end: formData.pause_end,
          pause_payment: formData.pause_payment,
          pause_start: formData.pause_start,
          post: formData.post,
          typePost: formData.typePost,
          vacation_end: formData.vacation_end,
          vacation_start: formData.vacation_start,
        };

        onSave(updatedFormData);
      } else {
        formData.selectedUsersDays = selectedCheckboxes;

        onAdd(formData);

        setFormData({
          pause_end: "",
          pause_payment: "noBreak",
          pause_start: "",
          post: "",
          typePost: "",
          vacation_end: "",
          vacation_start: "",
        });
      }
    }
  };

  // Validation des champs
  const validateForm = () => {
    // Vérification des champs obligatoires
    if (
      !formData.post ||
      !formData.typePost ||
      !formData.vacation_start ||
      !formData.vacation_end
    ) {
      alert("Tous les champs obligatoires doivent être remplis.");
      return false;
    }

    // Si "pause_payment" n'est pas égal à "Pas de pause", vérifier que les champs pause_start et pause_end sont remplis
    if (
      formData.pause_payment !== "noBreak" &&
      (!formData.pause_start || !formData.pause_end)
    ) {
      alert("Les champs de pause (Début et Fin) doivent être remplis.");
      return false;
    }

    return true; // Si toutes les validations passent
  };

  // Trouver le type de poste sélectionné
  const selectedTypePost = typePosts.find(
    (type) => type.id === Number(formData.typePost)
  );

  // Filtrer les posts en fonction du type de poste sélectionné
  const filteredPosts = formData.typePost
    ? (posts || []).filter(
        (post) => post.type_post_id === Number(formData.typePost)
      )
    : [];

  const handleDelete = (e) => {
    onDelete(event);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 transition-opacity duration-300">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg transform transition-transform duration-300 scale-100">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">
          {!createMode ? "Edit Event" : "Create Event"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Liste déroulante pour les types de poste */}
          <label className="block mb-4">
            <span className="text-gray-700">Type de Poste</span>
            <select
              name="typePost"
              value={formData.typePost || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            >
              <option value="">-- Sélectionner --</option>
              {typePosts.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </label>

          {/* Afficher les posts filtrés */}
          <label className="block mb-4">
            <span className="text-gray-700">Poste</span>
            <select
              name="post"
              value={formData.post || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            >
              <option value="">-- Sélectionner --</option>
              {filteredPosts.map((post) => (
                <option key={post.id} value={post.abbreviation}>
                  {post.name} ({post.abbreviation})
                </option>
              ))}
            </select>
          </label>

          {/* Si le type de poste est "Indisponible", afficher la durée par défaut */}
          {selectedTypePost?.name === "Indisponible" ? (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <label className="block">
                <span className="text-gray-700">Durée par défaut (Heures)</span>
                <input
                  type="number"
                  name="default_duration_hours"
                  value={formData.default_duration_hours || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  placeholder="Heures"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">
                  Durée par défaut (Minutes)
                </span>
                <input
                  type="number"
                  name="default_duration_minutes"
                  value={formData.default_duration_minutes || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  placeholder="Minutes"
                />
              </label>
            </div>
          ) : (
            /* Sinon, afficher les champs pour la vacation */
            <div className="grid grid-cols-2 gap-4 mb-6">
              <label className="block">
                <span className="text-gray-700">Début de la Vacation</span>
                <input
                  type="time"
                  name="vacation_start"
                  value={formData.vacation_start || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Fin de la Vacation</span>
                <input
                  type="time"
                  name="vacation_end"
                  value={formData.vacation_end || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </label>
            </div>
          )}

          {/* Pause */}
          <label className="block">
            <span className="text-gray-700">Pause</span>
            <select
              name="pause_payment"
              value={formData.pause_payment || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            >
              {BREAK_OPTIONS.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {/* Horaires de pause */}
          {formData.pause_payment !== "noBreak" && (
            <div className="grid grid-cols-2 gap-4 mb-6 mt-2">
              <label className="block">
                <span className="text-gray-700">Début de la Pause</span>
                <input
                  type="time"
                  name="pause_start"
                  value={formData.pause_start || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Fin de la Pause</span>
                <input
                  type="time"
                  name="pause_end"
                  value={formData.pause_end || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </label>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-3">
            <button
              type="submit"
              className="bg-blue-500 text-white px-2 py-1 text-xs rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {!createMode ? "Sauvegarder" : "Créer"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-300 text-red-700 text-xs px-2 py-1 rounded-lg hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Supprimer
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 text-xs px-2 py-1 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  event: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired, // Ajoutez onAdd ici
  localPosts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      abbreviation: PropTypes.string.isRequired,
      type_post_id: PropTypes.number.isRequired,
    })
  ).isRequired,
  typePosts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  createMode: PropTypes.bool.isRequired, // Indicate if we are editing
};

export default Modal;
