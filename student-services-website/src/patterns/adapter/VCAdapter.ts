import { IPaymentProcessor } from './IPaymentProcessor';
import { VCPayment } from './VCPayment';

export class VCAdapter extends VCPayment implements IPaymentProcessor {
  processPayment(amount: number): boolean {
    console.log(`🔌 VCAdapter: Adapting payment request (Adapter Pattern)`);
    // Adapt the interface
    const hash = btoa(`transaction_${Date.now()}`);
    return this.sendVirtualCoins(amount, 'USD', hash);
  }

  refundPayment(transactionID: string): boolean {
    console.log(`🔌 VCAdapter: Adapting refund request`);
    // Simulate refund through virtual coins
    return true;
  }

  validatePayment(amount: number): boolean {
    return amount > 0;
  }
}
