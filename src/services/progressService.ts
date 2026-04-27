/**
 * Progress Service
 * Handles API calls for progress data (children data, daily activities, engagement)
 * Currently uses mock data - will be replaced with real API calls
 */

import axiosInstance from './axiosInstance';
import type { ChildrenData, Activity, EngagementData } from '@/types/progress.types';

// Mock data - will be replaced with API calls
const MOCK_CHILDREN_DATA: Record<string, ChildrenData> = {
  C1: {
    id: 'C1',
    name: 'Emma Johnson',
    totalDays: 20,
    attendance: 18,
    activities: 45,
    mood: '😊',
    meals: 40,
    engagement: [12, 15, 10, 18, 14, 16, 11, 13, 17, 14, 12, 15, 10, 18, 14],
  },
  C2: {
    id: 'C2',
    name: 'Lucas Williams',
    totalDays: 20,
    attendance: 16,
    activities: 38,
    mood: '😊',
    meals: 35,
    engagement: [10, 14, 9, 16, 12, 15, 10, 12, 15, 13, 11, 14, 9, 16, 12],
  },
  C3: {
    id: 'C3',
    name: 'Sophia Davis',
    totalDays: 20,
    attendance: 19,
    activities: 52,
    mood: '🤩',
    meals: 42,
    engagement: [14, 18, 12, 20, 16, 18, 13, 15, 19, 16, 14, 17, 12, 20, 16],
  },
};

const MOCK_DAILY_ACTIVITIES: Activity[] = [
  {
    id: '1',
    title: 'Morning Circle',
    time: '09:00 AM',
    teacher: 'Ms. Sarah',
    role: 'Lead Teacher',
    studentsParticipated: 12,
  },
  {
    id: '2',
    title: 'Art & Craft',
    time: '10:30 AM',
    teacher: 'Mr. James',
    role: 'Activity Lead',
    studentsParticipated: 14,
  },
  {
    id: '3',
    title: 'Snack Time',
    time: '11:00 AM',
    teacher: 'Mrs. Linda',
    role: 'Nutrition Lead',
    studentsParticipated: 15,
  },
  {
    id: '4',
    title: 'Outdoor Play',
    time: '12:00 PM',
    teacher: 'Mr. Tom',
    role: 'Sports Lead',
    studentsParticipated: 13,
  },
  {
    id: '5',
    title: 'Lunch',
    time: '01:00 PM',
    teacher: 'Mrs. Linda',
    role: 'Nutrition Lead',
    studentsParticipated: 15,
  },
];

class ProgressService {
  /**
   * Get all children data
   * TODO: Replace with API call to GET /api/children
   */
  async getChildrenData(filter?: string): Promise<ChildrenData[]> {
    try {
      // Simulated API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // In production, replace with:
      // const response = await axiosInstance.get('/api/children', { params: { filter } });
      // return response.data;

      const childrenArray = Object.values(MOCK_CHILDREN_DATA);
      return filter
        ? childrenArray.filter((child) =>
            child.name.toLowerCase().includes(filter.toLowerCase())
          )
        : childrenArray;
    } catch (error) {
      console.error('Error fetching children data:', error);
      throw error;
    }
  }

  /**
   * Get specific child data by ID
   * TODO: Replace with API call to GET /api/children/:childId
   */
  async getChildData(childId: string): Promise<ChildrenData | null> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      // In production:
      // const response = await axiosInstance.get(`/api/children/${childId}`);
      // return response.data;

      return MOCK_CHILDREN_DATA[childId] || null;
    } catch (error) {
      console.error('Error fetching child data:', error);
      throw error;
    }
  }

  /**
   * Get daily activities for a specific date
   * TODO: Replace with API call to GET /api/activities?date=YYYY-MM-DD
   */
  async getDailyActivities(childId: string, date: string): Promise<Activity[]> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      // In production:
      // const response = await axiosInstance.get('/api/activities', {
      //   params: { childId, date }
      // });
      // return response.data;

      return MOCK_DAILY_ACTIVITIES;
    } catch (error) {
      console.error('Error fetching daily activities:', error);
      throw error;
    }
  }

  /**
   * Get engagement data for a child within a date range
   * TODO: Replace with API call to GET /api/engagement?childId=X&startDate=Y&endDate=Z
   */
  async getEngagementData(
    childId: string,
    startDate: string,
    endDate: string
  ): Promise<EngagementData[]> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      // In production:
      // const response = await axiosInstance.get('/api/engagement', {
      //   params: { childId, startDate, endDate }
      // });
      // return response.data;

      const child = MOCK_CHILDREN_DATA[childId];
      if (!child) return [];

      const dates = this.getDatesInRange(startDate, endDate);
      return dates.map((date, index) => ({
        name: date,
        value: child.engagement[index % child.engagement.length] || 0,
      }));
    } catch (error) {
      console.error('Error fetching engagement data:', error);
      throw error;
    }
  }

  /**
   * Helper: Generate array of dates between start and end
   */
  private getDatesInRange(start: string, end: string): string[] {
    const dates = [];
    let curr = new Date(start);
    const stop = new Date(end);
    while (curr <= stop) {
      dates.push(curr.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }));
      curr = new Date(curr.getTime() + 24 * 60 * 60 * 1000);
    }
    return dates;
  }
}

export default new ProgressService();
