import { Provider } from "../models/Provider.model";
import type { IProvider } from "../interfaces/Provider.interface";

export class ProviderRepository {
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
        // Range filters: price[gte]=100
        const mongoOps: any = {};
        for (const [op, val] of Object.entries(value as any)) {
          mongoOps[`$${op}`] = isNaN(Number(val)) ? val : Number(val);
        }
        filterObj[key] = mongoOps;
      } else if (typeof value === "string" && (value as string).includes("like:")) {
        filterObj[key] = { $regex: (value as string).replace("like:", ""), $options: "i" };
      } else {
        filterObj[key] = value;
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
      Provider.find(filterObj)
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit))
        .select(projection),
      Provider.countDocuments(filterObj),
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
    return Provider.findById(id);
  }

  async create(data: IProvider) {
    return Provider.create(data);
  }

  async update(id: string, data: Partial<IProvider>) {
    return Provider.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id: string) {
    return Provider.findByIdAndDelete(id);
  }
}
