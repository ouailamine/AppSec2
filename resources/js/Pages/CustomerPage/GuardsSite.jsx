import React from 'react';

const agents = [
  { id: 1, name: 'Agent Smith', role: 'Administrator' },
  { id: 2, name: 'Agent Johnson', role: 'Moderator' },
  { id: 3, name: 'Agent Brown', role: 'Support' },
];

const AgentList = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Liste des Agents</h1>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {agents.map((agent) => (
          <li
            key={agent.id}
            style={{
              margin: '10px 0',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <h2 style={{ margin: '0 0 5px 0' }}>{agent.name}</h2>
            <p style={{ margin: 0 }}>Rôle: {agent.role}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AgentList;
