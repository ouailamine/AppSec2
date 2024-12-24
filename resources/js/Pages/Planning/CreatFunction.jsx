export const months = [
  { value: "1", label: "Janvier" },
  { value: "2", label: "Février" },
  { value: "3", label: "Mars" },
  { value: "4", label: "Avril" },
  { value: "5", label: "Mai" },
  { value: "6", label: "Juin" },
  { value: "7", label: "Juillet" },
  { value: "8", label: "Août" },
  { value: "9", label: "Septembre" },
  { value: "10", label: "Octobre" },
  { value: "11", label: "Novembre" },
  { value: "12", label: "Décembre" },
];

import { v4 as uuidv4 } from "uuid";
const getLastDayOfMonth = (currentMonth, currentYear) => {
  // Le mois dans le constructeur Date est basé sur 0 (janvier = 0, février = 1, etc.)
  // Donc, on utilise currentMonth - 1 pour obtenir le bon mois.
  const lastDay = new Date(currentYear, currentMonth, 0);

  // Format de la date : yyyy-mm-dd
  const year = lastDay.getFullYear();
  const month = String(lastDay.getMonth() + 1).padStart(2, "0"); // Le mois est 0-indexé, donc on ajoute 1
  const day = String(lastDay.getDate()).padStart(2, "0"); // Ajoute un 0 devant si nécessaire

  return `${year}-${month}-${day}`;
};

export const getSundays = (month, year) => {
  const sundays = [];
  // Déterminer le premier jour du mois
  const date = new Date(year, month - 1, 0); // Les mois commencent à 0 dans Date
  // Déterminer le jour de la semaine du premier jour du mois
  const firstDay = date.getDay();

  // Trouver le premier dimanche du mois
  const firstSunday = firstDay === 0 ? 1 : 7 - firstDay + 1;

  // Ajouter les dimanches au tableau
  for (
    let day = firstSunday;
    day <= new Date(year, month - 1 + 1, 0).getDate();
    day += 7
  ) {
    const sundayDate = new Date(year, month - 1, day);
    sundays.push(sundayDate);
  }

  return sundays;
};
export const calculateDurationInMinutes = (start, end) => {
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);

  const duration =
    endMinutes >= startMinutes
      ? endMinutes - startMinutes
      : 1440 - startMinutes + endMinutes;

  return duration;
};

