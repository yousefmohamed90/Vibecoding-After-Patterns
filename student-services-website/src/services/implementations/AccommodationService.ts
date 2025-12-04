import { IAccommodationService } from '../interfaces/IAccommodationService'
import { IRepository } from '../../repositories/IRepository'
import { IPaymentService } from '../interfaces/IPaymentService'

export class AccommodationService implements IAccommodationService {
  constructor(
    private repository: IRepository,
    private paymentService: IPaymentService
  ) {
    console.log('🏨 AccommodationService: Created');
  }

  async bookAccommodation(studentId: string, accommodationId: string) {
    console.log(`🏨 AccommodationService: Booking accommodation ${accommodationId} for student ${studentId}`);
    return true;
  }

  getAvailableAccommodations() {
    const stored = localStorage.getItem('accommodations');
    return stored ? JSON.parse(stored) : [];
  }

  getStudentBookings(studentId: string) {
    const bookings = localStorage.getItem('bookings');
    const allBookings = bookings ? JSON.parse(bookings) : [];
    return allBookings.filter((b: any) => b.studentID === studentId);
  }
}
