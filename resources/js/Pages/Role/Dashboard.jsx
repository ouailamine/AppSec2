// Dashboard.jsx
import React from "react";

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li>Overview</li>
          <li>Analytics</li>
          <li>Settings</li>
          <li>Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <h1>Welcome to the Dashboard</h1>
        </header>

        {/* Dashboard Overview */}
        <section className="overview">
          <div className="card">
            <h3>Total Users</h3>
            <p>1,245</p>
          </div>
          <div className="card">
            <h3>Revenue</h3>
            <p>$45,000</p>
          </div>
          <div className="card">
            <h3>New Orders</h3>
            <p>320</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
