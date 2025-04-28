const express = require("express");
const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/vendors", require("./vendorRoutes"));
router.use("/bookings", require("./bookingRoutes"));
router.use("/reviews", require("./reviewRoutes"));
router.use("/admin", require("./adminRoutes"));
router.use("/admin/auth", require("./adminAuthRoutes"));
router.get("/", (req, res) => {
  res.json({ message: "API base route active ✅" });
});

module.exports = router;
