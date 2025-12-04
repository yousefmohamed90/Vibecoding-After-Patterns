import { IClubService } from '../interfaces/IClubService'
import { IRepository } from '../../repositories/IRepository'
import { IPaymentService } from '../interfaces/IPaymentService'

export class ClubService implements IClubService {
  constructor(
    private repository: IRepository,
    private paymentService: IPaymentService
  ) {
    console.log('👥 ClubService: Created');
  }

  async joinClub(_studentId: string, _clubId: string) { return true; }

  getAvailableClubs() {
    const stored = localStorage.getItem('clubs');
    return stored ? JSON.parse(stored) : [];
  }

  getStudentMemberships(studentId: string) {
    const bookings = localStorage.getItem('bookings');
    const allBookings = bookings ? JSON.parse(bookings) : [];
    return allBookings.filter((b: any) => b.studentID === studentId && b.type === 'club');
  }
}
