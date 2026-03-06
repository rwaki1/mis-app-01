// src/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import App from "./App";
import "./components/Dashboard.css";

function Dashboard() {
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState("card"); // NEW: Toggle state

  useEffect(() => {
    axios
      .get("http://localhost:5000/personnel")
      .then((res) => {
        const data = res.data;
        const active = data.filter((p) => p.status === "Active").length;
        const inactive = data.filter((p) => p.status === "Inactive").length;
        setActiveCount(active);
        setInactiveCount(inactive);
        setTotalCount(data.length);
      })
      .catch((err) => {
        console.error("Error fetching personnel stats:", err.message);
      });
  }, []);

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-container">
          <img
            src="/lion-de-sarambwe.jpg"
            alt="Lion de Sarambwe Logo"
            className="logo"
          />
          <h2 className="sidebar-title">LION MIS</h2>
        </div>
        <nav className="navigation">
          <ul>
            <li className="active">Personnel</li>
            <li>Reports</li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <h1>Military Dashboard</h1>
          <div className="stats-summary">
            <div className="stat-card">
              <h3>Active Personnel</h3>
              <p>{activeCount}</p>
            </div>
            <div className="stat-card">
              <h3>Inactive Personnel</h3>
              <p>{inactiveCount}</p>
            </div>
            <div className="stat-card">
              <h3>Total Personnel</h3>
              <p>{totalCount}</p>
            </div>
          </div>
        </header>

        {/* Dashboard Cards */}
        <div className="dashboard-cards">
          <div className="card">
            <h3>Personnel Overview</h3>
            <p>View detailed personnel info</p>
          </div>
          <div className="card">
            <h3>Mission Reports</h3>
            <p>Quick access to all reports</p>
          </div>
          <div className="card">
            <h3>Settings</h3>
            <p>Manage system settings</p>
          </div>
        </div>

        {/* View Toggle Button */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={() => setViewMode(viewMode === "card" ? "table" : "card")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#002b80",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            {viewMode === "card" ? "Switch to Table View" : "Switch to Card View"}
          </button>
        </div>

        {/* Form and View Output */}
        <div className="dashboard-main-area">
          <App viewMode={viewMode} />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
