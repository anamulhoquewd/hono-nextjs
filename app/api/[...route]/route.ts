import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { handle } from "hono/vercel";
import { connectDB } from "@/app/api/[...route]/config/db";
import { customers, users, orders } from "@/app/api/[...route]/routes";
import { errorHandler, notFound } from "@/app/api/[...route]/middlewares";
export const dynamic = "force-dynamic";

const app = new Hono().basePath("/api/v1");

// Config MongoDB
connectDB();

// Initialize middlewares
app.use("*", logger(), prettyJSON());

// Cors
app.use(
  "*",
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

// Error Handler
app.onError((err, c) => {
  const error = errorHandler(c);
  return error;
});

// Not Found Handler
app.notFound((c) => {
  const error = notFound(c);
  return error;
});

// Named exports for HTTP methods
export const GET = async (req: Request) => handle(app)(req);
export const POST = async (req: Request) => handle(app)(req);
export const PUT = async (req: Request) => handle(app)(req);
export const DELETE = async (req: Request) => handle(app)(req);
export const PATCH = async (req: Request) => handle(app)(req);
