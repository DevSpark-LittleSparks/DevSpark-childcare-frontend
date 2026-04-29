import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MdDashboard, MdPeople,MdRestaurant, MdTrendingUp, MdPayment, MdNotifications, MdChat, MdLogout, MdSettings, MdPerson, MdKeyboardArrowUp } from "react-icons/md";
import "./Sidebar.css";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectUser } from "../../features/auth/model/authSlice";
import { Logo } from "../common/Logo";

export default function ParentSidebar({ onOpenSettings }: { onOpenSettings?: () => void }) {
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

  return (


    <aside className="sidebar-container">
      {/* BRAND SECTION (Optional - if you want logo inside sidebar) */}
      <div className="sidebar-brand">
        <Logo />
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">
          <NavLink to="/parent/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <MdDashboard className="nav-icon" /> <span>Home</span>
          </NavLink>
        </div>
        <div className="nav-group">
          <p className="nav-group-title">PARENT PORTAL</p>
          <NavLink to="/parent/children" className="nav-link"><MdPeople className="nav-icon" /> <span>My Children</span></NavLink>
          <NavLink to="/parent/progress" className="nav-link"><MdTrendingUp className="nav-icon" /> <span>Progress</span></NavLink>
          <NavLink to="/parent/meals" className="nav-link"><MdRestaurant className="nav-icon" /> <span>Meal</span></NavLink>
          <NavLink to="/parent/payments" className="nav-link"><MdPayment className="nav-icon" /> <span>Payments</span></NavLink>
                  
                    <p className="nav-group-title">COMMUNICATION</p>
          <NavLink to="/parent/messages" className="nav-link"><MdChat className="nav-icon" /> <span>Messaging </span></NavLink>
        </div>
      </nav>

      <div className="sidebar-footer" ref={menuRef}>
        {open && (
          <div className="profile-dropdown animate-slide-up">
            <button className="dropdown-item" onClick={() => navigate("/parent/profile")}><MdPerson className="dropdown-icon" /> <span>Profile</span></button>
            <button className="dropdown-item" onClick={onOpenSettings}><MdSettings className="dropdown-icon" /> <span>Settings</span></button>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item logout-btn" onClick={() => { dispatch(logout()); navigate("/login"); }}><MdLogout className="dropdown-icon" /> <span>Sign out</span></button>
          </div>
        )}
        <div className={`user-card ${open ? "active" : ""}`} onClick={() => setOpen(!open)}>
          <img src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.firstName}&background=22d3ee&color=fff`} className="user-avatar-img" alt="User" />
          <div className="user-info">
            <span className="user-name">{user?.firstName || "Parent"}</span>
            <span className="user-role">Guardian</span>
          </div>
          <MdKeyboardArrowUp className={`caret-icon ${open ? "rotate" : ""}`} />
        </div>
      </div>
    </aside>
  );
}