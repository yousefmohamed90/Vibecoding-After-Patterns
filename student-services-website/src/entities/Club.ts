export class Club {
  constructor(
    public clubID: string,
    public name: string,
    public description: string,
    public membershipFee: number,
    public memberCount?: number,
    public category?: string,
    public meetingSchedule?: string
  ) { }
}
