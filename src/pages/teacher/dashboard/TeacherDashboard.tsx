import React from "react";
import { useNavigate } from "react-router-dom";
import "./TeacherDashboard.css";

export default function TeacherDashboard() {
  const navigate = useNavigate();

  return (
    <div className="td-container">
      {/* HEADER */}
      <header className="td-header">
        <h1 className="td-title">Welcome back, Teacher 👩‍🏫</h1>
        <p className="td-subtitle">
          Manage your classes, students, and daily activities.
        </p>
      </header>

      {/* GRID */}
      <div className="td-grid">

        {/* My Classes */}
        <div
          className="td-card td-classes"
          onClick={() => navigate("/teacher/classes")}
        >
          <h2>My Classes</h2>
          <p>View and manage assigned classes</p>
          <button>Open →</button>
        </div>

        {/* Students */}
        <div
          className="td-card td-students"
          onClick={() => navigate("/teacher/students")}
        >
          <h2>Students</h2>
          <p>Track student progress and attendance</p>
          <button>View →</button>
        </div>

        {/* Assignments */}
        <div
          className="td-card td-assignments"
          onClick={() => navigate("/teacher/assignments")}
        >
          <h2>Assignments</h2>
          <p>Create and review assignments</p>
          <button>Manage →</button>
        </div>

        {/* Messaging */}
        <div
          className="td-card td-messages"
          onClick={() => navigate("/teacher/messaging")}
        >
          <h2>Messaging</h2>
          <p>Communicate with parents</p>
          <button>Chat →</button>
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="td-actions">
        <h2>Quick Actions</h2>

        <div className="td-action-row">
          <button onClick={() => navigate("/teacher/attendance")}>
            Mark Attendance
          </button>

          <button onClick={() => navigate("/teacher/announcements")}>
            Add Announcement
          </button>

          <button onClick={() => navigate("/teacher/profile")}>
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}