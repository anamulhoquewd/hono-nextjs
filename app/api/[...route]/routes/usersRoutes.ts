import { Hono } from "hono";
import { user } from "./../controllers";
import { isAdmin, isAdminOrManager, protect } from "./../middlewares";
import { protectFields } from "@/utils/protectFields";
// import rateLimit from "hono-rate-limit";
const users = new Hono();

// Login User
users.post("/login", (c) => user.loginUser(c));

// Get All Users
users.get("/", protect, isAdminOrManager, (c) => user.getUsers(c));

// Create User
users.post("/register", (c) => user.createUser(c));

// Logout User
users.post("/logout", protect, (c) => user.logoutUser(c));

// Get User Profile
users.get("/profile", protect, (c) => user.getProfile(c));

// Change Password
users.patch("/change-password", protect, (c) => user.changePassword(c));

// upload avatar
users.post("/upload-avatar", protect, (c) => user.uploadAvatar(c));

// forgot password
users.post("/forgot-password", (c) => user.forgotPassword(c));

// reset password
users.post("/reset-password/:token", (c) => user.resetPassword(c));

// Update User
users.put("/", protect, protectFields(["role", "NID"]), (c) =>
  user.updateUser(c)
);

// Get Single User
users.get("/:id", protect, isAdmin, (c) => user.getSingleUser(c));

// Delete User
users.delete("/:id", protect, isAdmin, (c) => user.deleteUser(c));

export default users;
