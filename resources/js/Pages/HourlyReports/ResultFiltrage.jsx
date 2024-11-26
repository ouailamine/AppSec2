import React, { useEffect, useState } from "react";
import DetailModal from "../CatchEvents/DetailModal";
import DownloadPDFButton from "./DownloadPDFButton";

const ResultFiltrage = ({
  filtredEvents,
  filtredCatchEvents,
  users,
  posts,
  sites,
  selectedType,
  periodType,
  selectedSite,
  selectedAgent,
}) => {
  console.log(filtredEvents, filtredCatchEvents);
  const [totalsByAgent, setTotalsByAgent] = useState({});
  const [totalsByCatchAgent, setTotalsByCatchAgent] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleOpenModal = (catchEvent) => {
    const formattedEvent = {
      ...catchEvent.postTotals,
      holiday_hours: catchEvent.postTotals?.totalHolidayHours ?? 0,
      night_hours: catchEvent.postTotals?.totalNightHours ?? 0,
      sunday_hours: catchEvent.postTotals?.totalSundayHours ?? 0,
      hours: catchEvent.postTotals?.totalWorkHours ?? 0,
      lunchAllowance: catchEvent.postTotals?.totalLunchAllowance ?? 0,
    };
    console.log(formattedEvent);
    setSelectedEvent(formattedEvent);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const getUserDetails = (userId) => {
    const user = users.find((user) => user.id == userId) || {};
    return {
      fullname: user.fullname || "Inconnu",
      firstname: user.firstname || "",
    };
  };

  useEffect(() => {
    const calculateTotals = () => {
      if (!filtredEvents || filtredEvents.length === 0) {
        setTotalsByAgent({});
        return;
      }

      const totals = {};

      filtredEvents.forEach((event) => {
        const {
          user_id,
          post,
          work_duration,
          night_hours,
          sunday_hours,
          holiday_hours,
          lunchAllowance,
          site_id,
          month,
        } = event;

        const monthLabel = month
          ? new Date(month).toLocaleString("default", { month: "long" })
          : "Inconnu";

        if (!totals[user_id]) {
          totals[user_id] = {
            userName: getUserName(user_id),
            posts: {},
            overallTotals: {
              totalWorkHours: 0,
              totalNightHours: 0,
              totalSundayHours: 0,
              totalHolidayHours: 0,
              totalLunchAllowance: 0,
            },
          };
        }

        if (!totals[user_id].posts[post]) {
          totals[user_id].posts[post] = {
            totalWorkHours: 0,
            totalNightHours: 0,
            totalSundayHours: 0,
            totalHolidayHours: 0,
            totalLunchAllowance: 0,
            sites: new Set(),
            months: new Set(),
          };
        }

        const workHours = parseFloat(work_duration) || 0;
        const nightHours = parseFloat(night_hours) || 0;
        const sundayHours = parseFloat(sunday_hours) || 0;
        const holidayHours = parseFloat(holiday_hours) || 0;
        const lunchAllowanceValue = parseFloat(lunchAllowance) || 0;

        totals[user_id].posts[post].totalWorkHours += workHours;
        totals[user_id].posts[post].totalNightHours += nightHours;
        totals[user_id].posts[post].totalSundayHours += sundayHours;
        totals[user_id].posts[post].totalHolidayHours += holidayHours;
        totals[user_id].posts[post].totalLunchAllowance += lunchAllowanceValue;
        totals[user_id].posts[post].sites.add(site_id);
        totals[user_id].posts[post].months.add(monthLabel);

        totals[user_id].overallTotals.totalWorkHours += workHours;
        totals[user_id].overallTotals.totalNightHours += nightHours;
        totals[user_id].overallTotals.totalSundayHours += sundayHours;
        totals[user_id].overallTotals.totalHolidayHours += holidayHours;
        totals[user_id].overallTotals.totalLunchAllowance +=
          lunchAllowanceValue;
      });

      setTotalsByAgent(totals);
    };

    const calculateCatchTotals = () => {
      if (!filtredCatchEvents || filtredCatchEvents.length === 0) {
        setTotalsByCatchAgent({});
        return;
      }

      const totals = {};

      filtredCatchEvents.forEach((catchEvent) => {
        const {
          user_id,
          id,
          post,
          hours,
          night_hours,
          sunday_hours,
          holiday_hours,
          site_id,
          created_at,
          date_regularization,
          date_vacation,
          isBilled,
          lunchAllowance,
          isRuler,
          managerCreate,
          managerValidate,
          remarks,
          updated_at,
        } = catchEvent;

        if (!totals[user_id]) {
          totals[user_id] = {
            userName: getUserName(user_id),
            posts: {},

            overallTotals: {
              totalWorkHours: 0,
              totalNightHours: 0,
              totalSundayHours: 0,
              totalHolidayHours: 0,
              totalLunchAllowance: 0,
            },
          };
        }

        if (!totals[user_id].posts[post]) {
          totals[user_id].posts[post] = {
            totalWorkHours: 0,
            totalNightHours: 0,
            totalSundayHours: 0,
            totalHolidayHours: 0,
            totalLunchAllowance: 0,
            sites: new Set(),
            created_at,
            date_regularization,
            date_vacation, // Store vacation date for each post
            isBilled,
            isRuler,
            managerCreate,
            managerValidate,
            remarks,
            updated_at,
            user_id,
            site_id,
            id,
            post,
          };
        }

        const workHours = parseFloat(hours) || 0;
        const nightHours = parseFloat(night_hours) || 0;
        const sundayHours = parseFloat(sunday_hours) || 0;
        const holidayHours = parseFloat(holiday_hours) || 0;
        const lunchAllowanceValue = parseFloat(lunchAllowance) || 0;

        totals[user_id].posts[post].totalWorkHours += workHours;
        totals[user_id].posts[post].totalNightHours += nightHours;
        totals[user_id].posts[post].totalSundayHours += sundayHours;
        totals[user_id].posts[post].totalHolidayHours += holidayHours;
        totals[user_id].posts[post].totalLunchAllowance += lunchAllowanceValue;
        totals[user_id].posts[post].sites.add(site_id);

        totals[user_id].overallTotals.totalWorkHours += workHours;
        totals[user_id].overallTotals.totalNightHours += nightHours;
        totals[user_id].overallTotals.totalSundayHours += sundayHours;
        totals[user_id].overallTotals.totalHolidayHours += holidayHours;
        totals[user_id].overallTotals.totalLunchAllowance +=
          lunchAllowanceValue;

        // Add vacationDate to the overall totals if it exists
      });

      setTotalsByCatchAgent(totals);
    };

    calculateTotals();
    calculateCatchTotals();
  }, [filtredEvents, filtredCatchEvents, posts, sites]);

  const getPostName = (postId) => {
    const post = posts.find((p) => p.abbreviation === postId);
    return post ? post.name : "Inconnu";
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === parseInt(userId));
    return user ? user.fullname : "Inconnu";
  };

  const getSiteName = (siteId) => {
    const site = sites.find((s) => s.id === parseInt(siteId));
    return site ? site.name : "Inconnu";
  };

  const hasResults = Object.keys(totalsByAgent).length > 0;
  const hasCatchResults = Object.keys(totalsByCatchAgent).length > 0;

  return (
    <div className="mt-2">
      {(hasResults || hasCatchResults) && (
        <div className="mt-2 mb-3">
          <DownloadPDFButton
            totalsByAgent={totalsByAgent}
            totalsByCatchAgent={totalsByCatchAgent}
            posts={posts}
            sites={sites}
            selectedSite={selectedSite}
            selectedAgent={selectedAgent}
            selectedType={selectedType}
            periodType={periodType}
            users={users}
          />
        </div>
      )}
      {hasResults && (
        <div>
          <div className="flex items-center my-2">
            <div className="flex-grow border-t border-gray-800"></div>
            <span className="mx-2 text-BLACK-500 font-bold">
              Totaux des Heures
            </span>
            <div className="flex-grow border-t border-gray-800"></div>
          </div>
        </div>
      )}
      {!hasResults ? (
        <p className="text-lg text-gray-500">Aucun résultat trouvé .</p>
      ) : (
        Object.keys(totalsByAgent).map((userId) => {
          const agentTotals = totalsByAgent[userId];
          return (
            <div key={userId} className="mb-8">
              <h3 className="text-xl font-semibold mb-2">
                Agent : {agentTotals.userName}
              </h3>
              <table className="min-w-full bg-white border border-gray-200 mb-4">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Poste</th>
                    {selectedType === "agent" && (
                      <th className="py-2 px-4 border-b">Site</th>
                    )}
                    {periodType === "annuel" && (
                      <th className="py-2 px-4 border-b">Mois</th>
                    )}
                    <th className="py-2 px-4 border-b">Hrs de Travail</th>
                    <th className="py-2 px-4 border-b">Hrs de Nuit</th>
                    <th className="py-2 px-4 border-b">Hrs de Dimanche</th>
                    <th className="py-2 px-4 border-b">Hrs Férié</th>
                    <th className="py-2 px-4 border-b">Paniers</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(agentTotals.posts).map((post) => {
                    const postTotals = agentTotals.posts[post];
                    return (
                      <tr key={post} className="hover:bg-gray-100">
                        <td className="py-2 px-4 border-b">
                          {getPostName(post)}
                        </td>
                        {selectedType === "agent" && (
                          <td className="py-2 px-4 border-b">
                            {Array.from(postTotals.sites)
                              .map(getSiteName)
                              .join(", ")}
                          </td>
                        )}
                        {periodType === "annuel" && (
                          <td className="py-2 px-4 border-b">
                            {Array.from(postTotals.months).join(", ")}
                          </td>
                        )}
                        <td className="py-2 px-4 border-b">
                          {postTotals.totalWorkHours}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {postTotals.totalNightHours}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {postTotals.totalSundayHours}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {postTotals.totalHolidayHours}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {postTotals.totalLunchAllowance}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="font-semibold">
                    <td className="py-2 px-4 border-t">Total</td>
                    {selectedType === "agent" && (
                      <td className="py-2 px-4 border-t"></td>
                    )}
                    {periodType === "annuel" && (
                      <td className="py-2 px-4 border-t"></td>
                    )}
                    <td className="py-2 px-4 border-t">
                      {agentTotals.overallTotals.totalWorkHours}
                    </td>
                    <td className="py-2 px-4 border-t">
                      {agentTotals.overallTotals.totalNightHours}
                    </td>
                    <td className="py-2 px-4 border-t">
                      {agentTotals.overallTotals.totalSundayHours}
                    </td>
                    <td className="py-2 px-4 border-t">
                      {agentTotals.overallTotals.totalHolidayHours}
                    </td>
                    <td className="py-2 px-4 border-t">
                      {agentTotals.overallTotals.totalLunchAllowance}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
          <div className="flex-grow border-t border-gray-800"></div>;
        })
      )}

      {hasCatchResults && (
        <div className="mt-8">
          <div className="flex items-center my-2">
            <div className="flex-grow border-t border-red-600"></div>
            <span className="mx-2 text-red-500 font-bold">
              Vacation à rattraper
            </span>
            <div className="flex-grow border-t border-red-600"></div>
          </div>
          {/*}<h2 className="text-2xl font-semibold mb-4 text-red-600">
            Totaux des Heures (Catch Events)
          </h2>{*/}
          {Object.keys(totalsByCatchAgent).map((userId) => {
            const catchAgentTotals = totalsByCatchAgent[userId];
            return (
              <div key={userId} className="mb-8">
                <h3 className="text-xl font-semibold mb-2 text-red-600">
                  Agent : {catchAgentTotals.userName}
                </h3>
                <table className="min-w-full bg-red-100 border border-red-300 mb-4">
                  <thead>
                    <tr className="bg-red-200">
                      <th className="py-2 px-4 border-b border-red-300 text-red-800">
                        Poste
                      </th>
                      {selectedType === "agent" && (
                        <th className="py-2 px-4 border-b border-red-300 text-red-800">
                          Site
                        </th>
                      )}
                      <th className="py-2 px-4 border-b border-red-300 text-red-800">
                        Hrs de Travail
                      </th>
                      <th className="py-2 px-4 border-b border-red-300 text-red-800">
                        Hrs de Nuit
                      </th>
                      <th className="py-2 px-4 border-b border-red-300 text-red-800">
                        Hrs de Dimanche
                      </th>
                      <th className="py-2 px-4 border-b border-red-300 text-red-800">
                        Hrs Férié
                      </th>
                      <th className="py-2 px-4 border-b border-red-300 text-red-800">
                        Paniers
                      </th>
                      <th className="py-2 px-4 border-b border-red-300 text-red-800">
                        Actions
                      </th>{" "}
                      {/* New Actions Column */}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(catchAgentTotals.posts).map((post) => {
                      const postTotals = catchAgentTotals.posts[post];
                      return (
                        <tr key={post} className="hover:bg-red-200">
                          <td className="py-2 px-4 border-b border-red-300 text-red-800">
                            {getPostName(post)}
                          </td>
                          {selectedType === "agent" && (
                            <td className="py-2 px-4 border-b border-red-300 text-red-800">
                              {Array.from(postTotals.sites)
                                .map(getSiteName)
                                .join(", ")}
                            </td>
                          )}
                          <td className="py-2 px-4 border-b border-red-300 text-red-800">
                            {postTotals.totalWorkHours}
                          </td>
                          <td className="py-2 px-4 border-b border-red-300 text-red-800">
                            {postTotals.totalNightHours}
                          </td>
                          <td className="py-2 px-4 border-b border-red-300 text-red-800">
                            {postTotals.totalSundayHours}
                          </td>
                          <td className="py-2 px-4 border-b border-red-300 text-red-800">
                            {postTotals.totalHolidayHours}
                          </td>
                          <td className="py-2 px-4 border-b border-red-300 text-red-800">
                            {postTotals.totalLunchAllowance}
                          </td>
                          <td className="py-2 px-4 border-b border-red-300 text-red-800">
                            <button
                              onClick={() => handleOpenModal({ postTotals })}
                              className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-500 transition duration-200"
                            >
                              Détails
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="font-semibold bg-red-300 text-red-800">
                      <td className="py-2 px-4 border-t border-red-300">
                        Total
                      </td>
                      {selectedType === "agent" && (
                        <td className="py-2 px-4 border-t border-red-300"></td>
                      )}
                      <td className="py-2 px-4 border-t border-red-300">
                        {catchAgentTotals.overallTotals.totalWorkHours}
                      </td>
                      <td className="py-2 px-4 border-t border-red-300">
                        {catchAgentTotals.overallTotals.totalNightHours}
                      </td>
                      <td className="py-2 px-4 border-t border-red-300">
                        {catchAgentTotals.overallTotals.totalSundayHours}
                      </td>
                      <td className="py-2 px-4 border-t border-red-300">
                        {catchAgentTotals.overallTotals.totalHolidayHours}
                      </td>
                      <td className="py-2 px-4 border-t border-red-300">
                        {catchAgentTotals.overallTotals.totalLunchAllowance}
                      </td>
                      <td className="py-2 px-4 border-t border-red-300"></td>{" "}
                      {/* Empty Cell for Actions */}
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}
          <div className="flex-grow border-t border-red-600"></div>
        </div>
      )}

      <DetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={selectedEvent}
        getUserDetails={getUserDetails}
        getSiteName={getSiteName}
        posts={posts}
      />
    </div>
  );
};

export default ResultFiltrage;
