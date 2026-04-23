import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdTrendingUp,
  MdPayment,
  MdNotifications,
  MdChat,
  MdPerson,
} from "react-icons/md";

import "./Sidebar.css";

import Logo from "../../shared/assets/images/logo.png";
import DefaultAvatar from "@/shared/assets/images/admin-avatar.jpeg";


import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "@/features/auth/model/authSlice";


export default function ParentSidebar({ onOpenSettings }: any) {
  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const userAvatar = localStorage.getItem("parentAvatar");
  const userName =
    user
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email
      : "Parent User";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigate to profile
  const goProfile = () => {
    setOpen(false);
    navigate("/parent/profile");
  };

  // ✅ TEMP LOGOUT (NO FIREBASE)
  const signOut = () => {
    setOpen(false);
    dispatch(logout());
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="ps-sidebar">

      {/* BRAND */}
      <div className="ps-brand">
        <img src={Logo} alt="logo" />
        <span>SPROUTY</span>
      </div>

      {/* MENU */}
      <nav className="ps-menu">
        <NavLink to="/parent/dashboard" className="ps-link">
          <MdDashboard size={18} />
          <span>Home</span>
        </NavLink>

        <NavLink to="/parent/children" className="ps-link">
          <MdPeople size={18} />
          <span>My Children</span>
        </NavLink>

        <NavLink to="/parent/progress" className="ps-link">
          <MdTrendingUp size={18} />
          <span>Progress</span>
        </NavLink>

        <NavLink to="/parent/payments" className="ps-link">
          <MdPayment size={18} />
          <span>Payments</span>
        </NavLink>

        <NavLink to="/parent/notifications" className="ps-link">
          <MdNotifications size={18} />
          <span>Notifications</span>
        </NavLink>

        <NavLink to="/parent/messaging" className="ps-link">
          <MdChat size={18} />
          <span>Messaging</span>
        </NavLink>
      </nav>

      {/* FOOTER USER */}
      <div className="ps-footer" ref={menuRef}>

        <button className="ps-usercard" onClick={() => setOpen(!open)}>

          {/* AVATAR */}
          <div className="ps-avatar">
            <img
              src={userAvatar || DefaultAvatar}
              alt="user"
            />
          </div>

          {/* TEXT */}
          <div className="ps-usertext">
            <div className="ps-user-name">{userName}</div>
            <div className="ps-user-role">
              {user?.role || "Parent Account"}
            </div>
          </div>

          <div className={`ps-caret ${open ? "up" : ""}`}>▾</div>
        </button>

        {/* DROPDOWN */}
        {open && (
          <div className="ps-dropdown">
            <button onClick={goProfile}>Profile</button>

            <button
              onClick={() => {
                setOpen(false);
                onOpenSettings?.();
              }}
            >
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