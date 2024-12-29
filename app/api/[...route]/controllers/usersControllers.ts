import type { Context } from "hono";
import { User } from "@/app/api/[...route]/models";
import { stringGenerator } from "@/utils";
import {
  deleteFromCloudinary,
  uploadFileToCloudinary,
} from "@/app/api/[...route]/config/cloudinary/cloudinaryConfig";
import nodemailer from "nodemailer";
import EmailTemplate from "./../emailComponents/userDetails";
import PasswordResetEmail from "@/app/api/[...route]/emailComponents/reset";
import { render } from "@react-email/components";
import * as React from "react";
import crypto from "crypto";
import { setSignedCookie, deleteCookie } from "hono/cookie";
import { sign } from "hono/jwt";


/**
 * @api {get} /users Get All Users
 * @apiGroup Users
 * @access Private
 */
export const getUsers = async (c: Context) => {
  // Get all users
  try {
    const users = await User.find().select("-password");

    return c.json({
      success: true,
      data: users,
      message: "Users fetched successfully",
    });
  } catch (error: any) {
    c.status(500);
    return c.json({
      success: false,
      message: error?.message,
      stack: process.env.NODE_ENV === "production" ? null : error?.stack,
    });
  }
};

/**
 * @api {get} /users/:id Get Single User
 * @apiGroup Users
 * @access Private
 */
export const getSingleUser = async (c: Context) => {
  const id = c.req.param("id");

  // Get single user
  try {
    const user = await User.findById(id).select("-password");

    return c.json({
      success: true,
      data: user,
      message: "User fetched successfully",
    });
  } catch (error: any) {
    c.status(500);
    return c.json({
      success: false,
      message: error?.message,
      stack: process.env.NODE_ENV === "production" ? null : error?.stack,
    });
  }
};

/**
 * @api {get} /users/profile Get User Profile
 * @apiGroup Users
 * @access Private
 */
export const getProfile = async (c: Context) => {
  // Get single user
  try {
    const user = c.get("user");

    if (!user) {
      c.status(401);
      throw new Error("Authentication failed");
    }
    return c.json({
      success: true,
      data: user,
      message: "User profile fetched successfully",
    });
  } catch (error: any) {
    c.status(500);
    return c.json({
      success: false,
      message: error?.message,
      stack: process.env.NODE_ENV === "production" ? null : error?.stack,
    });
  }
};

/**
 * @api {post} /users/register Create User
 * @apiGroup Users
 * @access Public
 */
export const createUser = async (c: Context) => {
  const { name, email, phone, role, NID, address } = await c.req.json();

  // Check for existing user
  try {
    const userExists = await User.findOne({ email }).select("email");
    if (userExists) {
      c.status(400);
      throw new Error("User already exists");
    }

    const generatePassword = stringGenerator(8); // Generate a random password
    if (!generatePassword) {
      throw new Error("Failed to generate password");
    }

    const user = await User.create({
      name,
      email,
      password: generatePassword,
      phone,
      role,
      address,
      NID,
    });

    if (!user) {
      c.status(400);
      throw new Error("Invalid user data");
    }

    const emailHtml = await render(
      React.createElement(EmailTemplate, {
        name,
        email,
        password: generatePassword,
      })
    );

    const transporter = nodemailer.createTransport({
      service: "gmail", // or your email provider
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Account Details",
      // text: `Hello ${name},\n\nYour account has been created successfully. Here are your login details:\n\nEmail: ${email}\nPassword: ${generatePassword}\n\nPlease log in and change your password immediately for security.\n\nThank you!`,
      html: emailHtml,
    };

    const info = await transporter.sendMail(mailOptions);

    c.status(201);
    return c.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        NID: user.NID,
      },
      message: "User created successfully",
    });
  } catch (error: any) {
    c.status(500);
    return c.json({
      success: false,
      message: error?.message,
      stack: process.env.NODE_ENV === "production" ? null : error?.stack,
    });
  }
};

/**
 * @api {post} /users/login Login User
 * @apiGroup Users
 * @access Public
 */
export const loginUser = async (c: Context) => {
  const { email, password } = await c.req.json();

  // Validate input
  if (!email || !password) {
    c.status(400);
    throw new Error("Please provide an email and password");
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      c.status(401);
      throw new Error("No user found with this email");
    }

    // Validate password
    if (!(await user.matchPassword(password))) {
      c.status(401);
      throw new Error("Invalid credentials");
    }

    // create payload for access token
    const accessTokenPayload = {
      id: user._id,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 1 month
    };

    // create access token
    const token = await sign(
      accessTokenPayload,
      process.env.ACCESS_TOKEN_SECRET || "token_wd"
    );

    // create http only cookie containing the access token
    // TODO: set domain to environment variable
    await setSignedCookie(
      c,
      "auth_token",
      token,
      process.env.COOKIE_SECRET || "cookie_wd",
      {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        // Remove or set to your specific subdomain
        domain:
          process.env.NODE_ENV === "production"
            ? "jolchowki.vercel.app"
            : undefined,
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
      }
    );

    return c.json({
      success: true,
      message: "User logged in successfully",
    });
  } catch (error: any) {
    c.status(500);
    return c.json({
      success: false,
      message: error?.message,
      stack: process.env.NODE_ENV === "production" ? null : error?.stack,
    });
  }
};

