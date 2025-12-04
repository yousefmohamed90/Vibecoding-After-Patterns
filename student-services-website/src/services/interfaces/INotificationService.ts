export interface INotificationService {
  sendNotification(userId: string, message: string): Promise<void>
}
