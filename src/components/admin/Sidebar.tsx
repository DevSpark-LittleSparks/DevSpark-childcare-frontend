import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MdHome, MdAssignmentInd, MdPeople, MdManageAccounts,
  MdCalendarMonth, MdChat, MdCreditCard, MdPayments,
  MdSchool, MdDescription, MdSecurity, MdHistory
} from "react-icons/md";
import "./Sidebar.css";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { logout } from "@/features/auth/model/authSlice";
import { firebaseAuth } from "@/shared/auth/firebase";
import { signOut as firebaseSignOut } from "firebase/auth";

interface SidebarProps {
  onOpenSettings?: () => void;
}

export default function Sidebar({ onOpenSettings }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
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

  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const goProfile = () => { setOpen(false); navigate("/admin/profile"); };

  const signOut = async () => {
    setOpen(false);
    try {
      await firebaseSignOut(firebaseAuth);
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="https://ui-avatars.com/api/?name=S&background=0284c7&color=fff&rounded=true" alt="Sprouty" />
        <span>SPROUTY</span>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/admin/dashboard"><MdHome size={18} /> Home</NavLink>
        <NavLink to="/admin/admissions"><MdAssignmentInd size={18} /> Admissions</NavLink>

        <p className="menu-title">MY SCHOOL</p>
        <NavLink to="/admin/students"><MdPeople size={18} /> Students</NavLink>
        <NavLink to="/admin/parents"><MdPeople size={18} /> Parents</NavLink>
        <NavLink to="/admin/staff"><MdManageAccounts size={18} /> Staff</NavLink>

        <p className="menu-title">MANAGEMENT</p>
        <NavLink to="/admin/schedules"><MdCalendarMonth size={18} /> Schedules</NavLink>
        <NavLink to="/admin/messaging"><MdChat size={18} /> Messaging</NavLink>
        <NavLink to="/admin/billing"><MdCreditCard size={18} /> Billing</NavLink>
        <NavLink to="/admin/payrolls"><MdPayments size={18} /> Staff & Payrolls</NavLink>
        <NavLink to="/admin/learning"><MdSchool size={18} /> Learning</NavLink>
        <NavLink to="/admin/paperwork"><MdDescription size={18} /> Paperwork</NavLink>

        <p className="menu-title">ADMIN TOOLS</p>
        <NavLink to="/admin/users"><MdSecurity size={18} /> Manage Users</NavLink>
        <NavLink to="/admin/logs"><MdHistory size={18} /> Audit Logs</NavLink>
      </nav>

      <div className="sb-footer">
        <div className="sb-user-wrap" ref={menuRef}>
          <button type="button" className="sb-usercard" onClick={() => setOpen(v => !v)}>
            <div className="sb-avatar">
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=334155&color=fff" alt="Admin" />
            </div>
            <div className="sb-usertext">
              <div className="sb-user-name">{user ? (user.displayName || user.email) : "Admin User"}</div>
              <div className="sb-user-role">Administrator</div>
            </div>
            <div className={`sb-caret ${open ? "up" : ""}`}>▾</div>
          </button>

          {open && (
            <div className="sb-dropdown">
              <button className="sb-dd-item" onClick={goProfile}>Profile</button>
              <button className="sb-dd-item" onClick={() => { setOpen(false); if (onOpenSettings) onOpenSettings(); }}>Settings</button>
              <button className="sb-dd-item danger" onClick={signOut}>Sign out</button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
