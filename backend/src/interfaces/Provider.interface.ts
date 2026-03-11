export interface IProvider {
  _id?: string;
  name: string;
  address?: string;
  phone?: string;
  description?: string;
  email?: string;
  status?: "active" | "inactive";
  created_at?: Date;
  updated_at?: Date;
}
