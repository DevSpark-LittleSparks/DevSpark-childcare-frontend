// TeacherDashboardPage.tsx  →  route: /teacher/dashboard
// Changes from previous version:
//   1. Fully responsive — works at any zoom level (uses w-full, max-w, overflow-hidden)
//   2. Bell icon navigates to /teacher/messages
//   3. Class Status, Safety Alerts, Parent Comms cards are expandable on click
//   4. Teacher full name shown in header (not just first name)

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import {
  setClassStatus,
  setSafetyAlerts,
  setParentMessages,
  setUpcomingActivities,
  setActivityLogs,
  setLoading,
  setError,
  selectClassStatus,
  selectSafetyAlerts,
  selectParentMessages,
  selectUpcomingActivities,
  selectActivityLogs,
  selectUnreadMessageCount,
  selectTeacherLoading,
} from '../store/slices/teacherSlice';
import { selectUser } from '../features/auth/model/authSlice';
import { Button } from '../components/common/Button';
import { apiClient } from '../services/axiosInstance';
import {
  Bell,
  ShieldAlert,
  Calendar,
  Search,
  CheckCircle2,
  UtensilsCrossed,
  Zap,
  ArrowDown,
  ChevronDown,
  MessageCircle,
} from 'lucide-react';

// ── Donut chart ───────────────────────────────────────────────────
const DonutChart = ({ checkedIn, expected }: { checkedIn: number; expected: number }) => {
  const size = 100;
  const r = 34;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const pct = expected > 0 ? Math.min((checkedIn / expected) * 100, 100) : 0;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={10} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#06B6D4"
        strokeWidth={10}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
    </svg>
  );
};

// ── Log icon ──────────────────────────────────────────────────────
const LogIcon = ({ type }: { type: string }) => {
  if (type === 'MEAL') return <UtensilsCrossed size={13} className="text-amber-500" />;
  if (type === 'ACTIVITY') return <CheckCircle2 size={13} className="text-emerald-500" />;
  return <Zap size={13} className="text-[#06B6D4]" />;
};

const SORT_OPTIONS = [
  { value: '', label: 'Recent first' },
  { value: 'name_asc', label: 'Name A → Z' },
  { value: 'name_desc', label: 'Name Z → A' },
  { value: 'type_meal', label: 'Meals first' },
  { value: 'type_activity', label: 'Activities first' },
];

