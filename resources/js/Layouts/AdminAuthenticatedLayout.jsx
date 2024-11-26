import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import { usePage } from "@inertiajs/react";

export default function AdminAuthenticated({ header, children, user, roles }) {
  const { auth } = usePage().props;
  if (!auth || !auth.user) {
    return <div>Loading...</div>;
  }

  const getInitials = (fullname, firstname) => {
    const fullInitial = fullname ? fullname.charAt(0).toUpperCase() : "";
    const firstInitial = firstname ? firstname.charAt(0).toUpperCase() : "";
    return `${fullInitial}${firstInitial}`;
  };

  const initials = getInitials(auth.user.fullname, auth.user.firstname);
  const role =
    auth.user.roles && auth.user.roles.length > 0
      ? auth.user.roles[0].name
      : "No Role";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 py-0">
        <div className="max-w-8xl mx-auto px-2 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/assets/img/logo-atalix.png"
              alt="Logo"
              className="w-10 h-10 rounded-full object-cover "
            />
            <span className="text-white text-lg font-semibold mr-4">
              {role}
            </span>

            {/* Tableau de bord NavLink */}
            <NavLink
              href={route("dashboardAdmin")}
              active={route().current("dashboardAdmin")}
              className="flex items-center text-gray-200 hover:text-gray-400"
            >
              <span className="text-white text-m font-semibold">
                Tableau de bord
              </span>
            </NavLink>
          </div>

          <Dropdown>
            <Dropdown.Trigger>
              <button
                type="button"
                className="flex items-center text-white hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors duration-200"
                aria-label="Open user menu"
              >
                <div className="w-8 h-8 bg-white text-blue-600 flex items-center justify-center rounded-full mr-0 text-base font-bold">
                  {initials}
                </div>

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
              {/* Profile Link */}
              <Dropdown.Link
                href={route("profile.edit")}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-t-lg transition-colors duration-200"
              >
                Profile
              </Dropdown.Link>

              {/* Logout Link */}
              <Dropdown.Link
                href={route("logout")}
                method="post"
                as="button"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-b-lg transition-colors duration-200"
              >
                Déconnection
              </Dropdown.Link>
            </Dropdown.Content>
          </Dropdown>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {header && (
          <header className="bg-white shadow-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              {header}
            </div>
          </header>
        )}

        <div className="p-0 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
