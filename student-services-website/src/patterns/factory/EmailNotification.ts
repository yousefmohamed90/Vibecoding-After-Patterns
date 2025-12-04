import { INotification } from './INotification'

export class EmailNotification implements INotification {
  async send(message: string) { /* send email */ }
}
