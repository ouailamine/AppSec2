import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import SelectField from "./SelectField";

import { getMonthOptions, calculateCatchEventTotals } from "./helpers";

const SearchBar = ({
  activeTab,
  setCurrentMonth,
  users,
  events,
  posts,
  catchEvents,
  sites,
}) => {
  const [localSelectedAgent, setLocalSelectedAgent] = useState("");
  const [tempMonth, setTempMonth] = useState("");
  const [tempYear, setTempYear] = useState("");
  const [searchType, setSearchType] = useState("mensuelle");
  const [filteredResults, setFilteredResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const isSearchDisabled = useMemo(() => {
    return (
      !localSelectedAgent ||
      !tempYear ||
      (searchType === "mensuelle" && !tempMonth)
    );
  }, [localSelectedAgent, tempYear, tempMonth, searchType]);

  const handleSearch = async () => {
    if (isSearchDisabled) return;

    setLoading(true);
    setShowResults(false);
    setCurrentMonth(`${tempYear}-${tempMonth}`);

    try {
      const filteredEvents = filterEvents(events);
      const agentPostTotals = aggregateEventData(filteredEvents);
      setFilteredResults(formatResults(agentPostTotals));
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
      // Optionnellement, définissez un état d'erreur ici pour informer l'utilisateur
    } finally {
      setLoading(false);
      setShowResults(true);
    }
  };

  const filterEvents = (events) => {
    return events.filter((event) => {
      const isAgentMatch = event.user_id === parseInt(localSelectedAgent);
      return (
        event.year === tempYear &&
        (searchType === "annuelle" || event.month === tempMonth) &&
        isAgentMatch &&
        event.work_duration !== "0:00"
      );
    });
  };

  const aggregateEventData = (events) => {
    return events.reduce((acc, event) => {
      const agentId = event.user_id;
      const post = event.post;
      const user = users.find((user) => user.id === agentId) || {};

      if (!acc[agentId]) {
        acc[agentId] = {};
      }
      if (!acc[agentId][post]) {
        acc[agentId][post] = {
          fullname: user.fullname,
          firstname: user.firstname,
          postName: post?.name,
          night_hours: 0,
          sunday_hours: 0,
          holiday_hours: 0,
          total_hours: 0,
        };
      }

      acc[agentId][post].night_hours += parseFloat(event.night_hours) || 0;
      acc[agentId][post].sunday_hours += parseFloat(event.sunday_hours) || 0;
      acc[agentId][post].holiday_hours += parseFloat(event.holiday_hours) || 0;
      acc[agentId][post].total_hours += parseFloat(event.work_duration) || 0;

      return acc;
    }, {});
  };

  const formatResults = (agentPostTotals) => {
    return Object.entries(agentPostTotals).flatMap(([agentId, posts]) => {
      const totalAgent = {
        night_hours: 0,
        sunday_hours: 0,
        holiday_hours: 0,
        total_hours: 0,
      };

      const rows = Object.entries(posts).map(([post, data]) => {
        totalAgent.night_hours += data.night_hours;
        totalAgent.sunday_hours += data.sunday_hours;
        totalAgent.holiday_hours += data.holiday_hours;
        totalAgent.total_hours += data.total_hours; // Ensure this is added

        return { agentId, post, ...data };
      });

      // Add the total row
      rows.push({
        agentId,
        post: "Total Général", // Adjusted to show total
        night_hours: totalAgent.night_hours,
        sunday_hours: totalAgent.sunday_hours,
        holiday_hours: totalAgent.holiday_hours,
        total_hours: totalAgent.total_hours,
        isTotal: true,
      });

      return rows;
    });
  };
  useEffect(() => {
    setLocalSelectedAgent("");
  }, [activeTab]);

  const groupedResults = useMemo(() => {
    return filteredResults.reduce((acc, result) => {
      console.log(result);
      if (!acc[result.agentId]) acc[result.agentId] = [];
      acc[result.agentId].push(result);
      return acc;
    }, {});
  }, [filteredResults]);

  const filteredCatchEvents = catchEvents.filter(
    (catchEvent) => catchEvent.user_id === parseInt(localSelectedAgent)
  );

  const totalCatchEvents = calculateCatchEventTotals(filteredCatchEvents);

  return (
    <div>
      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-end">
          <SelectField
            id="agent"
            label="Agent"
            value={localSelectedAgent}
            onChange={(e) => setLocalSelectedAgent(e.target.value)}
            options={users}
          />

          <SelectField
            id="searchType"
            label="Type de Recherche"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            options={[
              { id: "mensuelle", name: "Mensuelle" },
              { id: "annuelle", name: "Annuelle" },
            ]}
          />

          {searchType === "mensuelle" && (
            <SelectField
              id="month"
              label="Mois"
              value={tempMonth}
              onChange={(e) => setTempMonth(e.target.value)}
              options={getMonthOptions()}
            />
          )}

          <SelectField
            id="year"
            label="Année"
            value={tempYear}
            onChange={(e) => setTempYear(e.target.value)}
            options={Array.from({ length: 11 }, (_, index) => {
              const year = new Date().getFullYear() - index;
              return { id: year, name: year };
            }).reverse()}
          />

          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={handleSearch}
              className={`w-full inline-flex justify-center rounded-md border border-transparent bg-blue-600 text-white font-medium py-2 px-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:bg-blue-700 transition duration-200 ${
                isSearchDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSearchDisabled}
            >
              <span className="flex items-center">Recherche</span>
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <p className="mt-6 text-gray-600">Chargement des résultats...</p>
      )}

      {showResults && (
        <div className="card mt-2 bg-white shadow-md rounded-lg overflow-hidden border border-gray-300 ">
          {filteredResults.length === 0 && !loading ? (
            <p className="text-gray-600">
              Aucun résultat trouvé pour la période sélectionnée.
            </p>
          ) : (
            Object.keys(groupedResults).map((agentId) => (
              <div key={agentId}>
                <div className="card-header bg-gray">
                  <h2 className="text-lg font-bold">
                    Résultats de {groupedResults[agentId][0]?.fullname}{" "}
                    {groupedResults[agentId][0]?.firstname}
                  </h2>
                </div>
                <h3 className="text-lg font-semibold mt-2 mb-2 bg-gray-300 ">
                  Récapulatif du {tempMonth} {tempYear}
                </h3>
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-300">
                  <thead className="bg-gray-300">
                    <tr>
                      <th className="border-b border-gray-300 px-4 py-2 text-left text-gray-700 font-semibold">
                        Poste
                      </th>
                      <th className="border-b border-gray-300 px-4 py-2 text-left text-gray-700 font-semibold">
                        Heures
                      </th>
                      <th className="border-b border-gray-300 px-4 py-2 text-left text-gray-700 font-semibold">
                        Heures Férié
                      </th>
                      <th className="border-b border-gray-300 px-4 py-2 text-left text-gray-700 font-semibold">
                        Heures Nuit
                      </th>
                      <th className="border-b border-gray-300 px-4 py-2 text-left text-gray-700 font-semibold">
                        Heures Dimanche
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedResults[agentId].map((result, index) => (
                      <tr
                        key={index}
                        className={`${
                          result.isTotal
                            ? "font-bold bg-gray-300 text-black"
                            : ""
                        } hover:bg-gray-50 transition-colors duration-300`}
                      >
                        <td className="border-b border-gray-300 px-4 py-2">
                          {result.isTotal
                            ? "Total Général"
                            : posts.find(
                                (post) => post.abbreviation === result.post
                              )?.name || ""}
                        </td>

                        <td className="border-b border-gray-300 px-4 py-2">
                          {result.total_hours.toFixed(2)}
                        </td>
                        <td className="border-b border-gray-300 px-4 py-2">
                          {result.holiday_hours.toFixed(2)}
                        </td>
                        <td className="border-b border-gray-300 px-4 py-2">
                          {result.night_hours.toFixed(2)}
                        </td>
                        <td className="border-b border-gray-300 px-4 py-2">
                          {result.sunday_hours.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}

          <div>
            <div className="flex items-center my-2">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-2 text-red-500 font-bold">
                Vacation à rattraper
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <table className="min-w-full bg-red-100 shadow-md rounded-lg overflow-hidden border border-red-500">
              <thead className="bg-red-200">
                <tr>
                  <th className="border-b border-red-500 px-4 py-2 text-left text-red-700 font-semibold">
                    Site
                  </th>
                  <th className="border-b border-red-500 px-4 py-2 text-left text-red-700 font-semibold">
                    Poste
                  </th>

                  <th className="border-b border-red-500 px-4 py-2 text-left text-red-700 font-semibold">
                    Heures
                  </th>
                  <th className="border-b border-red-500 px-4 py-2 text-left text-red-700 font-semibold">
                    Heures Férié
                  </th>
                  <th className="border-b border-red-500 px-4 py-2 text-left text-red-700 font-semibold">
                    Heures Nuit
                  </th>
                  <th className="border-b border-red-500 px-4 py-2 text-left text-red-700 font-semibold">
                    Heures Dimanche
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCatchEvents.map((catchEvent, index) => (
                  <tr
                    key={index}
                    className="hover:bg-red-50 transition-colors duration-300"
                  >
                    <td className="border-b border-red-500 px-4 py-2">
                      {sites.find((site) => site.id === catchEvent.site_id)
                        ?.name || ""}
                    </td>
                    <td className="border-b border-red-500 px-4 py-2">
                      {posts.find(
                        (post) => post.abbreviation === catchEvent.post
                      )?.name || ""}
                    </td>

                    <td className="border-b border-red-500 px-4 py-2">
                      {parseFloat(catchEvent.hours || 0).toFixed(2)}
                    </td>
                    <td className="border-b border-red-500 px-4 py-2">
                      {parseFloat(catchEvent.holiday_hours || 0).toFixed(2)}
                    </td>
                    <td className="border-b border-red-500 px-4 py-2">
                      {parseFloat(catchEvent.night_hours || 0).toFixed(2)}
                    </td>
                    <td className="border-b border-red-500 px-4 py-2">
                      {parseFloat(catchEvent.sunday_hours || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="font-bold bg-red-300 text-black">
                  <td className="border-b border-red-500 px-4 py-2">
                    Total Général
                  </td>
                  <td className="border-b border-red-500 px-4 py-2"></td>
                  <td className="border-b border-red-500 px-4 py-2">
                    {totalCatchEvents.hours.toFixed(2)}
                  </td>
                  <td className="border-b border-red-500 px-4 py-2">
                    {totalCatchEvents.holiday_hours.toFixed(2)}
                  </td>
                  <td className="border-b border-red-500 px-4 py-2">
                    {totalCatchEvents.night_hours.toFixed(2)}
                  </td>
                  <td className="border-b border-red-500 px-4 py-2">
                    {totalCatchEvents.sunday_hours.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
