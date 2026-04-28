/**
 * Admin Progress Page (Smart Component)
 * Reads state from Redux and dispatches actions
 * Uses dumb components for chart rendering
 */

import React, { useEffect, useState } from 'react';
import { ProgressBarChart, ProgressPieChart, DailyProgressStackedBarChart } from '@/components/progress';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { cn } from '@/utils/cn';
import {
  fetchProgressData,
  fetchDailyActivities,
  fetchDailyProgress,
  setSelectedChild,
  setDateRange,
  setShowReport,
  setCurrentPage,
  setErrorMessage,
} from '@/store/slices/progressSlice';

const getLocalDateStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const todayObj = new Date();
const todayStr = getLocalDateStr(todayObj);
const yesterdayObj = new Date();
yesterdayObj.setDate(yesterdayObj.getDate() - 1);
const yesterdayStr = getLocalDateStr(yesterdayObj);

export function AdminProgressPage() {
  const dispatch = useAppDispatch();
  const {
    childrenData,
    dailyActivities,
    dailyProgressData,
    selectedChildId,
    dateRange,
    showReport,
    currentPage,
    errorMessage,
    loading,
  } = useAppSelector((state: any) => state.progress);

  const daysPerPage = 7;

  // Fetch children data on mount
  useEffect(() => {
    dispatch(fetchProgressData());
    dispatch(fetchDailyProgress(todayStr));
  }, [dispatch]);

  const handleDailyDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    if (!selectedDate) {
      return;
    }
    if (selectedDate > todayStr) {
      alert('Invalid Date Selected. Please choose today or a previous date to view progress.');
      return;
    }
    dispatch(fetchDailyActivities({ childId: selectedChildId || '', date: selectedDate }));
    dispatch(fetchDailyProgress(selectedDate));
  };

  const handleDateRangeChange = (field: 'from' | 'to', maxDate: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedDate = e.target.value;
      if (!selectedDate) {
        dispatch(setDateRange({ from: field === 'from' ? '' : dateRange.from, to: field === 'to' ? '' : dateRange.to }));
        dispatch(setErrorMessage(''));
        dispatch(setShowReport(false));
        return;
      }
      if (selectedDate > maxDate) {
        alert('Invalid Date Selected. Please choose a valid allowed date.');
        return;
      }
      dispatch(
        setDateRange({
          from: field === 'from' ? selectedDate : dateRange.from,
          to: field === 'to' ? selectedDate : dateRange.to,
        })
      );
      dispatch(setErrorMessage(''));
      dispatch(setShowReport(false));
    };

  const currentChild = selectedChildId ? childrenData[selectedChildId] : null;

  const getAttendancePercentage = () => {
    if (!currentChild || currentChild.totalDays === 0) return '0.0';
    return ((currentChild.attendance / currentChild.totalDays) * 100).toFixed(1);
  };

  const getDatesInRange = (start: string, end: string) => {
    const dates = [];
    let curr = new Date(start);
    const stop = new Date(end);
    while (curr <= stop) {
      dates.push(curr.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }));
      curr = new Date(curr.getTime() + 24 * 60 * 60 * 1000);
    }
    return dates;
  };

  const allDatesInRange =
    dateRange.from && dateRange.to && showReport ? getDatesInRange(dateRange.from, dateRange.to) : [];
  const startIndex = currentPage * daysPerPage;
  const visibleLabels = allDatesInRange.slice(startIndex, startIndex + daysPerPage);

  const visibleData =
    currentChild && visibleLabels.length > 0
      ? visibleLabels.map((_, idx) => {
          const seedValue = currentChild.engagement[idx % currentChild.engagement.length] || 0;
          return seedValue > 0 ? seedValue : 8 + (idx % 12);
        })
      : [];


  const engagementData =
    currentChild && visibleLabels.length > 0
      ? visibleLabels.map((label, i) => ({ name: label, value: visibleData[i] }))
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, i) => ({
          name: label,
          value: currentChild?.engagement[i] || 0,
        }));

  const pieChartData = currentChild
    ? [
        { name: 'Present', value: currentChild.attendance },
        { name: 'Absent', value: currentChild.totalDays - currentChild.attendance },
      ]
    : [];

  return (
    <div className={cn("relative flex flex-col flex-1 min-h-screen w-full bg-gray-100 dark:bg-slate-900 overflow-x-hidden")}>
      <div className="flex-1 overflow-y-auto w-full flex justify-center">
        <div className="w-full max-w-7xl py-8 px-6 md:px-12 flex flex-col">
          <header className="mb-8">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">📊</span>
              <h1 className="text-2xl text-gray-800 dark:text-white font-bold">Learning Progress</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm ml-9">
              Track Student Development &amp; Analytics
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 md:p-8 shadow-sm flex flex-col justify-center items-center min-h-[400px] h-full w-full">
              <div className="flex justify-between items-center mb-4 w-full">
                <h2 className="text-base font-semibold text-gray-800 dark:text-white">Daily Progress</h2>
                <input
                  type="date"
                  max={todayStr}
                  onChange={handleDailyDateChange}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white rounded-md text-xs outline-none min-w-32"
                />
              </div>
              <div className="min-h-[400px] h-auto flex flex-1 justify-center items-center w-full relative">
                <DailyProgressStackedBarChart data={dailyProgressData} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 md:p-8 shadow-sm flex flex-col justify-center items-center min-h-[400px] h-full w-full">
              <div className="mb-3 w-full">
                <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-1">Daily Activity List</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Activities for {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="flex flex-col w-full">
                {dailyActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className={`p-4 ${index < dailyActivities.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
                  >
                    <div className="font-bold text-sm text-gray-800 dark:text-white mb-3">{activity.title}</div>
                    <div className="grid grid-cols-3 gap-4 items-start">
                      <div className="flex flex-col text-sm text-gray-700 dark:text-gray-300 gap-1">
                        <div className="flex items-center gap-1">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>{' '}
                          {activity.time}
                        </div>
                      </div>
                      <div className="flex flex-col text-sm text-gray-700 dark:text-gray-300 gap-1">
                        <span>Teacher: {activity.teacher}</span>
                        <span className="text-gray-500">{activity.role}</span>
                      </div>
                      <div className="flex flex-col text-sm text-gray-700 dark:text-gray-300 gap-1">
                        <span>{activity.studentsParticipated} Students</span>
                        <span className="text-gray-500">Participated</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-3 text-red-600 bg-red-100 p-3 rounded-md border-l-4 border-red-500 text-sm">
              {errorMessage}
            </div>
          )}

          <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-5 flex-wrap">
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <label className="text-sm text-gray-800 dark:text-white font-semibold">Child Name:</label>
                <select
                  value={selectedChildId}
                  onChange={(e) => dispatch(setSelectedChild(e.target.value))}
                  className="px-4 py-2.5 border border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white rounded-md outline-none min-w-48 w-full md:w-auto"
                >
                  <option value="" disabled>
                    Select a child
                  </option>
                  {Object.keys(childrenData).map((id) => (
                    <option key={id} value={id}>
                      {childrenData[id].name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2 w-full md:w-auto">
                <label className="text-sm text-gray-800 dark:text-white font-semibold">From:</label>
                <input
                  type="date"
                  max={yesterdayStr}
                  value={dateRange.from}
                  onChange={handleDateRangeChange('from', yesterdayStr)}
                  className="px-4 py-2.5 border border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white rounded-md outline-none min-w-48 w-full md:w-auto"
                />
              </div>

              <div className="flex flex-col gap-2 w-full md:w-auto">
                <label className="text-sm text-gray-800 dark:text-white font-semibold">To:</label>
                <input
                  type="date"
                  max={todayStr}
                  value={dateRange.to}
                  onChange={handleDateRangeChange('to', todayStr)}
                  className="px-4 py-2.5 border border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white rounded-md outline-none min-w-48 w-full md:w-auto"
                />
              </div>

              <button
                onClick={() => {
                  if (!selectedChildId) {
                    dispatch(setErrorMessage('Please select a child to view their specific report.'));
                    dispatch(setShowReport(false));
                    return;
                  }
                  const fromDate = new Date(dateRange.from);
                  const toDate = new Date(dateRange.to);
                  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
                    dispatch(setErrorMessage('Please provide valid From and To dates.'));
                    dispatch(setShowReport(false));
                    return;
                  }
                  if (toDate < fromDate) {
                    dispatch(setErrorMessage('To date must be the same or after the From date.'));
                    dispatch(setShowReport(false));
                    return;
                  }
                  dispatch(setErrorMessage(''));
                  dispatch(setShowReport(true));
                }}
                className="px-6 py-2.5 bg-emerald-500 text-white border-none rounded-md font-semibold cursor-pointer hover:bg-emerald-600 transition-colors w-full md:w-auto md:ml-auto"
              >
                View Report
              </button>
            </div>
          </div>

          {showReport ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 md:p-8 shadow-sm flex flex-col justify-center items-center min-h-[400px] h-full w-full">
                <div className="flex justify-between items-center mb-2 w-full flex-wrap gap-2">
                  <h2 className="text-base font-semibold text-gray-800 dark:text-white">
                    Activity Engagement - {currentChild?.name || 'Select a child'}
                  </h2>
                  {allDatesInRange.length > daysPerPage && (
                    <div className="flex items-center gap-4">
                      <button
                        className="bg-teal-500 text-white border-none rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => dispatch(setCurrentPage(Math.max(0, currentPage - 1)))}
                        disabled={currentPage === 0}
                      >
                        {' '}
                        ❮{' '}
                      </button>
                      <span className="text-sm font-semibold text-teal-500">
                        {startIndex + 1} - {Math.min(startIndex + daysPerPage, allDatesInRange.length)} of{' '}
                        {allDatesInRange.length} Days
                      </span>
                      <button
                        className="bg-teal-500 text-white border-none rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => dispatch(setCurrentPage(currentPage + 1))}
                        disabled={startIndex + daysPerPage >= allDatesInRange.length}
                      >
                        {' '}
                        ❯{' '}
                      </button>
                    </div>
                  )}
                </div>
                <div className="min-h-[400px] h-auto flex flex-1 justify-center items-center w-full relative">
                  <ProgressBarChart data={engagementData} />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 md:p-8 shadow-sm flex flex-col justify-center items-center min-h-[400px] h-full w-full">
                <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4 w-full">
                  Attendance Rate - {currentChild?.name || 'Select a child'}
                </h2>
                <div className="min-h-[400px] h-auto flex flex-1 justify-center items-center relative w-full">
                  <ProgressPieChart data={pieChartData} />
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-bold text-gray-800 dark:text-white">
                      {getAttendancePercentage()}%
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Present</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-5xl mb-4 opacity-50">📊</div>
              <h3 className="text-xl text-gray-800 dark:text-white mb-2">No Report Selected</h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-md">
                Please select a child's name and a valid date range from the filters above, then click <b>View Report</b> to
                generate their progress analytics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
