import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// 🔥 CREATE ORDER
router.post("/", async (req, res) => {
  try {
    const { items, total, customer } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items provided" });
    }

    if (!customer || !customer.name || !customer.phone || !customer.city) {
      return res.status(400).json({ error: "Missing customer info" });
    }

    const order = new Order({ items, total, customer });
    await order.save();

    res.status(201).json({
      message: "Order saved successfully",
      order,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔥 GET ALL ORDERS ✅ (خاصها تجي قبل)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("🔥 GET ORDERS ERROR:", err); // مهم
    res.status(500).json({ error: err.message }); // باش نشوفو المشكل
  }
});

// 🔥 STATS (خاصها تجي قبل :id)
router.get("/stats/chart", async (req, res) => {
  try {
    const orders = await Order.find();

    const data = {};

    orders.forEach((o) => {
      const date = new Date(o.createdAt).toLocaleDateString();

      if (!data[date]) data[date] = 0;
      data[date]++;
    });

    const chartData = Object.keys(data).map((date) => ({
      date,
      orders: data[date],
    }));

    res.json(chartData);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 GET SINGLE ORDER (خاصها تكون آخر حاجة)
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 🔥 DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;