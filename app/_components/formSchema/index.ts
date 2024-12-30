import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().regex(/^(\d{11})$/, {
    message: "Phone number must be 11 digits.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  NID: z.string().regex(/^(?:\d{10}|\d{17})$/, {
    message: "NID must be either 10 or 17 digits.",
  }),
  role: z.enum(["manager", "delivery_man", "admin", "customer"], {
    required_error: "Please select a role.",
  }),
  address: z.string().min(2, {
    message: "Address must be at least 2 characters.",
  }),
  avatar: z.string().optional(),
});

const customerSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().regex(/^(\d{11})$/, {
    message: "Phone number must be 11 digits.",
  }),
  secondaryPhone: z
    .string()
    .regex(/^(\d{11})$/, {
      message: "Phone number must be 11 digits.",
    })
    .optional()
    .or(z.literal("")),
  role: z.enum(["manager", "delivery_man", "admin", "customer"], {
    required_error: "Please select a role.",
  }),
  address: z.string().min(2, {
    message: "Address must be at least 2 characters.",
  }),
  defaultPrice: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === "string") {
        const num = parseInt(val, 10);
        if (isNaN(num)) throw new Error("Price must be a valid number");
        return num;
      }
      return val;
    })
    .refine((val) => val > 0, {
      message: "Price must be a positive number",
    }),

  defaultQuantity: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === "string") {
        const num = parseInt(val, 10);
        if (isNaN(num)) throw new Error("Quantity must be a valid number");
        return num;
      }
      return val;
    })
    .refine((val) => val >= 0, {
      message: "Quantity must be a positive number",
    })
    .optional(),
});

const orderSchema = z.object({
  searchTerm: z.string().optional(),
  customer: z.string().min(1, "Customer is required"),
  quantity: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === "string") {
        const num = parseInt(val, 10);
        if (isNaN(num)) throw new Error("Quantity must be a valid number");
        return num;
      }
      return val;
    })
    .refine((val) => val >= 0, {
      message: "Quantity must be a positive number",
    })
    .optional(),
});

const changePassSchema = z
  .object({
    prevPassword: z.string().min(8, "Password must be at least 8 characters."),
    newPassword: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "New password and confirm password must match",
  });

const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, {
      message: "Password must be at least 8 characters long",
    }),

    token: z.string(),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "New password and confirm password must match",
  });

export {
  userSchema,
  changePassSchema,
  customerSchema,
  orderSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
