import React, { useState, useEffect } from "react";

// Helper function to get the week dates
const getWeekDates = (date) => {
  const day = date.getDay(); // 0 (Dimanche) à 6 (Samedi)
  const monday = new Date(date);
  monday.setDate(date.getDate() - ((day + 6) % 7)); // Se déplace jusqu'au lundi
  return Array.from({ length: 7 }, (_, i) => {
    const currentDate = new Date(monday);
    currentDate.setDate(monday.getDate() + i);
    return currentDate.toISOString().split("T")[0]; // Format yyyy-mm-dd
  });
};

const formatTime = (timeString) => {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  return `${hours}:${minutes}`;
};

const Dashboard = ({ plannings = [] }) => {
  const today = new Date();
  const currentWeekDates = getWeekDates(today);

  // Create a new Date to avoid mutating the state object
  const nextWeekStart = new Date(today);
  nextWeekStart.setDate(today.getDate() + 7);
  const nextWeekDates = getWeekDates(nextWeekStart);

  const [isNextWeek, setIsNextWeek] = useState(false);
  const [eventsWeek, setEventsWeek] = useState([]);

  // Helper function to filter events by selected days
  const filterEventsByWeek = (plannings, weekDates) => {
    return plannings
      .map((planning) => {
        const filteredEvents = planning.events.filter((event) =>
          weekDates.some((date) => event.selected_days.includes(date))
        );
        if (filteredEvents.length > 0) {
          return {
            planning,
            events: filteredEvents,
          };
        }
        return null;
      })
      .filter(Boolean); // Remove null values
  };

  // Update events when week selection changes
  useEffect(() => {
    const results = isNextWeek
      ? filterEventsByWeek(plannings, nextWeekDates)
      : filterEventsByWeek(plannings, currentWeekDates);
    setEventsWeek(results);
  }, [isNextWeek, plannings]);

  const dayAbbreviations = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const displayedWeekDates = isNextWeek ? nextWeekDates : currentWeekDates;

  console.log(eventsWeek); // Debugging the filtered events

  // Group events by site_id
  const groupedBySiteId = eventsWeek.reduce((acc, { planning, events }) => {
    const { site_id } = planning;
    if (!acc[site_id]) {
      acc[site_id] = [];
    }
    acc[site_id].push({ planning, events });
    return acc;
  }, {});

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Planning des Agents
      </h1>

      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => setIsNextWeek(false)}
          className={`px-6 py-2 rounded-md shadow-md font-medium transition-all duration-200 ${
            !isNextWeek
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
        >
          Semaine actuelle
        </button>
        <button
          onClick={() => setIsNextWeek(true)}
          className={`px-6 py-2 rounded-md shadow-md font-medium transition-all duration-200 ${
            isNextWeek
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
        >
          Semaine suivante
        </button>
      </div>

      {/* Render a table for each site_id */}
      {Object.keys(groupedBySiteId).map((siteId) => {
        const siteEvents = groupedBySiteId[siteId];

        return (
          <div key={siteId} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Site ID: {siteId}</h2>
            <div className="overflow-x-auto rounded-lg shadow-lg">
              <table className="w-full table-auto border-collapse bg-white">
                <thead>
                  <tr className="bg-gray-200 text-gray-800">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Agent
                    </th>
                    {displayedWeekDates.map((date, index) => (
                      <th
                        key={index}
                        className={`border border-gray-300 px-4 py-2 text-center font-semibold ${
                          index >= 5
                            ? "bg-blue-300 text-blue-800"
                            : "text-gray-700"
                        }`}
                      >
                        {dayAbbreviations[index]} <br />
                        <span className="text-sm text-gray-600">
                          {new Date(date).getDate()}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {siteEvents.map(({ planning, events }) => {
                    // Extract unique agents for this site
                    const agents = [
                      ...new Set(events.map((event) => event.userName)),
                    ];

                    return agents.map((agent, agentIndex) => {
                      const agentEvents = events.filter(
                        (event) => event.userName === agent
                      );

                      return (
                        <tr
                          key={agentIndex}
                          className={`hover:bg-gray-100 ${
                            agentIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }`}
                        >
                          <td className="border border-gray-300 px-4 py-2 text-gray-700 font-medium">
                            {agent}
                          </td>
                          {displayedWeekDates.map((date, dateIndex) => {
                            const eventForDate = agentEvents.find((event) =>
                              event.selected_days.includes(date)
                            );

                            return (
                              <td
                                key={dateIndex}
                                className={`border border-gray-300 px-4 py-2 text-center text-gray-600 ${
                                  dateIndex >= 5
                                    ? "bg-blue-100 text-blue-700"
                                    : ""
                                }`}
                              >
                                {eventForDate ? (
                                  <span className="block text-xs font-medium text-gray-800">
                                    {eventForDate.post}
                                    {"\n"}
                                    {formatTime(eventForDate.vacation_start)}
                                    {"\n"}
                                    {formatTime(eventForDate.vacation_end)}
                                  </span>
                                ) : (
                                  <span className="block text-xs text-gray-400">
                                    Aucune vacation
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    });
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;
