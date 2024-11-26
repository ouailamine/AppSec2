import React, { useState, useEffect } from "react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head } from "@inertiajs/react";
import SearchBar from "./SearchBar"; // New component

const Index = ({ users = [], events = [], posts = [], catchEvents }) => {
  console.log(catchEvents);

  const [activeTab, setActiveTab] = useState("agent"); // Default to "agent"
  const [currentMonth, setCurrentMonth] = useState("");

  useEffect(() => {
    const now = new Date();
    setCurrentMonth(now.toISOString().slice(0, 7)); // Set current month in "YYYY-MM" format
  }, []);

  return (
    <AdminAuthenticatedLayout>
      <Head title="Tableau de bord Administrateur" />
      <div className="container mx-auto mt-8 p-4 text-center">
        <h1 className="text-4xl font-bold mb-10">Rapport horaire</h1>

        {/* Search Bar */}
        {activeTab === "agent" && (
          <SearchBar
            activeTab={activeTab}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            users={users}
            events={events}
            posts={posts}
            catchEvents={catchEvents}
          />
        )}
      </div>
    </AdminAuthenticatedLayout>
  );
};

export default Index;
