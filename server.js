import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import orderRoutes from "./routes/orderRoutes.js";
import subscribeRoutes from "./routes/subscribe.js";
import contactRoutes from "./routes/contact.js";
import userRoutes from "./routes/userRoutes.js";
dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://store-brosky.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.options("*", cors());
app.use(express.json());

// ✅ Routes
app.use("/api/orders", orderRoutes);
app.use("/api/subscribe", subscribeRoutes); // 🔥 هادي كانت ناقصة
app.use("/api/contact", contactRoutes);
app.use("/api/users", userRoutes);
// ✅ MongoDB Connection
app.get("/", (req, res) => {
  res.send("SERVER WORKING 🚀");
});
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected 🔥"))
  .catch(err => console.log("Mongo error:", err));

// ✅ Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});