// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// ====== MIDDLEWARE ======
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // React dev server
    credentials: true,
  })
);

// ====== DB CONNECTION ======
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ====== MODELS ======
const userSchema = new mongoose.Schema(
  {
    emailOrPhone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

const problemSchema = new mongoose.Schema(
  {
    problemType: { type: String, required: true },
    description: { type: String, required: true },
    photo: { type: String },
    location: { type: String },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Problem = mongoose.model("Problem", problemSchema);

// ====== AUTH ROUTES ======

// POST /api/auth/signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res
        .status(400)
        .json({ message: "Email/phone and password are required" });
    }

    const existing = await User.findOne({ emailOrPhone });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ emailOrPhone, passwordHash });

    return res.status(201).json({
      message: "Signup successful",
      userId: user._id,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    const user = await User.findOne({ emailOrPhone });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, emailOrPhone: user.emailOrPhone },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      userId: user._id,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ====== PROBLEM REPORT ROUTE ======

// POST /api/report-problem
app.post("/api/report-problem", async (req, res) => {
  try {
    const { problemType, description, photo, location, userId } = req.body;

    if (!problemType || !description) {
      return res
        .status(400)
        .json({ message: "Problem type and description are required" });
    }

    const problem = await Problem.create({
      problemType,
      description,
      photo: photo || null,
      location: location || "",
      reportedBy: userId || null,
    });

    return res
      .status(201)
      .json({ message: "Problem submitted successfully", problem });
  } catch (err) {
    console.error("Report problem error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ====== TEST ROUTE ======
app.get("/", (req, res) => {
  res.send("Waterwise backend is running ✅");
});

// ====== START SERVER ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
