import { Hono } from "hono";
import { customer } from "../controllers";
import { isAdmin, isAdminOrManager, protect } from "../middlewares";
import { protectFields } from "@/utils";

const customers = new Hono();

// Get All customer
customers.get("/", protect, isAdminOrManager, (c) => customer.getCustomers(c));

// Create Customer
customers.post("/register", protect, isAdminOrManager, (c) =>
  customer.createCustomer(c)
);

// Get Single Customer
customers.get("/:id", protect, isAdminOrManager, (c) =>
  customer.getSingleCustomer(c)
);

// Update Customer
customers.put("/:id", protect, isAdminOrManager, protectFields(["role"]), (c) =>
  customer.updateCustomer(c)
);

// Delete Customer
customers.delete("/:id", protect, isAdmin, (c) => customer.deleteCustomer(c));

export default customers;
