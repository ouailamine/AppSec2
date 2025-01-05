import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Role from "./RoleHome";
import Permissions from "./PermissionHome";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import Dashboard from "./Dashboard";

const App = ({ roles, users, permissions }) => {
  console.log("roles: ", roles);
  console.log("users: ", users);
  console.log("permissions: ", permissions);

  return (
    <AdminAuthenticatedLayout>
      <Router>
        {/* Navigation */}
        <nav className="border-b border-gray-300 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-12 items-center">
              {/* Desktop Navigation */}
              <div className="hidden sm:flex sm:items-center sm:space-x-8">
                <ul className="flex space-x-6">
                  <li>
                    <Link
                      to="/"
                      className="hover:bg-blue-300 text-sm font-bold px-4 py-2 rounded-md"
                      aria-label="Dashboard"
                    >
                      Accueil
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/roles"
                      className="hover:bg-blue-300 text-sm font-bold px-4 py-2 rounded-md"
                      aria-label="Roles"
                    >
                      roles
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/permissions"
                      className="hover:bg-blue-300 text-sm font-bold px-4 py-2 rounded-md"
                      aria-label="Permissions"
                    >
                      Permissions
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* Contenu Principal */}
        <div className="max-w-7xl mx-auto p-6">
          <Routes>
            {/* Route par défaut pour rediriger vers Dashboard */}
            <Route path="/" element={<Dashboard users={users} />} />
            <Route
              path="/roles"
              element={<Role roles={roles} permissions={permissions} />}
            />
            <Route
              path="/permissions"
              element={<Permissions roles={roles} permissions={permissions} />}
            />

            {/* Redirection pour les routes non trouvées */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AdminAuthenticatedLayout>
  );
};

export default App;
