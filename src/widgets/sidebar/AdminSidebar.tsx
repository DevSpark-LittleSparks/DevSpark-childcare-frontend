import { useEffect, useRef, useState } from "react";
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
  MdAccountCircle,
  MdSettings,
  MdLogout,
  MdKeyboardArrowDown,
} from "react-icons/md";
import "./Sidebar.css";

import Logo from "@/shared/assets/images/logo.png";
import AvatarImg from "@/shared/assets/images/admin-avatar.jpeg";

import { useAppDispatch, useAppSelector, RootState } from "@/app/store";
import { logout } from "@/features/auth/model/authSlice";
import { firebaseAuth } from "@/shared/auth/firebase";
import { signOut as firebaseSignOut } from "firebase/auth";

interface AdminSidebarProps {
  onOpenSettings?: () => void;
}

export default function AdminSidebar({ onOpenSettings }: AdminSidebarProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);

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

  const goProfile = () => {
    setOpen(false);
    navigate("/admin/profile");
  };

  const signOut = async () => {
    setOpen(false);
    try {
      if (firebaseAuth) {
        await firebaseSignOut(firebaseAuth);
      }
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const displayName = user
    ? (user.displayName || user.email?.split("@")[0] || "Admin User")
    : "Admin User";

  const displayRole = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()
    : "Administrator";

  // Initials for avatar fallback
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Use real user photo if available, else fallback to asset
  const avatarSrc = user?.photoURL || AvatarImg;

  return (
    <aside className="sidebar">
      {/* Header / Brand */}
      <div className="sidebar-header">
        <img src={Logo} alt="LittleSparks" />
        <span>LittleSparks</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-menu">
        <NavLink to="/admin/dashboard">
          <MdHome size={18} /> Home
        </NavLink>
        <NavLink to="/admin/admissions">
          <MdAssignmentInd size={18} /> Admissions
        </NavLink>

        <p className="menu-title">My School</p>
        <NavLink to="/admin/students">
          <MdPeople size={18} /> Students
        </NavLink>
        <NavLink to="/admin/parents">
          <MdPeople size={18} /> Parents
        </NavLink>
        <NavLink to="/admin/staff">
          <MdManageAccounts size={18} /> Staff
        </NavLink>

        <p className="menu-title">Management</p>
        <NavLink to="/admin/schedules">
          <MdCalendarMonth size={18} /> Schedules
        </NavLink>
        <NavLink to="/admin/messaging">
          <MdChat size={18} /> Messaging
        </NavLink>
        <NavLink to="/admin/billing">
          <MdCreditCard size={18} /> Billing
        </NavLink>
        <NavLink to="/admin/payrolls">
          <MdPayments size={18} /> Staff & Payrolls
        </NavLink>
        <NavLink to="/admin/learning">
          <MdSchool size={18} /> Learning
        </NavLink>
        <NavLink to="/admin/paperwork">
          <MdDescription size={18} /> Paperwork
        </NavLink>

        <p className="menu-title">Admin Tools</p>
        <NavLink to="/admin/users">
          <MdSecurity size={18} /> Manage Users
        </NavLink>
        <NavLink to="/admin/logs">
          <MdHistory size={18} /> Audit Logs
        </NavLink>
      </nav>

      {/* ── Footer user card with dropdown ── */}
      <div className="sb-footer">
        <div className="sb-user-wrap" ref={menuRef}>

          {/* Dropdown (renders above footer) */}
          {open && (
            <div className="sb-dropdown">
              <div className="sb-dd-header">
                <div className="sb-dd-avatar">
                  <img
                    src={avatarSrc}
                    alt={displayName}
                    onError={(e) => {
                      // If image fails to load, hide it and show initials
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <div>
                  <div className="sb-dd-name">{displayName}</div>
                  <div className="sb-dd-role">{displayRole}</div>
                </div>
              </div>

              <div className="sb-dd-divider" />

              <button className="sb-dd-item" onClick={goProfile}>
                <MdAccountCircle size={16} />
                Profile
              </button>
              <button
                className="sb-dd-item"
                onClick={() => {
                  setOpen(false);
                  if (onOpenSettings) onOpenSettings();
                }}
              >
                <MdSettings size={16} />
                Settings
              </button>

              <div className="sb-dd-divider" />

              <button className="sb-dd-item danger" onClick={signOut}>
                <MdLogout size={16} />
                Sign out
              </button>
            </div>
          )}

          {/* Trigger button */}
          <button
            type="button"
            className="sb-usercard"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            <div className="sb-avatar">
              <img
                src={avatarSrc}
                alt={displayName}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>

            <div className="sb-usertext">
              <div className="sb-user-name">{displayName}</div>
              <div className="sb-user-role">{displayRole}</div>
            </div>

            <MdKeyboardArrowDown
              size={20}
              className={`sb-caret-icon ${open ? "open" : ""}`}
            />
          </button>
        </div>
      </div>
    </aside>
  );
}
