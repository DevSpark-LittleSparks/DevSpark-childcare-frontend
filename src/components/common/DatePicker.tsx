import { useState, useRef, useEffect, ButtonHTMLAttributes } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format,
  parseISO,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isAfter,
  startOfDay,
  isToday,
} from 'date-fns';
import { cn } from '../../utils/cn';

interface DatePickerProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange' | 'value'
> {
  value: string; // Expected format: YYYY-MM-DD
  onChange: (date: string) => void;
  allowFutureDates?: boolean;
}

/**
 * Custom DatePicker Component conforming to DevSpark Frontend Architecture[cite: 7].
 * UI utilizes neutral 'slate' colors entirely for a cohesive and professional appearance.
 */
export function DatePicker({
  value,
  onChange,
  className,
  allowFutureDates = true,
  ...props
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(() =>
    value ? parseISO(value) : new Date(),
  );

  const containerRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside the component boundaries
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayDate = value ? format(parseISO(value), 'EEEE, MMMM dd, yyyy') : 'Select Date';
  const today = startOfDay(new Date());
  const selectedDate = value ? parseISO(value) : null;

  // Generate the calendar grid days utilizing date-fns library
  const firstDayCurrentMonth = startOfMonth(currentMonth);
  const lastDayCurrentMonth = endOfMonth(currentMonth);
  const startDate = startOfWeek(firstDayCurrentMonth);
  const endDate = endOfWeek(lastDayCurrentMonth);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Handles date selection without automatically closing the dropdown popup
  const handleSelectDate = (date: Date) => {
    if (!allowFutureDates && isAfter(startOfDay(date), today)) return;
    onChange(format(date, 'yyyy-MM-dd'));
    // Removed setIsOpen(false) here so the user must explicitly click "Close" or outside
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-block text-left w-full md:w-auto', className)}
    >
      {/* Trigger Button - Unified styling using slate-50 to match the dropdown */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center md:justify-start gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-lg shadow-sm w-full min-w-[260px] hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500/20"
        {...props}
      >
        <CalendarIcon className="w-5 h-5 text-slate-500" />
        <span>{displayDate}</span>
      </button>

      {/* Custom Dropdown Calendar Popup */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 p-4 w-[280px] bg-white rounded-xl shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
          {/* Calendar Header (Month/Year & Navigation) */}
          <div className="flex justify-between items-center mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors focus:outline-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-sm font-bold text-slate-800">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors focus:outline-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week Row */}
          <div className="grid grid-cols-7 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="text-center text-xs font-bold text-slate-400">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isTodayDate = isToday(day);
              const isFuture = !allowFutureDates && isAfter(startOfDay(day), today);

              return (
                <button
                  key={day.toString()}
                  type="button"
                  disabled={isFuture}
                  onClick={() => handleSelectDate(day)}
                  className={cn(
                    'w-8 h-8 flex items-center justify-center rounded-md text-sm transition-all focus:outline-none',
                    // Faded days from previous/next months
                    !isCurrentMonth && 'text-slate-300',
                    // Normal unselected days
                    isCurrentMonth &&
                      !isSelected &&
                      !isFuture &&
                      'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium',
                    // Selected day highlight utilizing Tailwind preset 'slate-800'
                    isSelected && 'bg-slate-800 text-white font-bold shadow-md shadow-slate-800/30',
                    // Current day highlight unified to slate
                    isTodayDate &&
                      !isSelected &&
                      'border border-slate-400 text-slate-700 font-bold bg-slate-50',
                    // Disabled state for future dates
                    isFuture && 'opacity-30 cursor-not-allowed',
                  )}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>

          {/* Footer with Explicit Close Button */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors px-3 py-1.5 rounded-md hover:bg-slate-100"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
