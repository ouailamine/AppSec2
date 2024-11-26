import React from "react";

const DetailModal = ({
  isOpen,
  onClose,
  event,
  getUserDetails,
  getSiteName,
  posts,
}) => {
  if (!isOpen) return null;

  const userDetails = getUserDetails(event.user_id);
  const createManagerDetails = getUserDetails(event.managerCreate);
  const validateManagerDetails = event.managerValidate
    ? getUserDetails(event.managerValidate)
    : { fullname: "N/D", firstname: "" };

  const siteName = getSiteName(event.site_id);

  const displayValue = (value) => (value == null ? "N/D" : value);
  const getPostName = (postId) => {
    const post = posts.find((p) => p.abbreviation === postId);
    return post ? post.name : "Inconnu";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/D";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-3xl mx-auto overflow-y-auto max-h-[85vh]">
        <h2 className="text-3xl font-bold text-center mb-6">
          Détails de la vacation
        </h2>

        {/* Sections in a responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Vacation Information */}
          <div className="p-5 rounded-lg bg-gray-50 shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-blue-700">
              Informations sur la vacation
            </h3>
            <p>
              <strong>Site:</strong> {siteName}
            </p>
            <p>
              <strong>Agent:</strong> {userDetails.fullname}{" "}
              {userDetails.firstname}
            </p>
            <p>
              <strong>Date de la vacation:</strong>{" "}
              {formatDate(event.date_vacation)}
            </p>
            <p>
              <strong>Post:</strong> {getPostName(event.post)}
            </p>
          </div>

          {/* Hours Details */}
          <div className="p-5 rounded-lg bg-gray-50 shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-blue-700">
              Détails des Heures et paniers
            </h3>
            <p>
              <strong>Heures Dimanche:</strong>{" "}
              {displayValue(event.sunday_hours)}
            </p>
            <p>
              <strong>Heures Fériés:</strong>{" "}
              {displayValue(event.holiday_hours)}
            </p>
            <p>
              <strong>Heures Nuit:</strong> {displayValue(event.night_hours)}
            </p>
            <p>
              <strong>Heures:</strong> {displayValue(event.hours)}
            </p>
            <p>
              <strong>Paniers:</strong> {event.lunchAllowance}
            </p>
          </div>

          {/* Creation Information */}
          <div className="p-5 rounded-lg bg-gray-50 shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-blue-700">
              Informations de Création
            </h3>
            <p>
              <strong>Créé par:</strong> {createManagerDetails.fullname}{" "}
              {createManagerDetails.firstname}
            </p>
            <p>
              <strong>Date de la création:</strong>{" "}
              {formatDate(event.created_at)}
            </p>
          </div>

          {/* Validation Information */}
          <div className="p-5 rounded-lg bg-gray-50 shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-blue-700">
              Informations de Validation
            </h3>
            <p>
              <strong>Date de la Régularisation:</strong>{" "}
              {formatDate(event.date_regularization)}
            </p>
            <p>
              <strong>Validé par:</strong> {validateManagerDetails.fullname}
            </p>
          </div>
        </div>

        {/* Centered Remarks Section */}
        <div className="mb-6 flex justify-center">
          <div className="w-full md:w-2/3 p-5 bg-gray-50 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold text-blue-700">Remarque</h3>
            <p className="mt-2">{displayValue(event.remarks)}</p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white font-semibold px-4 py-3 rounded-lg transition duration-200 hover:bg-blue-500"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default DetailModal;
