import { useState } from 'react';
import { mockPayment, PaymentResult } from '../core/payments/paymentService';
import { useBalance } from './BalanceContext';
import { saveTransaction } from '../core/supabase/transactionService';
import { supabase } from '../core/supabase/client';

export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<PaymentResult | null>(null);
  const { balance, discount }  = useBalance();

  const processPayment = async (
    productId:   string,
    amount:      number,
    productName: string
  ) => {
    setLoading(true);
    setResult(null);

    try {
      // 1. Usuario actual (puede ser null si no hay sesión)
      const { data: { user } } = await supabase.auth.getUser();

      // 2. Procesa el pago
      const res = await mockPayment(productId, amount);

      // 3. Descuenta balance si fue exitoso
      if (res.success) {
        discount(amount);
      }

      // 4. Guarda en Supabase (siempre, éxito o fracaso)
      await saveTransaction({
        user_id:        user?.id,
        product_id:     productId,
        product_name:   productName,
        amount,
        success:        res.success,
        transaction_id: res.transactionId || undefined,
      });

      setResult(res);

    } catch (e) {
      setResult({
        success:       false,
        transactionId: '',
        message:       'Error inesperado.',
        amount,
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, result, balance, processPayment };
}