import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import Select from "react-select";

const Edit = ({ role, permissions, rolePermissions }) => {
  const [name, setName] = useState(role.name);
  const [selectedPermissions, setSelectedPermissions] = useState(
    rolePermissions.map((id) => ({
      value: id,
      label: permissions.find((p) => p.id === id)?.name,
    }))
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    Inertia.put(route("roles.update", role.id), {
      name,
      permissions: selectedPermissions.map((p) => p.value),
    });
  };

  const handlePermissionChange = (selectedOptions) => {
    setSelectedPermissions(selectedOptions || []);
  };

  // Custom styles for react-select
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#007bff" : "#fff",
      color: state.isSelected ? "#fff" : "#000",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#007bff",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#fff",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#fff",
      ":hover": {
        backgroundColor: "#0056b3",
        color: "#fff",
      },
    }),
  };

  return (
    <AdminAuthenticatedLayout>
      <Head title={`Edit Role - ${role.name}`} />
      <Container className="mt-4">
        <Row>
          <Col md={8} lg={6} className="mx-auto">
            <div className="card shadow-sm">
              <div className="card-body">
                <h1 className="mb-4">Edit Role</h1>
                <Button
                  variant="secondary"
                  className="mb-3"
                  onClick={() => Inertia.visit(route("roles.index"))}
                >
                  <i className="bi bi-arrow-left"></i> Back
                </Button>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Role Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter role name"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Permissions</Form.Label>
                    <Select
                      isMulti
                      options={permissions.map((permission) => ({
                        value: permission.id,
                        label: permission.name,
                      }))}
                      value={selectedPermissions}
                      onChange={handlePermissionChange}
                      placeholder="Select permissions"
                      className="basic-multi-select"
                      classNamePrefix="select"
                      styles={customStyles} // Apply custom styles
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Update Role
                  </Button>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </AdminAuthenticatedLayout>
  );
};

export default Edit;
