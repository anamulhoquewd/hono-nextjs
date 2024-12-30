import { Document, Schema, model, models } from "mongoose";

interface ICustomer extends Document {
  name: string;
  phone: string;
  secondaryPhone?: string;
  role: "customer";
  address: string;
  defaultPrice: number;
  defaultQuantity: number;
  orders: Schema.Types.ObjectId[];
}

const customerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    secondaryPhone: { type: String, required: false },
    role: { type: String, required: true, default: "customer" },
    address: { type: String, required: true },
    defaultPrice: { type: Number, required: true },
    defaultQuantity: { type: Number, required: true },
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  },
  {
    timestamps: true,
  }
);

const Customer = models.Customer || model("Customer", customerSchema);
export default Customer;
