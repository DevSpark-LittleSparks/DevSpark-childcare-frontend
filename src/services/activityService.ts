/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from './axiosInstance';
import type { ApiResponse, PagedData } from '../types/shared.types';
import type {
  MasterActivity,
  MasterActivityCreateRequest,
  Assignment,
  AssignActivityRequest,
  StudentProgressDTO,
} from '../types/activity.types';

export const activityService = {
  getAllMasterActivities: async (page = 0, size = 20): Promise<PagedData<MasterActivity>> => {
    // 💡 වෙනස් කළා: /academic/activities
    const res = await apiClient.get<ApiResponse<any>>('/academic/activities', {
      params: { page, size },
    });
    if (Array.isArray(res.data.data)) {
      return {
        content: res.data.data,
        page: 0,
        size: 20,
        totalElements: res.data.data.length,
        totalPages: 1,
      };
    }
    return res.data.data;
  },
  createMasterActivity: async (data: MasterActivityCreateRequest): Promise<MasterActivity> => {
    const res = await apiClient.post<ApiResponse<MasterActivity>>('/academic/activities', data);
    return res.data.data;
  },
  updateMasterActivity: async (
    id: string,
    data: Partial<MasterActivityCreateRequest>,
  ): Promise<MasterActivity> => {
    const res = await apiClient.put<ApiResponse<MasterActivity>>(
      `/academic/activities/${id}`,
      data,
    );
    return res.data.data;
  },
  deleteMasterActivity: async (id: string): Promise<void> => {
    await apiClient.delete(`/academic/activities/${id}`);
  },

  getAssignments: async (date?: string, teacherId?: string): Promise<Assignment[]> => {
    const params: any = {};
    if (date) params.date = date;
    if (teacherId && teacherId.trim() !== '') params.teacherId = teacherId;
    // 💡 වෙනස් කළා: /academic/assignments
    const res = await apiClient.get<ApiResponse<any[]>>('/academic/assignments', { params });
    const rawData = res.data.data || [];
    return rawData.map((item: any) => ({
      ...item,
      id: item.id || item.assignmentId,
      date: item.assignedDate || item.date,
      activity: item.activity || {
        id: item.activityId,
        name: item.activityName || 'Unknown Activity',
        category: 'N/A',
        description: '',
      },
      teacherName: item.teacherName || 'Unknown Teacher',
      initials: item.teacherName ? item.teacherName.charAt(0).toUpperCase() : 'U',
    }));
  },

  assignActivity: async (
    data: AssignActivityRequest & { status?: string },
  ): Promise<Assignment> => {
    const payload = {
      teacherId: data.teacherId,
      staffId: data.teacherId,
      activityId: data.activityId,
      date: data.date,
      assignedDate: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      status: data.status || 'DRAFT',
    };
    const res = await apiClient.post<ApiResponse<any>>('/academic/assignments', payload);
    const item = res.data.data;
    return {
      ...item,
      id: item.id || item.assignmentId,
      date: item.assignedDate || item.date,
      activity: {
        id: item.activityId,
        name: item.activityName || 'Unknown Activity',
        category: '',
        description: '',
      },
      teacherName: item.teacherName || 'Unknown Teacher',
      initials: item.teacherName ? item.teacherName.charAt(0).toUpperCase() : 'U',
    } as Assignment;
  },

  updateAssignment: async (
    id: string,
    data: AssignActivityRequest & { status?: string },
  ): Promise<Assignment> => {
    const payload = {
      teacherId: data.teacherId,
      staffId: data.teacherId,
      activityId: data.activityId,
      date: data.date,
      assignedDate: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      status: data.status || 'DRAFT',
    };
    const res = await apiClient.put<ApiResponse<any>>(`/academic/assignments/${id}`, payload);
    const item = res.data.data;
    return {
      ...item,
      id: item.id || item.assignmentId,
      date: item.assignedDate || item.date,
      activity: {
        id: item.activityId,
        name: item.activityName || 'Unknown Activity',
        category: '',
        description: '',
      },
      teacherName: item.teacherName || 'Unknown Teacher',
      initials: item.teacherName ? item.teacherName.charAt(0).toUpperCase() : 'U',
    } as Assignment;
  },

  publishAssignment: async (id: string): Promise<Assignment> => {
    const res = await apiClient.put<ApiResponse<Assignment>>(`/academic/assignments/${id}/publish`);
    const item = res.data.data as any;
    return {
      ...item,
      id: item.id || item.assignmentId,
      date: item.assignedDate || item.date,
      activity: {
        id: item.activityId,
        name: item.activityName || 'Unknown Activity',
        category: '',
        description: '',
      },
      teacherName: item.teacherName || 'Unknown Teacher',
      initials: item.teacherName ? item.teacherName.charAt(0).toUpperCase() : 'U',
    } as Assignment;
  },

  deleteAssignment: async (id: string): Promise<void> => {
    await apiClient.delete(`/academic/assignments/${id}`);
  },

  logStudentProgress: async (data: StudentProgressDTO): Promise<void> => {
    await apiClient.post<ApiResponse<void>>('/academic/assignments/log-progress', data);
  },
};
