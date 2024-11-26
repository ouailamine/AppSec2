import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { format, isValid, parseISO, addDays, isAfter } from "date-fns";
import { fr } from "date-fns/locale";
import { SunIcon} from '@heroicons/react/24/outline';

// Function to get site details by site_id
const getSiteDetails = (siteId, sites) => {
  const site = sites.find((site) => site.id === siteId);
  return site || { name: "Non spécifié", address: "Non spécifié" };
};

// Function to format time in "H:M"
const formatTime = (time) => {
  if (!time || typeof time !== "string") return "Non spécifié";

  const [hours, minutes] = time.split(":");
  if (isNaN(hours) || isNaN(minutes)) return "Non spécifié";

  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));

  if (isNaN(date.getTime())) return "Non spécifié";

  return format(date, "HH:mm");
};

export default function NextFiveDays({ auth, planning, sites, posts }) {
  console.log(auth.user.registerNumber);
  const userFullName = auth.user ? auth.user.fullname : "Agent";
  const userFirstName = auth.user ? auth.user.firstname : "Agent";
  const userRegisterNumber = auth.user ? auth.user.registerNumber : "ABC0000";

  const currentDate = new Date();
  const fiveDaysLater = addDays(currentDate, 15);

  const events = planning[0]?.events || [];
  const filteredEvents = events.filter((event) => {
    const eventDate = parseISO(event.selected_days);
    return (
      isValid(eventDate) &&
      isAfter(eventDate, currentDate) &&
      isAfter(fiveDaysLater, eventDate)
    );
  });

  const sortedEvents = filteredEvents.sort((a, b) => {
    const dateA = parseISO(a.selected_days);
    const dateB = parseISO(b.selected_days);
    return dateA - dateB;
  });

  // Create a mapping from abbreviation to name
  const abbreviationToName = posts.reduce((acc, post) => {
    acc[post.abbreviation] = post.name;
    return acc;
  }, {});

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Tableau de bord" />

      <div className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-100 min-h-screen">
        {/* Greeting message */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Bonjour, {userFullName} {userFirstName}
          </h1>

          Matricule :{userRegisterNumber}
          <h2 className="text-lg font-semibold text-gray-700">
            Atalix Sécurité
          </h2>
        </div>

        {/* Section heading */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Vos Prochaines 5 Jours de Travail
          </h3>
        </div>

        {/* Cards for upcoming workdays */}
        <div className="space-y-4">
          {sortedEvents.length > 0 ? (
            sortedEvents.map((event, index) => {
              const eventDate = parseISO(event.selected_days);
              const isDateValid = isValid(eventDate);
              const siteDetails = getSiteDetails(planning[0].site_id, sites);

              return (
                <div
                key={index}
                className="bg-white shadow-md rounded-lg p-3 border border-gray-200"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
      <h4 className="text-xl font-semibold text-gray-900">
        {isDateValid
          ? format(eventDate, "dd MMM yyyy", { locale: fr })
          : "Date invalide"}
      </h4>
      <div className="flex items-center space-x-2">
       
        <SunIcon className="h-5 w-5 text-yellow-500" /> {/* Sun icon */}
      </div>
    </div>
                
                <div className="flex flex-col space-y-1 mb-2">
                  <div className="flex flex-wrap space-x-6 text-sm text-gray-700">
                    <div className="flex items-center space-x-2">
                     
                      <span>
                        <span className="font-semibold">Site: </span>
                        {siteDetails.name}, {siteDetails.address}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                     
                      <span>
                        <span className="font-semibold">Poste: </span>
                        {abbreviationToName[event?.post] || "Non spécifié"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">Horaire: </span>
                      {formatTime(event.vacation_start)} - {formatTime(event.vacation_end)}
                    </div>
                    <div>
                      <span className="font-semibold">Pause: </span>
                      {event.pause_payment === "Non-payable" ? (
                        <span className="text-red-500 font-bold">
                          Non-payable
                        </span>
                      ) : (
                        <span className="text-blue-500 font-bold">
                          Payable
                        </span>
                      )}{" "}
                      ({formatTime(event.pause_start)} - {formatTime(event.pause_end)})
                    </div>
                    
                  </div>
                </div>
              </div>
              );
            })
          ) : (
            <div className="bg-white shadow rounded-lg p-4 border border-gray-200 text-center text-gray-500">
              Aucun jour de travail à venir
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
