const express = require("express");
const router = express.Router();
const { getAdminStats } = require("../controllers/adminController");
const adminProtect = require("../middleware/adminProtect");

// Future: You can protect this route with isAdmin middleware
router.get("/stats", adminProtect, getAdminStats);

module.exports = router;
