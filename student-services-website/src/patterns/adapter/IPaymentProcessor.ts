export interface IPaymentProcessor {
  processPayment(amount: number): boolean;
  refundPayment(transactionID: string): boolean;
  validatePayment(amount: number): boolean;
}
