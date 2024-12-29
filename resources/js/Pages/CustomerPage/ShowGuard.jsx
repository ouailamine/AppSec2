import React from "react";

const ShowGuard = ({ agent, onClose }) => {
  if (!agent) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
        <h2 className="text-xl font-bold mb-4">Détails de {agent.name}</h2>
        <p className="text-gray-700 mb-4">{agent.details}</p>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={onClose}
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default ShowGuard;
