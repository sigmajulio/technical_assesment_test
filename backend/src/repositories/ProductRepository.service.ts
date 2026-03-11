import { Product } from "../models/Product.model";
import type { IProduct } from "../interfaces/Product.interface";

export class ProductRepository {
  async findAll(query: any) {
    const {
      page = 1,
      limit = 10,
      sort,
      fields,
      ...filters
    } = query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build filter object
    const filterObj: any = {};
    for (const [key, value] of Object.entries(filters)) {
      if (typeof value === "object" && value !== null) {
        // Range filters: price[gte]=100&price[lte]=500
        const mongoOps: any = {};
        for (const [op, val] of Object.entries(value as any)) {
          mongoOps[`$${op}`] = isNaN(Number(val)) ? val : Number(val);
        }
        filterObj[key] = mongoOps;
      } else {
        // Partial match for strings
        if (typeof value === "string" && isNaN(Number(value))) {
          filterObj[key] = { $regex: value, $options: "i" };
        } else {
          filterObj[key] = value;
        }
      }
    }

    // Sort
    let sortObj: any = {};
    if (sort) {
      const sortFields = (sort as string).split(",");
      for (const field of sortFields) {
        if (field.startsWith("-")) {
          sortObj[field.slice(1)] = -1;
        } else {
          sortObj[field] = 1;
        }
      }
    }

    // Field selection
    const projection = fields
      ? (fields as string).split(",").join(" ")
      : "";

    const [data, total] = await Promise.all([
      Product.find(filterObj)
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit))
        .select(projection)
        .populate("provider_id", "name email phone"),
      Product.countDocuments(filterObj),
    ]);

    return {
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        total_pages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async findById(id: string) {
    return Product.findById(id).populate("provider_id", "name email phone");
  }

  async create(data: IProduct) {
    return Product.create(data);
  }

  async update(id: string, data: Partial<IProduct>) {
    return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id: string) {
    return Product.findByIdAndDelete(id);
  }
}
