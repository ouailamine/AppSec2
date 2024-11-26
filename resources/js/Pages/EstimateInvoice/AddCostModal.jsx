// AddCostModal.jsx

import React, { useState } from 'react';

const AddCostModal = ({ isOpen, onClose, onAddCost }) => {
  const [newCost, setNewCost] = useState({
    description: '',
    amount: 0,
  });

  const handleAddCost = () => {
    if (!newCost.description || newCost.amount <= 0) {
      alert('Veuillez remplir tous les champs correctement.');
      return;
    }
    onAddCost(newCost);
    setNewCost({ description: '', amount: 0 });
    onClose();
  };

  if (!isOpen) return null; // Ne rien rendre si le modal n'est pas ouvert

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 id="modal-title" className="text-lg font-semibold mb-4">Ajouter un coût additionnel</h2>
        <div>
          <label className="block text-sm text-gray-700 mb-2">Description</label>
          <input
            type="text"
            value={newCost.description}
            onChange={(e) => setNewCost({ ...newCost, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm text-gray-700 mb-2">Montant (€)</label>
          <input
            type="number"
            value={newCost.amount}
            onChange={(e) => setNewCost({ ...newCost, amount: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
          >
            Annuler
          </button>
          <button
            onClick={handleAddCost}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCostModal;
