export interface IMealService {
  orderMeal(studentId: string, mealId: string): Promise<boolean>
}
