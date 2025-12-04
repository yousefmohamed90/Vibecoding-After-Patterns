export interface IAccommodationService {
  bookHousing(studentID: string, accommodationID: string): void;
  cancelBooking(studentID: string, bookingID: string): void;
  getAvailableAccommodations(): any[];
  getStudentBookings(studentID: string): any[];
}
