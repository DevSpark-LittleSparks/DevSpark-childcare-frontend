import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  MdHome, MdAssignmentInd, MdPeople, MdManageAccounts, 
  MdCalendarMonth, MdChat, MdCreditCard, MdPayments, 
  MdSecurity, MdHistory, MdLogout, MdSettings, MdPerson,
  MdKeyboardArrowUp 
} from "react-icons/md";
import "./Sidebar.css";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectUser } from "../../features/auth/model/authSlice";
import { Logo } from "../common/Logo";

export default function AdminSidebar({ onOpenSettings }: { onOpenSettings?: () => void }) {

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const signOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (

    <aside className="sidebar-container">
      {/* BRAND SECTION (Optional - if you want logo inside sidebar) */}
      <div className="sidebar-brand">
        <Logo />
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <MdHome className="nav-icon" /> <span>Home</span>
          </NavLink>
          <NavLink to="/admin/admissions" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <MdAssignmentInd className="nav-icon" /> <span>Admissions</span>
          </NavLink>
        </div>

        <div className="nav-group">
          <p className="nav-group-title">School Management</p>
          <NavLink to="/admin/students" className="nav-link"><MdPeople className="nav-icon" /> <span>Students</span></NavLink>
          <NavLink to="/admin/parents" className="nav-link"><MdPeople className="nav-icon" /> <span>Parents</span></NavLink>
          <NavLink to="/admin/staff" className="nav-link"><MdManageAccounts className="nav-icon" /> <span>Staff</span></NavLink>
        </div>

        <p className="nav-group-title">Management</p>
          <NavLink to="/admin/schedules" className="nav-link"><MdCreditCard className="nav-icon" /> <span>Schedules</span></NavLink>
          <NavLink to="/admin/learning" className="nav-link"><MdPayments className="nav-icon" /> <span>Learning</span></NavLink>
          <NavLink to="/admin/paperwork" className="nav-link"><MdChat className="nav-icon" /> <span>Paper-Work</span></NavLink>



        <div className="nav-group">
          <p className="nav-group-title">Financials</p>
          <NavLink to="/admin/billing" className="nav-link"><MdCreditCard className="nav-icon" /> <span>Billing</span></NavLink>
          <NavLink to="/admin/payrolls" className="nav-link"><MdPayments className="nav-icon" /> <span>Payrolls</span></NavLink>
        </div>

        <div className="nav-group">
          <p className="nav-group-title">System</p>
          <NavLink to="/admin/users" className="nav-link"><MdSecurity className="nav-icon" /> <span>Manage Users</span></NavLink>
          <NavLink to="/admin/logs" className="nav-link"><MdHistory className="nav-icon" /> <span>Audit Logs</span></NavLink>
        </div>


      
<div className="nav-group">
      <p className="nav-group-title">Communication</p>
            <NavLink to="/admin/messages" className="nav-link"><MdChat className="nav-icon" /> <span>Messaging</span></NavLink>
</div>
</nav>


      {/* --- RE-DESIGNED PROFESSIONAL FOOTER --- */}
      <div className="sidebar-footer" ref={menuRef}>
        {open && (
          <div className="profile-dropdown animate-slide-up">
            <button className="dropdown-item" onClick={() => navigate("/admin/profile")}>
              <MdPerson className="dropdown-icon" /> <span>Profile</span>
            </button>
            <button className="dropdown-item" onClick={onOpenSettings}>
              <MdSettings className="dropdown-icon" /> <span>Settings</span>
            </button>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item logout-btn" onClick={signOut}>
              <MdLogout className="dropdown-icon" /> <span>Sign out</span>
            </button>
          </div>
        )}

        <div className={`user-card ${open ? "active" : ""}`} onClick={() => setOpen(!open)}>
          <div className="user-avatar-container">
            <img 
              src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.firstName}&background=22d3ee&color=fff`} 
              alt="Profile" 
              className="user-avatar-img" 
            />
            <div className="status-dot"></div>
          </div>
          
          <div className="user-info">
            <span className="user-name">{user?.firstName} {user?.lastName}</span>
            <span className="user-role">{user?.role || "Administrator"}</span>
          </div>

          <MdKeyboardArrowUp className={`caret-icon ${open ? "rotate" : ""}`} />
        </div>
      </div>
    </aside>
  );
}