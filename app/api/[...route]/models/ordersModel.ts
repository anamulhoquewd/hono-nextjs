import { Document, Schema, model, models } from "mongoose";

interface IOrder extends Document {
  customer: Schema.Types.ObjectId;
  quantity: number;
  price: number;
  total: number;
  date: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
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

// Pre-save middleware to calculate total before saving
orderSchema.pre("save", function (next) {
  this.total = this.quantity * this.price;
  next();
});

orderSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as {
    quantity?: number;
    price?: number;
    total?: number;
  };

  if (update?.quantity !== undefined || update?.price !== undefined) {
    this.model
      .findOne(this.getQuery())
      .then((doc: IOrder) => {
        const quantity = update.quantity ?? doc.quantity;
        const price = update.price ?? doc.price;

        update.total = quantity * price;
        next();
      })
      .catch(next);
  } else {
    next();
  }
});

const Order = models.Order || model("Order", orderSchema);
export default Order;
