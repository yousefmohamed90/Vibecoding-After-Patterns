import { IPaymentProcessor } from './IPaymentProcessor';

export class VisaPayment implements IPaymentProcessor {
	private apiKey: string = 'visa_api_key_123';

	processPayment(amount: number): boolean {
		console.log(`💳 VisaPayment: Processing payment of $${amount}`);
		// Simulate API call
		const success = amount > 0 && amount < 10000;
		console.log(`${success ? '✅' : '❌'} VisaPayment: Payment ${success ? 'successful' : 'failed'}`);
		return success;
	}

	refundPayment(transactionID: string): boolean {
		console.log(`💳 VisaPayment: Refunding transaction ${transactionID}`);
		return true;
	}

	validatePayment(amount: number): boolean {
		return amount > 0 && amount < 10000;
	}
}
