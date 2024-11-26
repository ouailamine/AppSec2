export const validateSelections = (selectedSite,currentMonth) => {
  if (!selectedSite) {
    setAlertMessage("Veuillez sélectionner un site.");
    setAlertType("error");
    return false;
  }
  if (currentMonth === undefined) {
    setAlertMessage("Veuillez sélectionner un mois.");
    setAlertType("error");
    return false;
  }
  return true;
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

export const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Fonction pour calculer les heures de nuit
export const calculateNightHours = (start, end) => {
  const nightStart = timeToMinutes("21:00"); // Début de la période de nuit (21:00)
  const nightEnd = timeToMinutes("06:00");   // Fin de la période de nuit (06:00)

  let startInMinutes = timeToMinutes(start);
  let endInMinutes = timeToMinutes(end);

  // Si l'événement traverse minuit, ajouter 1440 minutes (24 heures) à la fin
  if (endInMinutes < startInMinutes) {
    endInMinutes += 1440; // Ajouter 24 heures pour la période après minuit
  }

  let nightMinutes = 0;

  // Cas où l'événement chevauche la période de nuit
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

  return (nightMinutes / 60).toFixed(2); // Convertir en heures avec 2 décimales
};



// Fonction pour créer les événements de vacation
export const createVacationEvents = (
start,
end,
selectedDay,
            pauseStart,
            pauseEnd,
            pausePayment
) => {
  console.log
  let events = [];
  let startInMinutes = timeToMinutes(start);
  let endInMinutes = timeToMinutes(end);


  // Si la pause est non-payable, on calcule la durée de la pause
  const breakDuration = pausePayment === "Non-payable" 
    ? calculateDurationInMinutes(pauseStart, pauseEnd) 
    : 0;

  // Vérifier si selectedDay est un tableau de dates, sinon en faire un tableau avec une seule date
  let daysToProcess = Array.isArray(selectedDay) ? selectedDay : [selectedDay];

  // Traitement de chaque jour dans selectedDay
  daysToProcess.forEach((day) => {
    // Si l'événement dépasse minuit
    if (endInMinutes < startInMinutes) {
      // Premier segment : de l'heure de début à 00:00 du jour sélectionné
      let workDurationFirstSegment = calculateDurationInMinutes(start, "00:00");

      // Si la pause est avant minuit, on la déduit du premier segment
      if (pauseStart < "00:00" && pauseEnd <= "00:00") {
        workDurationFirstSegment -= breakDuration; // Utiliser breakDuration pour ajuster la durée du travail
      }
      workDurationFirstSegment = workDurationFirstSegment > 0 ? workDurationFirstSegment : 0;

      // Calcul de lunchAllowance pour le premier segment
      const lunchAllowanceFirstSegment = workDurationFirstSegment >= 360 ? 1 : 0; // 360 minutes = 6 hours

      // Ajout du premier segment
      events.push({
        start: start,
        end: "00:00",
        date: day,
        work_duration: workDurationFirstSegment, // Durée ajustée pour ce segment
        night_hours: calculateNightHours(start, "00:00"), // Heures de nuit pour ce segment
        pauseStart: pauseStart < "00:00" ? pauseStart : "", // Ajouter pauseStart seulement si dans ce segment
        pauseEnd: pauseEnd <= "00:00" ? pauseEnd : "", // Ajouter pauseEnd seulement si dans ce segment
        lunchAllowance: lunchAllowanceFirstSegment, // Lunch allowance pour le premier segment
      });

      // Calculer le jour suivant
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1); // Ajouter un jour

      // Deuxième segment : de 00:00 à l'heure de fin le jour suivant
      let workDurationSecondSegment = calculateDurationInMinutes("00:00", end);

      // Si la pause commence après minuit, on la déduit du deuxième segment
      if (pauseStart >= "00:00") {
        workDurationSecondSegment -= breakDuration; // Utiliser breakDuration pour ajuster la durée du travail
      }

      workDurationSecondSegment = workDurationSecondSegment > 0 ? workDurationSecondSegment : 0;

      // Calcul de lunchAllowance pour le deuxième segment (toujours 0)
      const lunchAllowanceSecondSegment = 0;

      // Ajout du deuxième segment
      events.push({
        start: "00:00",
        end: end,
        date: nextDay.toISOString().split("T")[0], // Format YYYY-MM-DD
        work_duration: workDurationSecondSegment, // Durée ajustée pour ce segment
        night_hours: calculateNightHours("00:00", end), // Heures de nuit pour ce segment
        pauseStart: pauseStart >= "00:00" ? pauseStart : "", // Ajouter pauseStart seulement si dans ce segment
        pauseEnd: pauseEnd >= "00:00" ? pauseEnd : "", // Ajouter pauseEnd seulement si dans ce segment
        lunchAllowance: lunchAllowanceSecondSegment, // Lunch allowance pour le deuxième segment (0)
      });
    } else {
      // Si l'événement ne dépasse pas minuit, un seul événement est nécessaire
      let totalWorkDuration = calculateDurationInMinutes(start, end);

      // Si la pause est entièrement dans la période, on la déduit
      if (pauseStart >= start && pauseEnd <= end) {
        totalWorkDuration -= breakDuration; // Utiliser breakDuration pour ajuster la durée du travail
      }

      totalWorkDuration = totalWorkDuration > 0 ? totalWorkDuration : 0;

      // Calcul de lunchAllowance pour l'événement entier
      const lunchAllowance = totalWorkDuration >= 360 ? 1 : 0; // 360 minutes = 6 hours

      // Ajout de l'événement pour une seule journée
      events.push({
        start: start,
        end: end,
        date: day,
        work_duration: totalWorkDuration, // Durée totale ajustée
        night_hours: calculateNightHours(start, end), // Heures de nuit pour la période complète
        pauseStart: pauseStart, // Inclure pauseStart
        pauseEnd: pauseEnd, // Inclure pauseEnd
        lunchAllowance: lunchAllowance, // Lunch allowance pour cet événement
      });
    }
  });

  return events;
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

// Function to check if time is within a range
export const isTimeInRange = (time, startTime, endTime) => {
  const [timeH, timeM] = time.split(":").map(Number);
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);

  const timeInMinutes = timeH * 60 + timeM;
  const startInMinutes = startH * 60 + startM;
  const endInMinutes = endH * 60 + endM;

  return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
};

