import { apiClient } from './axiosInstance';
import type { ChildAttendanceDTO, BulkAttendanceRequestDTO } from '../types/attendance.types';
import type { ApiResponse } from '../types/shared.types';

export const attendanceService = {
  // Matches @GetMapping("/date/{date}")
  getByDate: async (date: string): Promise<ChildAttendanceDTO[]> => {
    const res = await apiClient.get<ApiResponse<ChildAttendanceDTO[]>>(`/attendance/date/${date}`);
    return res.data.data;
  },

  // Matches @PostMapping("/bulk")
  saveBulk: async (payload: BulkAttendanceRequestDTO): Promise<void> => {
    await apiClient.post('/attendance/bulk', payload);
  },
};
