import Donation from "../models/Donation.js";
import Donor from "../models/Donor.js";

export const addDonation = async (req, res) => {
  try {
    const { donorId, amount } = req.body;
    const donor = await Donor.findById(donorId);
    if (!donor) return res.status(404).json({ error: "Donor not found" });

    const donation = new Donation({ donor: donor._id, amount });
    await donation.save();

    // Simulate email
    console.log(`--- SIMULATED EMAIL ---\nTo: ${donor.email}\nThanks for your donation of ₹${amount}!\n----------------------`);

    res.status(201).json(donation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().populate("donor");
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
