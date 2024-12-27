import type { Context } from "hono";
import { Customer, Order } from "./../models";
import { format } from "date-fns";

/**
 * @api {get} /orders Get All Orders
 * @apiGroup Orders
 * @access Private
 */
export const getOrders = async (c: Context) => {
  try {
    // Fetch all orders and populate customer details
    const orders = await Order.find().populate("customer");

    // Reshape the orders data
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      quantity: order.quantity,
      price: order.price,
      date: format(order.date, "yyyy-MM-dd"),
      customer: order.customer._id,
      name: order.customer.name,
      phone: order.customer.phone,
      secondaryPhone: order.customer.secondaryPhone,
      address: order.customer.address,
    }));

    // Return the formatted orders
    return c.json({
      data: formattedOrders,
      success: true,
      message: "Orders found",
    });
  } catch (error: any) {
    console.error("Error get all orders:", error?.message || error);
    c.status(500);
    return c.json({
      success: false,
      message: error?.message,
      stack: process.env.NODE_ENV === "production" ? null : error?.stack,
    });
  }
};

/**
 * @api {get} /orders/:id Get Single Order
 * @apiGroup Orders
 * @access Private
 */
export const getSingleOrder = async (c: Context) => {
  const id = c.req.param("id");

  // Get single Order
  try {
    const order = await Order.findById(id);

    return c.json({ data: order, success: true, message: "Order found" });
  } catch (error: any) {
    console.error("Error get single order:", error?.message || error);
    c.status(500);
    return c.json({
      success: false,
      message: error?.message,
      stack: process.env.NODE_ENV === "production" ? null : error?.stack,
    });
  }
};

/**
 * @api {get} /orders/customer/:id Get Orders By Customer
 * @apiGroup Orders
 * @access Private
 */
export const getOrdersByCustomer = async (c: Context) => {
  const id = c.req.param("id");

  // Get orders by customer
  try {
    const orders = await Order.find({ customer: id });

    return c.json({ data: orders, success: true, message: "Orders found" });
  } catch (error: any) {
    console.error("Error get orders by customer:", error?.message || error);
    c.status(500);
    return c.json({
      success: false,
      message: error?.message,
      stack: process.env.NODE_ENV === "production" ? null : error?.stack,
    });
  }
};

/**
 * @api {post} /orders/register Create Order
 * @apiGroup Orders
 * @access Private
 */
export const createOrder = async (c: Context) => {
  const body = await c.req.json();

  const { customer, date } = body; // customer means customer's _id.

  const customerData = await Customer.findById(customer);

  // Check if customer exists
  if (!customerData) {
    c.status(400);
    throw new Error("Customer does not found");
  }

  // Check for existing orders by customer and date
  const orderExists = await Order.findOne({
    customer,
    date,
  });

  if (orderExists) {
    c.status(400);
    throw new Error("Order already exists today for this customer");
  }

  const order = await Order.create({
    ...body,
  });

  if (!order) {
    c.status(400);
    throw new Error("Invalid order data");
  }

  c.status(201);

  return c.json({
    success: true,
    data: {
      _id: order._id,
      customer: order.customer,
      name: customerData.name,
      phone: customerData.phone,
      secondaryPhone: customerData.secondaryPhone,
      address: customerData.address,
      price: order.price,
      quantity: order.quantity,
      date: order.date,
    },
    message: "Order created successfully",
  });
};

/**
 * @api {put} /orders/:id Update Order
 * @apiGroup Orders
 * @access Private
 */
export const updateOrder = async (c: Context) => {
  const body = c.get("filteredBody");
  const id = c.req.param("id");

  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedOrder) {
      c.status(400);
      throw new Error("Invalid order data");
    }

    return c.json({
      success: true,
      data: updatedOrder,
      message: "Order updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating order:", error?.message || error);
    c.status(500);
    return c.json({
      success: false,
      message: error?.message,
      stack: process.env.NODE_ENV === "production" ? null : error?.stack,
    });
  }
};

/**
 * @api {delete} /orders/:id Update Order
 * @apiGroup Orders
 * @access Private
 */
export const deleteOrder = async (c: Context) => {
  const id = c.req.param("id");

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      c.status(400);
      throw new Error("Invalid order data");
    }

    return c.json({
      success: true,
      data: deletedOrder,
      message: "Order deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting order:", error?.message || error);
    c.status(500);
    return c.json({
      success: false,
      message: error?.message,
      stack: process.env.NODE_ENV === "production" ? null : error?.stack,
    });
  }
};
