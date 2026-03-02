import { useState } from 'react';
import { mockPayment, PaymentResult } from '../core/payments/paymentService';

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);

  const processPayment = async (productId: string, amount: number) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await mockPayment(productId, amount);
      setResult(res);
    } catch (e) {
      setResult({ success: false, transactionId: '', message: 'Error inesperado.' });
    } finally {
      setLoading(false);
    }
  };

  return { loading, result, processPayment };
}