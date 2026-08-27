import { useEffect, useState } from 'react';
import { useForm, useFieldArray, SubmitHandler, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { AlertTriangle, Clock, Info } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { cn } from '../../utils/cn';
import {
  selectAttendanceRecords,
  selectIsEditMode,
  selectAttendanceSaving,
  saveAttendanceBulk,
} from '../../store/slices/attendanceSlice';
import type { ChildAttendanceDTO } from '../../types/attendance.types';
import { apiClient } from '../../services/axiosInstance';

const schema = z.object({
  attendances: z.array(
    z.object({
      childId: z.string(),
      childName: z.string(),
      status: z.string().refine((val) => val !== 'UNMARKED', { message: 'Status is required' }),
      checkIn: z.string().nullable(),
      checkOut: z.string().nullable(),
      notes: z.string().optional().nullable(),
    }),
  ),
});

type FormValues = z.infer<typeof schema>;

interface RawStudent {
  childId?: string;
  id?: string;
  studentId?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

export function AttendanceForm() {
  const dispatch = useAppDispatch();
  const records = useAppSelector(selectAttendanceRecords);
  const isEditMode = useAppSelector(selectIsEditMode);
  const isSaving = useAppSelector(selectAttendanceSaving);

  const [isSaved, setIsSaved] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [debugError, setDebugError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<FormValues>({
    resolver: zodResolver(schema, undefined),
    defaultValues: { attendances: [] },
  });

  const { fields } = useFieldArray({ control, name: 'attendances' });
  const watchedAttendances = useWatch({ control, name: 'attendances' });

  useEffect(() => {
    let isMounted = true;

    const fetchChildrenAndMerge = async () => {
      try {
        const response = await apiClient.get('/child/all');
        const liveData = response.data?.data || response.data;

        if (Array.isArray(liveData) && isMounted) {
          const mergedAttendances = liveData.map((c: RawStudent) => {
            const cId = c.childId || c.id || c.studentId || '';
            const cName =
              c.fullName || `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Unknown Student';

            const existingRecord = records?.find(
              (r: ChildAttendanceDTO) => String(r.childId) === String(cId),
            );

            return {
              childId: String(cId),
              childName: cName,
              status: existingRecord ? String(existingRecord.status) : 'UNMARKED',
              checkIn: existingRecord?.checkIn || null,
              checkOut: existingRecord?.checkOut || null,
              notes: existingRecord?.notes || null,
            };
          });

          reset({ attendances: mergedAttendances });
        }
      } catch (error) {
        console.error('Failed to fetch children for attendance:', error);
      }
    };

    fetchChildrenAndMerge();

    return () => {
      isMounted = false;
    };
  }, [records, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      setIsSubmittingForm(true);
      setDebugError(null);
      setIsSaved(false);

      const dtoList = values.attendances.map((a) => ({
        childId: a.childId,
        childName: a.childName,
        status: a.status as ChildAttendanceDTO['status'],
        checkIn: a.checkIn,
        checkOut: a.checkOut,
        notes: a.notes || undefined,
      }));

      await dispatch(saveAttendanceBulk(dtoList as ChildAttendanceDTO[])).unwrap();

      setIsSaved(true);
    } catch (error: unknown) {
      const errStr =
        typeof error === 'string' ? error : (error as Error).message || JSON.stringify(error);
      setDebugError(`❌ Backend Rejected Save! Details: ${errStr}`);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleEdit = () => {
    if (isSaved) setIsSaved(false);
  };

  const markTime = (index: number, type: 'in' | 'out') => {
    handleEdit();
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

  const unmarkedNames = fields
    .map((field, index) => (errors.attendances?.[index]?.status ? field.childName : ''))
    .filter((name) => name !== '');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fadeUp">
      {debugError && (
        <div className="flex items-start gap-3 p-5 bg-amber-50 border-l-4 border-amber-500 text-amber-900 rounded-r-xl shadow-sm mb-6 animate-fadeUp">
          <Info className="w-6 h-6 flex-shrink-0 mt-0.5 text-amber-600" />
          <div>
            <p className="font-bold text-sm mb-1 uppercase tracking-wider text-amber-800">
              System Diagnostic Report
            </p>
            <p className="font-mono text-sm leading-relaxed">{debugError}</p>
          </div>
        </div>
      )}

      {isSubmitted && !isSaved && !debugError && unmarkedNames.length > 0 && (
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
                        {field.childName?.charAt(0) || '?'}
                      </div>
                      <span className="font-medium text-slate-800">{field.childName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={!isEditMode || isSubmittingForm}
                        onClick={() => {
                          setValue(`attendances.${index}.status`, 'PRESENT', {
                            shouldValidate: true,
                          });
                          handleEdit();
                        }}
                        className={cn(
                          'px-4 py-1.5 rounded-md border text-sm font-medium transition-colors',
                          currentStatus === 'PRESENT'
                            ? 'bg-secondary-500 text-white border-secondary-500'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed',
                        )}
                      >
                        ✓ Present
                      </button>
                      <button
                        type="button"
                        disabled={!isEditMode || isSubmittingForm}
                        onClick={() => {
                          setValue(`attendances.${index}.status`, 'HALF_DAY', {
                            shouldValidate: true,
                          });
                          handleEdit();
                        }}
                        className={cn(
                          'px-4 py-1.5 rounded-md border text-sm font-medium transition-colors',
                          currentStatus === 'HALF_DAY'
                            ? 'bg-primary-500 text-white border-primary-500'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 disabled:opacity-50',
                        )}
                      >
                        Half Day
                      </button>
                      <button
                        type="button"
                        disabled={!isEditMode || isSubmittingForm}
                        onClick={() => {
                          setValue(`attendances.${index}.status`, 'ABSENT', {
                            shouldValidate: true,
                          });
                          setValue(`attendances.${index}.checkIn`, null);
                          setValue(`attendances.${index}.checkOut`, null);
                          handleEdit();
                        }}
                        className={cn(
                          'px-4 py-1.5 rounded-md border text-sm font-medium transition-colors',
                          currentStatus === 'ABSENT'
                            ? 'bg-slate-600 text-white border-slate-600'
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
                        disabled={!isEditMode || currentStatus === 'ABSENT' || isSubmittingForm}
                        onClick={() => markTime(index, 'in')}
                        className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-slate-700"
                      >
                        <Clock className="w-3 h-3 text-slate-400" /> In{' '}
                        {checkIn && <span className="text-primary-600 font-bold">({checkIn})</span>}
                      </button>
                      <button
                        type="button"
                        disabled={
                          !isEditMode || !checkIn || currentStatus === 'ABSENT' || isSubmittingForm
                        }
                        onClick={() => markTime(index, 'out')}
                        className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-slate-700"
                      >
                        <Clock className="w-3 h-3 text-slate-400" /> Out{' '}
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
            {/* 🎨 THE FIX: Using your exact primary-800 for a solid, dark, distinct "Saved" state */}
            <button
              type="submit"
              disabled={isSaving || isSaved || isSubmittingForm}
              className={cn(
                'px-6 py-2 rounded-lg font-semibold transition-all shadow-sm',
                isSaved
                  ? 'bg-primary-800 text-white border-primary-800 cursor-default'
                  : 'bg-primary-500 hover:bg-primary-600 text-white disabled:opacity-50',
              )}
            >
              {isSubmittingForm || isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save All Records'}
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
