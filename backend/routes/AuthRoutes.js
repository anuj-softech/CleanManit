import express from "express";
import { sendOtp, verifyOtp, logout, getMe } from "../controller/AuthController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-email-otp", verifyOtp);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;