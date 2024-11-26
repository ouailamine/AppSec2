import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";

const ModalForm = ({ isOpen, onClose, typePost = null, isEditing = false }) => {
  const [form, setForm] = useState({
    name: "",
    default_duration: "No", // Initialize with "No"
  });

  useEffect(() => {
    if (isEditing && typePost) {
      setForm({
        name: typePost.name,
        default_duration: typePost.default_duration ? "Yes" : "No", // Convert boolean to "Yes"/"No"
      });
    } else {
      setForm({
        name: "",
        default_duration: "No",
      });
    }
  }, [typePost, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert "Yes"/"No" to boolean for submission
    const formData = {
      name: form.name,
      default_duration: form.default_duration === "Yes",
    };

    if (isEditing) {
      Inertia.put(`/typePosts/${typePost.id}`, formData);
    } else {
      Inertia.post("/typePosts", formData);
    }

    onClose();
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Temp de travail fixe</label>
            <select
              name="default_duration"
              value={form.default_duration}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="No">Non</option>
              <option value="Yes">Oui</option>
            </select>
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
