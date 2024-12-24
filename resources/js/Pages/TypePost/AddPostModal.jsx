import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";

const ModalForm = ({
  isOpen,
  onClose,
  post,
  isEditing,
  typePosts, // Ensure typePosts is an array
}) => {
  console.log(post);

  const [form, setForm] = useState({
    name: "",
    abbreviation: "",
    type_post_id: "",
    duration_of_work_hours: "",
    duration_of_work_minutes: "",
  });
  const [selectedTypePost, setSelectedTypePost] = useState(null);

  useEffect(() => {
    if (isEditing && post) {
      const initialTypePost = typePosts.find(
        (tp) => tp.id === post.type_post?.id
      );
      setForm({
        name: post.name || "",
        abbreviation: post.abbreviation || "",
        type_post_id: post.type_post?.id || "",
        duration_of_work_hours: post.default_duration_hours ?? "",
        duration_of_work_minutes: post.default_duration_minutes ?? "",
      });
      setSelectedTypePost(initialTypePost || null);
    } else {
      setForm({
        name: "",
        abbreviation: "",
        type_post_id: "",
        duration_of_work_hours: "",
        duration_of_work_minutes: "",
      });
      setSelectedTypePost(null);
    }
  }, [post, isEditing, typePosts]);

  useEffect(() => {
    const selected = typePosts.find((tp) => tp.id == form.type_post_id);
    setSelectedTypePost(selected || null);
  }, [form.type_post_id, typePosts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    if (isEditing) {
      Inertia.put(`/posts/${post.id}`, form);
    } else {
      Inertia.post("/posts", form);
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
          {isEditing ? "Modifier un poste" : "Créer un poste"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Type de poste</label>
            <select
              name="type_post_id"
              value={form.type_post_id}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Sélectionnez un type</option>
              {typePosts.map((typePost) => (
                <option key={typePost.id} value={typePost.id}>
                  {typePost.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Nomination</label>
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
            <label className="block text-gray-700">Abbréviation</label>
            <input
              type="text"
              name="abbreviation"
              value={form.abbreviation}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {selectedTypePost && selectedTypePost.default_duration === 1 && (
            <div>
              <label className="block text-gray-700">Durée de travail</label>
              <div className="flex space-x-4 mt-1">
                <div className="flex-1">
                  <label className="block text-gray-600">Heures</label>
                  <input
                    type="number"
                    name="duration_of_work_hours"
                    value={form.duration_of_work_hours}
                    onChange={handleChange}
                    className="block w-full p-2 border border-gray-300 rounded"
                    required
                    min="0"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-600">Minutes</label>
                  <input
                    type="number"
                    name="duration_of_work_minutes"
                    value={form.duration_of_work_minutes}
                    onChange={handleChange}
                    className="block w-full p-2 border border-gray-300 rounded"
                    required
                    min="0"
                    max="59"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isEditing ? "Mettre à jour" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;
