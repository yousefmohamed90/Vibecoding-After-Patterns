import { INotificationFactory } from './INotificationFactory'
import { INotification } from './INotification'
import { SMSNotification } from './SMSNotification'

export class SMSFactory implements INotificationFactory {
  create(): INotification { return new SMSNotification() }
}
