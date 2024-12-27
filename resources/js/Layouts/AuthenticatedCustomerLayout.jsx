import { useState } from "react";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import { usePage } from "@inertiajs/react";
import { Head, Link } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";

const CustomerAuthenticated = ({ user, header, children }) => {
  const [showingNavigationDropdown, setShowingNavigationDropdown] =
    useState(false);

  const handleLogout = () => {
    // Envoie la requête de déconnexion via Inertia
    Inertia.post(route("logout"));
  };

  const { auth } = usePage().props;
  const toggleDropdown = () => setShowingNavigationDropdown((prev) => !prev);

  const getInitials = (fullname, firstname) => {
    const fullInitial = fullname ? fullname.charAt(0).toUpperCase() : "";
    const firstInitial = firstname ? firstname.charAt(0).toUpperCase() : "";
    return `${fullInitial}${firstInitial}`;
  };

  const initials = getInitials(auth.user.fullname, auth.user.firstname);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/assets/img/logo-atalix.png"
              alt="Logo"
              className="w-10 h-10 rounded-full object-cover mr-2"
            />
            <span className="text-white text-lg font-semibold">Client</span>
          </div>

          <Dropdown>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogout();
              }}
              style={{ display: "inline" }}
            >
              <button
                type="submit"
                className="bg-red-500 text-xs flex items-center  p-1 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                style={{
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  style={{ marginRight: "8px" }}
                >
                  <path d="M13 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9l4 4-4 4" />
                </svg>
                <span className="text-white font-bold">Déconnexion</span>
              </button>
            </form>

            {/*}<Dropdown.Trigger>
              <button
                type="button"
                className="flex items-center text-white hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors duration-200"
                aria-label="Open user menu"
              >
                <img src="assets/img/customer-icone.png"/>

                <svg
                  className="w-5 h-5 text-white transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 8.707a1 1 0 011.415-1.414L12 12.757l5.464-5.464a1 1 0 111.415 1.414L12 15.586l-6.879-6.879z"
                  />
                </svg>
              </button>
            </Dropdown.Trigger>

            <Dropdown.Content className="bg-white border border-gray-300 mt-2 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Dropdown.Link
                href={route("profile.edit")}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                Profile
              </Dropdown.Link>
              <Dropdown.Link
                href={route("logout")}
                method="post"
                as="button"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                Déconnection
              </Dropdown.Link>
            </Dropdown.Content>{*/}
          </Dropdown>
        </div>
      </div>

      {/* Navigation */}
{/*}
      <nav className="border-b border-gray-300 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
         
            <div className="hidden sm:flex sm:items-center sm:space-x-8">
              <NavLink
                href={route("dashboardCustomer")}
                active={route().current("dashboardCustomer")}
                className="text-gray-800 hover:text-gray-600"
              >
                Accueil
              </NavLink>
              <NavLink
                href={route("profile.edit")}
                active={route().current("profile.edit")}
                className="text-gray-800 hover:text-gray-600"
              >
                Profile
              </NavLink>

              <NavLink
                href={route("planningGuard")}
                active={route().current("planningGuard")}
                className="text-gray-800 hover:text-gray-600"
              >
                Planning du site
              </NavLink>

              <NavLink
                to="/contact"
                className="text-gray-800 hover:text-gray-600"
              >
                Mes Demande
              </NavLink>
              <NavLink
                to="/contact"
                className="text-gray-800 hover:text-gray-600"
              >
                List des Agents
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
{*/}
      {/* Main Content */}
      <main className="flex-1">
        {header && (
          <header className="bg-white shadow-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              {header}
            </div>
          </header>
        )}

        <div className="">{children}</div>
      </main>
    </div>
  );
};
export default CustomerAuthenticated;
