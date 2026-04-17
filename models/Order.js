import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      price: Number,
      color: String,
      size: String,
      qty: Number,
      image: String
    }
  ],
  total: Number,

  customer: {
    name: String,
    phone: String,
    city: String,
    address: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Order", orderSchema);