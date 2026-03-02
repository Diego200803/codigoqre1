export function isValidQR(data: string): boolean {
    return data.startsWith('product://') || data.startsWith('http');
  }
  
  export function extractProductId(data: string): string {
    return data.replace('product://', '');
  }