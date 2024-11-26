// ConfirmationDialog.jsx
import React from 'react';

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Confirmation</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
