import { supabase } from '../supabase';

// ── Tipos ────────────────────────────────────────────────────────────────────

export type PaymentResult = {
  success: boolean;
  transactionId: string;
  message: string;
  amount: number;
};

// ── Catálogo mock de productos ────────────────────────────────────────────────

const PRODUCTS: Record<string, { name: string; price: number }> = {
  'product://001': { name: 'Auriculares Pro',  price: 299 },
  'product://002': { name: 'Teclado Mecanico', price: 189 },
  'product://003': { name: 'Mouse Gamer',      price: 99  },
};

export function getProductInfo(code: string): { name: string; price: number } {
  if (PRODUCTS[code]) return PRODUCTS[code];
  return {
    name:  `Producto ${code.slice(-4)}`,
    price: Math.floor(Math.random() * 900) + 100,
  };
}

// ── Función principal de pago ─────────────────────────────────────────────────

export async function mockPayment(
  productId: string,
  amount: number,
  userId?: string
): Promise<PaymentResult> {

  // 1. Simula delay de red / pasarela de pago
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 2. Resultado del pago (80% éxito)
  const success       = Math.random() > 0.2;
  const transactionId = success ? `TXN-${Date.now()}` : '';
  const message       = success
    ? 'Pago aprobado!'
    : 'Pago rechazado. Intenta de nuevo.';

  // 3. Guardar en Supabase
  const productInfo = getProductInfo(productId);

  const { error } = await supabase.from('transactions').insert({
    user_id:          userId ?? null,
    product_id:       productId,
    product_name:     productInfo.name,
    amount:           amount,
    transaction_code: transactionId || null,
    status:           success ? 'approved' : 'rejected',
    error_message:    !success ? message : null,
    payment_method:   'qr',
  });

  if (error) {
    console.error('[ERROR] Guardando transaccion en Supabase:', error.message);
  }

  // 4. Retorna el resultado hacia la UI
  return { success, transactionId, message, amount };
}
