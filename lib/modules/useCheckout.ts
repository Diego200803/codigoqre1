import { useState } from 'react';
import { mockPayment, PaymentResult } from '../core/payments/paymentService';
import { useBalance } from './BalanceContext';
import { saveTransaction } from '../core/supabase/transactionService';

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const { balance, discount } = useBalance();

  const processPayment = async (productId: string, amount: number, productName: string) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await mockPayment(productId, amount);
      if (res.success) {
        discount(amount);
      }
      // Guardamos siempre, éxito o fracaso
      await saveTransaction({
        product_id: productId,
        product_name: productName,
        amount,
        success: res.success,
        transaction_id: res.transactionId || undefined,
      });
      setResult(res);
    } catch (e) {
      setResult({ success: false, transactionId: '', message: 'Error inesperado.', amount });
    } finally {
      setLoading(false);
    }
  };

  return { loading, result, balance, processPayment };
}