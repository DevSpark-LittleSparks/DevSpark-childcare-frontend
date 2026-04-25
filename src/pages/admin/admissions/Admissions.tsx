import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdSearch, MdFilterList, MdAdd } from "react-icons/md";
import StatCard from "../../../components/layout/admin/StatCard";
import Sidebar from "../../../components/layout/AdminSidebar";
import "./Admissions.css";

interface Student {
  id: number;
  name: string;
  gender: string;
  className: string;
  date: string;
  status: "Approved" | "Waitlist" | "Pending";
}

export default function AdmissionsDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.endsWith("/status") ? "Student Status" : "Select Student";

  const [activeStatus, setActiveStatus] = useState("Approved");
  const [searchQuery, setSearchQuery] = useState("");
  const [allStudents, setAllStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem("admissions_students");
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, name: "Aaliyah Jones", gender: "Female", className: "A", date: "Feb 8", status: "Approved" },
      { id: 2, name: "Ethan Kim", gender: "Male", className: "B", date: "Feb 8", status: "Waitlist" },
      { id: 3, name: "Mia Patel", gender: "Female", className: "A", date: "Feb 7", status: "Approved" },
      { id: 4, name: "Noah Brown", gender: "Male", className: "C", date: "Feb 7", status: "Pending" },
    ];
  });

  useEffect(() => {
    localStorage.setItem("admissions_students", JSON.stringify(allStudents));
  }, [allStudents]);

  const filtered = allStudents.filter(s =>
    s.status === activeStatus &&
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const approved = allStudents.filter(s => s.status === "Approved").length;
  const waitlist = allStudents.filter(s => s.status === "Waitlist").length;

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%", backgroundColor: "#f8fafc", overflow: "hidden" }}>
      <Sidebar />
      <div className="admissions-container" style={{ flex: 1, overflowY: "auto", marginLeft: "16rem" }}>
        <header className="admissions-header">
          <div>
            <h1>Admissions</h1>
            <p>Manage student enrollments and waitlists</p>
          </div>
          <button className="add-student-btn" onClick={() => navigate("/admin/admissions/add")}>
            <MdAdd size={20} /> Add Student
          </button>
        </header>

        <div className="admissions-stats">
          <StatCard title="Total Students" value={allStudents.length} subtitle="All records" colorClass="blue" />
          <StatCard title="Approved" value={approved} subtitle="Active students" colorClass="green" />
          <StatCard title="Waitlist" value={waitlist} subtitle="Pending review" colorClass="orange" />
        </div>

        <div className="admissions-table-card">
          <div className="table-toolbar">
            <div className="search-box">
              <MdSearch size={20} />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="status-tabs">
              {["Approved", "Waitlist", "Pending"].map(s => (
                <button
                  key={s}
                  className={`status-tab ${activeStatus === s ? "active" : ""}`}
                  onClick={() => setActiveStatus(s)}
                >{s}</button>
              ))}
            </div>
          </div>

          <table className="students-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Gender</th>
                <th>Class</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>No students found.</td></tr>
              ) : (
                filtered.map(student => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.gender}</td>
                    <td>Class {student.className}</td>
                    <td>{student.date}</td>
                    <td><span className={`badge badge-${student.status.toLowerCase()}`}>{student.status}</span></td>
                    <td>
                      <button className="action-btn edit" onClick={() => navigate(`/admin/admissions/edit/${student.id}`)}>Edit</button>
                      <button className="action-btn delete" onClick={() => setAllStudents(prev => prev.filter(s => s.id !== student.id))}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
