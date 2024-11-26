import React from "react";
import { Inertia } from "@inertiajs/inertia";

const HolidayForm = ({ holiday, onHide, onSave }) => {
  const [formData, setFormData] = React.useState({
    id: holiday ? holiday.id : "",
    name: holiday ? holiday.name : "",
    date: holiday ? holiday.date : "",
  });

  const [processing, setProcessing] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    if (holiday) {
      Inertia.put(`/holidays/${formData.id}`, formData)
        .then(() => {
          onSave();
          onHide();
        })
        .finally(() => setProcessing(false));
    } else {
      Inertia.post("/holidays", formData)
        .then(() => {
          onSave();
          onHide();
        })
        .finally(() => setProcessing(false));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {holiday ? "Modifier un jour férié" : "Ajouter un jour férié"}
          </h2>
          <button
            onClick={onHide}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nom du jour férié
            </label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date
            </label>
            <input
              type="date"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-4 py-2 rounded-md text-white focus:outline-none ${processing ? 'bg-gray-400' : 'bg-indigo-500 hover:bg-indigo-600'}`}
              disabled={processing}
            >
              {holiday ? "Modifier le jour férié" : "Ajouter le jour férié"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HolidayForm;
