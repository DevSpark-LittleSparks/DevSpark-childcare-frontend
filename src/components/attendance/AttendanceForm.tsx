import { useEffect } from 'react';
//import { useForm, useFieldArray, useWatch, SubmitHandler } from 'react-hook-form';
import { useForm, useFieldArray, SubmitHandler, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { AlertTriangle, Clock } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { cn } from '../../utils/cn';
import {
  selectAttendanceRecords,
  selectIsEditMode,
  selectSelectedDate,
  selectAttendanceSaving,
  saveAttendanceBulk,
  fetchAttendanceByDate,
} from '../../store/slices/attendanceSlice';
import type { ChildAttendanceDTO } from '../../types/attendance.types';

// Strict Zod schema
const schema = z.object({
  attendances: z.array(
    z.object({
      childId: z.string(),
      childName: z.string(),
      status: z.string().refine((val) => val !== 'UNMARKED', {
        message: 'Status is required',
      }),
      checkIn: z.string().nullable(),
      checkOut: z.string().nullable(),
      notes: z.string().optional().nullable(),
    }),
  ),
});

type FormValues = z.infer<typeof schema>;

export function AttendanceForm() {
  const dispatch = useAppDispatch();
  const records = useAppSelector(selectAttendanceRecords);
  const isEditMode = useAppSelector(selectIsEditMode);
  const selectedDate = useAppSelector(selectSelectedDate);
  const isSaving = useAppSelector(selectAttendanceSaving);

  const {
    control,
    handleSubmit,
    setValue,
    getValues, // Half-Day bug eka hadanna meka gaththa
    reset,
    formState: { errors, isSubmitted }, // isSubmitted eken alert eka control karanawa
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { attendances: [] },
  });

  const { fields } = useFieldArray({ control, name: 'attendances' });

  // React Compiler warning eka nathi karanna useWatch pawichchi kala
  const watchedAttendances = useWatch({
    control,
    name: 'attendances',
  });

  useEffect(() => {
    if (records && records.length > 0) {
      const formattedRecords = records.map((r: ChildAttendanceDTO) => ({
        childId: String(r.childId),
        childName: String(r.childName),
        status: String(r.status),
        checkIn: r.checkIn || null,
        checkOut: r.checkOut || null,
        notes: r.notes || null,
      }));
      reset({ attendances: formattedRecords });
    } else {
      reset({ attendances: [] });
    }
  }, [records, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const dtoList = values.attendances.map((a) => ({
      childId: a.childId,
      childName: a.childName,
      status: a.status as ChildAttendanceDTO['status'],
      checkIn: a.checkIn,
      checkOut: a.checkOut,
      notes: a.notes || undefined,
    }));
    await dispatch(saveAttendanceBulk(dtoList as ChildAttendanceDTO[]));
    dispatch(fetchAttendanceByDate(selectedDate));
  };

  // Half-Day Bug eka fix karapu thana
  const markTime = (index: number, type: 'in' | 'out') => {
    const currentTime = format(new Date(), 'HH:mm');
    if (type === 'in') {
      const currentStatus = getValues(`attendances.${index}.status`);
      if (currentStatus === 'UNMARKED' || currentStatus === 'ABSENT') {
        setValue(`attendances.${index}.status`, 'PRESENT', { shouldValidate: true });
      }
      setValue(`attendances.${index}.checkIn`, currentTime);
    } else {
      setValue(`attendances.${index}.checkOut`, currentTime);
    }
  };

  // Errors.attendances walin check karana nisa load weddi alert eka penne na
  const unmarkedNames = fields
    .map((field, index) => {
      const rowErrors = errors.attendances?.[index];
      return rowErrors?.status ? field.childName : '';
    })
    .filter((name) => name !== '');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* isSubmitted true unama witharak red alert eka enawa */}
      {isSubmitted && unmarkedNames.length > 0 && (
        <div className="flex items-center gap-2 p-4 text-red-700 bg-red-50 border border-red-200 rounded-lg animate-fadeUp">
          <AlertTriangle className="w-5 h-5" />
          <p className="text-sm">
            <span className="font-bold">Action Required:</span> Please mark attendance for:{' '}
            {unmarkedNames.join(', ')}
          </p>
        </div>
      )}

      <div className="bg-surface border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
            <tr>
              <th className="py-4 px-6 uppercase text-xs tracking-wider">Student Name</th>
              <th className="py-4 px-6 uppercase text-xs tracking-wider">Attendance Status</th>
              <th className="py-4 px-6 uppercase text-xs tracking-wider text-center">
                Time Tracking
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {fields.map((field, index) => {
              const currentStatus = watchedAttendances?.[index]?.status;
              const checkIn = watchedAttendances?.[index]?.checkIn;
              const checkOut = watchedAttendances?.[index]?.checkOut;

              return (
                <tr key={field.id} className="hover:bg-primary-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xs">
                        {field.childName.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-800">{field.childName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={!isEditMode}
                        onClick={() =>
                          setValue(`attendances.${index}.status`, 'PRESENT', {
                            shouldValidate: true,
                          })
                        }
                        className={cn(
                          'px-4 py-1.5 rounded-md border text-sm font-medium transition-colors',
                          currentStatus === 'PRESENT'
                            ? 'bg-secondary-500 text-white border-secondary-500' // Green
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed',
                        )}
                      >
                        ✓ Present
                      </button>
                      <button
                        type="button"
                        disabled={!isEditMode}
                        onClick={() =>
                          setValue(`attendances.${index}.status`, 'HALF_DAY', {
                            shouldValidate: true,
                          })
                        }
                        className={cn(
                          'px-4 py-1.5 rounded-md border text-sm font-medium transition-colors',
                          currentStatus === 'HALF_DAY'
                            ? 'bg-primary-500 text-white border-primary-500' // Cyan
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 disabled:opacity-50',
                        )}
                      >
                        Half Day
                      </button>
                      <button
                        type="button"
                        disabled={!isEditMode}
                        onClick={() => {
                          setValue(`attendances.${index}.status`, 'ABSENT', {
                            shouldValidate: true,
                          });
                          setValue(`attendances.${index}.checkIn`, null);
                          setValue(`attendances.${index}.checkOut`, null);
                        }}
                        className={cn(
                          'px-4 py-1.5 rounded-md border text-sm font-medium transition-colors',
                          currentStatus === 'ABSENT'
                            ? 'bg-slate-500 text-white border-slate-500' // Gray
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 disabled:opacity-50',
                        )}
                      >
                        ✕ Absent
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 justify-center">
                      <button
                        type="button"
                        disabled={!isEditMode || currentStatus === 'ABSENT'}
                        onClick={() => markTime(index, 'in')}
                        className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-slate-700"
                      >
                        <Clock className="w-3 h-3 text-slate-400" /> In
                        {checkIn && <span className="text-primary-600 font-bold">({checkIn})</span>}
                      </button>
                      <button
                        type="button"
                        disabled={!isEditMode || !checkIn || currentStatus === 'ABSENT'}
                        onClick={() => markTime(index, 'out')}
                        className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-slate-700"
                      >
                        <Clock className="w-3 h-3 text-slate-400" /> Out
                        {checkOut && (
                          <span className="text-primary-600 font-bold">({checkOut})</span>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {isEditMode && (
          <div className="bg-slate-50 p-4 flex justify-end border-t border-slate-200">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 shadow-sm"
            >
              {isSaving ? 'Saving...' : 'Save All Records'}
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
