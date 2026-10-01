import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ============================================
// PROTECT ROUTE (VERIFY HTTP-ONLY COOKIE)
// ============================================
export const protect = async (req, res, next) => {
  try {
    // Read JWT directly from HTTP cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Please login to continue.",
      });
    }

    // Verify and decode JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify user exists in database
    const user = await User.findById(decoded.id).select("-otp -otpCreatedAt");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User session invalid. Account not found.",
      });
    }

    // Attach verified user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid. Please login again.",
    });
  }
};

// ============================================
// ROLE-BASED ACCESS CONTROL (RBAC)
// ============================================
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user?.role}' is not authorized.`,
      });
    }
    next();
  };
};
