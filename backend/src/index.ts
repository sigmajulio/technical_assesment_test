import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { connectDB } from "./database/Mongo.service";
import { routes } from "./routes/index";

await connectDB();

const app = new Elysia()
  .use(cors())
  .use(routes)
  .get("/", () => ({ message: "Products API v1 - Running ✅" }))
  .listen(process.env.PORT || 3000);

console.log(`🚀 Server running at http://localhost:${app.server?.port}`);
