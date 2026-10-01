import express from "express";
import { assignZoneToSupervisor, getSupervisorLocations } from "../controller/SupervisorController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/assign-zone", protect, authorize("admin"), assignZoneToSupervisor);
router.get("/getsupervisor-location/:id", protect, authorize("admin", "supervisor"), getSupervisorLocations);

export default router;