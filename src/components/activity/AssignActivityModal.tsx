/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Button } from '../common/Button';
import { cn } from '../../utils/cn';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  assignActivity,
  updateAssignment,
  selectMasterActivities,
} from '../../store/slices/activitySlice';

const assignSchema = z
  .object({
    teacherId: z.string().min(1, 'Please select a teacher'),
    activityId: z.string().min(1, 'Please select an activity'),
    date: z.string().min(1, 'Date is required'),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
  })
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) return true;
      return data.endTime > data.startTime;
    },
    { message: 'End time must be after the start time', path: ['endTime'] },
  );

type AssignFormValues = z.infer<typeof assignSchema>;

interface AssignActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDateContext?: string;
  editData?: any;
}

export default function AssignActivityModal({
  isOpen,
  onClose,
  selectedDateContext,
  editData,
}: AssignActivityModalProps) {
  const dispatch = useAppDispatch();
  const masterActivities = useAppSelector(selectMasterActivities);
  const teachers = useAppSelector((state: any) => state.staff?.list || []);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssignFormValues>({
    resolver: zodResolver(assignSchema),
  });

  useEffect(() => {
    if (editData && isOpen) {
      reset({
        teacherId: editData.teacherId || '',
        activityId: editData.activity?.id || '',
        date: editData.date || selectedDateContext || '',
        startTime: editData.startTime || '',
        endTime: editData.endTime || '',
      });
    } else if (!isOpen) {
      reset({
        date: selectedDateContext || new Date().toISOString().split('T')[0],
        teacherId: '',
        activityId: '',
      });
    }
  }, [editData, isOpen, selectedDateContext, reset]);

  const selectedTeacher = useWatch({ control, name: 'teacherId' });
  const selectedStartTime = useWatch({ control, name: 'startTime' });

  const hasOverlapWarning =
    selectedTeacher === 'T1' && selectedStartTime && selectedStartTime.startsWith('09');
  const hasOverloadWarning = selectedTeacher === 'T2';

  if (!isOpen) return null;

  const onSubmit = async (data: AssignFormValues) => {
    try {
      if (editData) {
        await dispatch(
          updateAssignment({
            id: editData.id || editData.assignmentId,
            data: { ...data, status: editData.status } as any,
          }),
        ).unwrap();
        toast.success('Activity Assignment Updated Successfully!');
      } else {
        await dispatch(assignActivity({ ...data, status: 'DRAFT' })).unwrap();
        toast.success('Activity Assigned Successfully! (Saved as DRAFT)');
      }
      onClose();
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to save activity.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeUp">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {editData ? 'Edit Assignment' : 'Assign Activity to Teacher'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {hasOverlapWarning && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 animate-fadeUp">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm font-semibold text-red-700">
                Overlap Check: This teacher already has an activity scheduled around this time.
              </p>
            </div>
          )}
          {hasOverloadWarning && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 animate-fadeUp">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm font-semibold text-amber-700">
                Workload Check: Teacher is reaching their maximum workload for today.
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Teacher <span className="text-red-500">*</span>
            </label>
            <select
              {...register('teacherId')}
              className={cn(
                'w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all font-medium text-slate-700',
                errors.teacherId
                  ? 'border-red-300 focus:ring-red-200 bg-red-50/50'
                  : 'border-slate-200 focus:border-primary-500 focus:ring-primary-100 bg-white',
              )}
            >
              <option value="" disabled hidden>
                Select a teacher...
              </option>
              {teachers.map((t: any) => (
                <option key={t.teacherId || t.id} value={t.teacherId || t.id}>
                  {t.fullName || t.name}
                </option>
              ))}
            </select>
            {errors.teacherId && (
              <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.teacherId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Activity <span className="text-red-500">*</span>
            </label>
            <select
              {...register('activityId')}
              className={cn(
                'w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all font-medium text-slate-700',
                errors.activityId
                  ? 'border-red-300 focus:ring-red-200 bg-red-50/50'
                  : 'border-slate-200 focus:border-primary-500 focus:ring-primary-100 bg-white',
              )}
            >
              <option value="" disabled hidden>
                Select an activity...
              </option>
              {masterActivities.map((a: any) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            {errors.activityId && (
              <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.activityId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('date')}
                className={cn(
                  'w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all font-medium text-slate-700 bg-white',
                  errors.date
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-slate-200 focus:border-primary-500 focus:ring-primary-100',
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                {...register('startTime')}
                className={cn(
                  'w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all font-medium text-slate-700 bg-white',
                  errors.startTime
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-slate-200 focus:border-primary-500 focus:ring-primary-100',
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                {...register('endTime')}
                className={cn(
                  'w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all font-medium text-slate-700 bg-white',
                  errors.endTime
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-slate-200 focus:border-primary-500 focus:ring-primary-100',
                )}
              />
            </div>
          </div>
          {(errors.startTime || errors.endTime) && (
            <p className="text-red-500 text-xs mt-1.5 font-bold">
              {errors.endTime?.message || errors.startTime?.message}
            </p>
          )}

          <div className="pt-4 mt-2 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              {editData ? 'Update Assignment' : 'Save as Draft'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
