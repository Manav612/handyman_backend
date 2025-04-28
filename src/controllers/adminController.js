const Booking = require("../models/Booking");
const User = require("../models/User");
const Vendor = require("../models/Vendor");

exports.getAdminStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: "pending" });
    const acceptedBookings = await Booking.countDocuments({
      status: "accepted",
    });
    const rejectedBookings = await Booking.countDocuments({
      status: "rejected",
    });

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const bookingsThisMonth = await Booking.countDocuments({
      serviceDate: { $gte: startOfMonth },
    });

    const topProfessions = await Booking.aggregate([
      { $group: { _id: "$profession", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const totalVendors = await Vendor.countDocuments();
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      totalBookings,
      pendingBookings,
      acceptedBookings,
      rejectedBookings,
      bookingsThisMonth,
      topProfessions,
      totalVendors,
      totalUsers,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching stats", error: err.message });
  }
};
