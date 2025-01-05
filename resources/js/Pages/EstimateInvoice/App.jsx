import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import Estimate from "./Estimate3"
import Invoice from "./Invoices2"

import AdminAuthenticatedLayout from "../../Layouts/AdminAuthenticatedLayout";

const App = ({plannings,sites,typePosts,posts,customers}) => {


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
                      aria-label="Invoice"
                    >
                      Factures
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/Devis"
                      className="hover:bg-blue-300 text-sm font-bold px-4 py-2 rounded-md"
                      aria-label="Factures"
                    >
                     Devis
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
            <Route
              path="/"
              element={
                <Invoice
                  plannings={plannings}
                  sites={sites}
                  customers ={customers}
                  allTypePosts={typePosts}
                  allPosts={posts}
                />
              }
            />
            <Route
              path="/Devis"
              element={
                <Estimate
                typePosts={typePosts}
                posts={posts}
                customers ={customers}
                sites={sites}  
                />
              }
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
