import express from "express";
import { addDonation, getDonations } from "../controllers/donationController.js";

const router = express.Router();

router.post("/", addDonation);
router.get("/", getDonations);

export default router;
