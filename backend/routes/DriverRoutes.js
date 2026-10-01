import express from "express";
import {
  getTodayScheduledRequests,
  markAsArrived,
  markAsCompleted,
  getCompletedTasks,
} from "../controller/DriverController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/today-task", protect, authorize("driver", "admin", "supervisor"), getTodayScheduledRequests);
router.put("/arrived/:id", protect, authorize("driver", "admin", "supervisor"), markAsArrived);
router.put("/completed/:id", protect, authorize("driver", "admin", "supervisor"), markAsCompleted);
router.get("/completed", protect, authorize("driver", "admin", "supervisor"), getCompletedTasks);

export default router;