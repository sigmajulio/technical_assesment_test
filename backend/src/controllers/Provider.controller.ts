import Elysia, { t } from "elysia";
import { ProviderRepository } from "../repositories/ProviderRepository.service";

const repo = new ProviderRepository();

function successResponse(data: any, status = 200) {
  return { success: true, data };
}

function errorResponse(code: string, message: string, details?: any[]) {
  return { success: false, error: { code, message, details } };
}

export const providerController = new Elysia({ prefix: "/providers" })

  // GET all providers
  .get("/", async ({ query, set }) => {
    try {
      const result = await repo.findAll(query);
      return { success: true, ...result };
    } catch (err: any) {
      set.status = 500;
      return errorResponse("SERVER_ERROR", err.message);
    }
  })

  // GET single provider
  .get("/:id", async ({ params, set }) => {
    try {
      const provider = await repo.findById(params.id);
      if (!provider) {
        set.status = 404;
        return errorResponse("NOT_FOUND", "Provider not found");
      }
      return successResponse(provider);
    } catch (err: any) {
      set.status = 500;
      return errorResponse("SERVER_ERROR", err.message);
    }
  })

  // POST create provider
  .post("/", async ({ body, set }) => {
    try {
      const provider = await repo.create(body as any);
      set.status = 201;
      return successResponse(provider);
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

  // PATCH update provider
  .patch("/:id", async ({ params, body, set }) => {
    try {
      const provider = await repo.update(params.id, body as any);
      if (!provider) {
        set.status = 404;
        return errorResponse("NOT_FOUND", "Provider not found");
      }
      return successResponse(provider);
    } catch (err: any) {
      set.status = 500;
      return errorResponse("SERVER_ERROR", err.message);
    }
  })

  // DELETE provider
  .delete("/:id", async ({ params, set }) => {
    try {
      const provider = await repo.delete(params.id);
      if (!provider) {
        set.status = 404;
        return errorResponse("NOT_FOUND", "Provider not found");
      }
      set.status = 204;
      return;
    } catch (err: any) {
      set.status = 500;
      return errorResponse("SERVER_ERROR", err.message);
    }
  });
