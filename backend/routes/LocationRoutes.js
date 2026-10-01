import express from "express";
import {
  createLocation,
  getAllLocations,
  getLocationsByZone,
  getSingleLocation,
  updateLocation,
  deleteLocation,
} from "../controller/LocationController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, authorize("admin"), createLocation);
router.get("/all", protect, getAllLocations);
router.get("/get-location-by-zone/:zone", protect, authorize("admin", "supervisor"), getLocationsByZone);
router.get("/single/:id", protect, getSingleLocation);
router.put("/update/:id", protect, authorize("admin"), updateLocation);
router.delete("/delete/:id", protect, authorize("admin"), deleteLocation);

export default router;