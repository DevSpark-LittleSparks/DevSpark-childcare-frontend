import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  MdDashboard, 
  MdChecklist, 
  MdAssignment, 
  MdRestaurant, 
  MdChat, 
  MdPerson, 
  MdSettings, 
  MdLogout,
  MdKeyboardArrowUp 
} from "react-icons/md";
import "./Sidebar.css";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectUser } from "../../features/auth/model/authSlice";
import { Logo } from "../common/Logo";

export default function TeacherSidebar({ onOpenSettings }: { onOpenSettings?: () => void }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside className="sidebar-container">
      {/* Brand Section: Logo */}
      <div className="sidebar-brand">
        <Logo />
      </div>

      <nav className="sidebar-nav">
        <p className="nav-group-title">MY CLASSROOM</p>
        
        <NavLink 
          to="/teacher/dashboard" 
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          <MdDashboard className="nav-icon" /> <span>Home</span>
        </NavLink>

        <NavLink 
          to="/teacher/attendance" 
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          <MdChecklist className="nav-icon" /> <span>Daily Attendance</span>
        </NavLink>

        <NavLink 
          to="/teacher/activities" 
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          <MdAssignment className="nav-icon" /> <span>My Activities</span>
        </NavLink>

        <NavLink 
          to="/teacher/meals" 
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          <MdRestaurant className="nav-icon" /> <span>Meals</span>
        </NavLink>
 

        <p className="nav-group-title">COMMUNICATION</p>
        <NavLink 
          to="/teacher/messages" 
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          <MdChat className="nav-icon" /> <span>Messaging</span>
        </NavLink>
      </nav>

      {/* Profile Section */}
      <div className="sidebar-footer" ref={menuRef}>
        {open && (
          <div className="profile-dropdown animate-slide-up">
            <button className="dropdown-item" onClick={() => navigate("/teacher/profile")}>
              <MdPerson className="dropdown-icon" /> <span>Profile</span>
            </button>
            <button className="dropdown-item" onClick={onOpenSettings}>
              <MdSettings className="dropdown-icon" /> <span>Settings</span>
            </button>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item logout-btn" onClick={handleSignOut}>
              <MdLogout className="dropdown-icon" /> <span>Sign out</span>
            </button>
          </div>
        )}

        <div className={`user-card ${open ? "active" : ""}`} onClick={() => setOpen(!open)}>
          <div className="user-avatar-wrapper">
             <div className="user-avatar-placeholder">
                {user?.firstName?.charAt(0) || "T"}
             </div>
          </div>
          <div className="user-info">
            <span className="user-name">{user?.firstName || "Teacher"}</span>
            <span className="user-role">Educator</span>
          </div>
          <MdKeyboardArrowUp className={`caret-icon ${open ? "rotate" : ""}`} />
        </div>
      </div>
    </aside>
  );
}