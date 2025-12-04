export interface IPaymentService {
  charge(userId: string, amount: number): Promise<boolean>
}
