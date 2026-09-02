import { useEffect, useState } from 'react';
import { useForm, useFieldArray, useWatch, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangle, CheckCircle2, CheckCircle, Info } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';

// Importing the REAL backend thunk
import { logStudentProgress } from '../../store/slices/activitySlice';

import { cn } from '../../utils/cn';
import type { StudentProgressDTO, ProgressLevel } from '../../types/activity.types';
import { apiClient } from '../../services/axiosInstance';

const schema = z.object({
  logs: z.array(
    z.object({
      studentId: z.string(),
      studentName: z.string(),
      attendanceStatus: z.enum(['PRESENT', 'ABSENT']),
      progress: z.string().refine((val) => val !== 'PENDING', { message: 'Grading required' }),
      note: z.string().nullable().optional(),
    }),
  ),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  assignmentId: string;
  initialData: StudentProgressDTO[];
  onClose: () => void;
}

interface RawStudent {
  childId?: string;
  id?: string;
  studentId?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

export function LogProgressForm({ assignmentId, initialData, onClose }: Props) {
  const dispatch = useAppDispatch();
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [debugError, setDebugError] = useState<string | null>(null); // 🚀 SMART DEBUGGER

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitted },
  } = useForm<FormValues>({
    resolver: zodResolver(schema, undefined),
    defaultValues: { logs: [] },
  });

  const { fields } = useFieldArray({ control, name: 'logs' });
  const watchedLogs = useWatch({ control, name: 'logs' });

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      reset({ logs: initialData.map((d) => ({ ...d })) });
      return;
    }

    const fetchChildren = async () => {
      try {
        const response = await apiClient.get('/api/v1/child/all');
        const liveData = response.data?.data || response.data;

        if (Array.isArray(liveData) && liveData.length > 0) {
          reset({
            logs: liveData.map((c: RawStudent) => ({
              studentId: c.childId || c.id || c.studentId || '',
              studentName:
                c.fullName ||
                `${c.firstName || ''} ${c.lastName || ''}`.trim() ||
                'Unknown Student',
              attendanceStatus: 'PRESENT',
              progress: 'PENDING',
              note: '',
            })),
          });
        }
      } catch (error) {
        console.error('Failed to fetch real children from /child/all:', error);
      }
    };

    fetchChildren();
  }, [initialData, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      setIsSubmittingForm(true);
      setDebugError('⏳ Connecting to Backend to save progress...');
      setIsSaved(false);

      // 🚀 UNWRAP waits for the Backend Response before proceeding!
      await dispatch(
        logStudentProgress({
          assignmentId,
          logs: values.logs as StudentProgressDTO[],
        }),
      ).unwrap();

      // If we reach here, Backend successfully saved!
      setDebugError(null);
      setIsSaved(true);

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: unknown) {
      // If Backend rejects, UI will NOT show "Saved", it will show the exact error.
      setDebugError(`❌ Backend Rejected Save! Details: ${error}`);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleMarkAllGood = () => {
    watchedLogs?.forEach((log, index) => {
      if (log.attendanceStatus !== 'ABSENT') {
        setValue(`logs.${index}.progress`, 'GOOD', { shouldValidate: true });
      }
    });
  };

  const pendingNames = watchedLogs
    ?.filter((log) => log.progress === 'PENDING' && log.attendanceStatus !== 'ABSENT')
    .map((log) => log.studentName);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-4 p-5 bg-slate-50 border border-slate-200 rounded-xl animate-fadeUp"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800">Log Student Progress</h3>
        <button
          type="button"
          onClick={handleMarkAllGood}
          className="text-sm bg-primary-100 hover:bg-primary-200 text-primary-700 font-bold py-1.5 px-4 rounded-lg flex items-center gap-2 transition-colors"
        >
          <CheckCircle2 className="w-4 h-4" /> Mark All as "Good"
        </button>
      </div>

      {/* 🚀 SMART DEBUGGER UI */}
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

      {isSubmitted && !isSaved && !debugError && pendingNames && pendingNames.length > 0 && (
        <div className="mb-4 flex items-center gap-2 p-3 text-red-700 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-fadeUp">
          <AlertTriangle className="w-5 h-5" />
          <p className="text-sm font-semibold">Please grade: {pendingNames.join(', ')}</p>
        </div>
      )}

      {isSaved && (
        <div className="mb-4 flex items-center gap-2 p-4 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg animate-fadeUp">
          <CheckCircle className="w-5 h-5" />
          <p className="text-sm font-bold">Progress saved successfully in Real-Time!</p>
        </div>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => {
          const isAbsent = field.attendanceStatus === 'ABSENT';
          const progress = watchedLogs?.[index]?.progress;

          const getBtnCls = (level: ProgressLevel, activeCls: string) =>
            cn(
              'px-3 py-1.5 text-xs font-bold rounded border transition-colors',
              isAbsent
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : progress === level
                  ? activeCls
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50',
            );

          return (
            <div
              key={field.id}
              className="flex flex-col xl:flex-row xl:items-center gap-4 p-3 bg-white border border-slate-200 rounded-lg"
            >
              <div className="w-48 font-bold text-slate-800 text-sm flex items-center gap-2">
                {field.studentName}
                {isAbsent && (
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    ABSENT
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 flex-1">
                <button
                  type="button"
                  disabled={isAbsent || isSaved || isSubmittingForm}
                  onClick={() =>
                    setValue(`logs.${index}.progress`, 'EXCELLENT', { shouldValidate: true })
                  }
                  className={getBtnCls(
                    'EXCELLENT',
                    'bg-secondary-500 text-white border-secondary-500',
                  )}
                >
                  Excellent
                </button>
                <button
                  type="button"
                  disabled={isAbsent || isSaved || isSubmittingForm}
                  onClick={() =>
                    setValue(`logs.${index}.progress`, 'GOOD', { shouldValidate: true })
                  }
                  className={getBtnCls('GOOD', 'bg-primary-500 text-white border-primary-500')}
                >
                  Good
                </button>
                <button
                  type="button"
                  disabled={isAbsent || isSaved || isSubmittingForm}
                  onClick={() =>
                    setValue(`logs.${index}.progress`, 'AVERAGE', { shouldValidate: true })
                  }
                  className={getBtnCls('AVERAGE', 'bg-amber-500 text-white border-amber-500')}
                >
                  Average
                </button>
                <button
                  type="button"
                  disabled={isAbsent || isSaved || isSubmittingForm}
                  onClick={() =>
                    setValue(`logs.${index}.progress`, 'NEEDS_HELP', { shouldValidate: true })
                  }
                  className={getBtnCls('NEEDS_HELP', 'bg-red-500 text-white border-red-500')}
                >
                  Needs Help
                </button>
              </div>

              <input
                type="text"
                placeholder="Optional Note..."
                disabled={isAbsent || isSaved || isSubmittingForm}
                onChange={(e) => setValue(`logs.${index}.note`, e.target.value)}
                className="w-full xl:w-64 px-3 py-1.5 text-sm border border-slate-300 rounded disabled:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isSaved || isSubmittingForm}
          className="px-5 py-2 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaved || isSubmittingForm}
          className={cn(
            'px-5 py-2 rounded-lg font-bold shadow-sm transition-all',
            isSaved
              ? 'bg-emerald-500 text-white'
              : 'bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50',
          )}
        >
          {isSubmittingForm ? 'Saving...' : isSaved ? 'Saved' : 'Save Progress'}
        </button>
      </div>
    </form>
  );
}
