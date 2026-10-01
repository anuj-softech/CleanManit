import express from "express";
import { createUser, getAllUsers, deleteUser } from "../controller/UserController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All user management routes require admin role
router.post("/create-user", protect, authorize("admin"), createUser);
router.get("/all-users", protect, authorize("admin"), getAllUsers);
router.delete("/delete-user/:id", protect, authorize("admin"), deleteUser);

export default router;
