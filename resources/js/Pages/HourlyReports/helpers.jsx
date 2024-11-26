// helpers.jsx
export const getMonthOptions = () => {
  return Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    name: new Date(0, index).toLocaleString("default", { month: "long" }),
  }));
};

export const calculateCatchEventTotals = (events) => {
  return events.reduce(
    (totals, event) => ({
      hours: totals.hours + parseFloat(event.hours || 0),
      holiday_hours:
        totals.holiday_hours + parseFloat(event.holiday_hours || 0),
      night_hours: totals.night_hours + parseFloat(event.night_hours || 0),
      sunday_hours: totals.sunday_hours + parseFloat(event.sunday_hours || 0),
    }),
    { hours: 0, holiday_hours: 0, night_hours: 0, sunday_hours: 0 }
  );
};

export const filterEvents = (events, searchCriteria) => {
  const { localSelectedAgent, tempYear, tempMonth, searchType } =
    searchCriteria;

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

export const aggregateEventData = (events, users) => {
  return events.reduce((acc, event) => {
    const agentId = event.user_id;
    const post = event.post;
    const user = users.find((user) => user.id === agentId) || {};

    if (!acc[agentId]) acc[agentId] = {};
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
