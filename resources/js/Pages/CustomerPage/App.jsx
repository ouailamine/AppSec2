import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Plannings from "./Plannings";
import Profil from "./Profile";
import Dashboard from "./Dashboard";
import SiteGuardsList from "./GuardsSite";
import AuthenticatedCustomerLayout from "../../Layouts/AuthenticatedCustomerLayout";

const App = ({ plannings, customerSites, users }) => {
  console.log("Plannings: ", plannings);
  console.log("Customer Sites: ", customerSites);
  console.log("Users: ", users);

  return (
    <AuthenticatedCustomerLayout>
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
                      to="/plannings"
                      className="hover:bg-blue-300 text-sm font-bold px-4 py-2 rounded-md"
                      aria-label="Plannings"
                    >
                      Plannings
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="hover:bg-blue-300 text-sm font-bold px-4 py-2 rounded-md"
                      aria-label="Profile"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/site-guards"
                      className="hover:bg-blue-300 text-sm font-bold px-4 py-2 rounded-md"
                      aria-label="Site Guards List"
                    >
                      Liste des Agents
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
            <Route path="/" element={<Dashboard plannings={plannings} />} />
            <Route path="/plannings" element={<Plannings plannings={plannings} />} />
            <Route path="/profile" element={<Profil customer={customerSites} />} />
            <Route path="/site-guards" element={<SiteGuardsList />} />
            {/* Redirection pour les routes non trouvées */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthenticatedCustomerLayout>
  );
};

export default App;
