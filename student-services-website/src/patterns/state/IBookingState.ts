// State Pattern: Booking State Interface
export interface IBookingState {
    printStatus(): string;
    next(context: any): void;
    prev(context: any): void;
}
