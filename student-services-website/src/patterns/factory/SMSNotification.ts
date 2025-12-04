import { INotification } from './INotification'

export class SMSNotification implements INotification {
  async send(message: string) { /* send sms */ }
}
