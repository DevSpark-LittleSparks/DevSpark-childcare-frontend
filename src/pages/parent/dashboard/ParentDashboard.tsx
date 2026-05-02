import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../features/auth/model/authSlice';
import {
  Baby,
  CreditCard,
  MessageSquare,
  Calendar,
  Bell,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Clock,
  ChevronRight,
  TrendingUp,
  User
} from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Logo } from '../../../components/common/Logo';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const reduxUser = useSelector(selectUser);
  const [childrenCount, setChildrenCount] = useState(0);
  const [children, setChildren] = useState<any[]>([]);
  const [firstChildImage, setFirstChildImage] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<any>(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Special Announcement', desc: 'Tomorrow is a holiday due to the public event. All classes are suspended for the day. Please keep your children safe and enjoy the break.', time: '10m ago', type: 'info', unread: true, fullMsg: 'Dear Parents, please be informed that the childcare center will remain closed tomorrow due to the scheduled public celebrations and security arrangements. We will resume normal operations from the day after. Thank you for your cooperation.' },
    { id: 2, title: 'System Update', desc: 'New progress tracking features have been enabled for all parents. You can now view detailed reports.', time: '2h ago', type: 'success', unread: true, fullMsg: 'We have updated our system with new developmental milestone tracking. You can now see weekly summaries of your child\'s learning activities and behavioral growth directly from your dashboard. Check the Progress section for more details.' },
    { id: 3, title: 'Fee Reminder', desc: 'Monthly fee for May is now available. Please settle by the end of the week.', time: '1d ago', type: 'warning', unread: false, fullMsg: 'The invoice for the month of May has been generated and is ready for payment. You can view the details in the Payments section. A late fee may apply if not settled by May 15th.' },
  ]);

  const markAsRead = (id: number) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, unread: false } : n);
      const sysNotifs = JSON.parse(localStorage.getItem('system_notifications') || '[]');
      const updatedSys = sysNotifs.map((n: any) => n.id === id ? { ...n, unread: false } : n);
      localStorage.setItem('system_notifications', JSON.stringify(updatedSys));
      return updated;
    });
  };

  const markAllRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, unread: false }));
      const sysNotifs = JSON.parse(localStorage.getItem('system_notifications') || '[]');
      const updatedSys = sysNotifs.map((n: any) => ({ ...n, unread: false }));
      localStorage.setItem('system_notifications', JSON.stringify(updatedSys));
      return updated;
    });
  };

  const openNotif = (notif: any) => {
    setSelectedNotif(notif);
    markAsRead(notif.id);
    setShowNotifications(false);
  };

  useEffect(() => {
    // Get children count from admissionsData
    const admissionsData = JSON.parse(localStorage.getItem('admissionsData') || '[]');
    if (reduxUser?.email) {
      const parentChildren = admissionsData.filter((c: any) => c.parentEmail === reduxUser.email);
      setChildrenCount(parentChildren.length);
      setChildren(parentChildren);
      if (parentChildren.length > 0) {
        setFirstChildImage(parentChildren[0].profileImage || '');
      }
    }

    // Load dynamic announcements from Admin
    const sysNotifs = JSON.parse(localStorage.getItem('system_notifications') || '[]');
    if (sysNotifs.length > 0) {
      setNotifications(prev => {
        const existingIds = prev.map(n => n.id);
        const newOnes = sysNotifs.filter((n: any) => !existingIds.includes(n.id));
        return [...newOnes, ...prev];
      });
    }
  }, [reduxUser]);

  return (
    <div className="min-h-screen w-full bg-surface-secondary font-sans text-slate-900 pb-10">

      {/* --- TOP HEADER --- */}
      <header className="max-w-7xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-1 bg-primary-500 rounded-full hidden sm:block"></div>
          <div>
            <div className="flex items-center gap-2 mb-0.5 text-primary-500">
              <Sparkles size={14} className="fill-primary-500" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">LittleSparks Family Portal</p>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight font-sans leading-none">
              Hello, {reduxUser?.displayName?.split(' ')[0] || 'Parent'} 👋
            </h1>
            <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-wider opacity-60">Overview & Activity</p>
          </div>
        </div>

        <div className="flex items-center gap-4 relative">
          <Button
            variant="secondary"
            onClick={() => setShowNotifications(!showNotifications)}
            className={`h-11 w-11 p-0 rounded-xl transition-all shadow-sm relative ${showNotifications ? 'ring-2 ring-primary-500/20 border-primary-500' : ''}`}
          >
            <Bell size={20} className={showNotifications ? 'text-primary-500' : 'text-slate-400'} />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </Button>

          {/* NOTIFICATION DROPDOWN */}
          {showNotifications && (
            <div className="absolute top-full right-0 mt-4 w-85 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(10,6,55,0.15)] border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-[10px] font-black text-midnight uppercase tracking-widest">Special Announcements</h3>
                <span className="text-[9px] font-black text-primary-500 bg-primary-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                  {notifications.filter(n => n.unread).length} New Updates
                </span>
              </div>
              <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => openNotif(notif)}
                      className={`p-6 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer relative group`}
                    >
                      {notif.unread && <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary-500 rounded-full"></div>}
                      <div className="flex justify-between items-start mb-1.5">
                        <h4 className="text-[11px] font-black text-midnight uppercase tracking-tight">{notif.title}</h4>
                        <span className="text-[9px] text-slate-400 font-bold">{notif.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 font-medium">{notif.desc}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                    No Notifications
                  </div>
                )}
              </div>
              <div className="p-5 bg-slate-50/80 text-center border-t border-slate-100">
                <button
                  onClick={markAllRead}
                  className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-500 transition-colors"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}

          <Button
            onClick={() => navigate('/parent/profile')}
            variant="primary"
            className="h-11 w-11 p-0 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 active:scale-95"
          >
            <User size={20} />
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-6 space-y-8 animate-fadeUp">

        {/* --- QUICK STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardStat
            icon={<Baby className="text-primary-500" size={24} />}
            label="ENROLLED CHILDREN"
            value={childrenCount.toString()}
            iconBg="bg-primary-50"
            onClick={() => navigate('/parent/children')}
          />
          <DashboardStat
            icon={<CreditCard className="text-emerald-500" size={24} />}
            label="OUTSTANDING FEES"
            value="Rs. 0.00"
            iconBg="bg-emerald-50"
            onClick={() => navigate('/parent/payments')}
          />
          <DashboardStat
            icon={<MessageSquare className="text-blue-500" size={24} />}
            label="UNREAD MESSAGES"
            value="2"
            iconBg="bg-blue-50"
            onClick={() => navigate('/parent/messaging')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* --- LEFT COL: MAIN ACTIONS --- */}
          <div className="lg:col-span-2 space-y-8">

            {/* FEATURED CARD */}
            <div className="relative group overflow-hidden bg-midnight rounded-[3rem] p-10 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>

              <div className="relative z-10 flex-1">
                <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest mb-6">
                  Featured Service
                </div>
                <h2 className="text-4xl font-black tracking-tight mb-4 leading-tight italic">
                  Track Weekly<br />Progress.
                </h2>
                <p className="text-slate-400 text-sm max-w-md mb-8 leading-relaxed">
                  Stay updated with your child's academic performance, behavioral tracking, and growth milestones.
                </p>
                <Button
                  onClick={() => navigate('/parent/progress')}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-6 rounded-2xl group/btn transition-all"
                >
                  <span className="text-xs font-black uppercase tracking-widest">View Progress</span>
                  <ArrowRight size={18} className="ml-3 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* RIGHT SIDE: MULTIPLE CHILD IMAGES & LOGO */}
              <div className="relative z-10 shrink-0 hidden md:block">
                <div className="flex -space-x-12 hover:space-x-2 transition-all duration-500">
                  {children.length > 0 ? (
                    children.map((child, index) => (
                      <div key={child.id} className="relative h-48 w-48 lg:h-56 lg:w-56" style={{ zIndex: 10 + (children.length - index) }}>
                        <div className="absolute inset-0 bg-primary-500/20 rounded-[3rem] blur-2xl group-hover:bg-primary-500/40 transition-all"></div>
                        <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border-[6px] border-white/10 shadow-2xl bg-midnight/20">
                          <img
                            src={child.profileImage || "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80"}
                            alt={child.firstName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="relative h-48 w-48 lg:h-56 lg:w-56">
                      <div className="absolute inset-0 bg-primary-500/20 rounded-[3rem] blur-2xl group-hover:bg-primary-500/40 transition-all"></div>
                      <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border-[6px] border-white/10 shadow-2xl">
                        <img
                          src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80"
                          alt="Default Child"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                    </div>
                  )}
                  {/* LOGO OVERLAY - Only show one logo for the whole stack */}
                  <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-2xl shadow-2xl z-[100]">
                    <Logo variant="dark" iconClassName="w-6 h-6" textClassName="text-[10px]" />
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK LINKS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <QuickLink
                title="Academic Calendar"
                desc="Check upcoming holidays and events"
                icon={<Calendar className="text-rose-500" />}
                bg="bg-rose-50"
              />
              <QuickLink
                title="Daily Meal Plan"
                desc="Nutritional tracking for this week"
                icon={<Clock className="text-amber-500" />}
                bg="bg-amber-50"
              />
            </div>
          </div>

          {/* --- RIGHT COL: RECENT ACTIVITIES --- */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[11px] font-black text-midnight uppercase tracking-[0.3em]">Recent Activity</h3>
                <button className="text-[9px] font-black text-primary-500 uppercase hover:underline">View All</button>
              </div>

              <div className="space-y-6">
                <ActivityItem
                  icon={<ShieldCheck size={16} className="text-emerald-500" />}
                  title="Attendance Marked"
                  time="2 hours ago"
                  desc="Shemil arrived at 8:15 AM"
                />
                <ActivityItem
                  icon={<Clock size={16} className="text-blue-500" />}
                  title="Meal Finished"
                  time="4 hours ago"
                  desc="Lunch (Rice & Curry) completed"
                />
                <ActivityItem
                  icon={<Bell size={16} className="text-amber-500" />}
                  title="New Announcement"
                  time="Yesterday"
                  desc="Sports day scheduled for next week"
                />
              </div>

              <div className="mt-10 pt-8 border-t border-slate-50">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp size={18} className="text-primary-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Security Note</span>
                  </div>
                  <p className="text-[11px] font-bold text-midnight leading-relaxed">
                    Always use your unique security key for administrative requests.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* --- NOTIFICATION MODAL --- */}
      {selectedNotif && (
        <div className="fixed inset-0 bg-midnight/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
            <div className="relative h-48 flex items-center justify-center bg-gradient-to-br from-hero-blue via-hero-purple to-hero-pink">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #06C5D4 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
              <div className="relative z-10 h-20 w-20 bg-white/20 backdrop-blur-md rounded-3xl border border-white/20 flex items-center justify-center shadow-2xl">
                <Bell className="text-white" size={32} />
              </div>
              <button
                onClick={() => setSelectedNotif(null)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors border border-white/20 text-white"
              >
                <ArrowRight className="rotate-180" size={20} />
              </button>
            </div>
            <div className="p-10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em]">{selectedNotif.type} announcement</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{selectedNotif.time}</span>
              </div>
              <h3 className="text-2xl font-black text-midnight tracking-tight leading-tight italic">
                {selectedNotif.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {selectedNotif.fullMsg}
              </p>
              <div className="pt-6">
                <Button
                  variant="primary"
                  onClick={() => setSelectedNotif(null)}
                  className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-primary-500/20"
                >
                  Got it, thanks!
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardStat = ({ icon, label, value, iconBg, onClick }: any) => (
  <div
    onClick={onClick}
    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all cursor-pointer group"
  >
    <div className={`h-14 w-14 ${iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">{label}</p>
    <p className="text-3xl font-black text-midnight tracking-tight">{value}</p>
  </div>
);

const QuickLink = ({ title, desc, icon, bg }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all cursor-pointer flex items-center gap-6 group">
    <div className={`h-16 w-16 ${bg} rounded-3xl flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <h4 className="font-black text-midnight text-lg tracking-tight mb-1">{title}</h4>
      <p className="text-[11px] text-slate-400 font-medium leading-tight">{desc}</p>
    </div>
    <ChevronRight size={16} className="ml-auto text-slate-300 group-hover:text-primary-500 transition-colors" />
  </div>
);

const ActivityItem = ({ icon, title, time, desc }: any) => (
  <div className="flex gap-4 group">
    <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-white transition-colors">
      {icon}
    </div>
    <div className="space-y-0.5">
      <div className="flex items-center gap-2">
        <h4 className="text-[11px] font-black text-midnight uppercase tracking-tight">{title}</h4>
        <span className="text-[9px] text-slate-300 font-bold">{time}</span>
      </div>
      <p className="text-[11px] text-slate-500 font-medium leading-tight">{desc}</p>
    </div>
  </div>
);

export default ParentDashboard;