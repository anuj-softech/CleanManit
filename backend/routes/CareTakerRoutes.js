import express from "express";
import {
  assignHostelToCaretaker,
  getCaretakerRequests,
  getAllCaretakers,
  updateCaretakerHostel,
  getCaretakerHostel,
  createCaretakerRequest,
} from "../controller/CareTakerController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/caretaker-assign-hostel", protect, authorize("admin", "supervisor"), assignHostelToCaretaker);
router.get("/caretaker-req/:caretakerId", protect, getCaretakerRequests);
router.get("/all-caretakers", protect, authorize("admin", "supervisor"), getAllCaretakers);
router.put("/caretaker-update-hostel", protect, authorize("admin", "supervisor"), updateCaretakerHostel);
router.get("/caretaker-hostel/:caretakerId", protect, getCaretakerHostel);
router.post("/create-caretaker-request", protect, authorize("caretaker", "admin", "supervisor"), createCaretakerRequest);

export default router;