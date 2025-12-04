import { IBookingState } from './IBookingState'

export class BookingContext {
  constructor(public state: IBookingState) {}
  setState(state: IBookingState) { this.state = state }
  request() { this.state.handle(this) }
}
