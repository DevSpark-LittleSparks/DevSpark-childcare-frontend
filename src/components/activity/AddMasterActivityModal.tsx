/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Button } from '../common/Button';
import { cn } from '../../utils/cn';

import { useAppDispatch } from '../../store/hooks';
import { addMasterActivity, updateMasterActivity } from '../../store/slices/activitySlice';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.enum(['EDUCATIONAL', 'PHYSICAL_PLAY', 'ART_AND_CRAFT']),
  description: z.string().min(5, 'Description is too short'),
  materialsNeeded: z.string().optional(),
});

type ActivityFormValues = z.infer<typeof schema>;

interface AddMasterActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: any;
}

export function AddMasterActivityModal({ isOpen, onClose, editData }: AddMasterActivityModalProps) {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (editData && isOpen) {
      reset({
        name: editData.name || '',
        category: editData.category || 'EDUCATIONAL',
        description: editData.description || '',
        materialsNeeded: editData.materialsNeeded || '',
      });
    } else if (!isOpen) {
      reset({ name: '', description: '', materialsNeeded: '' });
    }
  }, [editData, isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: ActivityFormValues) => {
    try {
      if (editData) {
        await dispatch(updateMasterActivity({ id: editData.id, data })).unwrap();
        toast.success('Master Activity Updated successfully!');
      } else {
        await dispatch(addMasterActivity(data)).unwrap();
        toast.success('Master Activity Added successfully!');
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
            {editData ? 'Edit Master Activity' : 'Add Master Activity'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Activity Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name')}
              className={cn(
                'w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all font-medium text-slate-700',
                errors.name
                  ? 'border-red-300 focus:ring-red-200 bg-red-50/50'
                  : 'border-slate-200 focus:border-primary-500 focus:ring-primary-100 bg-white',
              )}
              placeholder="e.g., Morning Circle"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              {...register('category')}
              className={cn(
                'w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all font-medium text-slate-700',
                errors.category
                  ? 'border-red-300 focus:ring-red-200 bg-red-50/50'
                  : 'border-slate-200 focus:border-primary-500 focus:ring-primary-100 bg-white',
              )}
            >
              <option value="" disabled hidden>
                Select a category...
              </option>
              <option value="EDUCATIONAL">Educational</option>
              <option value="PHYSICAL_PLAY">Physical Play</option>
              <option value="ART_AND_CRAFT">Art & Craft</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.category.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className={cn(
                'w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all resize-none font-medium text-slate-700',
                errors.description
                  ? 'border-red-300 focus:ring-red-200 bg-red-50/50'
                  : 'border-slate-200 focus:border-primary-500 focus:ring-primary-100 bg-white',
              )}
              placeholder="Provide a clear description of the activity..."
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.description.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Materials Needed <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              {...register('materialsNeeded')}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all font-medium text-slate-700 bg-white"
              placeholder="e.g., Crayons, Paper, Scissors"
            />
          </div>
          <div className="pt-4 mt-2 flex justify-end gap-3">
            {/* 💡 Buttons are exactly as per your screenshot */}
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              {editData ? 'Update Activity' : 'Save Activity'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
