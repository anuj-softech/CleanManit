import User from "../models/User.js";
import Location from "../models/Location.js";

export const assignZoneToSupervisor = async (req, res) => {
  try {

    const { supervisorId, zone } = req.body;

    const supervisor = await User.findById(supervisorId);

    if (!supervisor) {
      return res.status(404).json({
        message: "Supervisor not found",
      });
    }

    const locations = await Location.find({
      zone,
    });

    supervisor.zone = zone;



supervisor.zone = zone;
await supervisor.save();

    res.status(200).json({
      success: true,
      message: "Zone Assigned Successfully",
      locationsCount: locations.length,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};





export const getSupervisorLocations = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === "null" || id === "undefined" || id.length !== 24) {
      return res.status(200).json([]);
    }

    const supervisor = await User.findById(id);
    if (!supervisor || !supervisor.zone) {
      return res.status(200).json([]);
    }

    const locations = await Location.find({
      zone: { $regex: new RegExp(`^${supervisor.zone.trim()}$`, "i") },
    });

    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};