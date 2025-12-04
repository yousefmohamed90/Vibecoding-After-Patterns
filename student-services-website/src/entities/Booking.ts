export class Booking {
  constructor(
    public bookingID: string,
    public studentID: string,
    public resourceID: string,
    public resourceType: 'ACCOMMODATION' | 'TRANSPORT' | 'MEAL' | 'CLUB',
    public bookingDate: Date,
    public status: 'PENDING' | 'CONFIRMED' | 'CANCELLED',
    public totalAmount: number
  ) { }
}
