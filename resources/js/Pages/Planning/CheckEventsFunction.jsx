// Fonction pour calculer la durée du break entre deux événements
const calculateBreakTime = (start, end) => {
  console.log(`Calcul du temps de repos entre ${start} et ${end}`);
  const startTime = new Date(`1970-01-01T${start}:00`);
  const endTime = new Date(`1970-01-01T${end}:00`);
  let diff = (endTime - startTime) / (1000 * 60);
  console.log(`Différence en minutes: ${diff}`);
  return diff < 0 ? diff + 1440 : diff;
};

const getUserFullName = (userId, data) => {
  const user = data.find((user) => user.id == userId);
  console.log(`Utilisateur trouvé pour ID ${userId}:`, user);
  return user ? user.fullname : "agent inconnu";
};

// Fonction pour récupérer les semaines d'un mois
const getWeeksInMonth = (month, year) => {
  console.log(
    `Récupération des semaines pour le mois ${month} de l'année ${year}`
  );

  const weeks = [];
  const firstDayOfMonth = new Date(year, month, 1); // Premier jour du mois
  const lastDayOfMonth = new Date(year, month + 1, 0); // Dernier jour du mois

  // Ajuster la date de début au lundi de la semaine contenant le premier jour du mois
  let currentStart = new Date(firstDayOfMonth);
  if (currentStart.getDay() !== 1) {
    // Pas un lundi
    const offset = currentStart.getDay() === 0 ? 6 : currentStart.getDay() - 1;
    currentStart.setDate(currentStart.getDate() - offset);
  }

  while (currentStart <= lastDayOfMonth) {
    const weekStart = new Date(currentStart);
    const weekEnd = new Date(currentStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    // Assurez-vous que la semaine reste dans les limites du mois
    if (weekStart < firstDayOfMonth) {
      weekStart.setDate(firstDayOfMonth.getDate());
    }
    if (weekEnd > lastDayOfMonth) {
      weekEnd.setDate(lastDayOfMonth.getDate());
    }

    weeks.push({
      start: new Date(weekStart),
      end: new Date(weekEnd),
    });

    // Passer à la semaine suivante
    currentStart.setDate(currentStart.getDate() + 7);
  }

  console.log("Semaines calculées:", weeks);
  return weeks;
};

export const checkVacationsAndWeeklyHours = (
  events,
  newEvents,
  currentMonth,
  currentYear,
  users
) => {
  // Fusionner les événements existants et les nouveaux événements
  events = events.concat(newEvents);
  console.log("Liste des événements fusionnée:", events);

  // Vérification si la liste des événements est vide
  if (!events || events.length === 0) {
    console.log("Aucun événement à traiter.");
    return {
      isError: false,
      alerts: [],
      errors: [],
      workDurationByUser: {},
    };
  }

  // Groupement des événements par user_id
  const userGroups = {};

  events.forEach((event) => {
    if (!userGroups[event.user_id]) {
      userGroups[event.user_id] = [];
    }
    userGroups[event.user_id].push(event);
  });
  console.log("Groupes d'événements par user_id:", userGroups);

  // Fonction pour vérifier les événements d'un utilisateur
  const checkUserEvents = (userEvents, alerts, errors) => {
    console.log("Événements avant tri:", userEvents);
    userEvents.sort(
      (a, b) => new Date(a.selected_days) - new Date(b.selected_days)
    );
    console.log(
      `Événements triés pour l'utilisateur ${userEvents[0]?.user_id}:`,
      userEvents
    );

    for (let i = 0; i < userEvents.length - 1; i++) {
      const currentEvent = userEvents[i];
      const nextEvent = userEvents[i + 1];
      const userFullName = getUserFullName(userEvents[0].user_id, users);

      console.log("Vérification entre événements:", currentEvent, nextEvent);

      if (currentEvent.isSubEvent || nextEvent.isSubEvent) continue;

      // Vérification des événements le même jour
      if (currentEvent.selected_days === nextEvent.selected_days) {
        const breakTime = calculateBreakTime(
          currentEvent.vacation_end,
          nextEvent.vacation_start
        );
        console.log(
          `Temps de repos pour les événements le même jour: ${breakTime}`
        );
        if (breakTime < 660) {
          const alertMessage = `Alerte: Temps de repos insuffisant entre les vacations du ${currentEvent.selected_days} pour ${userFullName}`;
          console.log(alertMessage);
          alerts.push(alertMessage);
        }
      }

      // Vérification des événements de jours consécutifs
      const currentDate = new Date(currentEvent.selected_days);
      const nextDate = new Date(nextEvent.selected_days);
      const dateDiff = (nextDate - currentDate) / (1000 * 60 * 60 * 24);

      console.log(
        `Différence en jours entre ${currentEvent.selected_days} et ${nextEvent.selected_days}: ${dateDiff}`
      );

      if (dateDiff === 1) {
        const breakTime = calculateBreakTime(
          currentEvent.vacation_end,
          nextEvent.vacation_start
        );
        console.log(
          `Temps de repos pour les événements de jours consécutifs: ${breakTime}`
        );
        if (breakTime < 660) {
          const alertMessage = `Alerte: Temps de repos insuffisant entre les vacations du ${currentEvent.selected_days} au ${nextEvent.selected_days} pour ${userFullName}`;
          console.log(alertMessage);
          alerts.push(alertMessage);
        }
      }
    }
  };

  // Fonction pour formater les dates en "yyyy-mm-dd"
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Calculer la durée de travail par semaine
  const calculateWeeklyWorkDuration = (events, weeksInMonth) => {
    console.log("Calcul de la durée de travail par semaine...");
    const workDurationByUser = {};

    weeksInMonth.forEach((week) => {
      events.forEach((event) => {
        const { user_id, selected_days, work_duration } = event;
        const weekStart = formatDate(week.start);
        const weekEnd = formatDate(week.end);

        if (selected_days >= weekStart && selected_days <= weekEnd) {
          if (!workDurationByUser[user_id]) {
            workDurationByUser[user_id] = {};
          }

          const weekKey = `${weekStart} au ${weekEnd}`;
          if (!workDurationByUser[user_id][weekKey]) {
            workDurationByUser[user_id][weekKey] = 0;
          }

          workDurationByUser[user_id][weekKey] += work_duration;
        }
      });
    });

    console.log(
      "Durée de travail par utilisateur par semaine:",
      workDurationByUser
    );
    return workDurationByUser;
  };

  // Vérification des alertes de durée de travail
  const checkWorkDurationAlert = (workDurationByUser, errors) => {
    console.log("Vérification des alertes sur la durée de travail...");
    Object.keys(workDurationByUser).forEach((user_id) => {
      const userWeeks = workDurationByUser[user_id];
      const userFullName = getUserFullName(user_id, users);

      Object.keys(userWeeks).forEach((weekKey) => {
        const totalWorkDuration = userWeeks[weekKey];
        console.log(
          `Durée totale de travail pour ${userFullName} pendant la semaine ${weekKey}: ${totalWorkDuration}`
        );
        if (totalWorkDuration > 2880) {
          const errorMessage = `Alerte: La durée de travail de la semaine ${weekKey} de ${userFullName} dépasse 48 heures (${
            totalWorkDuration / 60
          } heures).`;
          console.log(errorMessage);
          errors.push(errorMessage);
        }
      });
    });
  };

  const checkEventConflicts = (userGroups) => {
    const conflicts = [];

    Object.keys(userGroups).forEach((userId) => {
      const userEvents = userGroups[userId];

      userEvents.sort((a, b) => {
        const dateA = new Date(a.selected_days);
        const dateB = new Date(b.selected_days);
        return (
          dateA - dateB ||
          timeToMinutes(a.vacation_start) - timeToMinutes(b.vacation_start)
        );
      });

      for (let i = 0; i < userEvents.length - 1; i++) {
        const event1 = userEvents[i];
        const event2 = userEvents[i + 1];

        // Vérifier si les événements sont le même jour
        if (event1.selected_days === event2.selected_days) {
          const start1 = timeToMinutes(event1.vacation_start);
          const end1 = timeToMinutes(event1.vacation_end);
          const start2 = timeToMinutes(event2.vacation_start);
          const end2 = timeToMinutes(event2.vacation_end);

          // Vérification des chevauchements
          if (start1 < end2 && start2 < end1) {
            conflicts.push({
              userId,
              conflict: { event1, event2 },
            });

            console.log(
              `Conflit détecté pour l'utilisateur ${userId} le ${event1.selected_days} :`,
              `Événement 1 (${event1.vacation_start} - ${event1.vacation_end}), `,
              `Événement 2 (${event2.vacation_start} - ${event2.vacation_end})`
            );
          }
        }
      }
    });

    return conflicts;
  };

  const alerts = [];
  const errors = [];

  for (const userId in userGroups) {
    console.log(`Vérification des événements pour l'utilisateur ${userId}`);
    checkUserEvents(userGroups[userId], alerts, errors);
  }
  console.log(currentMonth, currentYear);

  const weeksInMonth = getWeeksInMonth(
    Number(currentMonth - 1),
    Number(currentYear)
  );

  const workDurationByUser = calculateWeeklyWorkDuration(events, weeksInMonth);
  checkWorkDurationAlert(workDurationByUser, errors);

  const conflicts = checkEventConflicts(userGroups);
  if (conflicts.length > 0) {
    conflicts.forEach(({ userId, conflict }) => {
      const { event1, event2 } = conflict;
      const userFullName = getUserFullName(userId, users);
      const alertMessage =
        `Conflit détecté pour ${userFullName} le ${event1.selected_days} : ` +
        `(${event1.vacation_start} - ${event1.vacation_end}) chevauche ` +
        `(${event2.vacation_start} - ${event2.vacation_end}).`;
      alerts.push(alertMessage);
    });
  }

  const isError = alerts.length > 0;
  console.log("Résultats finaux:", {
    isError,
    alerts,
    errors,
    workDurationByUser,
  });

  return {
    isError: alerts.length > 0 || errors.length > 0,
    alerts,
    errors,
    workDurationByUser,
  };
};

// Fonction utilitaire pour convertir une heure au format HH:MM en minutes totales
export const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};
