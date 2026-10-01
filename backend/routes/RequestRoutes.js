import express from "express";
import {
  createEmergencyRequest,
  getAllEmgReq,
  updateScheduleOrder,
  getMyEmergencyRequests,
  getZoneCaretakerRequests,
} from "../controller/RequestController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createEmergencyRequest);
router.get("/getAllEmgReq", protect, authorize("admin"), getAllEmgReq);
router.put("/schedule-req/:id", protect, authorize("admin", "supervisor"), updateScheduleOrder);
router.get("/my-requests/:supervisorId", protect, authorize("admin", "supervisor"), getMyEmergencyRequests);
router.get("/zone-caretaker-requests/:supervisorId", protect, authorize("admin", "supervisor"), getZoneCaretakerRequests);

export default router;