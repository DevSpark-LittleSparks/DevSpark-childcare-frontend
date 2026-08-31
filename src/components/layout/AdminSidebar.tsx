import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard, MdAssignmentInd, MdPeople, MdManageAccounts,
  MdCreditCard, MdPayments, MdChat, MdRestaurant, MdSecurity, MdHistory,
  MdLogout, MdSettings, MdPerson, MdKeyboardArrowUp,
  MdMenuOpen, MdMenu, MdAttachMoney, MdCampaign, MdFamilyRestroom, MdBadge
} from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectUser } from "../../features/auth/model/authSlice";
import { useAccountId } from "../../entities/auth/model/useAccountId";
import { useUnreadMessageCount } from "../../entities/chat/model/useUnreadMessageCount";
import { useUnreadAlertCount } from "../../entities/alerts/model/useUnreadAlertCount";
import adminAvatar from "../../assets/images/admin-avatar.jpeg";

/**
 * SidebarProps Interface
 * Used to sync the collapse state between the Layout and the Sidebar.
 */
interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  onOpenSettings?: () => void;
}

/**
 * Logo Component
 * Handles the display of the full logo vs. the house icon based on isCollapsed.
 */
const LittleSparksLogo = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <div className={`flex items-center gap-0 select-none transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}>
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 w-10 h-10"
      viewBox="0 0 260.000000 280.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        transform="translate(0.000000,280.000000) scale(0.100000,-0.100000)"
        fill="#1F2937"
        stroke="#1F2937"
        strokeWidth="80"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1270 2460 c-62 -18 -141 -70 -295 -194 -126 -101 -160 -131 -318 -286 -171 -166 -267 -283 -267 -325 0 -26 62 -45 144 -45 103 0 106 -4 106 -138 0 -120 21 -291 46 -385 63 -236 230 -415 457 -491 58 -19 67 -20 67 -3 0 7 -26 21 -59 31 -89 27 -178 83 -262 166 -147 147 -200 301 -220 645 -5 99 -12 181 -15 184 -7 7 -103 19 -159 20 -69 2 -83 12 -65 46 27 50 208 242 357 379 180 165 337 288 433 339 69 38 72 39 120 27 141 -34 446 -280 702 -567 55 -62 113 -130 129 -152 35 -47 33 -48 -82 -57 -67 -6 -83 -11 -94 -28 -9 -15 -14 -87 -18 -266 -4 -214 -7 -253 -26 -311 -52 -164 -186 -288 -370 -343 -78 -23 -207 -21 -283 5 -220 74 -378 314 -378 573 0 189 68 331 175 366 80 26 170 -46 210 -169 16 -49 23 -196 13 -271 -6 -47 17 -35 34 17 32 100 108 185 206 230 127 59 229 -10 201 -135 -30 -137 -171 -257 -335 -285 -43 -7 -64 -16 -64 -25 0 -31 169 12 250 63 147 93 224 277 158 375 -66 98 -242 64 -358 -67 -22 -25 -40 -50 -40 -54 0 -5 -4 -9 -9 -9 -4 0 -11 33 -13 73 -11 146 -79 257 -175 282 -132 34 -222 -53 -268 -259 -70 -313 118 -656 404 -740 175 -51 400 13 541 153 76 76 121 159 140 256 7 33 14 165 17 293 4 158 9 235 17 238 6 2 49 8 95 13 96 10 120 25 100 62 -63 120 -431 489 -639 641 -144 105 -246 147 -310 128z" />
      </g>
    </svg>
    {!isCollapsed && (
      <span className="font-bold tracking-tighter -ml-2 text-2xl text-[#1F2937] dark:text-white" style={{ fontFamily: "'Nunito', sans-serif" }}>
        Little<span style={{ color: '#06C5D4' }}>Sparks</span>
      </span>
    )}
  </div>
);

export default function AdminSidebar({ isCollapsed, setIsCollapsed, onOpenSettings }: SidebarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accountId } = useAccountId();
  const unreadCount = useUnreadMessageCount(accountId);
  const unreadAlertCount = useUnreadAlertCount(user?.uid, user?.role);

  /** Handle clicking outside to close the dropdown */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const signOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside
      className={`h-screen bg-[#E4F7F7] dark:bg-slate-900 dark:bg-slate-900 flex flex-col fixed left-0 top-0 z-[1000] border-r border-cyan-100 dark:border-slate-800 shadow-sm transition-all duration-300 ease-in-out ${isCollapsed ? "w-[80px]" : "w-[280px]"
        }`}
    >
      {/* BRAND & TOGGLE */}
      <div className={`p-4 flex items-center border-b border-cyan-200/30 dark:border-slate-800/50 mb-2 ${isCollapsed ? 'flex-col gap-4' : 'justify-between'}`}>
        <LittleSparksLogo isCollapsed={isCollapsed} />
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          // Logic: Uses text-slate-500 to match the other navigation icons
          // Added hover:text-slate-700 to match the hover behavior of the links
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60 transition-all duration-300"
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? (
            <MdMenu className="text-2xl" />
          ) : (
            <MdMenuOpen className="text-2xl" />
          )}
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto scrollbar-hide overflow-x-hidden">
        <div className="space-y-1 mb-6">
          <SidebarLink to="/admin/dashboard" icon={<MdDashboard />} label="Home" isCollapsed={isCollapsed} />
          <SidebarLink to="/admin/admissions" icon={<MdAssignmentInd />} label="Admissions" isCollapsed={isCollapsed} />
          <SidebarLink to="/admin/broadcast" icon={<MdCampaign />} label="Broadcast Center" isCollapsed={isCollapsed} />
        </div>

        <NavGroup title="School Management" isCollapsed={isCollapsed}>
          <SidebarLink to="/admin/students" icon={<MdPeople />} label="Students" isCollapsed={isCollapsed} />
          <SidebarLink to="/admin/parents" icon={<MdFamilyRestroom />} label="Parents" isCollapsed={isCollapsed} />
          <SidebarLink to="/admin/teachers" icon={<MdBadge />} label="Staff" isCollapsed={isCollapsed} />
        </NavGroup>

        <NavGroup title="Supervision" isCollapsed={isCollapsed}>
          <SidebarLink to="/admin/schedules" icon={<MdCreditCard />} label="Schedules" isCollapsed={isCollapsed} />
          <SidebarLink to="/admin/learning" icon={<MdPayments />} label="Learning" isCollapsed={isCollapsed} />
          <SidebarLink to="/admin/meals" icon={<MdRestaurant />} label="Meals" isCollapsed={isCollapsed} />
          <SidebarLink to="/admin/billing" icon={<MdAttachMoney />} label="Billing" isCollapsed={isCollapsed} />
        </NavGroup>

        <NavGroup title="Communication" isCollapsed={isCollapsed}>
          <SidebarLink to="/admin/messages" icon={<MdChat />} label="Messages" isCollapsed={isCollapsed} badge={unreadCount} />
          <SidebarLink to="/admin/alerts" icon={<MdCampaign />} label="Alerts" isCollapsed={isCollapsed} badge={unreadAlertCount} />
        </NavGroup>

        <NavGroup title="System" isCollapsed={isCollapsed}>
          <SidebarLink to="/admin/users" icon={<MdSecurity />} label="Manage Users" isCollapsed={isCollapsed} />
          <SidebarLink to="/admin/logs" icon={<MdHistory />} label="Audit Logs" isCollapsed={isCollapsed} />
        </NavGroup>
      </nav>

      {/* FOOTER SECTION: Restored Profile Dropdown logic */}
      <div className="p-4 border-t border-cyan-200/30 dark:border-slate-800/50 relative" ref={menuRef}>
        {/* The Dropdown Menu */}
        {profileOpen && (
          <div className={`absolute bottom-[85px] ${isCollapsed ? 'left-16 w-48' : 'left-4 right-4'} bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-2xl border border-slate-100 dark:border-slate-700 z-[1001] animate-in fade-in slide-in-from-bottom-2 duration-200`}>
            <button className="w-full flex items-center gap-3 p-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-all" onClick={() => { setProfileOpen(false); navigate("/admin/profile"); }}>
              <MdPerson className="text-xl text-slate-400" /> Profile
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-all" onClick={() => { setProfileOpen(false); onOpenSettings?.(); }}>
              <MdSettings className="text-xl text-slate-400" /> Settings
            </button>
            <div className="h-[1px] bg-slate-100 dark:bg-slate-700 my-1"></div>
            <button className="w-full flex items-center gap-3 p-3 text-sm font-bold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all" onClick={signOut}>
              <MdLogout className="text-xl" /> Sign out
            </button>
          </div>
        )}

        {/* User Badge/Trigger */}
        <div
          className={`flex items-center gap-3 p-2 rounded-2xl cursor-pointer transition-all border ${profileOpen ? 'bg-white dark:bg-slate-800 shadow-md border-cyan-200 dark:border-slate-700' : 'hover:bg-white/50 dark:hover:bg-slate-800/50 border-transparent'} ${isCollapsed ? 'justify-center' : ''}`}
          onClick={() => setProfileOpen(!profileOpen)}
        >
          {user?.photoURL && user.photoURL !== "null" && user.photoURL.trim() !== "" ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-10 h-10 rounded-xl object-cover border-2 border-white dark:border-slate-700 shadow-sm shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23cbd5e1"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center text-white font-black text-lg border-2 border-white dark:border-slate-700 shadow-sm shrink-0">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "A"}
            </div>
          )}

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.displayName || "Admin"}</p>
              <p className="text-[10px] font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">{user?.role || "Administrator"}</p>
            </div>
          )}

          {!isCollapsed && <MdKeyboardArrowUp className={`text-slate-400 transition-transform duration-300 ${profileOpen ? "rotate-180" : ""}`} />}
        </div>
      </div>
    </aside>
  );
}

const SidebarLink = ({ to, icon, label, isCollapsed, badge }: { to: string, icon: any, label: string, isCollapsed: boolean, badge?: number }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all relative group ${isActive
        ? "bg-[#CFFAFE] dark:bg-cyan-900/40 text-[#0891B2] dark:text-cyan-400 shadow-sm"
        : "text-slate-500 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-white"
      } ${isCollapsed ? "justify-center px-0" : ""}`
    }
  >
    <span className="text-2xl shrink-0 relative">
      {icon}
      {!!badge && (
        <span className={`absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full flex items-center justify-center font-bold ${
          badge > 9 ? "text-[9px] min-w-[16px] h-4 px-1" : "text-[9px] w-4 h-4"
        }`}>
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </span>
    <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
      {label}
    </span>
    {isCollapsed && (
      <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[2000] whitespace-nowrap shadow-lg">
        {label}
      </div>
    )}
  </NavLink>
);

const NavGroup = ({ title, children, isCollapsed }: { title: string, children: any, isCollapsed: boolean }) => (
  <div className="pt-4">
    {!isCollapsed ? (
      <p className="px-4 text-[10px] font-black text-cyan-600/60 dark:text-slate-500 uppercase tracking-[0.15em] mb-2">{title}</p>
    ) : (
      <div className="mx-4 h-[1px] bg-cyan-200/30 dark:bg-slate-800/50 mb-4" />
    )}
    <div className="space-y-1">{children}</div>
  </div>
);