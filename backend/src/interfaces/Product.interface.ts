export interface IProduct {
  _id?: string;
  name: string;
  price: number;
  description?: string;
  sku?: string;
  stock_quantity?: number;
  category?: string;
  is_active?: boolean;
  provider_id?: string;
  created_at?: Date;
  updated_at?: Date;
}
