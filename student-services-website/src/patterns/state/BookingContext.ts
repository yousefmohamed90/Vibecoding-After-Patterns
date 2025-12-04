import { IBookingState } from './IBookingState';

// State Pattern: Context that manages booking state transitions
export class BookingContext {
  private state: IBookingState;

  constructor(initialState: IBookingState) {
    this.state = initialState;
    console.log(`📋 BookingContext: Initialized with ${this.state.printStatus()} state`);
  }

  setState(state: IBookingState): void {
    this.state = state;
    console.log(`📋 BookingContext: State changed to ${this.state.printStatus()}`);
  }

  requestNext(): void {
    this.state.next(this);
  }

  requestPrev(): void {
    this.state.prev(this);
  }

  printStatus(): string {
    return this.state.printStatus();
  }
}
