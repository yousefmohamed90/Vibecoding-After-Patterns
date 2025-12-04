import { INotificationService } from '../interfaces/INotificationService';
import { IRepository } from '../../repositories/IRepository';
import { Notification } from '../../entities/Notification';

export class NotificationService implements INotificationService {
  constructor(private repository: IRepository) {
    console.log('📬 NotificationService: Created');
  }

  sendNotification(recipientID: string, message: string, type: 'EMAIL' | 'SMS' | 'SYSTEM'): void {
    console.log(`📬 NotificationService: Sending ${type} notification to ${recipientID}`);

    const notification = new Notification(
      `notification_${Date.now()}`,
      recipientID,
      message,
      new Date(),
      false,
      type
    );

    this.repository.save(notification, 'notifications');
    console.log('✅ NotificationService: Notification sent');
  }

  viewNotifications(userID: string): Notification[] {
    return this.repository.findByQuery({ recipientID: userID }, 'notifications');
  }

  markAsRead(notificationID: string): void {
    const notification = this.repository.findById(notificationID, 'notifications', 'notificationID');
    if (notification) {
      notification.isRead = true;
      this.repository.update(notification, 'notifications', 'notificationID');
      console.log('✅ NotificationService: Notification marked as read');
    }
  }
}
