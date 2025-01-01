import React, { useState, useEffect } from "react";
import { mergeAllEvents } from "../Planning/CreatFunction";

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

const Dashboard = ({ plannings = [], sites }) => {
  console.log("plannings", plannings);
  const today = new Date();
  const currentWeekDates = getWeekDates(today);

  // Create a new Date to avoid mutating the state object
  const nextWeekStart = new Date(today);
  nextWeekStart.setDate(today.getDate() + 7);
  const nextWeekDates = getWeekDates(nextWeekStart);

  const [isNextWeek, setIsNextWeek] = useState(false);
  const [eventsWeek, setEventsWeek] = useState([]);

  const allEvents = mergeAllEvents(plannings.flatMap(planning => planning.events));

console.log(allEvents);
console.log(currentWeekDates,nextWeekDates)
const eventsCurrentWeek = allEvents.filter(event => currentWeekDates.includes(event.selected_days));
const eventsNextWeek = allEvents.filter(event => nextWeekDates.includes(event.selected_days));

console.log("Events in current week:", eventsCurrentWeek);
console.log("Events in next week:", eventsNextWeek);

  const dayAbbreviations = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const displayedWeekDates = isNextWeek ? nextWeekDates : currentWeekDates;

  console.log(eventsWeek);

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
      return (
      <div  className="mb-8 border">
        <h2 className="text-2xl font-bold mb-4 mt-2 text-center">
          site id : 
        </h2>
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full table-auto border-collapse bg-white">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                  Agent
                </th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
      );
    </div>
  );
};

export default Dashboard;
