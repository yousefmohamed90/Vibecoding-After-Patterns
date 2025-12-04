import { IPaymentService } from '../interfaces/IPaymentService';
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

  processTransaction(
    studentID: string,
    amount: number,
    type: string,
    description: string
  ): boolean {
    console.log(`💰 PaymentService: Processing transaction for student ${studentID}`);

    // Validate amount
    if (!this.processor.validatePayment(amount)) {
      throw new Error('Invalid payment amount');
    }

    // Process payment through payment processor (Strategy Pattern)
    const success = this.processor.processPayment(amount);

    if (success) {
      // Save payment record
      const payment = new Payment(
        `payment_${Date.now()}`,
        studentID,
        amount,
        new Date(),
        type,
        'COMPLETED',
        description
      );

      this.repository.save(payment, 'payments');
      console.log('✅ PaymentService: Payment successful and recorded');
    } else {
      // Save failed payment
      const payment = new Payment(
        `payment_${Date.now()}`,
        studentID,
        amount,
        new Date(),
        type,
        'FAILED',
        description
      );

      this.repository.save(payment, 'payments');
      console.log('❌ PaymentService: Payment failed');
    }

    return success;
  }
}
