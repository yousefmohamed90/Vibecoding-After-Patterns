export interface ITransportService {
  bookTransport(studentID: string, transportID: string): void;
  cancelBooking(studentID: string, bookingID: string): void;
  getAvailableTransport(): any[];
  getStudentBookings(studentID: string): any[];
}
