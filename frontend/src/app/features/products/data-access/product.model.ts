export const PRODUCT_NAME_MAX_LENGTH = 100;
export const PRODUCT_BRAND_MAX_LENGTH = 50;
export const LOW_STOCK_THRESHOLD = 5;

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
}

export type ProductRequest = Omit<Product, 'id'>;

export type StockStatus = 'out' | 'low' | 'ok';

export function getStockStatus(stock: number): StockStatus {
  if (stock === 0) return 'out';
  if (stock <= LOW_STOCK_THRESHOLD) return 'low';
  return 'ok';
}
