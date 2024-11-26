// ValidationModal.js
import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

const ValidationModal = ({ isOpen, onClose, event }) => {
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");

  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if remarks is empty
    if (!remarks.trim()) {
      setError("Remarque est obligatoire.");
      return;
    }

    // Clear any existing error
    setError("");

    const formData = {
      typeUpdate: "validate",
      remarks: remarks,
    };

    Inertia.put(route("catchEvents.update", event.id), formData);

    onClose(); // Close the modal after submission
  };

  if (!isOpen) return null; // Return null if modal is not open

  return (
    <div className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="modal-content bg-white p-4 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Validation de la vacation</h2>

        {/* Textarea for remarks */}
        <label className="block mb-4">
          Remarque:
          <textarea
            value={remarks}
            required
            onChange={(e) => setRemarks(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full mt-1 resize-none"
            rows="3"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </label>

        {/* Validation and Close buttons */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationModal;
