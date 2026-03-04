export type PaymentResult = {
  success: boolean;
  transactionId: string;
  message: string;
  amount: number;
};

// Productos mock con precios fijos
const PRODUCTS: Record<string, { name: string; price: number }> = {
  'product://001': { name: 'Auriculares Pro', price: 299 },
  'product://002': { name: 'Teclado Mecánico', price: 189 },
  'product://003': { name: 'Mouse Gamer', price: 99 },
};

export function getProductInfo(code: string): { name: string; price: number } {
  if (PRODUCTS[code]) return PRODUCTS[code];
  // Si no está en el catálogo, precio aleatorio
  return {
    name: `Producto ${code.slice(-4)}`,
    price: Math.floor(Math.random() * 900) + 100,
  };
}

export async function mockPayment(productId: string, amount: number): Promise<PaymentResult> {
  await new Promise(resolve => setTimeout(resolve, 2000));
  const success = Math.random() > 0.2;
  return {
    success,
    transactionId: success ? `TXN-${Date.now()}` : '',
    message: success ? '¡Pago aprobado!' : 'Pago rechazado. Intentá de nuevo.',
    amount,
  };
}