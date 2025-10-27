import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ----------------------
// MongoDB Connection
// ----------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB ✅"))
  .catch((err) => console.error("MongoDB Error:", err));

// ----------------------
// Nodemailer Setup
// ----------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

// ----------------------
// Mongoose Schemas
// ----------------------
const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
});

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "Donor", required: true },
  amount: { type: Number, required: true },
  message: { type: String },
  date: { type: Date, default: Date.now },
});

const Donor = mongoose.model("Donor", donorSchema);
const Donation = mongoose.model("Donation", donationSchema);

// ----------------------
// API Routes (with /api prefix)
// ----------------------

// Test API root
app.get("/api", (req, res) => {
  res.send("Donarium API is running!");
});

// Add a donor
app.post("/api/donors", async (req, res) => {
  try {
    const donor = new Donor(req.body);
    await donor.save();
    res.status(201).json(donor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all donors
app.get("/api/donors", async (req, res) => {
  try {
    const donors = await Donor.find();
    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a donation
app.post("/api/donations", async (req, res) => {
  try {
    const { donorId, amount, message } = req.body;

    // Validate donor exists
    const donor = await Donor.findById(donorId);
    if (!donor) return res.status(404).json({ error: "Donor not found" });

    const donation = new Donation({ donor: donor._id, amount, message });
    await donation.save();

    // Send confirmation email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: donor.email,
      subject: "Donation Confirmation",
      text: `Hello ${donor.name},\n\nThank you for your donation of ₹${amount}.\nMessage: ${message || "N/A"}\n\n- Donarium Team`,
    });

    res.status(201).json(donation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get all donations
app.get("/api/donations", async (req, res) => {
  try {
    const donations = await Donation.find().populate("donor");
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// Serve frontend files
// ----------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ----------------------
// Start Server
// ----------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
