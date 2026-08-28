import { useRef, InputHTMLAttributes } from 'react';
import { Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '../../utils/cn';

interface DatePickerProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> {
  value: string; // Expected format: YYYY-MM-DD
  onChange: (date: string) => void;
  allowFutureDates?: boolean; 
}

export function DatePicker({
  value,
  onChange,
  className,
  allowFutureDates,
  ...props
}: DatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().split('T')[0];
  // Formats the date like: "Monday, May 11, 2026"
  const displayDate = value ? format(parseISO(value), 'EEEE, MMMM dd, yyyy') : 'Select Date';

  const handleCalendarClick = () => {
    if (inputRef.current) {
      inputRef.current.showPicker(); // Opens the native calendar popup reliably
    }
  };

  return (
    <div
      className={cn('relative inline-flex items-center cursor-pointer', className)}
      onClick={handleCalendarClick}
    >
      <div className="flex items-center gap-2 px-5 py-2.5 bg-primary-50 border border-primary-100 text-primary-700 font-semibold rounded-lg shadow-sm w-full min-w-[260px] hover:bg-primary-100 transition-colors pointer-events-none">
        <Calendar className="w-5 h-5" />
        <span>{displayDate}</span>
      </div>

      <input
        ref={inputRef}
        type="date"
        value={value}
        max={allowFutureDates ? undefined : today}
        onChange={(e) => onChange(e.target.value)}
        className="absolute bottom-0 left-0 w-0 h-0 opacity-0 pointer-events-none"
        {...props}
      />
    </div>
  );
}
