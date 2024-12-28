import * as mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (process.env.MONGO_URI !== undefined) {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        autoIndex: true,
      });
    }
  } catch (err: any) {
    process.exit(1);
  }
};

export default connectDB;
