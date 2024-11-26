import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
  PlusCircleIcon,
  TrashIcon,
  PencilSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline"; // Heroicons imports

const PermissionsIndex = ({
  permissions = { data: [], meta: {}, links: [] },
  flash = {},
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPermission, setCurrentPermission] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    console.log("Flash Messages:", flash);
  }, [flash]);

  const handleDelete = (permissionId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette permission ?")) {
      Inertia.delete(route("permissions.destroy", permissionId));
    }
  };

  const handleShowModal = (permission = null) => {
    if (permission) {
      setEditMode(true);
      setCurrentPermission(permission);
      setFormData({
        name: permission.name,
      });
    } else {
      setEditMode(false);
      setCurrentPermission(null);
      setFormData({
        name: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      Inertia.put(route("permissions.update", currentPermission.id), formData);
    } else {
      Inertia.post(route("permissions.store"), formData);
    }
    handleCloseModal();
  };

  const { data, meta = {}, links = [] } = permissions;

  return (
    <AdminAuthenticatedLayout>
      <Head title="Gestion des Permissions" />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card shadow-sm">
              <div className="card-body">
                {/* Flash messages */}
                {flash && (
                  <>
                    {flash.success && (
                      <div className="alert alert-success mb-3">
                        {flash.success}
                      </div>
                    )}
                    {flash.error && (
                      <div className="alert alert-danger mb-3">
                        {flash.error}
                      </div>
                    )}
                  </>
                )}

                <button
                  className="btn btn-success btn-sm mb-3"
                  onClick={() => handleShowModal()}
                >
                  <PlusCircleIcon className="w-5 h-5" />{" "}
                  {/* Heroicon for adding */}
                </button>

                <table className="table table-bordered table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Nom</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data.map((permission) => (
                        <tr key={permission.id}>
                          <th scope="row">{permission.id}</th>
                          <td>{permission.name}</td>
                          <td>
                            <>
                              <button
                                className="btn btn-primary btn-sm me-2"
                                onClick={() => handleShowModal(permission)}
                              >
                                <PencilSquareIcon className="w-5 h-5" />{" "}
                                {/* Heroicon for editing */}
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(permission.id)}
                              >
                                <TrashIcon className="w-5 h-5" />{" "}
                                {/* Heroicon for deleting */}
                              </button>
                            </>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-danger">
                          <strong>Aucune permission trouvée !</strong>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination Component */}
                <nav aria-label="Page navigation">
                  <ul className="flex items-center space-x-2">
                    <li>
                      <button onClick={() => meta.prev_page_url}></button>
                    </li>
                    {links.map((link, index) => (
                      <li key={index}>
                        <button
                          className={`px-3 py-1 rounded-md ${
                            link.active
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                          onClick={() => link.url && Inertia.visit(link.url)}
                        >
                          {link.label}
                        </button>
                      </li>
                    ))}
                    <li>
                      <button
                        onClick={() => meta.next_page_url}
                        disabled={!meta.next_page_url}
                      ></button>
                    </li>
                  </ul>
                </nav>

                {/* Modal Component */}
                {showModal && (
                  <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ display: "block" }}
                    onClick={handleCloseModal}
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">
                            {editMode
                              ? "Modifier la Permission"
                              : "Ajouter une Nouvelle Permission"}
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={handleCloseModal}
                          ></button>
                        </div>
                        <div className="modal-body">
                          <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                              <label
                                htmlFor="formPermissionName"
                                className="form-label"
                              >
                                Nom de la Permission
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="formPermissionName"
                                placeholder="Entrez le nom de la permission"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <button type="submit" className="btn btn-primary">
                              {editMode ? "Mettre à Jour" : "Enregistrer"}
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminAuthenticatedLayout>
  );
};

export default PermissionsIndex;
