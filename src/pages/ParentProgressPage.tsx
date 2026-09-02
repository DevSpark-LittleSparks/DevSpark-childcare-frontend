// ─────────────────────────────────────────────────────────────────────────────
// ParentProgressPage.tsx  →  route: /parent/progress
// Progress report for the logged-in parent.
// Shows stat cards, paginated activity engagement bar chart, attendance donut.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  setChildren, setSelectedChild, setDateRange,
  setStats, setEngagement, setAttendance,
  setLoading, setError, resetProgress,
  selectProgressChildren, selectSelectedChildId,
  selectProgressDateRange, selectProgressStats,
  selectEngagement, selectAttendance,
  selectProgressLoading, selectProgressError,
} from '../store/slices/progressSlice';
import { selectUser } from '../features/auth/model/authSlice';
import { apiClient } from '../services/axiosInstance';
import { ProgressBarChart, ProgressPieChart } from '../components/progress';

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-2 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-md">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <div className="text-3xl font-black text-[#06B6D4] mt-1">{value}</div>
    <div className="h-1 w-10 bg-slate-100 rounded-full" />
    {sub}
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const ParentProgressPage: React.FC = () => {
  const dispatch   = useAppDispatch();
  const user       = useAppSelector(selectUser);
  const children   = useAppSelector(selectProgressChildren);
  const selectedId = useAppSelector(selectSelectedChildId);
  const { from, to } = useAppSelector(selectProgressDateRange);
  const stats      = useAppSelector(selectProgressStats);
  const engagement = useAppSelector(selectEngagement);
  const attendance = useAppSelector(selectAttendance);
  const loading    = useAppSelector(selectProgressLoading);
  const error      = useAppSelector(selectProgressError);
  const [hasViewed, setHasViewed] = useState(false);

  // ── Load children list ────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.email) return;

    const fetchChildren = async () => {
      try {
        const res = await apiClient.get('/api/v1/parent/profile');
        if (res.data.success) {
          const list = (res.data.data.children || []).map((c: any) => ({
            childId: c.childId,
            name: c.name,
          }));
          dispatch(setChildren(list));
        }
      } catch {
        dispatch(setError('Failed to load children'));
      }
    };
    fetchChildren();

    return () => { dispatch(resetProgress()); };
  }, [dispatch, user]);

  // ── Fetch progress data ───────────────────────────────────────────────────
  const fetchProgress = async (childId: string, fromDate: string, toDate: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const [statsRes, engRes, attRes] = await Promise.all([
        apiClient.get(`/api/v1/progress/parent/stats/${childId}`,      { params: { from: fromDate, to: toDate } }),
        apiClient.get(`/api/v1/progress/parent/engagement/${childId}`, { params: { from: fromDate, to: toDate } }),
        apiClient.get(`/api/v1/progress/parent/attendance/${childId}`, { params: { from: fromDate, to: toDate } }),
      ]);
      if (statsRes.data.success) dispatch(setStats(statsRes.data.data));
      if (engRes.data.success)   dispatch(setEngagement(engRes.data.data || []));
      if (attRes.data.success)   dispatch(setAttendance(attRes.data.data));
    } catch {
      dispatch(setError('Failed to load progress data'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const handleUpdateView = () => {
    dispatch(setError(null));

    if (!selectedId) {
      dispatch(setError('Please select a child first.'));
      return;
    }
    if (!from || !to) {
      dispatch(setError('Please select both a from and to date.'));
      return;
    }
    if (from > todayStr || to > todayStr) {
      dispatch(setError('Future dates cannot be selected.'));
      return;
    }
    if (to < from) {
      dispatch(setError('"To" date cannot be earlier than the "From" date.'));
      return;
    }

    setHasViewed(true);
    fetchProgress(selectedId, from, to);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">

      {/* ── Header ── */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Progress Report</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
              Learning & Attendance Overview
            </p>
          </div>

          {/* Child selector pills */}
          <div className="flex flex-wrap gap-2">
            {children.map(child => (
              <button
                key={child.childId}
                onClick={() => dispatch(setSelectedChild(child.childId))}
                className={`px-5 py-2 rounded-full text-sm font-black border transition-all ${
                  selectedId === child.childId
                    ? 'bg-[#06B6D4] text-white border-[#06B6D4] shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-[#06B6D4] hover:text-[#06B6D4]'
                }`}
              >
                {child.name}
              </button>
            ))}
          </div>
        </div>

        {/* Date range */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold text-slate-600">Range:</span>
          <input
            type="date"
            value={from}
            max={todayStr}
            onChange={e => dispatch(setDateRange({ from: e.target.value, to }))}
            className="border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30"
          />
          <span className="text-slate-400 font-bold">to</span>
          <input
            type="date"
            value={to}
            max={todayStr}
            onChange={e => dispatch(setDateRange({ from, to: e.target.value }))}
            className="border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30"
          />
          <button
            onClick={handleUpdateView}
            disabled={loading}
            className="bg-[#06B6D4] hover:bg-[#0891B2] text-white px-6 py-2 rounded-xl text-sm font-black transition-all disabled:opacity-60 shadow-md shadow-cyan-100"
          >
            {loading ? 'Loading…' : 'Update View'}
          </button>
        </div>

        {error && (
          <div className="mt-4 px-4 py-3 bg-rose-50 border border-rose-100 rounded-xl text-sm text-rose-600 font-bold">
            {error}
          </div>
        )}
      </div>

      <main className="max-w-6xl mx-auto px-4 space-y-6">

        {!hasViewed ? (
          /* ── Placeholder until the parent picks a child + range and clicks Update View ── */
          <div className="bg-white rounded-2xl p-16 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center gap-2">
            <p className="text-slate-500 text-sm font-black">
              Select a child and a date range above, then click "Update View" to see progress.
            </p>
          </div>
        ) : (
        <>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Days Present"         value={stats?.daysPresent         ?? '—'} />
          <StatCard label="Activities Completed" value={stats?.activitiesCompleted ?? '—'} />
          <StatCard
            label="Average Performance"
            value={stats?.avgMood ?? '—'}
            sub={
              stats?.avgMood ? (
                <p className="text-[10px] font-bold text-slate-400 mt-1">
                  L1 {stats.level1Percent}% · L2 {stats.level2Percent}% · L3 {stats.level3Percent}% · L4 {stats.level4Percent}%
                </p>
              ) : undefined
            }
          />
          <StatCard
            label="Meals Eaten"
            value={stats?.mealsProvided ?? '—'}
            sub={
              stats?.mealsProvided ? (
                <p className="text-[10px] font-bold text-slate-400 mt-1">
                  Full {stats.fullMealPercent}% · Partial {stats.partialMealPercent}% · None {stats.noMealPercent}%
                </p>
              ) : undefined
            }
          />
        </div>

        {/* ── Charts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Activity Engagement */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-md">
            <h2 className="text-sm font-black text-slate-800 mb-4">Activity Engagement</h2>
            <ProgressBarChart data={engagement} pageSize={6} />
          </div>

          {/* Attendance Rate */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-md">
            <h2 className="text-sm font-black text-slate-800 mb-4">Attendance Rate</h2>
            {attendance ? (
              <div className="flex-1 flex items-center justify-center">
                <ProgressPieChart attendance={attendance} />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-bold">
                No attendance data for this range
              </div>
            )}
          </div>
        </div>

        </>
        )}

      </main>
    </div>
  );
};

export default ParentProgressPage;
