import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServiceContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { CreditCard, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export const PaymentPage: React.FC = () => {
  const { user } = useAuth();
  const { paymentService } = useServices();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'VISA' | 'MASTERCARD' | 'VC_COINS'>('VISA');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{ amount?: string }>({});

  const validate = () => {
    const newErrors: { amount?: string } = {};
    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !user) return;

    setIsProcessing(true);
    try {
      const success = await paymentService.processTransaction(
        user.userId,
        parseFloat(amount),
        paymentMethod,
        'Direct Payment'
      );

      if (success) {
        toast.success('✅ Payment processed successfully!');
        setAmount('');
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } catch (error) {
      toast.error('Payment processing error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-2">
          <CreditCard className="text-blue-600" size={36} />
          Payment
        </h1>
        <p className="text-gray-600 mt-2">Make a payment for student services</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Payment Information</h2>
          <form onSubmit={handlePayment} className="space-y-4">
            <Input
              label="Amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
              error={errors.amount}
              placeholder="100.00"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPaymentMethod(e.target.value as 'VISA' | 'MASTERCARD' | 'VC_COINS')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="VISA">Visa</option>
                <option value="MASTERCARD">MasterCard</option>
                <option value="VC_COINS">Virtual Coins</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full mt-6"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay $${amount || '0.00'}`}
            </Button>
          </form>
        </Card>

        <div className="space-y-4">
          <Card className="p-6 bg-blue-50">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <DollarSign className="text-blue-600" size={20} />
              Payment Methods Accepted
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Visa Cards</li>
              <li>✓ MasterCard</li>
              <li>✓ Virtual Coins</li>
            </ul>
          </Card>

          <Card className="p-6 bg-green-50">
            <h3 className="font-bold text-gray-800 mb-3">Secure Payment</h3>
            <p className="text-gray-700 text-sm">All transactions are processed securely with industry-standard encryption.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
