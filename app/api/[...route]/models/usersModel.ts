import { Document, Schema, model, models } from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";

interface IUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "admin" | "manager" | "delivery_man";
  NID: string;
  address: string;
  avatar?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
}

interface IUserDoc extends IUser, Document {
  matchPassword: (pass: string) => Promise<boolean>;
  getResetPasswordToken: () => string; // Add the method here
}

const ROLE_ENUM = ["admin", "manager", "delivery_man"];

const userSchema = new Schema<IUserDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    NID: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ROLE_ENUM,
      required: true,
    },
    address: { type: String, required: true },
    avatar: { type: String, required: false },
    resetPasswordToken: String, // Reset token
    resetPasswordExpire: Date, // Token expiry time
  },
  {
    timestamps: true,
  }
);

// Method to generate and hash reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash the token and save it in the database
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set token expiration (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Hash password with Bun
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  if (!this.password) {
    throw new Error("Password is missing");
  }

  // Use bcrypt to hash the password
  const salt = await bcrypt.genSalt(10); // Adjust salt rounds as needed
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Add a validation to check if the number of admins exceeds the limit before saving a new user
userSchema.pre("save", async function (next) {
  if (this.isNew && this.role === "admin") {
    const maxAdmins = 2; // Set the maximum number of admins allowed

    const existingAdminsCount = await User.countDocuments({ role: "admin" });
    if (existingAdminsCount >= maxAdmins) {
      throw new Error(`Only ${maxAdmins} admins are allowed.`);
    }
  }
  next();
});

const User = models.User || model("User", userSchema);

export default User;
