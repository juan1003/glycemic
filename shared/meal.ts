export interface MealItem {
  food: string;
  gi: number;
  carbs: number;
  gl: number;
}

export interface Prediction {
  initialSugar: number;
  estimatedRise: number;
  predictedSugar: number;
  status: string;
}

export interface MealSummary {
  mealData: MealItem[];
  totalGL: string;
  totalCarbs: number;
  prediction: Prediction | null;
}

export interface CalculateSuccessResponse {
  success: true;
  summary: MealSummary;
  disclaimer: string;
}

export interface CalculateErrorResponse {
  success?: false;
  error: string;
}

export type CalculateResponse = CalculateSuccessResponse | CalculateErrorResponse;
