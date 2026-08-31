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
import { useWebSocket } from '../../../hooks/useWebSocket';
import { Button } from '../../../components/common/Button';
import { Logo } from '../../../components/common/Logo';
import { apiClient } from '../../../services/axiosInstance';
import AlertBanner from '../../../components/shared/AlertBanner';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const reduxUser = useSelector(selectUser);
  const stompClient = useWebSocket('PARENT');
  const [childrenCount, setChildrenCount] = useState(0);
  const [children, setChildren] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dismissed_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });



  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${diffInDays}d ago`;
  };

  const markAsRead = async (id: string) => {
    console.log("DEBUG markAsRead called with id:", id);
    // Save to local storage immediately so it won't show up again
    setDismissedIds(prev => {
      const updated = [...prev.filter(dId => dId !== id), id].slice(-100);
      console.log("DEBUG updating local storage dismissed_notifications to:", updated);
      localStorage.setItem('dismissed_notifications', JSON.stringify(updated));
      return updated;
    });

    try {
      const url = `/api/v1/notifications/${id}/read?userId=${reduxUser.uid}`;
      console.log("DEBUG sending PUT request to url:", url);
      await apiClient.put(url);
      setNotifications(prev => prev.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const markAllRead = () => {
    notifications.forEach(n => {
      if (!n.isRead) markAsRead(n.id);
    });
  };

  const openNotif = (notif: any) => {
    setSelectedNotif(notif);
    if (!notif.isRead) markAsRead(notif.id);
    setShowNotifications(false);
  };

  useEffect(() => {
    // Get children data from real API
    const fetchChildren = async () => {
      try {
        const response = await apiClient.get('/api/v1/parent/profile');
        if (response.data.success) {
          const profile = response.data.data;
          setChildrenCount(profile.children.length);
          setChildren(profile.children.map((c: any) => ({
            id: c.childId,
            firstName: c.name ? c.name.split(' ')[0] : 'Child',
            profileImage: c.profilePic || ''
          })));
        }
      } catch (err) {
        console.error("Failed to fetch children info:", err);
      }
    };

    const fetchNotifications = async () => {
      if (!reduxUser?.uid) return;
      try {
        const res = await apiClient.get(`/api/v1/notifications/my-alerts/${reduxUser.uid}?role=PARENT&size=20`);
        if (res.data.success) {
          setNotifications(res.data.data.content || []);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    if (reduxUser?.email) {
      fetchChildren();
      fetchNotifications();
    }
  }, [reduxUser]);

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const sub1 = stompClient.subscribe('/topic/broadcasts', (message) => {
        const notif = JSON.parse(message.body);
        setNotifications((prev) => [notif, ...prev]);
      });
      const sub2 = stompClient.subscribe('/topic/parents', (message) => {
        const notif = JSON.parse(message.body);
        setNotifications((prev) => [notif, ...prev]);
      });
      return () => {
        sub1.unsubscribe();
        sub2.unsubscribe();
      };
    }
  }, [stompClient]);

  return (
    <div className="min-h-screen w-full bg-surface-secondary dark:bg-slate-950 transition-colors duration-300 font-sans text-slate-900 dark:text-slate-100 pb-10">

      {/* --- TOP HEADER --- */}
      <header className="max-w-7xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-1 bg-primary-500 rounded-full hidden sm:block"></div>
          <div>
            <div className="flex items-center gap-2 mb-0.5 text-primary-500">
              <Sparkles size={14} className="fill-primary-500" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">LittleSparks</p>
            </div>

            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-sans leading-none">
              Hello, {reduxUser?.displayName?.split(' ')[0] || 'Parent'} 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold mt-1 uppercase tracking-wider opacity-60">Overview & Activity</p>
          </div>
        </div>

        <div className="flex items-center gap-4 relative">
          <Button
            variant="secondary"
            onClick={() => setShowNotifications(!showNotifications)}
            className={`h-11 w-11 p-0 rounded-xl transition-all shadow-sm relative ${showNotifications ? 'ring-2 ring-primary-500/20 border-primary-500' : ''}`}
          >
            <Bell size={20} className={showNotifications ? 'text-primary-500' : 'text-slate-400 dark:text-slate-500 dark:text-slate-400'} />
            {notifications.some(n => !n.isRead) && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white animate-in zoom-in duration-300">
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </Button>

          {/* NOTIFICATION DROPDOWN */}
          {showNotifications && (
            <div className="absolute top-full right-0 mt-4 w-85 bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_20px_50px_rgba(10,6,55,0.15)] border border-slate-100 dark:border-slate-800/60 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              <div className="p-6 border-b border-slate-50 dark:border-slate-800/60 dark:border-slate-800/50 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40/50 dark:bg-slate-800/50">
                <h3 className="text-[10px] font-black text-midnight dark:text-white uppercase tracking-widest">Special Announcements</h3>
                <span className="text-[9px] font-black text-primary-500 bg-primary-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                  {notifications.filter(n => !n.isRead).length} New Updates
                </span>
              </div>
              <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((notif, idx) => (
                    <div
                      key={idx}
                      onClick={() => openNotif(notif)}
                      className={`p-6 border-b border-slate-50 dark:border-slate-800/60 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-800/40 dark:hover:bg-slate-800/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer relative group`}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <div className="flex items-center gap-2">
                          {!notif.isRead && <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>}
                          <h4 className="text-[11px] font-black text-midnight dark:text-white uppercase tracking-tight">
                            {notif.title || 'System Notification'}
                          </h4>
                        </div>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 font-bold">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 font-medium">
                        {notif.body}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-slate-400 dark:text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">
                    No Notifications
                  </div>
                )}
              </div>
              <div className="p-5 bg-slate-50 dark:bg-slate-800/40/80 dark:bg-slate-800/80 text-center border-t border-slate-100 dark:border-slate-800/60 dark:border-slate-800">
                <button
                  onClick={markAllRead}
                  className="text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-primary-500 transition-colors"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => navigate('/parent/profile')}
            className="h-11 w-11 p-0 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 active:scale-95 transition-all overflow-hidden border-2 border-white dark:border-slate-800"
          >
            {reduxUser?.photoURL && reduxUser.photoURL !== "null" && reduxUser.photoURL.trim() !== "" ? (
              <img src={reduxUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white font-black text-lg">
                {reduxUser?.displayName ? reduxUser.displayName.charAt(0).toUpperCase() : 'P'}
              </div>
            )}
          </button>
        </div>
      </header>

      {/* --- ALERT BANNER FOR BROADCASTS & HIGH PRIORITY --- */}
      <AlertBanner
        notifications={notifications.filter(n => (n.type === 'BROADCAST' || n.priority === 'HIGH') && !n.isRead && !dismissedIds.includes(n.id))}
        onRead={markAsRead}
      />

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
            onClick={() => navigate('/parent/messages')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* --- LEFT COL: MAIN ACTIONS --- */}
          <div className="lg:col-span-2 space-y-8">

            {/* FEATURED CARD */}
            <div className="relative group overflow-hidden bg-midnight rounded-[3rem] p-10 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>

              <div className="relative z-10 flex-1">

                <h2 className="text-4xl font-black tracking-tight mb-4 leading-tight italic">
                  Track Weekly<br />Progress.
                </h2>
                <p className="text-slate-400 dark:text-slate-500 dark:text-slate-400 text-sm max-w-md mb-8 leading-relaxed">
                  Stay updated with your child's academic performance, behavioral tracking, and growth milestones.
                </p>
                <Button
                  onClick={() => navigate('/parent/progress')}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-6 rounded-2xl group/btn transition-all"
                >
                  <span className="text-xs font-black  uppercase tracking-widest">View Progress</span>
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
                  <div className="absolute -bottom-4 -right-4 bg-white dark:bg-[#0f172a] p-3 rounded-2xl shadow-2xl z-[100]">
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
            <div className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800/60 dark:border-slate-800/60 shadow-sm relative overflow-hidden">
              {/* Optional subtle glow for the activity card */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="relative z-10 flex items-center justify-between mb-8">
                <h3 className="text-[11px] font-black text-midnight dark:text-white uppercase tracking-[0.3em]">Recent Activity</h3>
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

              <div className="relative z-10 mt-10 pt-8 border-t border-slate-50 dark:border-slate-800/60 dark:border-slate-800/50">
                <div className="p-6 bg-slate-50 dark:bg-slate-800/40 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-800/60 dark:border-slate-700/50">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp size={18} className="text-primary-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 dark:text-slate-400">Security Note</span>
                  </div>
                  <p className="text-[11px] font-bold text-midnight dark:text-slate-300 leading-relaxed">
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
          <div className="bg-white dark:bg-[#0f172a] w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border border-slate-100 dark:border-slate-800/60 dark:border-slate-800/60">
            {/* GRADUATION THEME HEADER */}
            {selectedNotif.type === 'graduation' ? (
              <div className="relative h-56 flex flex-col items-center justify-center bg-gradient-to-br from-primary-500 via-primary-600 to-midnight overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 dark:bg-[#0f172a]/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>

                <div className="relative z-10 bg-white dark:bg-[#0f172a] p-4 rounded-3xl shadow-2xl mb-4 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                  <Logo variant="dark" iconClassName="w-10 h-10" textClassName="hidden" />
                </div>
                <h2 className="relative z-10 text-white font-black text-xs uppercase tracking-[0.4em] mb-2 opacity-80">LittleSparks</h2>
                <div className="relative z-10 px-6 py-1 bg-white/20 dark:bg-[#0f172a]/20 backdrop-blur-md rounded-full border border-white/20">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Big School Transition</span>
                </div>
              </div>
            ) : (
              <div className="relative h-48 flex items-center justify-center bg-gradient-to-br from-hero-blue via-hero-purple to-hero-pink">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #06C5D4 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <div className="relative z-10 h-20 w-20 bg-white/20 dark:bg-[#0f172a]/20 backdrop-blur-md rounded-3xl border border-white/20 flex items-center justify-center shadow-2xl">
                  <Bell className="text-white" size={32} />
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedNotif(null)}
              className="absolute top-6 right-6 p-2 bg-white/20 dark:bg-[#0f172a]/20 hover:bg-white/30 rounded-full transition-colors border border-white/20 text-white z-[110]"
            >
              <ArrowRight className="rotate-180" size={20} />
            </button>

            <div className="p-10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em]">
                  {selectedNotif.type === 'graduation' ? '🌟 Milestone' : `${selectedNotif.type} announcement`}
                </span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase">
                  {new Date(selectedNotif.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-2xl font-black text-midnight dark:text-white tracking-tight leading-tight italic">
                {selectedNotif.title}
              </h3>

              <div className={`p-6 rounded-[2rem] border ${selectedNotif.type === 'graduation' ? 'bg-primary-50/50 border-primary-100' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/60'}`}>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium italic">
                  "{selectedNotif.body}"
                </p>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  onClick={() => {
                    markAsRead(selectedNotif.id);
                    setSelectedNotif(null);
                  }}
                  className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-primary-500/20"
                >
                  {selectedNotif.type === 'graduation' ? 'Yay! So proud! 💖' : 'Got it, thanks!'}
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
    className="bg-white dark:bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/60 dark:border-slate-800/60 shadow-sm hover:shadow-xl hover:border-primary-200 dark:hover:border-primary-500/50 transition-all cursor-pointer group relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-2xl -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150"></div>
    <div className={`relative z-10 h-14 w-14 ${iconBg} dark:bg-slate-800/80 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <p className="relative z-10 text-[9px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] mb-1">{label}</p>
    <p className="relative z-10 text-3xl font-black text-midnight dark:text-white tracking-tight">{value}</p>
  </div>
);

const QuickLink = ({ title, desc, icon, bg }: any) => (
  <div className="bg-white dark:bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/60 dark:border-slate-800/60 shadow-sm hover:shadow-lg transition-all cursor-pointer flex items-center gap-6 group relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/0 dark:group-hover:bg-slate-800/30 transition-colors"></div>
    <div className={`relative z-10 h-16 w-16 ${bg} dark:bg-slate-800/80 rounded-3xl flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div className="relative z-10">
      <h4 className="font-black text-midnight dark:text-white text-lg tracking-tight mb-1">{title}</h4>
      <p className="text-[11px] text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 font-medium leading-tight">{desc}</p>
    </div>
    <ChevronRight size={16} className="relative z-10 ml-auto text-slate-300 dark:text-slate-600 dark:text-slate-300 group-hover:text-primary-500 transition-colors" />
  </div>
);

const ActivityItem = ({ icon, title, time, desc }: any) => (
  <div className="flex gap-4 group p-2 hover:bg-slate-50 dark:bg-slate-800/40 dark:hover:bg-slate-800/50 dark:hover:bg-slate-800/30 rounded-2xl transition-colors cursor-default">
    <div className="h-10 w-10 bg-slate-50 dark:bg-slate-800/40 dark:bg-slate-800/80 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800/60 dark:border-slate-700/50 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors shadow-sm">
      {icon}
    </div>
    <div className="space-y-0.5 flex-1 mt-1">
      <div className="flex items-center justify-between">
        <h4 className="text-[11px] font-black text-midnight dark:text-white uppercase tracking-tight">{title}</h4>
        <span className="text-[9px] text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 font-bold">{time}</span>
      </div>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 dark:text-slate-400 dark:text-slate-500 dark:text-slate-400 font-medium leading-tight">{desc}</p>
    </div>
  </div>
);

export default ParentDashboard;