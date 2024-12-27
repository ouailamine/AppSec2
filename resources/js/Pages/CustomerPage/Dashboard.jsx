import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Plannings from "./Plannings"; // Ensure this file exists
import Profil from "./Profile"; // Ensure this file exists

// Dashboard Component
const Dashboard = ({plannings}) => {

  
  return (
  <div>
    <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
    <p>This is the main page of your application.</p>
  </div>
)};

export default Dashboard;
