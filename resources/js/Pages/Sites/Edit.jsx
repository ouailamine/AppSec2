import { useForm } from "@inertiajs/inertia-react";
import { Link } from "@inertiajs/inertia-react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head } from "@inertiajs/react";

const Edit = ({ site }) => {
  const { data, setData, put, processing, errors } = useForm({
    name: site.name,
    manager_name: site.manager_name,
    address: site.address,
    email: site.email,
    phone: site.phone,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/sites/${site.id}`);
  };

  return (
    <AdminAuthenticatedLayout>
      <Head title="Edit Site" />
      <div className="container mt-4">
        <h1 className="mb-4">Edit Site</h1>
        <Link href="/sites" className="btn btn-secondary mb-4">
          Back to List
        </Link>
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
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
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={processing}
                  >
                    {processing ? "Updating..." : "Update"}
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

export default Edit;
