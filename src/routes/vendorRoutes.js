const express = require("express");
const router = express.Router();
const {
  getNearbyVendors,
  uploadVendorDocs,
  toggleMultiBookingSetting,
} = require("../controllers/vendorController");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");

// Public route to search vendors
router.get("/search", getNearbyVendors);

router.post(
  "/upload-docs",
  protect,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "documents", maxCount: 3 },
  ]),
  uploadVendorDocs
);

router.put("/toggle-multibookings", protect, toggleMultiBookingSetting);

module.exports = router;
