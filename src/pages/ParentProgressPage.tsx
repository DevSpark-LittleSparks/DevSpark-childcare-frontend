/**
 * Parent Progress Page (Smart Component)
 * Reads state from Redux and dispatches actions
 * Uses dumb components for chart rendering and chatbot
 */

import React, { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { ProgressBarChart, ProgressPieChart } from '@/components/progress';
import { ParentHelpChatbot } from '@/components/chatbot/ParentHelpChatbot';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchProgressData,
  setSelectedChild,
  setDateRange,
  setShowReport,
  setCurrentPage,
} from '@/store/slices/progressSlice';
import {
  setIsOpen,
  toggleChatbot,
  setInputValue,
  addMessage,
  sendChatbotMessage,
  fetchFaqData,
} from '@/store/slices/chatbotSlice';

const todayObj = new Date();
const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;
const yesterdayObj = new Date(todayObj);
yesterdayObj.setDate(yesterdayObj.getDate() - 1);
const yesterdayStr = `${yesterdayObj.getFullYear()}-${String(yesterdayObj.getMonth() + 1).padStart(2, '0')}-${String(yesterdayObj.getDate()).padStart(2, '0')}`;

const MOCK_PARENT_PROFILE = {
  name: 'Sarah Johnson',
};

export function ParentProgressPage() {
  const dispatch = useAppDispatch();
  const progressState = useAppSelector((state) => state.progress);
  const chatbotState = useAppSelector((state) => state.chatbot);
  const [currentPage, setCurrentPageLocal] = useState(0);

  const daysPerPage = 7;

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchProgressData());
    dispatch(fetchFaqData());
  }, [dispatch]);

  const handleDateChange = (setter: string, maxDate: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    if (!selectedDate) {
      if (setter === 'from') {
        dispatch(setDateRange({ from: '', to: progressState.dateRange.to }));
      } else {
        dispatch(setDateRange({ from: progressState.dateRange.from, to: '' }));
      }
      return;
    }
    if (selectedDate > maxDate) {
      alert('Invalid Date Selected. Please choose a valid allowed date.');
      return;
    }
    if (setter === 'from') {
      dispatch(setDateRange({ from: selectedDate, to: progressState.dateRange.to }));
    } else {
      dispatch(setDateRange({ from: progressState.dateRange.from, to: selectedDate }));
    }
  };

  const currentChild = progressState.selectedChildId
    ? progressState.childrenData[progressState.selectedChildId]
    : null;

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
    progressState.dateRange.from && progressState.dateRange.to
      ? getDatesInRange(progressState.dateRange.from, progressState.dateRange.to)
      : [];

  const handleUpdateView = () => {
    if (!progressState.selectedChildId) {
      alert('Please select a child first!');
      return;
    }
    if (!progressState.dateRange.from || !progressState.dateRange.to) {
      alert('Please select both Start and End dates first!');
      return;
    }
    const start = new Date(progressState.dateRange.from);
    const end = new Date(progressState.dateRange.to);
    if (start >= end) {
      alert('Invalid Date Range: Please select valid range!');
      dispatch(setShowReport(false));
      return;
    }
    setCurrentPageLocal(0);
    dispatch(setShowReport(true));
  };

  const getAttendancePercentage = () => {
    if (!currentChild || currentChild.totalDays === 0) return '0.0';
    return ((currentChild.attendance / currentChild.totalDays) * 100).toFixed(1);
  };

  const startIndex = currentPage * daysPerPage;
  const visibleLabels = allDatesInRange.slice(startIndex, startIndex + daysPerPage);

  const visibleData = visibleLabels.map((_, idx) => {
    return currentChild?.engagement[(startIndex + idx) % currentChild.engagement.length] || 0;
  });

  const handleSendChatbotMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user' as const,
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    dispatch(addMessage(userMsg));

    // Dispatch async thunk to get bot response
    dispatch(sendChatbotMessage(text));
  };

  return (
    <div className={cn("relative flex flex-col flex-1 min-h-screen w-full bg-gray-50 dark:bg-slate-900 overflow-x-hidden")}>
      <main className="flex-1 p-4 md:p-8 text-left max-w-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="greeting">
            <h1 className="text-2xl text-gray-800 dark:text-white font-extrabold">
              Welcome back, {MOCK_PARENT_PROFILE.name}!
            </h1>
          </div>
          <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
            {Object.keys(progressState.childrenData).map((id) => (
              <button
                key={id}
                className={cn(
                  'max-w-[140px] min-w-[100px] px-4 py-2 rounded-3xl border-2 border-teal-600 text-teal-600 font-bold cursor-pointer bg-transparent overflow-hidden whitespace-nowrap text-ellipsis text-sm leading-snug',
                  progressState.selectedChildId === id ? 'bg-teal-600 text-white' : ''
                )}
                onClick={() => {
                  dispatch(setSelectedChild(id));
                  dispatch(setShowReport(false));
                  dispatch(setDateRange({ from: '', to: '' }));
                }}
              >
                {progressState.childrenData[id].name}
              </button>
            ))}
          </div>
        </header>

        <section className="main-heading-section mb-6">
          <h1 className="text-gray-900 dark:text-white font-extrabold text-3xl mb-4">Progress Report</h1>
          <div className="date-filter flex flex-col md:flex-row md:items-center gap-3">
            <span className="text-gray-900 dark:text-white font-bold">Range: </span>
            <input
              type="date"
              max={yesterdayStr}
              className="border border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white px-3 py-2 rounded-md text-gray-900 dark:text-white font-semibold w-full md:w-auto"
              value={progressState.dateRange.from}
              onChange={handleDateChange('from', yesterdayStr)}
            />
            <span className="text-gray-900 dark:text-white font-bold text-center md:text-left">to</span>
            <input
              type="date"
              max={todayStr}
              className="border border-gray-300 dark:border-gray-700 dark:bg-slate-800 dark:text-white px-3 py-2 rounded-md text-gray-900 dark:text-white font-semibold w-full md:w-auto"
              value={progressState.dateRange.to}
              onChange={handleDateChange('to', todayStr)}
            />
            <button
              className="bg-cyan-400 text-white border-none px-5 py-2.5 rounded-lg cursor-pointer font-bold w-full md:w-auto md:ml-4"
              onClick={handleUpdateView}
            >
              Update View
            </button>
          </div>
        </section>

        {!progressState.selectedChildId ? (
          <div className="py-24 text-center text-teal-600 border-2 border-dashed border-teal-600 rounded-3xl bg-white dark:bg-slate-800 mt-5">
            <div className="text-5xl mb-3">👶</div>
            <p className="text-gray-700 dark:text-gray-300 font-semibold">
              Please select a child to view their progress report.
            </p>
          </div>
        ) : !progressState.showReport ? (
          <div className="py-24 text-center text-teal-600 border-2 border-dashed border-teal-600 rounded-3xl bg-white dark:bg-slate-800 mt-5">
            <div className="text-5xl mb-3">📊</div>
            <p className="text-gray-700 dark:text-gray-300 font-semibold">
              Select a date range and click <b>Update View</b> to see {currentChild?.name || 'your child'}'s report.
            </p>
          </div>
        ) : (
          <div className="mt-12">
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row gap-5 mb-8">
              {[
                { label: 'Days Present', value: currentChild?.attendance || 0, icon: '📅' },
                { label: 'Activities Completed', value: currentChild?.activities || 0, icon: '🎨' },
                { label: 'Avg Mood', value: currentChild?.mood || '😊', icon: '✨' },
                { label: 'Meals Provided', value: currentChild?.meals || 0, icon: '🍎' },
              ].map((stat, idx) => (
                <div 
                  key={idx}
                  className="flex-1 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-gray-500 dark:text-gray-400 font-black text-[10px] uppercase tracking-widest">{stat.label}</p>
                    <span className="text-lg opacity-0 group-hover:opacity-100 transition-opacity">{stat.icon}</span>
                  </div>
                  <h2 className="text-teal-600 dark:text-teal-400 text-4xl font-black tracking-tight">{stat.value}</h2>
                  <div className="mt-4 h-1 w-8 bg-teal-600/20 dark:bg-teal-400/20 rounded-full group-hover:w-full transition-all duration-500"></div>
                </div>
              ))}
            </section>

            <section className="flex flex-col lg:flex-row gap-5">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-4">Activity Engagement</h3>
                  <div className="flex items-center gap-3">
                    <button
                      className="bg-teal-600 text-white border-none w-7 h-7 rounded-full flex items-center justify-center cursor-pointer text-xs hover:opacity-80 transition-opacity"
                      onClick={() => setCurrentPageLocal(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                    >
                      {' '}
                      ❮{' '}
                    </button>
                    <span className="text-sm font-bold text-teal-600">
                      {startIndex + 1} - {Math.min(startIndex + daysPerPage, allDatesInRange.length)} of{' '}
                      {allDatesInRange.length} Days
                    </span>
                    <button
                      className="bg-teal-600 text-white border-none w-7 h-7 rounded-full flex items-center justify-center cursor-pointer text-xs hover:opacity-80 transition-opacity"
                      onClick={() => setCurrentPageLocal(currentPage + 1)}
                      disabled={startIndex + daysPerPage >= allDatesInRange.length}
                    >
                      {' '}
                      ❯{' '}
                    </button>
                  </div>
                </div>
                <div className="relative h-72 w-full">
                  <ProgressBarChart
                    data={visibleLabels.map((label, i) => ({ name: label, value: visibleData[i] }))}
                  />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-4">Attendance Rate</h3>
                <div className="relative h-72 flex justify-center items-center">
                  <ProgressPieChart
                    data={[
                      { name: 'Present', value: parseFloat(getAttendancePercentage()) },
                      { name: 'Absent', value: 100 - parseFloat(getAttendancePercentage()) },
                    ]}
                  />
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl text-gray-900 dark:text-white font-extrabold">
                      {getAttendancePercentage()}%
                    </span>
                    <span className="text-sm text-gray-500">Present</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      <ParentHelpChatbot
        isOpen={chatbotState.isOpen}
        setIsOpen={(open) => dispatch(setIsOpen(open))}
        messages={chatbotState.messages}
        onSendMessage={handleSendChatbotMessage}
        faqData={chatbotState.faqData}
        inputValue={chatbotState.inputValue}
        setInputValue={(value) => dispatch(setInputValue(value))}
        loading={chatbotState.loading}
      />
    </div>
  );
}
