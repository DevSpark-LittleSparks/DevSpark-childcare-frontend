import React, { useState, useEffect } from 'react';
import {
  Users, Briefcase, MessageSquare, TrendingUp,
  Search, Bell, Check, X, Calendar, MessageCircle, Sparkles, ShieldCheck, User, Megaphone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Logo } from '../../components/common/Logo';
import { apiClient } from '../../services/axiosInstance';


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

  const loadData = async () => {
    try {
      // Fetch real stats from backend
      const statsRes = await apiClient.get('/api/v1/auth/admin/stats');
      const stats = statsRes.data.data;
      setTotalStudents(stats.totalStudents || 0);
      setTotalStaff(stats.totalStaff || 0);
      setTotalParents(stats.totalParents || 0);

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
    } catch (err) {
      console.error("Failed to load admin data:", err);
    }
  };



  const handleApprove = async (request: any) => {
    try {
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
    const interval = setInterval(loadData, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="min-h-screen w-full bg-surface-secondary font-sans text-slate-900 pb-10">
      {/* --- Top Header Section --- */}
      <header className="max-w-7xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-1 bg-primary-500 rounded-full hidden sm:block"></div>
          <div>
            <div className="flex items-center gap-2 mb-0.5 text-primary-500">
              <ShieldCheck size={14} className="fill-primary-500" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">Master Control</p>
            </div>
            <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-wider opacity-60">Admin Console</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          

          <div className="relative">
            <Button
              variant="secondary"
              onClick={() => setShowAdminNotifs(!showAdminNotifs)}
              className={`p-2.5 bg-white border border-slate-100 rounded-xl transition-all shadow-sm relative ${showAdminNotifs ? 'ring-2 ring-primary-500/20 border-primary-500' : ''}`}
            >
              <Bell size={20} className={showAdminNotifs ? 'text-primary-500' : 'text-slate-400'} />
              {pendingRequests.length > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </Button>

            {/* ADMIN NOTIFICATION DROPDOWN */}
            {showAdminNotifs && (
              <div className="absolute top-full right-0 mt-4 w-80 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(10,6,55,0.15)] border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-[10px] font-black text-midnight uppercase tracking-widest">System Alerts</h3>
                  <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                    {pendingRequests.length} Critical
                  </span>
                </div>
                <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                  {pendingRequests.length > 0 ? (
                    pendingRequests.map((req) => (
                      <div
                        key={req.id}
                        onClick={() => { setSelectedRequest(req); setShowAdminNotifs(false); }}
                        className="p-5 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                          <h4 className="text-[11px] font-black text-midnight uppercase tracking-tight">Pending {req.role} Request</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          <span className="font-bold text-midnight">{req.fullName}</span> has submitted a new application for review.
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center text-slate-300 font-bold text-[10px] uppercase tracking-[0.2em]">
                      All systems normal
                    </div>
                  )}
                </div>
                <div className="p-4 bg-slate-50/80 text-center border-t border-slate-100">
                  <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-500 transition-colors">
                    View Maintenance Logs
                  </button>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={() => navigate('/admin/profile')}
            variant="primary"
            className="h-11 w-11 p-0 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 active:scale-95"
          >
            <User size={20} />
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-6 space-y-8 animate-fadeUp">

        {/* --- Stats Grid Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Users className="text-primary-500" size={24} />}
            label="TOTAL STUDENTS"
            value={totalStudents.toString()}
            trend="+3 this week"
            trendColor="text-emerald-500"
            iconBg="bg-primary-50"
            onClick={() => navigate('/admin/students')}
          />


          <StatCard
            icon={<Briefcase className="text-indigo-500" size={24} />}
            label="STAFF ON DUTY"
            value={totalStaff.toString()}
            trend="Active now"
            trendColor="text-emerald-500"
            iconBg="bg-indigo-50"
            onClick={() => navigate('/admin/teachers')}
          />
          <StatCard
            icon={<User className="text-orange-500" size={24} />}
            label="REGISTERED PARENTS"
            value={totalParents.toString()}
            trend="Verified"
            trendColor="text-emerald-500"
            iconBg="bg-orange-50"
            onClick={() => navigate('/admin/parents')}
          />
          <StatCard
            icon={<TrendingUp className="text-fuchsia-500" size={24} />}
            label="REVENUE"
            value="Rs 1.2M"
            trend="Monthly"
            trendColor="text-emerald-500"
            iconBg="bg-fuchsia-50"
          />
        </div>

        {/* --- Middle Row: Requests & Schedule --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Management Requests Section */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Management Requests</h2>
              <button className="text-sm font-bold text-slate-500 hover:text-primary-500">View All</button>
            </div>

            <div className="space-y-6">
              {pendingRequests.length === 0 ? (
                <p className="text-sm text-slate-500">No pending requests.</p>
              ) : (
                pendingRequests.map((req) => (
                  <div
                    key={req.requestId}
                    className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-slate-100"
                    onClick={() => setSelectedRequest(req)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-logo-sparks rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm">
                        {req.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900">{req.fullName}</h4>
                          <span className="px-2 py-0.5 bg-cyan-50 text-[10px] font-black text-cyan-600 uppercase rounded-md tracking-wider">
                            {req.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">{req.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        onClick={(e) => { e.stopPropagation(); handleApprove(req); }}
                        className="px-6 py-2.5 text-xs font-bold rounded-xl"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        onClick={(e) => { e.stopPropagation(); handleReject(req); }}
                        className="px-6 py-2.5 text-xs font-bold rounded-xl border-slate-200 text-slate-500 hover:bg-slate-50"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* --- BROADCAST CENTER LINK --- */}
          <div className="bg-gradient-to-br from-primary-500 to-indigo-600 rounded-[3rem] p-10 shadow-[0_25px_60px_rgba(6,197,212,0.3)] relative overflow-hidden group cursor-pointer"
               onClick={() => navigate('/admin/broadcast')}>
            {/* Abstract Decorative Circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl -ml-20 -mb-20"></div>

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-[1.5rem] text-white shadow-2xl group-hover:scale-110 transition-transform">
                  <Megaphone size={28} className="animate-bounce" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-[0.2em] leading-none">Broadcast Center</h3>
                  <p className="text-[10px] font-black text-white/70 uppercase mt-1.5 tracking-[0.3em]">Institutional Communications</p>
                </div>
              </div>

              <div className="mt-12">
                <p className="text-white/80 font-medium text-sm leading-relaxed mb-6">
                  Send high-priority alerts and announcements to Parents and Teachers instantly.
                </p>
                <div className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm border border-white/10 group-hover:bg-white/20 transition-all">
                  Launch Portal
                  <TrendingUp size={12} className="rotate-45" />
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Schedule Section */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
            <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8">Upcoming Schedule</h2>
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
            <p className="text-slate-400 text-sm font-medium">Everything is running smoothly! Keep up the great work.</p>
          </div>
          <Button
            variant="primary"
            className="relative z-10 flex items-center gap-3 px-8 py-4 bg-logo-sparks text-midnight rounded-[1.5rem] font-black tracking-tight hover:scale-105 active:scale-95 border-none"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedRequest(null)}>
          <div
            className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">Request Details</h3>
              <button onClick={() => setSelectedRequest(null)} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Display all details depending on role */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</p>
                  <p className="font-bold text-slate-900">{selectedRequest.fullName}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</p>
                  <p className="font-bold text-slate-900">{selectedRequest.email}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-cyan-50 text-[10px] font-black text-cyan-600 uppercase rounded-md tracking-wider">
                    {selectedRequest.role}
                  </span>
                </div>

                <div className="col-span-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Additional Information</p>
                  <p className="font-medium text-slate-700 bg-slate-50 p-3 rounded-xl mt-1 text-sm border border-slate-100">
                    {selectedRequest.extraInfo || 'No additional details provided.'}
                  </p>
                </div>

                <div className="col-span-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Submitted At</p>
                  <p className="font-bold text-slate-900">
                    {selectedRequest.submittedAt ? new Date(selectedRequest.submittedAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer with Actions */}
            <div className="p-6 bg-slate-50 flex items-center justify-end gap-3 border-t border-slate-100">
               <button
                onClick={() => { handleReject(selectedRequest); }}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
              >
                Reject
              </button>
              <button
                onClick={() => { handleApprove(selectedRequest); setSelectedRequest(null); }}
                className="px-6 py-3 bg-midnight text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-md"
              >
                Approve
              </button>
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
    className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] group hover:border-primary-500/20 transition-all ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}`}
  >
    <div className="flex items-start justify-between mb-6">
      <div className={`h-14 w-14 ${iconBg} rounded-[1.2rem] flex items-center justify-center group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
      <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-1 font-sans">{value}</h3>
      <p className={`text-xs font-black ${trendColor} tracking-tight`}>{trend}</p>
    </div>
  </div>
);

const ScheduleItem = ({ date, month, title, time }: any) => (
  <div className="flex items-center gap-4 group cursor-pointer">
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex flex-col items-center justify-center min-w-[70px] group-hover:bg-primary-50 group-hover:border-primary-100 transition-all">
      <span className="text-lg font-black text-slate-900">{date}</span>
      <span className="text-[10px] font-black text-slate-400">{month}</span>
    </div>
    <div>
      <h4 className="font-bold text-slate-900 text-sm group-hover:text-primary-600 transition-colors">{title}</h4>
      <p className="text-xs text-slate-400 font-medium mt-0.5">{time}</p>
    </div>
  </div>
);

export default AdminDashboard;