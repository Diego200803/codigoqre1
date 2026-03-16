import { useState } from 'react';
import { mockPayment, PaymentResult } from '../core/payments/paymentService';
import { useBalance } from './BalanceContext';
import { saveTransaction } from '../core/supabase/transactionService';
import { supabase } from '../core/supabase/client';
import { notify } from '../core/notifications/notificationService';

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const { balance, discount } = useBalance();

  const processPayment = async (productId: string, amount: number, productName: string) => {
    setLoading(true);
    setResult(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const res = await mockPayment(productId, amount);
      if (res.success) {
        discount(amount);
        await notify.paymentSuccess(amount);
      } else {
        await notify.paymentFailed();
      }
      await saveTransaction({
        user_id: user?.id,
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