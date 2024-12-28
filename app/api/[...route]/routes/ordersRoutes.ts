import { Hono } from "hono";
import { order } from "@/app/api/[...route]/controllers";
import { isAdmin, isAdminOrManager, protect } from "@/app/api/[...route]/middlewares";
import { protectFields } from "@/utils/protectFields";
const orders = new Hono();
// Get All orders
orders.get("/", protect, (c) => order.getOrders(c));

// Create Order
orders.post("/register", protect, isAdminOrManager, (c) =>
  order.createOrder(c)
);

// Get Orders By Customer
orders.get("/customer/:id", protect, (c) => order.getOrdersByCustomer(c));

// Get Single Order
orders.get("/:id", protect, isAdminOrManager, (c) => order.getSingleOrder(c));

// Update Order
orders.put(
  "/:id",
  protect,
  isAdminOrManager,
  protectFields(["customer", "date"]),
  (c) => order.updateOrder(c)
);

// Delete Order
orders.delete("/:id", protect, isAdmin, (c) => order.deleteOrder(c));
export default orders;
