export interface IPaymentService {
  processTransaction(studentID: string, amount: number, type: string, description: string): boolean;
}
