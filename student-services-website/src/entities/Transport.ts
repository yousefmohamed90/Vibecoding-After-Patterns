export class Transport {
  constructor(
    public transportID: string,
    public type: string,
    public schedule: string,
    public seatsAvailable: number,
    public pricePerSeat: number,
    public route?: string,
    public departureTime?: string
  ) {}
}
