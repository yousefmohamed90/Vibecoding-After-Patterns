import { IPaymentService } from '../interfaces/IPaymentService'

import { IRepository } from '../../repositories/IRepository';
import { IPaymentProcessor } from '../../patterns/adapter/IPaymentProcessor';
import { Payment } from '../../entities/Payment';

export class PaymentService implements IPaymentService {
  constructor(
    private repository: IRepository,
    private processor: IPaymentProcessor
  ) {
    console.log('💰 PaymentService: Created');
  }

  async charge(userId: string, amount: number): Promise<boolean> {
    console.log(`💰 PaymentService: Processing payment of $${amount} for user ${userId}`);

    // Validate amount
    if (!this.processor.validatePayment(amount)) {
      throw new Error('Invalid payment amount');
    }

    // Process payment through payment processor
    const success = this.processor.processPayment(amount);

    if (success) {
      const payment = new Payment(
        `payment_${Date.now()}`,
        userId,
        amount,
        new Date(),
        'CARD',
        'COMPLETED',
        'Payment processed'
      );
      this.repository.save(payment, 'payments');
      console.log('✅ PaymentService: Payment successful and recorded');
    } else {
      const payment = new Payment(
        `payment_${Date.now()}`,
        userId,
        amount,
        new Date(),
        'CARD',
        'FAILED',
        'Payment failed'
      );
      this.repository.save(payment, 'payments');
      console.log('❌ PaymentService: Payment failed');
    }

    return success;
  }
}
