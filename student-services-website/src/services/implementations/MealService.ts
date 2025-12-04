import { IMealService } from '../interfaces/IMealService'
import { IRepository } from '../../repositories/IRepository'
import { IPaymentService } from '../interfaces/IPaymentService'

export class MealService implements IMealService {
  constructor(
    private repository: IRepository,
    private paymentService: IPaymentService
  ) {
    console.log('🍽️ MealService: Created');
  }

  async orderMeal(_studentId: string, _mealId: string) { return true; }

  getAvailableMeals() {
    const stored = localStorage.getItem('meals');
    return stored ? JSON.parse(stored) : [];
  }

  getStudentOrders(studentId: string) {
    const bookings = localStorage.getItem('bookings');
    const allBookings = bookings ? JSON.parse(bookings) : [];
    return allBookings.filter((b: any) => b.studentID === studentId && b.type === 'meal');
  }
}
