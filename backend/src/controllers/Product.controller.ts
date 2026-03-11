import Elysia from "elysia";
import { ProductRepository } from "../repositories/ProductRepository.service";

const repo = new ProductRepository();

function successResponse(data: any) {
  return { success: true, data };
}

function errorResponse(code: string, message: string, details?: any[]) {
  return { success: false, error: { code, message, details } };
}

export const productController = new Elysia({ prefix: "/products" })

  // GET all products
  .get("/", async ({ query, set }) => {
    try {
      const result = await repo.findAll(query);
      return { success: true, ...result };
    } catch (err: any) {
      set.status = 500;
      return errorResponse("SERVER_ERROR", err.message);
    }
  })

  // GET single product
  .get("/:id", async ({ params, set }) => {
    try {
      const product = await repo.findById(params.id);
      if (!product) {
        set.status = 404;
        return errorResponse("NOT_FOUND", "Product not found");
      }
      return successResponse(product);
    } catch (err: any) {
      set.status = 500;
      return errorResponse("SERVER_ERROR", err.message);
    }
  })

  // POST create product
  .post("/", async ({ body, set }) => {
    try {
      const data = body as any;
      if (!data.name || data.price === undefined) {
        set.status = 400;
        return errorResponse("BAD_REQUEST", "Invalid input data", [
          ...(!data.name ? [{ field: "name", message: "Name is required" }] : []),
          ...(data.price === undefined ? [{ field: "price", message: "Price is required" }] : []),
        ]);
      }
      if (data.price < 0) {
        set.status = 422;
        return errorResponse("VALIDATION_ERROR", "Invalid input data", [
          { field: "price", message: "Price must be a positive number" },
        ]);
      }
      const product = await repo.create(data);
      set.status = 201;
      return successResponse(product);
    } catch (err: any) {
      if (err.name === "ValidationError") {
        set.status = 422;
        const details = Object.values(err.errors).map((e: any) => ({
          field: e.path,
          message: e.message,
        }));
        return errorResponse("VALIDATION_ERROR", "Invalid input data", details);
      }
      set.status = 400;
      return errorResponse("BAD_REQUEST", err.message);
    }
  })

  // PATCH update product
  .patch("/:id", async ({ params, body, set }) => {
    try {
      const product = await repo.update(params.id, body as any);
      if (!product) {
        set.status = 404;
        return errorResponse("NOT_FOUND", "Product not found");
      }
      return successResponse(product);
    } catch (err: any) {
      set.status = 500;
      return errorResponse("SERVER_ERROR", err.message);
    }
  })

  // DELETE product
  .delete("/:id", async ({ params, set }) => {
    try {
      const product = await repo.delete(params.id);
      if (!product) {
        set.status = 404;
        return errorResponse("NOT_FOUND", "Product not found");
      }
      set.status = 204;
      return;
    } catch (err: any) {
      set.status = 500;
      return errorResponse("SERVER_ERROR", err.message);
    }
  });
