import React, { useState, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import Select from "react-select";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR");
};

const TextInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  disabled = false,
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm"
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
  </div>
);

const SelectInput = ({ label, name, value, options, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm"
      name={name}
      value={value || ""}
      onChange={onChange}
    >
      <option value="">Sélectionner</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const DiplomasTable = ({ diplomas, onEdit, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Nom du diplôme
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Date d'expiration
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {diplomas.length > 0 ? (
          diplomas.map((diploma, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {diploma.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {diploma.endDate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
                <button
                  type="button"
                  className="text-indigo-600 hover:text-indigo-900"
                  onClick={() => onEdit(index)}
                  data-bs-toggle="modal"
                  data-bs-target="#addEditDiplomaModal"
                >
                  Modifier
                </button>
                <button
                  className="text-red-600 hover:text-red-900"
                  onClick={() => onDelete(index)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
              Pas de diplôme
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const Edit = () => {
  const { user, cities, departments, regions, diplomasUser, diplomas } =
    usePage().props;

  const [form, setForm] = useState({
    ...user,
    diplomasUser: [],
  });

  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [diplomaForm, setDiplomaForm] = useState({
    selectedDiploma: null,
    endDate: "",
  });
  const [isEditingDiploma, setIsEditingDiploma] = useState(false);
  const [editingDiplomaIndex, setEditingDiplomaIndex] = useState(null);

  // IDs des diplômes de l'utilisateur
  const userDiplomaIds = form.diplomasUser
    .map((d) => {
      const diploma = diplomas.find((diploma) => diploma.name === d.name);
      return diploma ? diploma.id : null;
    })
    .filter((id) => id !== null);

  // Filtrer les diplômes disponibles
  const availableDiplomas = diplomas.filter(
    (diploma) => !userDiplomaIds.includes(diploma.id)
  );

  useEffect(() => {
    setForm((prevForm) => ({
      ...prevForm,
      diplomasUser: Object.keys(diplomasUser).map((key) => ({
        name: key,
        endDate: diplomasUser[key].endDate.date,
      })),
    }));
  }, [diplomasUser]);

  useEffect(() => {
    const departmentsFiltered = departments.filter(
      (d) => d.region_code === form.region
    );
    setFilteredDepartments(departmentsFiltered);
    setForm((prevForm) => ({
      ...prevForm,
      departement: "",
      city: "",
    }));
    setFilteredCities([]);
  }, [form.region]);

  useEffect(() => {
    const citiesFiltered = cities.filter(
      (c) => c.departement_code === form.departement
    );
    setFilteredCities(citiesFiltered);
    setCityOptions(
      citiesFiltered.map((city) => ({
        value: city.name,
        label: `${city.name} (${city.ZIP_code})`,
      }))
    );
  }, [form.departement]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Inertia.put(`/users/${user.id}`, form, {
      onSuccess: () => console.log("User updated successfully"),
      onError: (errors) => console.error("Error updating user:", errors),
    });
  };

  const handleCitySelect = (selectedOption) => {
    setForm((prevForm) => ({
      ...prevForm,
      city: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleDiplomaAction = () => {
    setForm((prevForm) => ({
      ...prevForm,
      diplomasUser: isEditingDiploma
        ? prevForm.diplomasUser.map((d, index) =>
            index === editingDiplomaIndex
              ? {
                  name: diplomaForm.selectedDiploma.label,
                  endDate: diplomaForm.endDate,
                }
              : d
          )
        : [
            ...prevForm.diplomasUser,
            {
              name: diplomaForm.selectedDiploma.label,
              endDate: diplomaForm.endDate,
            },
          ],
    }));
    setDiplomaForm({ selectedDiploma: null, endDate: "" });
    setIsEditingDiploma(false);
    setEditingDiplomaIndex(null);
  };

  const handleEditDiploma = (index) => {
    const diploma = form.diplomasUser[index];
    const selectedDiploma = diplomas.find((d) => d.name === diploma.name);
    setDiplomaForm({
      selectedDiploma: { label: selectedDiploma.name },
      endDate: diploma.endDate,
    });
    setIsEditingDiploma(true);
    setEditingDiplomaIndex(index);
  };

  const handleDeleteDiploma = (index) => {
    setForm((prevForm) => ({
      ...prevForm,
      diplomasUser: prevForm.diplomasUser.filter((_, i) => i !== index),
    }));
  };

  return (
    <AdminAuthenticatedLayout user={usePage().props.auth.user}>
      <Head title="Édition de l'utilisateur" />
      <div className="container mx-auto mt-4 px-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Modifier les informations de l'agent</h2>
            <a href={route("users.index")} className="text-indigo-600 hover:text-indigo-900">
              &larr; Retour
            </a>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <TextInput name="fullname" value={form.fullname} label="Nom" disabled />
                <TextInput name="firstname" value={form.firstname} label="Prénom" disabled />
                <TextInput name="date_of_birth" value={form.date_of_birth} label="Date de naissance" type="date" onChange={handleChange} />
                <TextInput value={user.genre} label="Genre" disabled />
                <TextInput name="email" value={form.email} label="Email" type="email" onChange={handleChange} />
                <TextInput name="address" value={form.address} label="Adresse" onChange={handleChange} />
                <SelectInput name="region" value={form.region} options={regions.map((r) => ({ value: r.region_code, label: r.name }))} onChange={handleChange} />
                <SelectInput name="departement" value={form.departement} options={filteredDepartments.map((d) => ({ value: d.departement_code, label: d.name }))} onChange={handleChange} />
                <Select
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm"
                  options={cityOptions}
                  onChange={handleCitySelect}
                  value={cityOptions.find((option) => option.value === form.city)}
                  isClearable
                />
              </div>
              <div>
                <TextInput name="phone" value={form.phone} label="Téléphone" onChange={handleChange} />
                <TextInput name="social_security_number" value={form.social_security_number} label="Numéro de sécurité sociale" onChange={handleChange} />
                <TextInput name="professional_card_number" value={form.professional_card_number} label="Numéro de carte professionnelle" onChange={handleChange} />
                <TextInput name="typeADS" value={form.typeADS} label="Type ADS" onChange={handleChange} />
                <TextInput name="note" value={form.note} label="Note" type="number" onChange={handleChange} />
                <TextInput name="registerNumber" value={form.registerNumber} label="Numéro d'enregistrement" disabled />
                <hr className="my-6 border-gray-300" />
                <div>
                  <label className="block text-lg font-semibold mb-3">Diplômes</label>
                  <button
                    type="button"
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    data-bs-toggle="modal"
                    data-bs-target="#addEditDiplomaModal"
                    onClick={() => {
                      setIsEditingDiploma(false);
                      setDiplomaForm({ selectedDiploma: null, endDate: "" });
                    }}
                  >
                    Ajouter
                  </button>
                  <hr className="my-4 border-gray-300" />
                  <DiplomasTable
                    diplomas={form.diplomasUser.map((d) => ({
                      name: d.name,
                      endDate: formatDate(d.endDate),
                    }))}
                    onEdit={handleEditDiploma}
                    onDelete={handleDeleteDiploma}
                  />
                </div>
              </div>
            </div>
            <button type="submit" className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Enregistrer
            </button>
          </form>
        </div>

        <div className="modal fade" id="addEditDiplomaModal" tabIndex="-1" aria-labelledby="addEditDiplomaModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="text-lg font-semibold" id="addEditDiplomaModalLabel">
                  {isEditingDiploma ? "Modifier le diplôme" : "Ajouter un diplôme"}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <Select
                  className="mb-4"
                  options={availableDiplomas.map((diploma) => ({
                    value: diploma.id,
                    label: diploma.name,
                  }))}
                  onChange={(selectedOption) => {
                    setDiplomaForm((prevForm) => ({
                      ...prevForm,
                      selectedDiploma: selectedOption,
                    }));
                  }}
                  value={diplomaForm.selectedDiploma}
                  isClearable
                  placeholder="Sélectionner un diplôme"
                  isDisabled={isEditingDiploma}
                />
                <TextInput
                  label="Date d'expiration"
                  name="endDate"
                  value={diplomaForm.endDate}
                  type="date"
                  onChange={(e) =>
                    setDiplomaForm({
                      ...diplomaForm,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600" data-bs-dismiss="modal">
                  Annuler
                </button>
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  onClick={handleDiplomaAction}
                  data-bs-dismiss="modal"
                >
                  {isEditingDiploma ? "Enregistrer" : "Ajouter"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminAuthenticatedLayout>
  );
};

export default Edit;
