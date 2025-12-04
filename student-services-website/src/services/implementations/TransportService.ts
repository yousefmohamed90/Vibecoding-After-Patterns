import { ITransportService } from '../interfaces/ITransportService';
import { IRepository } from '../../repositories/IRepository';
import { IPaymentService } from '../interfaces/IPaymentService';
import { Booking } from '../../entities/Booking';
import { Transport } from '../../entities/Transport';

export class TransportService implements ITransportService {
  constructor(
    private repository: IRepository,
    private paymentService: IPaymentService
  ) {
    console.log('🚌 TransportService: Created');
  }

  bookTransport(studentID: string, transportID: string): void {
    console.log(`🚌 TransportService: Booking transport ${transportID} for student ${studentID}`);

    const transport = this.repository.findById(transportID, 'transport', 'transportID');
    if (!transport) {
      throw new Error('Transport not found');
    }

    if (transport.seatsAvailable <= 0) {
      throw new Error('No seats available');
    }

    const paymentSuccess = this.paymentService.processTransaction(
      studentID,
      transport.pricePerSeat,
      'VISA',
      `Transport: ${transport.type}`
    );

    if (!paymentSuccess) {
      throw new Error('Payment failed');
    }

    const booking = new Booking(
      `booking_${Date.now()}`,
      studentID,
      transportID,
      'TRANSPORT',
      new Date(),
      'PENDING',
      transport.pricePerSeat
    );

    this.repository.save(booking, 'bookings');

    // Update available seats
    transport.seatsAvailable -= 1;
    this.repository.update(transport, 'transport', 'transportID');

    console.log('✅ TransportService: Transport booked successfully');
  }

  cancelBooking(studentID: string, bookingID: string): void {
    console.log(`🚌 TransportService: Cancelling booking ${bookingID}`);

    const booking = this.repository.findById(bookingID, 'bookings', 'bookingID');
    if (!booking || booking.studentID !== studentID) {
      throw new Error('Booking not found or unauthorized');
    }

    booking.status = 'CANCELLED';
    this.repository.update(booking, 'bookings', 'bookingID');

    // Restore seat
    const transport = this.repository.findById(booking.resourceID, 'transport', 'transportID');
    if (transport) {
      transport.seatsAvailable += 1;
      this.repository.update(transport, 'transport', 'transportID');
    }

    console.log('✅ TransportService: Booking cancelled');
  }

  getAvailableTransport(): Transport[] {
    return this.repository.findAll('transport');
  }

  getStudentBookings(studentID: string): Booking[] {
    return this.repository.findByQuery(
      { studentID, resourceType: 'TRANSPORT' },
      'bookings'
    );
  }
}
