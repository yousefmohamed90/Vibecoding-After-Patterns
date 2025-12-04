// src/pages/PaymentPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServiceContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Badge } from '../components/common/Badge';
import { Payment } from '../entities/Payment';
import { CreditCard, DollarSign, Calendar, CheckCircle, XCircle, Download } from 'lucide-react';
import { toast } from 'sonner';

export const PaymentPage: React.FC = () => {
  const { user } = useAuth();
  const { paymentService } = useServices();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'COMPLETED' | 'FAILED'>('ALL');

  useEffect(() => {
    loadPayments();
  }, [user]);

  const loadPayments = () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get all payments from localStorage
      const allPayments = JSON.parse(localStorage.getItem('payments') || '[]') as Payment[];

      // Filter by current user
      const userPayments = allPayments.filter(p => p.studentID === user.userId);

      // Sort by date (newest first)
      userPayments.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setPayments(userPayments);
    } catch (error) {
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'COMPLETED' ? (
      <Badge variant="success">
        <CheckCircle size={14} className="mr-1" />
        {status}
      </Badge>
    ) : (
      <Badge variant="danger">
        <XCircle size={14} className="mr-1" />
        {status}
      </Badge>
    );
  };

  const getPaymentMethodIcon = (method: string) => {
    return method === 'VISA' ? '💳' : '🪙';
  };

  const filteredPayments = payments.filter(p => {
    if (filterStatus === 'ALL') return true;
    return p.status === filterStatus;
  });

  const totalSpent = payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);

  const completedCount = payments.filter(p => p.status === 'COMPLETED').length;
  const failedCount = payments.filter(p => p.status === 'FAILED').length;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment History</h1>
        <p className="text-gray-600">View your transaction history and payment details</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-3xl font-bold text-green-600">${totalSpent.toFixed(2)}</p>
            </div>
            <DollarSign className="text-green-600" size={40} />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-blue-600">{completedCount}</p>
            </div>
            <CheckCircle className="text-blue-600" size={40} />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-3xl font-bold text-red-600">{failedCount}</p>
            </div>
            <XCircle className="text-red-600" size={40} />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex space-x-3 mb-6">
        <Button
          variant={filterStatus === 'ALL' ? 'primary' : 'outline'}
          onClick={() => setFilterStatus('ALL')}
          size="sm"
        >
          All ({payments.length})
        </Button>
        <Button
          variant={filterStatus === 'COMPLETED' ? 'primary' : 'outline'}
          onClick={() => setFilterStatus('COMPLETED')}
          size="sm"
        >
          Completed ({completedCount})
        </Button>
        <Button
          variant={filterStatus === 'FAILED' ? 'primary' : 'outline'}
          onClick={() => setFilterStatus('FAILED')}
          size="sm"
        >
          Failed ({failedCount})
        </Button>
      </div>

      {/* Payment List */}
      {filteredPayments.length === 0 ? (
        <Card className="text-center py-12">
          <CreditCard className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600 text-lg mb-2">
            {filterStatus === 'ALL' ? 'No payment history yet' :
              `No ${filterStatus.toLowerCase()} payments`}
          </p>
          <p className="text-gray-500 text-sm">
            Your payment transactions will appear here
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredPayments.map((payment, idx) => (
            <Card
              key={payment.paymentID}
              className="animate-slide-up"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                {/* Left Section */}
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`text-4xl p-3 rounded-lg ${payment.status === 'COMPLETED'
                      ? 'bg-green-100'
                      : 'bg-red-100'
                    }`}>
                    {getPaymentMethodIcon(payment.paymentMethod)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {payment.description || 'Payment Transaction'}
                      </h3>
                      {getStatusBadge(payment.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Amount</p>
                        <p className="font-semibold text-gray-800">${payment.amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Method</p>
                        <p className="font-semibold">{payment.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Date</p>
                        <p className="font-semibold">
                          {new Date(payment.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Transaction ID</p>
                        <p className="font-mono text-xs text-gray-600">
                          {payment.paymentID.substring(0, 12)}...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="mt-4 md:mt-0 md:ml-4 flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    <Download size={14} className="mr-1" />
                    Receipt
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
