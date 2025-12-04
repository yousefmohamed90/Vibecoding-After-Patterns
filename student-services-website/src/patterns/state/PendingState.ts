import { IBookingState } from './IBookingState';

export class PendingState implements IBookingState {
    printStatus(): string {
        return 'PENDING';
    }

    next(context: any): void {
        console.log('📋 State Transition: PENDING → CONFIRMED');
        const { ConfirmedState } = require('./ConfirmedState');
        context.setState(new ConfirmedState());
    }

    prev(context: any): void {
        console.log('⚠️ Cannot go back from PENDING state');
    }
}
