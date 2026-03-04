import { useState } from 'react';
import { mockPayment, PaymentResult } from '../core/payments/paymentService';

const INITIAL_BALANCE = 100000;

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [balance, setBalance] = useState(INITIAL_BALANCE);

  const processPayment = async (productId: string, amount: number) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await mockPayment(productId, amount);
      if (res.success) {
        setBalance(prev => prev - amount);
      }
      setResult(res);
    } catch (e) {
      setResult({ success: false, transactionId: '', message: 'Error inesperado.', amount });
    } finally {
      setLoading(false);
    }
  };

  return { loading, result, balance, processPayment };
}