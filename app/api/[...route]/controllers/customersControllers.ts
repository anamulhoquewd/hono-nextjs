import { Context } from "hono";
import { Customer } from "@/app/api/[...route]/models";
/**
 * @api {get} /customers Get All Customers
 * @apiGroup Customers
 * @access Private
 */
export const getCustomers = async (c: Context) => {
  // Get all customer
  try {
    const customers = await Customer.find();
    return c.json({
      data: customers,
      success: true,
      message: "Customers found",
    });
  } catch (error: any) {
    console.error("Error get all customers:", error?.message || error);
    c.status(500);
    return c.json({
      success: false,
      message: error?.message,
      stack: process.env.NODE_ENV === "production" ? null : error?.stack,
    });
  }
};
/**
 * @api {get} /customers/:id Get Single Customer
 * @apiGroup Customers
 * @access Private
 */
export const getSingleCustomer = async (c: Context) => {
  const id = c.req.param("id");
  // Get single customer
  try {
    const customer = await Customer.findById(id);
    return c.json({ data: customer, success: true, message: "Customer found" });
  } catch (error: any) {
    console.error("Error get single customer:", error?.message || error);
    c.status(500);
    return c.json({
      success: false,
      message: error?.message,
      stack: process.env.NODE_ENV === "production" ? null : error?.stack,
    });
  }
};
/**
 * @api {post} /customer/register Create Customer
 * @apiGroup Customer
 * @access Private
 */
export const createCustomer = async (c: Context) => {
  const body = await c.req.json();
  const { phone } = body;
  // Check for existing customer
  try {
    const customerExists = await Customer.findOne({
      phone,
    });
    if (customerExists) {
      c.status(400);
      throw new Error("Customer already exists");
    }
    const customer = await Customer.create({
      ...body,
    });
    if (!customer) {
      c.status(400);
      throw new Error("Invalid customer data");
    }
    return c.json({
      success: true,
      data: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        secondaryPhone: customer.secondaryPhone || "",
        role: customer.role,
        address: customer.address,
      },
      message: "Customer created successfully",
    });
  } catch (error: any) {
    console.error("Error creating customer:", error?.message || error);
    c.status(500);
    return c.json({
      success: false,
      message: error?.message,
      stack: process.env.NODE_ENV === "production" ? null : error?.stack,
    });
  }
};
/**
 * @api {put} /customers/:id Update Customer
 * @apiGroup Customer
 * @access Private
 */
export const updateCustomer = async (c: Context) => {
  const body = c.get("filteredBody");
  const { order, ...otherFields } = body;
  const id = c.req.param("id");
  try {
    const updatedUser = await Customer.findByIdAndUpdate(
      id,
      {
        $set: { ...otherFields }, // Update other fields
        $addToSet: { orders: order }, // Add to orders without duplicates
      },
      {
        new: true,
      }
    );
    if (!updatedUser) {
      c.status(400);
      throw new Error("Invalid user data");
    }
    return c.json({
      success: true,
      data: updatedUser,
      message: "User updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating user:", error?.message || error);
    c.status(500);
    return c.json({
      success: false,
      message: error?.message,
      stack: process.env.NODE_ENV === "production" ? null : error?.stack,
    });
  }
};
/**
 * @api {delete} /customers/:id Delete Customer
 * @apiGroup Customer
 * @access Private
 */
export const deleteCustomer = async (c: Context) => {
  const id = c.req.param("id");
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) {
      c.status(400);
      throw new Error("Invalid user data");
    }
    return c.json({
      success: true,
      data: deletedCustomer,
      message: "Customer deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting user:", error?.message || error);
    c.status(500);
    return c.json({
      success: false,
      message: error?.message,
      stack: process.env.NODE_ENV === "production" ? null : error?.stack,
    });
  }
};
