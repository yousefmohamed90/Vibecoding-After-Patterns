import { IClubService } from '../interfaces/IClubService';
import { IRepository } from '../../repositories/IRepository';
import { IPaymentService } from '../interfaces/IPaymentService';
import { Booking } from '../../entities/Booking';
import { Club } from '../../entities/Club';

export class ClubService implements IClubService {
  constructor(
    private repository: IRepository,
    private paymentService: IPaymentService
  ) {
    console.log('🎭 ClubService: Created');
  }

  chooseClub(studentID: string, clubID: string): void {
    console.log(`🎭 ClubService: Joining club ${clubID} for student ${studentID}`);

    const club = this.repository.findById(clubID, 'clubs', 'clubID');
    if (!club) {
      throw new Error('Club not found');
    }

    const paymentSuccess = this.paymentService.processTransaction(
      studentID,
      club.membershipFee,
      'VISA',
      `Club Membership: ${club.name}`
    );

    if (!paymentSuccess) {
      throw new Error('Payment failed');
    }

    const booking = new Booking(
      `booking_${Date.now()}`,
      studentID,
      clubID,
      'CLUB',
      new Date(),
      'CONFIRMED',
      club.membershipFee
    );

    this.repository.save(booking, 'bookings');
    console.log('✅ ClubService: Club membership created');
  }

  cancelClubMembership(studentID: string, clubID: string): void {
    console.log(`🎭 ClubService: Cancelling club membership ${clubID}`);

    const bookings = this.repository.findByQuery(
      { studentID, resourceID: clubID, resourceType: 'CLUB' },
      'bookings'
    );

    if (bookings.length === 0) {
      throw new Error('Club membership not found');
    }

    const booking = bookings[0];
    booking.status = 'CANCELLED';
    this.repository.update(booking, 'bookings', 'bookingID');
    console.log('✅ ClubService: Club membership cancelled');
  }

  getAvailableClubs(): Club[] {
    return this.repository.findAll('clubs');
  }

  getStudentMemberships(studentID: string): Booking[] {
    return this.repository.findByQuery(
      { studentID, resourceType: 'CLUB' },
      'bookings'
    );
  }
}
