import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ParentDashboard.css";

interface Student {
  name: string;
  className?: string;
  parentEmail?: string;
}

interface User {
  firstName?: string;
  email?: string;
}

export default function ParentDashboard() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState<string>("Parent");
  const [firstChild, setFirstChild] = useState<Student | null>(null);

  useEffect(() => {
    try {
      const userJSON = localStorage.getItem("user");
      if (!userJSON) return;

      const user: User = JSON.parse(userJSON);
      setUserName(user.firstName || "Parent");

      const studentsJSON = localStorage.getItem("admissions_students");
      if (!studentsJSON) return;

      const allStudents: Student[] = JSON.parse(studentsJSON);

      const matches = allStudents.filter(
        (s) => s.parentEmail === user.email
      );

      if (matches.length > 0) {
        setFirstChild(matches[0]);
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  }, []);

  return (
    <div className="pd-container">

      {/* HEADER */}
      <header className="pd-header">
        <h1 className="pd-title">Welcome back, {userName} 👋</h1>
        <p className="pd-subtitle">
          Here's what's happening with your children today.
        </p>
      </header>

      {/* GRID */}
      <div className="pd-grid">

        {/* CHILD CARD */}
        <section
          className="pd-card pd-children-card"
          onClick={() => navigate("/parent/children")}
        >
          <h2 className="pd-card-title">My Children</h2>

          {firstChild ? (
            <div className="pd-child-pill">
              <div className="pd-child-info">
                <span className="pd-child-name">
                  {firstChild.name}
                </span>
                <span className="pd-child-group">
                  Class {firstChild.className || "A"}
                </span>
              </div>
              <div className="pd-status-badge">Active</div>
            </div>
          ) : (
            <p className="pd-no-data">
              No children linked to your account yet.
            </p>
          )}

          <p className="pd-card-hint">Tap to view all →</p>
        </section>

        {/* PAYMENTS CARD */}
        <section className="pd-card pd-payments-card">
          <h2 className="pd-card-title">Upcoming Payments</h2>

          <div className="pd-payment-info">
            <div className="pd-payment-label">Monthly Tuition</div>
            <div className="pd-payment-amount">Rs 20,000.00</div>

            <button className="pd-pay-btn">
              Pay Now
            </button>
          </div>
        </section>

      </div>

      {/* QUICK ACTIONS */}
      <section className="pd-quick-actions">
        <h2 className="pd-section-title">Quick Actions</h2>

        <div className="pd-actions-row">
          <button className="pd-action-btn">
            Message Teacher
          </button>

          <button className="pd-action-btn">
            Report Absence
          </button>

          <button
            className="pd-action-btn"
            onClick={() => navigate("/parent/profile")}
          >
            Update Profile
          </button>
        </div>
      </section>

    </div>
  );
}