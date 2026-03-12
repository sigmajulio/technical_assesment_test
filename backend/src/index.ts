import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { connectDB } from "./database/Mongo.service";
import { routes } from "./routes/index";

await connectDB();

const app = new Elysia()
  .use(cors({ origin:"https://technical-assesment-test.vercel.app", "http://localhost:5173"],
}))
  .use(routes)
  .get("/", () => ({ message: "Products API v1 - Running ✅" }))
  .listen(process.env.PORT || 3000);

console.log(`🚀 Server running at http://localhost:${app.server?.port}`);
