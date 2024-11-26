// SelectField.jsx
import React from "react";

const SelectField = ({ id, label, value, onChange, options }) => (
  <div className="flex-grow">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
    >
      <option value="">Sélectionner...</option>
      {options.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name || `${item.fullname} ${item.firstname}`}
        </option>
      ))}
    </select>
  </div>
);

export default SelectField;
