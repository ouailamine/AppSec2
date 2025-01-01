import React, { useState, useEffect } from "react";
import {
  mergeAllEvents,
} from "../Planning/CreatFunction";

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

const Dashboard = ({ plannings = [] ,sites}) => {

  
  console.log('plannings',plannings)
  const today = new Date();
  const currentWeekDates = getWeekDates(today);

  // Create a new Date to avoid mutating the state object
  const nextWeekStart = new Date(today);
  nextWeekStart.setDate(today.getDate() + 7);
  const nextWeekDates = getWeekDates(nextWeekStart);

  const [isNextWeek, setIsNextWeek] = useState(false);
  const [eventsWeek, setEventsWeek] = useState([]);
/*
  const allEvents = mergeAllEvents(plannings.flatMap(planning => planning.events));

console.log(allEvents);
console.log(currentWeekDates,nextWeekDates)
const eventsCurrentWeek = allEvents.filter(event => currentWeekDates.includes(event.selected_days));
const eventsNextWeek = allEvents.filter(event => nextWeekDates.includes(event.selected_days));

console.log("Events in current week:", eventsCurrentWeek);
console.log("Events in next week:", eventsNextWeek);*/


  // Helper function to filter events by selected days
  const filterEventsByWeek = (plannings, weekDates) => {
    return plannings
      .map((planning) => {
        const filteredEvents = planning.events.filter((event) =>
          weekDates.some((date) => event.selected_days.includes(date))
        );

        console.log(filteredEvents)
        if (filteredEvents.length > 0) {
          return {
            planning,
            events: mergeAllEvents(filteredEvents),
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

  console.log(eventsWeek); 
  

  // Group events by site_id
  const groupedBySiteId = eventsWeek.reduce((acc, { planning, events }) => {
    const { site_id } = planning;
    if (!acc[site_id]) {
      acc[site_id] = [];
    }
    acc[site_id].push({ planning, events });console.log(acc)
    return acc;
    
  }, {});

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Planning hebdomadaire 
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
        const siteName = sites.find((site)=>site.id == siteId).name;

        return (
          <div key={siteId} className="mb-8 border">
            <h2 className="text-2xl font-bold mb-4 mt-2 text-center">{siteName}</h2>
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
    // Regrouper les événements par utilisateur pour éviter les doublons
    const eventsByAgent = events.reduce((acc, event) => {
      if (!acc[event.userName]) {
        acc[event.userName] = [];
      }
      acc[event.userName].push(event);
      return acc;
    }, {});

    // Afficher chaque utilisateur avec ses événements
    return Object.entries(eventsByAgent).map(([agent, agentEvents], agentIndex) => (
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
          // Filtre les événements pour la date actuelle
          const eventsForDate = agentEvents.filter((event) =>
            event.selected_days.includes(date)
          );

          return (
            <td
              key={dateIndex}
              className={`border border-gray-300 px-4 py-2 text-center text-gray-600 ${
                dateIndex >= 5 ? "bg-blue-100 text-blue-700" : ""
              }`}
            >
              {eventsForDate.length > 0 ? (
                <div className="space-y-2">
                  {eventsForDate.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="block text-xs font-medium text-gray-800"
                    >
                      <span>{event.post}</span>
                      <br />
                      <span>{formatTime(event.vacation_start)}</span>
                      <br />
                      <span>{formatTime(event.vacation_end)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="block text-xs text-gray-400">Aucune vacation</span>
              )}
            </td>
          );
        })}
      </tr>
    ));
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
