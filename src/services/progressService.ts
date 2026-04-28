/**
 * Progress Service
 * Handles API calls for progress data (children data, daily activities, engagement)
 * Currently uses mock data - will be replaced with real API calls
 */

import axiosInstance from './axiosInstance';
import type { ChildrenData, Activity, EngagementData } from '@/types/progress.types';
import { childrenData, adminDailyActivities } from '@/shared/mock/progressMockData';

// Mock data will be fetched from progressMockData

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

      const childrenArray = Object.entries(childrenData).map(([id, data]) => ({
        id,
        ...data,
        mood: String(data.mood),
        meals: data.meals === 'full' ? 100 : data.meals === 'partial' ? 50 : 0, // Mapping string to numeric for existing type
      })) as ChildrenData[];

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

      const data = childrenData[childId];
      if (!data) return null;
      return {
        id: childId,
        ...data,
        mood: String(data.mood),
        meals: data.meals === 'full' ? 100 : data.meals === 'partial' ? 50 : 0,
      } as ChildrenData;
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

      return adminDailyActivities.map(a => ({
        ...a,
        role: a.role as string,
      })) as Activity[];
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

      const child = childrenData[childId];
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
