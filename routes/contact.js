import express from "express";
import Message from "../models/Message.js";

const router = express.Router();


// 🔥 SEND MESSAGE
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // ✅ VALIDATION
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // ✅ EMAIL FORMAT (basic)
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const newMessage = new Message({
      name,
      email,
      message,
    });

    await newMessage.save();

    res.status(201).json({
      message: "Message saved successfully",
      data: newMessage,
    });

  } catch (err) {
    console.error("❌ MESSAGE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// 🔥 GET ALL MESSAGES (Dashboard)
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });

    res.json(messages);

  } catch (err) {
    console.error("❌ FETCH MESSAGES ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// 🔥 DELETE MESSAGE (Dashboard later)
router.delete("/:id", async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);

    res.json({ message: "Message deleted" });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;