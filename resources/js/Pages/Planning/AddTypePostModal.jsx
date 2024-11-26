import React, { useState, useEffect } from "react";

const ModalForm = ({
  isOpen,
  onClose,
  onAddTypePost,
  typePostToEdit = null,
}) => {
  const [typePostName, setTypePostName] = useState("");
  const [typePostAbbreviation, setTypePostAbbreviation] = useState("");

  // Initialize state with typePostToEdit if provided
  useEffect(() => {
    if (typePostToEdit) {
      setTypePostName(typePostToEdit.name || "");
      setTypePostAbbreviation(typePostToEdit.abbreviation || "");
    }
  }, [typePostToEdit]);

  const isEditing = typePostToEdit !== null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setTypePostName(value);
    } else if (name === "abbreviation") {
      setTypePostAbbreviation(value);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (typePostName && typePostAbbreviation) {
      const newTypePost = {
        id: isEditing ? typePostToEdit.id : Date.now(), // Use existing ID if editing
        name: typePostName,
        abbreviation: typePostAbbreviation,
      };
      onAddTypePost(newTypePost);
      setTypePostName("");
      setTypePostAbbreviation("");
      onClose();
    } else {
      alert("Please fill out all fields.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-lg font-semibold mb-4">
          {isEditing ? "Edit TypePost" : "Create TypePost"}
        </h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={typePostName}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Abbreviation</label>
            <input
              type="text"
              name="abbreviation"
              value={typePostAbbreviation}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;
