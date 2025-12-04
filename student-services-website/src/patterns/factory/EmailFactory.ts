import { INotificationFactory } from './INotificationFactory'
import { INotification } from './INotification'
import { EmailNotification } from './EmailNotification'

export class EmailFactory implements INotificationFactory {
  create(): INotification { return new EmailNotification() }
}
