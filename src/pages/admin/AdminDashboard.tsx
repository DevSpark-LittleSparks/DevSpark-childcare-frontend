import React, { useState, useEffect } from 'react';
import {
  Users, Briefcase, MessageSquare, TrendingUp,
  Search, Bell, Check, X, Calendar, MessageCircle, Sparkles, ShieldCheck, User, Megaphone, Mail, FileText, Clock,
  ShieldAlert, Activity, UserCheck, Fingerprint, Gift
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Logo } from '../../components/common/Logo';
import { BirthdayCardModal } from '../../components/common/BirthdayCardModal';
import { apiClient } from '../../services/axiosInstance';
import { useAppSelector } from '../../store';
import { useWebSocket } from '../../hooks/useWebSocket';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#06c5d4', '#6366f1', '#f43f5e', '#f59e0b'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);
  const [totalParents, setTotalParents] = useState(0);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [announcement, setAnnouncement] = useState({ title: '', desc: '' });
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [showAdminNotifs, setShowAdminNotifs] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState<any>(null);
  const [selectedBirthdayChild, setSelectedBirthdayChild] = useState<any>(null);
  const [trendData, setTrendData] = useState<any[]>([
    { name: 'Jan', registrations: 12 },
    { name: 'Feb', registrations: 19 },
    { name: 'Mar', registrations: 15 },
    { name: 'Apr', registrations: 28 },
    { name: 'May', registrations: 22 },
    { name: 'Jun', registrations: 35 },
    { name: 'Jul', registrations: 42 },
    { name: 'Aug', registrations: 35 }
  ]);
  const reduxUser = useAppSelector((state) => state.auth.user);
  const stompClient = useWebSocket('ADMIN');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateAge = (dob: string) => {
    if (!dob) return '';
    const diffMs = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(diffMs);
    const years = Math.abs(ageDate.getUTCFullYear() - 1970);
    return years === 0 ? 'Less than a year' : `${years} ${years === 1 ? 'year' : 'years'} old`;
  };

  const loadData = async () => {
    try {
      // Fetch summary stats
      const statsRes = await apiClient.get('/api/v1/auth/admin/stats');
      const stats = statsRes.data.data;
      setTotalStudents(stats.totalStudents || 0);
      setTotalStaff(stats.totalStaff || 0);
      setTotalParents(stats.totalParents || 0);

      // Update trend data for September with real-time registrations
      const currentRealUsers = (stats.totalStudents || 0) + (stats.totalStaff || 0) + (stats.totalParents || 0);
      setTrendData([
        { name: 'Jan', registrations: 12 },
        { name: 'Feb', registrations: 19 },
        { name: 'Mar', registrations: 15 },
        { name: 'Apr', registrations: 28 },
        { name: 'May', registrations: 22 },
        { name: 'Jun', registrations: 35 },
        { name: 'Jul', registrations: 42 },
        { name: 'Aug', registrations: 35 },
        { name: 'Sep', registrations: currentRealUsers }
      ]);

      // Fetch real pending requests from all 3 roles
      const [teachers, parents, directors] = await Promise.all([
        apiClient.get('/api/v1/auth/admin/pending-teachers'),
        apiClient.get('/api/v1/auth/admin/pending-parents'),
        apiClient.get('/api/v1/auth/admin/pending-directors')
      ]);

      const allPending = [
        ...(teachers.data.data || []),
        ...(parents.data.data || []),
        ...(directors.data.data || [])
      ].sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

      setPendingRequests(allPending);

      // Fetch upcoming birthdays
      try {
        const bdayRes = await apiClient.get('/api/v1/child/upcoming-birthdays');
        if (bdayRes.data.success) {
          setUpcomingBirthdays(bdayRes.data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch birthdays:", err);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    }
  };

  const fetchNotifications = async () => {
    if (!reduxUser?.uid) return;
    try {
      const res = await apiClient.get(`/api/v1/notifications/my-alerts/${reduxUser.uid}?role=ADMIN&size=20`);
      if (res.data.success) {
        setNotifications(res.data.data.content || []);
      }
    } catch (err) {
      console.error("Failed to fetch admin notifications:", err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await apiClient.put(`/api/v1/notifications/${id}/read?userId=${reduxUser.uid}`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };



  const handleApprove = async (request: any) => {
    try {
      // Handle signup approval
      let endpoint = '';
      if (request.role === 'TEACHER') endpoint = `/api/v1/auth/admin/approve-teacher/${request.requestId}`;
      else if (request.role === 'PARENT') endpoint = `/api/v1/auth/admin/approve-parent/${request.requestId}`;
      else if (request.role === 'DIRECTOR') endpoint = `/api/v1/auth/admin/approve-director/${request.requestId}`;

      await apiClient.post(endpoint);
      alert(`${request.role} request approved! OTP has been sent to ${request.email}`);
      setSelectedRequest(null);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Approval failed.");
    }
  };

  const handleReject = async (request: any) => {
    const reason = prompt("Enter reason for rejection:", "Your application was not approved.");
    if (reason === null) return;

    try {
      let endpoint = '';
      if (request.role === 'TEACHER') endpoint = `/api/v1/auth/admin/reject-teacher/${request.requestId}`;
      else if (request.role === 'PARENT') endpoint = `/api/v1/auth/admin/reject-parent/${request.requestId}`;
      else if (request.role === 'DIRECTOR') endpoint = `/api/v1/auth/admin/reject-director/${request.requestId}`;

      // Handle signup rejection
      await apiClient.post(`${endpoint}?reason=${encodeURIComponent(reason)}`);
      alert("Request rejected and applicant notified.");
      setSelectedRequest(null);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Rejection failed.");
    }
  };

  useEffect(() => {
    loadData();
    fetchNotifications();
    const interval = setInterval(() => {
      if (reduxUser?.uid) {
        loadData();
        fetchNotifications();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [reduxUser]);

  useEffect(() => {
    if (stompClient && stompClient.connected) {
      const sub = stompClient.subscribe('/topic/broadcasts', (message) => {
        const notif = JSON.parse(message.body);
        setNotifications((prev) => [notif, ...prev]);
      });
      return () => sub.unsubscribe();
    }
  }, [stompClient]);


  return (
    <div className="min-h-screen w-full bg-surface-secondary dark:bg-slate-950 transition-colors duration-300 font-sans text-slate-900 dark:text-slate-100 pb-10">
      {/* --- Top Header Section --- */}
      <header className="max-w-7xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight truncate">
              Welcome back, {reduxUser?.displayName?.split(' ')[0] || 'Admin'}!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold mt-1 uppercase tracking-wider opacity-60">Admin Console</p>
          </div>
        </div>

        <div className="flex items-center gap-4">

          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white font-mono opacity-80">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowAdminNotifs(!showAdminNotifs)}
              className={`h-11 w-11 p-0 rounded-xl transition-all shadow-sm relative border-2 ${showAdminNotifs ? 'border-primary-500 bg-primary-50/50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
            >
              <Bell size={20} className={showAdminNotifs ? 'text-primary-500' : 'text-slate-500'} />
              {pendingRequests.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-4 ring-white animate-in zoom-in duration-300 shadow-sm">
                  {pendingRequests.length}
                </span>
              )}
            </Button>

            {/* ADMIN NOTIFICATION DROPDOWN */}
            {showAdminNotifs && (
              <div className="absolute top-full right-0 mt-4 w-96 bg-white dark:bg-[#0f172a] rounded-[2rem] shadow-[0_20px_50px_rgba(10,6,55,0.15)] border border-slate-100 dark:border-slate-800/60 dark:border-slate-800/60 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="p-6 border-b border-slate-50 dark:border-slate-800/60 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40/50">
                  <h3 className="text-[10px] font-black text-midnight dark:text-white uppercase tracking-widest">Master Alerts</h3>
                  <div className="flex gap-2">
                    {pendingRequests.length > 0 && (
                      <span className="text-[9px] font-black text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-3 py-1 rounded-full uppercase">
                        {pendingRequests.length} Signup
                      </span>
                    )}
                    {notifications.filter(n => !n.isRead).length > 0 && (
                      <span className="text-[9px] font-black text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full uppercase">
                        {notifications.filter(n => !n.isRead).length} Inbox
                      </span>
                    )}
                  </div>
                </div>
                <div className="max-h-[450px] overflow-y-auto no-scrollbar">
                  {/* Signup Requests */}
                  {pendingRequests.map((req) => (
                    <div
                      key={req.requestId}
                      onClick={() => { setSelectedRequest(req); setShowAdminNotifs(false); }}
                      className="p-5 border-b border-slate-50 dark:border-slate-800/60 hover:bg-slate-50 dark:bg-slate-800/40 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group bg-rose-50/20 dark:bg-rose-500/5"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                        <h4 className="text-[11px] font-black text-midnight dark:text-white uppercase tracking-tight">Pending {req.role} Signup</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                        <span className="font-bold text-midnight dark:text-white">{req.fullName}</span> is waiting for approval.
                      </p>
                    </div>
                  ))}

                  {/* Admin Notifications / Requests */}
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => !notif.isRead && markAsRead(notif.id)}
                      className={`p-5 border-b border-slate-50 dark:border-slate-800/60 hover:bg-slate-50 dark:bg-slate-800/40 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group ${!notif.isRead ? 'bg-amber-50/10 dark:bg-amber-500/5' : 'opacity-60'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`h-2 w-2 rounded-full ${notif.type === 'ADMIN_REQUEST' ? 'bg-primary-500' : 'bg-slate-400'}`}></div>
                          <h4 className="text-[11px] font-black text-midnight dark:text-white uppercase tracking-tight">{notif.title}</h4>
                        </div>
                        <span className="text-[8px] font-bold text-slate-400">{new Date(notif.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{notif.body}</p>
                      {!notif.isRead && (
                        <button className="mt-3 text-[9px] font-black text-primary-500 uppercase tracking-widest hover:underline">
                          Mark as Resolved
                        </button>
                      )}
                    </div>
                  ))}

                  {pendingRequests.length === 0 && notifications.length === 0 && (
                    <div className="p-10 text-center text-slate-300 font-bold text-[10px] uppercase tracking-[0.2em]">
                      All systems normal
                    </div>
                  )}
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40/80 text-center border-t border-slate-100">
                  <button className="text-[10px] font-black text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-primary-500 transition-colors">
                    Security Logs System
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/admin/profile')}
            className="h-11 w-11 p-0 rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-all overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-white"
          >
            {reduxUser?.photoURL && reduxUser.photoURL !== "null" && reduxUser.photoURL.trim() !== "" ? (
              <img src={reduxUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-black text-lg">
                {reduxUser?.displayName ? reduxUser.displayName.charAt(0).toUpperCase() : 'A'}
              </div>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-6 space-y-8 animate-fadeUp">

        {/* --- Top Row Widgets --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Upcoming Birthdays Section */}
          <div className="bg-gradient-to-br from-blue-100/80 via-purple-50/60 to-pink-100/80 dark:from-blue-900/40 dark:via-purple-900/20 dark:to-pink-900/40 rounded-[2.5rem] p-8 border-2 border-white dark:border-slate-800/60 shadow-[0_10px_40px_rgba(0,0,0,0.06)] flex flex-col h-full relative overflow-hidden">
            
            {/* Decorative background blur */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-pink-300/40 dark:bg-pink-600/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-300/40 dark:bg-blue-600/20 rounded-full blur-3xl" />

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/50 dark:border-slate-800/60 relative z-10">
              <div className="h-14 w-14 shrink-0 rounded-full border-4 border-white/80 dark:border-slate-800/80 flex items-center justify-center bg-white/50 backdrop-blur-sm shadow-sm relative overflow-hidden group">
                <div className="animate-[spin_4s_linear_infinite] flex items-center justify-center scale-75">
                  <Logo variant="color" onlyIcon={true} iconClassName="w-8 h-8" />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-0.5">Today is</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                  {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6 relative z-10">
              <Gift className="text-primary-500 animate-[pulse_2s_ease-in-out_infinite]" size={24} />
              <h4 className="font-black text-lg text-slate-900 dark:text-white tracking-tight">Upcoming birthdays</h4>
            </div>

            <div className="space-y-1 flex-1 overflow-y-auto no-scrollbar max-h-[220px] relative z-10">
              {upcomingBirthdays.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <div className="w-12 h-12 bg-white/50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-3 border border-white dark:border-slate-800">
                     <Gift size={20} className="text-slate-300 dark:text-slate-600" />
                  </div>
                  <p className="text-sm text-slate-400 font-medium">No birthdays this month.</p>
                </div>
              ) : upcomingBirthdays.map((child: any, index: number) => {
                const isFemale = child.gender?.toLowerCase() === 'female';
                const ringColor = isFemale ? 'border-rose-200 dark:border-rose-800' : 'border-blue-200 dark:border-blue-800';
                const textColor = isFemale ? 'text-rose-500' : 'text-blue-500';
                
                return (
                  <div 
                    key={child.childId} 
                    className={`flex items-center justify-between p-3 rounded-2xl animate-fadeUp`}
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={child.profilePic || 'https://via.placeholder.com/150'} alt={child.firstName} className={`w-11 h-11 rounded-full object-cover shadow-sm relative z-10 border-2 ${ringColor}`} />
                      </div>
                      <div>
                        <h5 className="font-black text-slate-900 dark:text-white text-sm mb-0.5 tracking-tight">{child.firstName} {child.lastName}</h5>
                        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500">{calculateAge(child.dob)}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-black whitespace-nowrap ml-4 ${textColor}`}>
                      {new Date(child.dob).getMonth() + 1}/{new Date(child.dob).getDate()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Registration Trends */}
          <div className="lg:col-span-2 bg-white dark:bg-[#0f172a] rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800/60 shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col h-full">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-6">Platform Registrations</h2>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06c5d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06c5d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="registrations" stroke="#06c5d4" strokeWidth={3} fillOpacity={1} fill="url(#colorReg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* --- Stats Grid Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Users className="text-primary-500" size={24} />}
            label="TOTAL STUDENTS"
            value={totalStudents.toString()}
            trend="+3 this week"
            trendColor="text-emerald-500"
            iconBg="bg-primary-50 dark:bg-primary-500/10"
            onClick={() => navigate('/admin/students')}
          />
          <StatCard
            icon={<Briefcase className="text-indigo-500" size={24} />}
            label="STAFF ON DUTY"
            value={totalStaff.toString()}
            trend="Active now"
            trendColor="text-emerald-500"
            iconBg="bg-indigo-50 dark:bg-indigo-500/10"
            onClick={() => navigate('/admin/teachers')}
          />
          <StatCard
            icon={<User className="text-orange-500" size={24} />}
            label="REGISTERED PARENTS"
            value={totalParents.toString()}
            trend="Verified"
            trendColor="text-emerald-500"
            iconBg="bg-orange-50 dark:bg-orange-500/10"
            onClick={() => navigate('/admin/parents')}
          />
          <StatCard
            icon={<TrendingUp className="text-fuchsia-500" size={24} />}
            label="REVENUE"
            value="Rs 1.2M"
            trend="Monthly"
            trendColor="text-emerald-500"
            iconBg="bg-fuchsia-50 dark:bg-fuchsia-500/10"
          />
        </div>

        {/* --- Middle Row: Requests & Schedule --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Admin approve / reject requests section */}
          <div className="lg:col-span-2 bg-white dark:bg-[#0f172a] rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800/60 dark:border-slate-800/60 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Management Requests</h2>
              <button className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-primary-500">View All</button>
            </div>

            <div className="space-y-6">
              {pendingRequests.length === 0 ? (
                <p className="text-sm text-slate-500">No pending requests.</p>
              ) : (
                pendingRequests.map((req) => (
                  <div
                    key={req.requestId}
                    className="flex items-center justify-between p-4 bg-transparent hover:bg-slate-50 dark:bg-transparent dark:hover:bg-slate-800/50 rounded-[1.5rem] cursor-pointer transition-all duration-300 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 hover:shadow-xl hover:-translate-y-1 group"
                    onClick={() => setSelectedRequest(req)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-logo-sparks rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                        {req.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors">{req.fullName}</h4>
                          <span className="px-2 py-0.5 bg-cyan-50 dark:bg-cyan-500/10 text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase rounded-md tracking-wider">
                            {req.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{req.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                      <Button
                        variant="primary"
                        onClick={(e) => { e.stopPropagation(); handleApprove(req); }}
                        className="px-6 py-2.5 text-xs font-bold rounded-xl shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 transition-all"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        onClick={(e) => { e.stopPropagation(); handleReject(req); }}
                        className="px-6 py-2.5 text-xs font-bold rounded-xl border-slate-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition-all"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Broadcast center link */}
          <div className="bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-indigo-700 to-primary-800 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:shadow-[0_30px_60px_rgba(79,70,229,0.5)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group cursor-pointer"
            onClick={() => navigate('/admin/broadcast')}>
            {/* Abstract Decorative Elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-400/30 rounded-full blur-3xl group-hover:bg-primary-400/40 transition-colors duration-500"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl group-hover:bg-purple-500/40 transition-colors duration-500"></div>
            <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 group-hover:opacity-20 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 pointer-events-none">
              <Megaphone size={160} className="text-white" />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <Megaphone size={24} className="text-white" />
                </div>
                <h3 className="text-3xl font-black text-white tracking-tight leading-none mb-2">Broadcast Center</h3>
                <p className="text-indigo-200 text-xs font-black uppercase tracking-widest">Institutional Communications</p>
              </div>

              <div className="mt-12">
                <p className="text-white/80 font-medium text-sm leading-relaxed mb-8 max-w-xs">
                  Send high-priority alerts and announcements to Parents and Teachers instantly.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-white text-indigo-900 font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] group-hover:bg-primary-50 transition-colors">
                    Launch Portal
                    <TrendingUp size={14} className="rotate-45" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Schedule Section */}
          <div className="lg:col-span-2 bg-white dark:bg-[#0f172a] rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800/60 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-8">Upcoming Schedule</h2>
            <div className="space-y-6">
              <ScheduleItem date="08" month="FEB" title="Morning Circle Time" time="09:00 AM - 10:30 AM" />
              <ScheduleItem date="08" month="FEB" title="Staff Meeting" time="12:30 PM - 01:30 PM" />
            </div>
          </div>


        </div>

        {/* --- Footer Status Banner --- */}
        <div className="bg-midnight rounded-[2.5rem] p-8 text-white flex items-center justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-lg font-black tracking-tight mb-1">Daily Status</h3>
            <p className="text-slate-400 dark:text-slate-500 dark:text-slate-400 text-sm font-medium">Everything is running smoothly! Keep up the great work.</p>
          </div>
          <Button
            variant="primary"
            className="relative z-10 flex items-center gap-3 px-8 py-4 bg-logo-sparks text-midnight dark:text-white rounded-[1.5rem] font-black tracking-tight hover:scale-105 active:scale-95 border-none"
          >
            <MessageCircle size={18} />
            Chat with Team
          </Button>
          {/* Decorative Sparkles */}
          <Sparkles className="absolute right-10 top-[-20px] text-white/5 w-40 h-40 group-hover:rotate-12 transition-all duration-700" />
        </div>

      </main>

      {/* Modal for Request Details */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn" onClick={() => setSelectedRequest(null)}>
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp" onClick={e => e.stopPropagation()}>
            
            {/* Header Area */}
            <div className="relative p-8 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
              <div className="flex gap-6 items-center">
                 <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{selectedRequest.fullName}</h2>
                    <p className="text-primary-600 dark:text-primary-400 font-black uppercase text-[10px] tracking-[0.2em] mt-1 flex items-center gap-1.5">
                       <User size={12} /> {selectedRequest.role || 'New Request'}
                    </p>
                 </div>
              </div>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="h-10 w-10 flex items-center justify-center bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-8 overflow-y-auto space-y-8 bg-white dark:bg-slate-900">
               
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/50 dark:bg-slate-800/20 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800/60">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                    <Mail size={16} className="text-primary-500"/>
                    <span className="text-[9px] font-black uppercase tracking-widest">Email Address</span>
                  </div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-6 break-all">{selectedRequest.email}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                    <Clock size={16} className="text-primary-500"/>
                    <span className="text-[9px] font-black uppercase tracking-widest">Submitted At</span>
                  </div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-6">
                    {selectedRequest.submittedAt ? new Date(selectedRequest.submittedAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>

                 <div className="space-y-4">
                 <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                   <FileText size={14} /> Additional Information
                 </h3>
                 <div className="bg-slate-50/50 dark:bg-slate-800/20 p-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-800/60">
                    {selectedRequest.additionalDetails && Object.keys(selectedRequest.additionalDetails).length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(selectedRequest.additionalDetails).map(([key, value]) => (
                          <div key={key} className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">{key}</span>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-0.5">{value as React.ReactNode}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                        {selectedRequest.extraInfo || 'No additional details provided by the user.'}
                      </p>
                    )}
                 </div>
              </div>
            </div>

            {/* Footer Area */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
              <button
                onClick={() => { handleReject(selectedRequest); }}
                className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800/30 transition-all shadow-sm"
              >
                Reject Request
              </button>
              <Button
                onClick={() => { handleApprove(selectedRequest); setSelectedRequest(null); }}
                className="rounded-xl font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20 px-8 py-2.5 flex items-center gap-2"
              >
                Approve Request
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

// --- Sub Components ---

const StatCard = ({ icon, label, value, trend, trendColor, iconBg, onClick }: any) => (
  <div
    onClick={onClick}
    className={`bg-white dark:bg-[#0f172a] p-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-800/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] group hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden flex items-center gap-4 ${onClick ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default'}`}
  >
    <div className={`absolute right-0 top-0 bottom-0 w-24 ${iconBg.split(' ')[0].replace('/10','/20')} opacity-30 rounded-full blur-3xl translate-x-1/2 group-hover:opacity-50 transition-opacity duration-500`}></div>
    <div className={`h-14 w-14 shrink-0 ${iconBg} rounded-2xl flex items-center justify-center group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300 shadow-sm relative z-10`}>
      {React.cloneElement(icon as React.ReactElement, { size: 22 })}
    </div>
    <div className="relative z-10 flex-1">
      <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">{value}</h3>
        <span className={`px-2 py-0.5 bg-slate-50 dark:bg-slate-800/50 ${trendColor} text-[9px] font-black rounded-md whitespace-nowrap`}>{trend}</span>
      </div>
    </div>
  </div>
);

const ScheduleItem = ({ date, month, title, time }: any) => (
  <div className="flex items-center gap-4 group cursor-pointer">
    <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl p-3 flex flex-col items-center justify-center min-w-[70px] group-hover:bg-primary-50 group-hover:border-primary-100 transition-all">
      <span className="text-lg font-black text-slate-900 dark:text-white">{date}</span>
      <span className="text-[10px] font-black text-slate-400">{month}</span>
    </div>
    <div>
      <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-primary-600 transition-colors">{title}</h4>
      <p className="text-xs text-slate-400 dark:text-slate-500 dark:text-slate-400 font-medium mt-0.5">{time}</p>
    </div>
  </div>
);

export default AdminDashboard;