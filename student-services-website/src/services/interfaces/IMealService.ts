export interface IMealService {
  selectMeal(studentID: string, mealType: string): void;
  cancelMeal(studentID: string, mealID: string): void;
  getAvailableMeals(): any[];
}
