import mongoose from "mongoose";

const donorSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  password: String,
  isAnonymous: Boolean,
  totalDonated: { type: Number, default: 0 },
  registrationDate: { type: Date, default: Date.now }
});

export default mongoose.model("Donor", donorSchema);
