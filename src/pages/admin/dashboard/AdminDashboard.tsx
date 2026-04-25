import React, { useState, useEffect } from "react";
import { 
  MdChat as MessageSquare, 
  MdNotificationsNone, 
  MdSearch, 
  MdTrendingUp, 
  MdPeople, 
  MdSchool, 
  MdAssignmentLate 
} from "react-icons/md";
import "./AdminDashboard.css";

interface PendingRequest { id: number; name: string; type: string; detail: string; status: string; statusClass: string; }
interface StaffRequest { id: number; name: string; email: string; role: string; }
interface ParentRequest { id: number; name: string; email: string; detail: string; }

export default function AdminDashboard() {
  const [staffRequests, setStaffRequests] = useState<StaffRequest[]>([]);
  const [parentRequests, setParentRequests] = useState<ParentRequest[]>([]);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [generatedLink, setGeneratedLink] = useState<string>("");

  useEffect(() => {
    // Data Loading Logic
    const savedParents = JSON.parse(localStorage.getItem("pending_parent_requests") || "[]");
    setParentRequests(savedParents);

    const savedStaff = localStorage.getItem("pending_staff_requests");
    let currentStaff: StaffRequest[] = savedStaff ? JSON.parse(savedStaff) : [];
    if (currentStaff.length === 0) {
      currentStaff = [{ id: 101, name: "Amaya Silva", email: "amaya@gmail.com", role: "Teacher" }];
      localStorage.setItem("pending_staff_requests", JSON.stringify(currentStaff));
    }
    setStaffRequests(currentStaff);

    const savedStudents = JSON.parse(localStorage.getItem("admissions_students") || "[]");
    const approvedCount = savedStudents.filter((s: any) => s.status === "Approved").length;
    setTotalStudents(approvedCount);
  }, []);

  const logAction = (action: string) => {
    const log = { user: "Admin Anu", action, timestamp: new Date().toLocaleString() };
    const logs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
    logs.unshift(log);
    localStorage.setItem('auditLogs', JSON.stringify(logs.slice(0, 50)));
  };

  const approveTeacher = (req: StaffRequest) => {
    const token = `inv_${btoa(req.email)}`;
    const link = `${window.location.origin}/accept-invite?token=${token}`;
    const approvedUsers = JSON.parse(localStorage.getItem("approved_users") || "[]");
    const newUser = { email: req.email, password: "TEMPORARY_PENDING", role: "Teacher", status: "Pending Activation", firstName: req.name.split(" ")[0], lastName: req.name.split(" ").slice(1).join(" ") || "User" };
    localStorage.setItem("approved_users", JSON.stringify([...approvedUsers, newUser]));
    setGeneratedLink(`📧 Invitation sent to ${req.email}!`);
    setStaffRequests(prev => prev.filter(r => r.id !== req.id));
    logAction(`Approved teacher registration for ${req.name}`);
  };

  return (
    <div className="dashboard-wrapper">
      {/* Page Internal Header - Replacing the old AuthHeader */}
      <header className="page-header">
        <div className="header-left">
          <h1>Overview</h1>
          <p>Welcome back, Administrator</p>
        </div>
        <div className="header-right">
          <div className="search-bar">
            <MdSearch />
            <input type="text" placeholder="Search data..." />
          </div>
          <button className="icon-btn"><MdNotificationsNone /></button>
        </div>
      </header>

      {/* Stats Section */}
      <div className="stats-container">
        <div className="stat-card cyan">
          <div className="stat-icon"><MdPeople /></div>
          <div className="stat-data">
            <h3>Total Students</h3>
            <p className="value">{totalStudents}</p>
            <span className="trend">+3 this week</span>
          </div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon"><MdSchool /></div>
          <div className="stat-data">
            <h3>Staff on Duty</h3>
            <p className="value">18</p>
            <span className="trend">2 on leave</span>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon"><MdAssignmentLate /></div>
          <div className="stat-data">
            <h3>Pending Inquiries</h3>
            <p className="value">7</p>
            <span className="trend">Action required</span>
          </div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon"><MdTrendingUp /></div>
          <div className="stat-data">
            <h3>Revenue</h3>
            <p className="value">Rs 1.2M</p>
            <span className="trend">Monthly</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Requests Management */}
        <section className="content-card">
          <div className="card-header">
            <h3>Management Requests</h3>
            <button className="text-btn">View All</button>
          </div>
          <div className="requests-list">
            {staffRequests.map((req) => (
              <div key={req.id} className="request-row">
                <div className="avatar staff">{req.name.charAt(0)}</div>
                <div className="info">
                  <h4>{req.name} <span className="badge staff">Staff</span></h4>
                  <p>{req.role} • {req.email}</p>
                </div>
                <div className="actions">
                  <button className="btn-primary" onClick={() => approveTeacher(req)}>Approve</button>
                  <button className="btn-ghost">Reject</button>
                </div>
              </div>
            ))}
            {parentRequests.length === 0 && staffRequests.length === 0 && (
              <p className="empty-state">No pending requests</p>
            )}
          </div>
        </section>

        {/* Schedule */}
        <section className="content-card">
          <div className="card-header">
            <h3>Upcoming Schedule</h3>
          </div>
          <div className="schedule-stack">
            <div className="schedule-box">
              <div className="date-tag">08<br/><span>Feb</span></div>
              <div className="details">
                <h4>Morning Circle Time</h4>
                <p>09:00 AM - 10:30 AM</p>
              </div>
            </div>
            <div className="schedule-box">
              <div className="date-tag">08<br/><span>Feb</span></div>
              <div className="details">
                <h4>Staff Meeting</h4>
                <p>12:30 PM - 01:30 PM</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modern Vibe Footer */}
      <div className="vibe-card">
        <div className="vibe-content">
          <h3>Daily Status</h3>
          <p>Everything is running smoothly! Keep up the great work.</p>
        </div>
        <button className="chat-btn">
          <MessageSquare size={18} /> Chat with Team
        </button>
      </div>
    </div>
  );
}