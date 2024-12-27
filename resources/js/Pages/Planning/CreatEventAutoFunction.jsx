export const createAutoEventsForUsers = ({
  users,
  month,
  year,
  typePost,
  post,
  vacationStart,
  vacationEnd,
  pauseStart,
  pauseEnd,
  monthlyHours,
  maxWeeklyHours,
  agentsPerDay
}) => {
  const daysInMonth = new Date(year, month, 0).getDate(); // Total days in the month
  const weeksInMonth = Math.ceil(daysInMonth / 7); // Weeks in the month
  const events = [];

  // Function to generate a unique event ID
  const generateEventId = (existingEvents) => {
    const maxExistingId = existingEvents.length > 0 ? Math.max(...existingEvents.map((event) => event.id)) : 0;
    return maxExistingId === 0 ? 1 : maxExistingId + 1;
  };

  // Create vacation events for a user (This function should handle vacation logic)
  const createVacationEvents = (vacationStart, vacationEnd, date, pauseStart, pauseEnd, pausePayment) => {
    // Vacation event structure, you can adjust based on requirements
    const vacationEvent = {
      vacation_start: vacationStart || '10:00',
      vacation_end: vacationEnd || '20:00',
      pause_start: pauseStart || '',
      pause_end: pauseEnd || '',
      pause_payment: pausePayment || 0,
      selectedDays: date,
      work_duration: 8, // Example work duration, adjust as needed
      night_hours: 0, // Example, you can modify this
      holiday_hours: 0, // Example, you can modify this
      sunday_hours: 0, // Example, you can modify this
      isSubEvent: false,
      relatedEvent: null
    };
    return { events: [vacationEvent], eventsNextMonth: [] }; // You can adjust the logic for the next month if needed
  };

  // Iterate through each user to create events
  users.forEach(user => {
    let userMonthlyHours = 0;
    let userWeeklyHours = 0;
    let currentDay = 1;

    // Generate events for each day in the month
    for (let week = 0; week < weeksInMonth; week++) {
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        if (currentDay > daysInMonth) break;

        // Check if the user has already reached their monthly hour limit
        if (userMonthlyHours >= monthlyHours) break;

        // Calculate the start and end time for the day's shift
        const workStart = vacationStart || '10:00';
        const workEnd = vacationEnd || '20:00';
        const pauseStartTime = pauseStart || '';
        const pauseEndTime = pauseEnd || '';

        // Calculate the daily working hours (adjust this as per your calculation)
        let dailyWorkHours = 8; // Default work hours (you can modify this logic)

        // Ensure weekly hours limit is respected
        if (userWeeklyHours + dailyWorkHours > maxWeeklyHours) {
          dailyWorkHours = maxWeeklyHours - userWeeklyHours; // Adjust hours if exceeding max weekly hours
        }

        userMonthlyHours += dailyWorkHours;
        userWeeklyHours += dailyWorkHours;

        // Format the date with zero-padded month and day
        const formattedMonth = String(month).padStart(2, '0');
        const formattedDay = String(currentDay).padStart(2, '0');
        const eventDate = `${year}-${formattedMonth}-${formattedDay}`;

        // Create event for the current day
        const addEvent = {
          user_id: user.id,
          date: eventDate,
          start: workStart,
          end: workEnd,
          pauseStart: pauseStartTime,
          pauseEnd: pauseEndTime,
          post: post,
          typePost: typePost,
          selected_users_days: [
            {
              user_id: user.id,
              selected_days: eventDate,
            }
          ]
        };

        // Handle vacation or other special events
        const vacationEvents = createVacationEvents(vacationStart, vacationEnd, eventDate, pauseStart, pauseEnd, 0);

        // Process vacation events
        vacationEvents.events.forEach((vacationEvent) => {
          const currentId = generateEventId(events);
          events.push({
            id: currentId,
            user_id: user.id,
            userName: user.name || user.userName || 'Unknown User', // Ensure user name is correctly fetched
            post: addEvent.post,
            postName: post, // Assuming 'post' contains the post name, adjust accordingly
            typePost: addEvent.typePost,
            vacation_start: vacationEvent.vacation_start,
            vacation_end: vacationEvent.vacation_end,
            pause_start: vacationEvent.pause_start,
            pause_end: vacationEvent.pause_end,
            selected_days: vacationEvent.selectedDays,
            work_duration: vacationEvent.work_duration,
            night_hours: vacationEvent.night_hours,
            holiday_hours: vacationEvent.holiday_hours,
            sunday_hours: vacationEvent.sunday_hours,
            isSubEvent: vacationEvent.isSubEvent,
            relatedEvent: vacationEvent.relatedEvent,
          });
        });

        // Add the standard work event
        const currentId = generateEventId(events);
        events.push({
          id: currentId,
          ...addEvent,
        });

        // Move to the next day
        currentDay++;
      }
    }
  });

  console.log('Generated events:', events);
  return events;
};
