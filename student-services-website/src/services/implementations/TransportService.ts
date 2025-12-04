import { ITransportService } from '../interfaces/ITransportService'
import { IRepository } from '../../repositories/IRepository'
import { IPaymentService } from '../interfaces/IPaymentService'

export class TransportService implements ITransportService {
  constructor(
    private repository: IRepository,
    private paymentService: IPaymentService
  ) {
    console.log('🚌 TransportService: Created');
  }

  async requestTransport(_studentId: string, _details: any) { return true }

  getAvailableTransport() {
    const stored = localStorage.getItem('transport');
    return stored ? JSON.parse(stored) : [];
  }

  getStudentBookings(studentId: string) {
    const bookings = localStorage.getItem('bookings');
    const allBookings = bookings ? JSON.parse(bookings) : [];
    return allBookings.filter((b: any) => b.studentID === studentId && b.type === 'transport');
  }
}
