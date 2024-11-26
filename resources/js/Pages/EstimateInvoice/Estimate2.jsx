import React, { useState } from "react";
import AddEvent from "./AddEvent"; // Import your modal component
import {
  createVacationEvents,
  getSundays,
  checkVacationsAndWeeklyHours,
  validateSelections,
  compareEvents,
} from "../Planning/CreatFunction2";

const Estimate = ({ typePosts, posts, holidays }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // 1-based month
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventsNextMonth, setEventsNextMonth] = useState([]);
   // State to manage modal visibility

  const years = Array.from({ length: 10 }, (_, index) => currentYear + index);

  const handleMonthChange = (event) => {
    setCurrentMonth(Number(event.target.value));
  };

  const handleYearChange = (event) => {
    setCurrentYear(Number(event.target.value));
  };

  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
  ];

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const createEventsFromAddEvent = (addEvent) => {

    console.log(addEvent)
    // Dernier ID utilisé
    const maxExistingId =
      events.length > 0 ? Math.max(...events.map((event) => event.id)) : 0;
    let currentId = maxExistingId === 0 ? 1 : maxExistingId + 1;

    // Créer un ensemble des dates de jours fériés pour des recherches rapides
    const holidayDates = new Set(holidays.map((holiday) => holiday.date));

    // Obtenir les dimanches du mois en format YYYY-MM-DD
    const sundays = getSundays(currentMonth, currentYear).map(
      (date) => date.toISOString().split("T")[0]
    );

   

    const newEvents = (addEvent.selectedUsersDays || []).flatMap((date) => {
      // Generate vacation events for the given date
      const vacationAllEvents = createVacationEvents(
        addEvent.vacation_start,
        addEvent.vacation_end,
        date, // Pass the correct date here
        addEvent.pause_start,
        addEvent.pause_end,
        addEvent.pause_payment
      );
    
      // Destructure the returned vacation events
      const { events: vacationEvents, eventsNextMonth: vacationEventsNextMonth } = vacationAllEvents;
    
      // Log to ensure we have the expected vacation events
      console.log(vacationEvents);
    
      // Check if the date is a holiday or Sunday
      const isHoliday = holidayDates.has(date);
      const isSunday = sundays.includes(date);
    
      // Map over vacation events (assuming vacationEvents is an array)
      return vacationEvents.map((event) => ({
        id: currentId, // Assuming currentId is defined elsewhere
        user_id: [1], // User ID for this event
        post: addEvent.post,
        typePost: addEvent.typePost,
        vacation_start: event.vacation_start, // Accessing properties from each event
        vacation_end: event.vacation_end,
        lunchAllowance: event.lunchAllowance || 0, // Meal allowance
        pause_payment: event.pause_payment,
        pause_start: event.pause_start || "",
        pause_end: event.pause_end || "",
        selected_days: event.selectedDays, // Specific date for this event
        work_duration: event.work_duration, // Adjusted work duration
        night_hours: event.night_hours, // Calculated night hours
        holiday_hours: isHoliday ? event.work_duration : 0, // Holiday hours
        sunday_hours: isSunday ? event.work_duration : 0, // Sunday hours
        isSubEvent: event.isSubEvent,
        relatedEvent: event.relatedEvent,
      }));
    });
    
    // Assuming `setEvents` is a function that accepts the new event array
    setEvents(newEvents);
    
  
 
       
  
        // Afficher un message de succès
        let msg = "Vacation(s) créé(s) avec succès !";
     console.log(msg)
      
    };

    console.log('events',events)

  const handleCreateEvent = (newEvent)=>{

    

    console.log(newEvent)
  }

  return (
    <div className="bg-white border border-gray-300 rounded-md shadow-md p-1 space-y-2">
      <div className="flex justify-between space-x-4 mb-4">
        <div className="flex-1">
          <label htmlFor="monthSelect" className="block text-sm font-medium text-gray-700">
            Mois
          </label>
          <select
            id="monthSelect"
            value={currentMonth}
            onChange={handleMonthChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {months.map((month, index) => (
              <option key={index} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="yearSelect" className="block text-sm font-medium text-gray-700">
            Année
          </label>
          <select
            id="yearSelect"
            value={currentYear}
            onChange={handleYearChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={openModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Ajouter l'événement
        </button>
      </div>

      {/* Conditionally render the AddEvent modal */}
      {isModalOpen && 
        <AddEvent 
          onClose={closeModal} 
          typePosts={typePosts} 
          posts={posts} 
          holidays={holidays} 
          currentMonth={currentMonth}
          currentYear={currentYear}
          add={createEventsFromAddEvent}
        />
      }
    </div>
  );
};


export default Estimate;
