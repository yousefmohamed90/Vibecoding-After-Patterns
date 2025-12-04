import { IBookingState } from './IBookingState';

export class ConfirmedState implements IBookingState {
    printStatus(): string {
        return 'CONFIRMED';
    }

    next(context: any): void {
        console.log('📋 State Transition: CONFIRMED → CANCELLED');
        const { CancelledState } = require('./CancelledState');
        context.setState(new CancelledState());
    }

    prev(context: any): void {
        console.log('📋 State Transition: CONFIRMED → PENDING');
        const { PendingState } = require('./PendingState');
        context.setState(new PendingState());
    }
}
