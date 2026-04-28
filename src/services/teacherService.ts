/**
 * Teacher Service
 * Handles API calls for teacher dashboard data
 * Currently uses mock data - will be replaced with real API calls
 */

import axiosInstance from './axiosInstance';
import type {
  Schedule,
  ActivityLog,
  ClassStatus,
  SafetyAlert,
  ParentComm,
  TeacherProfile,
  FilterOptions,
} from '@/types/teacher.types';
import {
  SCHEDULE_DATA,
  LOGS_DATA,
  CLASS_STATUS,
  SAFETY_ALERTS,
  PARENT_COMMS,
  mockTeacherProfile,
} from '@/shared/mock/progressMockData';

// Mock data will be fetched from progressMockData

class TeacherService {
  /**
   * Get complete teacher dashboard data
   * TODO: Replace with API call to GET /api/teacher/dashboard
   */
  async getTeacherDashboard(): Promise<{
    schedule: Schedule[];
    classStatus: ClassStatus;
    safetyAlerts: SafetyAlert[];
    parentComms: ParentComm[];
    profile: TeacherProfile;
  }> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In production:
      // const response = await axiosInstance.get('/api/teacher/dashboard');
      // return response.data;

      return {
        schedule: SCHEDULE_DATA.map(s => ({ ...s, id: String(s.id) })) as Schedule[],
        classStatus: CLASS_STATUS,
        safetyAlerts: SAFETY_ALERTS.map(a => ({ ...a, id: String(a.id) })) as SafetyAlert[],
        parentComms: PARENT_COMMS.map(c => ({ ...c, id: String(c.id) })) as ParentComm[],
        profile: mockTeacherProfile as TeacherProfile,
      };
    } catch (error) {
      console.error('Error fetching teacher dashboard:', error);
      throw error;
    }
  }

  /**
   * Get activity logs with optional filtering and sorting
   * TODO: Replace with API call to GET /api/activity-logs with query params
   */
  async getActivityLogs(options?: FilterOptions): Promise<ActivityLog[]> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      // In production:
      // const response = await axiosInstance.get('/api/activity-logs', {
      //   params: options
      // });
      // return response.data;

      let filtered = LOGS_DATA.map(l => ({ ...l, id: String(l.id) })) as ActivityLog[];

      // Apply filters
      if (options?.searchQuery && options.searchQuery.trim() !== '') {
        const query = options.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (log) =>
            log.studentName.toLowerCase().includes(query) ||
            log.tag.toLowerCase().includes(query) ||
            log.actionText.toLowerCase().includes(query)
        );
      }

      if (options?.activeFilter && options.activeFilter !== 'All') {
        filtered = filtered.filter((log) => log.tag === options.activeFilter);
      }

      // Apply sorting
      if (options?.sortOption === 'Name (A-Z)') {
        filtered.sort((a, b) => a.studentName.localeCompare(b.studentName));
      } else if (options?.sortOption === 'Time (Oldest)') {
        filtered.sort((a, b) => a.timestamp - b.timestamp);
      } else {
        // Default: Time (Newest)
        filtered.sort((a, b) => b.timestamp - a.timestamp);
      }

      return filtered;
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      throw error;
    }
  }

  /**
   * Get class status
   * TODO: Replace with API call to GET /api/class/status
   */
  async getClassStatus(): Promise<ClassStatus> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));

      // In production:
      // const response = await axiosInstance.get('/api/class/status');
      // return response.data;

      return CLASS_STATUS;
    } catch (error) {
      console.error('Error fetching class status:', error);
      throw error;
    }
  }

  /**
   * Get safety alerts
   * TODO: Replace with API call to GET /api/safety-alerts
   */
  async getSafetyAlerts(): Promise<SafetyAlert[]> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));

      // In production:
      // const response = await axiosInstance.get('/api/safety-alerts');
      // return response.data;

      return SAFETY_ALERTS.map(a => ({ ...a, id: String(a.id) })) as SafetyAlert[];
    } catch (error) {
      console.error('Error fetching safety alerts:', error);
      throw error;
    }
  }

  /**
   * Get parent communications
   * TODO: Replace with API call to GET /api/parent-communications
   */
  async getParentCommunications(): Promise<ParentComm[]> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));

      // In production:
      // const response = await axiosInstance.get('/api/parent-communications');
      // return response.data;

      return PARENT_COMMS.map(c => ({ ...c, id: String(c.id) })) as ParentComm[];
    } catch (error) {
      console.error('Error fetching parent communications:', error);
      throw error;
    }
  }
}

export default new TeacherService();
