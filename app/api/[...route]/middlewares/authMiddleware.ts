import { verify } from "hono/jwt";
import { User } from "@/app/api/[...route]/models";
import { getSignedCookie } from "hono/cookie";
import { Context, Next } from "hono";
// Protect Route for Authenticated Users (using cookie)
export const protect = async (c: Context, next: Next) => {
  const token = await getSignedCookie(
    c,
    process.env.COOKIE_SECRET || "cookie-secret-key-anam",
    "auth_token"
  );
  if (!token) {
    c.status(401);
    return c.json({ message: "Not authorized! No token found!" });
  }
  const { id } = await verify(
    token,
    process.env.ACCESS_TOKEN_SECRET || "jwt-secret-key-anam"
  );
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    c.set("user", user);
    await next();
  } catch (err) {
    console.log(err);
    c.status(401);
    return c.json({ message: "Invalid token! You are not authorized!" });
  }
};
// Check if user is admin
export const isAdmin = async (c: Context, next: Next) => {
  const user = c.get("user");
  if (user && user.role === "admin") {
    await next();
  } else {
    c.status(401);
    throw new Error("Not authorized as an admin!");
  }
};
// Check if user is manager
export const isManager = async (c: Context, next: Next) => {
  const user = c.get("user");
  if (user && user.role === "manager") {
    await next();
  } else {
    c.status(401);
    throw new Error("Not authorized as a manager!");
  }
};
// Check if user is delivery man
export const isDeliveryMan = async (c: Context, next: Next) => {
  const user = c.get("user");
  if (user && user.role === "delivery_man") {
    await next();
  } else {
    c.status(401);
    throw new Error("Not authorized as a delivery man!");
  }
};
// Check if admin or manager
export const isAdminOrManager = async (c: Context, next: Next) => {
  const user = c.get("user");
  if (user && (user.role === "admin" || user.role === "manager")) {
    await next();
  } else {
    c.status(401);
    throw new Error("Not authorized as an admin or manager!");
  }
};
