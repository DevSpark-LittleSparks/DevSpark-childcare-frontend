import { useEffect } from 'react';
import { isToday, parseISO } from 'date-fns';
import { Edit3 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchAttendanceByDate,
  selectSelectedDate,
  setSelectedDate,
  selectAttendanceLoading,
  selectIsEditMode,
  toggleEditMode,
  setEditMode,
} from '../store/slices/attendanceSlice';
import { AttendanceForm } from '../components/attendance/AttendanceForm';
import { DatePicker } from '../components/common/DatePicker';

export default function AttendancePage() {
  const dispatch = useAppDispatch();
  const selectedDate = useAppSelector(selectSelectedDate);
  const isLoading = useAppSelector(selectAttendanceLoading);
  const isEditMode = useAppSelector(selectIsEditMode);

  useEffect(() => {
    if (!selectedDate) return;

    dispatch(fetchAttendanceByDate(selectedDate));

    // Check if the selected date is today and toggle edit mode accordingly
    if (isToday(parseISO(selectedDate))) {
      // TEMPORARY: Comment out the backend fetch for UI testing
      dispatch(setEditMode(true));
    } else {
      dispatch(setEditMode(false));
    }
  }, [dispatch, selectedDate]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Daily Attendance</h1>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-4">
            {!isEditMode && (
              <button
                onClick={() => dispatch(toggleEditMode())}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-primary-600 bg-white border-2 border-primary-100 rounded-lg hover:bg-primary-50 transition-colors shadow-sm"
              >
                <Edit3 className="w-4 h-4" /> Edit Records
              </button>
            )}

            <DatePicker
              value={selectedDate}
              onChange={(newDate: string) => dispatch(setSelectedDate(newDate))}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <AttendanceForm />
      )}
    </div>
  );
}
