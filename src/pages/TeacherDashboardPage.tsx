/**
 * Teacher Dashboard Page (Smart Component)
 * Reads state from Redux and dispatches actions
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchTeacherDashboard,
  fetchActivityLogs,
  setShowFullSchedule,
  setSearchQuery,
  setShowSearch,
  setShowFilterMenu,
  setSortOption,
  setActiveFilter,
  setShowAllLogs,
  setCurrentPage,
  resetFilters,
} from '@/store/slices/teacherSlice';
import { getScheduleIcon, getLogIcon } from '@/utils/iconMapping';

export function TeacherDashboardPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    scheduleData,
    logsData,
    classStatus,
    safetyAlerts,
    parentComms,
    teacherProfile,
    showFullSchedule,
    searchQuery,
    showSearch,
    showFilterMenu,
    sortOption,
    activeFilter,
    showAllLogs,
    currentPage,
  } = useAppSelector((state) => state.teacher);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchTeacherDashboard());
  }, [dispatch]);

  // Fetch logs when filters change
  useEffect(() => {
    dispatch(
      fetchActivityLogs({
        searchQuery,
        activeFilter,
        sortOption,
      })
    );
  }, [searchQuery, activeFilter, sortOption, dispatch]);

  const toggleFilterMenu = () => {
    dispatch(setShowFilterMenu(!showFilterMenu));
    if (showSearch) dispatch(setShowSearch(false));
  };

  const toggleSearch = () => {
    dispatch(setShowSearch(!showSearch));
    if (showFilterMenu) dispatch(setShowFilterMenu(false));
  };

  const displayedSchedule = showFullSchedule ? scheduleData : scheduleData.slice(0, 3);
  const displayedLogs = showAllLogs ? logsData : logsData.slice(0, 3);
  const attendanceProgress = Math.min(100, Math.max(0, classStatus.attendance));

  return (
    <div className={cn("relative flex flex-col flex-1 min-h-screen w-full bg-gray-50 dark:bg-slate-900 overflow-x-hidden")}>
      <main className="flex-1 py-8 px-4 md:px-10 flex flex-col gap-6 w-full max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2 w-full">
          <div className="greeting">
            <h1 className="text-2xl text-gray-800 dark:text-white font-extrabold mb-1.5">
              Welcome back, {teacherProfile.name}!
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 align-text-bottom inline"
              >
                <path
                  d="M12.44 2.87a2.25 2.25 0 0 0-3.18 0L3.6 8.52a2.25 2.25 0 0 0 0 3.18l6.19 6.19c.88.88 2.3.88 3.18 0l8.11-8.11a2.25 2.25 0 0 0 0-3.18l-8.64-3.73z"
                  className="fill-yellow-300"
                />
                <path
                  d="M14.56 1.81a2.25 2.25 0 0 0-3.18 0l-1.06 1.06 3.18 3.18 1.06-1.06a2.25 2.25 0 0 0 0-3.18z"
                  className="fill-yellow-500"
                />
                <path
                  d="M6 14s1 2 3 2 3-2 3-2"
                  className="stroke-amber-700"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M22 17c-1.5 2-4 3-7 3s-5.5-1-7-3"
                  className="stroke-slate-400"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="2 4"
                />
                <path
                  d="M20 14c-1 1-2.5 1.5-4 1.5"
                  className="stroke-slate-400"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm font-semibold">
              Your classroom "{teacherProfile.classroom}" is looking busy today.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 items-center w-full sm:w-auto">
            <button
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition-all shrink-0"
              aria-label="notifications"
              onClick={() => navigate('/teacher/messages')}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-yellow-500"
              >
                <path
                  d="M12 2C10.3431 2 9 3.34315 9 5C9 5.61748 9.18697 6.19128 9.50504 6.67499C8.03158 7.64333 7 9.30906 7 11.2353V15.2941C7 16.3268 6.68069 17.3338 6.0963 18.1724C5.59021 18.8986 6.12604 20 7.00508 20H16.9949C17.874 20 18.4098 18.8986 17.9037 18.1724C17.3193 17.3338 17 16.3268 17 15.2941V11.2353C17 9.30906 15.9684 7.64333 14.495 6.67499C14.813 6.19128 15 5.61748 15 5C15 3.34315 13.6569 2 12 2Z"
                  fill="currentColor"
                />
                <path
                  d="M10 21H14C14 22.1046 13.1046 23 12 23C10.8954 23 10 22.1046 10 21Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <button
              className="bg-cyan-400 text-white border-none px-5 py-2.5 rounded-3xl font-bold text-sm cursor-pointer shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 flex-1 sm:flex-none text-center"
              onClick={() => navigate('/teacher/activities')}
            >
              Quick Log
            </button>
          </div>
        </header>

        <div className="flex flex-col gap-6">
          {/* Top Row Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Class Status */}
            {/* Class Status */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 flex flex-col border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                  <h3 className="text-lg font-extrabold text-gray-800 dark:text-white">Class Status</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Live attendance overview</p>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                    LIVE
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-4">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  {/* SVG Progress Ring */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-100 dark:text-slate-700"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={301.6}
                      strokeDashoffset={301.6 * (1 - attendanceProgress / 100)}
                      strokeLinecap="round"
                      fill="transparent"
                      className="text-cyan-400 transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn(
                      "text-3xl font-black leading-none",
                      attendanceProgress >= 80 ? "text-cyan-500" : "text-gray-800 dark:text-white"
                    )}>
                      {classStatus.checkedIn}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter mt-1">
                      Present
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 flex-1 w-full sm:w-auto">
                  <div className="flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center">
                        <span className="text-cyan-500 text-xs font-bold">{classStatus.checkedIn}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Checked-in</span>
                    </div>
                    <span className="text-xs font-black text-cyan-500">{attendanceProgress}%</span>
                  </div>

                  <div className="flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-slate-700 flex items-center justify-center text-gray-400">
                        <span className="text-xs font-bold">{classStatus.expected}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Expected</span>
                    </div>
                    <span className="text-xs font-black text-gray-400">{100 - attendanceProgress}%</span>
                  </div>

                  <div className="mt-2 h-1.5 w-full bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-right from-cyan-400 to-blue-500 transition-all duration-1000"
                      style={{ width: `${attendanceProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Alerts */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 flex flex-col border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                  <h3 className="text-lg font-extrabold text-gray-800 dark:text-white">Safety Alerts</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Critical updates needed</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="animate-bounce"
                  >
                    <path
                      d="M12 2L2 21H22L12 2Z"
                      className="fill-yellow-400 stroke-yellow-400"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path d="M12 9V14" className="stroke-amber-700" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="18" r="1" className="fill-amber-700" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {safetyAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={cn(
                      'p-4 rounded-xl text-sm font-bold flex items-start gap-3 transition-all hover:translate-x-1',
                      alert.colorType === 'orange'
                        ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-l-4 border-orange-500'
                        : 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-300 border-l-4 border-cyan-400'
                    )}
                  >
                    <span
                      className={cn(
                        'w-2 h-2 rounded-full mt-1.5 shrink-0',
                        alert.colorType === 'orange' ? 'bg-orange-500' : 'bg-cyan-400'
                      )}
                    ></span>
                    <span className="leading-tight">{alert.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Parent Comms */}
            {/* Parent Comms */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 flex flex-col border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                  <h3 className="text-lg font-extrabold text-gray-800 dark:text-white">Parent Comms</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Recent incoming messages</p>
                </div>
                <span className="bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 text-[10px] font-black px-2.5 py-1 rounded-md uppercase">
                  {parentComms.length} NEW
                </span>
              </div>
              <div className="flex flex-col gap-5">
                {parentComms.map((comm) => (
                  <div className="flex gap-4 items-start group cursor-pointer" key={comm.id}>
                    <div
                      className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-sm shadow-sm group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: comm.avatarBg }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="16" cy="16" r="16" fill={comm.avatarBg} />
                        <circle cx="16" cy="12" r="6" fill={comm.avatarFill} />
                        <path
                          d="M8 26C8 22.6863 10.6863 20 14 20H18C21.3137 20 24 22.6863 24 26C24 28.2091 22.2091 30 20 30H12C9.79086 30 8 28.2091 8 26Z"
                          fill={comm.avatarFill}
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <div className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-wider mb-1 truncate max-w-full">
                        {comm.parentName}
                      </div>
                      <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 line-clamp-2 leading-snug group-hover:text-cyan-500 transition-colors">
                        {comm.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Schedule */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 flex flex-col self-start">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-gray-800 dark:text-white">Upcoming Activities</h3>
                <span
                  className="text-cyan-500 text-sm font-bold cursor-pointer"
                  onClick={() => dispatch(setShowFullSchedule(!showFullSchedule))}
                >
                  {showFullSchedule ? 'Show Less' : 'Full Schedule'}
                </span>
              </div>
              <div className={cn('flex flex-col gap-5 relative', showFullSchedule ? 'max-h-64 overflow-y-auto pr-2' : '')}>
                {displayedSchedule.length > 0 && (
                  <div className="absolute top-5 bottom-5 left-5 w-0.5 bg-gray-200 z-0"></div>
                )}
                {displayedSchedule.map((item) => (
                  <div className="flex gap-4 relative z-10" key={item.id}>
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center text-lg bg-white dark:bg-slate-800 border-2 border-white shadow-sm',
                        item.colorType === 'blue'
                          ? 'bg-blue-50'
                          : item.colorType === 'orange'
                            ? 'bg-orange-50'
                            : 'bg-purple-50'
                      )}
                    >
                      {getScheduleIcon(item.icon)}
                    </div>
                    <div className="flex flex-col pt-1 min-w-0 flex-1">
                      <span
                        className={cn(
                          'text-xs font-extrabold uppercase tracking-wide',
                          item.colorType === 'blue'
                            ? 'text-cyan-400'
                            : item.colorType === 'orange'
                              ? 'text-orange-500'
                              : 'text-purple-500'
                        )}
                      >
                        {item.time}
                      </span>
                      <span className="text-base text-gray-800 dark:text-white font-bold mt-1 truncate">{item.title}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300 font-semibold mt-1 truncate">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Logs */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-gray-800 dark:text-white">Recent Activity Logs</h3>
                <div className="flex gap-3 text-gray-600 dark:text-gray-300 cursor-pointer relative">
                  <span
                    role="img"
                    aria-label="filter"
                    onClick={toggleFilterMenu}
                    className="flex items-center justify-center"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-slate-500"
                    >
                      <path
                        d="M4 6H20M4 12H16M4 18H12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span
                    role="img"
                    aria-label="search"
                    onClick={toggleSearch}
                    className="flex items-center justify-center"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="11"
                        cy="11"
                        r="8"
                        className="stroke-sky-400"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16.5 16.5L22 22"
                        className="stroke-indigo-500"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  {showFilterMenu && (
                    <div className="absolute top-6 right-0 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg p-3 w-48 z-50 text-left">
                      <h4 className="text-xs text-gray-600 dark:text-gray-300 mb-1.5 mt-2.5 uppercase tracking-wide first:mt-0">
                        Sort By
                      </h4>
                      <ul className="list-none p-0 m-0">
                        {['Time (Newest)', 'Time (Oldest)', 'Name (A-Z)'].map((opt) => (
                          <li
                            key={opt}
                            className={cn(
                              'text-sm text-gray-800 dark:text-white px-2 py-1.5 rounded-md cursor-pointer font-semibold',
                              sortOption === opt ? 'bg-blue-50 text-cyan-500' : 'hover:bg-gray-50 dark:bg-slate-900'
                            )}
                            onClick={() => {
                              dispatch(setSortOption(opt));
                              dispatch(setShowFilterMenu(false));
                            }}
                          >
                            {opt}
                          </li>
                        ))}
                      </ul>
                      <h4 className="text-xs text-gray-600 dark:text-gray-300 mb-1.5 mt-4 uppercase tracking-wide">
                        Filter By
                      </h4>
                      <ul className="list-none p-0 m-0">
                        {['All', 'Meals', 'Activity'].map((filter) => (
                          <li
                            key={filter}
                            className={cn(
                              'text-sm text-gray-800 dark:text-white px-2 py-1.5 rounded-md cursor-pointer font-semibold',
                              activeFilter === filter ? 'bg-blue-50 text-cyan-500' : 'hover:bg-gray-50 dark:bg-slate-900'
                            )}
                            onClick={() => {
                              dispatch(setActiveFilter(filter));
                              dispatch(setShowFilterMenu(false));
                              dispatch(setShowAllLogs(true));
                            }}
                          >
                            {filter}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {showSearch && (
                <div className="px-5 pb-4 relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search by student, tag, or word..."
                    value={searchQuery}
                    onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-white focus:border-cyan-500"
                    autoFocus
                  />
                  <span
                    className="absolute right-7 text-xs text-gray-600 dark:text-gray-300 cursor-pointer"
                    onClick={() => {
                      dispatch(setSearchQuery(''));
                      dispatch(setShowSearch(false));
                    }}
                  >
                    ✖
                  </span>
                </div>
              )}

              <div className={cn('relative flex flex-col gap-4 overflow-x-hidden', showAllLogs ? 'max-h-80 overflow-y-auto pr-2' : '')}>
                {showAllLogs && logsData.length > 0 && (
                  <div className="absolute top-5 bottom-5 left-5 w-0.5 bg-gray-200 z-0"></div>
                )}
                {!showAllLogs && displayedLogs.length > 0 && (
                  <div className="absolute top-5 bottom-5 left-5 w-0.5 bg-gray-200 z-0"></div>
                )}
                {displayedLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="text-3xl mb-3 opacity-80">📭</div>
                    <p className="text-base font-bold text-gray-800 dark:text-white mb-2">No activity logs found.</p>
                    <span
                      className="text-sm text-cyan-500 font-bold cursor-pointer underline"
                      onClick={() => dispatch(resetFilters())}
                    >
                      Reset Search & Filters
                    </span>
                  </div>
                ) : (
                  displayedLogs.map((log) => (
                    <div
                      className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-3xl px-4 py-3 flex items-center gap-4 relative z-10 w-full"
                      key={log.id}
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-cyan-400 text-white rounded-full flex items-center justify-center text-sm font-extrabold shadow-sm">
                        ✓
                      </div>
                      <div className="flex-shrink-0 text-lg flex items-center justify-center w-5" style={{ color: log.iconColor }}>
                        {getLogIcon(log.icon)}
                      </div>
                      
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex justify-between items-center gap-2 w-full">
                          <span className="font-extrabold text-sm text-gray-800 dark:text-white truncate">
                            {log.studentName}
                          </span>
                          <span className="text-xs font-black text-gray-400 flex-shrink-0">
                            {log.time}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 font-semibold truncate leading-relaxed">
                          {log.actionText}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="text-center pt-4 mt-2 border-t border-gray-200 dark:border-gray-700">
                <span
                  className="text-gray-600 dark:text-gray-300 cursor-pointer"
                  onClick={() => dispatch(setShowAllLogs(!showAllLogs))}
                >
                  {showAllLogs ? 'View Less Logs ↑' : "View All Today's Logs →"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
