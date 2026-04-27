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

// Mock data - will be replaced with API calls
const MOCK_SCHEDULE_DATA: Schedule[] = [
  {
    id: '1',
    time: '09:00 - 09:30',
    title: 'Morning Circle',
    desc: 'Group gathering and morning activities',
    colorType: 'blue',
    icon: '🌅',
  },
  {
    id: '2',
    time: '10:00 - 11:00',
    title: 'Arts & Crafts',
    desc: 'Creative activities and projects',
    colorType: 'orange',
    icon: '🎨',
  },
  {
    id: '3',
    time: '11:30 - 12:00',
    title: 'Snack Break',
    desc: 'Nutrition and hydration time',
    colorType: 'purple',
    icon: '🥗',
  },
  {
    id: '4',
    time: '01:00 - 02:00',
    title: 'Outdoor Play',
    desc: 'Physical activity in outdoor space',
    colorType: 'blue',
    icon: '⚽',
  },
  {
    id: '5',
    time: '02:30 - 03:00',
    title: 'Story Time',
    desc: 'Reading and storytelling session',
    colorType: 'purple',
    icon: '📚',
  },
  {
    id: '6',
    time: '03:30 - 04:00',
    title: 'Wrap Up',
    desc: 'End of day activities and dismissal',
    colorType: 'orange',
    icon: '👋',
  },
];

const MOCK_LOGS_DATA: ActivityLog[] = [
  {
    id: '1',
    studentName: 'Emma Johnson',
    tag: 'ACTIVITY',
    actionText: 'participated in art class',
    time: '10:30 AM',
    timestamp: Date.now() - 60000,
    icon: '🎨',
    iconColor: '#f59e0b',
  },
  {
    id: '2',
    studentName: 'Lucas Williams',
    tag: 'MEALS',
    actionText: 'had lunch',
    time: '1:00 PM',
    timestamp: Date.now() - 120000,
    icon: '🍽️',
    iconColor: '#20c997',
  },
  {
    id: '3',
    studentName: 'Sophia Davis',
    tag: 'ACTIVITY',
    actionText: 'finished outdoor play',
    time: '2:00 PM',
    timestamp: Date.now() - 180000,
    icon: '⚽',
    iconColor: '#3b82f6',
  },
  {
    id: '4',
    studentName: 'Noah Martinez',
    tag: 'ATTENDANCE',
    actionText: 'checked in',
    time: '9:00 AM',
    timestamp: Date.now() - 240000,
    icon: '✓',
    iconColor: '#20c997',
  },
  {
    id: '5',
    studentName: 'Ava Garcia',
    tag: 'MEALS',
    actionText: 'snack break',
    time: '11:00 AM',
    timestamp: Date.now() - 300000,
    icon: '🥗',
    iconColor: '#8b5cf6',
  },
];

const MOCK_CLASS_STATUS: ClassStatus = {
  checkedIn: 14,
  expected: 15,
  attendance: 93,
};

const MOCK_SAFETY_ALERTS: SafetyAlert[] = [
  {
    id: '1',
    title: 'One child missing from group during outdoor play',
    colorType: 'orange',
  },
  {
    id: '2',
    title: 'Temperature check needed for Lucas',
    colorType: 'blue',
  },
];

const MOCK_PARENT_COMMS: ParentComm[] = [
  {
    id: '1',
    parentName: 'Sarah (Emma\'s mom)',
    message: 'Thank you for the update on Emma\'s progress!',
    avatarBg: '#dbeafe',
    avatarFill: '#0284c7',
  },
  {
    id: '2',
    parentName: 'James (Lucas\'s dad)',
    message: 'Can Lucas stay for extended hours today?',
    avatarBg: '#fce7f3',
    avatarFill: '#ec4899',
  },
  {
    id: '3',
    parentName: 'Maria (Sophia\'s mom)',
    message: 'Sophia mentioned the art project today. Great job!',
    avatarBg: '#f0fdf4',
    avatarFill: '#22c55e',
  },
];

const MOCK_TEACHER_PROFILE: TeacherProfile = {
  name: 'Mrs. Emily Johnson',
  classroom: 'Room 3 (Ages 4-5)',
};

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
        schedule: MOCK_SCHEDULE_DATA,
        classStatus: MOCK_CLASS_STATUS,
        safetyAlerts: MOCK_SAFETY_ALERTS,
        parentComms: MOCK_PARENT_COMMS,
        profile: MOCK_TEACHER_PROFILE,
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

      let filtered = [...MOCK_LOGS_DATA];

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

      return MOCK_CLASS_STATUS;
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

      return MOCK_SAFETY_ALERTS;
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

      return MOCK_PARENT_COMMS;
    } catch (error) {
      console.error('Error fetching parent communications:', error);
      throw error;
    }
  }
}

export default new TeacherService();
