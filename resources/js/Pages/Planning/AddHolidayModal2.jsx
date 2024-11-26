import React, { useState } from 'react';
import moment from 'moment';
import { DatePicker } from 'antd'; // Gardons Ant Design uniquement pour le DatePicker

const HolidayModal = ({ open, onClose, onAdd }) => {
  const [holidayName, setHolidayName] = useState('');
  const [holidayDate, setHolidayDate] = useState(null);

  const handleAdd = () => {
    if (holidayName.trim() && holidayDate) {
      onAdd({ name: holidayName, date: holidayDate });
      setHolidayName('');
      setHolidayDate(null);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-bold mb-4">Ajouter un jour Férié</h2>
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="holidayName">
            Nom du jour
          </label>
          <input
            id="holidayName"
            type="text"
            value={holidayName}
            onChange={e => setHolidayName(e.target.value)}
            placeholder="Entrez le nom du congé"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="holidayDate">
            Date du jour
          </label>
          <DatePicker
            id="holidayDate"
            value={holidayDate ? moment(holidayDate) : null}
            onChange={date => setHolidayDate(date ? date.toDate() : null)}
            format="YYYY-MM-DD"
            className="w-full"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={handleAdd}
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

export default HolidayModal;
