/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '../utils/cn';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';

// 💡 100% Architecture එකට අනුව Redux Thunks සහ Selectors පාවිච්චි කරමු[cite: 4]
import {
  selectAssignments,
  selectStudentsLogData,
  fetchAssignments,
  selectMasterActivities,
  fetchMasterActivities,
} from '../store/slices/activitySlice';
import { DatePicker } from '../components/common/DatePicker';
import { LogProgressForm } from '../components/activity/LogProgressForm';

const todayString = new Date().toISOString().split('T')[0];

export default function TeacherActivityPage() {
  const dispatch = useAppDispatch();
  const [selectedDate, setSelectedDate] = useState<string>(todayString);

  // 💡 Redux Store එකෙන් ඩේටා ගන්නවා (Architecture Rule: Pages read from Redux)[cite: 4]
  const assignments = useAppSelector(selectAssignments);
  const studentsLogData = useAppSelector(selectStudentsLogData);
  const masterActivities = useAppSelector(selectMasterActivities);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    // 💡 පිටුව ලෝඩ් වෙද්දී Redux Thunks හරහා API Calls යවනවා
    dispatch(fetchAssignments({ date: selectedDate }));
    dispatch(fetchMasterActivities(0));
  }, [dispatch, selectedDate]);

  // 💡 ඩේටා ෆිල්ටර් කිරීම
  const teacherAssignments = assignments.filter((a: any) => {
    const status = String(a.status || '').toUpperCase();

    // 💡 සුපිරිම වෙනස: Admin 'Assign' කරපු ගමන් Teacher ට පෙන්නන්න 'DRAFT' කියන ස්ටේටස් එකත් ඇතුළත් කළා!
    // (මේක නැති නිසා තමයි කලින් Admin අප්ඩේට් කරද්දී Teacher ට පෙනුණේ නැත්තේ)
    const matchesStatus =
      status === 'PUBLISHED' ||
      status === 'ASSIGNED' ||
      status === 'COMPLETED' ||
      status === 'DRAFT';

    const dateStr = String(a.date || a.assignedDate || '');
    const matchesDate = !a.date || dateStr.startsWith(selectedDate);

    return matchesStatus && matchesDate;
  });

  const totalTasks = teacherAssignments.length;
  const pendingTasks = teacherAssignments.filter(
    (a: any) => String(a.status || '').toUpperCase() !== 'COMPLETED',
  ).length;

  const formatCategory = (cat: string) => {
    if (!cat || cat === 'N/A') return 'UNCATEGORIZED';
    return cat.replace(/_/g, ' ');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Activities</h1>
        </div>
        <div>
          <DatePicker
            value={selectedDate}
            onChange={(date) => {
              if (date) setSelectedDate(date);
            }}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
            Today's Tasks
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-800">{totalTasks}</span>
            <span className="text-sm font-semibold text-slate-500">Assigned</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
            Pending Actions
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-primary-600">{pendingTasks}</span>
            <span className="text-sm font-semibold text-primary-600/80">Remaining</span>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-3 animate-fadeUp">
        {teacherAssignments.length === 0 ? (
          <div className="text-center py-10 bg-white border border-slate-200 rounded-xl text-sm text-slate-500 font-bold shadow-sm">
            No activities scheduled for this date.
          </div>
        ) : (
          teacherAssignments.map((assignment: any) => {
            const isCompleted = String(assignment.status || '').toUpperCase() === 'COMPLETED';
            const assignId = assignment.id || assignment.assignmentId;
            const isExpanded = expandedId === assignId;

            // 💡 Activity Category එක Master Activities වලින් හොයාගැනීම
            const activityId = assignment.activity?.id || assignment.activityId;
            const matchedMasterActivity = masterActivities.find((ma: any) => ma.id === activityId);
            const finalCategory =
              matchedMasterActivity?.category ||
              assignment.activity?.category ||
              assignment.category ||
              'N/A';

            return (
              <div
                key={assignId}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-primary-700 bg-primary-50 border border-primary-100 px-2.5 py-0.5 rounded-full tracking-wider">
                      {formatCategory(finalCategory)}
                    </span>
                    <h2 className="text-lg font-bold text-slate-800 mt-2.5 leading-tight">
                      {assignment.activity?.name || 'Unknown Activity'}
                    </h2>
                    <p className="text-sm font-semibold text-slate-500 mt-1">
                      {assignment.startTime?.slice(0, 5)} - {assignment.endTime?.slice(0, 5)}
                    </p>
                  </div>

                  <div className="shrink-0">
                    {isCompleted ? (
                      <span className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold rounded-lg text-sm shadow-sm">
                        Completed
                      </span>
                    ) : (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : assignId)}
                        className={cn(
                          'px-5 py-2.5 text-sm font-bold rounded-lg transition-colors w-full sm:w-auto shadow-sm',
                          isExpanded
                            ? 'bg-white hover:bg-slate-50 text-slate-600 border-2 border-slate-200'
                            : 'bg-primary-500 hover:bg-primary-600 text-white',
                        )}
                      >
                        {isExpanded ? 'Close Form' : 'Log Progress'}
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && !isCompleted && (
                  <div className="mt-5 pt-5 border-t border-slate-100 animate-fadeUp">
                    <LogProgressForm
                      assignmentId={assignId}
                      initialData={studentsLogData ? studentsLogData[assignId] || [] : []}
                      onClose={() => setExpandedId(null)}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
