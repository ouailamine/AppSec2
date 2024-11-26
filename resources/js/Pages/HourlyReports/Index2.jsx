import React, { useState } from "react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head } from "@inertiajs/react";
import SearchBar from "./SearchBar2";
import ResultFiltrage from "./ResultFiltrage";
const Index = ({ users = [], events = [], posts = [], catchEvents, sites }) => {
  const [filtredEvents, setFiltredEvents] = useState(null);
  const [filtredCatchEvents, setFiltredCatchEvents] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [periodType, setPeriodType] = useState("");

  const handleSearch = (data) => {
    console.log("Données de recherche:", data);
    setSelectedAgent(data.selectedAgent);
    setMonth(data.month);
    setYear(data.year);
    setSelectedSite(data.selectedSite);
    setSelectedType(data.selectedType);
    setPeriodType(data.periodType);

    let searchEvents;
    let searchCatchEvents;

    if (data.selectedType === "agent") {
      if (data.periodType === "mensuel") {
        searchEvents = events.filter(
          (event) =>
            parseInt(event.month) === data.month &&
            parseInt(event.year) === data.year &&
            event.user_id === data.selectedAgent &&
            event.work_duration !== "0:00"
        );
        searchCatchEvents = catchEvents.filter(
          (catchEvent) =>
            catchEvent.user_id === data.selectedAgent &&
            catchEvent.isRuler === 0
        );
      } else if (data.periodType === "annuel") {
        searchEvents = events.filter(
          (event) =>
            parseInt(event.year) === data.year &&
            event.user_id === data.selectedAgent &&
            event.work_duration !== "0:00"
        );
        searchCatchEvents = catchEvents.filter(
          (catchEvent) =>
            catchEvent.user_id === data.selectedAgent &&
            catchEvent.isRuler === 0
        );
      }
    } else if (data.selectedType === "site") {
      console.log("Selected Site ID:", data.selectedSite);

      const site = sites.find((site) => site.id === data.selectedSite);

      if (!site) {
        console.error("Selected site not found:", data.selectedSite);
        return;
      }

      const siteUsers = site.users.map((user) => user.id); // Extract user IDs

      if (siteUsers.length === 0) {
        console.error("No users found for the selected site.", site);
        return; // Exit early since there are no users to filter
      } else {
        console.log("Users in selected site:", siteUsers); // Log the user IDs
      }

      if (data.periodType === "mensuel") {
        searchEvents = events.filter(
          (event) =>
            parseInt(event.month) === data.month &&
            parseInt(event.year) === data.year &&
            event.site_id === data.selectedSite && // Check if site_id matches data.selectedSite
            siteUsers.includes(event.user_id) && // Check if the user_id is in the siteUsers array
            event.work_duration !== "0:00" // Ensure work_duration is not "0:00"
        );

        searchCatchEvents = catchEvents.filter(
          (catchEvent) =>
            catchEvent.site_id === data.selectedSite && catchEvent.isRuler === 0
        );
      } else if (data.periodType === "annuel") {
        searchEvents = events.filter(
          (event) =>
            parseInt(event.year) === data.year &&
            event.site_id === data.selectedSite &&
            siteUsers.includes(event.user_id) && // Check if the user_id is in the siteUsers array
            event.work_duration !== "0:00" // Ensure work_duration is not "0:00"
        );
        searchCatchEvents = catchEvents.filter(
          (catchEvent) =>
            catchEvent.site_id === data.selectedSite && catchEvent.isRuler === 0
        );
      }
    }

    setFiltredEvents(searchEvents);
    console.log("Filtered Events:", searchEvents);
    setFiltredCatchEvents(searchCatchEvents);
    console.log("Filtered catch Events:", searchCatchEvents); // Log the filtered events
  };

  return (
    <AdminAuthenticatedLayout>
      <Head title="Récapulatif horaires" />
      <div className="container mx-auto mt-8 p-4 text-center">
        <h1 className="text-4xl font-bold mb-10">Récapulatif horaires</h1>

        {/* Search Bar */}
        <SearchBar users={users} sites={sites} onSearch={handleSearch} />

        {/* Display results */}
        <ResultFiltrage
          filtredEvents={filtredEvents} // Pass the filtered events to ResultFiltrage
          filtredCatchEvents={filtredCatchEvents}
          users={users}
          events={events}
          posts={posts}
          catchEvents={catchEvents}
          sites={sites}
          selectedType={selectedType} // Pass the selectedType if needed
          month={month} // Pass month for potential further use
          year={year} // Pass year for potential further use
          selectedAgent={selectedAgent} // Pass selectedAgent for potential further use
          selectedSite={selectedSite} // Pass selectedSite for potential further use
          periodType={periodType}
        />
      </div>
    </AdminAuthenticatedLayout>
  );
};

export default Index;
