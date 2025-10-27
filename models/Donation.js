import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  donorEmail: String,
  donorName: String,
  foundation: String,
  amount: Number,
  date: Date
});

export default mongoose.model("Donation", donationSchema);
