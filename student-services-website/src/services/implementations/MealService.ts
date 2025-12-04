import { IMealService } from '../interfaces/IMealService';
import { IRepository } from '../../repositories/IRepository';
import { IPaymentService } from '../interfaces/IPaymentService';
import { Booking } from '../../entities/Booking';
import { Meal } from '../../entities/Meal';

export class MealService implements IMealService {
  constructor(
    private repository: IRepository,
    private paymentService: IPaymentService
  ) {
    console.log('🍽️ MealService: Created');
  }

  selectMeal(studentID: string, mealType: string): void {
    console.log(`🍽️ MealService: Ordering meal ${mealType} for student ${studentID}`);

    const meals = this.repository.findByQuery({ type: mealType }, 'meals');
    if (meals.length === 0) {
      throw new Error('Meal not found');
    }

    const meal = meals[0];

    const paymentSuccess = this.paymentService.processTransaction(
      studentID,
      meal.price,
      'VISA',
      `Meal: ${meal.name}`
    );

    if (!paymentSuccess) {
      throw new Error('Payment failed');
    }

    const booking = new Booking(
      `booking_${Date.now()}`,
      studentID,
      meal.mealID,
      'MEAL',
      new Date(),
      'CONFIRMED',
      meal.price
    );

    this.repository.save(booking, 'bookings');
    console.log('✅ MealService: Meal ordered successfully');
  }

  cancelMeal(studentID: string, mealID: string): void {
    console.log(`🍽️ MealService: Cancelling meal ${mealID}`);

    const bookings = this.repository.findByQuery(
      { studentID, resourceID: mealID, resourceType: 'MEAL' },
      'bookings'
    );

    if (bookings.length === 0) {
      throw new Error('Meal booking not found');
    }

    const booking = bookings[0];
    booking.status = 'CANCELLED';
    this.repository.update(booking, 'bookings', 'bookingID');
    console.log('✅ MealService: Meal cancelled');
  }

  getAvailableMeals(): Meal[] {
    return this.repository.findAll('meals');
  }
}