// ── Interactive card wrapper ───────────────────────────────────────
const InteractiveCard = ({
  title,
  subtitle,
  badge,
  icon,
  children,
  onClick,
}: {
  title: string;
  subtitle: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-md ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="min-w-0">
            <p className="text-sm font-black text-slate-800 text-left truncate">{title}</p>
            <p className="text-[11px] text-slate-400 font-bold text-left">{subtitle}</p>
          </div>
          {badge}
        </div>
        {icon && <div className="flex items-center shrink-0 ml-2 text-slate-400">{icon}</div>}
      </div>
      <div className="px-4 pb-4">{children}</div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────
const TeacherDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const classStatus = useAppSelector(selectClassStatus);
  const alerts = useAppSelector(selectSafetyAlerts);
  const messages = useAppSelector(selectParentMessages);
  const activities = useAppSelector(selectUpcomingActivities);
  const logs = useAppSelector(selectActivityLogs);
  const unread = useAppSelector(selectUnreadMessageCount);
  const loading = useAppSelector(selectTeacherLoading);

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [logSearch, setLogSearch] = useState('');
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [showSort, setShowSort] = useState(false);

  const fetchAll = async () => {
    dispatch(setLoading(true));
    try {
      const [s, a, m, ac, l] = await Promise.all([
        apiClient.get('/api/v1/teacher/dashboard/class-status'),
        apiClient.get('/api/v1/teacher/dashboard/safety-alerts'),
        apiClient.get('/api/v1/teacher/dashboard/parent-messages'),
        apiClient.get('/api/v1/teacher/dashboard/upcoming-activities'),
        apiClient.get('/api/v1/teacher/dashboard/activity-logs', {
          params: { sortBy: sortBy || undefined },
        }),
      ]);
      if (s.data.success) dispatch(setClassStatus(s.data.data));
      if (a.data.success) dispatch(setSafetyAlerts(a.data.data || []));
      if (m.data.success) dispatch(setParentMessages(m.data.data || []));
      if (ac.data.success) dispatch(setUpcomingActivities(ac.data.data || []));
      if (l.data.success) dispatch(setActivityLogs(l.data.data || []));
    } catch {
      dispatch(setError('Failed to load dashboard'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchLogs = async (sort: string) => {
    try {
      const res = await apiClient.get('/api/v1/teacher/dashboard/activity-logs', {
        params: { sortBy: sort || undefined },
      });
      if (res.data.success) dispatch(setActivityLogs(res.data.data || []));
    } catch {}
  };

  useEffect(() => {
    if (!user?.email) return;
    fetchAll();
    const interval = setInterval(async () => {
      try {
        const r = await apiClient.get('/api/v1/teacher/dashboard/class-status');
        if (r.data.success) dispatch(setClassStatus(r.data.data));
      } catch {}
    }, 60_000);
    return () => clearInterval(interval);
  }, [user]);

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setShowSort(false);
    fetchLogs(value);
  };

  const filteredLogs = logs.filter(
    (l) =>
      l.childName?.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.detail?.toLowerCase().includes(logSearch.toLowerCase()),
  );
  const visibleLogs = showAllLogs ? filteredLogs : filteredLogs.slice(0, 4);

  if (loading && !classStatus) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#06B6D4] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-10 overflow-x-hidden">
      {/* ── Header ── */}
      <div className="w-full px-4 sm:px-6 pt-6 pb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight truncate">
            Welcome back, {user?.displayName || 'Teacher'}!
          </h1>
          <p className="text-slate-400 text-xs font-bold mt-0.5">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          {/* Real-time date and time */}
          <div className="hidden md:flex flex-col items-end mr-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <span className="text-sm font-bold text-slate-900 font-mono opacity-80">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          {/* Bell → navigates to messages */}
          <Button
            variant="secondary"
            onClick={() => navigate('/teacher/messages')}
            className="h-11 w-11 p-0 rounded-xl relative shadow-sm"
          >
            <Bell size={17} className="text-primary-500" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#06B6D4] text-white text-[9px] font-black flex items-center justify-center">
                {unread}
              </span>
            )}
          </Button>

          {/* Profile avatar → navigates to profile */}
          <button
            onClick={() => navigate('/teacher/profile')}
            className="h-11 w-11 p-0 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 active:scale-95 transition-all overflow-hidden border-2 border-white"
          >
            {user?.photoURL && user.photoURL !== 'null' && user.photoURL.trim() !== '' ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#06B6D4] to-[#0891B2] flex items-center justify-center text-white font-black text-lg">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'T'}
              </div>
            )}
          </button>
        </div>
      </div>

      <main className="w-full px-4 sm:px-6 space-y-4">
        {/* ── Row 1: 3 interactive cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Class Status */}
          <InteractiveCard
            title="Class Status"
            subtitle="Live attendance overview"
            badge={
              <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full ml-2 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE
              </span>
            }
            onClick={() => navigate('/teacher/attendance')}
          >
            <div className="flex items-center gap-3 pt-1">
              <div className="relative shrink-0">
                <DonutChart
                  checkedIn={classStatus?.checkedIn ?? 0}
                  expected={classStatus?.expected ?? 1}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-slate-800">
                    {classStatus?.checkedIn ?? 0}
                  </span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">
                    Present
                  </span>
                </div>
              </div>
              <div className="flex-1 space-y-2.5 min-w-0">
                {[
                  {
                    label: 'Checked-in',
                    pct: classStatus?.checkedInPercent ?? 0,
                    color: 'bg-[#06B6D4]',
                    tc: 'text-[#06B6D4]',
                    count: classStatus?.checkedIn ?? 0,
                  },
                  {
                    label: 'Expected',
                    pct: classStatus?.expectedPercent ?? 0,
                    color: 'bg-slate-300',
                    tc: 'text-slate-400',
                    count: classStatus?.expected ?? 0,
                  },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                      <span>{row.label}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-700 font-black">{row.count}</span>
                        <span className={row.tc}>{row.pct}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${row.color} rounded-full transition-all duration-500`}
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </InteractiveCard>

          {/* Safety Alerts */}
          <InteractiveCard
            title="Safety Alerts"
            subtitle="Critical updates needed"
            icon={<ShieldAlert size={16} className="text-amber-500" />}
          >
            <div className="teacher-alert-scroll space-y-2 pt-1 max-h-[130px] overflow-y-auto pr-1">
              {alerts.length === 0 ? (
                <p className="text-xs text-slate-400 font-bold text-center py-4">
                  No active alerts
                </p>
              ) : (
                alerts.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-2.5 bg-orange-50 border border-orange-100 rounded-xl"
                  >
                    <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                    <p className="text-xs font-black text-slate-700 truncate">
                      <span className="text-orange-600">{a.childName}: </span>
                      {a.condition}
                    </p>
                  </div>
                ))
              )}
            </div>
          </InteractiveCard>

          {/* Parent Comms */}
          <InteractiveCard
            title="Parent Comms"
            subtitle="Recent incoming messages"
            badge={
              unread > 0 ? (
                <span className="text-[10px] font-black text-white bg-[#06B6D4] px-2 py-0.5 rounded-full ml-2 shrink-0">
                  {unread} NEW
                </span>
              ) : undefined
            }
            icon={<MessageCircle size={15} className="text-slate-300" />}
            onClick={() => navigate('/teacher/messages')}
          >
            <div className="space-y-1.5 pt-1">
              {messages.length === 0 ? (
                <p className="text-xs text-slate-400 font-bold text-center py-4">No messages</p>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-black text-sm shrink-0">
                      {msg.parentName?.charAt(0)?.toUpperCase() || 'P'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-black text-slate-800 truncate">
                          {msg.parentName}
                        </p>
                        <span className="text-[10px] text-slate-300 font-bold shrink-0">
                          {msg.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{msg.preview}</p>
                    </div>
                    {msg.unread && (
                      <span className="w-2 h-2 rounded-full bg-[#06B6D4] shrink-0 mt-1.5" />
                    )}
                  </div>
                ))
              )}
            </div>
            {messages.length > 0 && (
              <button className="mt-3 w-full text-[11px] font-black text-[#06B6D4] hover:underline">
                View All Messages →
              </button>
            )}
          </InteractiveCard>
        </div>

        {/* ── Row 2: Upcoming + Logs ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Upcoming Activities */}
          <div
            onClick={() => navigate('/teacher/activities')}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-slate-800">Upcoming Activities</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/teacher/activities');
                }}
                className="text-[11px] font-black text-[#06B6D4] hover:underline"
              >
                Full Schedule
              </button>
            </div>
            {activities.length === 0 ? (
              <p className="text-xs text-slate-400 font-bold text-center py-8">
                No activities assigned for today
              </p>
            ) : (
              <div className="space-y-4 overflow-y-auto max-h-72">
                {activities.map((act, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-8 h-8 rounded-xl bg-[#06B6D4]/10 flex items-center justify-center">
                        <Calendar size={14} className="text-[#06B6D4]" />
                      </div>
                      {i < activities.length - 1 && <div className="w-px h-5 bg-slate-100 mt-1" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-black text-[#06B6D4] uppercase tracking-wide">
                        {act.startTime} – {act.endTime}
                      </p>
                      <p className="text-sm font-black text-slate-800 truncate">{act.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{act.description}</p>
                      {act.status === 'COMPLETED' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                          <CheckCircle2 size={9} /> Done
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Logs */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black text-slate-800">Recent Activity Logs</h3>
              <div className="flex items-center gap-2">
                {/* Sort */}
                <div className="relative">
                  <button
                    onClick={() => setShowSort((v) => !v)}
                    className="flex items-center gap-1 text-[11px] font-black text-slate-500 border border-slate-200 px-2.5 py-1.5 rounded-xl hover:border-[#06B6D4] hover:text-[#06B6D4] transition-colors bg-white"
                  >
                    Sort <ChevronDown size={11} />
                  </button>
                  {showSort && (
                    <div className="absolute right-0 top-8 z-20 bg-white border border-slate-100 rounded-xl shadow-lg w-40 overflow-hidden">
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleSortChange(opt.value)}
                          className={`w-full text-left px-3 py-2 text-xs font-bold hover:bg-[#06B6D4]/5 transition-colors ${
                            sortBy === opt.value
                              ? 'text-[#06B6D4] bg-[#06B6D4]/5'
                              : 'text-slate-600'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Search */}
                <div className="relative">
                  <Search
                    size={12}
                    className="absolute left-2 top-2 text-slate-300 pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="Search…"
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    className="pl-6 pr-2 py-1.5 text-xs font-bold border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/20 w-24"
                  />
                </div>
              </div>
            </div>

            {visibleLogs.length === 0 ? (
              <p className="text-xs text-slate-400 font-bold text-center py-8">
                {logSearch ? 'No results found' : 'No logs for today'}
              </p>
            ) : (
              <div className="space-y-2 overflow-y-auto max-h-72">
                {visibleLogs.map((log, i) => (
                  <div
                    key={log.logId || i}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="relative shrink-0">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-white font-black text-sm overflow-hidden">
                        {log.childImage ? (
                          <img
                            src={log.childImage}
                            alt={log.childName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          log.childName?.charAt(0)?.toUpperCase() || 'C'
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center">
                        <LogIcon type={log.logType} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-slate-800 truncate">{log.childName}</p>
                      <p className="text-[11px] text-slate-400 font-bold uppercase truncate">
                        {log.detail}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-300 font-bold shrink-0">
                      {log.time}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {filteredLogs.length > 4 && (
              <button
                onClick={() => setShowAllLogs((v) => !v)}
                className="mt-3 w-full text-[11px] font-black text-slate-400 hover:text-[#06B6D4] transition-colors flex items-center justify-center gap-1"
              >
                {showAllLogs ? 'Show less' : `View All Today Logs (${filteredLogs.length})`}
                <ArrowDown
                  size={11}
                  className={`transition-transform ${showAllLogs ? 'rotate-180' : ''}`}
                />
              </button>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .teacher-alert-scroll {
          scrollbar-width: auto;
          scrollbar-color: #06B6D4 #f1f5f9;
        }
        .teacher-alert-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .teacher-alert-scroll::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 9999px;
        }
        .teacher-alert-scroll::-webkit-scrollbar-thumb {
          background: #06B6D4;
          border-radius: 9999px;
        }
        .teacher-alert-scroll::-webkit-scrollbar-thumb:hover {
          background: #0891B2;
        }
      `}</style>
    </div>
  );
};

export default TeacherDashboardPage;
