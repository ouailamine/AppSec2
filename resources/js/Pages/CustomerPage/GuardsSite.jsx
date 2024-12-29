import React, { useState } from "react";
import ShowGuard from "./ShowGuard";

const agents = [
  {
    id: 1,
    name: "Agent Smith",
    role: "Administrator",
    details: "Handles system administration and user management.",
    site: "paul va",
  },
  {
    id: 2,
    name: "Agent Johnson",
    role: "Moderator",
    details: "Monitors content and ensures community guidelines are followed.",
    site: "paul va",
  },
  {
    id: 3,
    name: "Agent Brown",
    role: "Support",
    details: "Provides assistance and resolves user issues.",
    site: "paul va",
  },
];

const AgentList = () => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">Liste des Agents</h1>

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher un agent..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className="p-4 border rounded-lg shadow-md bg-white flex flex-col items-center"
          >
            <div className="text-4xl mb-3">🤵</div>
            <h2 className="text-lg font-semibold mb-1">{agent.name}</h2>
            <p className="text-gray-600 mb-3">site: {agent.site}</p>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setSelectedAgent(agent)}
            >
              Voir les détails
            </button>
          </div>
        ))}
      </div>

      {/* Utilisation du composant Modal */}
      <ShowGuard agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
    </div>
  );
};

export default AgentList;
