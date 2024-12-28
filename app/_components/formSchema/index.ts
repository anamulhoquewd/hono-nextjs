import { z } from "zod";

const baseSchema = z.object({
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

const userSchema = baseSchema.omit({
  secondaryPhone: true,
});

const userUpdateSchema = baseSchema.omit({
  secondaryPhone: true,
});

const customerSchema = baseSchema
  .omit({
    NID: true,
  })
  .extend({
    email: z
      .string()
      .email({
        message: "Please enter a valid email address.",
      })
      .optional(), // Make email optional
  });

const orderSchema = z.object({
  searchTerm: z.string().optional(),
  customer: z.string().min(1, "Customer is required"),
  quantity: z
    .string()
    .min(1, "Quantity is required")
    .transform((val) => parseInt(val, 10)) // Convert string to number
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Quantity must be a positive number",
    }),
  price: z
    .string()
    .min(1, "Price is required")
    .transform((val) => parseFloat(val)), // Convert string to number
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
  userUpdateSchema,
  orderSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
