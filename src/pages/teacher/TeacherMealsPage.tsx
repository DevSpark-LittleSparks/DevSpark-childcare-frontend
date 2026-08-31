import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Coffee, Utensils, Apple, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import { DatePicker } from '../../components/common/DatePicker';
import { mealService, ConsumptionLogResponse } from '../../services/mealService';
import type { MealMenuResponse } from '../../types/meal.types';

// DevSpark Architecture DTO standard for Child[cite: 8]
interface Child {
  id: string;
  fullName: string;
}

type MealType = 'BREAKFAST' | 'LUNCH' | 'EVENING_SNACK';
type StatusType = 'FULL_MEAL' | 'PARTIAL' | 'ATE_NONE' | 'NOT_LOGGED';

interface MealRecord {
  BREAKFAST?: StatusType;
  LUNCH?: StatusType;
  EVENING_SNACK?: StatusType;
  note?: string;
}

interface ConsumptionPayloadItem {
  childId: string;
  menuId: string;
  mealType: MealType;
  consumptionStatus: StatusType;
  note: string;
  date: string;
}

export default function TeacherMealsPage() {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [todaysMenu, setTodaysMenu] = useState<MealMenuResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 💡 Hardcoded data removed. Empty array placed as a placeholder.
  // TODO: Replace this later with -> const children = useAppSelector(selectChildren);
  const children: Child[] = [];

  // State to hold tracking data with strict typing
  const [trackingData, setTrackingData] = useState<Record<string, MealRecord>>({});

  // Fetch the menu AND existing logs for the selected date (Enables Editing feature for Teachers)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Menu for the selected date
        const menuData = await mealService.getMenuByDate(selectedDate);
        setTodaysMenu(menuData.length > 0 ? menuData[0] : null);

        // 2. Fetch existing consumption logs to allow editing
        const logs = await mealService.getConsumptionLogs(selectedDate);

        // 3. Populate tracking data state with existing logs (Strictly typed to avoid 'any' errors)
        const loadedData: Record<string, MealRecord> = {};
        logs.forEach((log: ConsumptionLogResponse) => {
          if (!loadedData[log.childId]) loadedData[log.childId] = {};
          // Safely map the backend string back to our frontend StatusType
          loadedData[log.childId][log.mealType] = log.consumptionStatus as StatusType;
          if (log.note) loadedData[log.childId].note = log.note;
        });
        setTrackingData(loadedData);
      } catch {
        toast.error('Failed to load data for this date');
      }
    };
    fetchData();
  }, [selectedDate]);

  // Handle changing a specific meal status for a specific student
  const handleStatusChange = (childId: string, meal: MealType, status: StatusType) => {
    setTrackingData((prev) => ({
      ...prev,
      [childId]: {
        ...(prev[childId] || {}),
        [meal]: status,
      },
    }));
  };

  // Handle Note input
  const handleNoteChange = (childId: string, note: string) => {
    setTrackingData((prev) => ({
      ...prev,
      [childId]: {
        ...(prev[childId] || {}),
        note,
      },
    }));
  };

  // Submit bulk data to backend with explicit typing
  const handleSaveLogs = async () => {
    if (!todaysMenu) {
      toast.error('Cannot save logs without a valid menu for this date.');
      return;
    }

    setIsLoading(true);
    const payload: ConsumptionPayloadItem[] = [];

    // Parse trackingData state into DTO format required by Backend
    Object.entries(trackingData).forEach(([childId, record]) => {
      const meals: MealType[] = ['BREAKFAST', 'LUNCH', 'EVENING_SNACK'];

      meals.forEach((meal) => {
        const status = record[meal];
        if (status && status !== 'NOT_LOGGED') {
          payload.push({
            childId,
            menuId: todaysMenu.menuId,
            mealType: meal,
            consumptionStatus: status,
            note: record.note || '',
            date: selectedDate,
          });
        }
      });
    });

    if (payload.length === 0) {
      toast.error('No meal logs marked to save.');
      setIsLoading(false);
      return;
    }

    try {
      await mealService.saveConsumptionLogs({ logs: payload });
      toast.success('Meal logs saved successfully!');
    } catch {
      toast.error('Failed to save meal logs.');
    } finally {
      setIsLoading(false);
    }
  };

  // Custom Dropdown Component for clean UI without native <select> constraints
  const CustomStatusDropdown = ({
    meal,
    studentId,
    currentValue,
  }: {
    meal: MealType;
    studentId: string;
    currentValue: StatusType;
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Styling logic for the button background
    const getBtnStyle = (status: StatusType) => {
      if (status === 'FULL_MEAL') return 'bg-green-100 text-green-700 border-green-200';
      if (status === 'PARTIAL') return 'bg-amber-100 text-amber-700 border-amber-200';
      if (status === 'ATE_NONE') return 'bg-red-100 text-red-700 border-red-200';
      return 'bg-gray-100 text-gray-500 border-gray-200';
    };

    // Styling logic for the color dots (Used ONLY inside the dropdown list)
    const getDotStyle = (status: StatusType) => {
      if (status === 'FULL_MEAL') return 'bg-green-500';
      if (status === 'PARTIAL') return 'bg-amber-500';
      if (status === 'ATE_NONE') return 'bg-red-500';
      return 'bg-gray-400';
    };

    const getLabel = (status: StatusType) => {
      if (status === 'FULL_MEAL') return 'Full';
      if (status === 'PARTIAL') return 'Partial';
      if (status === 'ATE_NONE') return 'None';
      return 'Not Logged';
    };

    return (
      <div className="relative inline-block text-left w-36">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full px-3 py-1.5 rounded-full text-xs font-bold border transition-colors flex items-center justify-between outline-none',
            getBtnStyle(currentValue),
          )}
        >
          <div className="flex items-center gap-1.5 mx-auto">
            {/* The colored dot is intentionally REMOVED from here based on UI feedback */}
            {getLabel(currentValue)}
          </div>
          <ChevronDown className={cn('w-3 h-3 transition-transform', isOpen && 'rotate-180')} />
        </button>

        {isOpen && (
          <>
            {/* Overlay to catch clicks outside the dropdown */}
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>

            {/* The dropdown menu itself */}
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
              {(['NOT_LOGGED', 'FULL_MEAL', 'PARTIAL', 'ATE_NONE'] as StatusType[]).map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      handleStatusChange(studentId, meal, status);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full text-left px-3 py-2 text-xs font-semibold flex items-center gap-2 transition-colors',
                      currentValue === status
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                    )}
                  >
                    {/* The dots REMAIN inside the dropdown menu list */}
                    {status !== 'NOT_LOGGED' ? (
                      <span className={cn('w-2 h-2 rounded-full', getDotStyle(status))}></span>
                    ) : (
                      <span className="w-2 h-2"></span> // placeholder spacing
                    )}
                    {getLabel(status)}
                  </button>
                ),
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 lg:p-8 w-full max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-[32px] font-bold text-slate-900">Meals</h1>
        </div>
        <div>
          <DatePicker value={selectedDate} onChange={setSelectedDate} allowFutureDates={false} />
        </div>
      </div>

      {/* Today's Menu Highlight Cards */}
      <div className="bg-primary-50 rounded-xl p-5 mb-8 border border-primary-100">
        <h3 className="text-primary-700 font-semibold mb-4 flex items-center gap-2">
          <Utensils className="w-5 h-5" /> Today's Menu
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-primary-50">
            <p className="text-xs font-bold text-primary-600 uppercase mb-1 flex items-center gap-1">
              <Coffee className="w-3 h-3" /> Breakfast:
            </p>
            <p className="text-slate-800 text-sm font-medium">
              {todaysMenu?.breakfastDetails || 'Not specified'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-primary-50">
            <p className="text-xs font-bold text-primary-600 uppercase mb-1 flex items-center gap-1">
              <Utensils className="w-3 h-3" /> Lunch:
            </p>
            <p className="text-slate-800 text-sm font-medium">
              {todaysMenu?.lunchDetails || 'Not specified'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-primary-50">
            <p className="text-xs font-bold text-primary-600 uppercase mb-1 flex items-center gap-1">
              <Apple className="w-3 h-3" /> Evening Snack:
            </p>
            <p className="text-slate-800 text-sm font-medium">
              {todaysMenu?.eveningSnackDetails || 'Not specified'}
            </p>
          </div>
        </div>
      </div>

      {/* Tracking Table - Added pb-32 so the dropdowns at the bottom row don't get cut off */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto pb-32">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="uppercase tracking-wider border-b border-gray-100 text-slate-500 font-bold bg-gray-50/50">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4 text-center">
                  <Coffee className="inline w-4 h-4 mr-1" /> Breakfast
                </th>
                <th className="px-6 py-4 text-center">
                  <Utensils className="inline w-4 h-4 mr-1" /> Lunch
                </th>
                <th className="px-6 py-4 text-center">
                  <Apple className="inline w-4 h-4 mr-1" /> Evening Snack
                </th>
                <th className="px-6 py-4">Optional Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Fallback for when there are no students loaded yet */}
              {children.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-medium">
                    No students loaded.
                  </td>
                </tr>
              )}

              {children.map((child, index) => {
                const record = trackingData[child.id] || {};

                // Automatically generate initials and rotating colors based on the child's name
                const initials = child.fullName ? child.fullName.charAt(0).toUpperCase() : '?';
                const colorClass = ['bg-teal-600', 'bg-teal-500', 'bg-teal-400'][index % 3];

                return (
                  <tr key={child.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm ${colorClass}`}
                      >
                        {initials}
                      </div>
                      <span className="font-semibold text-slate-800">{child.fullName}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CustomStatusDropdown
                        meal="BREAKFAST"
                        studentId={child.id}
                        currentValue={record.BREAKFAST || 'NOT_LOGGED'}
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CustomStatusDropdown
                        meal="LUNCH"
                        studentId={child.id}
                        currentValue={record.LUNCH || 'NOT_LOGGED'}
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CustomStatusDropdown
                        meal="EVENING_SNACK"
                        studentId={child.id}
                        currentValue={record.EVENING_SNACK || 'NOT_LOGGED'}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        placeholder="Add a note..."
                        value={record.note || ''}
                        onChange={(e) => handleNoteChange(child.id, e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-primary-500 outline-none transition-shadow"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSaveLogs}
          disabled={isLoading || !todaysMenu || children.length === 0}
          className={cn(
            'px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-sm transition-colors',
            (isLoading || !todaysMenu || children.length === 0) && 'opacity-50 cursor-not-allowed',
          )}
        >
          {isLoading ? 'Saving...' : 'Save Meal Logs & Notes'}
        </button>
      </div>
    </div>
  );
}
