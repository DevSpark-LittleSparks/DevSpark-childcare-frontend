import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, addDays, startOfWeek, parseISO, nextMonday } from 'date-fns';
import toast from 'react-hot-toast';
import { Coffee, Utensils, Apple } from 'lucide-react'; // Clean UI Icons

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  publishMenu,
  fetchWeeklyMenu,
  selectMealLoading,
  selectWeeklyMenus,
} from '../../store/slices/mealSlice';
import { DatePicker } from '../../components/common/DatePicker';
import { cn } from '../../utils/cn';

// Zod Validation Schema
const dayMenuSchema = z.object({
  date: z.string(),
  dayName: z.string(),
  breakfastDetails: z.string().optional(),
  lunchDetails: z.string().optional(),
  eveningSnackDetails: z.string().optional(),
});

const weeklyMenuSchema = z.object({
  menus: z.array(dayMenuSchema),
});

type FormValues = z.infer<typeof weeklyMenuSchema>;

export default function MealsPage() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectMealLoading);
  const existingMenus = useAppSelector(selectWeeklyMenus);

  // Default to the upcoming Monday
  const [selectedDate, setSelectedDate] = useState<string>(
    format(nextMonday(new Date()), 'yyyy-MM-dd'),
  );

  const [includeSaturday, setIncludeSaturday] = useState(false);

  const { register, handleSubmit, control, reset } = useForm<FormValues>({
    resolver: zodResolver(weeklyMenuSchema),
    defaultValues: { menus: [] },
  });

  const { fields } = useFieldArray({
    control,
    name: 'menus',
  });

  // 1. Fetch data when the selected week changes
  useEffect(() => {
    if (!selectedDate) return;
    const monday = startOfWeek(parseISO(selectedDate), { weekStartsOn: 1 });
    const endDate = format(addDays(monday, includeSaturday ? 5 : 4), 'yyyy-MM-dd');

    dispatch(
      fetchWeeklyMenu({
        startDate: format(monday, 'yyyy-MM-dd'),
        endDate,
      }),
    );
  }, [selectedDate, includeSaturday, dispatch]);

  // 2. Generate fields and populate with existing data
  useEffect(() => {
    if (!selectedDate) return;

    const monday = startOfWeek(parseISO(selectedDate), { weekStartsOn: 1 });
    const daysToGenerate = includeSaturday ? 6 : 5;

    const initialMenus = Array.from({ length: daysToGenerate }).map((_, i) => {
      const currentDate = addDays(monday, i);
      const dateString = format(currentDate, 'yyyy-MM-dd');

      const savedData = existingMenus.find((menu) => menu.date === dateString);

      return {
        date: dateString,
        dayName: format(currentDate, 'EEEE'),
        breakfastDetails: savedData?.breakfastDetails || '',
        lunchDetails: savedData?.lunchDetails || '',
        eveningSnackDetails: savedData?.eveningSnackDetails || '',
      };
    });

    reset({ menus: initialMenus });
  }, [selectedDate, includeSaturday, existingMenus, reset]);

  const onSubmit = async (values: FormValues) => {
    const formattedData = {
      menus: values.menus.map((menu) => ({
        date: menu.date,
        breakfastDetails: menu.breakfastDetails,
        lunchDetails: menu.lunchDetails,
        eveningSnackDetails: menu.eveningSnackDetails,
      })),
    };

    try {
      await dispatch(publishMenu(formattedData)).unwrap();
      toast.success('Weekly menu published successfully!');
    } catch (err: unknown) {
      toast.error((err as string) || 'Failed to publish weekly menu');
    }
  };

  return (
    <div className="p-6 lg:p-8 w-full max-w-7xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Weekly Meal Planner</h1>
          </div>

          <div className="flex flex-col items-end gap-3 w-full md:w-auto">
            <DatePicker value={selectedDate} onChange={setSelectedDate} allowFutureDates={true} />

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors bg-white px-4 py-2.5 rounded-lg border border-gray-200 shadow-sm">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500 cursor-pointer"
                  checked={includeSaturday}
                  onChange={(e) => setIncludeSaturday(e.target.checked)}
                />
                Include Saturday
              </label>
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  'px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm flex items-center gap-2',
                  'bg-primary-500 text-white hover:bg-primary-600',
                  isLoading && 'opacity-70 cursor-not-allowed',
                )}
              >
                {isLoading ? 'Publishing...' : 'Publish Weekly Menu'}
              </button>
            </div>
          </div>
        </div>

        {/* Grid for Days with Clean Lucide Icons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-surface p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-bold text-slate-800 mb-5 pb-3 border-b border-gray-100 flex justify-between items-center">
                {field.dayName}
                <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
                  {field.date}
                </span>
              </h3>

              <div className="space-y-4">
                {/* Breakfast */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
                    <Coffee className="w-4 h-4 text-slate-500" /> Breakfast
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Oatmeal & Bananas"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-slate-700 transition-all placeholder:text-gray-400"
                    {...register(`menus.${index}.breakfastDetails`)}
                  />
                </div>

                {/* Lunch */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
                    <Utensils className="w-4 h-4 text-slate-500" /> Lunch
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Rice, Dhal & Chicken"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-slate-700 transition-all placeholder:text-gray-400"
                    {...register(`menus.${index}.lunchDetails`)}
                  />
                </div>

                {/* Evening Snack */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1.5">
                    <Apple className="w-4 h-4 text-slate-500" /> Evening Snack
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Yogurt & Apples"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-slate-700 transition-all placeholder:text-gray-400"
                    {...register(`menus.${index}.eveningSnackDetails`)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}
