
import NavLink from "@/Components/NavLink";


export default function NavBar() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="border-b border-gray-300 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Desktop Navigation */}
            <div className="hidden sm:flex sm:items-center sm:space-x-8">
              <NavLink
                href={route("dashboardAdmin")}
                active={route().current("dashboardAdmin")}
                className="text-gray-800 hover:text-gray-600"
              >
                Tableau de bord
              </NavLink>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
      </nav>
    </div>
  );
}


const updatedEvents = [
  ...deleteEvents, // Ajouter les événements restants après suppression
  ...newVacationEvents // Ajouter les nouveaux événements de vacances
];

// Afficher la mise à jour des events
console.log("Updated events:", updatedEvents);
