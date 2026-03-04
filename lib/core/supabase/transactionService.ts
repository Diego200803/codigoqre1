import { supabase } from './client';

export type Transaction = {
  product_id: string;
  product_name: string;
  amount: number;
  success: boolean;
  transaction_id?: string;
};

export async function saveTransaction(transaction: Transaction) {
  const { error } = await supabase
    .from('transactions')
    .insert(transaction);

  if (error) console.error('Error guardando transacción:', error);
}

export async function getStats() {
  const { data, error } = await supabase
    .from('transactions')
    .select('*');

  if (error || !data) return { compras: 0, gastado: 0, exitos: 0, fracasos: 0 };

  const exitos = data.filter(t => t.success);
  const fracasos = data.filter(t => !t.success);

  return {
    compras: data.length,
    gastado: exitos.reduce((acc, t) => acc + Number(t.amount), 0),
    exitos: exitos.length,
    fracasos: fracasos.length,
  };
}