import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// 🔥 CREATE USER
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "User created ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("EMAIL INPUT:", `"${email}"`);
    console.log("PASSWORD INPUT:", `"${password}"`);

    const user = await User.findOne({ email });

    console.log("USER FROM DB:", user);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("MATCH RESULT:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 🔐 JWT TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ RESPONSE
    res.json({
      message: "Login success ✅",
      token,
      user: {
        _id: user._id,
        email: user.email
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;