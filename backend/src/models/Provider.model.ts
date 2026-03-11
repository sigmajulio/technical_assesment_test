import mongoose, { Schema } from "mongoose";
import type { IProvider } from "../interfaces/Provider.interface";

const ProviderSchema = new Schema<IProvider>(
  {
    name: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    description: { type: String },
    email: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Provider = mongoose.model<IProvider>("Provider", ProviderSchema);
