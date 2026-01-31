import { useState } from "react";
import ApplicationsTab from "../components/approver/ApplicationsTab";
import HistoryTab from "../components/approver/HistoryTab";
import LimitCalculatorTab from "../components/approver/LimitCalculatorTab";
import "./ApproverDashboard.css";

export default function ApproverDashboard() {
  const [activeTab, setActiveTab] = useState("applications");

  return (
    <div className="approver-dashboard">
      <header className="dashboard-header">
        <h1>Approver Dashboard</h1>
        <p>Manage credit card applications</p>
      </header>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "applications" ? "active" : ""}`}
          onClick={() => setActiveTab("applications")}
        >
          Applications
        </button>
        <button
          className={`tab-button ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          Applicant History
        </button>
        <button
          className={`tab-button ${activeTab === "limit" ? "active" : ""}`}
          onClick={() => setActiveTab("limit")}
        >
          Subjective Limit
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "applications" && <ApplicationsTab />}
        {activeTab === "history" && <HistoryTab />}
        {activeTab === "limit" && <LimitCalculatorTab />}
      </div>
    </div>
  );
}
