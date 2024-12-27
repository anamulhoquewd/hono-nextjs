import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { handle } from "hono/vercel";
import { connectDB } from "./db";
import { customers, users, orders } from "./routes";
export const dynamic = "force-dynamic";

const app = new Hono().basePath("/api/v1");

// Config MongoDB
connectDB();

// Initialize middlewares
app.use("*", logger(), prettyJSON());

// Cors
app.use(
  // "*",
  cors({
    origin: "https://hono-nextjs-tau-ebon.vercel.app",
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowHeaders: ["Content-Type"],
  })
);

// User Routes
app.route("/users", users);

// Customer Routes
app.route("/customers", customers);

// Order Routes
app.route("/orders", orders);

// Home Route
app.get("/test", (c) =>
  c.json({
    message: "hello testing!",
  })
);

app.get("/hello", (c) => {
  return c.json({
    message: "Hello from Hono on Vercel!",
  });
});

// app.get("/:wild", (c) => {
//   const wild = c.req.param("wild");
//   return c.json({
//     message: `Hello from Hono on Vercel! You're now on /api/${wild}!`,
//   });
// });

// export const GET = handle(app);
// Named exports for HTTP methods
export const GET = async (req: Request, ctx: any) => handle(app)(req, ctx);
export const POST = async (req: Request, ctx: any) => handle(app)(req, ctx);
export const PUT = async (req: Request, ctx: any) => handle(app)(req, ctx);
export const DELETE = async (req: Request, ctx: any) => handle(app)(req, ctx);
export const PATCH = async (req: Request, ctx: any) => handle(app)(req, ctx);
