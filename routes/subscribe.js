import express from "express";
import Subscriber from "../models/Subscriber.js";

const router = express.Router();


// 🔥 SUBSCRIBE
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    // ✅ VALIDATION
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // ✅ EMAIL FORMAT
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    // ✅ CHECK IF EXISTS (مهم بزاف)
    const existing = await Subscriber.findOne({ email });

    if (existing) {
      return res.status(400).json({ error: "Already subscribed" });
    }

    const newSub = new Subscriber({ email });
    await newSub.save();

    res.status(201).json({
      message: "Subscribed successfully",
      data: newSub,
    });

  } catch (err) {
    console.error("❌ SUBSCRIBE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// 🔥 GET ALL SUBSCRIBERS (Dashboard)
router.get("/", async (req, res) => {
  try {
    const subs = await Subscriber.find().sort({ createdAt: -1 });

    res.json(subs);

  } catch (err) {
    console.error("❌ FETCH SUBSCRIBERS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// 🔥 DELETE SUBSCRIBER (Dashboard later)
router.delete("/:id", async (req, res) => {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);

    res.json({ message: "Subscriber deleted" });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;