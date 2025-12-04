import { IAccommodationService } from '../interfaces/IAccommodationService';
import { IRepository } from '../../repositories/IRepository';
import { IPaymentService } from '../interfaces/IPaymentService';
import { Booking } from '../../entities/Booking';
import { Accommodation } from '../../entities/Accommodation';

export class AccommodationService implements IAccommodationService {
  constructor(
    private repository: IRepository,
    private paymentService: IPaymentService
  ) {
    console.log('🏠 AccommodationService: Created');
  }

  bookHousing(studentID: string, accommodationID: string): void {
    console.log(`🏠 AccommodationService: Booking accommodation ${accommodationID} for student ${studentID}`);

    // Find accommodation
    const accommodation = this.repository.findById(accommodationID, 'accommodations', 'accommodationID');
    if (!accommodation) {
      throw new Error('Accommodation not found');
    }

    // Process payment
    const paymentSuccess = this.paymentService.processTransaction(
      studentID,
      accommodation.pricePerNight,
      'VISA',
      `Accommodation: ${accommodation.name}`
    );

    if (!paymentSuccess) {
      throw new Error('Payment failed');
    }

    // Create booking
    const booking = new Booking(
      `booking_${Date.now()}`,
      studentID,
      accommodationID,
      'ACCOMMODATION',
      new Date(),
      'PENDING',
      accommodation.pricePerNight
    );

    this.repository.save(booking, 'bookings');
    console.log('✅ AccommodationService: Booking created successfully');
  }

  cancelBooking(studentID: string, bookingID: string): void {
    console.log(`🏠 AccommodationService: Cancelling booking ${bookingID}`);

    const booking = this.repository.findById(bookingID, 'bookings', 'bookingID');
    if (!booking || booking.studentID !== studentID) {
      throw new Error('Booking not found or unauthorized');
    }

    booking.status = 'CANCELLED';
    this.repository.update(booking, 'bookings', 'bookingID');
    console.log('✅ AccommodationService: Booking cancelled');
  }

  getAvailableAccommodations(): Accommodation[] {
    return this.repository.findAll('accommodations');
  }

  getStudentBookings(studentID: string): Booking[] {
    return this.repository.findByQuery(
      { studentID, resourceType: 'ACCOMMODATION' },
      'bookings'
    );
  }
}
