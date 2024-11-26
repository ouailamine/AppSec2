const handleEditEvent = (updatedEvent) => {
    console.log("Updated Event:", updatedEvent);

    // Filter existing events with the same IDs as the updated event
    const filteredEvents = events.filter((event) =>
        updatedEvent.id.includes(event.id)
    );
    const filtredId = filteredEvents.map((event) => event.id);
    const selectedDays = filteredEvents.map((event) => event.selected_days);
    
    console.log("Filtered Events:", filteredEvents);
    console.log("Selected Days:", selectedDays);
    console.log("Filtered IDs:", filtredId);

    // Create events to handle cases where the event spans midnight
    const vacationEvents = createVacationEvents(
        updatedEvent.vacation_start,
        updatedEvent.vacation_end,
        selectedDays,
        updatedEvent.pause_start,
        updatedEvent.pause_end,
        updatedEvent.pause_payment
    );
    console.log("Vacation Events:", vacationEvents);

    // Initialize updated events based on existing events
    let updatedEvents = [...events];

    const breakDuration = updatedEvent.pause_payment === "Non-payable"
        ? calculateDurationInMinutes(updatedEvent.pause_start, updatedEvent.pause_end)
        : 0;

    console.log("Break Duration:", breakDuration);

    // If the vacation events length matches filtered events, update each event's details
    if (vacationEvents.length === filteredEvents.length) {
        updatedEvents = updatedEvents.map((event) => {
            if (filtredId.includes(event.id)) {
                const workDurations = vacationEvents.map(vacationEvent => vacationEvent.work_duration);
                const workDuration = workDurations[0] - breakDuration;
                
                // Format work duration in "HH:mm" format
                const hours = Math.floor(workDuration / 60);
                const minutes = workDuration % 60;
                const workDurationFormatted = `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;

                return {
                    ...event,
                    pause_start: updatedEvent.pause_start,
                    pause_end: updatedEvent.pause_end,
                    pause_payment: updatedEvent.pause_payment,
                    post: updatedEvent.post,
                    typePost: updatedEvent.typePost,
                    vacation_start: updatedEvent.vacation_start,
                    vacation_end: updatedEvent.vacation_end,
                    work_duration: workDurationFormatted,
                };
            }
            return event;
        });
      } else if (vacationEvents.length > filteredEvents.length) {
        // Step 1: Remove filtered events from the list by their ids
        const updatedEvents = events.filter(event => !filtredId.includes(event.id));
        console.log('Updated Events after removal:', updatedEvents); // Debugging removed events
      
        // Step 2: Find the maximum ID in the existing events
        const maxId = Math.max(...events.map(event => event.id), 0);  // Get the max ID or 0 if no events
        console.log('Maximum ID in existing events:', maxId); // Debugging max ID
      
        // Helper function to convert minutes into "hh:mm" format
        const convertToHHMM = (minutes) => {
          const hours = Math.floor(minutes / 60);
          const mins = minutes % 60;
          return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
        };
      
        // Step 3: Map vacationEvents and assign new IDs by incrementing the max ID
        const newVacationEvents = vacationEvents.map((vacation, index) => {
          if (!vacation.start || !vacation.end || !vacation.work_duration) {
            console.error('Vacation event is missing required fields:', vacation); // Debugging missing fields
            return null; // Skip this vacation event if it's missing required data
          }
      
          // Convert work_duration to "hh:mm" format if it's in minutes
          const formattedWorkDuration = convertToHHMM(vacation.work_duration);
      
          return {
            id: maxId + index + 1,  // Assign a new ID by incrementing the max ID
            holiday_hours: "0:00",  // Adjust if needed
            lunchAllowance: 1,
            night_hours: "0.00",  // Adjust if necessary
            pause_end: "",  // Adjust if necessary
            pause_payment: "Payable", 
            pause_start: "",
            post: "S3J",  // Adjust if needed
            selectedEvents: [vacation.id],  // Adjust how selected events are set
            selected_days: vacation.date,  // Assuming 'selected_days' maps to 'date'
            sunday_hours: "0:00",  // Adjust if needed
            typePost: "2",  // Adjust if needed
            user_id: 24,  // Update if needed based on current user context
            vacation_end: vacation.end,
            vacation_start: vacation.start,
            work_duration: formattedWorkDuration,  // Set formatted work_duration in "hh:mm" format
          };
        }).filter(event => event !== null); // Remove any null values from invalid vacation events
      
        console.log('New Vacation Events:', newVacationEvents); // Debugging newly mapped vacation events
      
        // Step 4: Add vacation events to the updated list of events
        if (newVacationEvents.length > 0) {
          setEvents(prevEvents => {
            // Step 5: Combine updated events (after removal) with new vacation events
            const allEvents = [...updatedEvents, ...newVacationEvents];
            console.log('All Events after adding vacation events:', allEvents); // Debugging final list of events
            return allEvents;  // Return the new state, triggering a re-render
          });
        } else {
          console.warn('No valid vacation events to add.');  // Debugging if no valid events were mapped
        }
      }
      
      
    
    

    console.log(events)
    // Update the state with the modified events
    setEvents(updatedEvents);
};


const createEventsForUsers = () => {
  // Valider les champs nécessaires avant de créer des événements
  if (!validateSelectionCreateEvent()) {
    return;
  }

  // Calculer la durée de la pause si elle n'est pas payable
  const breakDuration =
    pause_payment === "Non-payable" ? calculateDurationInMinutes(pause_start, pause_end) : 0;

  // Dernier ID utilisé
  let lastId = 0;

  // Créer un ensemble des dates de jours fériés pour des recherches rapides
  const holidayDates = new Set(holidays.map((holiday) => holiday.date));

  // Obtenir les dimanches du mois en format YYYY-MM-DD
  const sundays = getSundays(currentMonth + 1, currentYear).map(
    (date) => date.toISOString().split("T")[0]
  );

  // Créer de nouveaux événements pour chaque utilisateur et chaque jour sélectionné
  const newEvents = selectedUsers
    .flatMap((user) =>
      selected_days.flatMap((date) => {
        // Créer les événements pour gérer le cas où la vacation traverse minuit
        const vacationEvents = createVacationEvents(vacation_start, vacation_end, date);

        console.log(vacationEvents)

        return vacationEvents.map((vacationEvent, index) => {
          // Incrémenter le dernier ID
          const currentId = ++lastId;

          // Calculer la durée de travail ajustée pour chaque événement
          const adjustedWorkDuration = vacationEvent.work_duration - breakDuration;
          const hours = Math.floor(adjustedWorkDuration / 60);
          const minutes = adjustedWorkDuration % 60;
          const workDurationFormatted = `${hours}:${minutes.toString().padStart(2, "0")}`;

          // Déterminer le montant de l'indemnité de déjeuner
          const lunchAllowance = adjustedWorkDuration >= 360 ? (index === 0 ? 1 : 0) : 0;

          // Calculer les heures de nuit
          const nightHours = calculateNightHours(vacationEvent.start, vacationEvent.end);

          // Déterminer si la date est un jour férié ou un dimanche
          const isHoliday = holidayDates.has(vacationEvent.date);
          const isSunday = sundays.includes(vacationEvent.date);

          // Retourner un objet événement pour chaque combinaison utilisateur/date
          return {
            id: currentId,
            user_id: user.value, // ID utilisateur
            post: selectedPost,
            typePost: selectedTypePost,
            vacation_start: vacationEvent.start,
            vacation_end: vacationEvent.end,
            lunchAllowance: lunchAllowance, // Utilisation de la nouvelle variable lunchAllowance
            pause_payment: pause_payment === "oui" ? "Payable" : "Non-payable",
            pause_start,
            pause_end,
            selected_days: vacationEvent.date, // Date spécifique pour cet événement
            work_duration: workDurationFormatted, // Durée de travail ajustée
            night_hours: nightHours, // Heures de nuit calculées pour ce segment
            holiday_hours: isHoliday ? workDurationFormatted : "0:00", // Heures fériées
            sunday_hours: isSunday ? workDurationFormatted : "0:00", // Heures du dimanche
          };
        });
      })
    )
    .flat();

  // Mettre à jour les événements existants en ajoutant les nouveaux
  setEvents((prevEvents) => [...prevEvents, ...newEvents]);

  // Réinitialiser le formulaire après la création des événements
  resetForm();

  // Afficher un message de succès
  setAlertMessage("Événements créés avec succès !");
  setAlertType("success");
};