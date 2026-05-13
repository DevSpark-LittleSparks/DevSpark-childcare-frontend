import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { 
  LayoutGrid, 
  ClipboardList, 
  Users, 
  UserCog, 
  CalendarDays, 
  MonitorPlay, 
  Utensils, 
  ShieldCheck, 
  History,
  ChevronUp,
  MenuSquare
} from 'lucide-react';
import { useAppSelector } from '../../store/hooks';

export default function Sidebar() {
  const location = useLocation();

  const menuSections = [
    {
      items: [
        { name: 'Home', path: '/home', icon: LayoutGrid },
        { name: 'Admissions', path: '/admissions', icon: ClipboardList },
      ]
    },
    {
      title: 'SCHOOL MANAGEMENT',
      items: [
        { name: 'Students', path: '/students', icon: Users },
        { name: 'Parents', path: '/parents', icon: Users },
        { name: 'Staff', path: '/staff', icon: UserCog },
      ]
    },
    {
      title: 'MANAGEMENT',
      items: [
        { name: 'Schedules', path: '/schedules', icon: CalendarDays },
        { name: 'Learning', path: '/learning', icon: MonitorPlay },
        { name: 'Meals', path: '/meals', icon: Utensils },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { name: 'Manage Users', path: '/users', icon: ShieldCheck },
        { name: 'Audit Logs', path: '/audit', icon: History },
      ]
    }
  ];

  return (
    <div className="w-64 bg-[#eef8f9] text-[#5d7285] flex flex-col h-screen border-r border-[#d4eaea]">
      {/* Logo Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Mock Logo Icon */}
          <div className="w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="#2c3e50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <path d="M9 22V12h6v10" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#2c3e50]">
            Little<span className="text-[#00a8cc]">Sparks</span>
          </span>
        </div>
        <button className="text-[#5d7285] hover:text-[#2c3e50]">
          <MenuSquare className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-6 custom-scrollbar">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {section.title && (
              <h3 className="px-4 text-[11px] font-extrabold tracking-wider text-[#69b6ca] mb-3 mt-4">
                {section.title}
              </h3>
            )}
            {section.items.map((item) => {
              // Note: using /parents as the active one to match the screenshot
              const isActive = location.pathname.startsWith(item.path) || (item.name === 'Parents' && location.pathname === '/messages');
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all font-semibold text-[15px]',
                    isActive 
                      ? 'bg-[#d8f6f8] text-[#00a8cc]' 
                      : 'hover:bg-[#e0f0f2] hover:text-[#2c3e50]'
                  )}
                >
                  <Icon className="w-[22px] h-[22px]" strokeWidth={2.5} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 mt-auto">
        <div className="flex items-center justify-between px-2 cursor-pointer hover:bg-[#e0f0f2] p-2 rounded-xl transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00a8cc] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              AD
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[#2c3e50] text-[15px]">Admin</span>
              <span className="text-[10px] font-extrabold text-[#00a8cc] tracking-wider">ADMINISTRATOR</span>
            </div>
          </div>
          <ChevronUp className="w-4 h-4 text-[#8ba6b6]" />
        </div>
      </div>
    </div>
  );
}
