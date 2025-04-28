const express = require("express");
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getVendorBookings,
  updateBookingStatus,
  cancelBooking,
} = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");
const protect = require("../middleware/authMiddleware");

// Auth protected
router.post("/", authMiddleware, createBooking);
router.get("/user", authMiddleware, getUserBookings);
router.get("/vendor", authMiddleware, getVendorBookings);

router.put("/:id/status", protect, updateBookingStatus); // vendor
router.put("/:id/cancel", protect, cancelBooking); // user

module.exports = router;
