import express from "express";
import { addDonor, getDonors } from "../controllers/donorController.js";

const router = express.Router();

router.post("/", addDonor);
router.get("/", getDonors);

export default router;
