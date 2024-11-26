// resources/js/Pages/Sites/Create.jsx

import React from "react";
import { useForm } from "@inertiajs/inertia-react";
import { Link } from "@inertiajs/inertia-react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Select from "react-select";

const Create = ({ guards }) => {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    manager_name: "",
    address: "",
    email: "",
    phone: "",
    selectedGuards: [], // Field for selected guards
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/sites");
  };

  // Map guards to react-select format
  const guardOptions = guards.map((guard) => ({
    value: guard.id,
    label: guard.fullname, // Adjust according to the attribute you want to display
  }));

  // Handle multi-select changes
  const handleGuardChange = (selectedOptions) => {
    setData(
      "selectedGuards",
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };

  return (
    <AdminAuthenticatedLayout>
      <Head title="Create Site" />
      <div className="container mt-4">
        <h1 className="mb-4">Create Site</h1>
        <Link href="/sites" className="btn btn-secondary mb-4">
          Back to List
        </Link>
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* Form fields for site creation */}

                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      value={data.name}
                      onChange={(e) => setData("name", e.target.value)}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="manager_name" className="form-label">
                      Manager Name
                    </label>
                    <input
                      id="manager_name"
                      type="text"
                      className={`form-control ${
                        errors.manager_name ? "is-invalid" : ""
                      }`}
                      value={data.manager_name}
                      onChange={(e) => setData("manager_name", e.target.value)}
                    />
                    {errors.manager_name && (
                      <div className="invalid-feedback">
                        {errors.manager_name}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                      Address
                    </label>
                    <input
                      id="address"
                      type="text"
                      className={`form-control ${
                        errors.address ? "is-invalid" : ""
                      }`}
                      value={data.address}
                      onChange={(e) => setData("address", e.target.value)}
                    />
                    {errors.address && (
                      <div className="invalid-feedback">{errors.address}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      value={data.email}
                      onChange={(e) => setData("email", e.target.value)}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="text"
                      className={`form-control ${
                        errors.phone ? "is-invalid" : ""
                      }`}
                      value={data.phone}
                      onChange={(e) => setData("phone", e.target.value)}
                    />
                    {errors.phone && (
                      <div className="invalid-feedback">{errors.phone}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="guards" className="form-label">
                      Guards
                    </label>
                    <Select
                      id="guards"
                      isMulti
                      options={guardOptions}
                      onChange={handleGuardChange}
                      value={guardOptions.filter((option) =>
                        data.selectedGuards.includes(option.value)
                      )}
                      className={`react-select ${
                        errors.selectedGuards ? "is-invalid" : ""
                      }`}
                    />
                    {errors.selectedGuards && (
                      <div className="invalid-feedback">
                        {errors.selectedGuards}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={processing}
                  >
                    {processing ? "Saving..." : "Save"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminAuthenticatedLayout>
  );
};

export default Create;
