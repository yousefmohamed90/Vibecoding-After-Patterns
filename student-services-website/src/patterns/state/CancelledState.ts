import { IBookingState } from './IBookingState';

export class CancelledState implements IBookingState {
    printStatus(): string {
        return 'CANCELLED';
    }

    next(context: any): void {
        console.log('⚠️ Cannot proceed from CANCELLED state');
    }

    prev(context: any): void {
        console.log('⚠️ Cannot go back from CANCELLED state');
    }
}
