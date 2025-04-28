const Vendor = require("../models/Vendor");

// Get nearby vendors within 8km
exports.getNearbyVendors = async (req, res) => {
  try {
    const { lat, lng, profession } = req.query;

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required." });
    }

    const radiusInMeters = 8000; // 8km

    const filters = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: radiusInMeters,
        },
      },
      isAvailable: true,
    };

    if (profession) {
      filters.profession = { $in: [profession] };
    }

    const vendors = await Vendor.find(filters).select("-password");

    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadVendorDocs = async (req, res) => {
  console.log("Upload Vendor Docs triggered");
  console.log("Request Files:", req.files);
  console.log("Request User:", req.user);
  console.log("Request Body:", req.body);

  try {
    console.log("User:", req.user);
    console.log("Files:", req.files);

    const vendorId = req.user.id;
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    if (req.files.profileImage) {
      vendor.profileImage = req.files.profileImage[0].path;
    }

    if (req.files.documents) {
      vendor.documents = req.files.documents.map((file) => file.path);
    }

    await vendor.save();

    res.status(200).json({ message: "Documents uploaded", vendor });
  } catch (err) {
    console.error("Upload Vendor Docs Error:", JSON.stringify(err, null, 2));
    res.status(500).json({
      message: err.message || "Server error",
      error: err,
    });
  }
};

exports.toggleMultiBookingSetting = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { canTakeMultipleBookings } = req.body;

    const vendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { canTakeMultipleBookings },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json({
      message: "Booking preference updated",
      canTakeMultipleBookings: vendor.canTakeMultipleBookings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
