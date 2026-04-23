import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdChecklist,      // ✅ Best for attendance
  MdAssignment,
  MdRestaurant,        // ✅ Best for meals
  MdChat,
} from "react-icons/md";

import "../parent/Sidebar.css";
import Logo from "@/shared/assets/images/logo.png";
import DefaultAvatar from "@/shared/assets/images/admin-avatar.jpeg";

import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "@/features/auth/model/authSlice";

export default function TeacherSidebar({ onOpenSettings }: any) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const dispatch = useDispatch();

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
         <p className="menu-title">MY CLASSROOM</p>
        <NavLink to="/teacher/dashboard">
          <MdDashboard /> Home
        </NavLink>

        <NavLink to="/teacher/attendance">
          <MdChecklist /> Daily Attendance
        </NavLink>

        <NavLink to="/teacher/activities">
          <MdAssignment /> My Activities
        </NavLink>

        <NavLink to="/teacher/meals">
          <MdRestaurant /> Meals
        </NavLink>

        <NavLink to="/teacher/messages">
          <MdChat /> Messaging
        </NavLink>

      </nav>

      {/* FOOTER USER */}
      <div className="sb-footer" ref={menuRef}>
        <div className="sb-usercard" onClick={() => setOpen(!open)}>

          <div className="sb-avatar">
            <img src={DefaultAvatar} alt="user" />
          </div>

          <div className="sb-usertext">
            <div className="sb-user-name">
              {user?.firstName || "Teacher"}
            </div>
            <div className="sb-user-role">
              {user?.role || "Teacher"}
            </div>
          </div>

          <div className={`sb-caret ${open ? "up" : ""}`}>▾</div>
        </div>

        {open && (
          <div className="sb-dropdown">
            <button onClick={() => navigate("/teacher/profile")}>
              Profile
            </button>

            <button onClick={() => onOpenSettings?.()}>
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
