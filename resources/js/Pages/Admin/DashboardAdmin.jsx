import React, { useState } from "react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function DashboardAdmin({
  auth,
  filteredUsersCount,
  filteredVacationsCount,
}) {
  const role = auth.roles;

  // Define buttons and their roles
  const buttons = [
    {
      title: "Gestion des plannings",
      imgSrc: "assets/img/planning.png",
      route: "plannings.index",
      roles: ["Admin", "Manager", "Leader", "LeaderTeam"], // Accessible to Admin and Manager
    },
    {
      title: "Gestion des heures oubliés",
      imgSrc: "assets/img/catchEvent.png",
      route: "catchEvents.index",
      badge: true,
      badgeCount: filteredVacationsCount,
      roles: ["Admin", "Manager", "Leader"], // Accessible to Admin and HR
    },
    {
      title: "Gestion des employés",
      imgSrc: "assets/img/employes.png",
      route: "users.index",
      roles: ["Admin", "Manager", "Leader", "LeaderTeam"], // Only Admin can see this
    },
    {
      title: "Gestion des Clients",
      imgSrc: "assets/img/customer.png",
      route: "customers.index",
      roles: ["Admin", "Manager", "Leader"], // Accessible to Admin and Manager
    },
    {
      title: "Gestion des Sites",
      imgSrc: "assets/img/site.png",
      route: "sites.index",
      roles: ["Admin", "Manager", "Leader"], // Accessible to Admin and Manager
    },
    {
      title: "Gestion des rôles",
      imgSrc: "assets/img/roles.png",
      route: "roles.index",
      roles: ["Admin", "Leader"], // Only Admin can see this
    },
    {
      title: "Gestion des permissions",
      imgSrc: "assets/img/permissions.png",
      route: "permissions.index",
      roles: ["Admin", "Leader"], // Only Admin can see this
    },
    {
      title: "Gestion des types d'agents",
      imgSrc: "assets/img/typeAgents.png",
      route: "typeAds.index",
      roles: ["Admin", "Leader"], // Only Admin can see this
    },
    {
      title: "Gestion des types de poste",
      imgSrc: "assets/img/typePost.png",
      route: "typePosts.index",
      roles: ["Admin", "Manager", "Leader"], // Only Admin can see this
    },
    {
      title: "Gestion des Diplômes",
      imgSrc: "assets/img/diplomes.png",
      route: "diplomas.index",
      roles: ["Admin", "Manager", "Leader"], // Only Admin can see this
    },
    {
      title: "Gestion des contrats",
      imgSrc: "assets/img/contrat.png",
      route: "contrats.index",
      roles: ["Admin", "Leader"], // Only Admin can see this
    },
    {
      title: "Gestion des Cartes professionnelles",
      imgSrc: "assets/img/cartepro.png",
      route: "procards.index",
      badge: true,
      badgeCount: filteredUsersCount,
      roles: ["Admin", "Manager", "Leader"], // Accessible to Admin and HR
    },
    {
      title: "Gestion des devis et factures",
      imgSrc: "assets/img/facture.png",
      route: "estimateInvoice.index",
      roles: ["Admin", "Manager", "Leader"], // Accessible to Admin and Manager
    },
    {
      title: "Gestion des Incidents",
      imgSrc: "assets/img/incident.png",
      route: "incidents.index",
      roles: ["Admin", "Manager", "Leader"], // Accessible to Admin and HR
    },
    {
      title: "Gestion des jours Fériés",
      imgSrc: "assets/img/holiday.png",
      route: "holidays.index",
      roles: ["Admin", "Manager", "Leader"], // Accessible to Admin and Manager
    },
    {
      title: "Bilan horaires ",
      imgSrc: "assets/img/bilan.png",
      route: "HourlyReports.index",
      roles: ["Admin", "Manager", "Leader"], // Accessible to Admin and Manager
    },
  ];

  // Filter buttons based on user role
  const accessibleButtons = buttons.filter((button) =>
    button.roles.some((roleItem) => role.includes(roleItem))
  );

  // Add loading state for navigation
  const [loading, setLoading] = useState(false);

  // Handle button click to set loading state
  const handleButtonClick = () => {
    setLoading(true);
  };

  // Render badge component
  const renderBadge = (badgeCount) => {
    return (
      badgeCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-medium text-white bg-red-600 rounded-full animate-blink">
          {badgeCount}
        </span>
      )
    );
  };

  return (
    <AdminAuthenticatedLayout user={auth.user}>
      <Head title="Dashboard Admin" />
      <div className="pt-8">
        <div className="mx-auto px-5">
          {loading ? (
            <div className="flex justify-center items-center flex-col space-y-4 mt-40 animate-bounce">
              <img
                src="assets/img/logo2.png"
                alt="Logo"
                className="w-32 h-32 object-contain animate-pulse transition-transform transform hover:scale-110 shadow-lg rounded-full"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              {accessibleButtons.map((button, index) => (
                <Link
                  key={index}
                  href={route(button.route)}
                  onClick={handleButtonClick} // Set loading state to true when button is clicked
                  className="group relative flex flex-col items-center bg-white shadow-md hover:shadow-lg transition-shadow duration-200 p-3 rounded-md"
                >
                  {renderBadge(button.badgeCount)}

                  <img
                    src={button.imgSrc}
                    alt={button.title}
                    className="w-12 h-12 object-cover mb-2"
                  />
                  <h3 className="text-sm font-semibold text-gray-800 text-center">
                    {button.title}
                  </h3>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminAuthenticatedLayout>
  );
}
