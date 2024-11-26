import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Inertia } from "@inertiajs/inertia";

const HolidayForm = ({ holiday, onHide, onSave, onClose }) => {
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
    <Modal show onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {holiday ? "Modifier un jour férié" : "Ajouter un jour férié"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
            <Button
              type="submit"
              variant="primary"
              disabled={processing}
              className="bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              {holiday ? "Modifier le jour férié" : "Ajouter le jour férié"}
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Annuler
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default HolidayForm;
