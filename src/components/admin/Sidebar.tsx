import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MdHome,
  MdAssignmentInd,
  MdPeople,
  MdManageAccounts,
  MdCalendarMonth,
  MdChat,
  MdCreditCard,
  MdPayments,
  MdSchool,
  MdDescription,
  MdSecurity,
  MdHistory,
} from "react-icons/md";

import "./Sidebar.css";

import Logo from "../../shared/assets/images/logo.png";
import AvatarImg from "../../shared/assets/images/admin-avatar.jpeg";

import { useSelector, useDispatch } from "react-redux";
import { logout, selectUser } from "@/features/auth/model/authSlice";

interface SidebarProps {
  onOpenSettings?: () => void;
}

export default function Sidebar({ onOpenSettings }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // close dropdown when click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const signOut = () => {
    setOpen(false);
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside className="sidebar">

      {/* HEADER */}
      <div className="sidebar-header">
        <img src={Logo} alt="logo" />
        <span>LITTLESPARKS</span>
      </div>

      {/* MENU */}
      <nav className="sidebar-menu">
        <NavLink to="/admin/dashboard"><MdHome /> Home</NavLink>
        <NavLink to="/admin/admissions"><MdAssignmentInd /> Admissions</NavLink>

        <p className="menu-title">MY SCHOOL</p>
        <NavLink to="/admin/students"><MdPeople /> Students</NavLink>
        <NavLink to="/admin/parents"><MdPeople /> Parents</NavLink>
        <NavLink to="/admin/staff"><MdManageAccounts /> Staff</NavLink>

        <p className="menu-title">MANAGEMENT</p>
        <NavLink to="/admin/schedules"><MdCalendarMonth /> Schedules</NavLink>
        <NavLink to="/admin/messaging"><MdChat /> Messaging</NavLink>
        <NavLink to="/admin/billing"><MdCreditCard /> Billing</NavLink>
        <NavLink to="/admin/payrolls"><MdPayments /> Payrolls</NavLink>
        <NavLink to="/admin/learning"><MdSchool /> Learning</NavLink>
        <NavLink to="/admin/paperwork"><MdDescription /> Paperwork</NavLink>

        <p className="menu-title">ADMIN TOOLS</p>
        <NavLink to="/admin/users"><MdSecurity /> Manage Users</NavLink>
        <NavLink to="/admin/logs"><MdHistory /> Audit Logs</NavLink>
      </nav>

      {/* FOOTER */}
      <div className="sb-footer" ref={menuRef}>

        {/* OVAL CLICKABLE PROFILE BUTTON */}
        <div className="sb-usercard" onClick={() => setOpen(!open)}>
          
          <div className="sb-avatar">
            <img src={AvatarImg} alt="admin" />
          </div>

          <div className="sb-usertext">
            <div className="sb-user-role">
              {user?.role || "Administrator"}
            </div>
            <div className="sb-user-name">
              {user?.firstName || "Admin User"}
            </div>
          </div>

          <div className={`sb-caret ${open ? "up" : ""}`}>▾</div>
        </div>

        {/* DROPDOWN */}
        {open && (
          <div className="sb-dropdown">
            <button onClick={() => navigate("/admin/profile")}>
              Profile
            </button>

            <button onClick={onOpenSettings}>
              Settings
            </button>

            <button className="danger" onClick={signOut}>
              Sign out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}