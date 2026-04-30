import React, { useState, useEffect } from 'react';
import { 
  Users, Briefcase, MessageSquare, TrendingUp, 
  Search, Bell, Check, X, Calendar, MessageCircle, Sparkles 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [totalStudents, setTotalStudents] = useState(15);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  const loadData = () => {
    const admissionsData = JSON.parse(localStorage.getItem('admissionsData') || '[]');
    if (admissionsData.length > 0) {
      setTotalStudents(admissionsData.length);
    }
    const userRequests = JSON.parse(localStorage.getItem('user_requests') || '[]');
    setPendingRequests(userRequests.filter((r: any) => r.status === 'Pending'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = (request: any) => {
    const userRequests = JSON.parse(localStorage.getItem('user_requests') || '[]');
    const updatedRequests = userRequests.map((r: any) => 
      r.id === request.id ? { ...r, status: 'Approved' } : r
    );
    localStorage.setItem('user_requests', JSON.stringify(updatedRequests));

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpCredentials = JSON.parse(localStorage.getItem('otp_credentials') || '[]');
    otpCredentials.push({ 
      email: request.email, 
      otp, 
      role: request.role, 
      firstName: request.firstName,
      fullName: `${request.firstName} ${request.lastName}`
    });
    localStorage.setItem('otp_credentials', JSON.stringify(otpCredentials));

    // Simulate SMTP Email
    alert(`[SMTP Email Simulation]\n\nTo: ${request.email}\nSubject: Application Approved\n\nHello ${request.firstName},\n\nYour application for ${request.role} has been approved.\nYour One-Time Password (OTP) is: ${otp}\n\nPlease login using this OTP.`);
    
    loadData();
  };

  const handleReject = (id: number) => {
    const userRequests = JSON.parse(localStorage.getItem('user_requests') || '[]');
    const updatedRequests = userRequests.map((r: any) => 
      r.id === id ? { ...r, status: 'Rejected' } : r
    );
    localStorage.setItem('user_requests', JSON.stringify(updatedRequests));
    loadData();
  };

  return (
    <div className="min-h-screen w-full bg-surface-secondary font-sans text-slate-900 pb-10">
      {/* --- Top Header Section --- */}
      <header className="max-w-7xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight font-sans">Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Welcome back, Administrator</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search data..." 
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl w-64 outline-none focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary-500 transition-all shadow-sm relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
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
            value="18"
            trend="2 on leave"
            trendColor="text-emerald-500"
            iconBg="bg-indigo-50"
          />
          <StatCard 
            icon={<MessageSquare className="text-orange-500" size={24} />}
            label="PENDING INQUIRIES"
            value="7"
            trend="Action required"
            trendColor="text-emerald-500"
            iconBg="bg-orange-50"
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
                  <div key={req.id} className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-logo-sparks rounded-xl flex items-center justify-center text-white font-black text-lg">
                        {req.firstName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900">{req.firstName} {req.lastName}</h4>
                          <span className="px-2 py-0.5 bg-cyan-50 text-[10px] font-black text-cyan-600 uppercase rounded-md tracking-wider">
                            {req.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">{req.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleApprove(req)}
                        className="px-6 py-2.5 bg-midnight text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(req.id)}
                        className="px-6 py-2.5 bg-slate-50 text-slate-400 text-xs font-bold rounded-xl hover:bg-slate-100 transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
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
          <button className="relative z-10 flex items-center gap-3 px-8 py-4 bg-logo-sparks text-midnight rounded-[1.5rem] font-black text-sm tracking-tight hover:scale-105 transition-all active:scale-95">
            <MessageCircle size={18} />
            Chat with Team
          </button>
          {/* Decorative Sparkles */}
          <Sparkles className="absolute right-10 top-[-20px] text-white/5 w-40 h-40 group-hover:rotate-12 transition-all duration-700" />
        </div>

      </main>
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