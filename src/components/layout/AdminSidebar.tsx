import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  MdHome, MdAssignmentInd, MdPeople, MdManageAccounts, 
  MdCreditCard, MdPayments, MdChat, MdSecurity, MdHistory, 
  MdLogout, MdSettings, MdPerson, MdKeyboardArrowUp 
} from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectUser } from "../../features/auth/model/authSlice";

// ==========================================
// 1) Internal Logo Component (Landing Page Style)
// ==========================================
interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  variant?: 'light' | 'dark';
}

const LittleSparksLogo: React.FC<LogoProps> = ({ 
  className = '', 
  iconClassName = 'w-10 h-10', 
  textClassName = 'text-2xl',
  variant = 'dark'
}) => {
  const isLight = variant === 'light';
  const iconColor = isLight ? '#FFFFFF' : '#1F2937';
  const mainTextColor = isLight ? 'text-white' : 'text-[#1F2937]';
  const sparksColor = '#06C5D4';

  return (
    <div className={`flex items-center gap-0 select-none ${className}`}>
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${iconClassName}`}
        viewBox="0 0 260.000000 280.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <g
          transform="translate(0.000000,280.000000) scale(0.100000,-0.100000)"
          fill={iconColor}
          stroke={iconColor}
          strokeWidth="80" 
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1270 2460 c-62 -18 -141 -70 -295 -194 -126 -101 -160 -131 -318 -286 -171 -166 -267 -283 -267 -325 0 -26 62 -45 144 -45 103 0 106 -4 106 -138 0 -120 21 -291 46 -385 63 -236 230 -415 457 -491 58 -19 67 -20 67 -3 0 7 -26 21 -59 31 -89 27 -178 83 -262 166 -147 147 -200 301 -220 645 -5 99 -12 181 -15 184 -7 7 -103 19 -159 20 -69 2 -83 12 -65 46 27 50 208 242 357 379 180 165 337 288 433 339 69 38 72 39 120 27 141 -34 446 -280 702 -567 55 -62 113 -130 129 -152 35 -47 33 -48 -82 -57 -67 -6 -83 -11 -94 -28 -9 -15 -14 -87 -18 -266 -4 -214 -7 -253 -26 -311 -52 -164 -186 -288 -370 -343 -78 -23 -207 -21 -283 5 -220 74 -378 314 -378 573 0 189 68 331 175 366 80 26 170 -46 210 -169 16 -49 23 -196 13 -271 -6 -47 17 -35 34 17 32 100 108 185 206 230 127 59 229 -10 201 -135 -30 -137 -171 -257 -335 -285 -43 -7 -64 -16 -64 -25 0 -31 169 12 250 63 147 93 224 277 158 375 -66 98 -242 64 -358 -67 -22 -25 -40 -50 -40 -54 0 -5 -4 -9 -9 -9 -4 0 -11 33 -13 73 -11 146 -79 257 -175 282 -132 34 -222 -53 -268 -259 -70 -313 118 -656 404 -740 175 -51 400 13 541 153 76 76 121 159 140 256 7 33 14 165 17 293 4 158 9 235 17 238 6 2 49 8 95 13 96 10 120 25 100 62 -63 120 -431 489 -639 641 -144 105 -246 147 -310 128z" />
        </g>
      </svg>
      <span 
        className={`font-bold tracking-tighter -ml-2 ${mainTextColor} ${textClassName}`}
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        Little<span style={{color: sparksColor}}>Sparks</span>
      </span>
    </div>
  );
};

// ==========================================
// 2) Main AdminSidebar Component
// ==========================================
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
    <aside className="w-[280px] h-screen bg-[#E4F7F7] flex flex-col fixed left-0 top-0 z-[1000] border-r border-cyan-100 shadow-sm transition-all duration-300">
      
      {/* BRAND SECTION */}
      <div className="p-6 border-b border-cyan-200/30 mb-2">
        <LittleSparksLogo variant="dark" iconClassName="w-10 h-10" textClassName="text-2xl" />
      </div>

      {/* NAVIGATION SECTION */}
      <nav className="flex-1 px-4 py-2 overflow-y-auto scrollbar-hide">
        <div className="space-y-1 mb-6">
          <SidebarLink to="/admin/dashboard" icon={<MdHome />} label="Home" />
          <SidebarLink to="/admin/admissions" icon={<MdAssignmentInd />} label="Admissions" />
        </div>

        <NavGroup title="School Management">
          <SidebarLink to="/admin/students" icon={<MdPeople />} label="Students" />
          <SidebarLink to="/admin/parents" icon={<MdPeople />} label="Parents" />
          <SidebarLink to="/admin/staff" icon={<MdManageAccounts />} label="Staff" />
        </NavGroup>

        <NavGroup title="Management">
          <SidebarLink to="/admin/schedules" icon={<MdCreditCard />} label="Schedules" />
          <SidebarLink to="/admin/learning" icon={<MdPayments />} label="Learning" />
          <SidebarLink to="/admin/paperwork" icon={<MdChat />} label="Paper-Work" />
        </NavGroup>

        <NavGroup title="Financials">
          <SidebarLink to="/admin/billing" icon={<MdCreditCard />} label="Billing" />
          <SidebarLink to="/admin/payrolls" icon={<MdPayments />} label="Payrolls" />
        </NavGroup>

        <NavGroup title="System">
          <SidebarLink to="/admin/users" icon={<MdSecurity />} label="Manage Users" />
          <SidebarLink to="/admin/logs" icon={<MdHistory />} label="Audit Logs" />
        </NavGroup>

        <NavGroup title="Communication">
          <SidebarLink to="/admin/messages" icon={<MdChat />} label="Messaging" />
        </NavGroup>
      </nav>

      {/* FOOTER SECTION */}
      <div className="p-4 border-t border-cyan-200/30 relative" ref={menuRef}>
        {open && (
          <div className="absolute bottom-[85px] left-4 right-4 bg-white rounded-2xl p-2 shadow-2xl border border-slate-100 z-[1001] animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button className="w-full flex items-center gap-3 p-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all" onClick={() => navigate("/admin/profile")}>
              <MdPerson className="text-xl text-slate-400" /> Profile
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all" onClick={onOpenSettings}>
              <MdSettings className="text-xl text-slate-400" /> Settings
            </button>
            <div className="h-[1px] bg-slate-100 my-1"></div>
            <button className="w-full flex items-center gap-3 p-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all" onClick={signOut}>
              <MdLogout className="text-xl" /> Sign out
            </button>
          </div>
        )}

        <div 
          className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${open ? 'bg-white shadow-md border-cyan-200' : 'hover:bg-white/50 border-transparent'}`} 
          onClick={() => setOpen(!open)}
        >
          <div className="relative shrink-0">
            <img 
              src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.firstName}&background=06B6D4&color=fff`} 
              alt="Profile" 
              className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm" 
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider">{user?.role || "Administrator"}</p>
          </div>

          <MdKeyboardArrowUp className={`text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </div>
      </div>
    </aside>
  );
}

// ==========================================
// Helper Components
// ==========================================

const SidebarLink = ({ to, icon, label }: { to: string, icon: any, label: string }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
        isActive 
          ? "bg-[#CFFAFE] text-[#0891B2] shadow-sm" 
          : "text-slate-500 hover:bg-white/60 hover:text-slate-700"
      }`
    }
  >
    <span className="text-xl">{icon}</span>
    <span>{label}</span>
  </NavLink>
);

const NavGroup = ({ title, children }: { title: string, children: any }) => (
  <div className="pt-4">
    <p className="px-4 text-[10px] font-black text-cyan-600/60 uppercase tracking-[0.15em] mb-2">{title}</p>
    <div className="space-y-1">{children}</div>
  </div>
);