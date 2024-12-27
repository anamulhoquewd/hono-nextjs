import { Document, Schema, model, models } from "mongoose";

interface IOrder extends Document {
  customer: Schema.Types.ObjectId;
  quantity: number;
  price: number;
  date: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = models.Order || model("Order", orderSchema);
export default Order;
