import mongoose from "mongoose";
console.log("✅ Product model file loaded");
const productSchema = new mongoose.Schema(
  {
    name: String,
    shortName: String,
    price: Number,
    oldPrice: Number,
    category: String,
    description: String,
    images: Object,
    sizes: [String],
    stock: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);