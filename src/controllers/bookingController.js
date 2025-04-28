const Booking = require("../models/Booking");
const Vendor = require("../models/Vendor");
// Create a booking
// exports.createBooking = async (req, res) => {
//   try {
//     const { vendor, profession, serviceDate, address, notes } = req.body;
//     const userId = req.user.id; // From auth middleware

//     const newBooking = new Booking({
//       user: userId,
//       vendor,
//       profession,
//       serviceDate,
//       address,
//       notes,
//     });

//     await newBooking.save();
//     res.status(201).json({ message: "Booking created", booking: newBooking });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.createBooking = async (req, res) => {
  try {
    const { vendor, profession, serviceDate, address, notes } = req.body;
    const userId = req.user.id;

    const selectedDate = new Date(serviceDate);
    selectedDate.setHours(0, 0, 0, 0); // Normalize to 00:00

    const vendorDoc = await Vendor.findById(vendor);
    if (!vendorDoc) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const existingBooking = await Booking.findOne({
      vendor,
      serviceDate: {
        $gte: selectedDate,
        $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000), // same day
      },
      status: { $ne: "cancelled" },
    });

    if (existingBooking && !vendorDoc.canTakeMultipleBookings) {
      return res.status(400).json({
        message: "Vendor is already booked for the selected date.",
      });
    }

    const newBooking = new Booking({
      user: userId,
      vendor,
      profession,
      serviceDate,
      address,
      notes,
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking created", booking: newBooking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get bookings for a user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate(
      "vendor",
      "name profession"
    );
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get bookings for a vendor
exports.getVendorBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ vendor: req.user.id }).populate(
      "user",
      "name mobile"
    );
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Vendor Updates Booking Status
exports.updateBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;
    const vendorId = req.user.id; // from auth middleware
    const validStatuses = ["accepted", "rejected", "completed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking)
      return res.status(404).json({ message: "Booking not found." });
    if (booking.vendor.toString() !== vendorId)
      return res.status(403).json({ message: "Unauthorized access." });

    booking.status = status;
    await booking.save();

    res.json({ message: `Booking ${status} successfully`, booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ User Cancels Booking
exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId);

    if (!booking)
      return res.status(404).json({ message: "Booking not found." });
    if (booking.user.toString() !== userId)
      return res.status(403).json({ message: "Unauthorized access." });

    if (["completed", "rejected"].includes(booking.status)) {
      return res.status(400).json({ message: "Cannot cancel this booking." });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
