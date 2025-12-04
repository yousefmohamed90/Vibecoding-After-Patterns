import { Notification } from '../../entities/Notification';

export interface INotificationService {
  sendNotification(recipientID: string, message: string, type: 'EMAIL' | 'SMS' | 'SYSTEM'): void;
  viewNotifications(userID: string): Notification[];
  markAsRead(notificationID: string): void;
}