export const getDaysInMonth = (month, year) =>
  new Date(year, month + 1, 0).getDate();

export const filterHolidaysForMonth = (holidays, month, year) => {
  return holidays.filter((holiday) => {
    const date = new Date(holiday.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });
};

export const workDurationToMinutes = (duration) => {
  const [hours, minutes] = duration.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
};

export const minutesToHoursMinutes = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}:${minutes}`;
};

export const getAllDaysInMonth = (month, year) => {
  const days = [];
  const date = new Date(year, month - 1, 1);
  while (date.getMonth() === month - 1) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    days.push(`${year}-${month}-${day}`);
    date.setDate(date.getDate() + 1);
  }
  return days;
};

/*// Fonction pour calculer les heures hebdomadaires pour chaque agent
const calculateWeeklyHours = () => {
  const weeklyHoursByAgent = {};

  // Fonction pour obtenir la clé de la semaine à partir d'une date
  const getWeekKey = (date) => {
    const start = startOfWeek(new Date(date), { weekStartsOn: 1 }); // Début de la semaine (lundi)
    const end = endOfWeek(new Date(date), { weekStartsOn: 1 }); // Fin de la semaine
    return `${format(start, "yyyy-MM-dd")} - ${format(end, "yyyy-MM-dd")}`;
  };

  events.forEach((event) => {
    const { user_id, work_duration, selected_days } = event;

    // Initialiser l'utilisateur si ce n'est pas déjà fait
    if (!weeklyHoursByAgent[user_id]) {
      weeklyHoursByAgent[user_id] = {};
    }

    // Extraire les heures et les minutes de la durée de travail
    const [hours, minutes] = work_duration.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;

    // Obtenir la clé de la semaine pour cet événement
    const weekKey = getWeekKey(selected_days);

    // Initialiser la semaine si ce n'est pas encore fait
    if (!weeklyHoursByAgent[user_id][weekKey]) {
      weeklyHoursByAgent[user_id][weekKey] = 0;
    }

    // Ajouter la durée de travail en minutes à la semaine correspondante
    weeklyHoursByAgent[user_id][weekKey] += totalMinutes;
  });

  // Convertir les minutes en format HH:MM et retourner les heures hebdomadaires
  return Object.keys(weeklyHoursByAgent).map((user_id) => {
    const weeks = weeklyHoursByAgent[user_id];
    const weeksFormatted = Object.keys(weeks).map((weekKey) => {
      const totalMinutes = weeks[weekKey];
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      return {
        week: weekKey,
        totalHours: `${hours}:${minutes.toString().padStart(2, "0")}`,
      };
    });

    return {
      user_id,
      weeklyHours: weeksFormatted,
    };
  });
};

<div>
  <h3>Heures Hebdomadaires pour chaque agent</h3>
  <ul>
    {calculateWeeklyHours().map((agent) => (
      <li key={agent.user_id}>
        Agent ID: {agent.user_id}
        <ul>
          {agent.weeklyHours.map((week) => (
            <li key={week.week}>
              Semaine: {week.week}, Heures hebdomadaires: {week.totalHours}
            </li>
          ))}
        </ul>
      </li>
    ))}
  </ul>
</div>*/
