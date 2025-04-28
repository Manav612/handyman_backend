// routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  addReview,
  getVendorReviews,
} = require("../controllers/reviewController");

router.post("/:vendorId", protect, addReview);
router.get("/:vendorId", getVendorReviews);

module.exports = router;
