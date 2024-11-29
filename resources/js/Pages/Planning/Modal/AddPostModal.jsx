import React, { useState } from "react";

const PostTypeModal = ({ open, onClose, onAddPost, typePosts }) => {
  const [postName, setPostName] = useState("");
  const [postAbbreviation, setPostAbbreviation] = useState("");
  const [defaultDurationHours, setDefaultDurationHours] = useState("");
  const [defaultDurationMinutes, setDefaultDurationMinutes] = useState("");
  const [selectedTypePost, setSelectedTypePost] = useState("");
  const [errors, setErrors] = useState({});

  //console.log('typePosts',typePosts)

  //console.log('selectedTypePost',selectedTypePost)
  const validateForm = () => {
    const newErrors = {};

    // Ensure that the post name and abbreviation are provided
    if (!postName.trim()) newErrors.postName = "Le nom du poste est requis.";
    if (!postAbbreviation.trim())
      newErrors.postAbbreviation = "L'abréviation est requise.";

    // Ensure that a type post is selected
    if (!selectedTypePost)
      newErrors.selectedTypePost = "Sélectionnez un type de poste.";

    // Check if duration validation is necessary based on default_duration value
    if (selectedTypePost && selectedTypePost.default_duration !== 0) {
      // Validate duration fields only if default_duration is not 0 (false)
      if (
        !defaultDurationHours ||
        isNaN(Number(defaultDurationHours)) ||
        Number(defaultDurationHours) < 0
      )
        newErrors.defaultDurationHours = "Entrez une durée valide en heures.";

      if (
        !defaultDurationMinutes ||
        isNaN(Number(defaultDurationMinutes)) ||
        Number(defaultDurationMinutes) < 0
      )
        newErrors.defaultDurationMinutes =
          "Entrez une durée valide en minutes.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (validateForm()) {
      onAddPost({
        name: postName,
        abbreviation: postAbbreviation,
        type_post_id: Number(selectedTypePost),
        default_duration_hours: defaultDurationHours,
        default_duration_minutes: defaultDurationMinutes,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setPostName("");
    setPostAbbreviation("");
    setDefaultDurationHours("");
    setDefaultDurationMinutes("");
    setSelectedTypePost(""); // Reset to empty string to require selection
    setErrors({});
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative space-y-6 transform transition-transform duration-300"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-20px)",
        }}
      >
        <h2 className="text-2xl font-bold text-gray-900">
          Ajouter un type de poste
        </h2>

        <div className="space-y-4">
          {/* Dropdown for Type de poste */}
          <div>
            <label
              className="block text-sm font-semibold text-gray-700 mb-1"
              htmlFor="typePost"
            >
              Type de poste
            </label>
            <select
              id="typePost"
              value={selectedTypePost}
              onChange={(e) => setSelectedTypePost(e.target.value)}
              aria-describedby="typePostError"
              className={`w-full px-4 py-2 border ${
                errors.selectedTypePost ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
            >
              <option value="" disabled hidden>
                Sélectionner un poste
              </option>
              {typePosts.map((typePost) => (
                <option key={typePost.id} value={typePost.id}>
                  {typePost.name}
                </option>
              ))}
            </select>
            {errors.selectedTypePost && (
              <p id="typePostError" className="text-sm text-red-500 mt-1">
                {errors.selectedTypePost}
              </p>
            )}
          </div>

          {/* Input for Nom du poste */}
          <div>
            <label
              className="block text-sm font-semibold text-gray-700 mb-1"
              htmlFor="postName"
            >
              Nom du poste
            </label>
            <input
              id="postName"
              type="text"
              value={postName}
              onChange={(e) => setPostName(e.target.value)}
              placeholder="Entrez le nom du type de poste"
              className={`w-full px-4 py-2 border ${
                errors.postName ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
            />
            {errors.postName && (
              <p className="text-sm text-red-500 mt-1">{errors.postName}</p>
            )}
          </div>

          {/* Input for Abréviation */}
          <div>
            <label
              className="block text-sm font-semibold text-gray-700 mb-1"
              htmlFor="postAbbreviation"
            >
              Abréviation
            </label>
            <input
              id="postAbbreviation"
              type="text"
              value={postAbbreviation}
              onChange={(e) => setPostAbbreviation(e.target.value)}
              placeholder="Entrez l'abbréviation"
              className={`w-full px-4 py-2 border ${
                errors.postAbbreviation ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
            />
            {errors.postAbbreviation && (
              <p className="text-sm text-red-500 mt-1">
                {errors.postAbbreviation}
              </p>
            )}
          </div>

          {/* Durée par défaut (Heures et Minutes) */}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label
                className="block text-sm font-semibold text-gray-700 mb-1"
                htmlFor="defaultDurationHours"
              >
                Durée par défaut (heures)
              </label>
              <input
                id="defaultDurationHours"
                type="number"
                value={defaultDurationHours}
                onChange={(e) => setDefaultDurationHours(e.target.value)}
                placeholder="Heures"
                className={`w-full px-4 py-2 border ${
                  errors.defaultDurationHours
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
              />
              {errors.defaultDurationHours && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.defaultDurationHours}
                </p>
              )}
            </div>

            <div className="w-1/2">
              <label
                className="block text-sm font-semibold text-gray-700 mb-1"
                htmlFor="defaultDurationMinutes"
              >
                Durée par défaut (minutes)
              </label>
              <input
                id="defaultDurationMinutes"
                type="number"
                value={defaultDurationMinutes}
                onChange={(e) => setDefaultDurationMinutes(e.target.value)}
                placeholder="Minutes"
                className={`w-full px-4 py-2 border ${
                  errors.defaultDurationMinutes
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
              />
              {errors.defaultDurationMinutes && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.defaultDurationMinutes}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition duration-200"
            onClick={handleClose}
          >
            Annuler
          </button>
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
            onClick={handleAdd}
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostTypeModal;
