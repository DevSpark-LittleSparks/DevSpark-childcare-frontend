/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Plus, Send, Edit, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../../components/common/Button';
import { DatePicker } from '../../components/common/DatePicker';
import { Spinner } from '../../components/common/Spinner';
import { AddMasterActivityModal } from '../../components/activity/AddMasterActivityModal';
import AssignActivityModal from '../../components/activity/AssignActivityModal';
import { cn } from '../../utils/cn';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchMasterActivities,
  fetchAssignments,
  selectMasterActivities,
  selectAssignments,
  selectActivityLoading,
  selectActivityError,
  deleteMasterActivity,
  publishAssignment,
  deleteAssignment,
} from '../../store/slices/activitySlice';
// 💡 ටීචර්ස්ලාව ගේන කෑල්ල ආයෙත් දැම්මා!
import { fetchStaff } from '../../store/slices/staffSlice';
import type { AssignmentStatus } from '../../types/activity.types';

type TabType = 'ASSIGNMENTS' | 'MASTER_DATA';
type FilterStatus = 'ALL' | AssignmentStatus;

const todayString = new Date().toISOString().split('T')[0];

export default function AdminActivityPage() {
  const dispatch = useAppDispatch();
  const masterActivities = useAppSelector(selectMasterActivities);
  const assignments = useAppSelector(selectAssignments);
  const isLoading = useAppSelector(selectActivityLoading);
  const error = useAppSelector(selectActivityError);

  const [activeTab, setActiveTab] = useState<TabType>('MASTER_DATA'); // 💡 Default tab eka Master Data (left side) krla damma
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>(todayString);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const [editMasterData, setEditMasterData] = useState<any>(null);
  const [editAssignmentData, setEditAssignmentData] = useState<any>(null);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    action: 'PUBLISH' | 'DELETE_ASSIGN' | 'DELETE_MASTER' | null;
    id: string | null;
  }>({ isOpen: false, action: null, id: null });

  useEffect(() => {
    dispatch(fetchMasterActivities(0));

    dispatch(fetchStaff());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAssignments({ date: selectedDate }));
  }, [dispatch, selectedDate]);

  const executeConfirmAction = () => {
    const { action, id } = confirmDialog;
    if (!id) return;
    if (action === 'PUBLISH') {
      dispatch(publishAssignment(id))
        .unwrap()
        .then(() => toast.success('Assignment published successfully!'))
        .catch((err) => toast.error(typeof err === 'string' ? err : 'Failed to publish'));
    } else if (action === 'DELETE_ASSIGN') {
      dispatch(deleteAssignment(id))
        .unwrap()
        .then(() => toast.success('Assignment deleted successfully!'))
        .catch((err) => toast.error(typeof err === 'string' ? err : 'Failed to delete'));
    } else if (action === 'DELETE_MASTER') {
      dispatch(deleteMasterActivity(id))
        .unwrap()
        .then(() => toast.success('Master Activity deleted successfully!'))
        .catch((err) => toast.error(typeof err === 'string' ? err : 'Failed to delete'));
    }
    setConfirmDialog({ isOpen: false, action: null, id: null });
  };

  const filteredAssignments = assignments.filter((a) => {
    const matchesStatus =
      filterStatus === 'ALL' ||
      a.status === filterStatus ||
      (filterStatus === 'PUBLISHED' && a.status === 'ASSIGNED');
    const matchesDate = !a.date || a.date === selectedDate;
    return matchesStatus && matchesDate;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 w-full relative">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Activity Management</h1>
        </div>
        <div className="shrink-0">
          <DatePicker
            value={selectedDate}
            onChange={(date: string) => {
              if (date) setSelectedDate(date);
            }}
            allowFutureDates={true}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-3 gap-4">
        <div className="flex gap-2">
          {/* 🚀 Master Activities එක මුලට (වම් පැත්තට) ගත්තා */}
          <button
            onClick={() => setActiveTab('MASTER_DATA')}
            className={cn(
              'px-6 py-2 font-bold text-sm transition-all border-b-2 -mb-[14px]',
              activeTab === 'MASTER_DATA'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
            )}
          >
            Master Activities
          </button>
          {/* 🚀 Teacher Assignments එක ඊටපස්සේ (දකුණු පැත්තට) දැම්මා */}
          <button
            onClick={() => setActiveTab('ASSIGNMENTS')}
            className={cn(
              'px-6 py-2 font-bold text-sm transition-all border-b-2 -mb-[14px]',
              activeTab === 'ASSIGNMENTS'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
            )}
          >
            Teacher Assignments
          </button>
        </div>
        <div className="flex gap-3 shrink-0">
          <Button
            variant="outline"
            className="px-5 bg-white"
            onClick={() => {
              setEditMasterData(null);
              setIsAddModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Master Activity
          </Button>
          <Button
            variant="primary"
            className="px-5"
            onClick={() => {
              setEditAssignmentData(null);
              setIsAssignModalOpen(true);
            }}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Assign Activity
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg font-medium">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <>
          {activeTab === 'ASSIGNMENTS' && (
            <div className="space-y-4 animate-fadeUp">
              <div className="flex gap-2">
                {(['ALL', 'DRAFT', 'PUBLISHED', 'COMPLETED'] as FilterStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={cn(
                      'px-4 py-2 rounded-lg text-xs font-bold transition-all',
                      filterStatus === status
                        ? 'bg-slate-800 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50',
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="py-4 px-6 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                          Teacher
                        </th>
                        <th className="py-4 px-6 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                          Activity
                        </th>
                        <th className="py-4 px-6 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                          Schedule
                        </th>
                        <th className="py-4 px-6 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="py-4 px-6 text-xs font-extrabold text-slate-500 uppercase tracking-wider text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAssignments.map((assignment) => {
                        const assignId = (assignment as any).id || assignment.assignmentId;
                        return (
                          <tr key={assignId} className="hover:bg-slate-50 transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm shrink-0">
                                  {assignment.initials || 'U'}
                                </div>
                                <span className="font-bold text-slate-700">
                                  {assignment.teacherName || 'Unassigned'}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6 font-medium text-slate-700">
                              {assignment.activity?.name || 'Unknown Activity'}
                            </td>
                            <td className="py-4 px-6 text-sm text-slate-500">
                              <div className="font-bold text-slate-700">
                                {assignment.date || selectedDate}
                              </div>
                              <div>
                                {assignment.startTime?.slice(0, 5)} -{' '}
                                {assignment.endTime?.slice(0, 5)}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              {assignment.status === 'DRAFT' && (
                                <span className="inline-flex items-center px-3 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                                  Draft
                                </span>
                              )}
                              {(assignment.status === 'PUBLISHED' ||
                                assignment.status === 'ASSIGNED') && (
                                <span className="inline-flex items-center px-3 py-1 rounded-md bg-primary-50 text-primary-700 text-xs font-bold border border-primary-200">
                                  Published
                                </span>
                              )}
                              {assignment.status === 'COMPLETED' && (
                                <span className="inline-flex items-center px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                                  Completed
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6 text-right space-x-2">
                              {assignment.status === 'DRAFT' && (
                                <button
                                  title="Publish Assignment"
                                  onClick={() =>
                                    setConfirmDialog({
                                      isOpen: true,
                                      action: 'PUBLISH',
                                      id: assignId,
                                    })
                                  }
                                  className="inline-flex items-center justify-center px-3 py-1.5 bg-primary-500 text-white rounded-lg text-xs font-bold hover:bg-primary-600 transition-colors"
                                >
                                  <Send className="w-3 h-3 mr-1" /> Publish
                                </button>
                              )}
                              <button
                                title="Edit Assignment"
                                onClick={() => {
                                  setEditAssignmentData(assignment);
                                  setIsAssignModalOpen(true);
                                }}
                                className="text-slate-400 hover:text-primary-600 transition-colors p-2"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                title="Delete Assignment"
                                onClick={() =>
                                  setConfirmDialog({
                                    isOpen: true,
                                    action: 'DELETE_ASSIGN',
                                    id: assignId,
                                  })
                                }
                                className="text-slate-400 hover:text-red-500 transition-colors p-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredAssignments.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-500 font-medium">
                            No assignments found for {selectedDate}.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'MASTER_DATA' && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm animate-fadeUp">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="py-4 px-6 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                      Activity Name
                    </th>
                    <th className="py-4 px-6 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="py-4 px-6 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                      DESCRIPTION
                    </th>
                    <th className="py-4 px-6 text-xs font-extrabold text-slate-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {masterActivities.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 text-sm font-bold text-slate-400">
                        {act.id.slice(0, 8)}...
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-700">{act.name}</td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold">
                          {act.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-500 max-w-xs break-words whitespace-normal leading-relaxed">
                        {act.description}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          title="Edit Master Activity"
                          onClick={() => {
                            setEditMasterData(act);
                            setIsAddModalOpen(true);
                          }}
                          className="text-slate-400 hover:text-primary-600 transition-colors p-2"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          title="Delete Master Activity"
                          onClick={() =>
                            setConfirmDialog({ isOpen: true, action: 'DELETE_MASTER', id: act.id })
                          }
                          className="text-slate-400 hover:text-red-500 transition-colors p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 animate-fadeUp">
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Are you sure?</h3>
            <p className="text-slate-500 mb-6 font-medium">
              Do you really want to proceed with this action?
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setConfirmDialog({ isOpen: false, action: null, id: null })}
              >
                Cancel
              </Button>
              <Button
                variant={confirmDialog.action === 'PUBLISH' ? 'primary' : 'danger'}
                onClick={executeConfirmAction}
              >
                {confirmDialog.action === 'PUBLISH' ? 'Yes, Publish' : 'Yes, Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <AddMasterActivityModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditMasterData(null);
        }}
        editData={editMasterData}
      />
      <AssignActivityModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setEditAssignmentData(null);
        }}
        selectedDateContext={selectedDate}
        editData={editAssignmentData}
      />
    </div>
  );
}
