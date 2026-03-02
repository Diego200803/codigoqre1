export type PaymentResult = {
    success: boolean;
    transactionId: string;
    message: string;
  };
  
  export async function mockPayment(productId: string, amount: number): Promise<PaymentResult> {
    await new Promise(resolve => setTimeout(resolve, 2000)); // simula delay de red
  
    const success = Math.random() > 0.2; // 80% de éxito
  
    return {
      success,
      transactionId: success ? `TXN-${Date.now()}` : '',
      message: success ? '¡Pago aprobado!' : 'Pago rechazado. Intentá de nuevo.',
    };
  }