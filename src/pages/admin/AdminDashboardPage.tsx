import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { StatCard } from "@/shared/ui/stat-card";
import AdminSidebar from "@/widgets/sidebar/AdminSidebar";
import { MdChat as MessageSquare } from "react-icons/md";
import "./AdminDashboardPage.css";

interface RequestItem {
  id: number | string;
  name: string;
  type?: string;
  detail?: string;
  status?: string;
  statusClass?: string;
  email?: string;
  role?: string;
}

export default function AdminDashboardPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const userName = user ? (user.displayName || user.email?.split("@")[0] || "Admin") : "Admin User";

  // Simulated backend state for pending teacher requests
  const [pendingRequests] = useState([
    { id: 1, name: "Liam's Dad (Parent)", type: "Parent", detail: "Submitted enrollment forms", status: "New", statusClass: "new" },
    { id: 2, name: "Sarah Miller (Staff)", type: "Staff", detail: "Requested time off for Friday", status: "Pending", statusClass: "pending" },
    { id: 3, name: "Monthly Billing", type: "System", detail: "Invoices generated for October", status: "System", statusClass: "system" },
  ]);

  // Actual staff requests that need approval/rejection
  const [staffRequests, setStaffRequests] = useState<RequestItem[]>([]);
  const [parentRequests, setParentRequests] = useState<RequestItem[]>([]);
  const [generatedLink, setGeneratedLink] = useState("");
  const [totalStudents, setTotalStudents] = useState(0);

  // Load requests and stats from localStorage
  useEffect(() => {
    // 1. Load Parent Requests
    const savedParents = JSON.parse(localStorage.getItem("pending_parent_requests") || "[]");
    setParentRequests(savedParents);

    // 2. Load Staff Requests
    const savedStaff = localStorage.getItem("pending_staff_requests");
    let currentStaff = savedStaff ? JSON.parse(savedStaff) : [];

    // Seed "Amaya Silva" if no staff requests exist
    if (currentStaff.length === 0) {
      currentStaff = [{ id: 101, name: "Amaya Silva", email: "amaya@gmail.com", role: "Teacher" }];
      localStorage.setItem("pending_staff_requests", JSON.stringify(currentStaff));
    }
    setStaffRequests(currentStaff);

    // 3. Load Total Approved Students
    const savedStudents = JSON.parse(localStorage.getItem("admissions_students") || "[]");
    const approvedCount = savedStudents.filter((s: { status: string }) => s.status === "Approved").length;
    setTotalStudents(approvedCount);
  }, []);

  const logAction = (action: string) => {
    const log = {
      user: userName,
      action: action,
      timestamp: new Date().toLocaleString()
    };
    const logs = JSON.parse(localStorage.getItem('auditLogs') || '[]');
    logs.unshift(log);
    localStorage.setItem('auditLogs', JSON.stringify(logs.slice(0, 50)));
  };

  const approveTeacher = (req: RequestItem) => {
    const token = `inv_${btoa(req.email || "unknown")}`;
    const link = `${window.location.origin}/accept-invite?token=${token}`;
    
    const approvedUsers = JSON.parse(localStorage.getItem("approved_users") || "[]");
    const newUser = {
      email: req.email,
      password: "TEMPORARY_PENDING",
      role: "Teacher",
      status: "Pending Activation",
      firstName: req.name.split(" ")[0],
      lastName: req.name.split(" ").slice(1).join(" ") || "User"
    };
    const filteredUsers = approvedUsers.filter((u: { email: string }) => u.email !== req.email);
    localStorage.setItem("approved_users", JSON.stringify([...filteredUsers, newUser]));

    setGeneratedLink(`📧 Simulation: Invitation sent to ${req.email}! Link: ${link}`);

    const updatedStaff = staffRequests.filter(r => r.id !== req.id);
    setStaffRequests(updatedStaff);
    localStorage.setItem("pending_staff_requests", JSON.stringify(updatedStaff));

    logAction(`Approved teacher registration for ${req.name} (${req.email}). Invite link generated.`);
  };

  const approveParent = (req: RequestItem) => {
    const tempPassword = `Sprouty${Math.floor(1000 + Math.random() * 9000)}!`;

    const approvedUsers = JSON.parse(localStorage.getItem("approved_users") || "[]");
    const newUser = {
      email: req.email,
      password: tempPassword,
      role: "Parent",
      name: req.name
    };

    const filteredUsers = approvedUsers.filter((u: { email: string }) => u.email !== req.email);
    localStorage.setItem("approved_users", JSON.stringify([...filteredUsers, newUser]));

    const remainingRequests = parentRequests.filter(r => r.id !== req.id);
    setParentRequests(remainingRequests);
    localStorage.setItem("pending_parent_requests", JSON.stringify(remainingRequests));

    setGeneratedLink(`SMTP Simulation: Credentials sent to ${req.email}. Temp Password: ${tempPassword}`);
    logAction(`Approved parent admission for ${req.name} (${req.email})`);
  };

  const rejectParent = (id: number | string) => {
    const req = parentRequests.find(r => r.id === id);
    const name = req ? req.name : "Unknown Parent";
    const remainingRequests = parentRequests.filter(r => r.id !== id);
    setParentRequests(remainingRequests);
    localStorage.setItem("pending_parent_requests", JSON.stringify(remainingRequests));
    logAction(`Rejected parent admission for ${name}`);
  };

  const rejectTeacher = (id: number | string) => {
    const req = staffRequests.find(r => r.id === id);
    const name = req ? req.name : "Unknown Teacher";
    const updatedStaff = staffRequests.filter(r => r.id !== id);
    setStaffRequests(updatedStaff);
    localStorage.setItem("pending_staff_requests", JSON.stringify(updatedStaff));
    logAction(`Rejected teacher registration for ${name}`);
  };

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <div className="admin-container" style={{ marginLeft: "260px", flex: 1 }}>
      <header className="admin-header">
        <div className="header-text">
          <h1>Welcome {userName}!</h1>
          <p>Today is, {today}</p>
        </div>
      </header>

      <div className="stats-grid">
        <StatCard title="Total Students" value={totalStudents.toString()} subtitle="+3 new this week" colorClass="green" />
        <StatCard title="Staff on Duty" value="18" subtitle="2 on leave" colorClass="blue" />
        <StatCard title="Pending Inquiries" value="7" subtitle="Action required" colorClass="orange" />
        <StatCard title="Revenue (M)" value="Rs 1K" subtitle="Monthly" colorClass="purple" />
      </div>

      <div className="dashboard-content-grid">
        <section className="dashboard-card recent-activities">
          <div className="card-header">
            <h3>Recent Activities</h3>
            <button className="view-all">View All</button>
          </div>
          <div className="activities-list">
            {pendingRequests.map(item => (
              <div key={item.id} className="activity-item">
                <div className="activity-icon"></div>
                <div className="activity-info">
                  <h4>{item.name}</h4>
                  <p>{item.detail}</p>
                </div>
                <span className={`status-badge ${item.statusClass}`}>{item.status}</span>
              </div>
            ))}

            {staffRequests.length > 0 && (
              <div className="staff-requests-sub">
                <h4 className="sub-title">Staff Requests</h4>
                {staffRequests.map(req => (
                  <div key={req.id} className="activity-item staff-req">
                    <div className="activity-icon staff"></div>
                    <div className="activity-info">
                      <h4>{req.name}</h4>
                      <p>{req.role} • {req.email}</p>
                    </div>
                    <div className="request-actions">
                      <button className="approve-btn" onClick={() => approveTeacher(req)}>Approve</button>
                      <button className="reject-btn" onClick={() => rejectTeacher(req.id)}>Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {parentRequests.length > 0 && (
              <div className="parent-requests-sub">
                <h4 className="sub-title">Parent Requests</h4>
                {parentRequests.map(req => (
                  <div key={req.id} className="activity-item parent-req">
                    <div className="activity-icon parent"></div>
                    <div className="activity-info">
                      <h4>{req.name}</h4>
                      <p>{req.detail} • {req.email}</p>
                    </div>
                    <div className="request-actions">
                      <button className="approve-btn" onClick={() => approveParent(req)}>Approve</button>
                      <button className="reject-btn" onClick={() => rejectParent(req.id)}>Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {generatedLink && (
              <div className="generated-link-alert">
                <p>{generatedLink}</p>
              </div>
            )}
          </div>
        </section>

        <section className="dashboard-card upcoming-schedule">
          <div className="card-header">
            <h3>Upcoming Schedule</h3>
          </div>
          <div className="schedule-list">
            <div className="schedule-item">
              <div className="date-box">
                <span className="day">{new Date().getDate()}</span>
                <span className="label">Today</span>
              </div>
              <div className="schedule-info">
                <h4>Morning Circle Time</h4>
                <p>09:00 AM - 10:30 AM • Main Hall</p>
              </div>
            </div>
            <div className="schedule-item">
              <div className="date-box">
                <span className="day">{new Date().getDate()}</span>
                <span className="label">Today</span>
              </div>
              <div className="schedule-info">
                <h4>Staff Meeting</h4>
                <p>12:30 PM - 01:30 PM • Staff Room</p>
              </div>
            </div>
            <div className="schedule-item">
              <div className="date-box tomorrow">
                <span className="day">{new Date().getDate() + 1}</span>
                <span className="label">Tomorrow</span>
              </div>
              <div className="schedule-info">
                <h4>Parent Teacher Conference</h4>
                <p>All Day • Classrooms 1-4</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="daily-vibe-banner">
        <div className="vibe-content">
          <h3>Daily Vibe</h3>
          <p>Everything is running smoothly!</p>
          <button className="chat-btn">
            <MessageSquare size={18} /> Chat with us
          </button>
        </div>
        <div className="vibe-decoration">
          <div className="circle c1"></div>
          <div className="circle c2"></div>
        </div>
      </div>
      </div>
    </div>
  );
}