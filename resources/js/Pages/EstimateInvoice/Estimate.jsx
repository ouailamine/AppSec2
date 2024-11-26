import React, { useState, useEffect } from "react";


const Estimate = ({ typePosts, posts }) => {
  const [formData, setFormData] = useState({
    agents: {},
    travelCosts: 0,
    materialCosts: 0,
    insuranceCosts: 0,
    totalGeneral: 0,
  });

  const [isSectionOpen, setIsSectionOpen] = useState({});
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  useEffect(() => {
    const calculateTotal = () => {
      let total = 0;

      Object.values(formData.agents).forEach((agents) => {
        agents.forEach((agent) => {
          total += agent.tarif * agent.heures;
        });
      });

      setFormData((prevData) => ({
        ...prevData,
        totalGeneral:
          total + formData.travelCosts + formData.materialCosts + formData.insuranceCosts,
      }));
    };

    calculateTotal();
  }, [formData.agents, formData.travelCosts, formData.materialCosts, formData.insuranceCosts]);

  const handleAgentChange = (type, agentIndex, field, value) => {
    const updatedAgents = [...formData.agents[type]];
    updatedAgents[agentIndex][field] = value;
    setFormData((prevData) => ({
      ...prevData,
      agents: {
        ...prevData.agents,
        [type]: updatedAgents,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsPdfOpen(true);
  };

  const toggleSection = (type) => {
    setIsSectionOpen((prevState) => ({
      ...prevState,
      [type]: !prevState[type],
    }));
  };

  const addAgent = (type) => {
    const newAgent = {
      agent: "",
      heures: 0,
      heuresNuit: 0,
      heuresFerie: 0,
      heuresDimanche: 0,
      tarif: 0,
      total: 0,
    };

    setFormData((prevData) => ({
      ...prevData,
      agents: {
        ...prevData.agents,
        [type]: [...(prevData.agents[type] || []), newAgent],
      },
    }));
  };

  const deleteAgent = (type, agentIndex) => {
    const updatedAgents = formData.agents[type].filter((_, index) => index !== agentIndex);
    setFormData((prevData) => ({
      ...prevData,
      agents: {
        ...prevData.agents,
        [type]: updatedAgents,
      },
    }));
  };

  // Helper function to calculate totals for each column
  const calculateColumnTotal = (column) => {
    return Object.values(formData.agents).reduce((total, agents) => {
      return agents.reduce((sum, agent) => sum + (parseFloat(agent[column]) || 0), total);
    }, 0);
  };

  return (
    <div className="min-h-screen flex bg-gray-100 p-6">
      <div className="flex-1 bg-white shadow-md rounded-lg p-6 mr-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Créer un Devis</h1>
        <h2 className="text-xl font-bold mb-4">Détails du Devis</h2>

        <form onSubmit={handleSubmit} className="mt-6">
          {/* Dynamically create a section for each typePost */}
          {typePosts.map((typePost) => (
            <Section
              key={typePost.id}
              title={typePost.name}
              isOpen={isSectionOpen[typePost.name]}
              toggle={() => toggleSection(typePost.name)}
            >
              <div className="p-4 border border-gray-300 rounded-md mt-2">
                <button
                  type="button"
                  onClick={() => addAgent(typePost.name)}
                  className="mb-4 text-white bg-indigo-600 px-4 py-2 rounded-md"
                >
                  Ajouter un agent de {typePost.name}
                </button>

                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr>
                      <th>Agent</th>
                      <th>Heures</th>
                      <th>Heures Nuit</th>
                      <th>Heures Férié</th>
                      <th>Heures Dimanche</th>
                      <th>Tarif</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(formData.agents[typePost.name] || []).map((agent, index) => (
                      <tr key={index}>
                        <td>
                          <select
                            value={agent.agent}
                            onChange={(e) =>
                              handleAgentChange(typePost.name, index, "agent", e.target.value)
                            }
                            className="border border-gray-300 p-1 rounded-md w-24"
                          >
                            <option value="">Select Agent</option>
                            {posts
                              .filter((post) => post.type_post_id === typePost.id) // Filter posts by typePost
                              .map((post) => (
                                <option key={post.id} value={post.id}>
                                  {post.name} ({post.abbreviation})
                                </option>
                              ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            value={agent.heures}
                            onChange={(e) =>
                              handleAgentChange(typePost.name, index, "heures", e.target.value)
                            }
                            className="border border-gray-300 p-1 rounded-md w-16"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={agent.heuresNuit}
                            onChange={(e) =>
                              handleAgentChange(typePost.name, index, "heuresNuit", e.target.value)
                            }
                            className="border border-gray-300 p-1 rounded-md w-16"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={agent.heuresFerie}
                            onChange={(e) =>
                              handleAgentChange(typePost.name, index, "heuresFerie", e.target.value)
                            }
                            className="border border-gray-300 p-1 rounded-md w-16"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={agent.heuresDimanche}
                            onChange={(e) =>
                              handleAgentChange(typePost.name, index, "heuresDimanche", e.target.value)
                            }
                            className="border border-gray-300 p-1 rounded-md w-16"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={agent.tarif}
                            onChange={(e) =>
                              handleAgentChange(typePost.name, index, "tarif", e.target.value)
                            }
                            className="border border-gray-300 p-1 rounded-md w-16"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={agent.total}
                            readOnly
                            className="border border-gray-300 p-1 rounded-md w-16"
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => deleteAgent(typePost.name, index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* Add totals row at the bottom */}
                  <tfoot>
                    <tr>
                      <td colSpan={1} className="text-center font-bold">Total</td>
                      <td>{calculateColumnTotal("heures")}</td>
                      <td>{calculateColumnTotal("heuresNuit")}</td>
                      <td>{calculateColumnTotal("heuresFerie")}</td>
                      <td>{calculateColumnTotal("heuresDimanche")}</td>
                      <td></td>
                      <td>{calculateColumnTotal("total")}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Section>
          ))}

          {/* Coûts additionnels */}
          <Section
            title="Coûts additionnels"
            isOpen={isSectionOpen.additionalCosts}
            toggle={() => toggleSection("additionalCosts")}
          >
            <div className="p-4 border border-gray-300 rounded-md mt-2">
              <Input
                id="travelCosts"
                label="Coûts de déplacement"
                type="number"
                value={formData.travelCosts}
                onChange={(e) => setFormData({ ...formData, travelCosts: e.target.value })}
              />
              <Input
                id="materialCosts"
                label="Coûts matériels"
                type="number"
                value={formData.materialCosts}
                onChange={(e) => setFormData({ ...formData, materialCosts: e.target.value })}
              />
              <Input
                id="insuranceCosts"
                label="Coûts d'assurance"
                type="number"
                value={formData.insuranceCosts}
                onChange={(e) => setFormData({ ...formData, insuranceCosts: e.target.value })}
              />
              <Input
                id="totalGeneral"
                label="Total Général"
                type="number"
                value={formData.totalGeneral}
                readOnly
              />
            </div>
          </Section>

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Soumettre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Section = ({ title, isOpen, toggle, children }) => (
  <div className="mb-6">
    <button
      type="button"
      onClick={toggle}
      className="w-full text-left px-4 py-2 bg-gray-200 rounded-md font-semibold flex justify-between items-center"
    >
      {title}
      <span
        className={`ml-2 ${isOpen ? "transform rotate-180" : ""}`}
        aria-hidden="true"
      >
        &#9660;
      </span>
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ${
        isOpen ? "max-h-screen" : "max-h-0"
      }`}
    >
      {children}
    </div>
  </div>
);

const Input = ({ id, label, type, value, onChange, readOnly }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className="block w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
);

export default Estimate;



