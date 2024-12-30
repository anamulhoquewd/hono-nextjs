import { Hono } from "hono";
import { customer } from "@/app/api/[...route]/controllers";
import {
  isAdmin,
  isAdminOrManager,
  protect,
} from "@/app/api/[...route]/middlewares";
import { protectFields } from "@/utils/protectFields";

const customers = new Hono();

// Get All customer
customers.get("/",(c) => customer.getCustomers(c));

// Create Customer
customers.post("/register", (c) => customer.createCustomer(c));

// Get Single Customer
customers.get("/:id",  (c) =>
  customer.getSingleCustomer(c)
);

// Update Customer
customers.put("/:id",  protectFields(["role"]), (c) =>
  customer.updateCustomer(c)
);

// Delete Customer
customers.delete("/:id", (c) => customer.deleteCustomer(c));

export default customers;
