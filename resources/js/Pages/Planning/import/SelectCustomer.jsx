import React from "react";

const SelectCustomer = ({ customers = [], selectedCustomer, handleCustomerChange, errors }) => {
  return (
    <div className="w-full sm:max-w-xs">
      <select
        id="selectedCustomer"
        value={selectedCustomer}
        onChange={(e) => handleCustomerChange(e.target.value)}
        className="w-60 mt-1 text-gray-700 bg-white border border-gray-300 rounded-lg  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="">Sélectionner un Client </option>
        {customers.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {errors?.selectedCustomer && (
        <div className="mt-1 text-red-500 text-xs font-bold">
          {errors.selectedCustomer}
        </div>
      )}
    </div>
  );
};

export default SelectCustomer;