export const timeToMinutes = (time) => {
  if (!time || typeof time !== "string") {
    console.error("timeToMinutes a reçu une valeur invalide :", time);
    return 0; // Retourne une valeur par défaut
  }

  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Fonction pour calculer les heures de nuit
export const calculateNightHours = (
  start,
  end,
  pauseStart,
  pauseEnd,
  pausePayment
) => {
  const nightStart = timeToMinutes("21:00"); // Début de la période de nuit (21:00)
  const nightEnd = timeToMinutes("06:00"); // Fin de la période de nuit (06:00)

  let startInMinutes = timeToMinutes(start);
  let endInMinutes = timeToMinutes(end);

  // Si l'événement traverse minuit, ajouter 1440 minutes (24 heures) à la fin
  if (endInMinutes < startInMinutes) {
    endInMinutes += 1440; // Ajouter 24 heures pour la période après minuit
  }

  let nightMinutes = 0;

  // Calculer la durée de la pause en minutes
  let pauseDuration = 0;
  if (pauseStart && pauseEnd) {
    let pauseStartInMinutes = timeToMinutes(pauseStart);
    let pauseEndInMinutes = timeToMinutes(pauseEnd);

    // Si la pause traverse minuit, ajuster l'heure de fin
    if (pauseEndInMinutes < pauseStartInMinutes) {
      pauseEndInMinutes += 1440;
    }

    // Calculer la durée de la pause
    pauseDuration = pauseEndInMinutes - pauseStartInMinutes;
  }

  // Si l'événement chevauche la période de nuit
  if (startInMinutes < nightEnd || endInMinutes >= nightStart) {
    // Si l'événement commence avant 6h du matin
    if (startInMinutes < nightEnd) {
      nightMinutes += Math.min(endInMinutes, nightEnd) - startInMinutes;
    }

    // Si l'événement se termine après 21h
    if (endInMinutes > nightStart) {
      nightMinutes += endInMinutes - Math.max(startInMinutes, nightStart);
    }
  }

  // Si pausePayment est "non", soustraire la durée de la pause des heures de nuit
  if (pausePayment === "no") {
    nightMinutes -= pauseDuration;
  }

  // S'assurer que nightMinutes ne soit pas négatif
  nightMinutes = Math.max(nightMinutes, 0);

  return nightMinutes; // Convertir en heures avec 2 décimales
};

// Fonction pour créer les événements de vacation
export const createVacationEvents = (
  start,
  end,
  selectedDay,
  pauseStart,
  pauseEnd,
  pausePayment,
  currentMonth,
  currentYear,
  holidays
) => {
  const sundays = getSundays(currentMonth, currentYear).map(
    (date) => date.toISOString().split("T")[0] // Format each Sunday as YYYY-MM-DD
  );

  console.log(sundays);

  const isSunday = (date) => {
    return sundays.includes(date); // Check if the date exists in the Sundays array
  };

  const isHoliday = (date) => {
    return holidays.includes(date);
  };
  console.log(isHoliday);

  let events = [];
  let eventsNextMonth = [];
  let startInMinutes = timeToMinutes(start);
  let endInMinutes = timeToMinutes(end);
  let MidnightInMinutes = timeToMinutes("24:00");
  let pauseStartInMinutes = timeToMinutes(pauseStart);
  let pauseEndInMinutes = timeToMinutes(pauseEnd);

  // Calcul de la durée de la pause si elle est non-payée
  const breakDuration =
    pausePayment === "no"
      ? calculateDurationInMinutes(pauseStart, pauseEnd)
      : 0;

  // Assurer que selectedDay est un tableau
  let daysToProcess = Array.isArray(selectedDay) ? selectedDay : [selectedDay];

  // Processus pour chaque jour dans selectedDay
  daysToProcess.forEach((day) => {
    let relatedEvent = null;

    if (endInMinutes < startInMinutes) {
      // Event crosses midnight, process in two segments

      relatedEvent = uuidv4().slice(0, 8);
      // Calculer le jour suivant
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      const nextDayFormat = nextDay.toISOString().split("T")[0];
      const lastDayOfMonth = getLastDayOfMonth(currentMonth, currentYear);

      // Premier segment : du début à minuit (00:00) le jour sélectionné
      let workDurationFirstSegment = MidnightInMinutes - startInMinutes;

      // Deuxième segment : de minuit (00:00) à l'heure de fin du jour suivant
      let workDurationSecondSegment = endInMinutes;

      // Calcul de la pause et ajustement des durées
      let pauseDurationFirstSegment = 0;
      let pauseDurationSecondSegment = 0;
      let includeStartPauseFirstSegment = "";
      let includeEndPauseFirstSegment = "";
      let includeStartPauseSecondSegment = "";
      let includeEndPauseSecondSegment = "";
      let includeEndPausePaymantFirstSegment = "yes";
      let includeEndPausePaymantSecondSegment = "yes";
      console.log(pausePayment);

      // Pause entièrement dans le premier segment
      if (
        pauseStartInMinutes >= startInMinutes &&
        pauseEndInMinutes <= MidnightInMinutes &&
        pauseEndInMinutes > startInMinutes &&
        pausePayment === "no"
      ) {
        pauseDurationFirstSegment = pauseEndInMinutes - pauseStartInMinutes;
        workDurationFirstSegment -= pauseDurationFirstSegment;

        pauseDurationSecondSegment = 0;
        workDurationSecondSegment -= pauseDurationSecondSegment;

        includeStartPauseFirstSegment = pauseStart;
        includeEndPauseFirstSegment = pauseEnd;
        includeStartPauseSecondSegment = "";
        includeEndPauseSecondSegment = "";
        includeEndPausePaymantFirstSegment = "no";
        includeEndPausePaymantSecondSegment = "noBreak";
      }
      // Pause qui traverse minuit : prendre seulement la partie avant minuit
      else if (
        pauseStartInMinutes >= startInMinutes &&
        pauseEndInMinutes < MidnightInMinutes &&
        pauseEndInMinutes < endInMinutes &&
        pausePayment == "no"
      ) {
        pauseDurationFirstSegment = MidnightInMinutes - pauseStartInMinutes;
        workDurationFirstSegment -= pauseDurationFirstSegment;

        pauseDurationSecondSegment = pauseEndInMinutes;
        workDurationSecondSegment -= pauseDurationSecondSegment;

        includeStartPauseFirstSegment = pauseStart;
        includeEndPauseFirstSegment = "00:00";
        includeStartPauseSecondSegment = "00:00";
        includeEndPauseSecondSegment = pauseEnd;
        includeEndPausePaymantFirstSegment = "no";
        includeEndPausePaymantSecondSegment = "no";
      }
      // Pause entièrement dans le 2 segment
      else if (
        pauseStartInMinutes < startInMinutes &&
        pauseEndInMinutes <= MidnightInMinutes &&
        pauseEndInMinutes < startInMinutes &&
        pausePayment == "no"
      ) {
        pauseDurationFirstSegment = 0;
        workDurationFirstSegment -= pauseDurationFirstSegment;

        pauseDurationSecondSegment = pauseEndInMinutes - pauseStartInMinutes;
        workDurationSecondSegment -= pauseDurationSecondSegment;

        includeStartPauseFirstSegment = "";
        includeEndPauseFirstSegment = "";
        includeStartPauseSecondSegment = pauseStart;
        includeEndPauseSecondSegment = pauseEnd;
        includeEndPausePaymantFirstSegment = "noBreak";
        includeEndPausePaymantSecondSegment = "no";
      }

      // Allocation du lunchAllowance
      const lunchAllowance =
        workDurationFirstSegment + workDurationSecondSegment >= 360 ? 1 : 0;

      if (nextDayFormat > lastDayOfMonth) {
        // First segment event
        events.push({
          vacation_start: start,
          vacation_end: "00:00",
          selectedDays: day,
          work_duration: workDurationFirstSegment,
          sunday_hours: isSunday(nextDayFormat) ? workDurationFirstSegment : 0,
          holiday_hours: isHoliday(nextDayFormat)
            ? workDurationFirstSegment
            : 0,
          night_hours: calculateNightHours(
            start,
            "00:00",
            pauseStart,
            "00:00",
            pausePayment
          ),
          pause_payment: includeEndPausePaymantFirstSegment,
          pause_start: includeStartPauseFirstSegment,
          pause_end: includeEndPauseFirstSegment,
          lunchAllowance: lunchAllowance,
          relatedEvent: relatedEvent, // Link to the second segment
          isSubEvent: false,
        });

        // Second segment event
        eventsNextMonth.push({
          vacation_start: "00:00",
          vacation_end: end,
          selectedDays: nextDayFormat,
          work_duration: workDurationSecondSegment,
          sunday_hours: isSunday(nextDayFormat) ? workDurationSecondSegment : 0,
          holiday_hours: isHoliday(nextDayFormat)
            ? workDurationSecondSegment
            : 0,
          night_hours: calculateNightHours(
            "00:00",
            end,
            "00:00",
            pauseEnd,
            pausePayment
          ),
          pause_payment: includeEndPausePaymantSecondSegment,
          pause_start: includeStartPauseSecondSegment,
          pause_end: includeEndPauseSecondSegment,
          lunchAllowance: 0,
          isSubEvent: true, // Mark as sub-event
          relatedEvent: relatedEvent, // Link to the first segment
        });
      } else {
        events.push({
          vacation_start: start,
          vacation_end: "00:00",
          selectedDays: day,
          work_duration: workDurationFirstSegment,
          sunday_hours: isSunday(day) ? workDurationFirstSegment : 0,
          holiday_hours: isHoliday(day) ? workDurationFirstSegment : 0,
          night_hours: calculateNightHours(
            start,
            "00:00",
            pauseStart,
            "00:00",
            pausePayment
          ),
          pause_payment: includeEndPausePaymantFirstSegment,
          pause_start: includeStartPauseFirstSegment,
          pause_end: includeEndPauseFirstSegment,
          lunchAllowance: lunchAllowance,
          relatedEvent: relatedEvent, // Link to the second segment
          isSubEvent: false,
        });

        events.push({
          vacation_start: "00:00",
          vacation_end: end,
          selectedDays: nextDayFormat,
          work_duration: workDurationSecondSegment,
          sunday_hours: isSunday(nextDayFormat) ? workDurationSecondSegment : 0,
          holiday_hours: isHoliday(nextDayFormat)
            ? workDurationSecondSegment
            : 0,
          night_hours: calculateNightHours(
            "00:00",
            end,
            "00:00",
            pauseEnd,
            pausePayment
          ),
          pause_payment: includeEndPausePaymantSecondSegment,
          pause_start: includeStartPauseSecondSegment,
          pause_end: includeEndPauseSecondSegment,
          lunchAllowance: workDurationSecondSegment >= 360 ? 1 : 0, // Corrected conditional logic for lunch allowance
          isSubEvent: true, // Mark as sub-event
          relatedEvent: relatedEvent, // Link to the first segment
        });
      }
    } else {
      // Case where the event does not cross midnight, one segment only

      let totalWorkDuration = calculateDurationInMinutes(start, end);

      // Deduct break time if the break is fully within the working period
      let pauseIncludedSingleSegment = "";
      if (pauseStart >= start && pauseEnd <= end && pausePayment === "no") {
        totalWorkDuration -= breakDuration;
        pauseIncludedSingleSegment =
          breakDuration > 0 ? `${pauseStart} - ${pauseEnd}` : "";
      }
      totalWorkDuration = Math.max(totalWorkDuration, 0);

      const lunchAllowance = totalWorkDuration >= 360 ? 1 : 0;

      // No need for sub-event or related event when it's a single segment
      events.push({
        vacation_start: start,
        vacation_end: end,
        selectedDays: day,
        pause_payment: pausePayment,
        work_duration: totalWorkDuration,
        sunday_hours: isSunday(day) ? totalWorkDuration : 0,
        holiday_hours: isHoliday(day) ? totalWorkDuration : 0,
        night_hours: calculateNightHours(
          start,
          end,
          pauseStart,
          pauseEnd,
          pausePayment
        ),
        pause_start: pauseStart,
        pause_end: pauseEnd,
        lunchAllowance: lunchAllowance,
        isSubEvent: false,
        relatedEvent: null,
      });
    }
  });

  // Return both events and eventsNextMonth
  return { events, eventsNextMonth };
};

///// pour le tableau
export const getDaysInMonth = (month, year) =>
  new Date(year, month + 1, 0).getDate();

export const filterHolidaysForMonth = (holidays, month, year) => {
  return holidays.filter((holiday) => {
    const date = new Date(holiday);
    return date.getMonth() === month && date.getFullYear() === year;
  });
};

export const minutesToHoursMinutes = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}:${minutes}`;
};

export const mergeAllEvents = (events) => {
  console.log(events);
  if (!events || events.length === 0) return []; // Return empty array if no events are provided

  // Check if relatedEvent is null or undefined in any of the events
  const hasRelatedEvent = events.some(
    (event) => event.relatedEvent !== null && event.relatedEvent !== undefined
  );

  // If no event has relatedEvent or it's all null/undefined, return the events unchanged
  if (!hasRelatedEvent) return events;

  const mergedEvents = [];

  console.log("events", events);

  // Detect the key to group by ('relatedEvent' or 'relatedEventId')
  const groupingKey = "relatedEvent";

  // Group events by the determined key
  const groupedByRelatedEvent = events.reduce((acc, event) => {
    const key = event[groupingKey] || "unrelated"; // Fallback for unrelated events
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(event);
    return acc;
  }, {});

  console.log(groupedByRelatedEvent);

  // Process each group
  Object.entries(groupedByRelatedEvent).forEach(([key, group]) => {
    if (key === "unrelated") {
      // Directly add all unrelated events to the mergedEvents array
      mergedEvents.push(...group);
    } else {
      const parentEvent = group.find((event) => !event.isSubEvent); // Find parent event
      const subEvents = group.filter((event) => event.isSubEvent); // Filter sub-events

      if (parentEvent && subEvents.length > 0) {
        // Merge parent with each sub-event
        subEvents.forEach((subEvent) => {
          const mergedEvent = {
            id: [parentEvent.id, subEvent.id], // Merge IDs
            userName: parentEvent.userName,
            pause_end: parentEvent.pause_end,
            pause_payment: parentEvent.pause_payment,
            pause_start: parentEvent.pause_start,
            post: parentEvent.post,
            selected_days: parentEvent.selected_days, // Use parent's selected_days
            typePost: parentEvent.typePost,
            user_id: parentEvent.user_id,
            vacation_end: subEvent.vacation_end,
            vacation_start: parentEvent.vacation_start,
            work_duration: parentEvent.work_duration + subEvent.work_duration, // Sum work durations
          };

          mergedEvents.push(mergedEvent);
        });
      } else if (parentEvent) {
        // Add parent event alone if no sub-events exist
        mergedEvents.push(parentEvent);
      } else {
        // Add orphan sub-events if necessary
        mergedEvents.push(...subEvents);
      }
    }
  });

  console.log(mergedEvents);
  return mergedEvents;
};

export function getUserName(users, user_id) {
  const user = users.find((user) => user.id == user_id);
  if (!user) {
    return "Inconnu"; // If user is not found, return "Inconnu Inconnu"
  }
  const userFullName = user.fullname;
  const userFirstName = user.firstname;
  return `${userFullName} ${userFirstName}`;
}

export function getPostName(posts, abbreviation) {
  const post = posts.find((p) => p.abbreviation === abbreviation);

  if (!post) {
    throw new Error(`Post with abbreviation '${abbreviation}' not found`);
  }

  return post.name;
}
