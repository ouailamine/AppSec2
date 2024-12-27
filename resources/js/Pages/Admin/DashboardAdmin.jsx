import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function DashboardAdmin({
  auth,
  filteredUsersCount,
  filteredVacationsCount,
}) {
  const buttons = [
    {
      title: "Gestion des plannings",
      imgSrc: "assets/img/planning.png",
      route: "plannings.index",
    },
    {
      title: "Gestion des heures oubliés",
      imgSrc: "assets/img/catchEvent.png",
      route: "catchEvents.index",
      badge: true,
      badgeCount: filteredVacationsCount, // Utilisation de filteredVacationsCount
    },
    {
      title: "Gestion des employés",
      imgSrc: "assets/img/employes.png",
      route: "users.index",
    },
    /*{
      title: "Recherche des Agents",
      imgSrc: "assets/img/agents.png",
      route: "guards.index",
    },*/
    {
      title: "Gestion des Clients",
      imgSrc: "assets/img/customer.png",
      route: "customers.index",
    },
    {
      title: "Gestion des Sites",
      imgSrc: "assets/img/site.png",
      route: "sites.index",
    },
    {
      title: "Gestion des rôles",
      imgSrc: "assets/img/roles.png",
      route: "roles.index",
    },
    {
      title: "Gestion des permissions",
      imgSrc: "assets/img/permissions.png",
      route: "permissions.index",
    },
    {
      title: "Gestion des types d'agents",
      imgSrc: "assets/img/typeAgents.png",
      route: "typeAds.index",
    },
    {
      title: "Gestion des types de poste",
      imgSrc: "assets/img/typePost.png",
      route: "typePosts.index",
    },
    {
      title: "Gestion des Diplômes",
      imgSrc: "assets/img/diplomes.png",
      route: "diplomas.index",
    },
    {
      title: "Gestion des contrats",
      imgSrc: "assets/img/contrat.png",
      route: "contrats.index",
    },
    {
      title: "Gestion des Cartes professionnelles",
      imgSrc: "assets/img/cartepro.png",
      route: "procards.index",
      badge: true,
      badgeCount: filteredUsersCount, // Utilisation de filteredUsersCount
    },
    {
      title: "Gestion des devis et factures",
      imgSrc: "assets/img/facture.png",
      route: "estimateInvoice.index",
    },
    {
      title: "Gestion des Incidents",
      imgSrc: "assets/img/incident.png",
      route: "incidents.index",
    },
    {
      title: "Gestion des jours Fériés",
      imgSrc: "assets/img/holiday.png",
      route: "holidays.index",
    },
    {
      title: "Bilan horaires ",
      imgSrc: "assets/img/bilan.png",
      route: "HourlyReports.index",
    },
  ];

  return (
    <AdminAuthenticatedLayout user={auth.user}>
      <Head title="Dashboard Admin" />
      <div className="pt-8">
        <div className="mx-auto px-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {buttons.map((button, index) => (
              <Link
                key={index}
                href={route(button.route)}
                className="group relative flex flex-col items-center bg-white shadow-md hover:shadow-lg transition-shadow duration-200 p-3 rounded-md"
              >
                {button.badge && button.badgeCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-medium text-white bg-red-600 rounded-full animate-blink">
                    {button.badgeCount} {/* Utilisation de badgeCount ici */}
                  </span>
                )}

                {button.badge && button.badgeCount === 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-medium text-white bg-red-600 rounded-full">
                    {button.badgeCount}{" "}
                    {/* Si badgeCount est 0, pas de clignotement */}
                  </span>
                )}

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
        </div>
      </div>
    </AdminAuthenticatedLayout>
  );
}
