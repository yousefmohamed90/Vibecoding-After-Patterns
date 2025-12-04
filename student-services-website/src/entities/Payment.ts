export class Payment {
  constructor(
    public paymentID: string,
    public studentID: string,
    public amount: number,
    public date: Date,
    public paymentMethod: string,
    public status: string,
    public description?: string
  ) {}
}
