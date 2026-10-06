export const PRODUCT_NAME_MAX_LENGTH = 100;
export const PRODUCT_BRAND_MAX_LENGTH = 50;

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
}

export type ProductRequest = Omit<Product, "id">;
