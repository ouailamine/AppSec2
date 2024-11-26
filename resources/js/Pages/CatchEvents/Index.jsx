import React, { useState, useMemo } from "react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head } from "@inertiajs/react";
import AddHoursModal from "./AddHoursModal";
import DetailModal from "./DetailModal";
import ValidationModal from "./ValidationModal";
import Select from "react-select";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

const CatchEvent = ({ users, sites, catchEvents, posts }) => {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedIsRuler, setSelectedIsRuler] = useState("false"); // Filtrer par isRuler
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modals, setModals] = useState({
    addHours: false,
    detail: false,
    validation: false,
  });

  const toggleModal = (modalName, event = null) => {
    setSelectedEvent(event);
    setModals((prev) => ({ ...prev, [modalName]: !prev[modalName] }));
  };

  const getUserDetails = (userId) => {
    const user = users.find((user) => user.id == userId) || {};
    return {
      fullname: user.fullname || "Inconnu",
      firstname: user.firstname || "",
    };
  };

  const getSiteName = (siteId) => {
    const site = sites.find((site) => site.id == siteId);
    return site ? site.name : "Site Inconnu";
  };

  const getPostName = (postAb) => {
    const postName = posts.find((post) => post.abbreviation == postAb);
    return postName ? postName.name : "Site Inconnu";
  };

  // Filtrer les événements par agent et par isRuler
  const filteredEvents = useMemo(() => {
    return catchEvents.filter((event) => {
      const userMatch = selectedUser === "" || event.user_id == selectedUser;
      const isRulerMatch =
        selectedIsRuler === "" ||
        (selectedIsRuler === "true" && event.isRuler) ||
        (selectedIsRuler === "false" && !event.isRuler);
      return userMatch && isRulerMatch;
    });
  }, [catchEvents, selectedUser, selectedIsRuler]);

  const userOptions = users.map((user) => ({
    value: user.id,
    label: `${user.fullname} ${user.firstname}`,
  }));

  return (
    <AdminAuthenticatedLayout>
      <Head title="Tableau de Bord Admin" />
      <div className="container mx-auto py-8 px-4 lg:px-0">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
          Vacations Rattraper
        </h1>

        {/* Add Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => toggleModal("addHours")}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Ajouter Heures
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center items-center">
          {/* Filter by agent */}
          <Select
            options={userOptions}
            onChange={(selectedOption) =>
              setSelectedUser(selectedOption ? selectedOption.value : "")
            }
            className="w-full sm:w-64 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Par agent"
            isClearable
          />

          {/* Filter by vacation type */}
          <select
            id="isRuler"
            value={selectedIsRuler}
            onChange={(e) => setSelectedIsRuler(e.target.value)}
            className="w-full sm:w-64 border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes les vacations</option>
            <option value="true">Vacations validées</option>
            <option value="false">Vacations non validées</option>
          </select>
        </div>

        {/* Grouped Events */}
        {Object.entries(
          filteredEvents.reduce((acc, event) => {
            const userId = event.user_id;
            acc[userId] = acc[userId] ? [...acc[userId], event] : [event];
            return acc;
          }, {})
        ).map(([userId, events]) => {
          const { fullname, firstname } = getUserDetails(userId);
          return (
            <div
              key={userId}
              className="bg-white shadow-md rounded-lg mb-6 overflow-hidden border border-gray-300"
            >
              <div className="bg-blue-600 text-white p-2">
                <h2 className="text font-semibold">{`${fullname} ${firstname}`}</h2>
              </div>
              <div className="p-2">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-1 px-2 border-b text-left text-gray-600">
                        Poste
                      </th>
                      <th className="py-1 px-2 border-b text-left text-gray-600">
                        Site
                      </th>
                      <th className="py-1 px-2 border-b text-left text-gray-600">
                        Hrs Dimanche
                      </th>
                      <th className="py-1 px-2 border-b text-left text-gray-600">
                        Hrs Fériés
                      </th>
                      <th className="py-1 px-2 border-b text-left text-gray-600">
                        Hrs Nuit
                      </th>
                      <th className="py-1 px-2 border-b text-left text-gray-600">
                        Heures
                      </th>
                      <th className="py-1 px-2 border-b text-left text-gray-600">
                        Paniers
                      </th>
                      <th className="py-1 px-2 border-b text-left text-gray-600">
                        Réglé
                      </th>
                      <th className="py-1 px-2 border-b text-left text-gray-600">
                        Facturé
                      </th>
                      <th className="py-1 px-2 border-b"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr
                        key={event.id}
                        className="hover:bg-gray-50 transition duration-200"
                      >
                        <td className="py-1 px-2 border-b">
                          {getPostName(event.post)}
                        </td>
                        <td className="py-1 px-2 border-b">
                          {getSiteName(event.site_id)}
                        </td>
                        <td className="py-1 px-2 border-b">
                          {event.sunday_hours || "0"}
                        </td>
                        <td className="py-1 px-2 border-b">
                          {event.holiday_hours || "0"}
                        </td>
                        <td className="py-1 px-2 border-b">
                          {event.night_hours || "0"}
                        </td>
                        <td className="py-1 px-2 border-b">
                          {event.hours || "0"}
                        </td>
                        <td className="py-1 px-2 border-b">
                          {event.lunchAllowance || "0"}
                        </td>
                        <td className="py-1 px-2 border-b text-center">
                          {event.isRuler ? (
                            <CheckIcon
                              className="h-5 w-5 text-green-500 inline"
                              aria-hidden="true"
                            />
                          ) : (
                            <XMarkIcon
                              className="h-5 w-5 text-red-500 inline"
                              aria-hidden="true"
                            />
                          )}
                        </td>
                        <td className="py-1 px-2 border-b text-center">
                          {event.isBilled ? (
                            <CheckIcon
                              className="h-5 w-5 text-green-500 inline"
                              aria-hidden="true"
                            />
                          ) : (
                            <XMarkIcon
                              className="h-5 w-5 text-red-500 inline"
                              aria-hidden="true"
                            />
                          )}
                        </td>
                        <td className="text-center py-1 px-2 border-b">
                          <button
                            onClick={() => toggleModal("detail", event)}
                            className="bg-blue-500 text-white font-medium hover:bg-blue-600 transition duration-200 px-2 py-1 text-sm rounded-md shadow-sm mr-2" // Added margin-right for spacing
                          >
                            Voir
                          </button>

                          {!event.isRuler && (
                            <>
                              <button
                                onClick={() => toggleModal("addHours", event)} // Moved "Modifier" button to the front
                                className="bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition duration-200 px-2 py-1 text-sm rounded-md shadow-sm mr-2" // Added margin-right for spacing
                              >
                                Modifier
                              </button>

                              <button
                                onClick={() => toggleModal("validation", event)}
                                className="bg-green-500 text-white font-medium hover:bg-green-600 transition duration-200 px-2 py-1 text-sm rounded-md shadow-sm"
                              >
                                Valider
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}

        {/* Modales */}
        {modals.addHours && (
          <AddHoursModal
            isOpen={modals.addHours}
            onClose={() => toggleModal("addHours")}
            event={selectedEvent}
            sites={sites}
            users={users}
            posts={posts}
          />
        )}
        {modals.detail && selectedEvent && (
          <DetailModal
            isOpen={modals.detail}
            onClose={() => toggleModal("detail")}
            event={selectedEvent}
            getUserDetails={getUserDetails}
            getSiteName={getSiteName}
            posts={posts}
          />
        )}
        {modals.validation && selectedEvent && (
          <ValidationModal
            isOpen={modals.validation}
            onClose={() => toggleModal("validation")}
            event={selectedEvent}
          />
        )}
      </div>
    </AdminAuthenticatedLayout>
  );
};

export default CatchEvent;
