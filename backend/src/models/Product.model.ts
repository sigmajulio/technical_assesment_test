import mongoose, { Schema } from "mongoose";
import type { IProduct } from "../interfaces/Product.interface";

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String },
    sku: { type: String },
    stock_quantity: { type: Number, default: 0 },
    category: { type: String },
    is_active: { type: Boolean, default: true },
    provider_id: { type: Schema.Types.ObjectId, ref: "Provider" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
