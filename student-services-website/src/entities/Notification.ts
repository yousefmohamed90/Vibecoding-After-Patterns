export class Notification {
  constructor(
    public notificationID: string,
    public recipientID: string,
    public message: string,
    public dateSent: Date,
    public isRead: boolean = false,
    public type?: 'EMAIL' | 'SMS' | 'SYSTEM'
  ) { }
}
