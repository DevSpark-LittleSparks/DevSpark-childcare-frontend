import { apiClient } from './axiosInstance';
import type { WeeklyMenuRequest, MealMenuResponse } from '../types/meal.types';
import type { ApiResponse } from '../types/shared.types';

// Exported type for Teacher's consumption logs to ensure strict typing
export interface ConsumptionLogResponse {
  childId: string;
  menuId: string;
  mealType: 'BREAKFAST' | 'LUNCH' | 'EVENING_SNACK';
  consumptionStatus: 'FULL_MEAL' | 'PARTIAL' | 'ATE_NONE';
  note: string;
}

export const mealService = {
  // ==========================================
  // ADMIN SIDE: Menu Planning Functions
  // ==========================================

  publishWeeklyMenu: async (data: WeeklyMenuRequest): Promise<MealMenuResponse[]> => {
    const res = await apiClient.post<ApiResponse<MealMenuResponse[]>>('/api/v1/meals/menu', data);
    return res.data.data;
  },

  getWeeklyMenu: async (startDate: string, endDate: string): Promise<MealMenuResponse[]> => {
    const res = await apiClient.get<ApiResponse<MealMenuResponse[]>>('/api/v1/meals/menu', {
      params: { startDate, endDate },
    });
    return res.data.data;
  },

  // ==========================================
  // TEACHER SIDE: Meal Tracking Functions
  // ==========================================

  // Submits the bulk tracking data to the backend
  saveConsumptionLogs: async (data: unknown): Promise<void> => {
    await apiClient.post('/api/v1/meals/consumption/bulk', data);
  },

  // Fetches today's menu for the top display cards on the Teacher UI
  getMenuByDate: async (date: string): Promise<MealMenuResponse[]> => {
    const res = await apiClient.get<ApiResponse<MealMenuResponse[]>>('/api/v1/meals/menu', {
      params: { startDate: date, endDate: date },
    });
    return res.data.data;
  },
  // අලුත් ළමයි ගන්න Endpoint එක
  getStudentsForMeals: async (date: string) => {
    // Axios instance එක හරහා අර අපි Backend එකේ හදපු අලුත් API එකට කතා කරනවා
    const res = await apiClient.get(`/api/v1/meals/consumption/students`, {
      params: { date },
    });
    return res.data.data;
  },

  // 💡 THIS WAS MISSING! Fetches existing logs for the selected date to enable editing
  getConsumptionLogs: async (date: string): Promise<ConsumptionLogResponse[]> => {
    const res = await apiClient.get<ApiResponse<ConsumptionLogResponse[]>>('/api/v1/meals/consumption', {
      params: { date },
    });
    return res.data.data;
  },
};
