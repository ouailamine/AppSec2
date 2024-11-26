import React, { useState } from "react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
// Composant Collapse
const Collapse = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border border-gray-300 rounded-md mb-4">
      <button
        onClick={toggleCollapse}
        className="w-full px-4 py-2 bg-blue-500 text-white text-left focus:outline-none rounded-t-md"
      >
        {title}
      </button>
      {isOpen && <div className="p-4 border-t border-gray-300">{children}</div>}
    </div>
  );
};

const CollapsePage = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [searchSite, setSearchSite] = useState("");
  const [searchGuard, setSearchGuard] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const data = {
    2023: {
      "Site A": {
        January: [
          {
            site: "Site A",
            guard: "Guard 1",
            date: "2023-01-15",
            type: "Type 1",
            description: "Description of Incident 1",
          },
          {
            site: "Site A",
            guard: "Guard 2",
            date: "2023-01-22",
            type: "Type 2",
            description: "Description of Incident 2",
          },
        ],
        February: [
          {
            site: "Site A",
            guard: "Guard 1",
            date: "2023-02-10",
            type: "Type 3",
            description: "Description of Incident 3",
          },
        ],
      },
      "Site B": {
        January: [
          {
            site: "Site B",
            guard: "Guard 3",
            date: "2023-01-05",
            type: "Type 4",
            description: "Description of Incident 4",
          },
        ],
      },
    },
    2024: {
      "Site C": {
        April: [
          {
            site: "Site C",
            guard: "Guard 4",
            date: "2024-04-18",
            type: "Type 5",
            description: "Description of Incident 5",
          },
        ],
        May: [
          {
            site: "Site C",
            guard: "Guard 5",
            date: "2024-05-20",
            type: "Type 6",
            description: "Description of Incident 6",
          },
        ],
      },
    },
  };

  const filteredData = Object.keys(data).reduce((acc, year) => {
    if (searchYear && !year.includes(searchYear)) return acc; // Filter by year

    acc[year] = Object.keys(data[year]).reduce((yearAcc, site) => {
      const filteredMonths = Object.keys(data[year][site]).reduce(
        (monthAcc, month) => {
          const filteredIncidents = data[year][site][month].filter(
            (incident) => {
              const incidentDate = new Date(incident.date);
              const searchDateObj = searchDate ? new Date(searchDate) : null;

              return (
                (searchSite === "" ||
                  incident.site
                    .toLowerCase()
                    .includes(searchSite.toLowerCase())) &&
                (searchGuard === "" ||
                  incident.guard
                    .toLowerCase()
                    .includes(searchGuard.toLowerCase())) &&
                (searchType === "" ||
                  incident.type
                    .toLowerCase()
                    .includes(searchType.toLowerCase())) &&
                (searchDate === "" ||
                  (searchDateObj &&
                    incidentDate.toDateString() ===
                      searchDateObj.toDateString()))
              );
            }
          );

          if (filteredIncidents.length > 0) {
            monthAcc[month] = filteredIncidents;
          }
          return monthAcc;
        },
        {}
      );

      if (Object.keys(filteredMonths).length > 0) {
        yearAcc[site] = filteredMonths;
      }
      return yearAcc;
    }, {});

    return acc;
  }, {});

  return (
    <AdminAuthenticatedLayout>
      <Head title="Dashboard Admin" />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          Years, Sites, Months, and Incidents
        </h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by Site"
            value={searchSite}
            onChange={(e) => setSearchSite(e.target.value)}
            className="p-2 border border-gray-300 rounded-md mr-4"
          />
          <input
            type="text"
            placeholder="Search by Guard"
            value={searchGuard}
            onChange={(e) => setSearchGuard(e.target.value)}
            className="p-2 border border-gray-300 rounded-md mr-4"
          />
          <input
            type="text"
            placeholder="Search by Type"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="p-2 border border-gray-300 rounded-md mr-4"
          />
          <input
            type="text"
            placeholder="Search by Year"
            value={searchYear}
            onChange={(e) => setSearchYear(e.target.value)}
            className="p-2 border border-gray-300 rounded-md mr-4"
          />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>

        {Object.keys(filteredData).map((year, yearIndex) => (
          <Collapse key={yearIndex} title={`Year ${year}`}>
            {Object.keys(filteredData[year]).map((site, siteIndex) => (
              <Collapse key={siteIndex} title={site}>
                {months.map((month, monthIndex) => (
                  <Collapse key={monthIndex} title={month}>
                    <ul className="list-disc pl-5">
                      {(filteredData[year][site][month] || []).length > 0 ? (
                        filteredData[year][site][month].map(
                          (incident, incidentIndex) => (
                            <li key={incidentIndex} className="py-1">
                              <div>
                                <strong>Guard:</strong> {incident.guard}
                              </div>
                              <div>
                                <strong>Date:</strong> {incident.date}
                              </div>
                              <div>
                                <strong>Type:</strong> {incident.type}
                              </div>
                              <div>
                                <strong>Description:</strong>{" "}
                                {incident.description}
                              </div>
                            </li>
                          )
                        )
                      ) : (
                        <li className="py-1 text-gray-500">No incidents</li>
                      )}
                    </ul>
                  </Collapse>
                ))}
              </Collapse>
            ))}
          </Collapse>
        ))}
      </div>
    </AdminAuthenticatedLayout>
  );
};

export default CollapsePage;
