// ─────────────────────────────────────────────────────────────────────────────
// AdminProgressPage.tsx  →  route: /admin/learning
// Admin view: daily stacked bar + activity list for a selected date.
// Below that: per-child report with engagement chart + attendance donut.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  setAdminSelectedDate, setAdminDailyProgress, setAdminActivities,
  setChildren, setSelectedChild, setDateRange,
  setStats, setEngagement, setAttendance,
  setLoading, setError,
  selectAdminSelectedDate, selectAdminDailyProgress, selectAdminActivities,
  selectProgressChildren, selectSelectedChildId,
  selectProgressDateRange, selectEngagement, selectAttendance,
  selectProgressLoading, selectProgressError,
} from '../store/slices/progressSlice';
import { selectUser } from '../features/auth/model/authSlice';
import { apiClient } from '../services/axiosInstance';
import { DailyProgressStackedBarChart, ProgressBarChart, ProgressPieChart } from '../components/progress';
import { BarChart2 } from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (d: Date) => d.toISOString().split('T')[0];

const AdminProgressPage: React.FC = () => {
  const dispatch         = useAppDispatch();
  const user             = useAppSelector(selectUser);
  const selectedDate     = useAppSelector(selectAdminSelectedDate);
  const dailyProgress    = useAppSelector(selectAdminDailyProgress);
  const activities       = useAppSelector(selectAdminActivities);
  const children         = useAppSelector(selectProgressChildren);
  const selectedChildId  = useAppSelector(selectSelectedChildId);
  const { from, to }     = useAppSelector(selectProgressDateRange);
  const engagement       = useAppSelector(selectEngagement);
  const attendance       = useAppSelector(selectAttendance);
  const loading          = useAppSelector(selectProgressLoading);
  const error            = useAppSelector(selectProgressError);
  const todayStr          = fmt(new Date());
  const [hasViewed, setHasViewed] = useState(false);

  // ── Fetch daily overview (top section) ──────────────────────────────────
  const fetchDailyOverview = async (date: string) => {
    try {
      const [progressRes, activitiesRes] = await Promise.all([
        apiClient.get('/api/v1/progress/admin/daily', { params: { date } }),
        apiClient.get('/api/v1/progress/admin/activities', { params: { date } }),
      ]);
      if (progressRes.data.success)   dispatch(setAdminDailyProgress(progressRes.data.data || []));
      if (activitiesRes.data.success) dispatch(setAdminActivities(activitiesRes.data.data || []));
    } catch {
      console.error('Failed to fetch admin daily overview');
    }
  };

  // ── Fetch children for the dropdown ────────────────────────────────────
  const fetchChildren = async () => {
    try {
      const res = await apiClient.get('/api/v1/progress/admin/children');
      if (res.data.success) dispatch(setChildren(res.data.data || []));
    } catch {
      console.error('Failed to fetch children list');
    }
  };

  // ── Fetch per-child report ──────────────────────────────────────────────
  const fetchChildReport = async (childId: string, fromDate: string, toDate: string) => {
    dispatch(setLoading(true));
    try {
      const [engRes, attRes] = await Promise.all([
        apiClient.get(`/api/v1/progress/admin/child/${childId}/engagement`, { params: { from: fromDate, to: toDate } }),
        apiClient.get(`/api/v1/progress/admin/child/${childId}/attendance`, { params: { from: fromDate, to: toDate } }),
      ]);
      if (engRes.data.success) dispatch(setEngagement(engRes.data.data || []));
      if (attRes.data.success) dispatch(setAttendance(attRes.data.data));
    } catch {
      console.error('Failed to fetch child report');
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (!user?.email) return;
    fetchDailyOverview(selectedDate);
    fetchChildren();
  }, [user]);

  // Switching to a different child resets back to the "not yet viewed" stage
  useEffect(() => {
    setHasViewed(false);
    dispatch(setError(null));
    dispatch(setEngagement([]));
    dispatch(setAttendance(null));
  }, [selectedChildId]);

  const handleViewReport = () => {
    dispatch(setError(null));

    if (!selectedChildId) {
      dispatch(setError('Please select a child first.'));
      return;
    }
    if (!from || !to) {
      dispatch(setError('Please select a date range.'));
      return;
    }
    if (to < from) {
      dispatch(setError('"To" date cannot be earlier than the "From" date.'));
      return;
    }

    setHasViewed(true);
    fetchChildReport(selectedChildId, from, to);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">

      {/* ── Page Header ── */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <span className="w-10 h-10 rounded-xl bg-[#06B6D4]/10 flex items-center justify-center">
            <BarChart2 size={20} className="text-[#06B6D4]" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Learning Progress</h1>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              Track Student Development & Analytics
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 space-y-6">

        {/* ── Top Row: Daily Progress Chart + Activity List ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Daily Progress stacked bar */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-slate-800">Daily Progress</h2>
              <input
                type="date"
                value={selectedDate}
                max={todayStr}
                onChange={e => {
                  dispatch(setAdminSelectedDate(e.target.value));
                  fetchDailyOverview(e.target.value);
                }}
                className="border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30"
              />
            </div>
            <DailyProgressStackedBarChart data={dailyProgress} />
          </div>

          {/* Daily Activity List */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="mb-4">
              <h2 className="text-sm font-black text-slate-800">Daily Activity List</h2>
              <p className="text-[11px] text-slate-400 font-bold mt-0.5">
                Activities for {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            {activities.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm font-bold">
                No activities recorded for this date
              </div>
            ) : (
              <div className="admin-activity-scroll space-y-4 max-h-[344px] overflow-y-auto pr-2">
                {activities.map((act, i) => (
                  <div key={i}>
                    {i > 0 && <div className="h-px bg-slate-100 mb-4" />}
                    <p className="text-sm font-black text-slate-800 mb-2">{act.activityName}</p>
                    <div className="flex items-center gap-6 text-xs text-slate-400 font-bold">
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded bg-slate-100 flex items-center justify-center text-[10px]">🗓</span>
                        {act.time}
                      </div>
                      <div>
                        <span className="text-slate-500">Teacher: </span>
                        <span className="text-slate-700">{act.teacherName}</span>
                        <br />
                        <span>{act.teacherRole}</span>
                      </div>
                      <div>
                        <span className="text-slate-700 font-black">{act.studentCount} Students</span>
                        <br />
                        <span className={act.participationStatus === 'Participated' ? 'text-emerald-500' : 'text-slate-400'}>
                          {act.participationStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Bottom: Per-child report ── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {/* Child name dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Child Name</label>
              <select
                value={selectedChildId || ''}
                onChange={e => dispatch(setSelectedChild(e.target.value))}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 bg-white min-w-[200px] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30"
              >
                <option value="" disabled>Select a child</option>
                {children.map(c => (
                  <option key={c.childId} value={c.childId}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* From date */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">From</label>
              <input
                type="date"
                value={from}
                max={todayStr}
                onChange={e => dispatch(setDateRange({ from: e.target.value, to }))}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30"
              />
            </div>

            {/* To date */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">To</label>
              <input
                type="date"
                value={to}
                max={todayStr}
                onChange={e => dispatch(setDateRange({ from, to: e.target.value }))}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30"
              />
            </div>

            <button
              onClick={handleViewReport}
              disabled={loading}
              className="mt-5 bg-[#06B6D4] hover:bg-[#0891B2] text-white px-6 py-2.5 rounded-xl text-sm font-black transition-all disabled:opacity-60 shadow-md shadow-cyan-100"
            >
              {loading ? 'Loading…' : 'View Report'}
            </button>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-rose-50 border border-rose-100 rounded-xl text-sm text-rose-600 font-bold">
              {error}
            </div>
          )}

          {hasViewed ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Engagement chart */}
              <div>
                <h3 className="text-sm font-black text-slate-800 mb-3">
                  Activity Engagement — {children.find(c => c.childId === selectedChildId)?.name}
                </h3>
                <ProgressBarChart data={engagement} pageSize={6} />
              </div>

              {/* Attendance donut */}
              <div>
                <h3 className="text-sm font-black text-slate-800 mb-3">
                  Attendance Rate — {children.find(c => c.childId === selectedChildId)?.name}
                </h3>
                {attendance ? (
                  <ProgressPieChart attendance={attendance} />
                ) : (
                  <div className="h-48 flex items-center justify-center text-slate-400 text-sm font-bold">
                    No attendance data
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-slate-400 text-sm font-bold">
              {selectedChildId
                ? 'Select a date range and click "View Report" to see progress.'
                : 'Select a child to view their detailed report.'}
            </div>
          )}
        </div>

      </main>

      <style>{`
        .admin-activity-scroll {
          scrollbar-width: auto;
          scrollbar-color: #06B6D4 #f1f5f9;
        }
        .admin-activity-scroll::-webkit-scrollbar {
          width: 10px;
        }
        .admin-activity-scroll::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 9999px;
        }
        .admin-activity-scroll::-webkit-scrollbar-thumb {
          background: #06B6D4;
          border-radius: 9999px;
        }
        .admin-activity-scroll::-webkit-scrollbar-thumb:hover {
          background: #0891B2;
        }
      `}</style>
    </div>
  );
};

export default AdminProgressPage;
