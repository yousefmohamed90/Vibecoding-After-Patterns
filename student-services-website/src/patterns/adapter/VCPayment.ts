export class VCPayment {
	sendVirtualCoins(amt: number, cur: string, hash: string): boolean {
		console.log(`🪙 VCPayment: Sending ${amt} ${cur} with hash ${hash}`);
		// Different interface - incompatible with IPaymentProcessor
		const success = amt > 0;
		console.log(`${success ? '✅' : '❌'} VCPayment: Transaction ${success ? 'completed' : 'failed'}`);
		return success;
	}

	verifyTransaction(hash: string): boolean {
		console.log(`🪙 VCPayment: Verifying transaction ${hash}`);
		return true;
	}
}
