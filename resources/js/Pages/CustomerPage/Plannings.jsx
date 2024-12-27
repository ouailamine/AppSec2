import React from 'react';

const PlanningPage = ({plannings}) => {
  console.log(plannings)

  return (
    <div className="planning-page">
      <h1>Planning de la journée</h1>
      <table>
        <thead>
          <tr>
            <th>Heure</th>
            <th>Tâche</th>
          </tr>
        </thead>
        <tbody>
          
        </tbody>
      </table>
    </div>
  );
};

export default PlanningPage;
