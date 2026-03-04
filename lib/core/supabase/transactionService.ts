import { supabase } from './client';

export type Transaction = {
  user_id?:       string;     // ✅ agregado, opcional para cuando no hay sesión
  product_id:     string;
  product_name:   string;
  amount:         number;
  success:        boolean;
  transaction_id?: string;
};

export async function saveTransaction(transaction: Transaction): Promise<void> {
  const { error } = await supabase
    .from('transactions')
    .insert({
      user_id:          transaction.user_id       ?? null,
      product_id:       transaction.product_id,
      product_name:     transaction.product_name,
      amount:           transaction.amount,
      transaction_code: transaction.transaction_id ?? null,
      status:           transaction.success ? 'approved' : 'rejected',
      error_message:    !transaction.success ? 'Pago rechazado por el sistema' : null,
      payment_method:   'qr',
    });

  if (error) {
    console.error('❌ Error guardando transacción:', error.message);
    throw error;
  }
}

export async function getStats() {
  const { data, error } = await supabase
    .from('transactions')
    .select('*');

  if (error || !data) return { compras: 0, gastado: 0, exitos: 0, fracasos: 0 };

  const exitos   = data.filter(t => t.status === 'approved');
  const fracasos = data.filter(t => t.status === 'rejected');

  return {
    compras:  data.length,
    gastado:  exitos.reduce((acc, t) => acc + Number(t.amount), 0),
    exitos:   exitos.length,
    fracasos: fracasos.length,
  };
}