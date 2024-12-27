import type { Context, Next } from "hono";

const protectFields = (protectedFields: string[]) => {
  return async (c: Context, next: Next) => {
    const body = await c.req.json();

    protectedFields.forEach((field) => {
      if (body.hasOwnProperty(field)) {
        delete body[field];
      }
    });

    // Update the request body
    c.set("filteredBody", body);

    await next();
  };
};

export { protectFields };
