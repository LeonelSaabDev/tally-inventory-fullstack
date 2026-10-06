export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
}

export type ProductRequest = Omit<Product, "id">;
