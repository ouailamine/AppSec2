import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head } from "@inertiajs/react";
import "../../../css/styles.css"; // Ensure your CSS styles are imported

const EditPlanning = ({ planning, typePosts = [] }) => {
  const [formData, setFormData] = useState({
    year: planning.year || "",
    site: planning.site || "",
    month: planning.month || "",
    events: planning.events || [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEventChange = (index, e) => {
    const { name, value } = e.target;
    const newEvents = [...formData.events];
    newEvents[index] = { ...newEvents[index], [name]: value };
    setFormData({ ...formData, events: newEvents });
  };

  const handleAddEvent = () => {
    setFormData({
      ...formData,
      events: [
        ...formData.events,
        { typePost: "", start_time: "", end_time: "" },
      ],
    });
  };

  const handleRemoveEvent = (index) => {
    const newEvents = formData.events.filter((_, i) => i !== index);
    setFormData({ ...formData, events: newEvents });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace the URL with the actual route for updating the planning entry
    Inertia.put(`/plannings/${planning.id}`, formData);
  };

  return (
    <AdminAuthenticatedLayout>
      <Head title="Edit Planning" />

      <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Edit Planning</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <label htmlFor="year" className="block text-xs font-medium text-gray-700">
              Year
            </label>
            <input
              id="year"
              name="year"
              type="text"
              value={formData.year}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            />

            <label htmlFor="site" className="block text-xs font-medium text-gray-700 mt-2">
              Site
            </label>
            <input
              id="site"
              name="site"
              type="text"
              value={formData.site}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            />

            <label htmlFor="month" className="block text-xs font-medium text-gray-700 mt-2">
              Month
            </label>
            <input
              id="month"
              name="month"
              type="text"
              value={formData.month}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">Events</h2>
            {formData.events.map((event, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center space-x-2">
                  <input
                    name="typePost"
                    type="text"
                    value={event.typePost}
                    onChange={(e) => handleEventChange(index, e)}
                    placeholder="Type Post"
                    className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <input
                    name="start_time"
                    type="text"
                    value={event.start_time}
                    onChange={(e) => handleEventChange(index, e)}
                    placeholder="Start Time"
                    className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <input
                    name="end_time"
                    type="text"
                    value={event.end_time}
                    onChange={(e) => handleEventChange(index, e)}
                    placeholder="End Time"
                    className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveEvent(index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddEvent}
              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 text-sm"
            >
              Add Event
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 text-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </AdminAuthenticatedLayout>
  );
};

export default EditPlanning;