/**
 * @api {post} /users/logout Logout User
 * @apiGroup Users
 * @access Public
 */
export const logoutUser = async (c: Context) => {
  try {
    // Clear cookie using Hono's deleteCookie
    deleteCookie(c, "auth_token", {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      domain:
        process.env.NODE_ENV === "production"
          ? "hono-nextjs-tau-ebon.vercel.app"
          : undefined,
    });

    return c.json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error: any) {
    c.status(500);
    return c.json({
      success: false,
      message: error?.message,
      stack: process.env.NODE_ENV === "production" ? null : error?.stack,
    });
  }
};

/**
 * @api {put} /users Update User
 * @apiGroup Users
 * @access Private
 */
export const updateUser = async (c: Context) => {
  // filteredBody is a middleware. He is checking that some fields the user can update and some fields cannot be updated.
  const body = c.get("filteredBody");
  try {
    const user = c.get("user");

    if (!user) {
      c.status(401);
      throw new Error("Authentication failed");
    }

    const id = user._id;

    const updatedUser = await User.findByIdAndUpdate(id, body, {
      new: true,
    }).select("-password");

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
    c.status(500);
    return c.json({
      success: false,
      message: error?.message,
      stack: process.env.NODE_ENV === "production" ? null : error?.stack,
    });
  }
};

/**
 * @api {delete} /users/:id Delete User
 * @apiGroup Users
 * @access Private
 */
export const deleteUser = async (c: Context) => {
  const id = c.req.param("id");

  try {
    const deletedUser = await User.findByIdAndDelete(id).select("-password");

    if (!deletedUser) {
      c.status(400);
      throw new Error("Invalid user data");
    }

    deleteFromCloudinary(deletedUser._id as string); // Delete avatar from cloudinary. id as publicId
    return c.json({
      success: true,
      data: null,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    c.status(500);
    return c.json({
      success: false,
      message: error?.message,
      stack: process.env.NODE_ENV === "production" ? null : error?.stack,
    });
  }
};

/**
 * @api {put} /users/change-password Change Password
 * @apiGroup Users
 * @access Public
 */
export const changePassword = async (c: Context) => {
  const { prevPassword, newPassword } = await c.req.json();

  if (!prevPassword || !newPassword) {
    c.status(400);
    throw new Error("Please provide old and new password");
  }
  const user = c.get("user");

  // Check for existing user
  try {
    if (!user) {
      c.status(401);
      throw new Error("Authentication failed");
    }

    if (!(await user.matchPassword(prevPassword))) {
      c.status(401);
      throw new Error("Invalid credentials");
    } else {
      user.password = newPassword;
      await user.save();
    }

    return c.json({
      success: true,
      data: null,
      message: "Password changed successfully",
    });
  } catch (error: any) {
    c.status(500);
    return c.json({
      success: false,
      message: error?.message,
      stack: process.env.NODE_ENV === "production" ? null : error?.stack,
    });
  }
};

/**
 * @api {post} /users/upload Upload User Avatar
 * @apiGroup Users
 * @access Private
 */
export const uploadAvatar = async (c: Context) => {
  const user = c.get("user");

  try {
    const body = await c.req.formData();
    const file = body.get("file");

    if (!file) {
      c.status(400);
      throw new Error("Please provide a file");
    }

    const uploadedFile: any = await uploadFileToCloudinary(
      file,
      user._id.toString()
    );

    if (!uploadedFile) {
      c.status(500);
      throw new Error("File upload failed");
    }

    return c.json({
      success: true,
      message: "File uploaded successfully",
      url: uploadedFile.secure_url,
    });
  } catch (error: any) {
    c.status(500);
    return c.json({
      success: false,
      message: error?.message,
      stack: process.env.NODE_ENV === "production" ? null : error?.stack,
    });
  }
};

/**
 * @api {post} /users/forgot-password Forgot Password
 * @apiGroup Users
 * @access Public
 * @description Send email with reset link to user email
 */
export const forgotPassword = async (c: Context) => {
  const { email } = await c.req.json();

  try {
    // Find the user by email
    const user = await User.findOne({ email }).select("email name");
    if (!user) {
      c.status(404);
      throw new Error("User not found");
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save();

    // Create reset URL
    const resetUrl = `https://hono-nextjs-tau-ebon.vercel.app/auth/reset-password/${resetToken}`;

    // Create the email content
    const emailHtml = await render(
      React.createElement(PasswordResetEmail, {
        username: user.name,
        resetLink: resetUrl,
      })
    );

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: emailHtml,
    };

    const info = await transporter.sendMail(mailOptions);

    c.status(200);
    return c.json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error: any) {
    c.status(500);
    return c.json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @api {post} /users/reset-password/:token Reset Password
 * @apiGroup Users
 * @access Public
 * @description Reset user password with token and new password
 */
export const resetPassword = async (c: Context) => {
  const token = c.req.param("token");
  const { password } = await c.req.json();

  try {
    // Hash the token and search for user with valid token and expiration
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // Token must not be expired
    });

    if (!user) {
      c.status(400);
      throw new Error("Invalid or expired token");
    }

    user.password = password;

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    c.status(200);
    return c.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error: any) {
    c.status(500);
    return c.json({
      success: false,
      message: error.message,
    });
  }
};
