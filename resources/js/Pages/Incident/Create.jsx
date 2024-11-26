import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Head } from "@inertiajs/inertia-react";

const CreateRole = ({ permissions }) => {
  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    Inertia.post(route("roles.store"), {
      name,
      permissions: selectedPermissions,
    });
  };

  const handlePermissionChange = (e) => {
    const value = parseInt(e.target.value);
    setSelectedPermissions((prev) =>
      prev.includes(value)
        ? prev.filter((name) => name !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="container mt-4">
      <Head title="Create Role" />
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Create New Role</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Role Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Permissions</label>
                  <div>
                    {permissions.map((permission) => (
                      <div key={permission.id} className="form-check">
                        <input
                          type="checkbox"
                          id={`permission-${permission.id}`}
                          className="form-check-input"
                          value={permission.name}
                          checked={selectedPermissions.includes(
                            permission.name
                          )}
                          onChange={handlePermissionChange}
                        />
                        <label
                          htmlFor={`permission-${permission.id}`}
                          className="form-check-label"
                        >
                          {permission.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">
                  Save Role
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRole;
