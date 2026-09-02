export interface MealMenuCreateRequest {
  date: string; // YYYY-MM-DD
  breakfastDetails?: string;
  lunchDetails?: string;
  eveningSnackDetails?: string;
}

export interface WeeklyMenuRequest {
  menus: MealMenuCreateRequest[];
}

export interface MealMenuResponse {
  menuId: string;
  date: string;
  breakfastDetails: string;
  lunchDetails: string;
  eveningSnackDetails: string;
}
