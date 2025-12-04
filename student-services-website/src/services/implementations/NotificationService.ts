import { INotificationService } from '../interfaces/INotificationService'
import { IRepository } from '../../repositories/IRepository'

export class NotificationService implements INotificationService {
  constructor(private repository: IRepository) {
    console.log('📧 NotificationService: Created');
  }

  async sendNotification(_studentId: string, _message: string): Promise<void> { }

  viewNotifications(studentId: string) {
    const notifications = localStorage.getItem('notifications');
    const allNotifications = notifications ? JSON.parse(notifications) : [];
    return allNotifications.filter((n: any) => n.studentID === studentId);
  }
}
