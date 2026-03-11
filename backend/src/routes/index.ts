import Elysia from "elysia";
import { productController } from "../controllers/Product.controller";
import { providerController } from "../controllers/Provider.controller";

export const routes = new Elysia({ prefix: "/api/v1" })
  .use(productController)
  .use(providerController);
